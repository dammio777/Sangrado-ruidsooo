# Build brief — Cristian Calle

You are a senior creative developer at a top-tier digital agency (Awwwards / FWA level). Build a premium, agency-grade personal-brand website (the quality of a USD $1,000+ project) for **Cristian Calle** (Cristian Calle Bustamante), event organizer and vinyl music selector from **Santa Elena, Medellín, Colombia**. The brand stands on two pillars:
1. **Hi-Fi** — *high fidelity*: everything he does (events, music, experiences, hospitality) is done in high quality, with no noise and nothing half-done.
2. **El buen vivir** — he makes videos about personal growth, self-development and living well.

## 0. How to work

**Source-of-truth order:** DESIGN.md (every visual decision: color, type, spacing, shape, surfaces, motion tokens and the named effect catalog) → this brief (content, structure, behavior) → your own judgment. Read DESIGN.md completely BEFORE writing code. Never invent a color, font, radius, duration or easing that isn't a token there. Effects in `backticks` refer to the DESIGN.md effect catalog.

**Before coding, output a short build plan** (max ~40 lines): section list, effect(s) per section, config data schema, assumptions. Then build without asking for confirmation. **After building, run the verification in section 11** and report results.

The prompt is in English; **all site copy is in Spanish (Colombia)**. Copy quoted below is the real copy to use; lines marked [AJUSTAR] are drafts to confirm with him.

### Golden rules
1. **HI-FI EN TODO:** the site itself must be the proof of "high fidelity": precise typography, clean edges, perfect timing, no noise. Every section must feel like tuning into a clear signal. If a section feels generic, loud or messy, fix it.
2. **THE SCROLL BELONGS TO THE USER:** animations never block, slow down, hijack or lengthen the scroll (section 5).
3. **CONTENT FIRST:** all content is in the initial HTML and readable without JS; animation only enhances.
4. **NOTHING FAKE:** no invented clients, venues, dates, years, testimonials or numbers. Unknown data → placeholders (section 10).
5. **NEVER mention "Monte Hi-Fi"** — not in copy, alt text, metadata, JSON-LD, comments, class names or file names. It's a past project and not part of this brand. "Hi-Fi" belongs to Cristian Calle as a personal philosophy.
6. **Two sides of one record:** the page is a vinyl record. **Lado A = Hi-Fi** (night, wine). **Lado B = El buen vivir** (day, cream). The flip between them is the centerpiece transition.

---

## 1. Information

- **Name:** Cristian Calle (full name: Cristian Calle Bustamante — use the full name only in metadata/JSON-LD).
- **What he is:** organizador de eventos y selector musical (DJ "selektor" in vinyl). Creator of experiences where sound, music, attention and atmosphere are all taken care of. Also a content creator about personal growth and *el buen vivir*.
- **Location:** Santa Elena, Medellín, Antioquia, Colombia.
- **Instagram:** @kristohd13 — https://www.instagram.com/kristohd13/ (1.432 seguidores, 30 publicaciones at time of writing [ACTUALIZAR]). Highlights: Plan Boda L&M · El buen vivir · Saboorr · Mera visita.
- **WhatsApp:** [PONER] → `https://wa.me/57XXXXXXXXXX`. **Email:** [PONER].
- **Music:** "solo música sabrosa" — rock, salsa, soul, jazz, blues y fusiones, classics on vinyl.
- **Past sessions / events (from his posters; years [CONFIRMAR]):**
  - **The B Side — Classics on vinyl.** Árboro × Gaia. 10 de julio, 8:00 p. m. Rock · Salsa · Soul · Jazz · Blues · Fusiones.
  - **Música en la sala.** Jaguarundí presenta Cristian Calle. "Un recorrido musical por las fiestas en la sala de la casa." Viernes 29 de mayo, 7:00 p. m. Vía Santa Elena km 10, sector La Rosita.
  - **Cristian Calle Selektor — de solo música sabrosa.** El Maizal (pub · laboratorio sonoro), Santa Elena, vereda El Plan. Viernes 15 de mayo.
  - **Árboro** — DJ session (photo with the neon sign) [CONFIRMAR details].
