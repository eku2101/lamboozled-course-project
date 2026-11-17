import fs from 'node:fs';
import { spawnSync } from 'node:child_process';
const files = [...fs.readdirSync('dist').filter(x => x.endsWith('.js')).map(x => 'dist/' + x), ...fs.readdirSync('dist/modules').filter(x => x.endsWith('.js')).map(x => 'dist/modules/' + x)];
for (const file of files) {
  const result = spawnSync(process.execPath, ['--check', file], {encoding:'utf8'});
  if (result.status) { console.error(result.stderr); process.exit(1); }
}
const html = fs.readFileSync('dist/index.html', 'utf8');
for (const match of html.matchAll(/(?:src|href)="([^"#]+\.(?:js|css))"/g)) {
  if (!fs.existsSync('dist/' + match[1])) throw new Error('Missing asset: ' + match[1]);
}
console.log(`Checked ${files.length} JavaScript files and HTML asset references.`);
