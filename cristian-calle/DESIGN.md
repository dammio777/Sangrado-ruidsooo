# Cristian Calle — Design System (v2 · Premium, Apple-style)

> A quiet, expensive room: deep wine walls, cream light, one vinyl record as the only object on stage. Huge, calm typography, generous silence, motion that feels machined — never decorative. Side B turns the lights on: cream daylight over the mountain.

| | |
|---|---|
| **Theme** | Wine (Lado A, Hi-Fi) → cream (Lado B, El buen vivir) → wine (contact). Mood changes happen in exactly two places: the A→B transition and the return before contact. |
| **Base style** | **A · Apple-style editorial**: oversized sentence-case type, tight tracking, flat color fields, hairline rules, a single glass navbar. No texture, no grain, no skeuomorphic gear. Restraint is the luxury. |
| **Three adjectives** | calm · precise · expensive |
| **Signature shape** | The vinyl record, drawn minimally: a near-black disc, 6–8 hairline grooves, a wine center label. One per screen at most. On Side B it becomes the sun. |
| **Signature motion** | **"Clarity"** — everything arrives slowly and cleanly from slightly soft to perfectly sharp (opacity + 24px rise + a line that draws). A thin waveform hairline is the only recurring motif: noisy at first, then a clean sine. That *is* high fidelity. |
| **Anti-references** | DJ-template neon, equalizer GIFs, grain/vintage clutter, gear dials, glitch/scramble text, marquees, bouncy "playful" UI, anything that moves without a reason. |

**Aesthetic:** Think apple.com product page crossed with a Blue Note reissue. One idea per screen. Headlines are enormous and short. Body text is small, grey-cream and generous. Most of the page is empty on purpose. The record appears slowly, once, and does not compete with the words. It is NOT a nightclub, NOT retro-kitsch, NOT busy.

> No logo yet. Identity = the wordmark "Cristian Calle" in Inter Tight + a minimal "CC" monogram on a record label.

---

## 1. Color
Client's palette: vino tinto + crema. Brass is used like a jeweler's detail, never as paint.

| Name | HEX | OKLCH | Token | Role |
|------|-----|-------|-------|------|
| Vino tinto | `#5C1A24` | `oklch(0.328 0.096 15.4)` | `--c-brand` | Lado A background, hero, contact. |
| Vino profundo | `#3D0F17` | `oklch(0.250 0.072 13.8)` | `--c-brand-deep` | Raised surfaces on wine, headings on cream. |
| Rosa vino | `#D9A3A0` | `oklch(0.765 0.065 22.3)` | `--c-brand-soft` | Secondary text on wine. |
| Crema | `#F2E6D0` | `oklch(0.929 0.032 82.8)` | `--c-light` | Text on wine, Lado B background. |
| Crema 2 | `#E7D5B5` | `oklch(0.880 0.047 82.0)` | `--c-light-2` | Cards and frames on cream. |
| Casi negro | `#1C0A0D` | `oklch(0.174 0.032 10.3)` | `--c-dark` | Intro, the record, body text on cream. |
| Casi negro 2 | `#2B1116` | `oklch(0.219 0.043 9.1)` | `--c-dark-2` | Alternate dark surfaces. |
| Latón | `#D4A659` | `oklch(0.752 0.109 78.7)` | `--c-accent` | The word "Hi-Fi", hairlines, primary button on wine. **Max 5% of any screen.** |
| Ámbar | `#E8643A` | `oklch(0.661 0.174 37.9)` | `--c-accent-2` | "Próxima" tag and sound-on dot only. Max 1 element per screen, ≥24px or graphic. |

Proportion: 50% wine · 12% near-black · 32% cream · 3% brass · 3% rose · <1% amber.

**Semantic tokens** (sections declare `data-surface="brand | dark | light"`):

| Token | brand | dark | light |
|-------|-------|------|-------|
| `--surface` | `--c-brand` | `--c-dark` | `--c-light` |
| `--surface-raised` | `--c-brand-deep` | `--c-dark-2` | `--c-light-2` |
| `--text` | `--c-light` | `--c-light` | `--c-dark` |
| `--text-muted` | `--c-brand-soft` | `--c-brand-soft` | `color-mix(in oklch, var(--c-brand-deep) 78%, var(--c-light))` |
| `--text-accent` | `--c-accent` | `--c-accent` | `--c-brand` |
| `--action-bg` / `--action-text` | `--c-light` / `--c-brand-deep` | `--c-light` / `--c-dark` | `--c-brand` / `--c-light` |
| `--line` | `color-mix(in oklch, var(--c-light) 16%, transparent)` | same | `color-mix(in oklch, var(--c-brand) 18%, transparent)` |

