const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');

function walk(directory) {
  return fs.readdirSync(directory, {withFileTypes: true}).flatMap(entry => {
    const file = path.join(directory, entry.name);
    return entry.isDirectory() ? walk(file) : [file];
  });
}

const files = ['docs', 'src', 'static'].flatMap(walk);
const source = files.filter(file => /\.(?:mdx?|jsx?|tsx?|css|json|svg|html)$/.test(file))
  .concat(['docusaurus.config.js', 'sidebars.js']).map(file => fs.readFileSync(file, 'utf8')).join('\n');
const images = files.filter(file => /\.(?:png|jpe?g|webp|svg)$/.test(file));
const candidates = images.filter(file => !source.includes(path.basename(file)));
const groups = new Map();
for (const file of images) {
  const hash = crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
  groups.set(hash, [...(groups.get(hash) || []), file]);
}
const duplicates = [...groups.values()].filter(group => group.length > 1);
const report = [
  '# Image asset audit', '',
  `Scanned ${images.length} images. ${candidates.length} have no filename reference in site source; ${duplicates.length} groups contain byte-identical files.`, '',
  'These are review candidates, not a deletion list. Filename matching is conservative; dynamic references and external consumers require separate verification. Existing public PNG URLs and marketplace artifacts are intentionally retained. The active architecture components use smaller WebP copies.', '',
  '## Candidates for usage verification', '',
  ...candidates.map(file => `- ${file} (${fs.statSync(file).size} bytes)`), '',
  '## Byte-identical groups', '',
  ...duplicates.flatMap(group => ['- ' + group.join(' · ')]), '',
].join('\n');
if (process.argv[2]) fs.writeFileSync(process.argv[2], report);
else process.stdout.write(report);
