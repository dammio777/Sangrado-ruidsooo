# Cristian Calle — Design System

> A late-night listening room in Santa Elena, Medellín: deep wine-red walls, cream paper record sleeves, a turntable with a brass tonearm, the warm amber glow of a VU meter. When you turn the record over to Side B, it's morning on the mountain: sun, coffee, a bicycle.

| | |
|---|---|
| **Theme** | wine-to-daylight-and-back. Side A ("Hi-Fi") lives on wine and near-black: night, the listening room. Side B ("El buen vivir") turns cream: daylight on the mountain. The closing contact section returns to wine, like flipping the record back. Mood changes happen only at the A→B transition and before the contact section. |
| **Base style** | Analog Hi-Fi: a custom blend of *C · Crafted editorial* (paper sleeves, print texture) and the precision of vintage audio gear (brass, mono labels, meters, grooves). |
| **Three adjectives** | warm · precise · sabroso |
| **Signature shape** | The vinyl record: concentric grooves + a center label. It appears behind his portrait (like his event posters), as the nav mark, as the marquee separator, as the loader and as the sun on Side B. Secondary: the tonearm and the waveform line. |
| **Signature motion** | **"From noise to signal"** — things arrive as static and *tune in* to clarity: text scrambles through glyphs and locks into place, waveforms go from noisy to a clean sine, grain fades away. Plus the record that spins with inertia and speeds up with scroll velocity. |
| **Anti-references** | A nightclub flyer with neon and lasers. A generic DJ template (black + purple + equalizer GIFs). A wedding-planner site in pastel. A corporate "events agency" with stock photos of crowds. |

**Aesthetic:** It feels like a well-designed record sleeve from the '70s, reissued today on heavy vinyl. Big, elegant serif type in cream on deep wine, small technical labels in a monospace like the front panel of an amplifier ("33⅓ RPM", "LADO A", "−3 dB"), thin brass lines and hairline rules, generous margins. The record circle frames him the same way his posters do. The texture is subtle print grain, never dirty. It is NOT a nightclub, NOT neon, NOT lo-fi grunge: it's *high fidelity*, so every edge is clean and every detail is deliberate.

> Note: there is no logo yet. The brand color was **chosen by the client** (vino tinto + crema), not measured from a logo. The identity is typographic: wordmark "Cristian Calle" + a "CC" monogram on a record label (see section 8).

---

## 1. Color

### 1.1 Source
Vino tinto `#5C1A24` and crema `#F2E6D0` are the client's choice. Brass `#D4A659` comes from tonearms and amplifier knobs; amber `#E8643A` from the VU-meter/LED glow; rose `#D9A3A0` from the wine at a lower concentration (OKLCH, same hue family) for secondary text on dark.

### 1.2 Primitive tokens

| Name | HEX | OKLCH | Token | Role |
|------|-----|-------|-------|------|
| Vino tinto | `#5C1A24` | `oklch(0.328 0.096 15.4)` | `--c-brand` | THE BRAND COLOR. Main background of Side A, hero, contact, footer. Cream text at any size, brass for accents. |
| Vino profundo | `#3D0F17` | `oklch(0.250 0.072 13.8)` | `--c-brand-deep` | Raised surfaces on wine (cards, sheets, inputs), record grooves, primary text color on cream for headings. |
| Rosa vino | `#D9A3A0` | `oklch(0.765 0.065 22.3)` | `--c-brand-soft` | Secondary text and captions on wine/dark, soft fills on cream (very low use). |
| Crema | `#F2E6D0` | `oklch(0.929 0.032 82.8)` | `--c-light` | All text on wine. Background of Side B. Never pure white. |
| Crema 2 | `#E7D5B5` | `oklch(0.880 0.047 82.0)` | `--c-light-2` | Cards, sleeves and reading areas on Side B; placeholder frames. |
| Casi negro | `#1C0A0D` | `oklch(0.174 0.032 10.3)` | `--c-dark` | Intro background, the record itself, deep sections, body text on cream. |
| Casi negro 2 | `#2B1116` | `oklch(0.219 0.043 9.1)` | `--c-dark-2` | Alternate dark surfaces, the record label ring. |
| Latón | `#D4A659` | `oklch(0.752 0.109 78.7)` | `--c-accent` | Brass: the word "Hi-Fi", tonearm, hairlines, VU needle, primary CTA on wine. Max 8% of any screen. |
| Ámbar VU | `#E8643A` | `oklch(0.661 0.174 37.9)` | `--c-accent-2` | The "signal" glow: VU peak, the REC/ON dot of the sound toggle, the "PRÓXIMA" stamp. Max 3%, one element per screen. Graphics or text ≥24px only on wine. |
| Blanco | `#FFFFFF` | `oklch(1 0 0)` | `--c-white` | Only for specular highlights on the record (sheen). Never text. |

