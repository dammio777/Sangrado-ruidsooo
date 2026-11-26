import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { ease, exitOpacity, lin, prog, rand, T } from "../lib/anim";
import { Layers, Record, Tonearm, Wave, wavePoints } from "../components/Graphics";
import { Accent, body, display, HighlightWords, MaskLines, mono, RevealUp } from "../components/Type";
import { content } from "../content";

const C = T.color;
const S = T.surface;
export type SceneProps = { dur: number; enterFrom?: string; spin0?: number };

/** Two-layer opacity cross-fade from the previous surface (DESIGN.md §1.7). */
const Bg: React.FC<{ to: string; from?: string; len?: number }> = ({ to, from, len = T.motion.fadeThrough }) => {
  const frame = useCurrentFrame();
  if (!from || from === to) return <Layers layers={[{ color: to, opacity: 1 }]} />;
  return <Layers layers={[{ color: from, opacity: 1 }, { color: to, opacity: prog(frame, 0, len, ease.inOut) }]} />;
};

/* Hero record geometry, shared by scenes 1 and 2 (bleeds off the right edge). */
export const HERO = { cx: 880, cy: 1390, r: 620 };
const needle = (() => {
  const a = (-128 * Math.PI) / 180;
  return { x: HERO.cx + Math.cos(a) * HERO.r * 0.82, y: HERO.cy + Math.sin(a) * HERO.r * 0.82 };
})();
export const ARM = { px: 1012, py: 700, tx: needle.x, ty: needle.y };
const spin = (frame: number, spin0 = 0) => (frame + spin0) * T.motion.recordDegPerFrame;