- **Services (Lado A), draft [CONFIRMAR list and wording]:**
  - A1 · Organización de eventos — de la idea al último tema de la noche.
  - A2 · Selektor en vinilo — sets de música sabrosa: rock, salsa, soul, jazz, blues y fusiones.
  - A3 · Música en la sala — sesiones íntimas y fiestas en casa con sonido de verdad.
  - A4 · Bodas y celebraciones — la música y la experiencia del día más importante (from the "Plan Boda L&M" highlight) [CONFIRMAR].
  - A5 · Experiencias con sabor — comida, música y lugar en la misma frecuencia (from the "Saboorr" highlight) [CONFIRMAR].
- **Hi-Fi philosophy (from his notes, rewritten for him):** high fidelity isn't only good sound: it's taking that same quality to everything an experience offers — the attention, the place, the food, the music, the people.
- **Buen vivir phrases (from his posts):** "Café y bici, sol y monte, diversión y trabajo." · "Gracias, papá Dios."
- **Voice:** warm, close, direct, paisa without caricature, confident without arrogance. Third person for him ("Cristian hace…") [AJUSTAR if he prefers first person].

### Photos
All images come from one central array in `src/config/site.ts` (`src`, `alt`, `width`, `height`, `category`). None available yet in high resolution → DESIGN.md placeholders. Wanted files: `retrato.jpg`, `cabina-arboro.jpg`, `vinilo-manos.jpg`, `sala-chesterfield.jpg`, `poster-b-side.jpg`, `poster-musica-en-la-sala.jpg`, `poster-selektor-maizal.jpg`, `buen-vivir-1..6.jpg` (or `.mp4` reels). Reference screenshots of his Instagram are in `ref/` (for art direction only — do not use them as images on the site).

---

## 2. Creative concept: "Lado A / Lado B"

The page is a record you play from start to finish. It opens with a **needle drop**: the record spins up, the tonearm lands, static becomes a clean signal and his name *tunes in*. **Lado A — Hi-Fi** is the night side: wine red, a listening room, his music and the experiences he builds, all told like a record sleeve with a tracklist and a crate of past sessions. Halfway down, **the record flips over**: wine fades into cream, "LADO A" turns into "LADO B", and the record becomes the morning sun over the mountain. **Lado B — El buen vivir** is daylight: coffee, bicycle, sun and mountain, and his videos about personal growth, with Instagram as the call to action. At the end the record flips back to wine for the contact section, and the footer is the runout groove: the waveform flattens and the tonearm lifts.

**Animation through-line: from noise to signal** — every key entrance resolves from static into clarity (`signal-scramble`, `noise-to-signal`), and the tonearm travels from the outer groove to the inner groove as you scroll (page progress).

---

## 3. Stack & architecture

**Stack:** Vite + React + TypeScript (strict) · Tailwind CSS v4 (DESIGN.md tokens via `@theme`) · GSAP with ScrollTrigger, SplitText, ScrambleText, Flip, DrawSVG, MorphSVG and CustomEase (all free; `@gsap/react` `useGSAP` for scoping/cleanup) · Motion (`motion/react`) for component state, layout, gestures, drag and modals · Lenis (desktop only) · Zustand for UI state (sound on/off, intro seen). Web Audio API for the optional sound (no audio files). Pin exact versions. No other animation/UI libraries.

**Rendering:** prerender to static HTML (e.g. `vite-react-ssg`) so content, meta and JSON-LD exist without JS.

**Single-file fallback:** if packages can't be installed, ONE `index.html` with GSAP + plugins and Lenis from a CDN (exact versions), vanilla JS modules, the same tokens and fonts embedded as base64 woff2 (latin subset). Every requirement still applies.