### 1.3 Semantic tokens

| Semantic token | `brand` (Side A, contact) | `dark` (intro, deep blocks) | `light` (Side B) |
|----------------|---------------------------|-----------------------------|------------------|
| `--surface` | `--c-brand` | `--c-dark` | `--c-light` |
| `--surface-raised` | `--c-brand-deep` | `--c-dark-2` | `--c-light-2` |
| `--text` | `--c-light` | `--c-light` | `--c-dark` |
| `--text-muted` | `--c-brand-soft` | `--c-brand-soft` | `color-mix(in oklch, var(--c-brand-deep) 80%, var(--c-light))` |
| `--text-accent` | `--c-accent` | `--c-accent` | `--c-brand` |
| `--action-bg` / `--action-text` | `--c-accent` / `--c-brand-deep` | `--c-accent` / `--c-dark` | `--c-brand` / `--c-light` |
| `--line` | `color-mix(in oklch, var(--c-accent) 45%, transparent)` (brass hairlines) | same | `color-mix(in oklch, var(--c-brand) 25%, transparent)` |
| `--focus-ring` | `--c-accent` | `--c-accent` | `--c-brand` |
| `--ok` / `--danger` | `#9BC59D` / `#F2A08F` | same | `#2F6B3A` / `#A1262F` |

### 1.4 Proportion
45% wine · 15% near-black · 30% cream (mostly Side B and all text) · 6% brass · 2% rose · 2% amber.
Squint test: Side A must read as **wine red**; Side B as **cream with wine type**. If something looks brown or orange, there is too much brass/amber.

### 1.5 Contrast matrix (measured, WCAG 2.x)

| Text | On | Ratio | Verdict |
|------|----|-------|---------|
| Crema `#F2E6D0` | Vino `#5C1A24` | 10.44:1 | ✅ any size |
| Crema | Vino profundo `#3D0F17` | 13.29:1 | ✅ any size |
| Crema | Casi negro `#1C0A0D` | 15.48:1 | ✅ any size |
| Rosa vino `#D9A3A0` | Vino | 5.96:1 | ✅ body text and captions |
| Latón `#D4A659` | Vino | 5.77:1 | ✅ any size (accent words, links, labels) |
| Latón | Casi negro | 8.55:1 | ✅ any size |
| Vino profundo `#3D0F17` | Latón (button) | 7.35:1 | ✅ button label |
| Vino `#5C1A24` | Crema | 10.44:1 | ✅ any size (Side B headings) |
| Vino | Crema 2 `#E7D5B5` | 8.96:1 | ✅ any size |
| Casi negro | Crema | 15.48:1 | ✅ Side B body |
| Ámbar `#E8643A` | Vino | 3.88:1 | ⚠️ ≥24px or graphics only |
| Ámbar | Casi negro | 5.75:1 | ✅ any size |

- Text over photos: always on a vino/negro gradient (≥ 60% opacity under the text) to keep ≥ 4.5:1.

### 1.6 Alternate palettes (OPTIONAL — `?demo`)

