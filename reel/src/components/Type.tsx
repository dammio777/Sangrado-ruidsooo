import React from "react";
import { useCurrentFrame } from "remotion";
import { ease, lin, prog, F, T } from "../lib/anim";

type Style = React.CSSProperties;

export const display: Style = {
  fontFamily: T.font.display,
  fontWeight: 300,
  fontVariationSettings: T.font.displayVariation,
  letterSpacing: "-0.035em",
  lineHeight: 0.92,
};

export const mono: Style = {
  fontFamily: T.font.accent,
  fontWeight: 500,
  fontSize: T.type.label,
  letterSpacing: T.font.monoTracking,
  textTransform: "uppercase",
  lineHeight: 1.3,
};

export const body: Style = {
  fontFamily: T.font.body,
  fontWeight: 400,
  fontSize: T.type.body,
  lineHeight: 1.4,
};

/** Accent word: Fraunces italic (DESIGN.md: "Hi-Fi" and "buen vivir"). */
export const Accent: React.FC<{ color: string; children: React.ReactNode }> = ({ color, children }) => (
  <span style={{ fontStyle: "italic", fontWeight: 350, color, fontVariationSettings: "'SOFT' 100, 'opsz' 144" }}>{children}</span>
);

/** reveal-up — y 28→0, opacity 0→1, `out` ease, 27 f. */
export const RevealUp: React.FC<{ at: number; dur?: number; style?: Style; children: React.ReactNode }> = ({
  at,
  dur = F.reveal,
  style,
  children,
}) => {
  const frame = useCurrentFrame();
  const p = prog(frame, at, dur, ease.out);
  return (
    <div style={{ ...style, opacity: p, transform: `translateY(${(1 - p) * T.motion.distance}px)` }}>{children}</div>
  );
};

/** mask-lines — each line rises yPercent 110→0 inside its own mask; stagger 2–3 f; `out` ease. */
export const MaskLines: React.FC<{
  at: number;
  lines: React.ReactNode[];
  style?: Style;
  stagger?: number;
  dur?: number;
}> = ({ at, lines, style, stagger = 3, dur = F.maskLines }) => {
  const frame = useCurrentFrame();
  return (
    <div style={style}>
      {lines.map((line, i) => {
        const p = prog(frame, at + i * stagger, dur, ease.out);
        return (
          <div key={i} style={{ overflow: "hidden", paddingBottom: "0.14em", marginBottom: "-0.14em", paddingTop: "0.04em" }}>
            <div style={{ transform: `translateY(${(1 - p) * 110}%)` }}>{line}</div>
          </div>
        );
      })}
    </div>
  );
};

/** highlight-words — words opacity .18→1 in sequence across [from, to]. */
export const HighlightWords: React.FC<{
  text: string;
  from: number;
  to: number;
  offset?: number; // word index offset when chaining paragraphs
  total?: number; // total words across chained paragraphs
  style?: Style;
}> = ({ text, from, to, offset = 0, total, style }) => {
  const frame = useCurrentFrame();
  const words = text.split(" ");
  const n = total ?? words.length;
  const step = (to - from) / n;
  return (
    <div style={style}>
      {words.map((w, i) => {
        const s = from + (offset + i) * step;
        const o = lin(frame, [s, s + step * 2.2], [0.18, 1]);
        return (
          <span key={i} style={{ opacity: o }}>
            {w}
            {i < words.length - 1 ? " " : ""}
          </span>
        );
      })}
    </div>
  );
};