**File structure:**
```
src/
  config/site.ts        ← ALL editable data: contact, services, sessions, reels, images, copy
  styles/tokens.css     ← DESIGN.md Quick start
  lib/motion.ts         ← motion tokens (DESIGN.md)
  lib/gsap.ts           ← plugin registration + CustomEase "platter"
  lib/scroll.ts         ← Lenis + gsap.ticker sync
  lib/audio.ts          ← Web Audio: crackle generator, UI ticks, AnalyserNode (lazy, created on first ON)
  lib/signal.ts         ← procedural signal (sines + smoothed noise) shared by oscilloscope, eq-bars, VU
  lib/whatsapp.ts       ← message builder
  components/brand/     ← Record, Tonearm, VuMeter, EqBars, Oscilloscope, Waveform, Monogram
  components/ui/        ← Button, Chip, Sheet, Field, Toast, Marquee, SoundToggle
  components/sections/  ← one file per section below
```

**Animation architecture (mandatory):**
- **Ownership:** GSAP = scroll-linked effects, timelines, the record/tonearm/needle loop. Motion = component state, layout, drag, sheets. CSS = hover/focus. Never two systems on the same property of the same element.
- **One clock:** a single `gsap.ticker` drives Lenis, the record spin, the oscilloscope and the meters. Each subscriber checks its own visibility flag (IntersectionObserver) and returns early when off-screen; the whole ticker work stops on `visibilitychange` hidden.
- **Responsive & a11y:** `gsap.matchMedia()` with `isDesktop: (min-width: 1024px) and (pointer: fine)`, `isMobile: (max-width: 1023px)`, `reduceMotion: (prefers-reduced-motion: reduce)`.
- **Refresh discipline:** `ScrollTrigger.refresh()` after `document.fonts.ready` and above-the-fold image decode; SplitText with `autoSplit: true` + `onSplit`.
- **No FOUC:** hidden initial states only under `html.js-motion` (inline head script).
- **Hot paths:** `gsap.quickTo` for pointer/velocity-driven values; never create tweens inside `scroll`/`pointermove`.
- **Canvas:** oscilloscope is a 2D canvas, DPR capped at 2, 30fps cap, resized with `ResizeObserver`.

---

## 4. Content rules
Spanish (Colombia), warm and direct, short sentences. Dates with `Intl.DateTimeFormat('es-CO')`, 12-hour "8:00 p. m.". Microcopy for every state (sound on/off, sending, sent, error, empty).

---

## 5. Performance & scroll (mandatory)
1. **Zero scroll hijacking:** no `pin`, no pinned horizontal scroll, no mandatory `scroll-snap`, no `preventDefault` on wheel/touch/keys. The crate (section 06) is operated by drag, buttons and keys — it never captures the wheel.
2. **Lenis desktop only** (`duration: 1.0`, `smoothWheel: true`, `syncTouch: false`, `anchors` with nav offset). Native scroll on touch. Lenis stops only while a sheet/modal is open.
3. **Entrances** with ScrollTrigger `once: true`, 600–1000ms, never hiding visible content. Scrubs are decorative and never pinned.
4. **Compositor only:** `transform`, `opacity`, `clip-path`, SVG stroke / path morph. No `filter`, `width`, `height`, `top`, `box-shadow`, `backdrop-filter` animations.
5. **Pause what isn't visible:** record spin, oscilloscope, eq-bars, VU meters, marquee, reels, audio.
6. **Budgets (mid-range phone, 4G):** LCP < 2.5s · CLS < 0.05 · INP < 200ms · 60fps scroll · initial JS < 180KB gzip (lazy-load the crate interaction, sheets, audio and reels). AVIF/WebP + `srcset`, lazy except the hero portrait (`fetchpriority="high"`), dimensions always declared, `content-visibility: auto` below the fold.
7. **Reduced motion:** DESIGN.md table. Intro becomes a 300ms fade; record, oscilloscope, meters and marquee are static; all content visible.
8. **Low-power** (`hardwareConcurrency <= 4` or `saveData`): oscilloscope draws at 20fps, parallax off, reels show posters instead of autoplay.
9. **Sound is opt-in only:** never autoplay audio; the AudioContext is created on the first click of the toggle.

---

## 6. Structure & animation, section by section

