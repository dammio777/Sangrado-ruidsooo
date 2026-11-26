# Build brief — Cristian Calle (v2 · Premium, Apple-style)

You are a senior creative developer at a top-tier digital agency (Awwwards / Apple-site level). Build a premium, sober, agency-grade personal-brand website (the quality of a USD $1,000+ project) for **Cristian Calle** (Cristian Calle Bustamante), event organizer and vinyl music selector from **Santa Elena, Medellín, Colombia**. Two pillars:
1. **Hi-Fi** — *high fidelity*: everything he does (events, music, experiences) is done with quality: no noise, nothing half-done.
2. **El buen vivir** — he makes videos about personal growth, self-development and living well.

## 0. How to work

**Source of truth:** DESIGN.md (all visuals, tokens and the closed effect catalog) → this brief → your judgment. Read DESIGN.md fully before coding. Use ONLY the effects in its catalog; never invent colors, fonts, durations or easings. **Restraint is the brief:** when unsure, remove. The feel is apple.com product pages: huge calm type, generous silence, one idea per screen, slow and precise motion.

**Before coding**, output a short build plan (max ~30 lines): sections, effect per section, config schema, assumptions. Then build without asking. **After building**, run section 10 and report.

Site copy is **Spanish (Colombia)**; lines marked [AJUSTAR] are drafts to confirm with him.

### Golden rules
1. **CLARITY = HI-FI:** the site proves "high fidelity" by being clean, precise and quiet. No clutter, no noise, no gimmicks.
2. **THE SCROLL BELONGS TO THE USER:** no pin, no scroll-jacking, no `preventDefault` on wheel/touch/keys, no mandatory snap; animations never delay or lengthen the scroll.
3. **CONTENT FIRST:** all content is in the initial HTML; animation only enhances.
4. **NOTHING FAKE:** no invented clients, dates, numbers or testimonials; unknowns are marked placeholders.
5. **NEVER mention "Monte Hi-Fi"** anywhere (copy, alt, metadata, JSON-LD, comments, class or file names). "Hi-Fi" is Cristian's personal philosophy.
6. **Two sides of one record:** Lado A = Hi-Fi (wine, night). Lado B = El buen vivir (cream, day). One slow transition between them.

---

## 1. Information
- **Name:** Cristian Calle (full: Cristian Calle Bustamante — only in metadata/JSON-LD). **Role:** organizador de eventos y selector musical en vinilo; creador de contenido sobre crecimiento personal y buen vivir.
- **Location:** Santa Elena, Medellín, Antioquia, Colombia.
- **Instagram:** @kristohd13 — https://www.instagram.com/kristohd13/ (1.432 seguidores, 30 publicaciones [ACTUALIZAR]). Highlights: Plan Boda L&M · El buen vivir · Saboorr · Mera visita.
- **WhatsApp:** [PONER] → `https://wa.me/57XXXXXXXXXX`. **Email:** [PONER].
- **Music:** "solo música sabrosa": rock, salsa, soul, jazz, blues y fusiones, clásicos en vinilo.
- **Sessions (from his posters; years [CONFIRMAR]):** The B Side — Classics on vinyl (Árboro × Gaia, 10 de julio, 8:00 p. m.) · Música en la sala (Jaguarundí presenta, viernes 29 de mayo, 7:00 p. m., vía Santa Elena km 10, sector La Rosita; "Un recorrido musical por las fiestas en la sala de la casa") · Cristian Calle Selektor (El Maizal, pub y laboratorio sonoro, Santa Elena, viernes 15 de mayo) · Árboro, sesión DJ [CONFIRMAR].
- **Services [CONFIRMAR]:** Organización de eventos · Selektor en vinilo · Música en la sala · Bodas y celebraciones · Experiencias con sabor.
- **Hi-Fi philosophy (his idea, rewritten):** high fidelity isn't only good sound; it's taking that quality to everything an experience offers: attention, place, food, music, people.
- **Buen vivir phrases:** "Café y bici, sol y monte, diversión y trabajo." · "Gracias, papá Dios."
- **Voice:** warm, direct, understated, paisa without caricature. Third person ("Cristian hace…") [AJUSTAR].
- **Photos:** none in high res yet → DESIGN.md placeholders, read from one array in `src/config/site.ts`. Reference screenshots in `ref/` are for art direction only; do not use them on the site.

