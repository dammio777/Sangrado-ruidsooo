"""Favicon «CC» con contornos reales de Inter Tight 650 (sin depender de fuentes del sistema).
Uso: python3 scripts/favicon.py   (requiere fonttools + brotli)"""
from fontTools.ttLib import TTFont
from fontTools.varLib import instancer
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.transformPen import TransformPen
from pathlib import Path

root = Path(__file__).resolve().parent.parent
f = TTFont(root / "public/fonts/inter-tight-latin-wght.woff2")
f = instancer.instantiateVariableFont(f, {"wght": 650})
gs = f.getGlyphSet()
g = f.getBestCmap()[ord("C")]
upm = f["head"].unitsPerEm
adv = f["hmtx"][g][0]
size = 22.0
s = size / upm
kern = -0.6
total = adv * 2 * s + kern
pen = SVGPathPen(gs)
x0 = 32 - total / 2
base = 32 + size * 0.36
for i in range(2):
    gs[g].draw(TransformPen(pen, (s, 0, 0, -s, x0 + i * (adv * s + kern), base)))
d = pen.getCommands()


def fav(bg, groove, label, cc):
    return (
        f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">'
        f'<circle cx="32" cy="32" r="31.5" fill="{bg}"/>'
        f'<circle cx="32" cy="32" r="27" fill="none" stroke="{groove}" stroke-width="1"/>'
        f'<circle cx="32" cy="32" r="24" fill="none" stroke="{groove}" stroke-width=".8"/>'
        f'<circle cx="32" cy="32" r="21" fill="{label}"/>'
        f'<path fill="{cc}" d="{d}"/></svg>'
    )


(root / "public/favicon.svg").write_text(fav("#1C0A0D", "#3D0F17", "#5C1A24", "#F2E6D0"))
(root / "public/favicon-light.svg").write_text(fav("#5C1A24", "#3D0F17", "#F2E6D0", "#5C1A24"))
print("favicon ok")
