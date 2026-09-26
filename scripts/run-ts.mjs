import { createRequire } from 'node:module';
import { mkdir, rm } from 'node:fs/promises';
import { resolve } from 'node:path';
import { spawnSync } from 'node:child_process';
const require = createRequire(import.meta.resolve('vite'));
const { build } = require('esbuild');
const entry = process.argv[2];
if (!entry) throw new Error('Pass a TypeScript script path');
await mkdir('.cache', { recursive: true });
const output = resolve('.cache', entry.includes('test') ? 'tests.mjs' : 'assets.mjs');
try {
  await build({entryPoints:[entry],bundle:true,platform:'node',format:'esm',outfile:output});
  const result=spawnSync(process.execPath,[...(entry.includes('test')?['--test']:[]),output],{stdio:'inherit'});
  process.exitCode=result.status??1;
} finally { await rm(output,{force:true}); }
