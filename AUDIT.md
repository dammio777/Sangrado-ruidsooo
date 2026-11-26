# Auditoría · Cristian Calle (v1 → v2)

Fecha: 2026-11-26 · Rama: `ccr-37bf4c99-2csx7l` · Base auditada: commit `7761cd3`

## 0. Entradas y supuestos

- **`DESIGN.md` v2 y `PROMPT.md` v2 no están en el repositorio ni en la sesión.** Solo existen las versiones v1 (`DESIGN_4.md`, `PROMPT_3.md`) con las que se construyó el sitio. Sigo la regla 0 del brief ("si falta un archivo, dilo y continúa"): audito contra los valores v2 **que el propio brief de revisión especifica** y marco con **(sup.)** todo lo que depende de un dato de v2 que no tengo.
- **"Known issues from the owner" vino vacío** (texto de plantilla `{{PASTE HERE…}}`). No hay hallazgos del dueño.
- Supuestos v2 **(sup.)** usados para corregir:
  | Tema | Valor usado |
  |---|---|
  | Display / headings | Inter Tight 650 (display) / 600 (headings), tracking −0.04em / −0.03em, interlineado 0.94 / 1.02 |
  | Cuerpo y etiquetas | Inter 400/500; etiquetas pequeñas en Inter 600 13 px, mayúsculas con tracking +0.06em (sin monoespaciada) |
  | Acento | Instrument Serif itálica 400 solo en "Hi-Fi" y "buen vivir" |
  | Escala tipográfica | Se conservan los `clamp()` actuales (ya fluidos 360→1440) |
  | `clarity` | Línea SVG que pasa de ruidosa a seno limpio (morph de path) + opacidad, con scrub |
  | `fade-through` | Dos capas apiladas que se cruzan por opacidad |
  | `scrub-grow` | Escala ligada al scroll (sin pin) |
  | `draw-line` | DrawSVG 0→100 % |
  | Botón primario | Crema sobre vino / vino sobre crema (§6 v2, citado en el brief) |
  | Hairlines | Crema (o vino en Lado B) a baja opacidad; latón solo como acento puntual |

## 1. Descubrimiento

- **Stack:** Vite 8.3.8 · React 19.3.1 · TS 5.9.3 strict · Tailwind 4.3.5 · GSAP 3.15.1 (ScrollTrigger, SplitText, ScrambleText, Flip*, DrawSVG, MorphSVG*, CustomEase; *diferidos) · Motion 14.14.0 (LazyMotion) · Lenis 1.3.28 (diferido, solo escritorio) · Zustand 5.1.0. Prerender propio (`scripts/prerender.mjs`).
- **Tokens:** `src/styles/tokens.css` (+ `@theme` en `index.css`). **Copy:** `src/config/site.ts`. **Motion:** `src/lib/motion.ts`, `lib/reveal.ts` (entradas declarativas `data-reveal`), un reloj único `lib/ticker.ts` sobre `gsap.ticker`. **Scroll:** Lenis en escritorio con puntero fino, nativo en táctil.
- **Build:** pasa, 0 errores TS, 0 errores/avisos de consola. **JS inicial ≈ 170 KB gzip** (index 155,7 + chunk de Motion 11,2 + runtime 3,3).
- **Versión implementada: v1.** Presentes todos los marcadores v1: Fraunces + IBM Plex Mono, texto scramble, marquesina, cursor propio, grano, brazo de progreso, VU, osciloscopio en canvas, caja 3D de fundas, flip `rotateY`, botones magnéticos, skew por velocidad y UI cargada de latón.
- **Línea base** (`verify-out/before/`): capturas 375/768/1440 por sección + transiciones.
  | Métrica (Lighthouse móvil, 3 corridas) | Base |
  |---|---|
  | Performance | 92–93 |
  | Accessibility | 100 |
  | Best Practices | 96 (falla `font-size`: microtexto SVG de 8,4 px) |
  | SEO | 100 |
  | LCP / CLS / TBT | 2,3 s / 0,02 / 170–230 ms |
  | INP de laboratorio (CPU ×4, 10 interacciones) | 88 ms |
  | JS inicial gzip | ≈ 170 KB |