**00 — INTRO "Needle drop" (≤1.8s, first visit of the session, skippable with tap/click/scroll/key).** `data-surface="dark"`. A record slides in from the right and spins up with the `platter` ease to 33⅓ RPM; the brass tonearm swings in and lands on the outer groove (on contact, the whole stage does a 1px vertical jolt, 60ms). A flat cream line across the screen turns into noisy static and then morphs into a clean sine wave (`noise-to-signal`, MorphSVG) while a VU needle sweeps up and settles (`needle` ease). "CRISTIAN CALLE" resolves letter by letter from static glyphs (`signal-scramble`, Fraunces display). Under it, mono "HI-FI" appears and briefly expands to "HI·gh FI·delity" (the missing letters unfold with a `clip-path` reveal) and collapses back to "HI-FI". End: the record shrinks and FLIPs (GSAP Flip) into its position behind the hero portrait, while the overlay opens as a circle (`clip-path: circle()`) from the record's center. The hero is already rendered underneath (overlay, never a gate). Any input → finishes in 250ms. Skipped on repeat visits (`sessionStorage`), deep links (`#hash`) and reduced motion. If sound was ON in a previous visit (localStorage), play a soft needle-drop + crackle; otherwise silent.

**01 — NAVBAR.** Per DESIGN.md: mini record mark spinning with scroll velocity + scroll-progress ring, wordmark "Cristian Calle", links **Hi-Fi · Lo que hace · Sesiones · El buen vivir · Contacto** (active indicator slides with `layoutId`), sound toggle "SONIDO" with eq-bars, CTA "Hablemos". Switches between wine and cream with the section under it (`data-surface`, 320ms cross-fade). Hides on fast scroll down, returns on scroll up. Mobile full-screen menu with links labeled "A1 Hi-Fi, A2 Lo que hace, A3 Sesiones, B1 El buen vivir, B2 Contacto".

**02 — HERO (Lado A).** `data-surface="brand"`, `min-height: 100svh`.
- Top-left mono label: "CC-001 · LADO A · SANTA ELENA, MEDELLÍN" (`signal-scramble`).
- Display: **"Cristian Calle"** (`mask-lines`, Fraunces 300) and below, in Fraunces italic brass: **"Hi-Fi"**, with a small mono footnote "(high fidelity)".
- Lead: "Eventos, música y experiencias en alta fidelidad: buen sonido, buena música y cada detalle en su punto." [AJUSTAR]
- Buttons: **"Hablemos de tu evento"** (primary → WhatsApp, `magnetic`) and **"Escuchar el lado B"** (secondary → smooth scroll to section 08).
- Right (desktop) / below (mobile): his portrait cut in a circle (`clip-path: circle()` reveal from 0 to 50%), with the big record behind it peeking out to the right and spinning (`record-spin`), the conic sheen following the cursor angle, and the brass tonearm resting on the record edge. This mirrors his posters (portrait over a circle).
- Bottom: full-width **oscilloscope** line (DESIGN.md component) reacting to scroll velocity and cursor.
- Fixed in the left margin on desktop (not inside the hero): a thin vertical **tonearm progress** — a brass line with a needle head that travels down as the page progresses (`tonearm`, scrubbed with total page progress).

**03 — MARQUEE.** `data-surface="brand"`. Row 1 (Fraunces italic, cream): "Rock ✦ Salsa ✦ Soul ✦ Jazz ✦ Blues ✦ Fusiones ✦ Clásicos en vinilo ✦". Row 2 (mono UPPERCASE, rose, opposite direction): "MÚSICA SABROSA · EVENTOS · EXPERIENCIAS · SANTA ELENA · MEDELLÍN ·". Separator: mini spinning record. `velocity-skew` + speed boost with scroll velocity. Paused off-screen.

