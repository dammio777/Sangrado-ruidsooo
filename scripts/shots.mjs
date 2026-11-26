// Capturas por sección en 375/768/1440 + chequeo de overflow a 320 y errores de consola.
import { createRequire } from "node:module";
const { chromium } = createRequire(import.meta.url)("playwright");
const URL = process.env.URL || "http://localhost:4174/";
const OUT = process.env.OUT || "verify-out";
const only = process.argv[2];
const sizes = [
  [375, 812],
  [768, 1024],
  [1440, 900],
];
const browser = await chromium.launch();
const errors = [];
for (const [w, h] of sizes) {
  if (only && String(w) !== only) continue;
  const ctx = await browser.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: 1, hasTouch: w < 1024, isMobile: w < 1024 });
  const page = await ctx.newPage();
  page.on("console", (m) => (m.type() === "error" || m.type() === "warning") && errors.push(`[${w}] ${m.type()}: ${m.text()}`));
  page.on("pageerror", (e) => errors.push(`[${w}] pageerror: ${e.message}`));
  await page.goto(URL, { waitUntil: "commit" });
  await page.waitForTimeout(700); // intro a mitad
  await page.screenshot({ path: `${OUT}/${w}-00-intro-mid.png` });
  await page.waitForLoadState("networkidle");
  await page.waitForTimeout(1800); // intro
  await page.screenshot({ path: `${OUT}/${w}-00-hero.png` });
  const ids = ["hifi", "lo-que-hace", "sesiones", "buen-vivir", "contacto"];
  const total = await page.evaluate(() => document.documentElement.scrollHeight);
  // recorrer en pasos para disparar entradas
  for (let y = 0; y < total; y += Math.round(h * 0.6)) {
    await page.evaluate((yy) => window.scrollTo(0, yy), y);
    await page.waitForTimeout(140);
  }
  let n = 1;
  for (const id of ids) {
    await page.evaluate((i) => {
      const el = document.getElementById(i);
      window.scrollTo(0, el.getBoundingClientRect().top + window.scrollY - 56);
    }, id);
    await page.waitForTimeout(1300);
    await page.screenshot({ path: `${OUT}/${w}-0${n++}-${id}.png` });
  }
  // transición crema → vino al entrar a contacto
  await page.evaluate(() => {
    const el = document.getElementById("contacto");
    window.scrollTo(0, el.getBoundingClientRect().top + window.scrollY - innerHeight * 0.6);
  });
  await page.waitForTimeout(1200);
  await page.screenshot({ path: `${OUT}/${w}-06-contacto-transicion.png` });
  // flip a mitad
  for (const [k, f] of [["a", 0.25], ["mid", 0.5], ["c", 0.8]]) {
    await page.evaluate((ff) => {
      const el = document.querySelector(".flip");
      const top = el.getBoundingClientRect().top + window.scrollY;
      window.scrollTo(0, top - innerHeight * 0.75 + (el.offsetHeight + innerHeight * 0.35) * ff);
    }, f);
    await page.waitForTimeout(1200);
    await page.screenshot({ path: `${OUT}/${w}-07-flip-${k}.png` });
  }
  await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
  await page.waitForTimeout(1400);
  await page.screenshot({ path: `${OUT}/${w}-08-footer.png` });
  const ov = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
  console.log(`${w}: overflow=${ov}px height=${total}`);
  await ctx.close();
}
// 320 overflow
const ctx = await browser.newContext({ viewport: { width: 320, height: 640 }, isMobile: true, hasTouch: true });
const page = await ctx.newPage();
await page.goto(URL, { waitUntil: "networkidle" });
await page.waitForTimeout(2500);
const wide = await page.evaluate(() => {
  const out = [];
  document.querySelectorAll("body *").forEach((el) => {
    const r = el.getBoundingClientRect();
    if (r.right > innerWidth + 1 && getComputedStyle(el).position !== "fixed") {
      let p = el.parentElement, clipped = false;
      while (p) { const o = getComputedStyle(p); if (o.overflowX !== "visible") { clipped = true; break; } p = p.parentElement; }
      if (!clipped) out.push(`${el.tagName}.${el.className?.baseVal ?? el.className} → ${Math.round(r.right)}`);
    }
  });
  return { sw: document.documentElement.scrollWidth, list: out.slice(0, 10) };
});
console.log("320:", JSON.stringify(wide));
await browser.close();
console.log(errors.length ? errors.join("\n") : "no console errors/warnings");