| Token | A · Vino tinto (client) | B · Whisky | C · Verde sala |
|-------|-------------------------|------------|----------------|
| `--c-brand` | `#5C1A24` | `#4A2412` | `#1F3A2E` |
| `--c-brand-deep` | `#3D0F17` | `#2E160A` | `#13241C` |
| `--c-brand-soft` | `#D9A3A0` | `#D8AE8C` | `#A9C4B2` |
| `--c-light` | `#F2E6D0` | `#F3E7D3` | `#F1E8D6` |
| `--c-light-2` | `#E7D5B5` | `#E6D2B3` | `#E3D7BE` |
| `--c-dark` | `#1C0A0D` | `#1A0E07` | `#0D1712` |
| `--c-dark-2` | `#2B1116` | `#2A170C` | `#16251D` |
| `--c-accent` | `#D4A659` | `#D9A55A` | `#D4A659` |
| `--c-accent-2` | `#E8643A` | `#E8643A` | `#E8643A` |

(B and C contrast must be re-measured before showing them.)

### 1.7 Mood changes down the page
Two fixed full-viewport mood layers behind the content: **wine** and **cream**. They cross-fade with `opacity`, scrubbed by the "Lado B" transition section (wine → cream) and by the top of the contact section (cream → wine). Never animate `background-color` of large areas. `<meta name="theme-color">` switches between `#5C1A24` and `#F2E6D0` on section enter.

---

## 2. Typography

| Role | Family | Token | Axes / weights | Why |
|------|--------|-------|----------------|-----|
| Display | **Fraunces** (variable) | `--f-display` | `opsz` 144 for display, `wght` 300–600, `SOFT` 50–100, italic | A warm '70s serif with soft, rounded terminals: elegant like a record sleeve, "sabrosa" rather than stiff. Italic for "Hi-Fi" and "buen vivir". |
| Accent / labels | **IBM Plex Mono** | `--f-accent` | 400, 500 | The front panel of an amplifier: track numbers, dates, "LADO A", "33⅓ RPM", specs, eyebrows. |
| Body | **DM Sans** (variable) | `--f-body` | `opsz` 9–40, 400 / 500 / 600 | Clean and friendly; doesn't compete with Fraunces. |

Usage rules: the name "Cristian Calle" is always Fraunces 300–400 (light and confident, `SOFT 100`), never bold. "Hi-Fi" is Fraunces italic in brass. Mono labels are UPPERCASE with +0.12em tracking and never longer than ~5 words. Max 1–2 italic accent words per screen.

### 2.2 Fluid type scale (360 → 1440px)

| Role | Family | Weight | Size token | Line height | Tracking |
|------|--------|--------|-----------|-------------|----------|
| eyebrow / label | Plex Mono | 500 | `0.8125rem` (13px) | 1.3 | +0.12em, UPPERCASE |
| body-sm | DM Sans | 400 | `clamp(.875rem, .8542rem + .0926vw, .9375rem)` | 1.55 | 0 |
| body | DM Sans | 400 | `clamp(1rem, .9583rem + .1852vw, 1.125rem)` | 1.6 | 0 |
| lead | DM Sans | 400 | `clamp(1.1875rem, 1.1042rem + .3704vw, 1.4375rem)` | 1.45 | −0.005em |
| accent | Fraunces italic | 400 | `clamp(1.5rem, 1.25rem + 1.1111vw, 2.25rem)` | 1.15 | −0.01em |
| subheading | Fraunces | 400 | `clamp(1.75rem, 1.4167rem + 1.4815vw, 2.75rem)` | 1.05 | −0.015em |
| heading | Fraunces | 350 | `clamp(2.5rem, 1.5rem + 4.4444vw, 5.5rem)` | 0.98 | −0.025em |
| display | Fraunces | 300 | `clamp(3.25rem, 1rem + 10vw, 10rem)` | 0.9 | −0.035em |

Headings: `text-wrap: balance`. Paragraphs: `text-wrap: pretty`, max `62ch`. Dates, track numbers, counters: `tabular-nums` (Plex Mono is already monospaced). Fonts: self-hosted woff2, latin subset, preload Fraunces (roman, display opsz), metric-matched fallbacks, re-split and `ScrollTrigger.refresh()` after `document.fonts.ready`.

