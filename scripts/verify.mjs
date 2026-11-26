// Verificación funcional: teclado, reduced motion, sin JS, scroll y sonido.
import { createRequire } from "node:module";
const { chromium } = createRequire(import.meta.url)("playwright");
const URL = process.env.URL || "http://localhost:4174/";
const res = [];
const ok = (name, pass, info = "") => res.push(`${pass ? "PASS" : "FAIL"} · ${name}${info ? " — " + info : ""}`);
const b = await chromium.launch();

// ── Sonido + teclado (escritorio) ──
{
  const ctx = await b.newContext({ viewport: { width: 1440, height: 900 } });
  await ctx.addInitScript(() => {
    window.__ac = 0;
    const O = window.AudioContext;
    window.AudioContext = class extends O { constructor(...a) { super(...a); window.__ac++; window.__ctx = this; } };
  });
  const p = await ctx.newPage();
  const errs = [];
  p.on("pageerror", (e) => errs.push(e.message));
  p.on("console", (m) => (m.type() === "error" || m.type() === "warning") && errs.push(m.text()));
  await p.goto(URL, { waitUntil: "networkidle" });
  await p.waitForTimeout(2500);
  await p.evaluate(() => { window.__opened = []; window.open = (u) => { window.__opened.push(u); return null; }; });
  ok("Sonido OFF por defecto y sin AudioContext antes de interactuar", (await p.evaluate(() => window.__ac)) === 0 && (await p.getAttribute("[data-sound-toggle]", "aria-pressed")) === "false");
  // teclado: skip link es el primer foco
  await p.keyboard.press("Tab");
  ok("Tab 1 → enlace 'Saltar al contenido'", (await p.evaluate(() => document.activeElement?.className)) === "skip");
  // toggle de sonido con teclado
  await p.focus(".nav [data-sound-toggle]");
  await p.keyboard.press("Enter");
  await p.waitForTimeout(500);
  const on = await p.evaluate(() => [window.__ac, window.__ctx?.state, localStorage.getItem("cc-sound"), document.querySelector(".nav [data-sound-toggle]").getAttribute("aria-pressed")]);
  ok("Toggle de sonido con teclado (AudioContext creado, running, aria-pressed, persistido)", on[0] === 1 && on[1] === "running" && on[2] === "1" && on[3] === "true", JSON.stringify(on));
  await p.evaluate(() => { Object.defineProperty(document, "hidden", { value: true, configurable: true }); document.dispatchEvent(new Event("visibilitychange")); });
  await p.waitForTimeout(300);
  ok("Audio se suspende con la pestaña oculta", (await p.evaluate(() => window.__ctx.state)) === "suspended");
  await p.evaluate(() => { Object.defineProperty(document, "hidden", { value: false, configurable: true }); document.dispatchEvent(new Event("visibilitychange")); });
  await p.keyboard.press("Enter");
  await p.waitForTimeout(500);
  ok("Toggle OFF persiste", (await p.evaluate(() => localStorage.getItem("cc-sound"))) === "0");

  // tracklist → hoja con Enter, Esc cierra y devuelve foco
  await p.evaluate(() => document.getElementById("lo-que-hace").scrollIntoView());
  await p.waitForTimeout(600);
  await p.focus(".track >> nth=1");
  await p.keyboard.press("Enter");
  await p.waitForTimeout(900);
  const dlg = await p.evaluate(() => { const d = document.querySelector('[role="dialog"][aria-modal="true"].sheet__panel'); return d ? [d.contains(document.activeElement), d.querySelector("h3")?.textContent] : null; });
  ok("Tracklist: Enter abre la hoja con foco dentro", !!dlg && dlg[0], JSON.stringify(dlg));
  for (let i = 0; i < 6; i++) await p.keyboard.press("Tab");
  ok("Hoja: trampa de foco", await p.evaluate(() => !!document.activeElement?.closest(".sheet__panel")));
  await p.keyboard.press("Escape");
  await p.waitForTimeout(700);
  ok("Hoja: Esc cierra y el foco vuelve al tema", await p.evaluate(() => !document.querySelector(".sheet__panel") && document.activeElement?.classList.contains("track")));

  // riel de sesiones: botones y teclado nativo (sin preventDefault)
  await p.evaluate(() => document.getElementById("sesiones").scrollIntoView());
  await p.waitForTimeout(1500);
  await p.focus(".rail");
  const x0 = await p.evaluate(() => document.querySelector(".rail").scrollLeft);
  await p.keyboard.press("ArrowRight");
  await p.waitForTimeout(900);
  const x1 = await p.evaluate(() => document.querySelector(".rail").scrollLeft);
  await p.evaluate(() => document.querySelector(".rail").scrollTo({ left: 0 }));
  await p.waitForTimeout(500);
  await p.click('.rail-controls button[aria-label="Sesión siguiente"]');
  await p.waitForTimeout(1500);
  const count = (await p.textContent(".rail-count")).trim();
  ok("Riel: botón 'siguiente' avanza y ←/→ desplazan de forma nativa con foco", count.startsWith("02") && x1 > x0, JSON.stringify([count, x0, x1]));

  // menú: no visible en escritorio; nav con teclado
  await p.focus('.nav__links a[href="#contacto"]');
  await p.keyboard.press("Enter");
  await p.waitForTimeout(1800);
  const anchor = await p.evaluate(() => [location.hash, document.activeElement?.id, Math.round(document.getElementById("contacto").getBoundingClientRect().top)]);
  ok("Nav: Enter lleva a #contacto, cae bajo la barra y enfoca el título", anchor[0] === "#contacto" && anchor[1] === "contact-title" && anchor[2] >= 40 && anchor[2] <= 80, JSON.stringify(anchor));

  // formulario
  const sub = 'form.form button[type="submit"]';
  ok("Formulario: enviar deshabilitado mientras es inválido", await p.isDisabled(sub));
  await p.fill('input[name="nombre"]', "Ana");
  await p.fill('input[name="celular"]', "12");
  await p.locator('input[name="celular"]').blur();
  ok("Formulario: validación inline al salir del campo (texto + ícono, aria-live)", await p.evaluate(() => { const e = [...document.querySelectorAll(".field__err")].find((n) => n.textContent.trim()); return !!e && !!e.querySelector("svg") && e.getAttribute("aria-live") === "polite"; }));
  await p.fill('input[name="celular"]', "3001234567");
  await p.check('input[name="tipo"][value="Boda"]');
  await p.fill('textarea[name="mensaje"]', "Queremos música en vinilo para la boda.");
  ok("Formulario: enviar habilitado cuando es válido", !(await p.isDisabled(sub)));
  await p.click(sub);
  const wa = await p.evaluate(() => window.__opened[0] || "");
  ok("Formulario → WhatsApp prellenado", wa.includes("wa.me") || wa.includes("whatsapp"), decodeURIComponent(wa).slice(0, 120).replace(/\n/g, " ⏎ "));
  await p.waitForTimeout(1200);
  ok("Confirmación con 'Copiar mensaje'", (await p.locator(".sent").count()) === 1 && (await p.locator(".sent__ctas .btn", { hasText: "Copiar mensaje" }).count()) === 1);
  ok("Sin errores de consola (escritorio)", errs.filter((e) => !/AudioContext was not allowed/.test(e)).length === 0, errs.join(" | "));
  await ctx.close();
}