Primary buttons are **cream on wine** (Apple-like, calm); brass is reserved for the word "Hi-Fi" and tiny details.

**Contrast (measured, WCAG):** crema/vino 10.44:1 ✅ · crema/vino profundo 13.29:1 ✅ · crema/casi negro 15.48:1 ✅ · rosa/vino 5.96:1 ✅ · latón/vino 5.77:1 ✅ · latón/casi negro 8.55:1 ✅ · vino/crema 10.44:1 ✅ · vino profundo/crema 13.29:1 ✅ · casi negro/crema 15.48:1 ✅ · ámbar/vino 3.88:1 ⚠️ (≥24px or graphics only). Forbidden: brass or rose text on cream. Text over photos always on a ≥60% wine/black gradient.

**Mood layers:** two fixed full-viewport layers (wine, cream) cross-faded with `opacity` scrubbed by the A→B section. Never animate `background-color`. `theme-color` meta follows the section.

**Alternate palettes (`?demo`, optional):** A Vino tinto (client) · B Whisky `#4A2412` · C Verde sala `#1F3A2E`, same token structure; re-measure contrast before showing.

---

## 2. Typography

| Role | Family | Token | Settings |
|------|--------|-------|----------|
| Display & headings | **Inter Tight** | `--f-display` | wght 600–650 for the name and hero; 500–600 headings; **sentence case**; tracking −0.04em on display, −0.03em on headings; line-height 0.95–1.05 |
| Accent | **Instrument Serif** italic | `--f-accent` | 400 italic. ONLY for the word "Hi-Fi", "buen vivir" and one quote per screen. Never more than 2 words. |
| Body & UI | **Inter** (variable, `opsz` on) | `--f-body` | 400/500/600, line-height 1.55–1.6 |

Small labels (eyebrows, dates, "Lado A") use Inter 500 at 12–13px, UPPERCASE, tracking +0.08em, `--text-muted`. No monospace.

### Fluid scale (360 → 1440px)

| Role | Size token | Line height | Tracking |
|------|-----------|-------------|----------|
| eyebrow | `.8125rem` | 1.3 | +0.08em UPPERCASE |
| body-sm | `clamp(.875rem, .8542rem + .0926vw, .9375rem)` | 1.55 | 0 |
| body | `clamp(1rem, .9583rem + .1852vw, 1.125rem)` | 1.6 | 0 |
| lead | `clamp(1.25rem, 1.1rem + .6667vw, 1.75rem)` | 1.4 | −0.012em |
| accent | `clamp(1.75rem, 1.4rem + 1.5vw, 2.75rem)` | 1.1 | −0.01em |
| subheading | `clamp(1.75rem, 1.4167rem + 1.4815vw, 2.75rem)` | 1.05 | −0.03em |
| heading | `clamp(2.75rem, 1.6rem + 5.1vw, 6rem)` | 0.98 | −0.04em |
| display | `clamp(3.5rem, 1rem + 11vw, 11rem)` | 0.92 | −0.045em |

Rules: `text-wrap: balance` on headings, `pretty` on paragraphs, max `60ch`; `tabular-nums` for dates and counters; only real weights loaded (no faux bold). Self-host woff2 (latin subset), preload Inter Tight, metric-matched fallbacks (size-adjust), re-split text and `ScrollTrigger.refresh()` after `document.fonts.ready`. Single-file delivery: fonts as base64 woff2.

---

## 3. Space & layout
Base unit 4px · density **very airy**: sections breathe; one message per screen.
`--gutter: clamp(1.25rem, .8rem + 1.9vw, 2.5rem)` · `--space-section: clamp(7rem, 4.5rem + 10vw, 14rem)` · `--page-max: 1280px` · `--measure: 60ch`. Grid 12/8/4 columns, gap 24px. Use `100svh`, safe-area insets, container queries. Hero and statement text is centered or left-aligned in a wide, quiet column; do not fill the width with cards. Separate content with hairline rules, not boxes.
Z-index: `--z-mood -1` · `--z-base 0` · `--z-nav 50` · `--z-float 60` · `--z-modal 90` · `--z-toast 95` · `--z-intro 110`.

---

