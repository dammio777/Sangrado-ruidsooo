// Tokens de movimiento (DESIGN.md §5.2 / §10)
export const dur = { instant: 0.1, fast: 0.18, base: 0.32, slow: 0.6, reveal: 0.9 } as const;
export const ease = {
  out: [0.16, 1, 0.3, 1],
  outSoft: [0.22, 1, 0.36, 1],
  inOut: [0.65, 0, 0.35, 1],
  in: [0.5, 0, 0.75, 0],
} as const;
export const gsapEase = {
  out: "expo.out",
  outSoft: "power3.out",
  inOut: "power3.inOut",
  in: "power2.in",
  platter: "platter",
  needle: "elastic.out(1, 0.55)",
} as const;
export const spring = {
  snappy: { type: "spring", stiffness: 420, damping: 34 },
  ui: { type: "spring", stiffness: 260, damping: 28 },
  soft: { type: "spring", stiffness: 140, damping: 22 },
} as const;
export const rpm = { base: 33.333, maxBoost: 4 } as const; // record-spin
export const scrambleChars = "░▒▓/\\|—·:." as const; // signal-scramble
/** grados por segundo a 33⅓ RPM (1 vuelta / 1.8 s) */
export const DEG_PER_SEC = 360 / 1.8;
export const distance = { desktop: 28, mobile: 16 } as const;
export const stagger = 0.06;