---

## 2. Concept: "Lado A / Lado B"
A single record, played once. A slow, quiet **intro** where a waveform line becomes a clean sine and his name appears. **Lado A (wine)** says what Hi-Fi means and what he does, with a vinyl record as the only object. A slow cross-fade turns the page to cream: **Lado B (cream)**, daylight, El buen vivir, with the record becoming a sun, and Instagram as the call to action. The page ends back in wine with a simple contact form.
**Through-line: clarity** — soft to sharp, noisy line to clean sine.

---

## 3. Stack & architecture
**Stack:** Vite + React + TypeScript (strict) · Tailwind v4 (tokens via `@theme`) · GSAP with ScrollTrigger, SplitText, DrawSVG, MorphSVG (free; `@gsap/react` `useGSAP`) · Motion for component state, layout, sheets · Lenis desktop only · Zustand (sound on/off, intro seen). Web Audio for the optional sound (no audio files). Pin exact versions; no other animation/UI libraries.
**Rendering:** prerender to static HTML (e.g. `vite-react-ssg`) so content, meta and JSON-LD exist without JS.
**Single-file fallback:** one `index.html`, GSAP + Lenis from CDN (exact versions), vanilla JS, same tokens, fonts as base64 woff2.
```
src/ config/site.ts · styles/tokens.css · lib/{motion,gsap,scroll,audio,whatsapp}.ts
components/brand/{Record,Waveform,Monogram} · components/ui/{Button,Sheet,Field,Toast,SoundToggle}
components/sections/ (one per section below)
```
**Animation architecture:** GSAP owns scroll-linked effects; Motion owns component state/layout/sheets; CSS owns hover/focus; never two systems on one property. `useGSAP` with `scope`; `gsap.matchMedia()` for `isDesktop (min-width:1024px) and (pointer:fine)`, `isMobile`, `reduceMotion`. One `gsap.ticker` for Lenis + record spin (Lenis sync: `lenis.on('scroll', ScrollTrigger.update)`, `lagSmoothing(0)`). `ScrollTrigger.refresh()` after `document.fonts.ready`; SplitText `autoSplit: true`. Hidden initial states only under `html.js-motion`. `will-change` only while animating. Pause everything off-screen and when the tab is hidden.

## 4. Performance & scroll (mandatory)
1. No pin / scroll-jacking / mandatory snap. "Sticky" = CSS `position: sticky`.
2. Lenis desktop only (`duration: 1.0`, `smoothWheel: true`, `syncTouch: false`); native scroll on touch; Lenis pauses only while a sheet is open.
3. Entrances `once: true`, never hide what's already visible; scrubs are decorative and content reads at any progress.
4. Compositor-only properties (see DESIGN.md).
5. Budgets on a mid-range phone/4G: LCP < 2.5s · CLS < 0.05 · INP < 200ms · 60fps · initial JS < 150KB gzip (lazy-load sheets, audio, reels). AVIF/WebP + `srcset`, lazy except the hero portrait, explicit dimensions, `content-visibility: auto` below the fold.
6. Reduced motion per DESIGN.md. Low-power (`hardwareConcurrency <= 4` / `saveData`): no parallax, reels show posters.
7. **Sound is opt-in only**; the AudioContext is created on the first click of the toggle.

---

## 5. Sections

**00 — INTRO (≤1.2s, first visit per session, skippable by tap/click/scroll/key).** `dark`. A thin cream waveform line draws across the center (`draw-line`) and resolves from noisy to a clean sine (`clarity`). Then "Cristian Calle" rises into view (`mask-lines`) in Inter Tight; below it, small: "Hi-Fi · high fidelity". The overlay fades out (opacity, 500ms) revealing the already-rendered hero. No tonearm, no jolt, no scramble. Any input finishes it in 200ms. Skipped on repeat visits, deep links and reduced motion.

