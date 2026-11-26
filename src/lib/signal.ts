/** Señal procedimental compartida: suma de 3 senos + ruido suavizado. */

function hash(n: number) {
  const s = Math.sin(n * 127.1) * 43758.5453123;
  return s - Math.floor(s);
}
/** ruido de valor 1D suavizado, salida -1..1 */
export function noise1(x: number) {
  const i = Math.floor(x);
  const f = x - i;
  const u = f * f * (3 - 2 * f);
  return (hash(i) * (1 - u) + hash(i + 1) * u) * 2 - 1;
}

/** valor de la señal en x (0..1 a lo ancho) y tiempo t (s), salida aprox -1..1 */
export function signalAt(x: number, t: number, noiseAmt = 0.35) {
  const a = Math.sin(x * Math.PI * 2 * 2.0 + t * 1.6) * 0.55;
  const b = Math.sin(x * Math.PI * 2 * 5.3 - t * 2.3) * 0.22;
  const c = Math.sin(x * Math.PI * 2 * 11.7 + t * 3.7) * 0.1;
  const n = noise1(x * 24 + t * 2.2) * noiseAmt;
  return a + b + c + n;
}

/** nivel procedimental 0..1 (VU / eq-bars cuando el sonido está OFF) */
export function levelAt(t: number, seed = 0) {
  return 0.5 + 0.5 * noise1(t * 1.7 + seed * 13.37) * 0.8 + 0.1 * Math.sin(t * 5 + seed);
}

const f = (n: number) => Math.round(n * 100) / 100;

/** Path de onda limpia (seno) para MorphSVG. */
export function sinePath(w: number, h: number, cycles: number, amp: number, points = 96, phase = 0) {
  let d = "";
  for (let i = 0; i <= points; i++) {
    const x = (i / points) * w;
    const y = h / 2 + Math.sin((i / points) * Math.PI * 2 * cycles + phase) * amp;
    d += `${i === 0 ? "M" : "L"}${f(x)},${f(y)}`;
  }
  return d;
}

/** Path ruidoso (estática) con el mismo número de puntos. */
export function noisyPath(w: number, h: number, amp: number, points = 96, seed = 1) {
  let d = "";
  for (let i = 0; i <= points; i++) {
    const x = (i / points) * w;
    const r = (hash(i * 7.13 + seed) * 2 - 1) * (0.55 + 0.45 * hash(i * 3.1 + seed * 2));
    const y = h / 2 + r * amp;
    d += `${i === 0 ? "M" : "L"}${f(x)},${f(y)}`;
  }
  return d;
}

export function flatPath(w: number, h: number, points = 96) {
  let d = "";
  for (let i = 0; i <= points; i++) d += `${i === 0 ? "M" : "L"}${f((i / points) * w)},${f(h / 2)}`;
  return d;
}

/** Línea de cresta de montaña (Lado B) con el mismo número de puntos. */
export function ridgePath(w: number, h: number, points = 96) {
  const peaks = [
    { x: 0.18, y: 0.38, s: 0.13 },
    { x: 0.42, y: 0.16, s: 0.16 },
    { x: 0.63, y: 0.34, s: 0.1 },
    { x: 0.83, y: 0.22, s: 0.14 },
  ];
  let d = "";
  for (let i = 0; i <= points; i++) {
    const t = i / points;
    let y = 0.82;
    for (const p of peaks) {
      const k = Math.max(0, 1 - Math.abs(t - p.x) / p.s);
      y = Math.min(y, 0.82 - (0.82 - p.y) * (k * k * (3 - 2 * k)));
    }
    y += noise1(t * 40) * 0.012;
    d += `${i === 0 ? "M" : "L"}${f(t * w)},${f(y * h)}`;
  }
  return d;
}

/** Forma de onda de barras (mini waveform de un tema), determinista por semilla. */
export function waveformBars(seed: number, count = 40) {
  return Array.from({ length: count }, (_, i) => {
    const env = Math.sin((i / (count - 1)) * Math.PI) * 0.5 + 0.5;
    const v = 0.25 + 0.75 * Math.abs(noise1(i * 0.9 + seed * 17.3)) * env + 0.15 * hash(i + seed);
    return Math.min(1, v);
  });
}
