#!/usr/bin/env bash
# Codificación final: grano de película, unsharp leve, bt709, audio a −14 LUFS (pico ≤ −1,5 dB).
# Uso: tools/finalize.sh out/master.mkv out/audio.wav out/entreverde_propuesta.mp4
set -euo pipefail
MASTER="$1"; AUDIO="$2"; OUT="$3"
TMP="${OUT%.mp4}.partial.mp4"

# ganancia para llegar a −14 LUFS integrados; el limitador cuida el pico
I=$(ffmpeg -hide_banner -i "$AUDIO" -af ebur128 -f null - 2>&1 | awk '/Integrated loudness/{f=1} f&&/I:/{print $2; exit}')
GAIN=$(python3 -c "print(round(-14 - float('$I'), 2))")
echo "audio: ${I} LUFS → ganancia ${GAIN} dB"

ffmpeg -hide_banner -loglevel error -stats -y -i "$MASTER" -i "$AUDIO" \
  -filter_complex "[0:v]scale=in_range=pc:out_range=tv:in_color_matrix=bt601:out_color_matrix=bt709,noise=c0s=7:c0f=t+u,unsharp=5:5:0.35:5:5:0,format=yuv420p[v];[1:a]volume=${GAIN}dB,alimiter=limit=0.80:attack=2:release=60:level=false,aresample=48000[a]" \
  -map "[v]" -map "[a]" -r 60 \
  -c:v libx264 -preset medium -crf 18 -profile:v high -pix_fmt yuv420p \
  -colorspace bt709 -color_primaries bt709 -color_trc bt709 -color_range tv \
  -c:a aac -b:a 320k -movflags +faststart -shortest "$TMP"
mv "$TMP" "$OUT"   # nunca se entrega un archivo a medio escribir
