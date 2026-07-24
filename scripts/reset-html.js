import { copyFileSync, readdirSync, rmSync } from 'fs';

copyFileSync('index.template.html', 'index.html');
console.log('index.html reset from template');

// Remove stale build artifacts so only the latest bundle is committed.
const stale = /^(index-|jszip\.min-|style-).*\.(js|css)$/;
for (const f of readdirSync('assets')) {
  if (stale.test(f)) {
    rmSync(`assets/${f}`);
    console.log(`removed stale asset: assets/${f}`);
  }
}
