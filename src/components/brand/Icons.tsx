import type { SVGProps } from "react";

type P = SVGProps<SVGSVGElement> & { size?: number };
const base = (size: number, p: P) => ({
  width: size,
  height: size,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.5,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
  focusable: false,
  ...p,
});

export const IconWhatsApp = ({ size = 20, ...p }: P) => (
  <svg {...base(size, p)}>
    <path d="M4.3 19.7l1.1-3.9A8.2 8.2 0 1 1 8.6 19l-4.3.7z" />
    <path d="M9.2 8.4c.2-.5.5-.5.8-.5h.5c.2 0 .4.1.5.4l.7 1.6c.1.2 0 .5-.1.6l-.6.7c.6 1.2 1.6 2.2 2.8 2.8l.7-.6c.2-.1.4-.2.6-.1l1.6.7c.3.1.4.3.4.5v.5c0 .3 0 .6-.5.8-.6.3-1.5.5-2.6 0a9 9 0 0 1-4.6-4.6c-.5-1.1-.3-2 .1-2.6z" />
  </svg>
);
export const IconInstagram = ({ size = 20, ...p }: P) => (
  <svg {...base(size, p)}>
    <rect x="3.5" y="3.5" width="17" height="17" rx="5" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="17.3" cy="6.7" r=".6" fill="currentColor" />
  </svg>
);
export const IconMail = ({ size = 20, ...p }: P) => (
  <svg {...base(size, p)}>
    <rect x="3" y="5.5" width="18" height="13" rx="1.5" />
    <path d="M3.5 6.5l8.5 6.5 8.5-6.5" />
  </svg>
);
export const IconArrowUp = ({ size = 18, ...p }: P) => (
  <svg {...base(size, p)}>
    <path d="M12 19V5M6 11l6-6 6 6" />
  </svg>
);
export const IconArrowRight = ({ size = 18, ...p }: P) => (
  <svg {...base(size, p)}>
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
);
export const IconArrowUpRight = ({ size = 18, ...p }: P) => (
  <svg {...base(size, p)}>
    <path d="M7 17L17 7M8 7h9v9" />
  </svg>
);
export const IconCaret = ({ size = 18, dir = "down", ...p }: P & { dir?: "up" | "down" }) => (
  <svg {...base(size, p)}>
    <path d={dir === "down" ? "M6 9l6 6 6-6" : "M6 15l6-6 6 6"} />
  </svg>
);
export const IconX = ({ size = 20, ...p }: P) => (
  <svg {...base(size, p)}>
    <path d="M6 6l12 12M18 6L6 18" />
  </svg>
);
export const IconPlay = ({ size = 20, ...p }: P) => (
  <svg {...base(size, p)}>
    <path d="M8 5.5v13l10.5-6.5z" />
  </svg>
);
export const IconShare = ({ size = 18, ...p }: P) => (
  <svg {...base(size, p)}>
    <path d="M12 15V3.5M7.5 8L12 3.5 16.5 8" />
    <path d="M5 11.5v8h14v-8" />
  </svg>
);
export const IconCopy = ({ size = 18, ...p }: P) => (
  <svg {...base(size, p)}>
    <rect x="8" y="8" width="12" height="12" rx="1.5" />
    <path d="M16 8V5.5A1.5 1.5 0 0 0 14.5 4h-9A1.5 1.5 0 0 0 4 5.5v9A1.5 1.5 0 0 0 5.5 16H8" />
  </svg>
);
export const IconCheck = ({ size = 18, ...p }: P) => (
  <svg {...base(size, p)}>
    <path d="M5 12.5l4.5 4.5L19 7.5" />
  </svg>
);
export const IconSpark = ({ size = 14, ...p }: P) => (
  <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" focusable="false" {...p}>
    <path d="M12 1.5c.6 5.6 4.9 9.9 10.5 10.5-5.6.6-9.9 4.9-10.5 10.5C11.4 16.9 7.1 12.6 1.5 12 7.1 11.4 11.4 7.1 12 1.5z" fill="currentColor" />
  </svg>
);

/* Íconos de línea del Lado B (se dibujan con waveform-draw) */
export const PillarIcon = ({ name, size = 56 }: { name: "mountain" | "bicycle" | "sun" | "coffee"; size?: number }) => {
  const common = { className: "pillar-icon__stroke" };
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" aria-hidden="true" className="pillar-icon">
      {name === "mountain" && (
        <>
          <path {...common} d="M4 52 L22 24 L31 36 L40 20 L60 52 Z" />
          <path {...common} d="M17 32 L22 24 L27 31" />
          <path {...common} d="M36 26 L40 20 L45 28" />
          <circle {...common} cx="50" cy="12" r="4" />
        </>
      )}
      {name === "bicycle" && (
        <>
          <circle {...common} cx="15" cy="42" r="10" />
          <circle {...common} cx="49" cy="42" r="10" />
          <path {...common} d="M15 42 L25 24 L42 24 L49 42 M25 24 L32 42 L42 24 M32 42 L15 42" />
          <path {...common} d="M22 18 L29 18 M42 24 L40 16 L46 16" />
        </>
      )}
      {name === "sun" && (
        <>
          <circle {...common} cx="32" cy="34" r="12" />
          <path {...common} d="M32 10 V16 M32 52 V58 M8 34 H14 M50 34 H56 M15 17 L19.5 21.5 M44.5 46.5 L49 51 M49 17 L44.5 21.5 M19.5 46.5 L15 51" />
        </>
      )}
      {name === "coffee" && (
        <>
          <path {...common} d="M12 26 H46 V40 A14 14 0 0 1 32 54 H26 A14 14 0 0 1 12 40 Z" />
          <path {...common} d="M46 30 H50 A6 6 0 0 1 50 42 H45" />
          <path {...common} d="M22 8 C 18 13, 26 15, 22 20 M32 8 C 28 13, 36 15, 32 20" />
        </>
      )}
    </svg>
  );
};