## 2. Hallazgos del dueño

Ninguno (sección vacía en el brief).

## 3. Hallazgos

Severidad: P0 roto/prohibido · P1 violación visible de la spec · P2 pulido · P3 opcional. No se encontró ningún P0.

### A. Tipografía
| ID | Sev | Dónde | Problema | Esperado | Arreglo |
|---|---|---|---|---|---|
| A1 | P1 | `tokens.css:21`, `index.css` (todos los títulos) | Display y headings en Fraunces 300–350 | Inter Tight 600–650, sentence case (§2) | Cambiar `--f-display` y pesos |
| A2 | P1 | `.mono`, `.eyebrow`, etiquetas, hoja técnica, fundas, form | IBM Plex Mono en toda la UI | Sin monoespaciada (§2) | Etiquetas en Inter |
| A3 | P1 | `--f-body` | Cuerpo en DM Sans | Inter (§2) | Cambiar `--f-body` |
| A4 | P1 | marquesina, frase "Café y bici…", subtítulos de fundas, ficha, "CC" del label, "Gracias, papá Dios." | Itálica serif en muchos lugares | Instrument Serif itálica solo en "Hi-Fi" y "buen vivir", máx. 2 palabras por pantalla | Limitar a esas dos palabras |
| A5 | P1 | `.hero__name`, `.heading`, `.bv__title`… | Tracking −0.035/−0.025em, interlineado 0,9 | −0.04em display / −0.03em headings, 0,92–1,05 | Ajustar |
| A6 | P2 | `index.html` preload, `@font-face` fallbacks | Preload y fallbacks calculados para Fraunces/DM Sans | Fuente display precargada, fallbacks con métricas | Recalcular para Inter Tight / Inter |
| A7 | P2 | `public/favicon*.svg`, `og.png`, íconos | Monograma y OG dibujados con Fraunces/Plex | Coherentes con v2 | Regenerar con Inter Tight |
| A8 | P2 | `--measure: 62ch` | Medida de párrafo 62ch | ≤ 60ch | `60ch` |

### B. Color y superficies
| ID | Sev | Dónde | Problema | Esperado | Arreglo |
|---|---|---|---|---|---|
| B1 | P1 | `--action-bg` (brand/dark), `.nav__cta`, `.floating`, chips | Botón primario latón | Crema sobre vino / vino sobre crema (§6) | Cambiar tokens de acción |
| B2 | P1 | `--line`, eyebrows, números, indicadores | Latón muy por encima del 5 % (hairlines, etiquetas, brazos) | Latón ≤ 5 % por pantalla | Hairlines crema/vino a baja opacidad; latón solo en "Hi-Fi" y foco |
| B3 | P1 | `App.tsx` `.grain`, `.manifesto__grain` | Capa de grano | Sin grano (§4 v2) | Quitar |
| B4 | P1 | `.screw` (hoja, contacto, Instagram) | Tornillos de latón (UI de equipo) | Nada | Quitar |
| B5 | P1 | VU (zona roja y lámpara), gradiente del sol | Ámbar fuera de "Próxima" y el punto de sonido | Ámbar solo ahí | Quitar del VU (se elimina) y del sol |
| B6 | P2 | `.nav__bg--*` | Sin `backdrop-filter`; el brief v2 lo permite solo en la barra con respaldo sólido | Barra con desenfoque + respaldo sólido | `@supports` |
| B7 | P2 | `Navbar.tsx:61`, `Oscilloscope.tsx:24` | Hex sueltos en componentes | Solo tokens | Usar `site.themeBrand/themeLight`; el osciloscopio se elimina |
| B8 | P3 | `Overlays.tsx` | Paletas `?demo` como hex en el componente | Tokens | Se deja: son datos de la tabla de paletas de DESIGN |

