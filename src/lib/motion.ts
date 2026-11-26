// Tokens de movimiento (DESIGN.md v2 §5, según el brief de revisión)
export const dur = { instant: 0.1, fast: 0.18, base: 0.32, slow: 0.6, reveal: 1.0 } as const;
export const ease = {
  out: [0.16, 1, 0.3, 1],
  outSoft: [0.22, 1, 0.36, 1],
  inOut: [0.65, 0, 0.35, 1],
} as const;
/** Solo estos eases de GSAP. */
export const gsapEase = { out: "expo.out", outSoft: "power3.out", inOut: "power3.inOut" } as const;
export const spring = {
  ui: { type: "spring", stiffness: 260, damping: 28 },
  soft: { type: "spring", stiffness: 140, damping: 22 },
} as const;
/** `record-spin`: 24 s por vuelta, empuje por velocidad de scroll ≤ ×2. */
export const rpm = { secondsPerTurn: 24, maxBoost: 2 } as const;
export const DEG_PER_SEC = 360 / rpm.secondsPerTurn;
/** Desplazamiento máximo de las entradas. */
export const distance = { desktop: 24, mobile: 16 } as const;
export const stagger = 0.06;
/** Intro: tope total. */
export const introMax = 1.2;
