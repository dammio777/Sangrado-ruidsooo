"""Pista original (sin derechos de autor) para el video de Entreverde.

Jazz cozy en Fa mayor a ~80 BPM: piano eléctrico (FM), contrabajo, guitarra de
nylon, escobillas muy al fondo y una melodía que manda. Efectos sincronizados con
la animación (whoosh, campanitas, pop) y acorde final sostenido en "¿Te animas?".

Uso: python3 -I tools/music.py out/audio.wav
"""
import sys
import wave

import numpy as np
from scipy.signal import butter, sosfilt, fftconvolve

SR = 48000
DUR = 33.5
N = int(SR * DUR)
rng = np.random.default_rng(7)
BAR = 29.85 / 10           # 10 compases hasta "¿Te animas?" → 80,4 BPM
BEAT = BAR / 4

L = np.zeros(N)
R = np.zeros(N)
REV = np.zeros(N)           # envío a reverb (mono)


def mtof(m):
    return 440.0 * 2 ** ((m - 69) / 12)


def add(sig, t0, gain=1.0, pan=0.0, rev=0.25):
    i = int(t0 * SR)
    if i >= N:
        return
    sig = sig[: N - i]
    gl, gr = np.cos((pan + 1) * np.pi / 4), np.sin((pan + 1) * np.pi / 4)
    L[i:i + len(sig)] += sig * gain * gl
    R[i:i + len(sig)] += sig * gain * gr
    REV[i:i + len(sig)] += sig * gain * rev


def env(n, att=0.005, rel=0.08, dur=None):
    t = np.arange(n) / SR
    e = np.minimum(1, t / att)
    if dur is not None:
        e *= np.clip(1 - (t - dur) / rel, 0, 1)
    return e


# ---------------------------------------------------------------- instrumentos
def epiano(m, dur, vel=1.0, bright=1.0):
    f = mtof(m)
    n = int((dur + 1.2) * SR)
    t = np.arange(n) / SR
    I = (1.1 * bright) * np.exp(-t / 0.4) + 0.12
    body = np.sin(2 * np.pi * f * t + I * np.sin(2 * np.pi * f * t))
    tine = 0.12 * bright * np.sin(2 * np.pi * f * 7.02 * t) * np.exp(-t / 0.04)
    decay = np.exp(-t / (2.2 - 0.012 * (m - 48)))
    trem = 1 + 0.06 * np.sin(2 * np.pi * 4.6 * t)
    return (body + tine) * decay * trem * env(n, 0.004, 0.35, dur) * vel


def bass(m, dur, vel=1.0):
    f = mtof(m)
    n = int((dur + 0.3) * SR)
    t = np.arange(n) / SR
    s = np.sin(2 * np.pi * f * t) + 0.35 * np.sin(4 * np.pi * f * t) * np.exp(-t / 0.25) + 0.12 * np.sin(6 * np.pi * f * t) * np.exp(-t / 0.1)
    thump = 0.25 * np.sin(2 * np.pi * f * 0.5 * t) * np.exp(-t / 0.03)
    return (s + thump) * np.exp(-t / 1.1) * env(n, 0.006, 0.12, dur) * vel


def nylon(m, dur, vel=1.0):
    f = mtof(m)
    n = int((dur + 0.6) * SR)
    t = np.arange(n) / SR
    s = np.zeros(n)
    for k in range(1, 9):
        if f * k > 9000:
            break
        s += (0.9 ** k) / k * np.sin(2 * np.pi * f * k * t + k) * np.exp(-t * (1.6 + 1.3 * k))
    pick = rng.standard_normal(n) * np.exp(-t / 0.004) * 0.08
    return (s + pick) * env(n, 0.002, 0.2, dur) * vel


def bell(f, vel=1.0, length=1.6):
    n = int(length * SR)
    t = np.arange(n) / SR
    s = (np.sin(2 * np.pi * f * t) * np.exp(-t / 0.55)
         + 0.45 * np.sin(2 * np.pi * f * 2.76 * t) * np.exp(-t / 0.25)
         + 0.2 * np.sin(2 * np.pi * f * 5.4 * t) * np.exp(-t / 0.1))
    return s * env(n, 0.002) * vel


def pop(vel=1.0):
    n = int(0.12 * SR)
    t = np.arange(n) / SR
    f = 260 + 640 * np.exp(-t / 0.018)
    ph = 2 * np.pi * np.cumsum(f) / SR
    return np.sin(ph) * np.exp(-t / 0.03) * env(n, 0.001) * vel