## 4. Shape & surfaces
Radius: buttons 9999px · cards/photos `--r-card: 20px` · panels/sheets 28px · inputs 12px · portrait and record 50%. Nested radius = outer − padding.

- **Navbar glass (the only glass):** `background: rgb(61 15 23 / .72); backdrop-filter: saturate(180%) blur(20px); border-bottom: 1px solid var(--line)`; on Side B: `rgb(242 230 208 / .78)`. Solid fallback via `@supports not (backdrop-filter: blur(1px))` and `prefers-reduced-transparency`. Never animate `backdrop-filter`.
- **Record:** SVG, `--c-dark` disc, 6–8 hairline grooves (`--c-brand-deep`, 0.5px), a `--c-brand` center label with the "CC" monogram. A very soft conic sheen (white 5%) that stays fixed while the disc rotates beneath. No textures, no scratches.
- **Cards:** flat `--surface-raised`, 20px radius, no border, a single soft shadow `--sh-float`.
- **No grain layer. No noise overlays. No brass screws.**

Elevation: `--sh-float: 0 1px 2px rgb(28 10 13 / .08), 0 16px 40px -16px rgb(28 10 13 / .40)` · `--sh-lift: 0 2px 4px rgb(28 10 13 / .10), 0 32px 64px -24px rgb(28 10 13 / .55)`. Animate elevation via pseudo-element opacity.

---

## 5. Motion system (sober)

### Principles
1. **One easing family, one feeling:** everything decelerates smoothly, like a heavy platter slowing down. No bounce, no overshoot, no rotation tricks, no skew, no scramble/glitch.
2. **Slow and short travel:** entrances 900–1100ms, 24px rise at most. Less movement, more confidence.
3. **One thing at a time:** max 1 hero moment per screen; everything else is quiet.
4. **Compositor only:** `transform`, `opacity`, `clip-path`, SVG stroke. Never `filter`, `width`, `height`, `top`, `box-shadow`, `backdrop-filter`.
5. **Scroll is sacred:** no pin, no scroll-jacking. "Sticky stages" use CSS `position: sticky`.

### Tokens
Durations: `--d-instant 120ms` · `--d-fast 200ms` · `--d-base 360ms` · `--d-slow 700ms` · `--d-reveal 1000ms`.
Easings: `--ease-out: cubic-bezier(.22, 1, .36, 1)` (GSAP `power3.out`; the default for nearly everything) · `--ease-io: cubic-bezier(.65, 0, .35, 1)` (GSAP `power3.inOut`; for cross-fades and scrubs) · `--ease-in: cubic-bezier(.5, 0, .75, 0)` (exits only).
Springs (Motion), critically damped, no visible overshoot: `ui { stiffness: 220, damping: 30 }` · `soft { stiffness: 120, damping: 26 }`.

### Effect catalog (the ONLY effects allowed)

| Name | Spec |
|------|------|
| `reveal-up` | y 24→0, opacity 0→1, 1000ms `power3.out`, `start: "top 88%"`, once. The workhorse. |
| `mask-lines` | SplitText `lines`, masked, yPercent 105→0, stagger .07, 1100ms `expo.out`. Headlines only. |
| `draw-line` | SVG waveform/hairline draws 0→100% over 1.4s `power2.inOut` (DrawSVG), once. |
| `clarity` | The signature: a waveform path morphs from noisy to a clean sine (MorphSVG) over 1.6s `power2.inOut` while text beside it reveals. Max once per section. |
| `scrub-grow` | Image/card grows `clip-path: inset(6% 4% round 20px)` → `inset(0 round 0)`, scrub 0.6, no pin. |
| `fade-through` | Sticky-stage text swaps by cross-fading opacity (scrubbed, ease-io), no movement. |
| `highlight-words` | Words go opacity .22→1, scrubbed `top 75%` → `bottom 45%`. |
| `parallax` | yPercent −4→4, desktop only, scrub. |
| `record-spin` | Rotation at **one turn per 24s** (slow, ambient). Scroll velocity may raise it to at most ×2, eased back in 1.2s. Spins up from rest over 1.6s `power3.out` when entering view; pauses off-screen. |
| `counter` | 0→N, 1.4s `power2.out`, tabular-nums, once. |
| `hover` | Buttons: background lightens 6%, 200ms. Cards: translateY −3px + `--sh-lift` opacity, 360ms. Links: underline draws left→right 300ms. |
| `press` | scale .98, 120ms. |

