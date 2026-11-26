/**
 * Sonido opcional — Web Audio sintetizado (sin archivos).
 * Se crea el AudioContext solo en el primer gesto del usuario.
 */
import { live } from "./live";

let ctx: AudioContext | null = null;
let master: GainNode | null = null;
const VOLUME = 0.15;

function makeCrackleBuffer(c: AudioContext) {
  const len = c.sampleRate * 4;
  const buf = c.createBuffer(1, len, c.sampleRate);
  const data = buf.getChannelData(0);
  let pop = 0;
  let popAmp = 0;
  let brown = 0;
  for (let i = 0; i < len; i++) {
    const white = Math.random() * 2 - 1;
    brown = (brown + 0.02 * white) / 1.02;
    let v = brown * 0.9 + white * 0.012; // siseo + rumble suave
    if (pop <= 0 && Math.random() < 0.00035) {
      pop = 20 + Math.random() * 140;
      popAmp = (Math.random() < 0.15 ? 0.7 : 0.25) * (Math.random() < 0.5 ? -1 : 1);
    }
    if (pop > 0) {
      v += popAmp * (pop / 160) * (Math.random() * 0.6 + 0.4);
      pop--;
    }
    data[i] = v;
  }
  return buf;
}

export async function enableAudio(withNeedleDrop = false) {
  if (!ctx) {
    const AC = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    ctx = new AC();
    master = ctx.createGain();
    master.gain.value = 0;
    master.connect(ctx.destination);

    const src = ctx.createBufferSource();
    src.buffer = makeCrackleBuffer(ctx);
    src.loop = true;
    const hp = ctx.createBiquadFilter();
    hp.type = "highpass";
    hp.frequency.value = 180;
    const lp = ctx.createBiquadFilter();
    lp.type = "lowpass";
    lp.frequency.value = 6500;
    const g = ctx.createGain();
    g.gain.value = 0.55;
    src.connect(hp).connect(lp).connect(g).connect(master);
    src.start();

    document.addEventListener("visibilitychange", () => {
      if (!ctx) return;
      if (document.hidden) void ctx.suspend();
      else if (live.soundOn) void ctx.resume();
    });
  }
  if (ctx.state !== "running") await ctx.resume();
  const now = ctx.currentTime;
  master!.gain.cancelScheduledValues(now);
  master!.gain.setValueAtTime(master!.gain.value, now);
  master!.gain.linearRampToValueAtTime(VOLUME, now + 0.3);
  live.soundOn = true;
  if (withNeedleDrop) needleDrop();
}

export function disableAudio() {
  live.soundOn = false;
  if (!ctx || !master) return;
  const now = ctx.currentTime;
  master.gain.cancelScheduledValues(now);
  master.gain.setValueAtTime(master.gain.value, now);
  master.gain.linearRampToValueAtTime(0, now + 0.3);
  window.setTimeout(() => {
    if (!live.soundOn) void ctx?.suspend();
  }, 360);
}

/** golpe de aguja: seno grave corto + ráfaga de ruido */
export function needleDrop() {
  if (!ctx || !master || !live.soundOn) return;
  const t = ctx.currentTime;
  const osc = ctx.createOscillator();
  osc.type = "sine";
  osc.frequency.setValueAtTime(90, t);
  osc.frequency.exponentialRampToValueAtTime(38, t + 0.22);
  const g = ctx.createGain();
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(1.1, t + 0.008);
  g.gain.exponentialRampToValueAtTime(0.0001, t + 0.3);
  osc.connect(g).connect(master);
  osc.start(t);
  osc.stop(t + 0.32);
  noiseBurst(0.08, 0.5, 2400);
}

function noiseBurst(len: number, amp: number, freq: number) {
  if (!ctx || !master) return;
  const t = ctx.currentTime;
  const buf = ctx.createBuffer(1, Math.ceil(ctx.sampleRate * len), ctx.sampleRate);
  const d = buf.getChannelData(0);
  for (let i = 0; i < d.length; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / d.length) ** 3;
  const src = ctx.createBufferSource();
  src.buffer = buf;
  const bp = ctx.createBiquadFilter();
  bp.type = "bandpass";
  bp.frequency.value = freq;
  bp.Q.value = 0.9;
  const g = ctx.createGain();
  g.gain.value = amp;
  src.connect(bp).connect(g).connect(master);
  src.start(t);
}

/** tick de interfaz (~5 ms) */
export function uiTick(pitch = 1) {
  if (!ctx || !master || !live.soundOn) return;
  const t = ctx.currentTime;
  const osc = ctx.createOscillator();
  osc.type = "square";
  osc.frequency.value = 2200 * pitch;
  const g = ctx.createGain();
  g.gain.setValueAtTime(0.18, t);
  g.gain.exponentialRampToValueAtTime(0.0001, t + 0.005);
  osc.connect(g).connect(master);
  osc.start(t);
  osc.stop(t + 0.008);
}