**04 — QUÉ ES HI-FI (manifesto).** `data-surface="dark"`.
- Eyebrow: "HI-FI = HIGH FIDELITY" (`signal-scramble`).
- Big paragraph (`highlight-words`): "High fidelity es reproducir algo tal como es: sin ruido, sin pérdida, sin atajos. Cristian lleva esa idea a todo lo que hace. No solo al sonido: también a la atención, al lugar, a la comida, a la música y a la gente. Nada a medias. Todo en alta fidelidad." [AJUSTAR]
- Side column: a "spec sheet" like an amplifier manual, in Plex Mono with brass hairlines, rows revealing with `reveal-up`: "Respuesta: de la primera idea al último tema" · "Ruido: 0" · "Fidelidad: 100 %" · "Formato: vinilo, en vivo, en la sala" · "Origen: Santa Elena, Medellín" [AJUSTAR].
- Behind the paragraph, a `noise-to-signal` layer: a local grain overlay fades out and a waveform morphs from noisy to clean as the paragraph lights up (same scrub).
- A VU meter (`vu-needle`) whose needle follows scroll velocity; the ámbar peak lamp flashes on fast scroll.

**05 — LO QUE HACE (tracklist, Lado A).** `data-surface="brand"`. Heading "Lo que hace" (`mask-lines`) + mono "LADO A · 5 TEMAS". Tracklist rows A1–A5 from section 1 (DESIGN.md "Tracklist row"): hover/focus plays the row's mini waveform with a running playhead; a medium record on the left (desktop, sticky inside the section via CSS `position: sticky` — not GSAP pin) rotates its label to show the active track number and the tonearm moves to that track's "groove". Click/Enter opens a bottom sheet with the detail, what's included [AJUSTAR], and "Cotizar por WhatsApp" (prefilled with the service name). If sound is ON, each hover plays a soft UI tick (Web Audio).

**06 — SESIONES "Buscar en la caja" (signature experience).** `data-surface="dark"`. Heading "Sesiones" + lead "Algunas noches que ya sonaron." A **crate of record sleeves** (the event posters) seen in 3D perspective (perspective 1400px), each sleeve leaning back (`rotateX` 0→−28° depending on its distance to the active one). Interaction: drag up/down (Motion drag with momentum and snapping to sleeves), arrow buttons, and keyboard (↑/↓, Enter) flip through them — the active sleeve stands upright and lifts (`--sh-lift`). Enter/click → `sleeve-pull`: the sleeve rises and the vinyl slides out with `record-spin`, showing title, venue, date and genres in mono. Mobile: the crate becomes a horizontal native-scroll carousel of sleeves with `scroll-snap-type: x proximity` (inside the component only); tap to pull. Data from config: The B Side (Árboro × Gaia), Música en la sala (Jaguarundí), Selektor (El Maizal), Árboro session [CONFIRMAR]. Each session has `date` → shows "PRÓXIMA" stamp (ámbar) if in the future, otherwise "SONÓ EL…". CTA below: "Llévalo a tu evento" → contact. Accessible fallback: the crate is a list of buttons with full text.

**07 — LADO B (the flip).** No pin. A ~140svh tall section with the big record centered (`position: sticky` inside the section). As you scroll through it: `record-flip` (rotateY 0→180°, label "LADO A · HI-FI" → "LADO B · EL BUEN VIVIR" switched at 90°), the mood layers cross-fade wine → cream (DESIGN.md 1.7), the record's grooves fade out and its label grows into a warm sun disc (scale + color via opacity of stacked layers), and the oscilloscope line becomes the mountain horizon (MorphSVG from wave to a ridge line). Mono caption scrambles in: "DALE VUELTA AL DISCO". Reduced motion: a static divider with "LADO B" and the cream section starts directly.

