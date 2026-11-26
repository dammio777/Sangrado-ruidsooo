// Genera og.png (1200×630), apple-touch-icon (180) e íconos del manifest con Playwright.
// Solo gráficos tipográficos de marca dibujados en código: no usa fotografías.
import { createRequire } from "node:module";
const { chromium } = createRequire(import.meta.url)("playwright");
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const pub = resolve(root, "public");
const font = (f) => `data:font/woff2;base64,${readFileSync(resolve(pub, "fonts", f)).toString("base64")}`;
const fav = readFileSync(resolve(pub, "favicon.svg"), "utf8");

let grooves = "";
for (let i = 0; i < 36; i++) {
  const r = 84 + (i / 35) * 108;
  grooves += `<circle cx="200" cy="200" r="${r.toFixed(1)}" fill="none" stroke="#3D0F17" stroke-opacity="${i % 3 ? 0.42 : 0.65}" stroke-width="${i % 9 === 4 ? 1.6 : 0.6}"/>`;
}
const record = `<svg viewBox="0 0 400 400" width="760" height="760"><circle cx="200" cy="200" r="199" fill="#1C0A0D"/>${grooves}<circle cx="200" cy="200" r="74" fill="#5C1A24"/><circle cx="200" cy="200" r="70" fill="none" stroke="#F2E6D0" stroke-opacity=".3"/><text x="200" y="214" text-anchor="middle" font-family="Inter Tight" font-weight="650" font-size="40" letter-spacing="-1.6" fill="#F2E6D0">CC</text></svg>`;

const css = `
@font-face{font-family:"Inter Tight";src:url(${font("inter-tight-latin-wght.woff2")});font-weight:500 700}
@font-face{font-family:Inter;src:url(${font("inter-latin-wght.woff2")});font-weight:400 600}
@font-face{font-family:Serif;src:url(${font("instrument-serif-latin-italic.woff2")});font-style:italic}
*{margin:0;box-sizing:border-box}
body{width:1200px;height:630px;background:#5C1A24;color:#F2E6D0;position:relative;overflow:hidden;font-family:"Inter Tight"}
.rec{position:absolute;right:-230px;top:-65px}
.label{position:absolute;left:72px;top:64px;font:600 18px Inter;letter-spacing:.06em;color:#D9A3A0}
.name{position:absolute;left:66px;top:140px;font-weight:650;font-size:150px;line-height:.94;letter-spacing:-.04em}
.hifi{position:absolute;left:72px;top:428px;font-family:Serif;font-style:italic;font-size:100px;color:#D4A659;letter-spacing:-.01em}
.foot{position:absolute;left:72px;bottom:52px;font:600 16px Inter;letter-spacing:.06em;color:#D9A3A0}
.line{position:absolute;left:72px;right:72px;bottom:96px;height:1px;background:rgba(242,230,208,.18)}
`;
const og = `<!doctype html><html><head><style>${css}</style></head><body><div class="rec">${record}</div><div class="label">CC-001 · LADO A · SANTA ELENA, MEDELLÍN</div><div class="name">Cristian<br>Calle</div><div class="hifi">Hi-Fi</div><div class="line"></div><div class="foot">EVENTOS · MÚSICA EN VINILO · BUEN VIVIR</div></body></html>`;

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1 });
await page.setContent(og);
await page.evaluate(() => document.fonts.ready);
await page.screenshot({ path: resolve(pub, "og.png") });

for (const [size, file, pad] of [[180, "apple-touch-icon.png", 18], [192, "icon-192.png", 20], [512, "icon-512.png", 52]]) {
  await page.setViewportSize({ width: size, height: size });
  await page.setContent(`<html><body style="margin:0;background:#5C1A24;display:grid;place-items:center;width:${size}px;height:${size}px">${fav.replace("<svg ", `<svg width="${size - pad * 2}" height="${size - pad * 2}" `)}</body></html>`);
  await page.screenshot({ path: resolve(pub, file) });
}
await browser.close();
console.log("brand assets ok");
