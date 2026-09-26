import { spawnSync } from 'node:child_process';
import { writeFileSync } from 'node:fs';
const base = '/vai_biology_atlas/';
for (const args of [['node_modules/typescript/bin/tsc', '-b'], ['node_modules/vite/bin/vite.js', 'build', '--configLoader', 'native', '--base', base]]) {
  const result = spawnSync(process.execPath, args, { stdio: 'inherit' });
  if (result.status !== 0) process.exit(result.status ?? 1);
}
// Pages has no SPA rewrite: send a deep-link request through the index once.
writeFileSync('dist/404.html', `<!doctype html><html lang="en"><meta charset="utf-8"><title>Opening Human Atlas</title><script>const base=${JSON.stringify(base)};location.replace(base+'?__atlas_route='+encodeURIComponent(location.pathname+location.search+location.hash));</script><p>Opening Human Atlas… <a href="${base}">Go to atlas</a></p></html>`);
writeFileSync('dist/.nojekyll', '');
