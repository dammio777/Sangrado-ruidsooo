/** Puente ligero hacia lib/audio (carga diferida). */
import { useUI } from "./store";
import { live } from "./live";

type AudioMod = typeof import("./audio");
let mod: AudioMod | null = null;
let loading: Promise<AudioMod> | null = null;
const KEY = "cc-sound";

export function loadAudio() {
  if (mod) return Promise.resolve(mod);
  loading ??= import("./audio").then((m) => (mod = m));
  return loading;
}

function remember(on: boolean) {
  try {
    localStorage.setItem(KEY, on ? "1" : "0");
  } catch {
    /* almacenamiento no disponible */
  }
}

export async function setSound(on: boolean, needle = false) {
  useUI.getState().setSound(on);
  remember(on);
  if (on) {
    const m = await loadAudio();
    await m.enableAudio(needle);
  } else {
    live.soundOn = false;
    mod?.disableAudio();
  }
}

/** Si el usuario lo dejó ON antes: queda "armado" y arranca en el primer gesto. */
export function restoreSound() {
  let pref = false;
  try {
    pref = localStorage.getItem(KEY) === "1";
  } catch {
    pref = false;
  }
  if (!pref) return;
  useUI.getState().setSound(false, true);
  const start = (e: Event) => {
    window.removeEventListener("pointerdown", start, true);
    window.removeEventListener("keydown", start, true);
    // si el gesto es sobre el propio toggle, que lo maneje el toggle
    const t = e.target as HTMLElement | null;
    if (t?.closest?.("[data-sound-toggle]")) return;
    void setSound(true, useUI.getState().introPlaying);
  };
  window.addEventListener("pointerdown", start, true);
  window.addEventListener("keydown", start, true);
}

export function tick(pitch = 1) {
  if (live.soundOn) mod?.uiTick(pitch);
}

export function audio() {
  return mod;
}
