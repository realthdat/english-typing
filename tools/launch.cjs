const { buildSync } = require('esbuild');
const { spawn } = require('node:child_process');
const path = require('node:path');
buildSync({ entryPoints: [path.join(__dirname, '../src/renderer/app.js')], bundle: true, outfile: path.join(__dirname, '../.cache/app.js'), platform: 'browser' });
const env = { ...process.env };
delete env.ELECTRON_RUN_AS_NODE;
const child = spawn(require('electron'), [path.join(__dirname, '..'), ...process.argv.slice(2)], { stdio: 'inherit', env, windowsHide: true });
child.on('exit', code => process.exit(code ?? 1));
