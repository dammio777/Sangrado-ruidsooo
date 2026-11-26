export const MQ = {
  isDesktop: "(min-width: 1024px) and (pointer: fine)",
  isMobile: "(max-width: 1023px)",
  reduceMotion: "(prefers-reduced-motion: reduce)",
} as const;

export const isBrowser = typeof window !== "undefined";

export function matches(q: string): boolean {
  return isBrowser && window.matchMedia(q).matches;
}

/** El script inline del <head> pone `js-motion` solo si hay JS y no hay reduced motion. */
export function motionOK(): boolean {
  return isBrowser && document.documentElement.classList.contains("js-motion");
}

export function lowPower(): boolean {
  if (!isBrowser) return false;
  const n = navigator as Navigator & { connection?: { saveData?: boolean }; deviceMemory?: number };
  return (n.hardwareConcurrency !== undefined && n.hardwareConcurrency <= 4) || !!n.connection?.saveData;
}

export const NAV_OFFSET = 64;
