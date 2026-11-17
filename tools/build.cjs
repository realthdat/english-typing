const path = require('node:path');
require('esbuild').buildSync({
  entryPoints: [path.join(__dirname, '../src/renderer/app.js')],
  bundle: true,
  outfile: path.join(__dirname, '../.cache/app.js'),
  platform: 'browser'
});