// ── Sonido con AudioContext bloqueado ──
{
  const ctx = await b.newContext({ viewport: { width: 1440, height: 900 } });
  await ctx.addInitScript(() => { window.AudioContext = class { constructor() { throw new Error("blocked"); } }; });
  const p = await ctx.newPage();
  const errs = [];
  p.on("pageerror", (e) => errs.push(e.message));
  await p.goto(URL + "#top", { waitUntil: "networkidle" });
  await p.waitForTimeout(800);
  await p.click(".nav [data-sound-toggle]");
  await p.waitForTimeout(800);
  const st = await p.evaluate(() => [document.querySelector(".nav [data-sound-toggle]").getAttribute("aria-pressed"), localStorage.getItem("cc-sound"), document.querySelector(".toast")?.textContent]);
  ok("Sonido bloqueado: el toggle vuelve a OFF, avisa y no hay errores", st[0] === "false" && st[1] === "0" && /sonido/i.test(st[2] || "") && errs.length === 0, JSON.stringify([st, errs]));
  await ctx.close();
}

// ── Menú móvil con teclado ──
{
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
  const p = await ctx.newPage();
  await p.goto(URL + "#hifi", { waitUntil: "networkidle" });
  await p.waitForTimeout(800);
  await p.focus(".nav__burger");
  await p.keyboard.press("Enter");
  await p.waitForTimeout(600);
  const open = await p.evaluate(() => [document.querySelector(".nav__burger").getAttribute("aria-expanded"), !!document.activeElement?.closest("#menu")]);
  await p.screenshot({ path: "verify-out/menu-open.png" });
  await p.keyboard.press("Escape");
  await p.waitForTimeout(500);
  const closed = await p.evaluate(() => [document.querySelector(".nav__burger").getAttribute("aria-expanded"), document.activeElement?.classList.contains("nav__burger")]);
  ok("Menú móvil: Enter abre con foco dentro, Esc cierra y devuelve el foco", open[0] === "true" && open[1] && closed[0] === "false" && closed[1], JSON.stringify([open, closed]));
  await ctx.close();
}

