# Revision brief — Cristian Calle (audit & fix an existing site)

You are a senior creative developer and design QA lead at a top-tier agency. A website for **Cristian Calle** has ALREADY been built. Your job is **not to rebuild it**: audit it against the specification, then fix what deviates, with surgical, reviewable changes. Keep everything that already meets the standard.

Inputs you have: the existing codebase (and/or a live URL), `DESIGN.md` (v2, Apple-style, visual source of truth) and `PROMPT.md` (v2, content/structure/behavior source of truth). If a file is missing, say so and continue with what you have.

## 0. Rules of engagement
1. **Audit first, then fix.** Do not edit anything until the audit report (section 3) is written. Show the report, then fix without waiting for confirmation unless a fix is destructive or ambiguous.
2. **Minimal diffs.** Do not rewrite files, change the stack, rename things, reorganize folders or "modernize" code that works. Touch only what a finding requires.
3. **Preserve what works:** the content, the owner's approved copy, working integrations, URLs, and anything not in the findings.
4. **The spec wins:** DESIGN.md decides every visual and motion choice; PROMPT.md decides content, structure and behavior. When the build and the spec disagree, the spec is right, unless the owner's known issues (section 2) say otherwise.
5. **Never mention "Monte Hi-Fi"** anywhere in the site, metadata, alt text, comments, class or file names. If found, remove it (P0).
6. **No fake data.** Don't invent prices, dates, numbers, testimonials, phone numbers or photos. Unknown data stays a marked placeholder.
7. **One commit per category** of fixes (typography, color, motion, scroll, performance, accessibility, content, SEO), with a clear message. No unrelated changes in a commit.
8. **Reversibility:** if a fix is risky (touches the scroll engine, audio, routing, build config), do it last, in its own commit, and explain how to revert it.

## 1. Discovery (do this before auditing)
1. Read `package.json`, the config/data file, the entry point and the section components. Map: stack and versions, where tokens live, where copy lives, how animations are wired (GSAP / Motion / CSS), how scroll is handled (Lenis or native).
2. Run it: install, `npm run build`, serve the production build. Record console errors/warnings and build size.
3. **Identify which spec version was implemented.** Check for these v1 markers; any of them means the site follows the older, busier spec and must be migrated to v2:
   - Fraunces and/or IBM Plex Mono in use · scrambled/glitch text · marquee · custom cursor · grain overlay · tonearm progress · VU meters · oscilloscope canvas · 3D "crate" of sleeves · rotating `rotateY` record flip · magnetic buttons · skew on scroll · brass-heavy UI.
4. Take full-page and per-section screenshots at **375×812, 768×1024 and 1440×900**, plus mid-scroll captures of the intro, the Lado A → Lado B transition and the contact section.
5. Record a Lighthouse mobile run (Performance, Accessibility, Best Practices, SEO) and Core Web Vitals (LCP, CLS, INP) as the **baseline**.

