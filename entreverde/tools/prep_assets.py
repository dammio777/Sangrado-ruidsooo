"""Prepara el material de Entreverde para el video (solo fotos en alta resolución).

- Extrae el logo vectorial del PDF de artefinal (sin el fondo) en tres versiones.
- Gradúa las fotos HD (brillo +10 %, saturación +8 %, leve calidez) y las deja
  a la altura de trabajo (2208 px = 1920 x 1,15 para el zoom lento).
- Genera miniaturas 3:4 para la cuadrícula del perfil, recortes para polaroids
  y fondos desenfocados pre-renderizados a baja resolución.
- Mide la paleta sobre los píxeles reales y la guarda en assets/palette_medida.json.

Uso: python3 -I tools/prep_assets.py
"""
import json
import re
import subprocess
from pathlib import Path

import numpy as np
from PIL import Image, ImageEnhance, ImageFilter, ImageOps

ROOT = Path(__file__).resolve().parent.parent
RAW = ROOT / "assets" / "raw"
IMG = ROOT / "assets" / "img"
LOGO = ROOT / "assets" / "logo"
IMG.mkdir(parents=True, exist_ok=True)
LOGO.mkdir(parents=True, exist_ok=True)
PDF = RAW / "logo_artefinal.pdf"


def to_hex(rgb):
    return "#" + "".join(f"{int(round(v)):02X}" for v in rgb)


# ---------------------------------------------------------------- logo vectorial
page_bgs = []
tmp_svg = RAW / "_p.svg"
for page in range(1, 5):
    subprocess.run(["pdftocairo", "-svg", "-f", str(page), "-l", str(page), str(PDF), str(tmp_svg)], check=True)
    s = tmp_svg.read_text()
    rect = re.search(r'<rect[^>]*fill="rgb\(([\d.]+)%, ([\d.]+)%, ([\d.]+)%\)"[^>]*/>', s)
    page_bgs.append(to_hex([float(v) * 2.55 for v in rect.groups()]))
    if page == 1:
        ink = re.search(r'fill="rgb\(([\d.]+)%, ([\d.]+)%, ([\d.]+)%\)" fill-opacity="1" d=', s)
        ink_pct = ink.groups()
        logo_ink = to_hex([float(v) * 2.55 for v in ink_pct])
        body = s.replace(rect.group(0), "")
        body = body.replace("rgb({}%, {}%, {}%)".format(*ink_pct), "currentColor")
        inner = body[body.index(">", body.index("<svg")) + 1: body.rindex("</svg>")]
        variants = {
            "logo_completo": "630 350 660 375",  # marca + nombre + lema
            "logo_nombre": "630 350 660 290",    # marca + nombre
            "logo_marca": "893 356 133 157",     # solo la "è" con hoja y tenedor
        }
        for name, vb in variants.items():
            (LOGO / f"{name}.svg").write_text(
                f'<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" '
                f'viewBox="{vb}" fill="currentColor" color="{logo_ink}">{inner}</svg>'
            )
tmp_svg.unlink()


# ---------------------------------------------------------------- fotos
def grade(pil, bright=1.10, sat=1.08, warm=0.03):
    pil = ImageEnhance.Brightness(pil).enhance(bright)
    pil = ImageEnhance.Color(pil).enhance(sat)
    a = np.asarray(pil).astype(np.float32)
    a[..., 0] *= 1 + warm
    a[..., 2] *= 1 - warm
    return Image.fromarray(np.clip(a, 0, 255).astype(np.uint8))


def load(name):
    return ImageOps.exif_transpose(Image.open(RAW / f"{name}.jpg")).convert("RGB")


def crop_aspect(pil, aspect, fx=0.5, fy=0.5, zoom=1.0):
    """Recorta a la relación ancho/alto `aspect`, centrado en (fx, fy) de 0 a 1."""
    w, h = pil.size
    if w / h > aspect:
        ch, cw = h, h * aspect
    else:
        cw, ch = w, w / aspect
    cw, ch = cw / zoom, ch / zoom
    x = (w - cw) * fx
    y = (h - ch) * fy
    return pil.crop((int(x), int(y), int(x + cw), int(y + ch)))


HD = ["hd_frente", "hd_angulo", "hd_angulo_cielo", "hd_vertical_cielo", "hd_banderas_noche",
      "hd_banderas_dia", "hd_aviso_banderas", "hd_aviso", "hd_terraza"]
graded = {}
for name in HD:
    pil = grade(load(name))
    graded[name] = pil
    w, h = pil.size
    s = 2208 / h
    pil.resize((round(w * s), 2208), Image.LANCZOS).save(IMG / f"{name}.jpg", quality=92)