// ── Scroll nunca capturado (rueda sobre la caja y el flip) ──
{
  const ctx = await b.newContext({ viewport: { width: 1440, height: 900 } });
  const p = await ctx.newPage();
  await p.goto(URL + "#sesiones", { waitUntil: "networkidle" });
  await p.waitForTimeout(1500);
  for (const sel of [".rail", ".flip__stage"]) {
    await p.evaluate((s) => document.querySelector(s).scrollIntoView({ block: "center" }), sel);
    await p.waitForTimeout(800);
    const box = await p.locator(sel).boundingBox();
    await p.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
    const y0 = await p.evaluate(() => scrollY);
    for (let i = 0; i < 4; i++) { await p.mouse.wheel(0, 300); await p.waitForTimeout(60); }
    await p.waitForTimeout(1300);
    const y1 = await p.evaluate(() => scrollY);
    ok(`Rueda sobre ${sel} desplaza la página`, y1 - y0 > 600, `${y0}→${y1}`);
  }
  await ctx.close();
  // táctil (sin Lenis): nada cancela el gesto de scroll
  const m = await b.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
  const mp = await m.newPage();
  await mp.goto(URL + "#sesiones", { waitUntil: "networkidle" });
  await mp.waitForTimeout(400);
  const rb = await mp.locator(".rail").boundingBox();
  const cdp = await m.newCDPSession(mp);
  const drag = async (x0, y0, x1, y1) => {
    await cdp.send("Input.dispatchTouchEvent", { type: "touchStart", touchPoints: [{ x: x0, y: y0 }] });
    for (let i = 1; i <= 12; i++) { await cdp.send("Input.dispatchTouchEvent", { type: "touchMove", touchPoints: [{ x: x0 + ((x1 - x0) * i) / 12, y: y0 + ((y1 - y0) * i) / 12 }] }); await mp.waitForTimeout(16); }
    await cdp.send("Input.dispatchTouchEvent", { type: "touchEnd", touchPoints: [] });
    await mp.waitForTimeout(700);
  };
  const ty = Math.round(rb.y + 150);
  const railX0 = await mp.evaluate(() => document.querySelector(".rail").scrollLeft);
  await drag(300, ty, 60, ty);
  const railX1 = await mp.evaluate(() => document.querySelector(".rail").scrollLeft);
  const pageY0 = await mp.evaluate(() => scrollY);
  await drag(200, ty + 100, 200, ty - 200);
  const pageY = (await mp.evaluate(() => scrollY)) - pageY0;
  ok("Táctil: el riel se desliza en horizontal y el gesto vertical sobre él mueve la página", railX1 > railX0 && pageY > 0, JSON.stringify([railX0, railX1, pageY]));
  const prevented = await mp.evaluate(() => { const r = []; for (const sel of [".rail", ".flip__stage", ".hero__record", ".reels__list"]) for (const t of ["wheel", "touchstart", "touchmove", "keydown"]) { const e = new Event(t, { cancelable: true, bubbles: true }); document.querySelector(sel).dispatchEvent(e); if (e.defaultPrevented) r.push(sel + ":" + t); } return r; });
  ok("Móvil: ningún preventDefault en wheel/touch/keydown (riel, transición, hero, reels)", prevented.length === 0, prevented.join(","));
  await m.close();
}

// ── Reduced motion y sin JS: todo el contenido visible ──
for (const [name, opts] of [["reduced motion", { reducedMotion: "reduce" }], ["sin JS", { javaScriptEnabled: false }]]) {
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, ...opts });
  const p = await ctx.newPage();
  await p.goto(URL, { waitUntil: "networkidle" });
  await p.waitForTimeout(800);
  const hidden = await p.evaluate(() => {
    const out = [];
    document.querySelectorAll("main h1, main h2, main h3, main p, main li, main a, main button, footer p").forEach((el) => {
      const cs = getComputedStyle(el);
      if (el.closest(".sr-only,[aria-hidden=true]")) return;
      // ocultos a propósito: pista del riel en móvil y leyenda animada sustituida por la etiqueta estática
      if (el.matches(".rail-hint, .flip__caption, .field__err:empty")) return;
      if (cs.visibility === "hidden" || cs.opacity === "0" || cs.display === "none") out.push(el.tagName + "." + el.className);
    });
    return out;
  });
  const intro = await p.evaluate(() => { const i = document.querySelector(".intro"); return i ? getComputedStyle(i).display : "none"; });
  ok(`${name}: contenido visible (sin intro)`, hidden.length === 0 && intro === "none", hidden.slice(0, 5).join(", "));
  await p.screenshot({ path: `verify-out/${name.replace(/ /g, "-")}-full.png`, fullPage: true });
  await ctx.close();
}
await b.close();
console.log(res.join("\n"));
