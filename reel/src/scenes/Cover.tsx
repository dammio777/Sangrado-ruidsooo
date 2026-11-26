import React from "react";
import { AbsoluteFill } from "remotion";
import { T } from "../lib/anim";
import { Record } from "../components/Graphics";
import { Accent, display, mono } from "../components/Type";
import { content } from "../content";

const C = T.color;

/* Cover 1080×1920 — key content inside the centre 1080×1440 (y 240–1680). */
export const Cover: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: C.brand }}>
    <Record cx={900} cy={1160} r={600} rotation={18} />
    <div style={{ ...mono, position: "absolute", left: 72, top: 470, color: T.surface.brand.muted }}>{content.hook.label}</div>
    <div style={{ ...display, position: "absolute", left: 72, top: 540, fontSize: 220, color: C.light }}>
      {content.name[0]}
      <br />
      {content.name[1]}
    </div>
    <div style={{ ...display, position: "absolute", left: 72, top: 990, fontSize: 210, color: C.light }}>
      <Accent color={C.accent}>Hi-Fi</Accent>
    </div>
    <div style={{ ...mono, textTransform: "none", position: "absolute", left: 72, top: 1560, color: C.light }}>{content.handle}</div>
  </AbsoluteFill>
);