### C. Movimiento
| ID | Sev | Dónde | Problema | Esperado | Arreglo |
|---|---|---|---|---|---|
| C1 | P1 | `ui/Scramble.tsx` (hero, eyebrows, flip, handle) | Texto scramble | `mask-lines` / `reveal-up` | Reemplazar y borrar plugin |
| C2 | P1 | `MarqueeSection.tsx` | Marquesina (y `velocity-skew`) | Quitar | Quitar sección |
| C3 | P1 | `ui/Cursor.tsx` | Cursor propio | Cursor nativo | Quitar |
| C4 | P1 | `Button.tsx useMagnetic` | Botones magnéticos | Hover simple | Quitar |
| C5 | P1 | `Tonearm` (hero, servicios, intro), `TonearmProgress` | Brazos | Sin brazo | Quitar |
| C6 | P1 | `VuMeter`, `Oscilloscope`, `EqBars` | Medidores y canvas | Una hairline SVG (`draw-line`/`clarity`) | Hero y manifiesto con hairline SVG |
| C7 | P1 | `Sessions.tsx` + `crate/*` | Caja 3D y `sleeve-pull` | Riel horizontal nativo de tarjetas | Reescribir solo la lista |
| C8 | P1 | `FlipSection.tsx` | Flip `rotateY` / `scaleX` | Escenario sticky con `fade-through` disco → sol | Cruce de capas por opacidad + `scrub-grow` del sol |
| C9 | P1 | `lib/spin.ts`, `motion.ts` | 33⅓ RPM (1,8 s/vuelta), empuje ×4, ease `platter`, scratch | 24 s/vuelta, empuje ≤ ×2 | Ajustar tokens; quitar scratch y CustomEase |
| C10 | P1 | `Intro.tsx` | ~1,8 s con brazo, sacudida, scramble, VU, Flip | ≤ 1,2 s: línea → seno limpio → sube el nombre | Reescribir el timeline |
| C11 | P1 | intro, VU, `gsapEase.needle` | `elastic.out` (sobrepaso) | Solo `power3.out`, `expo.out`, `power3.inOut` | Quitar |
| C12 | P2 | `reveal.ts` | Desplazamiento de entrada 28 px | ≤ 24 px | 24 px escritorio / 16 px móvil |
| C13 | P2 | `Services.tsx` | Escala del label y brazo por tema activo | Catálogo | `fade-through` del número |
| C14 | P2 | `Footer.tsx` `data-reveal="chars"` | Caracteres escalonados | `mask-lines` | Por líneas |
| C15 | P2 | `Hero.tsx` | Brillo del disco que sigue al cursor | No está en el catálogo | Brillo estático |
| C16 | P2 | `Navbar.tsx` | Marca gira sin límite con la velocidad | `record-spin` (24 s, ≤ ×2) | Usar el spinner común |
| C17 | P3 | `Button.tsx` | LED del botón | Hover simple | Quitar |

### D. Integridad del scroll
| ID | Sev | Dónde | Problema | Esperado | Arreglo |
|---|---|---|---|---|---|
| D1 | P2 | `Sessions.tsx onKey` | `preventDefault` en ↑/↓/Home/End con foco en la caja | Ningún `preventDefault` en teclas | El riel usa scroll nativo; botones prev/sig |
| D2 | — | global | Sin pin, sin snap obligatorio en la página, Lenis solo escritorio (`duration 1`, `syncTouch false`, `lagSmoothing(0)`, en `gsap.ticker`), pausa con hoja/menú | — | ✅ cumple |

### E. Rendimiento
| ID | Sev | Dónde | Problema | Esperado | Arreglo |
|---|---|---|---|---|---|
| E1 | P1 | bundle inicial | ≈ 170 KB gzip | < 150 KB | Quitar ScrambleText, CustomEase y los efectos v1 |
| E2 | P2 | CSS | Falta `content-visibility: auto` bajo el pliegue | Requerido | Añadir + `ScrollTrigger.refresh` al cambiar la altura |
| E3 | P2 | `Placeholder.tsx` | `SiteImg` no admite `srcset`/`sizes` | AVIF/WebP + `srcset` | Campos opcionales |
| E4 | P2 | `Record.tsx` | Microtexto SVG de 8,4 px (Best Practices 96) | Legible / UI de equipo fuera | Quitar el texto circular |