---

## 3. Space, layout & grid
**Base unit:** 4px · **Density:** airy, like a gatefold sleeve: lots of space, few elements, big type.
- `--gutter: clamp(1rem, .6667rem + 1.4815vw, 2rem)` · `--space-section: clamp(5.5rem, 4rem + 6.6667vw, 10rem)` · `--page-max: 1320px` · `--measure: 62ch`.
- Grid 12 / 8 / 4 columns, gap 24px (16px mobile). Container queries in components. Full-screen sections use `100svh`.
- Composition: asymmetric, like a record sleeve: big name aligned left, record circle bleeding off the right edge on desktop; mono labels pinned to corners like catalog numbers ("CC-001 · LADO A").
- Hairline brass rules (1px `--line`) separate content instead of boxes.

Z-index: `--z-mood: -1` · `--z-base: 0` · `--z-sticky: 40` · `--z-nav: 50` · `--z-float: 60` · `--z-modal: 90` · `--z-toast: 95` · `--z-grain: 100` · `--z-intro: 110`.

---

## 4. Shape, surfaces & texture

| Element | Token | Value |
|---------|-------|-------|
| buttons | `--r-button` | 9999px (pill, like a knob track) |
| cards / sleeves / photos | `--r-card` | 6px (record sleeves are almost square-cornered) |
| portrait & records | — | 50% (always circular) |
| panels & sheets | `--r-panel` | 20px |
| inputs | `--r-input` | 10px |
| chips | `--r-chip` | 9999px |

