const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const redirects = require('../config/redirects.json');

function walk(directory) {
  return fs.readdirSync(directory, {withFileTypes: true}).flatMap(entry => {
    const file = path.join(directory, entry.name);
    return entry.isDirectory() ? walk(file) : [file];
  });
}

const sitemap = fs.readFileSync('build/sitemap.xml', 'utf8');
const urls = [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map(match => match[1]);
assert.equal(new Set(urls).size, urls.length, 'Duplicate sitemap URLs');
assert.ok(!urls.some(url => /\/blog(?:\/|$)/.test(url)), 'Unused blog in sitemap');
assert.ok(!urls.includes('https://docs.formkiq.com/'), 'Non-canonical homepage in sitemap');
assert.ok(!fs.existsSync('build/blog/index.html'), 'Unused blog still built');

for (const [from, to] of Object.entries(redirects)) {
  assert.ok(!urls.includes(`https://docs.formkiq.com${from}`), `Redirect in sitemap: ${from}`);
  const html = fs.readFileSync(path.join('build', decodeURI(from), 'index.html'), 'utf8');
  assert.match(html, /name="robots" content="noindex,follow"/);
  assert.ok(html.includes(`rel="canonical" href="https://docs.formkiq.com${to}"`));
  assert.match(html, /http-equiv="refresh"/);
  assert.ok(fs.existsSync(path.join('build', to, 'index.html')), `Missing redirect target ${to}`);
}

let count = 0;
for (const file of walk('docs').filter(file => /\.mdx?$/.test(file) && !file.includes('/api-reference/'))) {
  const text = fs.readFileSync(file, 'utf8');
  const front = text.match(/^---\n([\s\S]*?)\n---/);
  assert.ok(front && /^description:\s*\S.+$/m.test(front[1]), `Missing description: ${file}`);
  const slug = front[1].match(/^slug:\s*['"]?([^'"\n]+)['"]?$/m);
  const route = '/docs' + (slug ? slug[1].trim() : '/' + file.replace(/^docs\//, '').replace(/\.mdx?$/, ''));
  const html = fs.readFileSync(path.join('build', route, 'index.html'), 'utf8');
  assert.match(html, /name="description" content="[^"]{40,}"/, `Weak built description: ${route}`);
  count++;
}
const privateRepos = new Set([
  'formkiq-document-console-source', 'formkiq-platform', 'formkiq-module-ocr',
  'formkiq-module-tagschema', 'formkiq-module-antivirus', 'formkiq-module-fulltext',
  'formkiq-module-intelligent-data-classification', 'formkiq-module-document-generation',
  'formkiq-module-opa', 'formkiq-module-filesync-cli',
]);
for (const file of walk('docs/changelog').filter(file => file.endsWith('.md'))) {
  const text = fs.readFileSync(file, 'utf8');
  for (const match of text.matchAll(/https:\/\/github\.com\/formkiq\/([^/\s)]+)/g)) {
    assert.ok(!privateRepos.has(match[1]), `Private/unavailable changelog link: ${file}`);
  }
}
assert.ok(fs.existsSync('build/robots.txt'));
assert.ok(fs.existsSync('build/llms.txt'));
console.log(`Checked ${count} descriptions, ${urls.length} unique sitemap URLs, and ${Object.keys(redirects).length} redirects.`);