## 2. Known issues from the owner
{{PASTE HERE what the owner doesn't like or what is broken, in plain words, e.g. "the intro is too long", "texts look too small on phone", "the record spins too fast", "the wine looks brown", "the form doesn't open WhatsApp". Leave empty if none.}}

Treat each item above as a P0/P1 finding with its own entry in the report, even if it isn't in the checklist below. Quote the owner's words in the entry.

## 3. Audit
Produce a report (Markdown, in the chat and saved as `AUDIT.md`) with one table per category. Each finding: **ID · severity · where (file:line or section) · what's wrong · expected (spec reference) · fix**. Severities:
- **P0** — broken, inaccessible, forbidden content ("Monte"), scroll hijacking, console errors, unreadable contrast, missing core content.
- **P1** — clear spec violation visible to users (wrong fonts/colors, banned effects, janky or slow motion, layout breaks).
- **P2** — polish: spacing, rhythm, timing, copy tone, minor inconsistencies.
- **P3** — nice-to-have.

### 3.1 Checklist by category

**A. Typography (DESIGN.md §2)**
- Display/headings are **Inter Tight** 600–650, sentence case, tracking −0.04em display / −0.03em headings, line-height 0.92–1.05. Body is **Inter**. **Instrument Serif italic** only for "Hi-Fi" and "buen vivir", max 2 words per screen. No monospace.
- Fluid `clamp()` scale matches the tokens; no fixed pixel sizes breaking at 320px or 1920px.
- `text-wrap: balance` on headings, `pretty` on paragraphs, measure ≤ 60ch. Tabular numbers on dates/counters.
- Fonts self-hosted (woff2, latin subset), display font preloaded, metric-matched fallbacks, no layout shift, no faux bold/italic, no invisible text flash.

**B. Color & surfaces (DESIGN.md §1, §4)**
- Colors come only from tokens: wine `#5C1A24`, cream `#F2E6D0`, near-black `#1C0A0D`, brass `#D4A659` (≤5% of a screen), amber only for the "Próxima" tag and sound dot. No stray hex values in components (grep for them).
- Lado A reads as **wine red**, not brown or black; Lado B reads as **cream with wine type**. Mood change uses two cross-faded layers (opacity), not animated `background-color`.
- Primary buttons are cream on wine / wine on cream. Contrast ≥ 4.5:1 body, ≥ 3:1 large; no brass/rose text on cream; no amber text under 24px on wine. Text on photos has a gradient.
- No grain/noise overlay, no extra glass. Only the navbar uses `backdrop-filter`, with a solid fallback.

**C. Motion (DESIGN.md §5)**
- Only catalog effects: `reveal-up`, `mask-lines`, `draw-line`, `clarity`, `scrub-grow`, `fade-through`, `highlight-words`, `parallax` (≤4%), `record-spin` (24s/turn, max ×2 boost), `counter`, hover, press.
- **Remove or replace (v1 leftovers):** scramble/glitch text, marquee, custom cursor, magnetic buttons, skew, bounce/overshoot springs, rotation on entrances, tonearm/VU/oscilloscope/knob effects, 3D crate, `rotateY` record flip, particles, grain animation.
- Durations/easings only from tokens (`--d-*`, `--ease-*`; GSAP `power3.out`, `expo.out`, `power3.inOut`). Entrances ~900–1100ms, travel ≤ 24px. Intro ≤ 1.2s, skippable by tap/click/scroll/key, skipped on repeat visits, deep links and reduced motion.
- Only `transform`, `opacity`, `clip-path`, SVG stroke/path morph are animated. No animation of `filter`, `width`, `height`, `top/left`, `box-shadow`, `backdrop-filter`.
- Entrances fire once; nothing re-animates on every scroll direction change; nothing hides content the user already sees; no flash of unstyled/un-animated content.
- Reduced motion matches the DESIGN.md table.

**D. Scroll integrity (PROMPT.md §4)**
- **Zero** `pin`, pinned horizontal scroll, scroll-jacking, mandatory `scroll-snap` on the page, or `preventDefault` on wheel/touch/keys. The sessions rail never captures the wheel. "Sticky" effects use CSS `position: sticky`.
- Lenis only on desktop with fine pointer (`duration: 1.0`, `smoothWheel: true`, `syncTouch: false`); native scroll on touch; Lenis pauses with a sheet open. Single RAF (Lenis driven by `gsap.ticker`), `lagSmoothing(0)`.
- Test wheel, trackpad, touch and keyboard (Space, PageDown, Home/End): never stuck, delayed or captured. Anchors land under the navbar and move focus.

**E. Performance**
- LCP < 2.5s, CLS < 0.05, INP < 200ms on a throttled mid-range phone (4x CPU, Fast 4G). Initial JS < 150KB gzip; sheets, audio and reels are lazy-loaded.
- Images AVIF/WebP with `srcset`/`sizes`, explicit dimensions, lazy except the hero portrait (`fetchpriority="high"`); videos muted, `playsinline`, paused off-screen; `content-visibility: auto` below the fold.
- Everything off-screen is paused (record, waveform, reels, audio); no work in `scroll`/`pointermove` handlers other than `quickTo`/`quickSetter`; no tween created per event; no memory leaks on unmount/HMR (all effects scoped with `useGSAP`/`matchMedia`).

**F. Accessibility (WCAG 2.2 AA)**
- One `h1`, logical headings, landmarks, skip link, visible focus (2px ring, 3px offset), everything keyboard-operable (list rows, sheets, rail, form, sound toggle, menu), focus trapped in sheets and returned on close, `Esc` closes.
- Split/animated text keeps an `aria-label` with the real text; decorative SVG/canvas `aria-hidden`; every image has `alt`; form errors are text + icon, announced via `aria-live="polite"`; touch targets ≥ 44px; `lang="es-CO"`.
- Sound is **off by default** and nothing plays before a user gesture; the toggle has `aria-pressed`.

**G. Content & copy (PROMPT.md §1, §5)**
- All sections exist in the specified order with the specified copy (hero, Hi-Fi statement, services, sessions, Lado B transition, El buen vivir, contact, footer). Copy is in Spanish (Colombia), warm, direct and understated; third person ("Cristian hace…").
- The buen vivir section says he **makes** videos about personal growth, development and buen vivir, and promotes @kristohd13 with a working link (new tab, `rel="noopener"`).
- Pending data shown as marked placeholders ([PONER], "Foto próximamente"); no invented data; no testimonials; `?pending` overlay lists them.
- Dates use `es-CO` formats and 12-hour "8:00 p. m."; the follower counter reads from config, not fetched.
- **"Monte Hi-Fi" appears nowhere** (grep source and `dist/`).

**H. Functionality**
- Contact form: validation on blur, submit disabled until valid, Colombian mobile (10 digits), correct `wa.me/57…` link with the message template fully `encodeURIComponent`-encoded, "Copiar mensaje" fallback, success state.
- Sheets for services work (open, drag/close, focus return). Sessions rail: arrows, keyboard, snap, "Próxima" tag based on date. Reels: play only in view, fall back to poster + link.
- Sound toggle: persists, fades, mutes on hidden tab, no errors if `AudioContext` is blocked.
- Floating "Hablemos" pill appears after the hero, safe-area aware, hidden in the contact section.

**I. Responsive**
- 320px → 1920px+: no horizontal overflow (`scrollWidth === innerWidth` at 320px), no clipped text, no overlapping elements, `100svh` (never `100vh`), safe-area insets respected, readable sizes on phone, tap targets comfortable.
- Mobile keeps every section and the key animations (intro, reveals, `clarity`, transition) without parallax or custom cursor.

**J. SEO & metadata**
- Title and meta description per PROMPT.md §8; canonical; Open Graph/Twitter image 1200×630; JSON-LD `Person` (+ `Event` only for sessions with confirmed dates); sitemap, robots, manifest; SVG favicon "CC"; `theme-color` `#5C1A24` (updates to cream on Lado B).
- Content exists without JS (prerendered); no render-blocking third-party scripts.

**K. Code quality**
- TypeScript strict passes; no `any` leaks in new code; no unused deps; no console statements; no hardcoded copy outside the config; tokens in one place; motion values only from `lib/motion.ts`; no duplicated animation systems on one element.

## 4. Fix plan
After the report, output an ordered plan: all P0, then P1, then P2; P3 only if quick. Group by category and map each commit to finding IDs. Then execute.

**Migration rules when v1 leftovers are found:**
| Found in the build | Replace with |
|---|---|
| Fraunces / Plex Mono | Inter Tight / Inter (+ Instrument Serif italic for the 2 accent words) |
| Scramble or glitch text | `mask-lines` or `reveal-up` |
| Marquee | remove (or a single quiet line of text if the layout needs it) |
| Custom cursor, magnetic buttons | native cursor, plain hover |
| Grain overlay, brass screws, gear UI | nothing |
| Tonearm progress, VU, oscilloscope canvas | one SVG hairline waveform (`draw-line` / `clarity`) |
| 3D crate of sleeves | horizontal native-scroll rail of Session cards |
| `rotateY` record flip | sticky stage cross-fade (`fade-through`), record → sun disc |
| Record at 33⅓ RPM / fast spin | 24s per turn, scroll boost ≤ ×2 |
| Bouncy springs, rotations on entrance | `ui`/`soft` springs, or CSS/GSAP `power3.out` |
| Brass as primary button | cream on wine (see DESIGN.md §6) |
| Intro with tonearm, jolt, scramble | ≤1.2s waveform → clean sine → name rises |

## 5. Verification (after fixing)
1. `npm run build` passes: zero TS errors, zero console errors/warnings.
2. Re-run the same screenshots (375×812, 768×1024, 1440×900, plus transitions) and show **before / after** for every fixed finding.
3. Re-run Lighthouse mobile and compare against the baseline. Targets: Performance ≥ 90, Accessibility 100, Best Practices ≥ 95, SEO 100; LCP < 2.5s, CLS < 0.05, INP < 200ms.
4. Keyboard-only, reduced-motion (`prefers-reduced-motion: reduce`), no-JS and low-power passes.
5. Scroll test with wheel, trackpad, touch and keyboard across the whole page, especially the sessions rail and the Lado B transition.
6. Sound: off by default, nothing plays before input.
7. `grep -ri "monte" src dist` returns nothing related to "Monte Hi-Fi".
8. Verify contrast of every text/background pair that changed.

## 6. Final report
Deliver, in this order:
1. **Summary:** what was wrong, what was fixed, what remains (counts by severity).
2. **Table of findings** with status: ✅ fixed · ⚠️ partially fixed · ⏭️ not fixed (with reason) · ❓ needs owner input.
3. **Before / after** metrics (Lighthouse, LCP, CLS, INP, JS size).
4. **Commit list** mapped to finding IDs.
5. **Open questions for the owner** (placeholders still missing, copy marked [AJUSTAR], decisions that need him).
Be honest: if a check fails or was skipped, say so with the output. Don't claim something is fixed without having verified it.

---

The result must feel like **the same site, but finally right: quieter, sharper, faster and exactly on spec.** Fix what's wrong; don't touch what isn't. When in doubt, remove rather than add.
