import React from "react";
import { AbsoluteFill, Composition, Series, Still, delayRender, continueRender } from "remotion";
import { fontsReady } from "./lib/fonts";
import { T } from "./lib/anim";
import { S0Intro, S1Hook, S2Who, S3Manifesto, S4Services, S5Sessions, SceneProps } from "./scenes/SideA";
import { S6Flip, S7SideB, S8Close } from "./scenes/SideB";
import { Cover } from "./scenes/Cover";

const h = delayRender("fonts");
fontsReady.then(() => continueRender(h));

const C = T.color;
type Step = { id: string; C: React.FC<SceneProps & { short?: boolean }>; dur: number; enterFrom?: string; spin0?: number; short?: boolean };

/* Brief §2 — 40 s master: frames 0–36–120–255–450–630–780–825–1050–1200. */
export const CUT40: Step[] = [
  { id: "S0-Intro", C: S0Intro, dur: 36 },
  { id: "S1-Gancho", C: S1Hook, dur: 84, enterFrom: C.dark, spin0: 0 },
  { id: "S2-QuienEs", C: S2Who, dur: 135, spin0: 84 },
  { id: "S3-Manifiesto", C: S3Manifesto, dur: 195, enterFrom: C.brand },
  { id: "S4-LoQueHace", C: S4Services, dur: 180, enterFrom: C.dark },
  { id: "S5-Sesiones", C: S5Sessions, dur: 150, enterFrom: C.brand },
  { id: "S6-CambioDeLado", C: S6Flip, dur: 45, enterFrom: C.dark },
  { id: "S7-BuenVivir", C: S7SideB, dur: 225 },
  { id: "S8-Cierre", C: S8Close, dur: 150 },
];

/* Brief §7 — 15 s cut: 0 → 1 → 2 (short) → 6 → 7 (title + phrase) → 8. */
export const CUT15: Step[] = [
  { id: "S0-Intro", C: S0Intro, dur: 36 },
  { id: "S1-Gancho", C: S1Hook, dur: 75, enterFrom: C.dark, spin0: 0 },
  { id: "S2-QuienEs", C: S2Who, dur: 90, spin0: 75 },
  { id: "S6-CambioDeLado", C: S6Flip, dur: 45, enterFrom: C.brand, spin0: 165 },
  { id: "S7-BuenVivir", C: S7SideB, dur: 99, short: true },
  { id: "S8-Cierre", C: S8Close, dur: 105 },
];

const total = (s: Step[]) => s.reduce((a, b) => a + b.dur, 0);

const CUTS = { "40": CUT40, "15": CUT15 };

// Props must be JSON-serialisable, so the cut is passed by name.
// Audio (public/audio/sfx-*.wav) is muxed with ffmpeg in scripts/render.sh.
const Master: React.FC<{ cut: "40" | "15" }> = ({ cut }) => (
  <AbsoluteFill style={{ backgroundColor: C.dark }}>
    <Series>
      {CUTS[cut].map((s) => (
        <Series.Sequence key={s.id} durationInFrames={s.dur} name={s.id}>
          <s.C dur={s.dur} enterFrom={s.enterFrom} spin0={s.spin0} short={s.short} />
        </Series.Sequence>
      ))}
    </Series>
  </AbsoluteFill>
);

export const Root: React.FC = () => {
  const { width, height, fps } = T.video;
  return (
    <>
      <Composition id="Reel40" component={Master} durationInFrames={total(CUT40)} fps={fps} width={width} height={height} defaultProps={{ cut: "40" as const}} />
      <Composition id="Reel15" component={Master} durationInFrames={total(CUT15)} fps={fps} width={width} height={height} defaultProps={{ cut: "15" as const}} />
      {CUT40.map((s) => (
        <Composition key={s.id} id={s.id} component={s.C} durationInFrames={s.dur} fps={fps} width={width} height={height} defaultProps={{ dur: s.dur, enterFrom: s.enterFrom, spin0: s.spin0 }} />
      ))}
      <Still id="Portada" component={Cover} width={width} height={height} />
    </>
  );
};
