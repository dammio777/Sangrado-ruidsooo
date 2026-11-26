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
const record = `<svg viewBox="0 0 400 400" width="760" height="760"><circle cx="200" cy="200" r="199" fill="#1C0A0D"/>${grooves}<circle cx="200" cy="200" r="74" fill="#5C1A24"/><circle cx="200" cy="200" r="70" fill="none" stroke="#D4A659" stroke-opacity=".5"/><defs><path id="p" d="M200 200 m-58 0 a58 58 0 1 1 116 0 a58 58 0 1 1 -116 0"/></defs><text font-family="Plex" font-size="8.4" letter-spacing="1.4" fill="#F2E6D0"><textPath href="#p">CRISTIAN CALLE · HI-FI · LADO A · 33⅓ RPM · CC-001 · </textPath></text><text x="200" y="188" text-anchor="middle" font-family="Fraunces" font-style="italic" font-size="38" fill="#F2E6D0">CC</text><text x="200" y="228" text-anchor="middle" font-family="Plex" font-size="9" letter-spacing="1.5" fill="#D9A3A0">33⅓</text><circle cx="200" cy="200" r="4.5" fill="#1C0A0D"/></svg>`;

const css = `
@font-face{font-family:Fraunces;src:url(${font("fraunces-latin-normal.woff2")});font-weight:300 600}
@font-face{font-family:Fraunces;src:url(${font("fraunces-latin-italic.woff2")});font-style:italic;font-weight:300 600}
@font-face{font-family:Plex;src:url(${font("ibm-plex-mono-latin-500-normal.woff2")})}
*{margin:0;box-sizing:border-box}
body{width:1200px;height:630px;background:#5C1A24;color:#F2E6D0;position:relative;overflow:hidden;font-family:Fraunces}
.rec{position:absolute;right:-230px;top:-65px}
.label{position:absolute;left:72px;top:64px;font:500 18px Plex;letter-spacing:.14em;color:#D4A659}
.name{position:absolute;left:66px;top:150px;font-weight:300;font-size:150px;line-height:.9;letter-spacing:-.035em;font-variation-settings:"SOFT" 100,"opsz" 144}
.hifi{position:absolute;left:72px;top:418px;font-style:italic;font-size:96px;color:#D4A659;letter-spacing:-.03em;font-variation-settings:"SOFT" 100,"opsz" 144}
.foot{position:absolute;left:72px;bottom:52px;font:500 16px Plex;letter-spacing:.14em;color:#D9A3A0}
.line{position:absolute;left:72px;right:72px;bottom:96px;height:1px;background:rgba(212,166,89,.45)}
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