### F. Accesibilidad
| ID | Sev | Dónde | Problema | Esperado | Arreglo |
|---|---|---|---|---|---|
| F1 | P2 | `Contact.tsx` | Errores solo con texto | Texto + ícono, `aria-live` | Añadir ícono |
| F2 | P2 | `reveal.ts` | SplitText con `aria:"none"` en vez de `aria-label` | Texto real accesible | Se mantiene: el texto real queda en el DOM; `aria-label` en `span`/`p` falla axe (`aria-prohibited-attr`) |
| F3 | — | global | Una h1, landmarks, skip link, foco visible, trampa de foco, Esc, `aria-pressed`, objetivos ≥ 44 px | — | ✅ cumple (`scripts/verify.mjs`) |

### G. Contenido
| ID | Sev | Dónde | Problema | Esperado | Arreglo |
|---|---|---|---|---|---|
| G1 | P1 | `App.tsx` | Sección de marquesina fuera del orden v2 | hero, Hi-Fi, servicios, sesiones, transición, buen vivir, contacto, footer | Quitar (C2) |
| G2 | P2 | `Sessions.tsx`, `Contact.tsx`, `FlipSection.tsx`, `Hero.tsx`, `BuenVivir.tsx`, `Footer.tsx` | Textos fijos en componentes | Todo el copy en config | Moverlos a `copy` |
| G3 | — | — | "Monte Hi-Fi" no aparece (src, dist, public) · videos "hace" ✅ · enlace IG nueva pestaña + `noopener` ✅ · placeholders ✅ · fechas es-CO ✅ | — | ✅ |

### H. Funcionalidad
| ID | Sev | Dónde | Problema | Esperado | Arreglo |
|---|---|---|---|---|---|
| H1 | ❓ | `site.ts person.whatsapp` | Sin número: el enlace es `wa.me/?text=` (el usuario elige el chat) | `wa.me/57…` | Requiere el número del dueño |
| H2 | P2 | `lib/audio.ts` | Si `AudioContext` está bloqueado o falla, el toggle queda en ON | Sin errores, estado coherente | `try/catch` + revertir el toggle |
| H3 | — | form, hoja, flotante, reels | — | — | ✅ cumple |

### I. Responsive
| ID | Sev | Dónde | Problema | Esperado | Arreglo |
|---|---|---|---|---|---|
| I1 | — | global | Sin overflow a 320 px; `100svh`; safe areas | — | ✅ cumple |

### J. SEO
| ID | Sev | Dónde | Problema | Esperado | Arreglo |
|---|---|---|---|---|---|
| J1 | ❓ | `prerender.mjs` | Sin dominio: no hay canonical y el sitemap usa una URL provisional | Canonical | Requiere `SITE_URL` |
| J2 | P2 | assets | OG y favicon con tipografía v1 | v2 | Regenerar (A7) |

### K. Calidad de código
| ID | Sev | Dónde | Problema | Esperado | Arreglo |
|---|---|---|---|---|---|
| K1 | P2 | `package.json` | `opentype.js` sin uso; paquetes de fuentes v1 | Sin dependencias sin uso | Quitar / cambiar |
| K2 | P2 | `validate.ts:28` | `console.info` (solo dev) | Sin `console` | Quitar; los faltantes ya se ven con `?pending` |
| K3 | P2 | varios | Duraciones y eases sueltos | Desde `lib/motion.ts` | Usar los tokens en el código que se toca |
| K4 | P2 | `audio.ts`, `signal.ts` | Exportaciones muertas tras quitar medidores | — | Limpiar |

## 4. Plan de arreglos (commits)

No hay P0. Orden: P1 → P2 → P3 rápidos.

Orden ejecutado (movimiento primero: elimina CSS que tipografía habría tocado en vano):

