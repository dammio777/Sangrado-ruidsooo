# Revisión antes de entregar — «Esto es Hi-Fi» v1

Medido sobre los archivos exportados (ffprobe, EBU R128, conteo de píxeles por color a 3 cuadros por segundo).

| # | Punto | Resultado |
|---|---|---|
| 1 | Duración | **Cumple.** 40,000 s (1200 c) y 15,000 s (450 c). Intro 36 c = 1,2 s. Gancho: «Esto es *Hi-Fi*.» queda quieto hacia el c 58 (1,93 s). |
| 2 | Zonas seguras | **Cumple.** Todo el texto en reposo cae dentro de x 72–940 · y 220–1500. El texto que llega más a la derecha es «Sígueme para escuchar los dos lados.» (x ≈ 727). El más bajo es el pilar «Buen vivir» (y ≈ 1405). El texto más pequeño mide 28 px (franja mono de las tarjetas). Solo las tarjetas de sesiones cruzan el borde, y únicamente mientras se deslizan. |
| 3 | Tipografía | **No cumple, a propósito.** El brief pide Inter Tight / Inter / Instrument Serif, pero el `DESIGN.md` adjunto define **Fraunces** (display; nombre en 300, nunca negrita), **IBM Plex Mono** (etiquetas) y **DM Sans** (texto). Como el brief dice «si algo choca, gana DESIGN.md», usé esas. La serif cursiva aparece solo en «*Hi-Fi*» y «*buen vivir*». Las fuentes están en `reel/src/tokens.json` y `reel/src/lib/fonts.ts`, así que cambiarlas es un ajuste de dos archivos. |
| 4 | Color | **Cumple.** El Lado A se lee vino y casi negro; el Lado B, crema con letras vino. El latón llega como máximo al 0,73 % de un cuadro (límite 5 %). El ámbar está en 0 %. |
| 5 | Movimiento | **Cumple.** Solo se usan efectos del catálogo: `mask-lines`, `reveal-up`, `highlight-words`, ruido → señal, `draw-line`, el riel, el brazo con amortiguación y `fade-through`. Hay como máximo 2 momentos por pantalla. Las curvas son `out`, `out suave` e `in-out`. No hay rebotes, glitch, ecualizadores, partículas ni grano. El disco gira a 0,5° por cuadro. |
| 6 | Cambio de lado | **Cumple.** Dos capas, vino y crema, cruzan por opacidad, sin barrido. Primero el disco se desvanece sobre el vino; luego el sol crece con la luz y la onda se vuelve montaña. |
| 7 | Audio | **No cumple todavía.** Falta la música con licencia, que yo no puedo elegir ni licenciar. El MP4 trae solo un stem sintético: golpe de aguja en el c 9 y crujido de fondo, que sube en la escena 6. El stem mide −19 a −20 LUFS integrado (lo empujan la aguja y la escena 6; el fondo está en −38 dBFS para quedar unos 30 dB bajo la música) y picos de −1,0 a −1,5 dBFS. Al agregar la música, normalizar la mezcla a ≈ −14 LUFS con picos ≤ −1 dBTP. No hay voz. |
| 8 | Texto | **Cumple.** Ortografía de Colombia y tildes revisadas. «Monte Hi-Fi» no aparece en ningún texto, subtítulo, archivo, código ni descripción (verificado con grep). |
| 9 | Datos | **Cumple.** Las fechas van sin año («Sonó el 10 de julio», etc.). Los lugares (Árboro × Gaia, Jaguarundí, El Maizal) **no aparecen** porque el permiso sigue `[CONFIRMAR]`; se activan con `venueConfirmed: true`. No hay contador, cifras, clientes ni testimonios. No hay material generado ni de stock. |
| 10 | Pendientes | Ver abajo. |

## Escenas que quedaron solo con gráfica

| Escena | Qué se usó en vez del material real |
|---|---|
| 1 · Gancho | Disco grande sangrando a la derecha y brazo de latón que baja a la aguja |
| 2 · Quién es | Nombre y créditos sobre el disco que gira (sin «Foto próximamente») |
| 3 · Manifiesto | Solo texto, con la 2.ª línea de la versión sin voz |
| 4 · Lo que hace | Tracklist A1–A5 y disco con el número activo; sin cortes a tomas de eventos |
| 5 · Sesiones | Tarjetas tipográficas «Afiche próximamente», sin lugares |
| 7 · Buen vivir | Sol, montaña e íconos dibujados; sin cortes a tomas de sus reels |

## Lo que falta que entregue Cristian

1. **Retrato o plano medio (gafas, bigote).** Es imprescindible para la versión final de la escena 2.
2. Los 3 afiches: The B Side, Música en la sala y Selektor.
3. Confirmación del permiso para nombrar los lugares.
4. Confirmación de los servicios A1–A5 (hoy son un borrador, usado tal cual).
5. Tomas reales: aguja o manos con el vinilo (3–4 s), cabina y sesiones con gente (3–5 planos), y buen vivir (café, bici, monte, luz de mañana; 3–5 planos).
6. La música con licencia (soul, funk o salsa clásica, 95–110 BPM).
7. Opcional: la voz en off. Ya hay un borrador de subtítulos con tiempos en `borradores/cc-presentacion-hifi.srt`. No subtitula lo que ya está completo en pantalla.

## Notas técnicas

- Video: H.264 High, 1080 × 1920, 30 fps, 14 Mbps CBR.
- Audio: AAC LC 48 kHz pedido a 320 kbps; el codificador entrega ≈ 270–277 kbps porque el stem es casi silencio. Con la música subirá.
- `borradores/` contiene el `.srt`. Se usa solo si se graba la voz.