Not allowed: `signal-scramble`, stamps, marquees, skew, magnetic buttons, custom cursors, tonearm/VU/knob animations, 3D flips, particles, confetti, shaking.

### Reduced motion
Intro → 300ms fade. All reveals → 200ms opacity. `clarity`, `scrub-grow`, `highlight-words`, `parallax`, `fade-through` → static final state. `record-spin` stopped. `counter` → final value.

---

## 6. Components

- **Primary button:** pill, 52px, padding 0 28px, Inter 600 at body size. Cream background, wine-deep text on wine surfaces; wine background, cream text on cream surfaces. Hover: lighten 6%. Press: `press`. No magnetic effect.
- **Secondary button:** pill, 1px `--line` border, transparent, `--text`. Hover: border to `--text` at 50%.
- **Text link:** underline draws on hover; trailing arrow nudges 3px.
- **Navbar:** glass bar 52px (48px compact). Left: small "CC" record mark (22px) + wordmark "Cristian Calle" (Inter Tight 600). Center: links (Inter 500, 13px, `--text-muted`, active in `--text`). Right: sound toggle (small speaker icon, off by default) + "Hablemos" pill (secondary). Switches wine ↔ cream with the section under it. Mobile: burger → full-screen menu with large Inter Tight links entering with `reveal-up`, stagger .05.
- **List row (services):** big number-free rows: title (Inter Tight 500, subheading size) + one-line description in `--text-muted`, hairline between rows, a "+" at right. Hover: row text shifts 6px right, 360ms. Click opens a bottom sheet.
- **Session card:** poster image (20px radius) with title, venue and date below in body-sm. Horizontal native-scroll rail on all sizes, `scroll-snap-type: x proximity`, 72–80% card width on mobile. "Próxima" tag (ámbar dot + text) only when the date is in the future.
- **Reel frame:** 9:16, 20px radius, poster or muted looping video only while in view, caption in body-sm.
- **Form fields:** 52px, 12px radius, label above (eyebrow style), `--surface-raised` fill, 1px `--line`; focus: 2px `--text-accent` ring with 3px offset. Inline validation on blur; error = text + icon, never color alone.
- **Sheet/modal:** desktop 640px modal, mobile bottom sheet (handle, drag to close), focus trap, `Esc`, focus return, scroll lock without layout jump.
- **Sound toggle:** off by default; when on, a very quiet ambient vinyl-room tone (Web Audio synthesis, volume ≤ .12) and the waveform hairline reacts subtly. Persisted in localStorage; mutes when the tab is hidden; `aria-pressed`.
- **Waveform hairline:** SVG, 1px, `--text` at 60%; used under the hero and in the footer. Not a canvas, not an oscilloscope.

---

## 7. Imagery
He has a strong look (retro sunglasses, mustache, relaxed shirts, leather jacket) and event posters in wine/cream/red tones that already match this palette. Wanted files (placeholders until delivered): `retrato.jpg`, `cabina.jpg`, `vinilo-manos.jpg`, `sala.jpg`, 3 posters, `buen-vivir-1..6`.
Treatment: color-graded warm, deep blacks, no filters or effects; portrait cut in a circle (record motif), other images 20px radius. Entrances: `clip-path` reveal 1000ms. Never text over a photo without a gradient. No stock, no AI-generated photos. Placeholder: `--c-light-2` / `--c-brand-deep` frame with the record mark at 25% and "Foto próximamente". AVIF/WebP, `srcset`, LQIP, explicit dimensions.

## 8. Icons
Phosphor Light, 1.5px stroke, `currentColor`, 20/24px. Custom SVG only for the record, waveform, sun, mountain, bicycle and cup (thin 1.5px lines). No emoji.

## 9. Do's and Don'ts
**Do:** one idea per screen; huge short headlines in sentence case; lots of empty space; let wine and cream do the work; use brass only on "Hi-Fi" and one small detail; make every transition slow and smooth.
**Don't:** never mention "Monte Hi-Fi"; no glitch, scramble, neon, grain, marquee, gear dials or bouncy UI; no bold black weights of Inter Tight (max 650); no brass/rose text on cream; no amber text under 24px on wine; no more than 2 italic serif words per screen; no emoji.

## 10. Quick start

