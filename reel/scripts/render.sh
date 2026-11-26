#!/usr/bin/env bash
# Renders every deliverable into ../entregables.
# 1) Remotion → near-lossless intermediate (silent)
# 2) ffmpeg → delivery spec: H.264 High, 1080×1920, 30 fps, 14 Mbps CBR, AAC 320 kbps 48 kHz
set -euo pipefail
cd "$(dirname "$0")/.."
OUT=../entregables
mkdir -p out/raw "$OUT"
python3 -I scripts/make_sfx.py public/audio

for cut in 40 15; do
  npx remotion render "Reel$cut" "out/raw/r$cut.mp4" --codec=h264 --crf=10 --muted
  ffmpeg -hide_banner -loglevel error -y -i "out/raw/r$cut.mp4" -i "public/audio/sfx-${cut}s.wav" \
    -map 0:v -map 1:a -c:v libx264 -profile:v high -preset slow -pix_fmt yuv420p -r 30 \
    -b:v 14M -minrate 14M -maxrate 14M -bufsize 14M -x264-params nal-hrd=cbr -c:a aac -b:a 320k -ar 48000 -shortest -movflags +faststart \
    "$OUT/cc-presentacion-hifi-${cut}s-v1.mp4"
done

npx remotion still Portada out/raw/portada.png
ffmpeg -hide_banner -loglevel error -y -i out/raw/portada.png -q:v 2 "$OUT/cc-presentacion-hifi-portada.jpg"