**08 — EL BUEN VIVIR (Lado B).** `data-surface="light"`.
- Eyebrow: "CC-002 · LADO B" (`signal-scramble`, now in wine).
- Heading: **"El buen vivir"** (Fraunces italic, wine, `mask-lines`), the sun disc from section 07 rising behind it (`parallax`).
- Line in Fraunces accent: "Café y bici, sol y monte, diversión y trabajo."
- Lead: "Cristian hace videos sobre crecimiento personal, desarrollo y el buen vivir: lo que aprende, lo que practica y la vida sencilla en la montaña, contado sin filtro." [AJUSTAR]
- Three pillars (DESIGN.md "Pillar card", icons draw in with `waveform-draw`): **Crecimiento personal** — "Hábitos, decisiones y aprendizajes para ser mejor cada día." · **Desarrollo** — "Trabajo, disciplina y propósito: crecer haciendo." · **Buen vivir** — "Sol, monte, buena mesa, buena música y gratitud." [AJUSTAR]
- Reels strip: 3–6 vertical "Reel frames" from config (`video` mp4 muted loop autoplaying only in view, or `poster` + link to the Instagram post). Desktop: offset grid with `parallax` at different speeds; mobile: horizontal native scroll. Each frame opens the Instagram post in a new tab.
- **Instagram CTA block:** large Fraunces "Síguelo en Instagram", the handle "@kristohd13" in mono that `signal-scramble`s on hover, a tape-counter `counter` "1.432 seguidores" [ACTUALIZAR — value comes from config, never fetched], and the primary button **"Ver en Instagram"** (`https://www.instagram.com/kristohd13/`, `rel="noopener"`). Secondary: "Compartir" (Web Share API, WhatsApp fallback).

**09 — CONTACTO "Hablemos" (back to wine).** Mood cross-fades cream → wine. `data-surface="brand"`, `min-height: 100svh`.
- Heading (`mask-lines`): **"Hagamos algo en alta fidelidad."**
- Lead: "Cuéntale a Cristian qué tienes en mente: un evento, una fiesta en casa, una boda o una colaboración." [AJUSTAR]
- Single-step form (DESIGN.md fields): Nombre · Celular (Colombia, 10 dígitos) · Tipo (chips: Evento privado · Boda · Música en la sala · Marca / empresa · Colaboración buen vivir) · Fecha (optional, date picker) · Número de personas (optional) · Lugar (optional) · Mensaje. Inline validation, submit disabled until valid.
- Submit → prefilled WhatsApp (`encodeURIComponent`):
  ```
  ¡Hola Cristian! Te escribo desde tu página.
  Soy {nombre} · Cel: {celular}
  Tipo: {tipo} · Fecha: {fecha} · Personas: {personas}
  Lugar: {lugar}
  {mensaje}
  ```
  Confirmation inside the section: a waveform that draws in and settles into a clean line + "Copiar mensaje" fallback.
- Side: direct links WhatsApp [PONER] · Instagram @kristohd13 · Email [PONER], each with a mono label.

**10 — FOOTER (runout groove).** `data-surface="dark"`. Giant "Cristian Calle" spanning the full width (font-size fitted by measurement, Fraunces 300) whose letters rise with `mask-lines` (chars) on enter. Under it, a waveform line that flattens to a straight line as you reach the very bottom (scrub), while the tonearm progress lifts off (rotates back to rest) at 100%. Small print in mono: "© 2026 Cristian Calle · Santa Elena, Medellín · Hecho en alta fidelidad." Links, Instagram, WhatsApp. Button "Volver al lado A ↑" (Lenis `scrollTo` desktop / native smooth on mobile) — the record mark spins backwards while it scrolls up.

---

## 7. Data layer — `src/config/site.ts`
- `person`: name, fullName, roles, location, instagram { handle, url, followers, posts }, whatsapp, email.
- `services`: `{ id: "A1", title, line, details[], whatsappText }[]`.
- `sessions`: `{ id, title, subtitle, venue, presenter?, date (ISO, year [CONFIRMAR]), time, address?, genres[], poster }[]`.
- `pillars`, `reels: { poster, video?, url, caption }[]`, `images`, `copy` (all UI strings and the WhatsApp template).
- Validate at startup (Zod or typed guard); dev-only warning listing missing fields.

