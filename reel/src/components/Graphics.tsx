import React from "react";
import { AbsoluteFill } from "remotion";
import { rand, T } from "../lib/anim";

const C = T.color;

/* ------------------------------------------------------------------ */
/* Mood layers — DESIGN.md §1.7: stacked full-frame layers that cross-  */
/* fade with opacity only. Never a wipe, never animated bg-color.      */
/* ------------------------------------------------------------------ */
export const Layers: React.FC<{ layers: { color: string; opacity: number }[] }> = ({ layers }) => (
  <>
    {layers.map((l, i) => (
      <AbsoluteFill key={i} style={{ backgroundColor: l.color, opacity: l.opacity }} />
    ))}
  </>
);

/* ------------------------------------------------------------------ */
/* Record — DESIGN.md §4: near-black disc, concentric grooves, wine     */
/* label with CC monogram; sheen layer does NOT rotate with the disc.  */
/* ------------------------------------------------------------------ */
export const Record: React.FC<{
  cx: number;
  cy: number;
  r: number;
  rotation: number;
  opacity?: number;
  scale?: number;
  labelText?: React.ReactNode;
  rotateLabelText?: boolean;
}> = ({ cx, cy, r, rotation, opacity = 1, scale = 1, labelText = "CC", rotateLabelText = false }) => {
  const rings = 38;
  const labelR = r * 0.33;
  const grooves = Array.from({ length: rings }, (_, i) => {
    const rr = labelR * 1.12 + ((r * 0.965 - labelR * 1.12) * i) / (rings - 1);
    const o = 0.38 + rand(i * 3.1) * 0.3;
    return <circle key={i} cx={0} cy={0} r={rr} fill="none" stroke={C.brandDeep} strokeOpacity={o} strokeWidth={1.2} />;
  });
  const text = (
    <div
      style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: T.font.display,
        fontStyle: "italic",
        fontWeight: 400,
        fontVariationSettings: "'SOFT' 100, 'opsz' 144",
        fontSize: labelR * 0.62,
        letterSpacing: "-0.04em",
        color: C.light,
      }}
    >
      {labelText}
    </div>
  );
  return (
    <div
      style={{
        position: "absolute",
        left: cx - r,
        top: cy - r,
        width: r * 2,
        height: r * 2,
        opacity,
        transform: `scale(${scale})`,
      }}
    >
      <div style={{ position: "absolute", inset: 0, transform: `rotate(${rotation}deg)` }}>
        <svg width={r * 2} height={r * 2} viewBox={`${-r} ${-r} ${r * 2} ${r * 2}`} style={{ position: "absolute", inset: 0 }}>
          <circle cx={0} cy={0} r={r} fill={C.dark} />
          {/* lead-in band and runout band, slightly lighter */}
          <circle cx={0} cy={0} r={r * 0.985} fill="none" stroke={C.dark2} strokeWidth={r * 0.02} />
          {grooves}
          <circle cx={0} cy={0} r={labelR * 1.06} fill="none" stroke={C.dark2} strokeWidth={labelR * 0.08} />
          <circle cx={0} cy={0} r={labelR} fill={C.brand} />
          {/* printed details on the label: they make the spin readable */}
          <circle cx={0} cy={0} r={labelR * 0.86} fill="none" stroke={C.light} strokeOpacity={0.35} strokeWidth={1.5} strokeDasharray={`${labelR * 4.6} ${labelR * 0.8}`} />
          <circle cx={0} cy={-labelR * 0.74} r={labelR * 0.035} fill={C.accent} />
          {labelText ? null : <circle cx={0} cy={0} r={labelR * 0.05} fill={C.dark} />}
        </svg>
        {rotateLabelText ? text : null}
      </div>
      {rotateLabelText ? null : text}
      {/* sheen: static, white 6–10 % */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: "50%",
          background: `conic-gradient(from 20deg, transparent 0deg, rgba(255,255,255,0.09) 30deg, transparent 70deg, transparent 180deg, rgba(255,255,255,0.07) 210deg, transparent 250deg)`,
          WebkitMaskImage: `radial-gradient(circle, transparent ${labelR * 1.12}px, black ${labelR * 1.16}px)`,
          maskImage: `radial-gradient(circle, transparent ${labelR * 1.12}px, black ${labelR * 1.16}px)`,
        }}
      />
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* Tonearm — brass, rotates about its pivot. angle 0 = needle on disc. */
/* ------------------------------------------------------------------ */
export const Tonearm: React.FC<{ px: number; py: number; tx: number; ty: number; angle: number }> = ({ px, py, tx, ty, angle }) => {
  const len = Math.hypot(tx - px, ty - py);
  const base = (Math.atan2(ty - py, tx - px) * 180) / Math.PI;
  return (
    <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
      <g transform={`translate(${px} ${py}) rotate(${base + angle})`}>
        <line x1={-40} y1={0} x2={len - 46} y2={0} stroke={C.accent} strokeWidth={7} strokeLinecap="round" />
        <rect x={-74} y={-16} width={34} height={32} rx={4} fill={C.dark2} stroke={C.accent} strokeWidth={2} />
        <g transform={`translate(${len - 46} 0) rotate(28)`}>
          <rect x={0} y={-13} width={62} height={26} rx={3} fill={C.accent} />
        </g>
      </g>
      <circle cx={px} cy={py} r={30} fill={C.dark2} stroke={C.accent} strokeWidth={2} />
      <circle cx={px} cy={py} r={9} fill={C.accent} />
    </svg>
  );
};

