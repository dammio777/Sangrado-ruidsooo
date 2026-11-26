import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { ease, exitOpacity, lin, prog, T } from "../lib/anim";
import { Icon, Layers, Record, Sun, Wave, wavePoints } from "../components/Graphics";
import { Accent, body, display, MaskLines, mono, RevealUp } from "../components/Type";
import { content } from "../content";
import type { SceneProps } from "./SideA";

const C = T.color;
const S = T.surface;

/* Shared Side B geometry: the sun sits where the flipped record was. */
export const SUN = { cx: 700, cy: 600, r: 280 };
const MOUNT_Y = 1880;

const mixHex = (a: string, b: string, t: number) => {
  const pa = [1, 3, 5].map((i) => parseInt(a.slice(i, i + 2), 16));
  const pb = [1, 3, 5].map((i) => parseInt(b.slice(i, i + 2), 16));
  return `rgb(${pa.map((v, i) => Math.round(v + (pb[i] - v) * t)).join(",")})`;
};

/* ------------------------------------------------------------------ */
/* 6 · Cambio de lado (T7) — record fades, sun grows, wine → cream     */
/* (two layers, opacity only), the wave becomes the mountain.          */
/* ------------------------------------------------------------------ */
export const S6Flip: React.FC<SceneProps> = ({ enterFrom, spin0 = 0 }) => {
  const frame = useCurrentFrame();
  const enter = enterFrom ? prog(frame, 0, 8, ease.inOut) : 1;
  const recO = 1 - prog(frame, 8, 10, ease.inOut); // record fades on wine first
  const cream = prog(frame, 20, 20, ease.inOut); // then wine → cream (opacity)
  const sunP = prog(frame, 20, 25, ease.outSoft); // the sun rises with the daylight
  const m = prog(frame, 18, 27, ease.inOut);
  const pts = wavePoints({ y: MOUNT_Y, amp: 16, wavelength: 300, phase: frame * 0.1, noise: 0, mountain: m, tick: frame });
  const textO = Math.min(prog(frame, 0, 8, ease.out), 1 - lin(frame, [18, 24], [0, 1]));
  return (
    <AbsoluteFill>
      <Layers
        layers={[
          { color: enterFrom ?? S.brand.bg, opacity: 1 },
          { color: S.brand.bg, opacity: enter },
          { color: S.light.bg, opacity: cream },
        ]}
      />
      <Sun {...SUN} opacity={cream} scale={0.55 + 0.45 * sunP} />
      <Record {...SUN} rotation={(frame + spin0) * T.motion.recordDegPerFrame} opacity={recO * enter} />
      <Wave pts={pts} color={mixHex(C.light, C.brand, cream)} width={2.5} fill={C.light2} fillOpacity={m * cream} />
      <RevealUp at={0} dur={20} style={{ position: "absolute", left: 0, top: 0 }}>
        <div style={{ ...display, fontWeight: 350, letterSpacing: "-0.025em", position: "absolute", left: 72, top: 1040, width: 900, fontSize: 104, lineHeight: 0.98, color: C.light, opacity: textO }}>
          {content.flip[0]}
          <br />
          {content.flip[1]}
        </div>
      </RevealUp>
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------ */
/* 7 · El buen vivir (T8 + T9).  short = title + phrase only (15 s).   */
/* ------------------------------------------------------------------ */
export const S7SideB: React.FC<SceneProps & { short?: boolean }> = ({ dur, short }) => {
  const frame = useCurrentFrame();
  const pts = wavePoints({ y: MOUNT_Y, amp: 0, wavelength: 300, phase: 0, noise: 0, mountain: 1, tick: 0 });
  const drift = lin(frame, [0, dur], [0, -0.04 * SUN.cy * 0.5]); // parallax ≤ 4 %
  const out = exitOpacity(frame, dur, 6);
  const b = content.sideB;
  return (
    <AbsoluteFill>
      <Layers layers={[{ color: S.light.bg, opacity: 1 }]} />
      <div style={{ position: "absolute", inset: 0, transform: `translateY(${drift}px)` }}>
        <Sun {...SUN} />
      </div>
      <Wave pts={pts} color={C.brand} width={2.5} fill={C.light2} />
      <AbsoluteFill style={{ opacity: out }}>
        <RevealUp at={2} style={{ ...mono, position: "absolute", left: 72, top: 330, color: C.brand }}>
          {b.label}
        </RevealUp>
        <MaskLines
          at={6}
          lines={[b.pre, <Accent color={C.brand}>{b.accent}</Accent>]}
          style={{ ...display, position: "absolute", left: 72, top: 400, fontSize: 180, color: C.brand }}
        />
        <RevealUp at={24} style={{ ...body, position: "absolute", left: 72, top: 790, width: 800, fontSize: 46, lineHeight: 1.3, color: S.light.text, textWrap: "balance" }}>
          {b.phrase}
        </RevealUp>
        {short
          ? null
          : b.pillars.map((pl, i) => {
              const at = 54 + i * 10;
              const draw = prog(frame, at, 36, ease.inOut);
              return (
                <div key={pl.t} style={{ position: "absolute", left: 72, top: 1000 + i * 150, width: 868, height: 150 }}>
                  <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: 1, background: S.light.line, transformOrigin: "left", transform: `scaleX(${draw})` }} />
                  <div style={{ position: "absolute", left: 0, top: 38 }}>
                    <Icon name={pl.icon} size={76} color={C.brand} draw={draw} />
                  </div>
                  <div
                    style={{
                      ...display,
                      fontWeight: 400,
                      letterSpacing: "-0.015em",
                      position: "absolute",
                      left: 112,
                      top: 46,
                      fontSize: 58,
                      lineHeight: 1,
                      color: C.brand,
                      opacity: lin(frame, [at + 6, at + 20], [0, 1]),
                      transform: `translateY(${(1 - prog(frame, at + 6, 27)) * 16}px)`,
                    }}
                  >
                    {pl.t}
                  </div>
                </div>
              );
            })}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------ */
/* 8 · Cierre (T11) — cream → wine, runout, the record with CC.        */
/* ------------------------------------------------------------------ */
export const S8Close: React.FC<SceneProps> = ({ dur }) => {
  const frame = useCurrentFrame();
  const wine = prog(frame, 0, 12, ease.inOut);
  const sideBOut = 1 - lin(frame, [0, 10], [0, 1]);
  const mountain = wavePoints({ y: MOUNT_Y, amp: 0, wavelength: 300, phase: 0, noise: 0, mountain: 1, tick: 0 });
  const runStart = Math.min(60, dur - 40);
  const flat = prog(frame, runStart, 30, ease.inOut);
  const line = wavePoints({ y: 1010, amp: 20, wavelength: 260, phase: frame * 0.12, noise: 0, flat, tick: frame });
  const rec = prog(frame, 18, 22, ease.outSoft);
  const c = content.close;
  return (
    <AbsoluteFill>
      <Layers layers={[{ color: S.light.bg, opacity: 1 }, { color: S.brand.bg, opacity: wine }]} />
      <div style={{ opacity: sideBOut }}>
        <Sun {...SUN} />
        <Wave pts={mountain} color={C.brand} width={2.5} fill={C.light2} />
      </div>
      <MaskLines
        at={10}
        lines={c.line}
        style={{ ...display, fontWeight: 350, letterSpacing: "-0.025em", lineHeight: 0.98, position: "absolute", left: 72, top: 330, fontSize: 100, color: C.light }}
      />
      <MaskLines
        at={18}
        lines={[content.handle]}
        style={{ ...display, position: "absolute", left: 72, top: 570, fontSize: 132, color: C.light }}
      />
      <RevealUp at={26} style={{ ...body, position: "absolute", left: 72, top: 770, fontSize: 44, color: C.light }}>
        {c.follow}
      </RevealUp>
      <RevealUp at={32} style={{ ...mono, position: "absolute", left: 72, top: 862, color: C.accent }}>
        {c.dm}
      </RevealUp>
      <Wave pts={line} color={C.light} width={2.5} opacity={0.7 * lin(frame, [14, 26], [0, 1])} />
      <Record cx={540} cy={1400} r={300} rotation={frame * T.motion.recordDegPerFrame} opacity={rec} />
    </AbsoluteFill>
  );
};