## 8. Global details
- **Sound (opt-in):** DESIGN.md "Sound toggle". `lib/audio.ts` synthesizes: vinyl crackle (filtered noise + random impulse pops, very low volume), a needle-drop thump (short low sine + noise burst), UI ticks (5ms clicks). When ON, `eq-bars`, VU and oscilloscope read the AnalyserNode; when OFF they use `lib/signal.ts`. Fade in/out 300ms; mute on tab hidden.
- **Cursor (desktop):** small cream dot + ring; over the record the ring becomes a rotating dashed circle with "GIRAR" (and dragging the hero record scratches it: rotation follows the pointer, then returns to 33⅓ RPM with inertia); over sleeves and reels the ring says "VER". Off on touch, coarse pointers and reduced motion. Never hides the native text cursor in fields.
- **Floating button:** bottom-right WhatsApp pill "Hablemos" (safe-area aware), appears after the hero, hides while the contact section is visible.
- **Palette demo (optional):** `?demo` shows the 3 DESIGN.md palettes switched via View Transition.
- **Anchors:** nav links smooth-scroll with nav offset, update the hash, move focus to the section heading.
- **Responsive** 320px → 1920px+. On mobile: no custom cursor, no parallax, lighter oscilloscope, crate as horizontal carousel; intro, scramble, reveals, flip (simplified: 2D scaleX flip) and sound still work.

## 9. Accessibility & SEO
- WCAG 2.2 AA (contrast per DESIGN.md), skip link, landmarks, one `h1` ("Cristian Calle"), logical headings, everything keyboard-operable (tracklist, crate, sheets, form, sound toggle), `aria-live="polite"` for form status, split/scrambled text keeps an `aria-label` with the real text and `aria-hidden` fragments, decorative SVG/canvas `aria-hidden`, touch targets ≥ 44px, `lang="es-CO"`.
- **SEO:** title "Cristian Calle | Eventos, música y buen vivir en alta fidelidad · Medellín"; meta description: "Cristian Calle organiza eventos y selecciona música en vinilo en Santa Elena, Medellín. Hi-Fi en todo lo que hace, y videos sobre crecimiento personal y el buen vivir." Canonical, Open Graph/Twitter 1200×630 (wine background, cream wordmark, record). JSON-LD: `Person` (name "Cristian Calle Bustamante", jobTitle "Organizador de eventos y selector musical", address Santa Elena, Medellín, sameAs Instagram) + `Event` for each session with a confirmed date. `sitemap.xml`, `robots.txt`, `manifest.webmanifest`.
- **Favicon:** "CC" monogram on a record label (SVG, with a light-mode variant) + 180px apple-touch-icon; `theme-color` `#5C1A24`.

## 10. Missing material (shown as marked placeholders; dev overlay with `?pending`)
WhatsApp number · email · confirmed service list and descriptions · years of each session and permission to name venues (Árboro × Gaia, Jaguarundí, El Maizal) · high-res photos (portrait, DJ booth, vinyl, sala) · poster files · 3–6 "buen vivir" reels (mp4 or post URLs) · a short bio in his own words · any upcoming dates · testimonials (none on the page until real ones exist) · logo (if he has one; otherwise the typographic wordmark + CC monogram from DESIGN.md is the identity).

## 11. Verification & acceptance (before reporting)
1. `npm run build` passes, zero TS errors, zero console errors/warnings.
2. Playwright screenshots at 375×812, 768×1024, 1440×900 of every section (including mid-flip in section 07); no horizontal overflow at 320px.
3. Lighthouse mobile: Performance ≥ 90, Accessibility 100, Best Practices ≥ 95, SEO 100; report LCP, CLS, INP and total JS.
4. Keyboard-only pass (tracklist, crate, sheets, form, sound toggle, menu).
5. Reduced-motion pass and no-JS pass: all content readable.
6. Scroll check with wheel, trackpad, touch and keys: never stuck, delayed or captured — especially over the crate and the flip section.
7. Sound: OFF by default, nothing plays before user input, toggling works, state persists, audio stops on tab hidden.
8. Grep the build output for "Monte" — must return nothing.
Report each item as passed / failed (with reason) and list remaining placeholders.

---

The result must feel like **a beautifully reissued record from the '70s that you play from Side A to Side B: a wine-red night of music in high fidelity that turns into a sunny morning on the mountain.** Prioritize scroll smoothness, the craft of the animations and the typography over the number of elements. When in doubt, remove.