/* ------------------------------------------------------------------ */
/* Waveform hairline — the "noise → signal" line.                       */
/*  noise 1 = static, 0 = clean sine · flat 1 = straight (runout)      */
/*  mountain 1 = ridge of the mountain (Side B)                        */
/* ------------------------------------------------------------------ */
const N = 180;
const mountainH = (u: number) =>
  240 * Math.exp(-(((u - 0.26) / 0.15) ** 2)) +
  344 * Math.exp(-(((u - 0.66) / 0.12) ** 2)) +
  152 * Math.exp(-(((u - 0.93) / 0.09) ** 2)) +
  72 * Math.exp(-(((u - 0.46) / 0.08) ** 2)) +
  11 * Math.sin(u * 61);

export const wavePoints = (opts: {
  y: number;
  amp: number;
  wavelength: number;
  phase: number;
  noise: number;
  flat?: number;
  mountain?: number;
  tick: number;
  width?: number;
}) => {
  const { y, amp, wavelength, phase, noise, flat = 0, mountain = 0, tick, width = 1080 } = opts;
  const seed = Math.floor(tick / 2); // static changes every 2 frames
  const raw = Array.from({ length: N }, (_, i) => rand(i * 17.3 + seed * 91.7) - 0.5);
  const smooth = raw.map((v, i) => (v * 2 + (raw[i - 1] ?? v) + (raw[i + 1] ?? v)) / 4);
  return Array.from({ length: N }, (_, i) => {
    const u = i / (N - 1);
    const x = -20 + u * (width + 40);
    const sine = Math.sin((x / wavelength) * Math.PI * 2 + phase) * amp;
    const nz = smooth[i] * 2 * noise * amp * 2.4;
    const wy = y + (sine + nz) * (1 - flat);
    const my = y - mountainH(u);
    return [x, wy + (my - wy) * mountain] as const;
  });
};

const toPath = (pts: readonly (readonly [number, number])[]) =>
  pts.map(([x, y], i) => `${i ? "L" : "M"}${x.toFixed(1)},${y.toFixed(1)}`).join(" ");

export const Wave: React.FC<{
  pts: readonly (readonly [number, number])[];
  color: string;
  width?: number;
  opacity?: number;
  draw?: number;
  fill?: string;
  fillOpacity?: number;
}> = ({ pts, color, width = 3, opacity = 1, draw = 1, fill, fillOpacity = 1 }) => {
  const d = toPath(pts);
  return (
    <svg width={1080} height={1920} style={{ position: "absolute", inset: 0, opacity }}>
      {fill ? <path d={`${d} L1100,1940 L-20,1940 Z`} fill={fill} opacity={fillOpacity} /> : null}
      <path d={d} fill="none" stroke={color} strokeWidth={width} strokeLinejoin="round" strokeLinecap="round" pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - draw} />
    </svg>
  );
};

/* ------------------------------------------------------------------ */
/* Sun — Side B; the record circle reborn as morning.                   */
/* ------------------------------------------------------------------ */
export const Sun: React.FC<{ cx: number; cy: number; r: number; opacity?: number; scale?: number }> = ({ cx, cy, r, opacity = 1, scale = 1 }) => (
  <svg width={1080} height={1920} style={{ position: "absolute", inset: 0, opacity }}>
    <g transform={`translate(${cx} ${cy}) scale(${scale})`}>
      <circle r={r} fill={C.light2} />
      {Array.from({ length: 7 }, (_, i) => (
        <circle key={i} r={r * (0.34 + i * 0.11)} fill="none" stroke={C.brand} strokeOpacity={0.16} strokeWidth={1.5} />
      ))}
      <circle r={r} fill="none" stroke={C.brand} strokeOpacity={0.3} strokeWidth={2} />
    </g>
  </svg>
);

/* ------------------------------------------------------------------ */
/* Line icons for the Side B pillars (drawn with draw-line).            */
/* ------------------------------------------------------------------ */
const icons: Record<string, string[]> = {
  // crecimiento personal → mountain with path to the top
  mountain: ["M4,52 L24,20 L34,34 L42,24 L60,52 Z", "M24,20 L28,28 L22,34"],
  // desarrollo → bicycle
  bicycle: [
    "M18,46 m-12,0 a12,12 0 1,0 24,0 a12,12 0 1,0 -24,0",
    "M50,46 m-12,0 a12,12 0 1,0 24,0 a12,12 0 1,0 -24,0",
    "M18,46 L28,28 L44,28 L50,46 M28,28 L34,46 L44,28 M26,22 L32,22 M44,28 L42,20 L48,20",
  ],
  // buen vivir → coffee cup with steam
  coffee: ["M12,30 L48,30 L44,54 L16,54 Z", "M48,34 a7,7 0 0,1 0,14 L45,48", "M22,22 q4,-5 0,-10 M30,22 q4,-5 0,-10 M38,22 q4,-5 0,-10"],
};

export const Icon: React.FC<{ name: keyof typeof icons; size: number; color: string; draw: number }> = ({ name, size, color, draw }) => (
  <svg width={size} height={size} viewBox="0 0 64 64">
    {icons[name].map((d, i) => (
      <path key={i} d={d} fill="none" stroke={color} strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - draw} />
    ))}
  </svg>
);