/* ------------------------------------------------------------------ */
/* 0 · Intro de marca (T1) — noisy hairline tunes in to a clean sine.  */
/* ------------------------------------------------------------------ */
export const S0Intro: React.FC<SceneProps> = ({ dur }) => {
  const frame = useCurrentFrame();
  const noise = 1 - prog(frame, 0, 22, ease.outSoft);
  const pts = wavePoints({ y: 1040, amp: 22, wavelength: 270, phase: frame * 0.14, noise, tick: frame });
  const out = exitOpacity(frame, dur, 6);
  return (
    <AbsoluteFill>
      <Bg to={C.dark} />
      <AbsoluteFill style={{ opacity: out }}>
        <Wave pts={pts} color={C.light} width={2.5} opacity={0.85} />
        <MaskLines
          at={6}
          dur={24}
          lines={["Cristian Calle"]}
          style={{ ...display, position: "absolute", top: 830, width: 1080, textAlign: "center", fontSize: 112, color: C.light }}
        />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------ */
/* 1 · Gancho — "Esto es Hi-Fi." Resolved before 2 s (global f 60).    */
/* ------------------------------------------------------------------ */
export const S1Hook: React.FC<SceneProps> = ({ dur, enterFrom, spin0 = 0 }) => {
  const frame = useCurrentFrame();
  const rec = prog(frame, 0, 14, ease.outSoft);
  const arm = -24 + 24 * prog(frame, 8, 26, ease.outSoft); // rest → on the record, damped
  const out = exitOpacity(frame, dur, 6);
  return (
    <AbsoluteFill>
      <Bg to={S.brand.bg} from={enterFrom} len={8} />
      <Record {...HERO} rotation={spin(frame, spin0)} opacity={rec} />
      <Tonearm {...ARM} angle={arm} />
      <AbsoluteFill style={{ opacity: out }}>
        <RevealUp at={0} dur={22} style={{ ...mono, position: "absolute", left: 72, top: 340, color: S.brand.muted }}>
          {content.hook.label}
        </RevealUp>
        <MaskLines
          at={2}
          dur={26}
          lines={[content.hook.pre, <Accent color={C.accent}>{content.hook.accent}</Accent>]}
          style={{ ...display, position: "absolute", left: 72, top: 410, fontSize: 196, color: C.light }}
        />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------ */
/* 2 · Quién es (T2 + T3) — no portrait yet: the name over the record. */
/* ------------------------------------------------------------------ */
export const S2Who: React.FC<SceneProps> = ({ dur, spin0 = 0 }) => {
  const frame = useCurrentFrame();
  const out = exitOpacity(frame, dur, 6);
  return (
    <AbsoluteFill>
      <Bg to={S.brand.bg} />
      <AbsoluteFill style={{ opacity: out }}>
        <Record {...HERO} rotation={spin(frame, spin0)} />
        <Tonearm {...ARM} angle={lin(frame, [0, dur], [0, 1.2])} />
        <MaskLines
          at={2}
          lines={content.name}
          style={{ ...display, position: "absolute", left: 72, top: 380, fontSize: 210, color: C.light }}
        />
        <RevealUp at={14} style={{ ...body, position: "absolute", left: 72, top: 830, fontSize: 46, color: C.light }}>
          {content.role[0]}
          <br />
          {content.role[1]}
        </RevealUp>
        <RevealUp at={19} style={{ ...mono, position: "absolute", left: 72, top: 990, color: S.brand.muted }}>
          {content.place}
        </RevealUp>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------ */
/* 3 · Manifiesto (T4) — highlight-words + hairline with clarity.      */
/* ------------------------------------------------------------------ */
export const S3Manifesto: React.FC<SceneProps> = ({ dur, enterFrom }) => {
  const frame = useCurrentFrame();
  const [p1, p2] = content.manifesto;
  const n1 = p1.split(" ").length;
  const n2 = p2.split(" ").length;
  const noise = 1 - lin(frame, [0, 150], [0, 1]);
  const pts = wavePoints({ y: 1380, amp: 24, wavelength: 300, phase: frame * 0.1, noise, tick: frame });
  const inO = lin(frame, [4, 12], [0, 1]);
  const out = exitOpacity(frame, dur, 6);
  return (
    <AbsoluteFill>
      <Bg to={C.dark} from={enterFrom} />
      <AbsoluteFill style={{ opacity: Math.min(inO, out) }}>
        <Wave pts={pts} color={C.accent} width={2.5} opacity={0.7} />
        <HighlightWords
          text={p1}
          from={10}
          to={95}
          total={n1}
          style={{ ...display, fontWeight: 350, lineHeight: 1.04, letterSpacing: "-0.02em", position: "absolute", left: 72, top: 360, width: 868, fontSize: 84, color: C.light, textWrap: "pretty" }}
        />
        <HighlightWords
          text={p2}
          from={100}
          to={172}
          total={n2}
          style={{ ...body, position: "absolute", left: 72, top: 1000, width: 820, fontSize: 46, lineHeight: 1.35, color: S.dark.muted, textWrap: "pretty" }}
        />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------ */
/* 4 · Lo que hace (T5) — tracklist A1–A5.                             */
/* ------------------------------------------------------------------ */
const MiniWave: React.FC<{ seed: number; played: number; active: number }> = ({ seed, played, active }) => {
  const w = 132;
  const h = 44;
  const pts = Array.from({ length: 44 }, (_, i) => {
    const x = (i / 43) * w;
    const env = Math.sin((i / 43) * Math.PI) * 0.7 + 0.3;
    const y = h / 2 + (rand(seed * 10 + i) - 0.5) * h * 0.9 * env * (i % 2 ? 1 : -1);
    return `${i ? "L" : "M"}${x.toFixed(1)},${y.toFixed(1)}`;
  }).join(" ");
  const id = `clip${seed}`;
  return (
    <svg width={w} height={h} style={{ overflow: "visible" }}>
      <defs>
        <clipPath id={id}>
          <rect x={0} y={-4} width={w * played} height={h + 8} />
        </clipPath>
      </defs>
      <path d={pts} fill="none" stroke={C.light} strokeOpacity={0.35} strokeWidth={1.8} />
      <path d={pts} fill="none" stroke={C.accent} strokeWidth={1.8} clipPath={`url(#${id})`} opacity={active} />
      <line x1={w * played} x2={w * played} y1={-4} y2={h + 4} stroke={C.accent} strokeWidth={2} opacity={active} />
    </svg>
  );
};

export const S4Services: React.FC<SceneProps> = ({ dur, enterFrom, spin0 = 0 }) => {
  const frame = useCurrentFrame();
  const items = content.services.items;
  const top = 400;
  const rowH = 128;
  const start = 46;
  const each = (dur - start) / items.length;
  const k = Math.max(0, Math.min(items.length - 1, Math.floor((frame - start) / each)));
  const activeOn = lin(frame, [start - 4, start + 4], [0, 1]);
  const local = frame - start - k * each;
  const out = exitOpacity(frame, dur, 6);
  const rec = prog(frame, 30, 20, ease.outSoft);
  // label of the record: active number, fade-through on change
  const numO = Math.min(lin(local, [0, 5], [0, 1]), lin(local, [each - 5, each], [1, 0]));
  return (
    <AbsoluteFill>
      <Bg to={S.brand.bg} from={enterFrom} />
      <AbsoluteFill style={{ opacity: out }}>
        <RevealUp at={4} style={{ ...mono, position: "absolute", left: 72, top: 318, color: S.brand.muted }}>
          {content.services.label}
        </RevealUp>
        {items.map((it, i) => {
          const isActive = i === k ? activeOn : 0;
          const played = i === k ? Math.min(1, Math.max(0, local / each)) : 0;
          return (
            <RevealUp key={it.n} at={10 + i * 4} style={{ position: "absolute", left: 0, top: top + i * rowH, width: 1080, height: rowH }}>
              <div style={{ position: "absolute", inset: 0, background: S.brand.raised, opacity: isActive * 0.9 }} />
              <div style={{ position: "absolute", left: 72, right: 140, top: 0, height: 1, background: S.brand.line }} />
              {i === items.length - 1 ? (
                <div style={{ position: "absolute", left: 72, right: 140, bottom: 0, height: 1, background: S.brand.line }} />
              ) : null}
              <div style={{ ...mono, position: "absolute", left: 72, top: 46, color: C.accent }}>{it.n}</div>
              <div
                style={{
                  ...display,
                  fontWeight: 400,
                  letterSpacing: "-0.015em",
                  position: "absolute",
                  left: 170 + 8 * isActive,
                  top: 36,
                  fontSize: 52,
                  lineHeight: 1.05,
                  color: C.light,
                }}
              >
                {it.t}
              </div>
              <div style={{ position: "absolute", left: 808, top: 42 }}>
                <MiniWave seed={i + 1} played={played} active={isActive} />
              </div>
            </RevealUp>
          );
        })}
        <Record
          cx={210}
          cy={1440}
          r={360}
          rotation={(frame + spin0) * T.motion.recordDegPerFrame}
          opacity={rec}
          rotateLabelText={false}
          labelText={<span style={{ fontFamily: T.font.accent, fontStyle: "normal", fontSize: 54, letterSpacing: "0.04em", opacity: numO * activeOn }}>{items[k].n}</span>}
        />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------ */
/* 5 · Sesiones (T6) — three sleeves on a horizontal rail.             */
/* ------------------------------------------------------------------ */
export const S5Sessions: React.FC<SceneProps> = ({ dur, enterFrom }) => {
  const frame = useCurrentFrame();
  const s = content.sessions;
  const move = 18; // 18 f per card, in-out
  const stops = [16, 64, 108];
  let p = -1;
  stops.forEach((st) => (p += prog(frame, st, move, ease.inOut)));
  const card = 680;
  const gap = 900; // neighbours stay fully off-frame (x ≥ 1100) while resting
  const out = exitOpacity(frame, dur, 6);
  return (
    <AbsoluteFill>
      <Bg to={C.dark} from={enterFrom} />
      <AbsoluteFill style={{ opacity: out }}>
        <MaskLines
          at={4}
          lines={s.heading}
          style={{ ...display, fontWeight: 350, letterSpacing: "-0.025em", lineHeight: 0.98, position: "absolute", left: 72, top: 280, fontSize: 92, color: C.light }}
        />
        {s.items.map((it, i) => {
          const x = 540 + (i - p) * gap;
          const caption = s.venueConfirmed ? `${it.name} · ${it.venue}` : it.name;
          return (
            <div key={it.name} style={{ position: "absolute", left: x - card / 2, top: 560, width: card }}>
              <div
                style={{
                  position: "relative",
                  width: card,
                  height: card,
                  borderRadius: T.radius.card,
                  background: C.brandDeep,
                  boxShadow: `inset 0 0 0 1px rgba(242,230,208,0.08), 0 28px 60px -20px rgba(0,0,0,0.6)`,
                  overflow: "hidden",
                }}
              >
                {it.poster ? (
                  <img src={it.poster} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                ) : (
                  <>
                    <Record cx={card / 2} cy={card / 2 + 10} r={230} rotation={frame * T.motion.recordDegPerFrame + i * 40} opacity={0.3} labelText="" />
                    <div style={{ ...display, fontWeight: 400, letterSpacing: "-0.02em", position: "absolute", left: 44, top: 44, fontSize: 64, lineHeight: 1, color: C.light, width: card - 88 }}>
                      {it.name}
                    </div>
                    <div style={{ ...body, position: "absolute", left: 44, top: 140, fontSize: 32, color: S.brand.muted }}>Afiche próximamente</div>
                  </>
                )}
                <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 74, background: "rgba(28,10,13,0.82)", borderTop: `1px solid ${S.dark.line}` }}>
                  <div style={{ ...mono, position: "absolute", left: 44, top: 20, fontSize: 28, color: C.accent }}>
                    Sonó · {it.short}
                  </div>
                </div>
              </div>
              <div style={{ ...body, marginTop: 34, fontSize: 40, color: C.light, textAlign: "left" }}>
                {caption}
                <span style={{ color: S.dark.muted }}> · Sonó el {it.day}</span>
              </div>
            </div>
          );
        })}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
