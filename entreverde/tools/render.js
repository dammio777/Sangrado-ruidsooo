// Render cuadro por cuadro de video/index.html con Playwright (Chromium) + ffmpeg.
//
//   node tools/render.js stills 1.2,6.5,...        → out/tests/f_<t>.png (cuadros de prueba)
//   node tools/render.js segment <desde> <hasta> <salida.mkv>   → maestro casi sin pérdida
//   node tools/render.js master [workers]           → reparte el video en segmentos en paralelo
//
// Captura por CDP (Page.captureScreenshot, optimizeForSpeed, JPEG 95) enviada por tubería a ffmpeg.
const { chromium } = require('playwright');
const http = require('http');
const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

const ROOT = path.resolve(__dirname, '..');
const FPS = 60;
const OUT = path.join(ROOT, 'out');

function serve() {
  const types = { '.html': 'text/html', '.js': 'text/javascript', '.svg': 'image/svg+xml', '.jpg': 'image/jpeg', '.png': 'image/png', '.woff2': 'font/woff2', '.json': 'application/json' };
  const srv = http.createServer((req, res) => {
    const p = path.join(ROOT, decodeURIComponent(req.url.split('?')[0]));
    if (!p.startsWith(ROOT) || !fs.existsSync(p) || fs.statSync(p).isDirectory()) { res.writeHead(404); return res.end(); }
    res.writeHead(200, { 'Content-Type': types[path.extname(p)] || 'application/octet-stream' });
    fs.createReadStream(p).pipe(res);
  });
  return new Promise(r => srv.listen(0, '127.0.0.1', () => r(srv)));
}

async function openPage(port) {
  const browser = await chromium.launch({ args: ['--disable-gpu-vsync', '--force-color-profile=srgb', '--hide-scrollbars'] });
  const page = await browser.newPage({ viewport: { width: 1080, height: 1920 }, deviceScaleFactor: 1 });
  page.on('pageerror', e => console.error('pageerror', e.message));
  page.on('console', m => { if (m.type() === 'error') console.error('console', m.text()); });
  await page.goto(`http://127.0.0.1:${port}/video/index.html`);
  await page.evaluate(() => window.ready);
  // calentamiento: pinta cada escena una vez para que Chromium rasterice fuentes e imágenes
  for (const t of [1, 3.5, 6, 9.5, 12.5, 16, 18.5, 20.5, 22.5, 24.5, 27, 31]) {
    await page.evaluate(tt => new Promise(r => { window.render(tt); requestAnimationFrame(() => requestAnimationFrame(r)); }), t);
  }
  await page.waitForTimeout(400);
  const cdp = await page.context().newCDPSession(page);
  return { browser, page, cdp };
}

async function frameAt(page, cdp, t, format = 'jpeg') {
  await page.evaluate(tt => new Promise(r => { window.render(tt); requestAnimationFrame(() => requestAnimationFrame(r)); }), t);
  const r = await cdp.send('Page.captureScreenshot', { format, quality: format === 'jpeg' ? 95 : undefined, optimizeForSpeed: true, captureBeyondViewport: false });
  return Buffer.from(r.data, 'base64');
}

async function stills(times) {
  const srv = await serve();
  const { browser, page, cdp } = await openPage(srv.address().port);
  fs.mkdirSync(path.join(OUT, 'tests'), { recursive: true });
  for (const t of times) {
    const buf = await frameAt(page, cdp, t, 'png');
    const f = path.join(OUT, 'tests', `f_${t.toFixed(2).padStart(5, '0')}.png`);
    fs.writeFileSync(f, buf);
    console.log(f);
  }
  await browser.close(); srv.close();
}

async function segment(f0, f1, file) {
  const srv = await serve();
  const { browser, page, cdp } = await openPage(srv.address().port);
  const ff = spawn('ffmpeg', ['-y', '-loglevel', 'error', '-f', 'image2pipe', '-framerate', String(FPS), '-c:v', 'mjpeg', '-i', '-',
    '-c:v', 'libx264', '-preset', 'veryfast', '-crf', '8', '-pix_fmt', 'yuv444p', '-r', String(FPS), file], { stdio: ['pipe', 'inherit', 'inherit'] });
  const t0 = Date.now();
  for (let f = f0; f < f1; f++) {
    const buf = await frameAt(page, cdp, f / FPS);
    if (!ff.stdin.write(buf)) await new Promise(r => ff.stdin.once('drain', r));
    if ((f - f0) % 120 === 0) console.log(`[${path.basename(file)}] ${f - f0}/${f1 - f0} cuadros · ${((Date.now() - t0) / 1000).toFixed(0)} s`);
  }
  ff.stdin.end();
  await new Promise((res, rej) => ff.on('close', c => c === 0 ? res() : rej(new Error('ffmpeg ' + c))));
  await browser.close(); srv.close();
}

async function master(workers) {
  const total = Math.round(33.5 * FPS);
  const per = Math.ceil(total / workers);
  fs.mkdirSync(path.join(OUT, 'seg'), { recursive: true });
  const jobs = [];
  const list = [];
  for (let i = 0; i < workers; i++) {
    const a = i * per, b = Math.min(total, (i + 1) * per);
    const file = path.join(OUT, 'seg', `seg_${i}.mkv`);
    list.push(`file '${file}'`);
    jobs.push(new Promise((res, rej) => {
      const p = spawn(process.execPath, [__filename, 'segment', String(a), String(b), file], { stdio: 'inherit' });
      p.on('close', c => c === 0 ? res() : rej(new Error('segmento ' + i)));
    }));
  }
  await Promise.all(jobs);
  fs.writeFileSync(path.join(OUT, 'seg', 'list.txt'), list.join('\n'));
  await new Promise((res, rej) => {
    const p = spawn('ffmpeg', ['-y', '-loglevel', 'error', '-f', 'concat', '-safe', '0', '-i', path.join(OUT, 'seg', 'list.txt'), '-c', 'copy', path.join(OUT, 'master.mkv')], { stdio: 'inherit' });
    p.on('close', c => c === 0 ? res() : rej(new Error('concat')));
  });
  console.log('maestro listo:', path.join(OUT, 'master.mkv'));
}

const [mode, ...a] = process.argv.slice(2);
(async () => {
  if (mode === 'stills') await stills(a[0].split(',').map(Number));
  else if (mode === 'segment') await segment(+a[0], +a[1], a[2]);
  else if (mode === 'master') await master(+(a[0] || 4));
  else throw new Error('modo desconocido');
})().catch(e => { console.error(e); process.exit(1); });
