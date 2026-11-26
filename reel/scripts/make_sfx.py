"""Synthesised SFX bed for the reel (no samples, no music).
Needle drop at frame 9 and a low vinyl crackle under everything; the crackle
comes forward only during the flip scene (brief §5). Music is added later
(licensed track) on top of this stem."""
import sys, wave
import numpy as np

SR, FPS = 48000, 30
rng = np.random.default_rng(13)

def onepole_lp(x, fc):
    a = np.exp(-2 * np.pi * fc / SR); y = np.empty_like(x); s = 0.0
    for i, v in enumerate(x):
        s = (1 - a) * v + a * s; y[i] = s
    return y

def crackle(n):
    out = np.zeros(n)
    k = rng.poisson(26 * n / SR)
    pos = rng.integers(0, n - 200, k)
    amp = rng.pareto(3.0, k) * 0.08 * rng.choice([-1, 1], k)
    t = np.arange(120)
    for p, a in zip(pos, amp):
        out[p:p + 120] += a * np.exp(-t / 9.0) * np.cos(t * rng.uniform(0.6, 1.6))
    hiss = onepole_lp(rng.standard_normal(n) * 0.02, 2500)
    return out + hiss

def needle(n_total, at):
    out = np.zeros(n_total); n = int(0.45 * SR); t = np.arange(n) / SR
    thump = np.sin(2 * np.pi * 55 * t) * np.exp(-t / 0.09) * 0.9
    click = rng.standard_normal(n) * np.exp(-t / 0.004) * 0.5
    rumble = onepole_lp(rng.standard_normal(n) * 0.15, 180) * np.exp(-t / 0.2)
    out[at:at + n] = (thump + click + rumble)[: n_total - at]
    return out

def make(frames, flip_range, path):
    n = int(frames / FPS * SR)
    bed = crackle(n)
    gain = np.full(n, 10 ** (-38 / 20))          # bed, meant to sit ~30 dB under the music
    f0, f1 = (int(f / FPS * SR) for f in flip_range)
    ramp = int(0.15 * SR)
    fg = 10 ** (-20 / 20)
    gain[f0:f1] = fg
    gain[f0 - ramp:f0] = np.linspace(gain[0], fg, ramp)
    gain[f1:f1 + ramp] = np.linspace(fg, gain[0], ramp)
    sig = bed * gain + needle(n, int(9 / FPS * SR)) * 10 ** (-4 / 20)
    sig[:int(0.01 * SR)] *= np.linspace(0, 1, int(0.01 * SR))
    sig[-int(0.05 * SR):] *= np.linspace(1, 0, int(0.05 * SR))
    peak = np.max(np.abs(sig))
    if peak > 10 ** (-1.5 / 20):
        sig *= 10 ** (-1.5 / 20) / peak
    st = np.stack([sig, np.roll(sig, 7) * 0.96], 1)
    pcm = (np.clip(st, -1, 1) * 32767).astype("<i2")
    with wave.open(path, "wb") as w:
        w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes(pcm.tobytes())
    print(path, frames / FPS, "s")

out = sys.argv[1]
make(1200, (780, 825), f"{out}/sfx-40s.wav")
make(450, (201, 246), f"{out}/sfx-15s.wav")