# miniaturas 3:4 para la cuadrícula del perfil (600 x 800, de sobra para celdas de ~250 px)
grid = {
    "g_aviso": ("hd_aviso", 0.62, 0.40, 1.6),
    "g_terraza": ("hd_terraza", 0.5, 0.55, 1.0),
    "g_noche": ("hd_banderas_noche", 0.18, 0.2, 1.25),
    "g_vertical": ("hd_vertical_cielo", 0.5, 0.65, 1.0),
    "g_frente": ("hd_frente", 0.42, 0.6, 1.0),
    "g_angulo": ("hd_angulo_cielo", 0.45, 0.5, 1.0),
    "g_menu": ("hd_banderas_dia", 0.40, 0.12, 1.45),
    "g_aviso_banderas": ("hd_aviso_banderas", 0.32, 0.45, 1.0),
    "g_angulo2": ("hd_angulo", 0.35, 0.5, 1.0),
}
for out, (src, fx, fy, z) in grid.items():
    crop_aspect(graded[src], 3 / 4, fx, fy, z).resize((600, 800), Image.LANCZOS).save(IMG / f"{out}.jpg", quality=90)

# fotos tipo polaroid (cuadradas)
pol = {
    "pol_barra": ("hd_frente", 0.5, 0.78, 1.7),        # las sillas de la barra, lado a lado
    "pol_noche": ("hd_banderas_noche", 0.25, 0.05, 1.5),  # luces encendidas
}
for out, (src, fx, fy, z) in pol.items():
    crop_aspect(graded[src], 1, fx, fy, z).resize((900, 900), Image.LANCZOS).save(IMG / f"{out}.jpg", quality=90)

# fondos desenfocados pre-renderizados (270 x 480 ≈ 40 px de desenfoque a 1080)
for out, (src, fx) in {
    "bg_vertical_blur": ("hd_vertical_cielo", 0.5),
    "bg_terraza_blur": ("hd_terraza", 0.5),
    "bg_noche_blur": ("hd_banderas_noche", 0.3),
    "bg_aviso_blur": ("hd_aviso", 0.6),
}.items():
    small = crop_aspect(graded[src], 9 / 16, fx).resize((270, 480), Image.LANCZOS)
    small.filter(ImageFilter.GaussianBlur(10)).save(IMG / f"{out}.jpg", quality=90)


# ---------------------------------------------------------------- paleta medida (sobre las fotos sin graduar)
def region(name, box):
    """Píxeles de la caja (x0, y0, x1, y1), en fracciones de la foto original."""
    a = np.asarray(load(name)).astype(int)
    h, w, _ = a.shape
    return a[int(box[1] * h):int(box[3] * h), int(box[0] * w):int(box[2] * w)].reshape(-1, 3)


def med(px, mask=None):
    return to_hex(np.median(px if mask is None else px[mask], axis=0))


ig = np.asarray(Image.open(RAW / "perfil_instagram.jpg").convert("RGB")).astype(int)
madera = region("hd_frente", (0.30, 0.68, 0.70, 0.85))
cont = region("hd_frente", (0.22, 0.52, 0.64, 0.68))
cont_s = cont.sum(1)
band = region("hd_banderas_noche", (0.09, 0.34, 0.77, 0.59))
corten = region("hd_aviso", (0.53, 0.32, 0.66, 0.45))
monst = region("hd_frente", (0.15, 0.72, 0.85, 0.92))
palette = {
    "pdf_fondos_artboards_1_a_4": page_bgs,
    "pdf_tinta_logo": logo_ink,
    "ig_foto_perfil": med(ig[300:340, 90:130].reshape(-1, 3)),
    "madera_sillas": med(madera, (madera[:, 0] > 140) & (madera[:, 0] > madera[:, 1] + 15) & (madera[:, 1] > madera[:, 2] + 15)),
    "contenedor_sombra": med(cont, (cont_s > np.percentile(cont_s, 15)) & (cont_s <= np.percentile(cont_s, 35))),
    "aviso_corten": med(corten, corten[:, 0] > corten[:, 2] + 25),
    "banderas_luz_calida": med(band, band.sum(1) > 480),
    "monstera": med(monst, (monst[:, 1] > monst[:, 0] + 15) & (monst[:, 1] > monst[:, 2] + 15)),
}
(ROOT / "assets" / "palette_medida.json").write_text(json.dumps(palette, indent=2, ensure_ascii=False))
print(json.dumps(palette, indent=2, ensure_ascii=False))
