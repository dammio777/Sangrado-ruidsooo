<!--
HOW TO USE THIS TEMPLATE (delete this block before sending)
1. Replace everything inside {{ }}. Anything you don't have yet: leave [CONFIRM] or [ADD] — the build marks it as pending.
2. The brand color is MEASURED from the logo (eyedropper on the vector file, or on a screenshot of the Instagram avatar). Every other color comes from their photos or is a computed OKLCH derivative.
3. Fill the contrast matrix with real numbers: WCAG 2.2 ratio (webaim.org/resources/contrastchecker) and APCA Lc (apcacontrast.com).
   Minimums: 4.5:1 body text · 3:1 large text (≥24px, or ≥18.66px bold) · 3:1 UI borders, icons and focus rings.
4. Pick ONE base style and delete the others:
   A · Apple + glass (calm, premium) — B · Poster (solid offset shadows, thick borders, playful) —
   C · Crafted editorial (paper, stamps, textures) — D · Raw zine (photocopy grain, halftone, misregistration, stark contrast).
5. This file is VISUAL ONLY. Business, content and sections live in PROMPT.md.
6. Rule: if a value is not a token in this file, it does not exist. Components consume semantic tokens, never raw hex.
-->

# {{NAME}} — Design System

> {{Two lines that paint the scene: what it is, where, colors and materials. E.g. "An open-air terrace under the Santa Elena sky: the olive green of the logo, warm string lights, pallet wood and a fire pit."}}

| | |
|---|---|
| **Theme** | {{light / dark / light-to-dark / day-to-night}} — {{how color behaves down the page, e.g. "starts light and darkens section by section into night; it never turns back to day while scrolling down"}} |
| **Base style** | {{A · Apple + glass / B · Poster / C · Crafted editorial / D · Raw zine}} |
| **Three adjectives** | {{e.g. warm · unhurried · generous}} |
| **Signature shape** | {{the logo shape or symbol that repeats: circle, label, sun, monogram, star, stencil letter…}} |
| **Signature motion** | {{the ONE movement people remember, e.g. "everything lands like a rubber stamp" / "lines draw themselves like a neon tube" / "panels glide in like frosted glass"}} |
| **Anti-references** | {{what it must NOT look like, e.g. "a generic SaaS landing page", "a fast-food chain", "a Bootstrap template", "a crypto site"}} |

**Aesthetic:** {{3–4 lines: how it looks, what makes it distinct, where the signature shape shows up. End with what it is NOT.}}

---

## 1. Color

### 1.1 Source
Brand color `{{#HEX}}` is measured from the pixels of the {{logo}}. All other tones are sampled from their photos ({{which objects: walls, wood, lights, plates, stage, merch}}) or computed as OKLCH derivatives of the brand color (same hue ±3°, adjusted lightness/chroma) to pass contrast. Author in OKLCH, ship a HEX fallback.

### 1.2 Primitive tokens

