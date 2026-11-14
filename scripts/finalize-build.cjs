const fs = require('node:fs');
const path = require('node:path');
const redirects = require('../config/redirects.json');

// The maintained redirect plugin emits meta-refresh + JS forwarding. Add explicit
// indexing policy and absolute canonicals after all plugin postBuild hooks finish.
for (const [from, to] of Object.entries(redirects)) {
  const file = path.join('build', decodeURI(from), 'index.html');
  let html = fs.readFileSync(file, 'utf8');
  html = html.replace('<head>', '<head>\n<meta name="robots" content="noindex,follow">');
  html = html.replace(/(<link rel="canonical" href=")[^"]+("\s*\/?>)/,
    `$1https://docs.formkiq.com${to}$2`);
  fs.writeFileSync(file, html);
}
console.log(`Finalized ${Object.keys(redirects).length} non-indexable redirect pages.`);
