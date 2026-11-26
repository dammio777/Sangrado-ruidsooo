import { Easing, interpolate } from "remotion";
import tokens from "../tokens.json";

const [o1, o2, o3, o4] = tokens.motion.ease.out;
const [s1, s2, s3, s4] = tokens.motion.ease.outSoft;
const [i1, i2, i3, i4] = tokens.motion.ease.inOut;

export const ease = {
  out: Easing.bezier(o1, o2, o3, o4),
  outSoft: Easing.bezier(s1, s2, s3, s4),
  inOut: Easing.bezier(i1, i2, i3, i4),
};

/** 0→1 progress between two frames with an easing, clamped. */
export const prog = (
  frame: number,
  start: number,
  duration: number,
  e: (t: number) => number = ease.out
) =>
  interpolate(frame, [start, start + duration], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: e,
  });

/** Linear clamp helper. */
export const lin = (frame: number, input: [number, number], output: [number, number]) =>
  interpolate(frame, input, output, { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

/** Content fade-out at the end of a scene (first half of a fade-through). */
export const exitOpacity = (frame: number, dur: number, len = 6) =>
  lin(frame, [dur - len, dur], [1, 0]);

/** Deterministic pseudo-random in [0,1). */
export const rand = (seed: number) => {
  const x = Math.sin(seed * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
};

export const F = tokens.motion.frames;
export const T = tokens;