| Name | HEX | OKLCH | Token | Role |
|------|-----|-------|-------|------|
| {{Brand}} | `{{#HEX}}` | `oklch({{L C H}})` | `--c-brand` | THE BRAND COLOR, exact from the logo. {{Where it's used}}. {{Which text sits on it, and at what minimum size}}. |
| {{Brand deep}} | `{{#HEX}}` | `oklch({{}})` | `--c-brand-deep` | Darker derivative. Primary button and accent text on light. |
| {{Brand soft}} | `{{#HEX}}` | `oklch({{}})` | `--c-brand-soft` | Lighter derivative. Soft fills, chips, "today" row, secondary text on dark. |
| {{Light}} | `{{#HEX}}` | `oklch({{}})` | `--c-light` | Main light background. Never pure white as a page background. |
| {{Light 2}} | `{{#HEX}}` | `oklch({{}})` | `--c-light-2` | Cards and reading areas on the light background. |
| {{Dark}} | `{{#HEX}}` | `oklch({{}})` | `--c-dark` | Main text and dark background. Never pure black (except base style D). |
| {{Dark 2}} | `{{#HEX}}` | `oklch({{}})` | `--c-dark-2` | Alternate dark surfaces. |
| {{Accent}} | `{{#HEX}}` | `oklch({{}})` | `--c-accent` | CTA on dark, highlights, "open now" dot. Max {{10}}% of any screen. |
| {{Accent 2}} | `{{#HEX}}` | `oklch({{}})` | `--c-accent-2` | Tiny accents only ("NEW" tags, stamps). Max {{4–6}}%, one element per screen. |
| White | `#FFFFFF` | `oklch(1 0 0)` | `--c-white` | Text on photos and on strong colors at large sizes. |

### 1.3 Semantic tokens (what components actually use)
Each section declares `data-surface="light | dark | brand"`; the semantic tokens re-map and the components never change.

| Semantic token | `light` | `dark` | `brand` | Use |
|----------------|---------|--------|---------|-----|
| `--surface` | `--c-light` | `--c-dark` | `--c-brand` | Section background |
| `--surface-raised` | `--c-light-2` | `--c-dark-2` | `--c-brand-deep` | Cards, panels, inputs |
| `--text` | `--c-dark` | `--c-light` | `{{--c-white / --c-dark}}` | Body and headings |
| `--text-muted` | `color-mix(in oklch, var(--c-dark) 68%, var(--c-light))` | `color-mix(in oklch, var(--c-light) 70%, var(--c-dark))` | `{{}}` | Secondary text (must still pass 4.5:1) |
| `--text-accent` | `--c-brand-deep` | `--c-brand-soft` | `{{}}` | Accent words, links |
| `--action-bg` / `--action-text` | `--c-brand-deep` / `--c-light` | `--c-accent` / `--c-dark` | `--c-dark` / `--c-light` | Primary button |
| `--border` | `color-mix(in oklch, var(--text) 12%, transparent)` | same formula | same formula | Dividers, outlines |
| `--focus-ring` | `{{}}` | `{{}}` | `{{}}` | 2px ring + 3px offset, ≥3:1 against surface |
| `--ok` / `--warn` / `--danger` | `{{}}` | `{{}}` | — | Functional only: forms, open/closed, sold out |

### 1.4 Proportion
{{40}}% lights · {{25}}% darks · {{18}}% brand · {{7}}% brand soft · {{6}}% accent · {{4}}% accent 2.
Squint test: if the page doesn't *feel* the color of the logo, increase brand coverage — never by adding new colors.

### 1.5 Contrast matrix (fill with measured values)

| Text | On | WCAG ratio | APCA Lc | Verdict |
|------|----|-----------|---------|---------|
| `--c-dark` | `--c-light` | {{X.X}}:1 | {{Lc}} | {{allowed / large only / forbidden}} |
| `--c-light` | `--c-brand` | {{}} | {{}} | {{}} |
| `--c-brand-deep` | `--c-light` | {{}} | {{}} | {{}} |
| `--c-accent` | `--c-dark` | {{}} | {{}} | {{}} |
| {{…one row per pair actually used…}} | | | | |

- Text over photos or glass: always on a gradient or veil that guarantees 4.5:1 at the darkest/lightest point under the text.
- Placeholder text and disabled states still need 3:1 to be readable.

### 1.6 Alternate palettes (OPTIONAL — to show the owner)
Everything is built from the tokens above, so a palette swap is just new values. Implement as `:root[data-palette="a|b|c"]`.

| Token | A · {{name}} (from logo) | B · {{name}} | C · {{name}} |
|-------|--------------------------|--------------|--------------|
| `--c-brand` | `{{#}}` | `{{#}}` | `{{#}}` |
| `--c-brand-deep` | `{{#}}` | `{{#}}` | `{{#}}` |
| `--c-brand-soft` | `{{#}}` | `{{#}}` | `{{#}}` |
| `--c-light` | `{{#}}` | `{{#}}` | `{{#}}` |
| `--c-light-2` | `{{#}}` | `{{#}}` | `{{#}}` |
| `--c-dark` | `{{#}}` | `{{#}}` | `{{#}}` |
| `--c-dark-2` | `{{#}}` | `{{#}}` | `{{#}}` |
| `--c-accent` | `{{#}}` | `{{#}}` | `{{#}}` |
| `--c-accent-2` | `{{#}}` | `{{#}}` | `{{#}}` |

Palette switching animates through a View Transition (`document.startViewTransition`) with a circular `clip-path` reveal from the clicked swatch; instant swap where unsupported.

### 1.7 Theme changes down the page (if Theme ≠ light or dark)
- Never animate `background-color` on large areas. Stack one fixed full-viewport layer per mood behind the content and cross-fade them with `opacity`, scrubbed by the scroll position of the section that owns the mood.
- `<meta name="theme-color">` follows the current section (update on section enter) so the mobile browser chrome matches.
- {{Mood sequence, e.g. "afternoon `--c-light` → golden hour `--c-brand-soft` → night `--c-dark`"}}.

---

## 2. Typography

### 2.1 Families
Three Google Fonts, self-hosted as woff2: one display, one accent (1–2 uses per screen), one body. Prefer variable fonts and use their axes (`wght`, `wdth`, `opsz`) instead of loading separate files. Proven pairings:
- **A · Apple + glass:** Inter Tight (display 600–700, tracking −0.035em, sentence case) · Instrument Serif or Cormorant Garamond (accent italic) · Inter (body, `opsz` on).
- **B · Poster:** Big Shoulders Display or Anton (display, UPPERCASE, line-height 0.88) · Fraunces (accent, `SOFT` and `WONK` axes) · Plus Jakarta Sans (body).
- **C · Crafted editorial:** Anton or Bricolage Grotesque (display) · Caveat (handwritten notes) · Figtree (body) · Courier Prime (stamps and prices).
- **D · Raw zine:** Archivo (display at `wdth` 62, `wght` 900, UPPERCASE) · Special Elite (typewriter accent: dates, captions, labels) · Archivo at `wdth` 100 (body).

| Role | Family | Token | Weights / axes |
|------|--------|-------|----------------|
| Display | {{}} | `--f-display` | {{e.g. wght 700–900, wdth 62–75}} |
| Accent | {{}} | `--f-accent` | {{}} — role: {{accent words, product names, quotes, the logo word}} |
| Body | {{}} | `--f-body` | 400, 500, 600/700 |

### 2.2 Fluid type scale (360px → 1440px viewport)

| Role | Family | Weight | Min → Max | Token value | Line height | Tracking |
|------|--------|--------|-----------|-------------|-------------|----------|
| eyebrow | body | 600 | 12 → 13px | `0.8125rem` | 1.3 | +0.12em, UPPERCASE |
| body-sm | body | 400 | 14 → 15px | `clamp(.875rem, .8542rem + .0926vw, .9375rem)` | 1.55 | 0 |
| body | body | 400 | 16 → 18px | `clamp(1rem, .9583rem + .1852vw, 1.125rem)` | 1.6 | 0 |
| lead | body | 500 | 19 → 23px | `clamp(1.1875rem, 1.1042rem + .3704vw, 1.4375rem)` | 1.45 | −0.005em |
| accent | accent | {{}} | 24 → 36px | `clamp(1.5rem, 1.25rem + 1.1111vw, 2.25rem)` | 1.15 | 0 |
| subheading | display | {{}} | 28 → 44px | `clamp(1.75rem, 1.4167rem + 1.4815vw, 2.75rem)` | 1.0 | {{}} |
| heading | display | {{}} | 40 → 88px | `clamp(2.5rem, 1.5rem + 4.4444vw, 5.5rem)` | 0.95 | {{}} |
| display | display | {{}} | 52 → 160px | `clamp(3.25rem, 1rem + 10vw, 10rem)` | 0.88 | {{}} |

Tokens: `--t-eyebrow`, `--t-body-sm`, `--t-body`, `--t-lead`, `--t-accent`, `--t-subheading`, `--t-heading`, `--t-display`.

### 2.3 Typesetting rules
- Headings: `text-wrap: balance`. Paragraphs: `text-wrap: pretty`, max width `68ch`.
- Line height tightens as size grows; tracking goes negative on large display sizes and positive (+0.08–0.12em) on small caps/UPPERCASE.
- Numbers that change or align (prices, times, counters, dates): `font-variant-numeric: tabular-nums`.
- Never faux-bold or faux-italic: only load weights/styles that exist.
- Headings that will be split for animation must look correct un-split (no reliance on JS for layout).

### 2.4 Font loading (zero layout shift)
- Self-host woff2, `latin` subset (covers á é í ó ú ñ ü ¿ ¡). `<link rel="preload">` only the display font used above the fold.
- `font-display: swap` + a metric-matched fallback (`size-adjust`, `ascent-override`, `descent-override` via Fontaine/Capsize) so swapping causes no CLS.
- Call `ScrollTrigger.refresh()` and re-split text after `document.fonts.ready`.
- Single-file HTML delivery: embed fonts as base64 woff2 (latin subset only) so they render even if the viewer blocks Google Fonts.

---

## 3. Space, layout & grid

**Base unit:** 4px · **Density:** {{airy, Apple-like / comfortable and energetic / dense and raw}}.

| Token | Value |
|-------|-------|
| `--s-1 … --s-40` | 4, 8, 12, 16, 24, 32, 48, 64, 96, 128, 160px (`--s-1`=4px … `--s-40`=160px) |
| `--gutter` | `clamp(1rem, .6667rem + 1.4815vw, 2rem)` (16 → 32px) |
| `--space-section` | `clamp(5.5rem, 4rem + 6.6667vw, 10rem)` (88 → 160px) |
| `--page-max` | {{1240–1360}}px |
| `--measure` | 68ch |

- **Grid:** 12 columns ≥1024px · 8 columns 768–1023px · 4 columns <768px · column gap 24px (16px mobile).
- **Breakpoints:** 480 · 768 · 1024 · 1280 · 1536. Components use **container queries** (`@container`) so they adapt to their slot, not the viewport.
- **Full-screen sections:** `min-height: 100svh` (never `100vh`, which jumps under the mobile URL bar).
- Respect `env(safe-area-inset-*)` on nav, floating buttons and bottom sheets.
- Composition: break the grid on purpose at least once per screen (bleed image, offset heading, overlapping caption). Avoid rows of identical centered cards.

### Z-index scale
`--z-base: 0` · `--z-raised: 10` · `--z-sticky: 40` · `--z-nav: 50` · `--z-float: 60` · `--z-overlay: 80` · `--z-modal: 90` · `--z-toast: 95` · `--z-grain: 100` (pointer-events: none) · `--z-intro: 110`.

---

## 4. Shape, surfaces & texture

### 4.1 Radius

| Element | Token | Value |
|---------|-------|-------|
| buttons | `--r-button` | {{9999px pill / 0 for D / 12px for B}} |
| cards & photos | `--r-card` | {{24–32px / 0–4px for D}} |
| panels & modals | `--r-panel` | {{28px}} |
| chat bubbles | `--r-bubble` | 22px (tail corner 6px) |
| inputs | `--r-input` | {{14px}} |
| chips & tags | `--r-chip` | {{9999px / 8px}} |

Nested radii: inner radius = outer radius − padding (never the same radius inside and out).

**Signature shape:** {{the logo shape and where it repeats: favicon, chat avatar, floating button, image masks, loader, list bullets, marquee separator, cursor}}.

### 4.2 Surfaces — keep only your base style

**A · Glass (Apple)**
| Name | Value | Token |
|------|-------|-------|
| glass-light | `background: rgb({{light RGB}} / .62); backdrop-filter: blur(22px) saturate(170%); border: 1px solid rgb(255 255 255 / .55)` | `--glass-light` |
| glass-dark | `background: rgb({{dark RGB}} / .55); backdrop-filter: blur(22px) saturate(160%); border: 1px solid rgb(255 255 255 / .12)` | `--glass-dark` |

Rules: glass only when something is behind it (photo or color); max 3 glass panels visible; never glass inside glass; add a 1px inner highlight (`inset 0 1px 0 rgb(255 255 255 / .35)`); solid fallback via `@supports not (backdrop-filter: blur(1px))` and `@media (prefers-reduced-transparency: reduce)`; blur 14px on mobile. Never animate `backdrop-filter`.

**B · Poster (solid shadows)**
| Name | Value | Token |
|------|-------|-------|
| chunk | `4px 4px 0 {{dark}}` | `--sh-chunk` |
| chunk-lg | `8px 8px 0 {{dark}}` | `--sh-chunk-lg` |

Cards and buttons: 2px `{{dark}}` border + `chunk`. Hover: the element moves `translate(-4px,-4px)` while a pseudo-element shadow stays put (animate transform, not box-shadow). Press: element moves into the shadow (`translate(2px,2px)`).

**C · Crafted editorial**
Paper texture at 3–4% over the whole site, die-cut zigzag SVG edges between sections, stamps and tape as decoration, slight rotations (−2° to 2°) on cards and photos, handwritten notes with an SVG arrow that draws in.

**D · Raw zine**
Photocopy grain (static SVG `feTurbulence` at 6–10%, `mix-blend-mode: multiply`), halftone dot screens on photos (SVG pattern or pre-processed images), 1–2px misregistration offsets in a second ink on display type, torn-paper edges, xeroxed black bars as section dividers, typewriter labels, staple/tape marks. Grayscale photos with crushed blacks. Hard edges: 0 radius. One raw SVG `feDisplacementMap` "ink" filter applied to static display type only, never animated.

### 4.3 Elevation (all styles)
| Name | Value | Token |
|------|-------|-------|
| float | `0 1px 2px rgb({{dark RGB}} / .06), 0 12px 32px -12px rgb({{dark RGB}} / .22)` | `--sh-float` |
| lift | `0 2px 4px rgb({{dark RGB}} / .08), 0 28px 60px -20px rgb({{dark RGB}} / .35)` | `--sh-lift` |

To animate elevation, cross-fade the opacity of a pseudo-element that carries the bigger shadow; never transition `box-shadow` directly on many elements.

### 4.4 Texture rules
Textures are static, `pointer-events: none`, `position: fixed`, one layer for the whole page (`--z-grain`), never animated, and disabled when `prefers-reduced-transparency` is set if they reduce legibility.

---

## 5. Motion system

### 5.1 Principles
1. **Motion has a job:** guide attention, confirm an action, or express the brand's signature. Decoration without a job is cut.
2. **Material physics:** the base style decides how things move — glass glides (long ease-out, no bounce), poster stamps (fast in, tiny overshoot), paper flutters (soft spring, slight rotation), zine jolts (hard cuts, steps, jitter of 1–2px).
3. **Content is never hostage:** everything is readable if an animation never runs or never finishes.
4. **Compositor only:** animate `transform`, `opacity`, `clip-path` (and SVG stroke properties for draw effects). Never `filter`, `width`, `height`, `top/left`, `box-shadow` or `backdrop-filter`.

### 5.2 Tokens

| Token | Value | Use |
|-------|-------|-----|
| `--d-instant` | 100ms | press feedback, toggles |
| `--d-fast` | 180ms | hover, focus, color |
| `--d-base` | 320ms | UI: menus, chips, accordion |
| `--d-slow` | 600ms | panels, modals, section changes |
| `--d-reveal` | 900ms | scroll entrances |
| `--d-intro` | ≤1600ms | the opening sequence only |
| `--ease-out` | `cubic-bezier(.16, 1, .3, 1)` (GSAP: `expo.out`) | entrances, reveals |
| `--ease-out-soft` | `cubic-bezier(.22, 1, .36, 1)` (GSAP: `power3.out`) | UI |
| `--ease-in-out` | `cubic-bezier(.65, 0, .35, 1)` (GSAP: `power3.inOut`) | state changes, scrubs |
| `--ease-in` | `cubic-bezier(.5, 0, .75, 0)` | exits only (exits are 30% shorter than entrances) |

**Springs (Motion):** `snappy { stiffness: 420, damping: 34 }` buttons/toggles · `ui { stiffness: 260, damping: 28 }` panels, layout · `soft { stiffness: 140, damping: 22 }` large surfaces · `pop { stiffness: 500, damping: 18 }` bubbles, badges, counters (B/C only). Equivalent duration-based form: `{ type: "spring", visualDuration: 0.4, bounce: 0.15 }`.
{{Base style A: bounce 0, no rotation. B: bounce ≤ 0.25. C: bounce ≤ 0.15, rotation ≤ 3°. D: no springs on content; use `steps()` and hard cuts.}}

### 5.3 Choreography
- Order inside a section: eyebrow → heading → body → media → CTA. One entrance direction per section.
- Stagger 40–80ms; after 8 items, animate the rest as a group.
- Travel distance: 24–32px desktop, 12–20px mobile. Scale entrances from 0.96 at most (media from 1.12 inside a clipped frame).
- A trigger fires once; no element animates twice for the same event. No entrance animation on elements already in the viewport at load except the hero.
- Max 2 simultaneous "hero moments" on screen; everything else is quiet.

### 5.4 Effect catalog (reuse by name in PROMPT.md)

| Name | What it does | Spec |
|------|--------------|------|
| `reveal-up` | fade + rise | y 24→0, opacity 0→1, `--d-reveal`, `--ease-out`, ScrollTrigger `start: "top 85%"`, once |
| `mask-lines` | lines rise from behind a mask | GSAP SplitText `type: "lines", mask: "lines", autoSplit: true`, yPercent 110→0, stagger .08 |
| `mask-words` | words rise from behind a mask | same with `"words"`, stagger .04 |
| `chars-stamp` | letters land like stamps | chars scale 1.4→1, opacity 0→1, rotation ±6°→0, `back.out(2)` (B/D only) |
| `clip-wipe` | image wipes in | `clip-path: inset(100% 0 0 0)` → `inset(0)`, inner image scale 1.12→1 at the same time |
| `scrub-grow` | card grows to full bleed | `clip-path: inset(8% 6% round var(--r-card))` → `inset(0 round 0)`, scrub 0.6, NO pin |
| `parallax` | depth on media | yPercent −6→6, scrub, desktop only |
| `velocity-skew` | marquee reacts to scroll speed | `ScrollTrigger.getVelocity()` → `gsap.quickTo(el, "skewX")`, clamped ±4°, eases back in .6s |
| `highlight-words` | paragraph lights up with scroll | each word opacity .18→1, scrub, `start: "top 75%"`, `end: "bottom 45%"` |
| `counter` | number counts up | 0→N over 1.2s `power2.out`, tabular nums, once, final value in the HTML |
| `draw-path` | SVG draws itself | GSAP DrawSVG `0% → 100%` (or `stroke-dashoffset`), 1.2–1.6s `power2.inOut` |
| `morph` | shape morphs into another | GSAP MorphSVG between two paths of the signature shape |
| `magnetic` | element follows the cursor | max 6px (button) / 12px (icon), `quickTo` x/y .4s `power3.out`, desktop pointer only |
| `flip-layout` | grid reflows smoothly | GSAP Flip or Motion `layout`; enter scale .9→1 + opacity, exit opacity only |
| `shared-element` | card → modal continuity | Motion `layoutId` (or View Transitions API `view-transition-name`) |
| `hover-lift` | card hover | translateY −4px + `--sh-lift` pseudo-element opacity 0→1, image scale 1.04 over 900ms |
| `press` | button press | scale .97, `--d-instant` |
| {{signature}} | {{the signature motion from the header table}} | {{spec}} |

### 5.5 Reduced motion (`prefers-reduced-motion: reduce`)

| Effect | Reduced alternative |
|--------|---------------------|
| intro sequence | 300ms fade, or skipped |
| reveal-up / mask-* / chars-stamp / clip-wipe | 200ms opacity only, or static |
| scrub-grow / parallax / highlight-words / velocity-skew | static final state |
| marquee / loops / chat typing | paused; full content visible |
| magnetic / custom cursor | off |
| counters | show final value |
| shared-element / flip-layout | instant or 150ms cross-fade |

---

## 6. Components
Each component specifies: anatomy, sizes, and every state — default, hover, active/pressed, focus-visible, disabled, loading, error (where relevant). Touch targets ≥ 44×44px.

### Primary button
{{Shape, background, text color}}, height 52px (44px compact), padding 0 24px, `--t-body` 600. Hover: {{}}; press: `press`; loading: label fades to a 3-dot or spinner while width stays fixed. On dark surfaces: {{variant}}. `magnetic` on desktop only. Optional: label "rolls" on hover (text duplicated, translateY −100% within an overflow mask).

### Secondary / ghost button
{{Shape and hover}}.

### Icon button
44×44px, icon 20–24px, visible focus ring, `aria-label` always.

### Navbar
{{Floating glass pill / bordered bar with shadow / black zine bar}}, height 56px (48px compact after scroll). Logo + name, links, live "● Open / ● Closed" status, main CTA with counter. Active section underline moves with `layoutId`. Hides on fast scroll down (>8px per frame), reappears on scroll up.

### Chip / filter
Pill on `--surface-raised`. Active: `--action-bg` with `--action-text`; the active background is ONE element that slides between chips (`layoutId`). Arrow-key navigation, `aria-pressed`.

### Product card
{{Full-bleed photo with radius X and bottom gradient / row with dotted leader line}}, name, tabular price, portion tag, "+" button. Hover: `hover-lift`. Sold out: grayscale photo, "Agotado"-style tag in site language, "+" disabled.

### Modal & bottom sheet
Desktop modal: max 640px, `--r-panel`, `--sh-lift`, backdrop at 40% `--c-dark` (opacity animation). Mobile: bottom sheet with grab handle, drag to resize (50% / 92%) and swipe down to close (velocity threshold 500px/s). Focus trap, `Esc` closes, focus returns to the trigger, scroll lock without layout jump (`scrollbar-gutter: stable`).

### Order / reservation panel
Desktop: 420px side panel. Mobile: bottom sheet. Rows with 44px round thumbnail, name, − qty + (number animates with a vertical roll), price. Sticky footer with subtotal, per-person and primary button.

### Form fields
Height 52px, `--r-input`, label always visible (floating label allowed), inline validation on blur, error text + icon (never color alone), success check that draws in (`draw-path`).

### Hours card
Table by day with today highlighted in `--c-brand-soft`; on top, live status: pulsing `--c-accent` dot "Open now · closes at X" or `--c-accent-2` dot "Closed · opens X at Y". Pulse is a scaled pseudo-element (transform + opacity), paused off-screen.

### Chat window (OPTIONAL)
380px container (mobile: full width − 32px), `--r-panel`, surface {{}} with `--sh-lift`. Solid header in {{brand}} with round logo avatar, group name (body 600, white) and dynamic subtitle "{{X}} is typing…" in site language. Body {{light}} with a dot pattern at 6%. Received bubble: white, `--c-dark` text, sender name on top. Sent bubble: `--c-brand-deep`, `--c-light` text, ✓✓. 3-dot typing indicator. Enters with spring `scale .6 → 1` from its anchor corner (`transform-origin` at the corner). Minimize to a round logo bubble; close.

### Marquee
Two duplicated tracks moved with `xPercent` (GSAP) — never `left`. Separator: the signature shape. `velocity-skew`. Paused off-screen and when the tab is hidden.

### Lightbox
Full screen on `--c-dark` at 96%, image enters via `shared-element`, arrows + keyboard + swipe, counter "3 / 12", pinch-zoom on mobile, preloads neighbors.

### Accordion
Height animated with Motion `layout` / `height: "auto"` (or CSS `interpolate-size: allow-keywords` where supported); "+" rotates 45° into "×". Built on `<details>/<summary>` or ARIA button + region.

### Toast
Bottom center (above floating button), `--r-chip`, auto-dismiss 4s, `aria-live="polite"`.

### {{Concept-specific component}}
{{E.g. kraft label that peels off, chip and die, table seen from above, spinning stamp, setlist on a torn page, gig ticket stub}} — anatomy, states, motion.

---

## 7. Imagery & art direction
{{Are there good photos? Yes → use them large, describe which. No → logo + SVG illustrations + placeholder frames only.}}
- **The place / stage:** {{what's shown}}.
- **The products / music / merch:** {{what's shown}}.
- **The people:** {{what's shown}}.

Treatment: {{natural warm color, no heavy filters / grayscale high-contrast with halftone (D)}}, radius `--r-card`, entrance `clip-wipe`, `parallax` max 6% desktop only. Never text on a photo without a gradient or veil. No stock photos, no AI-generated photos.
Delivery: AVIF + WebP with `srcset`/`sizes`, explicit `width`/`height` (or `aspect-ratio`), blurred LQIP placeholder (16px base64 or BlurHash) cross-faded on load, `decoding="async"`.
Placeholder: frame on `--c-light-2` with {{the signature shape}} at 30% and the label "Foto próximamente" (in site language), image read from a central data array (`src`).

## 8. Iconography & illustration
- One icon set only: {{Lucide / Phosphor / custom}}, stroke {{1.5}}px, sizes 16 / 20 / 24px, `currentColor`. Inline SVG or a sprite; never icon fonts, never emoji as icons.
- Illustrations: {{style}}, built from the signature shape and brand tokens; SVG with `vector-effect: non-scaling-stroke` where lines draw in.

---

## 9. Do's and Don'ts

### Do
- {{Let the logo color dominate…}}
- {{Use the signature shape in…}}
- {{Write in a … tone}}
- {{What the concept must make people feel…}}
- Always show the hours and the live "open now" status (if the business has hours).
- Give every interactive element a visible hover, press and focus state.

### Don't
- {{Color pairs forbidden by contrast}}
- {{Anything that looks like a different base style}}
- No accent 2 on more than one element per screen.
- No heavy animation: nothing that makes the user wait or slows the scroll.
- No pages full of emoji.
- No generic "AI template" tells: purple-to-blue gradients, glowing blobs, identical 3-card rows, centered-everything layouts, lorem ipsum, fake logos of "clients", stock smiles.

---

## 10. Quick start

```css
:root, :root[data-palette="a"] {
  /* primitives */
  --c-brand: {{#}};
  --c-brand-deep: {{#}};
  --c-brand-soft: {{#}};
  --c-light: {{#}};
  --c-light-2: {{#}};
  --c-dark: {{#}};
  --c-dark-2: {{#}};
  --c-accent: {{#}};
  --c-accent-2: {{#}};
  --c-white: #FFFFFF;

  /* type */
  --f-display: '{{display}}', '{{display}} Fallback', system-ui, sans-serif;
  --f-accent: '{{accent}}', Georgia, serif;
  --f-body: '{{body}}', '{{body}} Fallback', system-ui, -apple-system, 'Segoe UI', sans-serif;
  --t-display: clamp(3.25rem, 1rem + 10vw, 10rem);
  --t-heading: clamp(2.5rem, 1.5rem + 4.4444vw, 5.5rem);
  --t-subheading: clamp(1.75rem, 1.4167rem + 1.4815vw, 2.75rem);
  --t-accent: clamp(1.5rem, 1.25rem + 1.1111vw, 2.25rem);
  --t-lead: clamp(1.1875rem, 1.1042rem + .3704vw, 1.4375rem);
  --t-body: clamp(1rem, .9583rem + .1852vw, 1.125rem);
  --t-body-sm: clamp(.875rem, .8542rem + .0926vw, .9375rem);
  --t-eyebrow: .8125rem;

  /* space & layout */
  --gutter: clamp(1rem, .6667rem + 1.4815vw, 2rem);
  --space-section: clamp(5.5rem, 4rem + 6.6667vw, 10rem);
  --page-max: {{1240}}px;
  --measure: 68ch;

  /* shape */
  --r-button: {{9999px}};
  --r-card: {{32px}};
  --r-panel: 28px;
  --r-bubble: 22px;
  --r-input: 14px;
  --r-chip: 9999px;

  /* elevation */
  --sh-float: 0 1px 2px rgb({{dark RGB}} / .06), 0 12px 32px -12px rgb({{dark RGB}} / .22);
  --sh-lift: 0 2px 4px rgb({{dark RGB}} / .08), 0 28px 60px -20px rgb({{dark RGB}} / .35);

  /* motion */
  --d-instant: 100ms; --d-fast: 180ms; --d-base: 320ms; --d-slow: 600ms; --d-reveal: 900ms;
  --ease-out: cubic-bezier(.16, 1, .3, 1);
  --ease-out-soft: cubic-bezier(.22, 1, .36, 1);
  --ease-in-out: cubic-bezier(.65, 0, .35, 1);
  --ease-in: cubic-bezier(.5, 0, .75, 0);
}

[data-surface="light"] { --surface: var(--c-light); --surface-raised: var(--c-light-2); --text: var(--c-dark); --text-accent: var(--c-brand-deep); --action-bg: var(--c-brand-deep); --action-text: var(--c-light); }
[data-surface="dark"]  { --surface: var(--c-dark);  --surface-raised: var(--c-dark-2);  --text: var(--c-light); --text-accent: var(--c-brand-soft); --action-bg: var(--c-accent); --action-text: var(--c-dark); }
[data-surface="brand"] { --surface: var(--c-brand); --surface-raised: var(--c-brand-deep); --text: {{var(--c-white)}}; --text-accent: {{}}; --action-bg: var(--c-dark); --action-text: var(--c-light); }
[data-surface] { --border: color-mix(in oklch, var(--text) 12%, transparent); background: var(--surface); color: var(--text); }

@media (prefers-reduced-motion: reduce) {
  :root { --d-fast: 0ms; --d-base: 120ms; --d-slow: 200ms; --d-reveal: 200ms; }
}
```

```css
/* Tailwind v4 — map tokens to utilities */
@import "tailwindcss";
@theme inline {
  --color-surface: var(--surface);
  --color-surface-raised: var(--surface-raised);
  --color-text: var(--text);
  --color-accent-text: var(--text-accent);
  --color-action: var(--action-bg);
  --color-on-action: var(--action-text);
  --color-brand: var(--c-brand);
  --font-display: var(--f-display);
  --font-accent: var(--f-accent);
  --font-body: var(--f-body);
  --radius-card: var(--r-card);
  --radius-panel: var(--r-panel);
  --ease-out: var(--ease-out);
}
```

```ts
// src/lib/motion.ts — the only place motion values live
export const dur = { instant: 0.1, fast: 0.18, base: 0.32, slow: 0.6, reveal: 0.9 } as const;
export const ease = {
  out: [0.16, 1, 0.3, 1],
  outSoft: [0.22, 1, 0.36, 1],
  inOut: [0.65, 0, 0.35, 1],
  in: [0.5, 0, 0.75, 0],
} as const;
export const gsapEase = { out: "expo.out", outSoft: "power3.out", inOut: "power3.inOut", in: "power2.in" } as const;
export const spring = {
  snappy: { type: "spring", stiffness: 420, damping: 34 },
  ui: { type: "spring", stiffness: 260, damping: 28 },
  soft: { type: "spring", stiffness: 140, damping: 22 },
  pop: { type: "spring", stiffness: 500, damping: 18 },
} as const;
export const stagger = { tight: 0.04, base: 0.06, loose: 0.08 } as const;
export const distance = { desktop: 28, mobile: 16 } as const;
```