**01 — NAVBAR.** Glass bar per DESIGN.md; links **Hi-Fi · Lo que hace · Sesiones · El buen vivir · Contacto**; sound toggle; "Hablemos" pill. Hides on fast scroll down, returns on scroll up. Wine ↔ cream with the section under it.

**02 — HERO.** `brand`, `100svh`. Eyebrow: "Santa Elena · Medellín". Display (`mask-lines`): **"Cristian Calle"**. Second line, Instrument Serif italic in brass: ***"Hi-Fi."*** Lead: "Eventos, música y experiencias en alta fidelidad." [AJUSTAR]. Buttons: **"Hablemos"** (primary → WhatsApp) and **"El lado B"** (secondary → section 07). His portrait cut in a circle (`clip-path` reveal) with the record behind it, partially visible, `record-spin` slow. A single hairline waveform below (`draw-line`). Nothing else.

**03 — QUÉ ES HI-FI (statement).** `dark`. A very large paragraph that lights up word by word (`highlight-words`): "High fidelity es reproducir algo tal como es. Sin ruido. Sin pérdida. Sin atajos. Cristian lleva esa idea a todo lo que hace: el sonido, la atención, el lugar, la comida y la gente." [AJUSTAR]. A hairline waveform beside it runs `clarity` (noisy → clean) scrubbed with the paragraph progress. Three small stats in a row (`reveal-up`, `counter` where numeric) [CONFIRMAR]; omit if no real data.

**04 — LO QUE HACE.** `brand`. Heading (`mask-lines`): "Lo que hace." Five List rows (DESIGN.md) from services; click opens a sheet with details [AJUSTAR] and "Cotizar por WhatsApp" prefilled with the service name. Rows reveal with `reveal-up`, stagger .06.

**05 — SESIONES.** `dark`. Heading: "Sesiones." Lead: "Algunas noches que ya sonaron." A horizontal rail of Session cards (posters) from config — native overflow scroll, snap proximity, arrows for desktop, keyboard operable (←/→), no wheel capture. Cards enter with `reveal-up`. "Próxima" tag when the date is in the future. CTA below: "Llévalo a tu evento" → contact.

**06 — LADO B (transition).** ~120svh, no pin. A sticky stage (CSS sticky) holds the record centered. While scrolling through it: the mood layers cross-fade wine → cream (`fade-through`, ease-io, scrubbed), the record scales down and its label brightens into a warm sun disc (opacity of stacked layers + scale), and the caption "Lado B" fades in. No flips, no rotation tricks. Reduced motion: static divider with "Lado B".

**07 — EL BUEN VIVIR.** `light`. Eyebrow "Lado B". Heading: ***"El buen vivir."*** (Instrument Serif italic accent on "buen vivir", wine). Line: "Café y bici, sol y monte, diversión y trabajo." Lead: "Cristian hace videos sobre crecimiento personal, desarrollo y el buen vivir: lo que aprende, lo que practica y la vida sencilla en la montaña." [AJUSTAR]. Three columns separated by hairlines: **Crecimiento personal** · **Desarrollo** · **Buen vivir**, each with a thin SVG icon (`draw-line`) and 2 lines [AJUSTAR]. Reels: 3–6 Reel frames (muted loop in view, or poster + link), mobile horizontal native scroll, desktop a calm row with `parallax` ≤ 4%. **Instagram block:** "Síguelo en Instagram." + "@kristohd13" + `counter` "1.432 seguidores" [from config, never fetched] + primary button **"Ver en Instagram"** (new tab, `rel="noopener"`) + secondary "Compartir" (Web Share API, WhatsApp fallback).