1. `motion` — C1–C17, G1, D1.
2. `typography` — A1–A6, A8.
3. `color` — B1–B7, E4.
4. `accessibility` — F1.
5. `content` — G2, K2.
6. `performance` — E1, E2, E3, K1, K4.
7. `seo` — A7 / J2.
8. `functionality` — H2 (audio, riesgo: commit propio).
9. `scroll` — corrección de anclajes con `content-visibility` (riesgo: commit propio, al final).

## 5. Resultado de la revisión

### 5.1 Resumen
- Encontrados: **0 P0 · 23 P1 · 23 P2 · 2 P3 · 2 ❓** (más 5 ítems que ya cumplían, marcados ✅ en las tablas).
- Arreglados: **23/23 P1 · 22/23 P2 · 1/2 P3**. Sin cambiar: F2 (P2, se mantiene a propósito) y B8 (P3, datos de `?demo`).
- Quedan para el dueño: **H1** (número de WhatsApp) y **J1** (dominio).

### 5.2 Estado por hallazgo
| ID | Estado | Nota |
|---|---|---|
| A1–A6, A8 | ✅ | Inter Tight / Inter / Instrument Serif; fuentes 81 KB |
| A7, J2 | ✅ | favicon (`scripts/favicon.py`), OG e íconos regenerados |
| B1–B7 | ✅ | contrastes en `verify-out/contrast.txt` (todos ≥ 4,5:1) |
| B8 | ⏭️ | P3: las paletas de `?demo` son datos de DESIGN §1.6 |
| C1–C17 | ✅ | catálogo v2; intro 1,2 s; disco 24 s/vuelta |
| D1 | ✅ | riel nativo; ningún `preventDefault` en teclas |
| E1 | ✅ | JS inicial 139 KB gzip |
| E2 | ✅ | `content-visibility` + refresh + corrección de anclajes |
| E3 | ✅ | `<picture>` AVIF/WebP + `srcset`/`sizes` listos para cuando haya fotos |
| E4 | ✅ | sin microtexto: Best Practices 96 → 100 |
| F1 | ✅ | error = texto + ícono, `aria-live="polite"` |
| F2 | ⏭️ | Se mantiene `aria:"none"`: el texto real queda en el DOM; `aria-label` en `span`/`p` falla axe |
| G1, G2 | ✅ | |
| H1 | ❓ | falta el número: hoy `wa.me/?text=` |
| H2 | ✅ | |
| J1 | ❓ | falta el dominio (`SITE_URL`) |
| K1–K4 | ✅ | |

### 5.3 Métricas antes / después (Lighthouse móvil, 3 corridas; servidor con gzip)
| Métrica | Antes | Después |
|---|---|---|
| Performance | 92–93 | 98–99 |
| Accessibility | 100 | 100 |
| Best Practices | 96 | 100 |
| SEO | 100 | 100 |
| LCP | 2,3 s | 1,5–1,7 s |
| CLS | 0,02 | 0 |
| TBT | 170–230 ms | 110–130 ms |
| INP de laboratorio (CPU ×4) | 88 ms | 96 ms |
| JS inicial (gzip) | ≈ 170 KB | 139 KB |
| Fuentes | ≈ 200 KB | 81 KB |
| Peso total de la página | 471 KB | 261 KB |

El INP sube 8 ms (sigue muy por debajo de 200 ms): la hoja de servicios ahora trae Motion en su propio chunk al abrirse por primera vez.

### 5.4 Verificación
- `npm run build`: 0 errores de TS, 0 errores/avisos de consola en 320/375/768/1440.
- `scripts/verify.mjs`: **26/26 PASS** (teclado, hoja, riel, formulario, menú, sonido OFF/persistencia/pestaña oculta/bloqueado, rueda, táctil, AvPág/Espacio/Inicio/Fin, bajo consumo, reduced motion, sin JS).
- Sin overflow a 320 px. `grep -ri "monte hi"` en `src`, `dist`, `public`: 0 resultados.
- Capturas en `verify-out/before|after/` y comparaciones en `verify-out/compare/` (carpeta local, fuera de git). El intro a mitad no tiene captura "antes": el script v1 no capturaba ese momento.
