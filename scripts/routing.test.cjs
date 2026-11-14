const {test} = require('node:test');
const assert = require('node:assert/strict');
const vm = require('node:vm');
const redirects = require('../config/redirects.json');
const {buildFunction} = require('./build-cloudfront-function.cjs');

function route(uri, querystring = {}, method = 'GET') {
  const sandbox = {};
  vm.runInNewContext(buildFunction(), sandbox);
  return sandbox.handler({request: {uri, method, querystring}});
}

test('legacy routes go directly to canonical destinations, including encoded spaces', () => {
  for (const [from, to] of Object.entries(redirects)) {
    assert.ok(!redirects[to], `Redirect chain from ${from}`);
    assert.equal(route(from).headers.location.value, to);
  }
});

test('redirects preserve repeated and encoded query parameters', () => {
  const result = route('/docs/platform/api_security', {
    q: {value: 'a%20b'}, tag: {value: 'first', multiValue: [{value: 'first'}, {value: 'second'}]},
  });
  assert.equal(result.headers.location.value, '/docs/platform/security?q=a%20b&tag=first&tag=second');
  assert.equal(result.statusCode, 301);
});

test('dotted release paths and encoded paths resolve to index.html', () => {
  assert.equal(route('/docs/changelog/v1.19.2').uri, '/docs/changelog/v1.19.2/index.html');
  assert.equal(route('/docs/overview/').uri, '/docs/overview/index.html');
  assert.equal(route('/assets/js/main.123.js').uri, '/assets/js/main.123.js');
  assert.equal(route('/marketplace/config.json').uri, '/marketplace/config.json');
});

test('hosting function fits the CloudFront size limit', () => {
  assert.ok(Buffer.byteLength(buildFunction()) <= 10240);
});