SOS_WH = butter(2, [350, 5000], btype="band", fs=SR, output="sos")


def whoosh(length=0.7, vel=1.0):
    n = int(length * SR)
    t = np.arange(n) / SR
    x = sosfilt(SOS_WH, rng.standard_normal(n))
    peak = length * 0.45
    e = np.where(t < peak, (t / peak) ** 2, np.exp(-(t - peak) / (length * 0.18)))
    return x * e * vel


SOS_BR = butter(2, [2500, 9000], btype="band", fs=SR, output="sos")


def brush(length=0.35, vel=1.0):
    n = int(length * SR)
    t = np.arange(n) / SR
    x = sosfilt(SOS_BR, rng.standard_normal(n))
    return x * np.minimum(1, t / 0.03) * np.exp(-t / 0.12) * vel


# ---------------------------------------------------------------- armonía (Fa mayor)
CH = {
    "Fmaj9": (41, [57, 60, 64, 67]),
    "Dm9": (38, [53, 57, 60, 64]),
    "Gm9": (43, [57, 58, 62, 65]),
    "C13": (36, [52, 58, 62, 69]),
    "C13sus": (36, [58, 62, 65, 69]),
    "A7b13": (45, [55, 61, 65, 67]),
    "Bbmaj9": (46, [57, 60, 62, 65]),
    "F69": (41, [57, 62, 67, 72]),
}
# (compás, [(acorde, inicio en tiempos, duración en tiempos)])
PROG = [
    [("Fmaj9", 0, 4)], [("Dm9", 0, 4)], [("Gm9", 0, 4)], [("C13", 0, 4)],
    [("Fmaj9", 0, 4)], [("Dm9", 0, 3), ("A7b13", 3, 1)], [("Bbmaj9", 0, 4)], [("C13sus", 0, 2), ("C13", 2, 2)],
    [("Fmaj9", 0, 2), ("Dm9", 2, 2)], [("Gm9", 0, 2), ("C13", 2, 2)],
]
MEL = [
    [],
    [(0, 69, 1.5), (1.5, 72, .5), (2, 74, 1), (3, 72, 1)],
    [(0, 70, 1.5), (1.5, 69, .5), (2, 67, 2)],
    [(0, 64, 1), (1, 67, 1), (2, 69, 1.5), (3.5, 67, .5)],
    [(0, 69, 3), (3, 72, 1)],
    [(0, 74, 1.5), (1.5, 72, .5), (2, 69, 1), (3, 73, 1)],
    [(0, 74, 2), (2, 72, 1), (3, 70, 1)],
    [(0, 69, 1.5), (1.5, 67, .5), (2, 65, 1), (3, 64, 1)],
    [(0, 65, 1), (1, 69, 1), (2, 72, 1), (3, 76, 1)],
    [(0, 74, 2), (2, 72, 1), (3, 70, .5), (3.5, 67, .5)],
]

for b, chords in enumerate(PROG):
    t_bar = b * BAR
    for name, st, du in chords:
        root, voic = CH[name]
        t0 = t_bar + st * BEAT
        # piano eléctrico: acorde al tiempo y un toque suave a contratiempo
        for j, m in enumerate(voic):
            add(epiano(m, du * BEAT * 0.95, 0.20), t0 + j * 0.008, 1.0, -0.25 + j * 0.12, 0.35)
        if du >= 2:
            for m in voic[1:]:
                add(epiano(m, BEAT * 0.6, 0.08, 0.7), t0 + 1.5 * BEAT, 1.0, 0.2, 0.35)
        # contrabajo: fundamental, quinta y nota de aproximación
        add(bass(root, BEAT * min(du, 2) * 0.95, 0.42), t0, 1.0, 0.0, 0.08)
        if du >= 4:
            add(bass(root + 7, BEAT * 1.4, 0.34), t0 + 2 * BEAT, 1.0, 0.0, 0.08)
        elif du >= 2:
            add(bass(root + 7, BEAT * .9, 0.3), t0 + BEAT, 1.0, 0.0, 0.08)
        # guitara de nylon: arpegio a contratiempo (bossa suave)
        if b >= 1:
            for k in range(int(du)):
                m = voic[(k + b) % 4] + 12
                add(nylon(m, BEAT * 0.9, 0.11), t0 + (k + 0.5) * BEAT, 1.0, 0.45, 0.3)
    # escobillas: 2 y 4, muy al fondo
    if b >= 1:
        for k in (1, 3):
            add(brush(0.35, 0.035), t_bar + k * BEAT, 1.0, -0.4, 0.15)
        for k in range(8):
            add(brush(0.18, 0.012), t_bar + k * BEAT / 2 + 0.03, 1.0, 0.4, 0.1)
    # melodía (manda)
    for st, m, du in MEL[b]:
        add(epiano(m, du * BEAT * 0.9, 0.40, 1.25), t_bar + st * BEAT, 1.0, 0.05, 0.4)

