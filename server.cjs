const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const root = __dirname;
const types = { '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.jpg': 'image/jpeg', '.woff2': 'font/woff2' };
const publicFiles = ['index.html', 'style.css', 'art-direction.css', 'script.js', path.join('assets', 'earth-from-orbit.jpg'), path.join('assets', 'moon-dream.jpg'), path.join('assets', 'quiet-earth.jpg'), path.join('assets', 'helmet.jpg'), path.join('assets', 'astronaut.jpg')];
publicFiles.push(path.join('assets', 'fonts', 'ChillZhuo.woff2'));
http.createServer((req, res) => {
  let pathname;
  try { pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname); }
  catch { res.writeHead(400); res.end('Bad request'); return; }
  if (pathname === '/') pathname = '/index.html';
  const file = path.resolve(root, '.' + pathname);
  const relative = path.relative(root, file);
  const isNote = path.dirname(relative) === 'notes' &&
    /^[a-z0-9][a-z0-9-]*\.(?:html|css)$/.test(path.basename(relative));
  if (!file.startsWith(root + path.sep) || (!publicFiles.includes(relative) && !isNote)) {
    res.writeHead(404); res.end('Not found'); return;
  }
  fs.readFile(file, (error, data) => {
    if (error) { res.writeHead(404); res.end('Not found'); return; }
    res.writeHead(200, { 'Content-Type': types[path.extname(file)], 'Cache-Control': 'no-store' });
    res.end(data);
  });
}).listen(4173, '127.0.0.1', () => console.log('Local: http://127.0.0.1:4173'));



