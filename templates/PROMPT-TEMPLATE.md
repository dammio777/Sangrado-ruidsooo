<!--
HOW TO USE THIS TEMPLATE (delete this block before sending)
1. Replace everything inside {{ }} with the business data.
2. Anything you don't have yet: leave [CONFIRM] or [ADD]. The site shows it as a marked placeholder.
3. Delete sections marked (OPTIONAL) that don't apply.
4. Send this file together with DESIGN.md, the logo (SVG or transparent PNG) and every photo you have.
5. Rule: this file is the BUSINESS and the EXPERIENCE. Colors, type, shapes and motion values live only in DESIGN.md.
6. The prompt is in English; the site copy is written in {{SITE LANGUAGE, e.g. Spanish (Colombia)}}. Quote real copy in that language.
-->

# Build brief — {{NAME}}

You are a senior creative developer at a top-tier digital agency (Awwwards / FWA level). Build a premium, agency-grade website (the quality of a USD $1,000+ project) for **{{NAME}}**, {{WHAT IT IS IN ONE SENTENCE, e.g. "an Italian restaurant" / "a hardcore punk band"}} in {{AREA}}, {{CITY}}, {{COUNTRY}}.

## 0. How to work

**Source-of-truth order:** DESIGN.md (every visual decision: color, type, spacing, shape, surfaces, motion tokens and the named effect catalog) → this brief (business, content, structure, behavior) → your own judgment. Read DESIGN.md completely BEFORE writing any code. Never invent a color, font, radius, duration or easing that is not a token there. When this brief names an effect in `backticks` (e.g. `mask-lines`, `clip-wipe`), use that exact spec from the DESIGN.md effect catalog.

**Before coding, output a short build plan** (max ~40 lines): the section list, the named effect(s) each section uses, the data schema of the config file, and any assumption you're making. Then build without asking for confirmation.

**After building, verify** (section 12) and report what passed, what failed and what's still a placeholder.

### Golden rules
1. **{{THE BUSINESS FOCUS IN CAPS, e.g. SHARING / THE GOLDEN HOUR / NO LABELS / LOUD AND HONEST}}:** {{2 lines on what every section must make people feel, e.g. "everything is designed for a group of friends; every section answers 'how do I live this with my people?'"}}. If a section doesn't convey it, fix it.
2. **THE SCROLL BELONGS TO THE USER:** animations never block, slow down, hijack or lengthen the scroll. Follow section 5 "Performance & scroll" to the letter. The site must feel fluid, light and great under the finger and the mouse.
3. **CONTENT FIRST, MOTION SECOND:** all content is in the initial HTML and readable without JavaScript. Animation enhances; it never gates content. If an animation fails, the page is still complete.
4. **NOTHING FAKE:** no invented prices, addresses, reviews, coordinates, phone numbers or awards. Unknown data uses the marked placeholders from section 11.
5. {{(OPTIONAL, if there are no photos) NO PHOTOS FOR NOW: no stock, web or AI-generated photography. The only image allowed is the logo. Wherever a photo will go, use the DESIGN.md placeholder frame labeled "Foto próximamente".}}

---

## 1. Business information