```css
:root, :root[data-palette="a"] {
  --c-brand: #5C1A24; --c-brand-deep: #3D0F17; --c-brand-soft: #D9A3A0;
  --c-light: #F2E6D0; --c-light-2: #E7D5B5;
  --c-dark: #1C0A0D; --c-dark-2: #2B1116;
  --c-accent: #D4A659; --c-accent-2: #E8643A;

  --f-display: 'Inter Tight', 'Inter Tight Fallback', system-ui, -apple-system, sans-serif;
  --f-accent: 'Instrument Serif', Georgia, serif;
  --f-body: 'Inter', 'Inter Fallback', system-ui, -apple-system, 'Segoe UI', sans-serif;
  --t-display: clamp(3.5rem, 1rem + 11vw, 11rem);
  --t-heading: clamp(2.75rem, 1.6rem + 5.1vw, 6rem);
  --t-subheading: clamp(1.75rem, 1.4167rem + 1.4815vw, 2.75rem);
  --t-accent: clamp(1.75rem, 1.4rem + 1.5vw, 2.75rem);
  --t-lead: clamp(1.25rem, 1.1rem + .6667vw, 1.75rem);
  --t-body: clamp(1rem, .9583rem + .1852vw, 1.125rem);
  --t-body-sm: clamp(.875rem, .8542rem + .0926vw, .9375rem);
  --t-eyebrow: .8125rem;

  --gutter: clamp(1.25rem, .8rem + 1.9vw, 2.5rem);
  --space-section: clamp(7rem, 4.5rem + 10vw, 14rem);
  --page-max: 1280px; --measure: 60ch;
  --r-card: 20px; --r-panel: 28px; --r-input: 12px;
  --sh-float: 0 1px 2px rgb(28 10 13 / .08), 0 16px 40px -16px rgb(28 10 13 / .40);
  --sh-lift: 0 2px 4px rgb(28 10 13 / .10), 0 32px 64px -24px rgb(28 10 13 / .55);

  --d-instant: 120ms; --d-fast: 200ms; --d-base: 360ms; --d-slow: 700ms; --d-reveal: 1000ms;
  --ease-out: cubic-bezier(.22, 1, .36, 1);
  --ease-io: cubic-bezier(.65, 0, .35, 1);
  --ease-in: cubic-bezier(.5, 0, .75, 0);
}
[data-surface="brand"] { --surface: var(--c-brand); --surface-raised: var(--c-brand-deep); --text: var(--c-light); --text-muted: var(--c-brand-soft); --text-accent: var(--c-accent); --action-bg: var(--c-light); --action-text: var(--c-brand-deep); --line: color-mix(in oklch, var(--c-light) 16%, transparent); }
[data-surface="dark"]  { --surface: var(--c-dark); --surface-raised: var(--c-dark-2); --text: var(--c-light); --text-muted: var(--c-brand-soft); --text-accent: var(--c-accent); --action-bg: var(--c-light); --action-text: var(--c-dark); --line: color-mix(in oklch, var(--c-light) 16%, transparent); }
[data-surface="light"] { --surface: var(--c-light); --surface-raised: var(--c-light-2); --text: var(--c-dark); --text-muted: color-mix(in oklch, var(--c-brand-deep) 78%, var(--c-light)); --text-accent: var(--c-brand); --action-bg: var(--c-brand); --action-text: var(--c-light); --line: color-mix(in oklch, var(--c-brand) 18%, transparent); }
[data-surface] { background: var(--surface); color: var(--text); }
@media (prefers-reduced-motion: reduce) { :root { --d-fast: 0ms; --d-base: 120ms; --d-slow: 200ms; --d-reveal: 200ms; } }
```

```html
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter+Tight:wght@500;600;650&family=Inter:opsz,wght@14..32,400..600&family=Instrument+Serif:ital@1&display=swap">
<!-- Production: self-host as woff2 (latin subset); single-file delivery: embed as base64 -->
```

```ts
// src/lib/motion.ts
export const dur = { instant: 0.12, fast: 0.2, base: 0.36, slow: 0.7, reveal: 1.0 } as const;
export const ease = { out: [0.22, 1, 0.36, 1], io: [0.65, 0, 0.35, 1], in: [0.5, 0, 0.75, 0] } as const;
export const gsapEase = { out: "power3.out", expo: "expo.out", io: "power3.inOut", in: "power2.in" } as const;
export const spring = { ui: { type: "spring", stiffness: 220, damping: 30 }, soft: { type: "spring", stiffness: 120, damping: 26 } } as const;
export const record = { secondsPerTurn: 24, maxScrollBoost: 2 } as const;
```
