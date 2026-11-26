# Cristian Calle · Hi-Fi

Sitio personal de Cristian Calle (eventos, selector en vinilo y buen vivir). Concepto «Lado A / Lado B»: un disco que se escucha de la noche (vino) a la mañana (crema).

## Comandos

```bash
npm install
npm run dev          # desarrollo
npm run build        # typecheck + build cliente + SSR + prerender → dist/
node scripts/serve.mjs   # sirve dist/ con gzip en :4174 (como producción)
```

Variables de build: `SITE_URL=https://dominio npm run build` agrega canonical, `og:url`, sitemap y robots con el dominio real.

## Dónde se edita

- **Todo el contenido**: `src/config/site.ts` (contacto, servicios, sesiones, pilares, reels, imágenes y textos).
  - `person.whatsapp` (formato `57XXXXXXXXXX`) y `person.email` están en `null` → se muestran como «Muy pronto».
  - Imágenes: cada entrada tiene `src: null` y el nombre de archivo esperado (`wanted`). Al poner el archivo en `public/img/` y su ruta en `src`, reemplaza el placeholder. **No se usa ninguna foto que no haya sido entregada.**
- Tokens de diseño: `src/styles/tokens.css` (DESIGN.md). Movimiento: `src/lib/motion.ts`.
- `?pending` en la URL lista todo el material faltante y marca en la página los textos por ajustar. `?demo` muestra las 3 paletas.

## Verificación

```bash
node scripts/serve.mjs &
node scripts/shots.mjs      # capturas 375/768/1440, overflow a 320, errores de consola
node scripts/verify.mjs     # teclado, sonido, scroll, reduced motion, sin JS
node scripts/lh.mjs         # Lighthouse móvil
node scripts/brand-assets.mjs  # regenera og.png e íconos
```