**08 — CONTACTO.** Back to wine (`fade-through`). `brand`, `100svh`. Heading: **"Hagamos algo en alta fidelidad."** Lead: "Cuéntale a Cristian qué tienes en mente." [AJUSTAR]. One-step form: Nombre · Celular (Colombia, 10 dígitos) · Tipo (chips: Evento privado · Boda · Música en la sala · Marca / empresa · Colaboración buen vivir) · Fecha (opcional) · Personas (opcional) · Lugar (opcional) · Mensaje. Inline validation; submit → prefilled WhatsApp (`encodeURIComponent`):
```
¡Hola Cristian! Te escribo desde tu página.
Soy {nombre} · Cel: {celular}
Tipo: {tipo} · Fecha: {fecha} · Personas: {personas}
Lugar: {lugar}
{mensaje}
```
Confirmation: the waveform line draws in and settles flat + "Copiar mensaje" fallback. Direct links: WhatsApp [PONER] · Instagram · Email [PONER].

**09 — FOOTER.** `dark`. "Cristian Calle" full width (measured font-size, Inter Tight 600, `reveal-up`); below, one hairline waveform that settles into a straight line. Small print: "© 2026 Cristian Calle · Santa Elena, Medellín." Links + "Volver arriba".

---

## 6. Data layer — `src/config/site.ts`
`person` (name, fullName, roles, location, instagram {handle, url, followers, posts}, whatsapp, email) · `services {id, title, line, details[], whatsappText}` · `sessions {id, title, subtitle, venue, presenter?, date (ISO), time, genres[], poster}` · `pillars` · `reels {poster, video?, url, caption}` · `images` · `copy` (UI strings + WhatsApp template). Validate at startup (Zod or typed guard); dev-only warning for missing fields.

## 7. Global details
- **Sound toggle** (DESIGN.md): off by default; fade 300ms; mutes on tab hidden; remembers preference.
- **Floating "Hablemos" pill** (WhatsApp), bottom-right, safe-area aware, after the hero, hidden in the contact section.
- **No custom cursor, no marquee, no grain.**
- **Anchors:** Lenis (desktop) / native smooth (mobile) with nav offset; update hash; move focus to the heading.
- **Responsive** 320px → 1920px+; mobile keeps every section and animation except parallax.

## 8. Accessibility & SEO
WCAG 2.2 AA, skip link, landmarks, one `h1`, keyboard operation everywhere (rows, sheets, rail, form, sound toggle), `aria-live="polite"` for form status, split text keeps `aria-label`, decorative SVG `aria-hidden`, touch targets ≥ 44px, `lang="es-CO"`.
**SEO:** title "Cristian Calle | Eventos, música y buen vivir en alta fidelidad · Medellín"; description "Cristian Calle organiza eventos y selecciona música en vinilo en Santa Elena, Medellín. Hi-Fi en todo lo que hace, y videos sobre crecimiento personal y el buen vivir."; canonical; Open Graph/Twitter 1200×630 (wine, cream wordmark, record); JSON-LD `Person` (+ `Event` for sessions with confirmed dates); sitemap, robots, manifest. Favicon: "CC" record monogram (SVG) + apple-touch-icon; `theme-color` `#5C1A24`.

## 9. Missing material (marked placeholders; dev overlay `?pending`)
WhatsApp · email · confirmed services · session years and permission to name venues · high-res photos and posters · 3–6 buen-vivir reels · short bio in his words · upcoming dates · logo if any. No testimonials until real ones exist.

## 10. Verification (before reporting)
1. `npm run build` with zero TS errors and zero console errors/warnings.
2. Playwright screenshots at 375×812, 768×1024, 1440×900 of every section (including mid-transition in section 06); no horizontal overflow at 320px.
3. Lighthouse mobile: Performance ≥ 90, Accessibility 100, Best Practices ≥ 95, SEO 100; report LCP, CLS, INP, JS size.
4. Keyboard-only, reduced-motion and no-JS passes.
5. Scroll never stuck, delayed or captured (wheel, trackpad, touch, keys), especially over the sessions rail.
6. Sound OFF by default; nothing plays before user input.
7. Grep the build for "Monte" → no results.
Report passed/failed with reasons and list remaining placeholders.

---

The result must feel like **an Apple product page for a record you want to own: wine-dark, silent, precise, and then, turning the page, full of morning light.** Prioritize typography, spacing and the smoothness of the scroll over the number of elements. When in doubt, remove.