# acorde final sostenido en "¿Te animas?"
TF = 10 * BAR
root, voic = CH["F69"]
for j, m in enumerate(voic):
    add(epiano(m, 3.2, 0.22), TF + j * 0.035, 1.0, -0.3 + j * 0.2, 0.5)
add(epiano(69, 3.2, 0.36, 1.2), TF + 0.2, 1.0, 0.1, 0.5)
add(bass(root, 3.0, 0.42), TF, 1.0, 0.0, 0.1)
add(bass(29, 3.0, 0.25), TF, 1.0, 0.0, 0.1)
add(nylon(65, 2.5, 0.1), TF + 0.12, 1.0, 0.4, 0.3)
add(nylon(69, 2.5, 0.1), TF + 0.18, 1.0, 0.45, 0.3)
add(nylon(72, 2.5, 0.1), TF + 0.24, 1.0, 0.5, 0.3)

# ---------------------------------------------------------------- efectos sincronizados
for tt, v in [(3.95, .10), (4.35, .07), (14.75, .11), (17.45, .05), (19.6, .05), (21.75, .05), (23.75, .05), (25.35, .08), (29.3, .09)]:
    add(whoosh(0.75, v), tt - 0.2, 1.0, 0.0, 0.2)
add(pop(0.10), 0.38, 1.0, 0.0, 0.1)                       # logo con rebote
for i in range(6):
    add(pop(0.035), 1.0 + i * .13, 1.0, -0.5 + i * .2, 0.1)  # paleta
for i in range(9):
    add(pop(0.025), 5.4 + i * .12, 1.0, -0.4 + (i % 3) * .4, 0.1)  # publicaciones
add(bell(1568, 0.06), 9.6, 1.0, 0.2, 0.3)                 # corazón grande
add(bell(2093, 0.035), 9.75, 1.0, 0.3, 0.3)
for i in range(3):
    add(pop(0.05), 10.25 + i * .3, 1.0, -0.2, 0.15)       # comentarios
add(pop(0.11), 11.6, 1.0, 0.2, 0.1)                       # enviar
add(bell(1760, 0.045), 11.9, 1.0, 0.0, 0.3)               # "Enviado a 3 amigos"
for tt in (12.6, 13.3):                                   # notificaciones
    add(bell(1318.5, 0.06), tt, 1.0, 0.0, 0.3)
    add(bell(1975.5, 0.045), tt + 0.09, 1.0, 0.0, 0.3)
add(pop(0.06), 25.6, 1.0, -0.3, 0.15)                     # polaroids
add(pop(0.06), 25.7, 1.0, 0.3, 0.15)
add(bell(2349, 0.03), 31.95, 1.0, 0.0, 0.4)               # último corazón

# ---------------------------------------------------------------- reverb, fundidos y salida
n_ir = int(1.8 * SR)
t_ir = np.arange(n_ir) / SR
ir = rng.standard_normal((2, n_ir)) * np.exp(-t_ir / 0.45)
ir = sosfilt(butter(1, 5000, fs=SR, output="sos"), ir, axis=1)
ir /= np.abs(ir).sum(axis=1, keepdims=True) ** 0.5 * 9
wetL = fftconvolve(REV, ir[0])[:N]
wetR = fftconvolve(REV, ir[1])[:N]
mix = np.stack([L + wetL, R + wetR], axis=1)
# brillo suave y limpieza de graves
mix = sosfilt(butter(2, 35, btype="high", fs=SR, output="sos"), mix, axis=0)
mix = mix + 1.0 * sosfilt(butter(2, 1200, btype="high", fs=SR, output="sos"), mix, axis=0)  # presencia +6 dB
t = np.arange(N) / SR
fade = np.minimum(1, t / 1.5) * np.clip((DUR - t) / 3.0, 0, 1)
mix *= fade[:, None]
mix /= np.abs(mix).max() / 0.8
pcm = (mix * 32767).astype(np.int16)
with wave.open(sys.argv[1], "wb") as w:
    w.setnchannels(2)
    w.setsampwidth(2)
    w.setframerate(SR)
    w.writeframes(pcm.tobytes())
print("audio listo:", sys.argv[1])
