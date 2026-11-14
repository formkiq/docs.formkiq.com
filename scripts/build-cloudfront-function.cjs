const fs = require('node:fs');
const redirects = require('../config/redirects.json');

// Produces a standalone viewer-request function; activation is a hosting change.
function buildFunction() {
  return `var redirects=${JSON.stringify(redirects)};
function handler(event) {
  var request = event.request;
  var path = request.uri.replace(/\\/$/, '') || '/';
  var target = redirects[path];
  if (target && (request.method === 'GET' || request.method === 'HEAD')) {
    var pairs = [];
    Object.keys(request.querystring || {}).forEach(function(key) {
      var parameter = request.querystring[key];
      (parameter.multiValue || [parameter]).forEach(function(item) {
        pairs.push(key + '=' + item.value);
      });
    });
    return {statusCode: 301, statusDescription: 'Moved Permanently', headers: {
      location: {value: target + (pairs.length ? '?' + pairs.join('&') : '')},
      'cache-control': {value: 'public,max-age=3600'}
    }};
  }
  if (request.uri.endsWith('/')) request.uri += 'index.html';
  else if (!/\\.(?:html|css|js|mjs|json|txt|xml|png|jpe?g|webp|svg|ico|map|zip|ya?ml|pdf|woff2?|ttf)$/i.test(request.uri))
    request.uri += '/index.html';
  return request;
}
`;
}

if (require.main === module) {
  const source = buildFunction();
  if (Buffer.byteLength(source) > 10240) throw new Error('Function exceeds the CloudFront 10 KB limit');
  fs.mkdirSync('build-hosting', {recursive: true});
  fs.writeFileSync('build-hosting/viewer-request.js', source);
  console.log('Wrote build-hosting/viewer-request.js; CloudFront activation is separate.');
}

module.exports = {buildFunction};