- **Name:** {{NAME}} {{(how it's written in the logo, if different)}}.
- **What it is:** {{type of business}}. Tagline: "{{TAGLINE FROM BIO OR LOGO}}".
- **Location:** {{AREA / NEIGHBORHOOD}}, {{CITY}}. {{How to get there, e.g. "on the way to the park"}}. Exact address: [ADD].
- **Instagram:** @{{handle}} ({{followers}} followers, {{posts}} posts). Highlights: {{list}}.
- **Current link:** {{linktree / biolink / none}}.
- **WhatsApp & phone:** {{NUMBER or [ADD]}} → `https://wa.me/{{COUNTRY CODE}}{{NUMBER, NO SPACES}}`.
- **Hours:** {{DAYS AND HOURS or [ADD]}} [CONFIRM if the bio and posts disagree]. Time zone: `{{America/Bogota}}`.
- **Delivery:** {{yes / no}}. Zones and cost: [CONFIRM].
- **Reservations:** {{yes / no / via WhatsApp}}.
- **Menu / products / services:** {{what's visible on their Instagram, with real names; [SEND full menu with prices]}}
  - {{Item 1 — short description (from their caption if there is one)}}
  - {{Item 2 — …}}
  - {{Item 3 — …}}
- **The place:** {{physical description: materials, plants, lights, view, tables, what the photos show}}.
- **Brand phrases (from their posts):** "{{phrase 1}}", "{{phrase 2}}".
- **Neighbors / allies:** {{other local businesses that follow or cross-promote them}} [CONFIRM if they want to appear].
- **Brand voice:** {{e.g. warm, close and relaxed / funny, like a group chat / elegant without pretension / raw and direct}}.
- **Currency & formats:** {{COP, "$45.000" with dot thousands separator}}, {{12-hour "7:00 p. m."}}, locale `{{es-CO}}`.

### Available photos
All images are read from one central data array (field `src`, plus `alt`, `width`, `height`, `category`) so they can be swapped without touching the design:
{{`place.jpg`, `dish-1.jpg`, `dish-2.jpg`, `drink.jpg`, `people.jpg`, `logo.svg`}}. Anything missing uses the DESIGN.md placeholder frame.

---

## 2. Creative concept: "{{CONCEPT NAME}}"

{{4–6 lines. What story the page tells from top to bottom (e.g. from a message in the group chat to a full table; from afternoon to night; from labeled to free; from the rehearsal room to the stage). Which signature shape repeats. Which DESIGN.md signature motion carries the story.}}

**Animation through-line:** {{from X to Y, e.g. "things start scattered and end assembled", "light goes from day to night", "everything starts as a photocopy and ends printed in ink"}}. Every section moves the story one step along it.

---

## 3. Stack & architecture

**Stack:** Vite + React + TypeScript (strict) · Tailwind CSS v4 (tokens from DESIGN.md mapped with `@theme`) · GSAP with ScrollTrigger, SplitText, Flip, DrawSVG, MorphSVG and CustomEase (all free plugins; use `@gsap/react` `useGSAP` for scoping and cleanup) · Motion (`motion/react`) for component state, layout, gestures, drag and modals · Lenis for desktop smooth scroll · Zustand (with `persist`) for the order/booking state. Pin exact versions (no `^`, no `latest`). No other animation or UI libraries.
{{(OPTIONAL) Hero WebGL: OGL (preferred, tiny) or three.js for a single shader effect — see section 6, 02.}}

**Rendering:** prerender every route to static HTML at build time (e.g. `vite-react-ssg` or an equivalent prerender step) so content, meta tags and JSON-LD exist without JS. Hydrate on the client.

**Single-file fallback:** if the environment can't install packages, deliver ONE `index.html` with GSAP + plugins and Lenis from a CDN (exact versions), vanilla JS modules instead of React, the same tokens, and fonts embedded as base64 woff2 (latin subset) so they render even if the viewer blocks Google Fonts. Every requirement in this brief still applies.

**File structure:**
```
src/
  config/site.ts          ← ALL editable business data (see section 7)
  styles/tokens.css       ← copied from DESIGN.md Quick start
  styles/globals.css
  lib/motion.ts           ← motion tokens from DESIGN.md (the only source of durations/eases/springs)
  lib/gsap.ts             ← registers plugins + CustomEase once
  lib/scroll.ts           ← Lenis setup + GSAP ticker sync
  lib/hours.ts            ← open-now logic (time zone, overnight hours, holidays)
  lib/whatsapp.ts         ← message builder + wa.me URL
  lib/storage.ts          ← safe localStorage (try/catch, versioned keys)
  hooks/                  ← useReducedMotion, usePointerFine, useInViewport, useOpenStatus, useSectionSurface
  components/ui/          ← Button, IconButton, Chip, Sheet, Modal, Field, Toast, Marquee…
  components/sections/    ← one file per section in section 6
  components/order/       ← the conversion system of section 8
  store/order.ts          ← Zustand store
```

**Animation architecture (mandatory):**
- **Ownership:** GSAP owns scroll-linked effects and timelines. Motion owns component state, layout, gestures and enter/exit. CSS owns hover, focus and simple transitions. Never two systems animating the same property of the same element.
- **Scoping & cleanup:** every GSAP effect lives in `useGSAP(() => {…}, { scope: ref })`; no global selectors, no leaks on unmount or HMR.
- **Responsive & a11y branches:** wrap effects in `gsap.matchMedia()` with conditions `isDesktop: (min-width: 1024px) and (pointer: fine)`, `isMobile: (max-width: 1023px)`, `reduceMotion: (prefers-reduced-motion: reduce)`; each branch builds its own version and auto-reverts.
- **Lenis ↔ ScrollTrigger sync:** `lenis.on('scroll', ScrollTrigger.update)`, `gsap.ticker.add(t => lenis.raf(t * 1000))`, `gsap.ticker.lagSmoothing(0)`. One RAF loop for the whole site.
- **Refresh discipline:** `ScrollTrigger.refresh()` after `document.fonts.ready`, after above-the-fold images decode, and on container resize (debounced). Split text uses `SplitText` `autoSplit: true` + `onSplit` so lines re-split on resize and font load.
- **No flash of un-animated content:** initial hidden states are applied by a class `html.js-motion` set in an inline `<head>` script; without JS (or with reduced motion) everything is visible.
- **Hot paths:** pointer-driven effects use `gsap.quickTo` / `quickSetter`; never create tweens inside `mousemove` or `scroll` handlers. Read layout once, write in RAF.
- **`will-change`** only during an animation (set on start, removed on complete).

---

## 4. Content & copy rules
- All copy in {{SITE LANGUAGE}}, tone {{TONE}}. Short sentences, active voice, no corporate filler.
- Microcopy for every state: empty cart, loading, error, closed, sold out, success, offline.
- Numbers, prices and times use the locale formats from section 1 via `Intl.NumberFormat` / `Intl.DateTimeFormat`.

---

## 5. Performance & scroll (mandatory)

1. **Zero scroll hijacking:** no `pin`, no pinned horizontal scroll, no mandatory `scroll-snap`, no `preventDefault` on wheel, touch or keys. The user scrolls at their own pace in either direction, even mid-animation.
2. **Lenis on desktop only** (`duration: 1.0`, `smoothWheel: true`, `syncTouch: false`, `anchors: true` with the nav offset). Mobile and tablet: 100% native scroll. Lenis stops only while a modal/sheet is open; `data-lenis-prevent` on scrollable panels.
3. **Animations that don't wait:** entrances via ScrollTrigger `once: true` (or IntersectionObserver), 600–900ms, never hiding something the user already sees. Scrub effects are decorative, never pinned, and content reads fine at any progress.
4. **Compositor only:** `transform`, `opacity`, `clip-path` (+ SVG stroke for draw effects). Never animate `filter`, `width`, `height`, `top`, `box-shadow` or `backdrop-filter`.
5. **Floating UI never gets in the way:** chats, notices and floating buttons don't block scroll, don't dim the page, and can be minimized or closed. They never cover the primary CTA on mobile.
6. **Pause what isn't visible:** loops (chat, marquee, particles, shaders, pulses) pause off-screen and when `document.visibilityState === "hidden"`.
7. **Budgets (measured on a mid-range phone, 4G):** LCP < 2.5s · CLS < 0.05 · INP < 200ms · 60fps while scrolling · initial JS < 180KB gzip (code-split modals, lightbox, games, WebGL with `lazy()` / dynamic `import()`). Images AVIF/WebP with `srcset`/`sizes`, `loading="lazy"` except the hero (`fetchpriority="high"`), `width`/`height` always declared. Below-the-fold sections use `content-visibility: auto` with `contain-intrinsic-size`.
8. **prefers-reduced-motion:** follow the DESIGN.md reduced-motion table. No animated intro (300ms fade), no scrub, no parallax, no loops; the chat shows the full conversation. Everything visible and usable.
9. **Low-power devices:** if `navigator.hardwareConcurrency <= 4` or `navigator.connection?.saveData`, disable WebGL, parallax and the custom cursor automatically.

---

## 6. Structure & animation, section by section
Each section sets `data-surface` (light / dark / brand) from DESIGN.md. Effects in `backticks` refer to the DESIGN.md catalog.

**00 — INTRO (max 1.6s, first visit of the session only, skippable with a tap, click, scroll or key).** {{Background color}}. {{The signature shape draws itself with `draw-path` / `morph`s from a dot into the logo}}. {{The name enters: `chars-stamp` / tracking that opens / letter by letter}}. {{A business-specific detail, e.g. two glasses clink, a die rolls, a label peels, an amp light turns on}}. It ends with {{the transition that reveals the hero, e.g. a circular `clip-path` that expands from the logo}}, and the logo FLIPs (GSAP Flip) into its navbar position. The hero is already rendered underneath (the intro is an overlay, never a gate). Any user input accelerates it to the end in 250ms. Skipped on repeat visits (`sessionStorage`), on deep links (`#hash`) and with reduced motion.

**01 — NAVBAR.** {{Transparent over the hero / floating pill}}; after 80px of scroll it compacts and becomes {{glass pill / bordered with shadow}}. Logo left; links: {{Menu, X, Y, Visit us}} with an active-section indicator that slides (`layoutId`, driven by IntersectionObserver). Right: live status "● Open / ● Closed" and the button "{{MAIN CTA, e.g. Reserve / Your order (0)}}" whose counter rolls when it changes. Hides on fast scroll down, returns on scroll up, always visible when focus is inside it. Mobile: full-screen menu, links enter with `mask-words` staggered, focus trapped, `Esc` closes.

**02 — HERO.** Headline revealed with `mask-lines` → `mask-words`: "{{HEADLINE}}" ({{accent word}} in {{accent color or font}}, with {{a micro-effect, e.g. the accent word cycles through 3 alternatives every 2.5s with a vertical roll}}). Subtitle: "{{location + hours + promise in 1–2 lines}}". Buttons: "{{CTA 1}}" (primary, `magnetic` on desktop) and "{{CTA 2}}" (secondary). {{Below: 3 attribute chips, e.g. "Al aire libre · Pet friendly · Domicilios"}}. {{Right: main photo with `clip-wipe` / illustration / interactive piece of the concept}}. The LCP element (headline or photo) is visible in the first paint — its animation starts from a visible state or completes within 600ms.
{{(OPTIONAL) WebGL layer: one fragment shader on the hero photo ({{e.g. liquid distortion following the cursor / grain + chromatic offset for D / heat haze}}), OGL, DPR capped at 1.5, renders only while the hero is in view, falls back to the static image on low-power, reduced motion or WebGL failure. Lazy-loaded after LCP.}}

**Chat window "{{GROUP NAME, e.g. El parche}}"** (OPTIONAL, recommended for businesses people go to in groups): a messaging-app window that pops in with spring {{1.2s after the intro}}, anchored to the photo's corner (desktop) or below the buttons (mobile). Header with logo avatar, group name and dynamic subtitle "{{Name}} está escribiendo…". 3-dot indicator before each message (900ms) and a 250ms pop per bubble. Conversation (in site language):
1. {{Friend}} (received): "{{e.g. Oye, ¿vamos a NAME?}}"
2. You (sent): "{{¿Dónde queda?}}"
3. {{Friend}}: "{{answer with the location or the hook of the business}}"
4. You: "{{¿Y hoy abren?}}"
5. {{Friend}}: [LIVE answer from `lib/hours.ts`: open → "{{¡Sí! Hasta las HH}}"; opens later today → "{{Hoy desde las HH}}"; closed → "{{Abren el DÍA. Separemos mesa}}"]
6. You: "{{closing line that leads to action}}"
7. System chip with a button "{{action, e.g. Unirme a la mesa}}" that smooth-scrolls to the key section.
Runs once (replay button "↻"), minimizes to a round logo bubble or closes, runs only while the hero is on screen, and is announced with `aria-live="polite"`.

**03 — MARQUEE.** {{Color}} band with infinite text: "{{WORD ✦ WORD ✦ WORD ✦ AREA ✦}}" with {{the signature shape}} as separator. Base speed {{40}}px/s, `velocity-skew` and a speed boost proportional to scroll velocity (decays back in 0.6s; direction flips with scroll direction). Two rows in opposite directions {{(optional)}}. Paused off-screen.

**04 — {{THE PLACE SECTION, e.g. BAJO EL CIELO ABIERTO}}.** {{Photo of the place that grows from a rounded card to full bleed with `scrub-grow` (NO pin), image counter-scaling 1.15→1 inside the mask, and 3–4 floating captions that enter with `reveal-up` at different scroll offsets (layered parallax 2–8%): "{{fact 1}}", "{{fact 2}}", "{{fact 3}}"}}. Mobile: full-width photo with `clip-wipe` and captions in a horizontal swipeable row (native overflow scroll with `scroll-snap-type: x proximity`, which is allowed because it's inside a component, not the page).

**05 — MANIFESTO.** A large paragraph that lights up word by word with `highlight-words`: "{{3–4 sentences with the philosophy of the business}}" [ADJUST WITH THE OWNER]. Beside it: {{brand phrase in the accent font}} and a `counter` "{{N}}K {{friends / community}} en Instagram". {{The signature shape draws itself in the margin as the paragraph progresses (`draw-path` scrubbed).}}

**06 — MENU / PRODUCTS.** Headline: "{{headline}}" (`mask-lines`). Filters: {{Cat 1 · Cat 2 · Cat 3 · Drinks · Desserts}} [ADJUST TO THE REAL MENU] as chips with a sliding active background; the filter is reflected in the URL (`?cat=`). {{Format: photo bento / rows with dotted leader / tabs}}. Each product: name, short description, price [ADD], {{portion tag, e.g. "para 2–3"}} and a "+" button that adds to the order with a **fly-to-cart** animation (a clone of the thumbnail travels on a curved path to the navbar button using a GSAP timeline with x/y on different eases, then the counter rolls and the button does a 1-frame `press`). Tapping a product opens a modal via `shared-element` with details, quantity, note and "Agregar". Filtering reflows with `flip-layout`, no jumps. Sold-out items per DESIGN.md.

**07 — {{THE SIGNATURE EXPERIENCE}}.** {{The interactive section that makes this page unique. Proven examples: "Arma la mesa" (table seen from above: pick number of people, drag dishes to the center with Motion drag + snap, split the bill live, and "Mandar al parche" with the table encoded in the URL); "Despega la etiqueta" (draggable labels that fly off with inertia); "¿Qué pido?" (a die with a physics-like roll that recommends a dish); "Verde × Brasa" (split screen that blends as you drag a handle). Describe: what the user sees, what they do, what happens, how it's operable by keyboard, and which button ends it (always WhatsApp or the order). Lazy-load its code when the section approaches the viewport.}}

**08 — {{GAME OR FUN DETAIL}}** (OPTIONAL). {{E.g. "¿Quién invita la próxima?" spin-the-bottle with the group's names; dessert roulette; table raffle}}. Fast, light, keyboard-operable, and a "Compartir resultado" button (Web Share API, WhatsApp fallback).

**09 — {{DAY JOURNEY / STEPS / STORY}}** (OPTIONAL). {{3 vertical blocks (no horizontal scroll, no pin) with a big time or step + a sentence + a photo. E.g. "4:00 p. m. — …", "7:00 p. m. — …", "11:00 p. m. — …"}}. A thin progress line on the left draws with scroll (`draw-path` scrubbed). {{If the concept goes from day to night, the mood layers cross-fade per block as described in DESIGN.md 1.7}}.

**10 — EVENTS** (OPTIONAL). Headline "{{HAY PLAN}}". Cards with a big date, name, what's included and a "PRÓXIMO" stamp (`chars-stamp`) with a live countdown (tabular nums, updates every second only while visible). "Apuntarme" button → WhatsApp with the event prefilled, plus "Añadir al calendario" (.ics download). Past events auto-hide. Editable list in the config. {{Sample event from their Instagram [CONFIRM]}}.

**11 — GALLERY.** Headline: "{{headline}}". Filters: Todo · {{Comida · Bebidas · El lugar · Gente}}. IMPORTANT: "Todo" shows only 1 photo per category so the scroll stays short; choosing a category shows all of that category (`flip-layout`). Entrance `clip-wipe` staggered by column, hover zoom 1.04 (and the custom cursor says "VER" if enabled). Click: lightbox per DESIGN.md (`shared-element`, arrows, keyboard, swipe, counter) with a "Lo quiero" button (adds to the order or opens WhatsApp).

**12 — DELIVERY** (OPTIONAL). Headline "{{headline}}". Zones as chips [CONFIRM]; selecting one shows cost and time [CONFIRM] with a number roll. Buttons "Pedir domicilio" (opens the order panel in delivery mode with that zone preselected) and "Escribir por WhatsApp".

**13 — TESTIMONIALS.** Draggable carousel with inertia (Motion `drag="x"` with `dragConstraints` and momentum, or GSAP Draggable + Inertia) of {{mini chats / order tickets / cards}}. Arrows, keyboard, visible progress. 4 testimonials clearly marked as PLACEHOLDER to replace with real reviews. Native horizontal scroll fallback on touch.

**14 — FAQ: "{{Lo que debes saber antes de ir}}".** Accordion per DESIGN.md. Questions: hours, how to get there, parking, reservations, delivery zones, pets, private events / large groups, {{what if it rains / others}}. Answers marked [ADJUST]. Output `FAQPage` JSON-LD from the same data.

**15 — VISIT US (location & hours).** "{{Te esperamos en AREA}}". Address [ADD], hours table with today highlighted and live status "ABIERTO AHORA · cierra a las X / CERRADO · abrimos el X a las Y" from `lib/hours.ts`. "Cómo llegar" button (Google Maps directions URL). Embedded map (iframe `https://www.google.com/maps?q={{NAME}},+{{AREA}},+{{CITY}}&output=embed`, `loading="lazy"`, no invented coordinates), loaded only when the section is near the viewport; a static styled placeholder until then. {{Optional line with neighbors on the route}}.

**16 — FINAL CTA.** Full-screen {{color}} (`min-height: 100svh`). Huge headline with `chars-stamp` / `mask-lines`: "{{¿Quién se apunta? / ¿Tienes antojo?…}}". {{The chat returns with a short 2-message exchange (optional)}}. Buttons: "{{Reservar / Pedir}}" and "Invitar a mis amigos" (Web Share API, WhatsApp fallback: "{{Oye, ¿vamos a NAME? tagline}} [link]"). {{Background detail: lights, leaves, chips, or a logo watermark with `parallax`}}.

**17 — FOOTER.** Logo, tagline, links, Instagram @{{handle}}, WhatsApp, address, hours and live status. "© {{YEAR}} {{NAME}} · {{AREA}}, {{CITY}}." The word "{{NAME}}" spans the full width (fitted with a measured font-size so it never overflows) with {{closing animation: letters drop in with stagger and a soft bounce / split apart / stamp in}} when the footer enters. A "back to top" button that uses Lenis `scrollTo` (native smooth scroll on mobile).

---

## 7. Data layer — `src/config/site.ts`
ONE typed file holds every editable value, so the owner changes prices without touching the design:
- `business`: name, tagline, description, address, mapsQuery, instagram, whatsapp (country code + number), email, currency, locale, timeZone.
- `hours`: per weekday, an array of ranges `{ open: "12:00", close: "02:00" }` (closing after midnight supported), `holidays: ["YYYY-MM-DD", …]` ({{Colombian holidays}} editable list), `specialDays` (custom hours or closed).
- `menu`: `{ id, name, description, category, price, portion, image, available, tags }[]` and `categories`.
- `delivery`: zones `{ id, name, fee, eta }`, minimum order, payment methods.
- `reservations`: slot length (30 min), max party size, areas of the place, occasions.
- `events`, `gallery`, `testimonials`, `faq`, `copy` (all UI strings and WhatsApp message templates).
- Validate the config at startup (Zod or a typed guard) and show a dev-only warning for missing fields.

**`lib/hours.ts`:** compute "now" in `{{America/Bogota}}` with `Intl.DateTimeFormat` (never the device's zone), handle overnight ranges, holidays and special days, return `{ isOpen, closesAt, opensAt, nextOpenDay, closingSoon (≤45 min) }`, and re-evaluate every 60s while the tab is visible.

---

## 8. Conversion system: "{{PANEL NAME, e.g. Tu mesa / Tu pedido}}"
{{Pick the modes that apply: Delivery · Reserve a table · Pickup — or, for non-restaurants: Book · Tickets · Merch · Contact.}} One system, always at hand from the navbar, the floating button and every "+".

**State & data**
- One global store (Zustand + `persist` to `localStorage`, versioned key, try/catch) with items, quantities, notes, party size and mode, so nothing is lost on reload{{, and encodable in the URL to share}}.
- Sold-out products are greyed out with a tag and can't be added.

**Panel** (side panel on desktop, draggable bottom sheet on mobile — DESIGN.md "Modal & bottom sheet")
- Mode selector at the top: **{{Domicilio · Reservar mesa · Recoger}}** [CONFIRM which they offer], as a segmented control with a sliding indicator.
- List with − / + and a note per item; removing an item collapses its row with `layout` and offers "Deshacer" in a toast for 5s.
- Empty state: "{{Tu pedido está vacío…}}" with 3 one-tap suggestions.
- Sticky footer: subtotal, delivery fee by zone, total {{and "por persona"}}; numbers roll when they change.

**Delivery mode (single step):** Name · Mobile · Zone (sets the fee) · Address and reference · When? (ASAP / Schedule, within opening hours) · Payment ({{Cash / Transfer / Nequi}} [CONFIRM]; if cash: "¿Con cuánto pagas?") · Notes.

**Reservation mode (single step):** Party size · Day (open days only, next 30 days) · Time (30-min slots within hours, past slots disabled) · Preferred area ({{options of the place}} [CONFIRM]) · Occasion ({{Parche · Cumpleaños · Cita · Empresa}}) · Name · Mobile · "¿Dejamos la comida pedida?".

**Validation & submit**
- Inline validation on blur with friendly messages, submit disabled until valid, {{Colombian}} mobile of {{10}} digits (strip spaces and +{{57}}). Autocomplete attributes (`name`, `tel`, `street-address`) and correct `inputmode`.
- If closed: offer to schedule for the next opening, never an error.
- On submit: short order number (`{{XX}}-4821`), a neatly formatted message and a prefilled `https://wa.me/{{CC}}{{NUMBER}}?text=` (fully `encodeURIComponent`-encoded):
  ```
  ¡Hola {{NAME}}! Pedido {{XX}}-4821 · DOMICILIO
  • 2 × {{Product}} — $00.000
  Subtotal: $00.000 · Domicilio (Zona X): $0.000 · Total: $00.000
  Nombre: … · Cel: …
  Dirección: … (Ref.: …)
  Pago: … · Cuándo: …
  Notas: …
  ```
- Confirmation inside the panel: check that draws in (`draw-path`), summary, "Copiar mensaje" (Clipboard API) in case WhatsApp didn't open, "Compartir con mis amigos" and "Hacer otro pedido".
- Keyboard: focus trapped in the panel, `Esc` closes and focus returns to the button that opened it.

---

## 9. Global details
- **Floating WhatsApp / order button** bottom right ({{shape and color per DESIGN.md}}), safe-area aware, with item counter, a soft pulse every 6–8s (paused off-screen and after the first interaction), and tooltip "{{¿Qué se te antoja?}}". Hidden while the order panel or the footer CTA is visible.
- **Palette demo mode** (OPTIONAL, to show the owner options): `?palette=a|b|c` or `?demo` shows a pill with color swatches that switch the palette live via View Transition (DESIGN.md 1.6). Without `?demo` it doesn't exist in the UI.
- **Cursor:** {{system / custom: dot + ring that grows and reads "VER" over photos, `mix-blend-mode: difference`, driven by `quickTo`}}; disabled on touch, coarse pointers and reduced motion. Native cursor never hidden on text and form fields.
- **Smooth anchors:** nav links scroll with Lenis (desktop) / native `scroll-behavior` (mobile) with the navbar offset, update the URL hash without jumping, and move focus to the section heading.
- **Page transitions** (if more than one route): View Transitions API with the logo as a shared element; instant fallback.
- **Responsive** from 320px to 1920px+; on mobile no heavy scrub and no cursor, but chat, counters, reveals and the order sheet all work.
- **Offline / errors:** if a WhatsApp link can't open, show the copy-message fallback. Images that fail to load fall back to the placeholder frame.

## 10. Accessibility & SEO
- **Accessibility (WCAG 2.2 AA):** contrast per DESIGN.md, `alt` on every image (decorative = `alt=""`), visible focus, skip-to-content link, landmarks (`header`, `nav`, `main`, `footer`), one `h1`, logical heading order, keyboard operation of filters, menu, games, accordion, lightbox, carousel and order panel. Animated chat with `aria-live="polite"`. Split text keeps an accessible label (`aria-label` on the parent, `aria-hidden` on the fragments). Touch targets ≥ 44px. `lang="{{es}}"`.
- **SEO:** title "{{NAME}} | {{what it is}} en {{AREA}}, {{CITY}}"; meta description (≤155 chars); canonical; Open Graph + Twitter card with a 1200×630 image (place photo + logo); JSON-LD `{{Restaurant / BarOrPub / CafeOrCoffeeShop / Store / MusicGroup}}` (servesCuisine, openingHoursSpecification, address, geo only if confirmed, telephone, acceptsReservations, hasMenu, sameAs Instagram) + `FAQPage` + `Event` for events. `sitemap.xml`, `robots.txt`, `manifest.webmanifest`.
- **Favicon:** {{the signature shape}} as SVG favicon (with a dark-mode variant via `prefers-color-scheme` inside the SVG) + 180px apple-touch-icon + `theme-color`.

## 11. Missing material (mark on screen as placeholder)
{{List everything pending: WhatsApp number, address, hours, menu with prices, delivery zones, payment methods, logo as SVG or transparent PNG, high-res photos (place, products, team, people), 2–3 short videos, real reviews}}. Placeholders are visually consistent (DESIGN.md frame / a dashed underline on text with a small "[PENDIENTE]" tag) and listed in a dev-only overlay (`?pending`). Until everything arrives, the site works end to end with marked sample data.

## 12. Verification & acceptance (do this before you report)
1. `npm run build` passes with zero TypeScript errors and zero console errors/warnings in the browser.
2. Playwright screenshots at 375×812, 768×1024 and 1440×900 of every section; check there's no horizontal overflow (`document.documentElement.scrollWidth === innerWidth`) at 320px.
3. Lighthouse (mobile): Performance ≥ 90, Accessibility 100, Best Practices ≥ 95, SEO 100. Report LCP, CLS, INP and total JS.
4. Keyboard-only pass: every interactive element reachable, visible focus, `Esc` closes overlays, focus returns correctly.
5. Reduced-motion pass (emulate `prefers-reduced-motion: reduce`): all content visible, no loops.
6. No-JS pass: content readable, links work.
7. Open-now logic tested with mocked dates: open, closing soon, closed, overnight range, holiday.
8. Order flow tested end to end in each mode, including the generated WhatsApp message text.
9. Scroll check: wheel, trackpad, touch and keyboard (Space, PageDown, Home/End) never get stuck, delayed or captured.
Report each item as passed / failed (with the reason) and list the remaining placeholders.

---

The result must feel like {{ONE FINAL SENTENCE OF FEELING, e.g. "an Apple app made for a night out with friends in the mountains"}}. Prioritize scroll smoothness, the craft of the animations and the typography over the number of elements. When in doubt, remove.