**Surfaces:**
- **Record:** SVG, `--c-dark` disc with 30–40 concentric groove rings (`--c-brand-deep` at 40–60% opacity, 0.5px), a center label in `--c-brand` with "CC" monogram in cream and tiny mono text on a circular path ("CRISTIAN CALLE · HI-FI · LADO A · 33⅓"). A conic-gradient sheen layer (white at 6–10%) sits on top and rotates with the cursor angle — the record itself spins underneath, the sheen does NOT spin with it (that's what makes it feel real).
- **Sleeve card:** `--c-light-2` (Side B) or `--c-brand-deep` (Side A), 6px radius, a 1px inner edge highlight, slight print grain, a mono catalog number in a corner.
- **Brass detail:** 1px brass hairlines, small brass "screws" (2 dots) in the corners of key panels, brass tonearm.
- **Grain:** one static fixed SVG noise layer at 5% (`mix-blend-mode: overlay` on wine, `multiply` on cream). Never animated (the "noise to signal" sections use their own local overlay — see motion).

**Elevation:** `--sh-float: 0 1px 2px rgb(28 10 13 / .10), 0 12px 32px -12px rgb(28 10 13 / .45)` · `--sh-lift: 0 2px 4px rgb(28 10 13 / .12), 0 28px 60px -20px rgb(28 10 13 / .60)`. Animate elevation via pseudo-element opacity.

---

## 5. Motion system

### 5.1 Principles
1. **From noise to signal.** Every important entrance resolves from imprecision to precision. That *is* hi-fi.
2. **Mechanical, weighted, analog.** Things move like quality audio gear: a platter that takes a moment to reach speed, a tonearm with damping, a needle that overshoots and settles, a knob with detents. No cartoon bounce.
3. **Compositor only** (`transform`, `opacity`, `clip-path`, SVG stroke/`d` morph). Grain/noise is faded with `opacity`, never with `filter: blur`.

### 5.2 Tokens
Durations: `--d-instant 100ms` · `--d-fast 180ms` · `--d-base 320ms` · `--d-slow 600ms` · `--d-reveal 900ms` · intro ≤ 1800ms.
Easings: `--ease-out: cubic-bezier(.16,1,.3,1)` (`expo.out`) · `--ease-out-soft: cubic-bezier(.22,1,.36,1)` (`power3.out`) · `--ease-in-out: cubic-bezier(.65,0,.35,1)` (`power3.inOut`) · `--ease-in: cubic-bezier(.5,0,.75,0)`.
Custom GSAP eases (CustomEase): `platter` = slow-start spin-up `M0,0 C0.45,0 0.25,1 1,1`; `needle` = damped overshoot for meters (`elastic.out(1, 0.55)`, max 1 visible overshoot).
Springs (Motion): `snappy {420, 34}` buttons · `ui {260, 28}` panels/layout · `soft {140, 22}` large surfaces. No `pop`/bouncy springs.

### 5.3 Choreography
Eyebrow (mono label scrambles in) → heading (`mask-lines`) → body (`reveal-up`) → media (`clip-wipe` / record) → CTA. Stagger 50–70ms. Distance 28px desktop / 16px mobile. Max 2 "moments" per screen.

### 5.4 Effect catalog

| Name | Spec |
|------|------|
| `reveal-up` | y 28→0, opacity 0→1, 900ms `expo.out`, `start: "top 85%"`, once |
| `mask-lines` | SplitText `lines`, `mask: "lines"`, `autoSplit: true`, yPercent 110→0, stagger .08, 1000ms `expo.out` |
| `signal-scramble` | **Signature.** GSAP ScrambleTextPlugin: text resolves from static glyphs `"░▒▓/\\|—·:."` to the real text, 700–1100ms, `revealDelay: .25`, `speed: .6`, left to right. Used for mono labels, the name in the intro, and section eyebrows. Keep the real text in the DOM (`aria-label`) |
| `noise-to-signal` | A local grain overlay over a block fades opacity .5→0 while a waveform path morphs from noisy to a clean sine (MorphSVG between pre-drawn paths), scrubbed, no pin |
| `waveform-draw` | DrawSVG 0%→100% on a waveform/hairline, 1.2–1.6s `power2.inOut`, or scrubbed with scroll |
| `clip-wipe` | `clip-path: inset(100% 0 0 0)` → `inset(0)`, inner image scale 1.12→1, 1000ms `expo.out` |
| `record-spin` | Continuous rotation at 33⅓ RPM (1 turn / 1.8s) via a single `gsap.ticker` callback; `timeScale` follows scroll velocity (×1 → ×4, eased back in 0.8s); spins up with `platter` ease on enter and spins down over 1.2s when it leaves view, then pauses |
| `tonearm` | Rotation around its pivot: rest (−24°) → on record (0°) with damping; with scroll it travels from the outer groove (0°) to the inner groove (+18°) = page progress |
| `vu-needle` | Needle rotation −45°→+45° driven by a value (scroll velocity, hover, or audio level); `quickTo` 0.25s + `needle` ease; peak lamp (ámbar) flashes when >85% |
| `eq-bars` | 5–24 bars, `scaleY` only (transform-origin bottom), driven by procedural noise (or the AnalyserNode when sound is on), 30fps cap, paused off-screen |
| `parallax` | yPercent −6→6, desktop only |
| `velocity-skew` | marquee skewX from `ScrollTrigger.getVelocity()`, clamped ±4° |
| `highlight-words` | words opacity .18→1, scrubbed `top 75%` → `bottom 45%` |
| `counter` | 0→N over 1.4s `power2.out`, digits roll vertically like a tape counter (each digit a column with translateY) |
| `record-flip` | The record rotates `rotateY` 0→180° (perspective 1200px), the label changes from "LADO A" to "LADO B" at 90°, scrubbed by the A→B section, no pin |
| `sleeve-pull` | Sleeve rises 12%, the vinyl slides out to the right (x 0→55%) and starts `record-spin` |
| `magnetic` | max 6px buttons / 12px icon buttons, `quickTo` 0.4s `power3.out`, pointer: fine only |
| `flip-layout` / `shared-element` | GSAP Flip / Motion `layoutId` |
| `hover-lift` | translateY −4px + `--sh-lift` pseudo opacity, image scale 1.04 over 900ms |
| `press` | scale .97, 100ms |

### 5.5 Reduced motion

| Effect | Reduced |
|--------|---------|
| intro | 300ms fade; record static |
| `signal-scramble` / `mask-lines` / `reveal-up` / `clip-wipe` | 200ms opacity or static |
| `noise-to-signal` / `highlight-words` / `parallax` / `record-flip` / `velocity-skew` | static final state (clean wave, Side B label visible after the transition) |
| `record-spin` / `eq-bars` / oscilloscope / marquee | stopped; static frame |
| `tonearm` / `vu-needle` | static at rest |
| `counter` | final value |

---

## 6. Components

### Primary button
Pill, 52px tall, padding 0 26px, DM Sans 600 at body size. On wine: brass background, vino-profundo text. On cream: wine background, cream text. Hover: label rolls up (duplicated text inside an overflow mask) and a tiny brass/cream "LED" dot to the left lights up. Press: `press`. Magnetic on desktop.

### Secondary button
Pill, 1px `--line` border, transparent background, `--text`. Hover: the border fills from left to right (`clip-path` on a background pseudo-element).

### Navbar
Top bar 56px (48px after scroll), wine glass-free: `--c-brand` at 88% opacity with a 1px brass hairline at the bottom; turns cream on Side B (follows `data-surface` of the section under it). Left: mini record mark (24px) that spins with scroll velocity, with a thin progress ring around it (scroll progress 0–100%) + wordmark "Cristian Calle" (Fraunces 400). Center: links in DM Sans 500 14px. Right: **sound toggle** (mono "SONIDO" + 4 tiny `eq-bars` that move only when sound is ON, ámbar dot when ON) and CTA "Hablemos". Mobile: burger → full-screen wine menu, links in Fraunces 48px entering with `mask-lines`, mono labels "A1, A2…" next to each.

### Tracklist row (services)
Grid: mono track number ("A1") · title (Fraunces subheading) · one line (DM Sans) · mini waveform (SVG, 120×24) on the right. Separated by brass hairlines. Hover/focus: the waveform plays (a playhead line travels across, played part turns brass), title shifts 8px right, row background `--surface-raised` fades in. Opens a detail sheet on click/Enter.

### Record sleeve (event card)
Square, 6px radius, poster image (or placeholder) fills it; mono catalog strip at the bottom: "CC-0X · FECHA · LUGAR". States: rest (tilted in the crate), focused (upright, `--sh-lift`), pulled (`sleeve-pull`).

### Reel frame (Side B)
9:16, 6px radius, `--c-light-2` frame, muted autoplay loop only while in view (or poster image), play icon, caption in DM Sans, small mono label "REEL · @kristohd13".

### Pillar card (Side B)
No box: a line icon drawn with `waveform-draw` (sun / bicycle / coffee cup / mountain), a Fraunces subheading and two lines of text, separated by wine hairlines.

### Form fields
52px, `--r-input`, label above in mono 12px UPPERCASE, on wine: `--c-brand-deep` fill + cream text + brass focus ring. Inline validation on blur; success check draws in.

### Bottom sheet / modal
Per template: desktop modal 640px, mobile bottom sheet with handle, focus trap, `Esc`, focus return, scroll lock without jump.

### Marquee
Two tracks, `xPercent`, separator = mini record (16px) that spins. Fraunces italic 40–64px in cream on wine, or mono UPPERCASE on the second row.

### Sound toggle (custom)
See navbar. OFF by default. When ON: synthesized vinyl crackle loop + UI ticks (Web Audio, no files), volume 0.15, mute on tab hidden. Preference remembered in localStorage. `aria-pressed`, label "Activar sonido" / "Silenciar".

### Oscilloscope line (custom)
Full-width canvas 2D (DPR ≤ 2), 1.5px cream line on wine. Procedural signal (sum of 3 sines + smoothed noise); amplitude reacts to scroll velocity and cursor Y; when sound is ON it uses the AnalyserNode. 30fps cap, paused off-screen. Reduced motion: static sine.

---

## 7. Imagery & art direction
There are good photos on his Instagram, but no high-res files yet → use placeholders that read from the data array (`src`). Wanted:
- **Him:** portrait with sunglasses and mustache (he has a strong, recognizable look: retro sunglasses, mustache, leather jacket / relaxed shirts). Behind the decks with headphones (the "Árbol" shot with the neon sign). The B Side poster portrait.
- **Music:** hands on vinyl, turntable, the DJ booth, the red Chesterfield sofa from "Música en la sala".
- **Events:** the three posters (The B Side, Música en la sala, Selektor at El Maizal).
- **Buen vivir:** light coming through a window, coffee, bicycle, the mountain, the garden — from his reels.

Treatment: warm, slightly crushed blacks, natural grain; portraits cut into circles (record motif). Entrances with `clip-wipe` (rectangles) or a circular `clip-path: circle(0%)` → `circle(50%)` (circles). Parallax ≤ 6% desktop only. No stock, no AI-generated photos. Placeholder: frame in `--c-brand-deep` (Side A) / `--c-light-2` (Side B) with the record mark at 30% and the label "Foto próximamente". AVIF/WebP, `srcset`, LQIP blur cross-fade, explicit dimensions.

## 8. Identity, icons & illustration
- **Wordmark:** "Cristian Calle" in Fraunces 300, `SOFT 100`, tracking −0.035em. Lockup with "HI-FI" in Plex Mono 500 small caps or in Fraunces italic brass.
- **Monogram:** "CC" in Fraunces italic centered on a record label (favicon, nav, loader, avatar).
- **Icons:** Phosphor (Light/Regular), 1.5px, `currentColor`. Audio motifs drawn as custom SVG: record, tonearm, VU meter, waveform, knob, headphones; Side B: sun, bicycle, coffee, mountain. No emoji.

---

## 9. Do's and Don'ts

### Do
- Let wine dominate Side A and cream dominate Side B; brass is jewelry, not paint.
- Repeat the record circle: portrait frame, nav mark, marquee separator, loader, the sun on Side B.
- Write warm and direct, Medellín-friendly, no corporate jargon ("música sabrosa", "en su punto", "parche"), always in third person for him ("Cristian hace…") [AJUSTAR if he prefers first person].
- Make every "noise → signal" moment feel like tuning in: quick, satisfying, never slow.
- Use mono labels like a gear front panel: catalog numbers, "LADO A / LADO B", RPM, dates.

### Don't
- Never mention "Monte Hi-Fi" (copy, alt text, metadata, comments, file names).
- Amber text under 24px on wine (3.88:1). Brass on cream (fails). Rose on cream (fails).
- Neon, lasers, purple, club-flyer gradients, equalizer GIFs.
- Bold or black weights of Fraunces for the name.
- Animations that make people wait: the intro is skippable and ≤1.8s.
- Emoji-filled copy.

---

## 10. Quick start

```css
:root, :root[data-palette="a"] {
  --c-brand: #5C1A24;
  --c-brand-deep: #3D0F17;
  --c-brand-soft: #D9A3A0;
  --c-light: #F2E6D0;
  --c-light-2: #E7D5B5;
  --c-dark: #1C0A0D;
  --c-dark-2: #2B1116;
  --c-accent: #D4A659;
  --c-accent-2: #E8643A;
  --c-white: #FFFFFF;

  --f-display: 'Fraunces', 'Fraunces Fallback', Georgia, serif;
  --f-accent: 'IBM Plex Mono', ui-monospace, 'SFMono-Regular', Menlo, monospace;
  --f-body: 'DM Sans', 'DM Sans Fallback', system-ui, -apple-system, 'Segoe UI', sans-serif;
  --t-display: clamp(3.25rem, 1rem + 10vw, 10rem);
  --t-heading: clamp(2.5rem, 1.5rem + 4.4444vw, 5.5rem);
  --t-subheading: clamp(1.75rem, 1.4167rem + 1.4815vw, 2.75rem);
  --t-accent: clamp(1.5rem, 1.25rem + 1.1111vw, 2.25rem);
  --t-lead: clamp(1.1875rem, 1.1042rem + .3704vw, 1.4375rem);
  --t-body: clamp(1rem, .9583rem + .1852vw, 1.125rem);
  --t-body-sm: clamp(.875rem, .8542rem + .0926vw, .9375rem);
  --t-eyebrow: .8125rem;

  --gutter: clamp(1rem, .6667rem + 1.4815vw, 2rem);
  --space-section: clamp(5.5rem, 4rem + 6.6667vw, 10rem);
  --page-max: 1320px;
  --measure: 62ch;

  --r-button: 9999px; --r-card: 6px; --r-panel: 20px; --r-input: 10px; --r-chip: 9999px;

  --sh-float: 0 1px 2px rgb(28 10 13 / .10), 0 12px 32px -12px rgb(28 10 13 / .45);
  --sh-lift: 0 2px 4px rgb(28 10 13 / .12), 0 28px 60px -20px rgb(28 10 13 / .60);

  --d-instant: 100ms; --d-fast: 180ms; --d-base: 320ms; --d-slow: 600ms; --d-reveal: 900ms;
  --ease-out: cubic-bezier(.16, 1, .3, 1);
  --ease-out-soft: cubic-bezier(.22, 1, .36, 1);
  --ease-in-out: cubic-bezier(.65, 0, .35, 1);
  --ease-in: cubic-bezier(.5, 0, .75, 0);
}

[data-surface="brand"] { --surface: var(--c-brand); --surface-raised: var(--c-brand-deep); --text: var(--c-light); --text-muted: var(--c-brand-soft); --text-accent: var(--c-accent); --action-bg: var(--c-accent); --action-text: var(--c-brand-deep); --line: color-mix(in oklch, var(--c-accent) 45%, transparent); --focus-ring: var(--c-accent); }
[data-surface="dark"]  { --surface: var(--c-dark);  --surface-raised: var(--c-dark-2);  --text: var(--c-light); --text-muted: var(--c-brand-soft); --text-accent: var(--c-accent); --action-bg: var(--c-accent); --action-text: var(--c-dark); --line: color-mix(in oklch, var(--c-accent) 45%, transparent); --focus-ring: var(--c-accent); }
[data-surface="light"] { --surface: var(--c-light); --surface-raised: var(--c-light-2); --text: var(--c-dark); --text-muted: color-mix(in oklch, var(--c-brand-deep) 80%, var(--c-light)); --text-accent: var(--c-brand); --action-bg: var(--c-brand); --action-text: var(--c-light); --line: color-mix(in oklch, var(--c-brand) 25%, transparent); --focus-ring: var(--c-brand); }
[data-surface] { color: var(--text); }

@media (prefers-reduced-motion: reduce) {
  :root { --d-fast: 0ms; --d-base: 120ms; --d-slow: 200ms; --d-reveal: 200ms; }
}
```

```html
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght,SOFT@0,9..144,300..600,0..100;1,9..144,300..600,0..100&family=IBM+Plex+Mono:wght@400;500&family=DM+Sans:opsz,wght@9..40,400..600&display=swap">
<!-- For production: self-host these as woff2 (latin subset). Single-file delivery: embed as base64. -->
```

```ts
// src/lib/motion.ts
export const dur = { instant: 0.1, fast: 0.18, base: 0.32, slow: 0.6, reveal: 0.9 } as const;
export const ease = { out: [0.16, 1, 0.3, 1], outSoft: [0.22, 1, 0.36, 1], inOut: [0.65, 0, 0.35, 1], in: [0.5, 0, 0.75, 0] } as const;
export const gsapEase = { out: "expo.out", outSoft: "power3.out", inOut: "power3.inOut", in: "power2.in", platter: "platter", needle: "elastic.out(1, 0.55)" } as const;
export const spring = {
  snappy: { type: "spring", stiffness: 420, damping: 34 },
  ui: { type: "spring", stiffness: 260, damping: 28 },
  soft: { type: "spring", stiffness: 140, damping: 22 },
} as const;
export const rpm = { base: 33.333, maxBoost: 4 } as const; // record-spin
export const scrambleChars = "░▒▓/\\|—·:." as const;      // signal-scramble
```
