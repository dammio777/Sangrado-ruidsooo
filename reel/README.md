# «Esto es Hi-Fi» — reel de presentación (Remotion)

Proyecto en código del reel de Cristian Calle (@kristohd13). 1080 × 1920, 30 fps.

## Renderizar

```bash
npm install
./scripts/render.sh          # deja los entregables en ../entregables
npx remotion studio          # para revisar escena por escena
```

`remotion.config.ts` apunta a un Chromium local (`/opt/pw-browsers/...`). En otra máquina,
borra esa línea y Remotion descarga el suyo.

## Estructura

| Archivo | Qué hay |
|---|---|
| `src/tokens.json` | Tokens de `DESIGN.md` (§1 color, §2 tipo, §4 forma, §5 movimiento) pasados a cuadros |
| `src/content.ts` | **Todo el texto en pantalla.** Afiches (`poster`) y `venueConfirmed` se cambian aquí |
| `src/components/` | Disco, brazo, onda (ruido → señal → montaña), sol, íconos, `mask-lines`, `reveal-up`, `highlight-words` |
| `src/scenes/SideA.tsx` | Escenas 0–5 (noche, vino) |
| `src/scenes/SideB.tsx` | Escenas 6–8 (cambio de lado, buen vivir, cierre) |
| `src/Root.tsx` | Una composición por escena + `Reel40`, `Reel15` y la imagen fija `Portada` |
| `scripts/make_sfx.py` | Golpe de aguja + crujido sintéticos (sin samples, sin música) |
| `scripts/render.sh` | Render → codificación a la especificación del brief + mezcla del audio |

## Línea de tiempo (cuadros a 30 fps)

| # | Escena | 40 s | 15 s |
|---|---|---|---|
| 0 | Intro de marca | 0–36 | 0–36 |
| 1 | Gancho «Esto es *Hi-Fi*.» | 36–120 | 36–111 |
| 2 | Quién es | 120–255 | 111–201 |
| 3 | Manifiesto | 255–450 | — |
| 4 | Lo que hace (A1–A5) | 450–630 | — |
| 5 | Sesiones | 630–780 | — |
| 6 | Cambio de lado | 780–825 | 201–246 |
| 7 | El buen vivir | 825–1050 | 246–345 (solo título y frase) |
| 8 | Cierre | 1050–1200 | 345–450 |

## Cuando llegue el material real

- **Afiches:** copia el archivo en `public/` y pon `poster: staticFile("…")` en `content.ts`.
- **Lugares confirmados:** `venueConfirmed: true` en `content.ts`.
- **Retrato y tomas:** van como `<OffthreadVideo>` / `<Img>` dentro de la escena que corresponda, con degradado vino ≥ 60 % bajo el texto y el retrato en círculo.
- **Música:** agrégala en Instagram o en el editor sobre el stem de efectos (`public/audio/sfx-*.wav`), con la mezcla final a −14 LUFS y picos ≤ −1 dBTP.
