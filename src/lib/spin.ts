import { gsap } from "gsap";
import { addTick, watchVisible } from "./ticker";
import { live } from "./live";
import { DEG_PER_SEC, rpm } from "./motion";

export interface SpinState {
  angle: number;
  power: number;
  dir: 1 | -1;
  scratching: boolean;
  inertia: number; // grados/s extra (scratch o empujón)
  visible: boolean;
}

export interface Spinner {
  state: SpinState;
  destroy: () => void;
  spinUp: (d?: number) => void;
  spinDown: (d?: number) => void;
}

/**
 * `record-spin`: rotación continua a 33⅓ RPM. timeScale sigue la velocidad
 * de scroll (×1 → ×4), arranca con ease `platter`, frena en 1.2 s fuera de vista.
 */
export const spinners: Record<string, Spinner> = {};

export function createSpin(
  el: HTMLElement | SVGElement,
  opts: { watch?: Element | null; boost?: boolean; autoStart?: boolean; startAngle?: number } = {},
): Spinner {
  const s: SpinState = {
    angle: opts.startAngle ?? Math.random() * 360,
    power: 0,
    dir: 1,
    scratching: false,
    inertia: 0,
    visible: true,
  };
  let powerTween: gsap.core.Tween | null = null;
  const spinUp = (d = 1.6) => {
    powerTween?.kill();
    powerTween = gsap.to(s, { power: 1, duration: d, ease: "platter" });
  };
  const spinDown = (d = 1.2) => {
    powerTween?.kill();
    powerTween = gsap.to(s, { power: 0, duration: d, ease: "power2.out" });
  };
  const apply = () => {
    el.style.transform = `rotate(${s.angle.toFixed(2)}deg)`;
  };
  apply();
  const off = addTick((_t, dt) => {
    if (!s.visible && s.power < 0.001 && Math.abs(s.inertia) < 0.5 && !s.scratching) return;
    if (!s.scratching) {
      const boost = opts.boost === false ? 1 : 1 + live.vNorm * (rpm.maxBoost - 1);
      s.angle += dt * (DEG_PER_SEC * s.power * boost * s.dir + s.inertia);
      s.inertia *= Math.exp(-dt * 2.4);
    }
    apply();
  });
  let unwatch = () => {};
  if (opts.watch) {
    unwatch = watchVisible(opts.watch, (v) => {
      s.visible = v;
      if (v) spinUp();
      else spinDown();
    });
  } else if (opts.autoStart !== false) {
    spinUp();
  }
  return {
    state: s,
    spinUp,
    spinDown,
    destroy: () => {
      off();
      unwatch();
      powerTween?.kill();
    },
  };
}

/** Arrastrar el disco = scratch: la rotación sigue al puntero y vuelve a 33⅓ con inercia. */
export function attachScratch(target: HTMLElement, spinner: Spinner): () => void {
  let last = 0;
  let lastT = 0;
  let vel = 0;
  let pid = -1;
  const angleOf = (e: PointerEvent) => {
    const r = target.getBoundingClientRect();
    return (Math.atan2(e.clientY - (r.top + r.height / 2), e.clientX - (r.left + r.width / 2)) * 180) / Math.PI;
  };
  const down = (e: PointerEvent) => {
    if (e.pointerType !== "mouse" || e.button !== 0) return;
    pid = e.pointerId;
    target.setPointerCapture(pid);
    spinner.state.scratching = true;
    last = angleOf(e);
    lastT = performance.now();
    vel = 0;
    target.classList.add("is-scratching");
  };
  const move = (e: PointerEvent) => {
    if (e.pointerId !== pid) return;
    const a = angleOf(e);
    let d = a - last;
    if (d > 180) d -= 360;
    if (d < -180) d += 360;
    const now = performance.now();
    const dtt = Math.max(1, now - lastT) / 1000;
    vel = vel * 0.6 + (d / dtt) * 0.4;
    spinner.state.angle += d;
    last = a;
    lastT = now;
  };
  const up = (e: PointerEvent) => {
    if (e.pointerId !== pid) return;
    pid = -1;
    spinner.state.scratching = false;
    spinner.state.inertia = gsap.utils.clamp(-1600, 1600, vel - DEG_PER_SEC);
    target.classList.remove("is-scratching");
  };
  target.addEventListener("pointerdown", down);
  target.addEventListener("pointermove", move);
  target.addEventListener("pointerup", up);
  target.addEventListener("pointercancel", up);
  return () => {
    target.removeEventListener("pointerdown", down);
    target.removeEventListener("pointermove", move);
    target.removeEventListener("pointerup", up);
    target.removeEventListener("pointercancel", up);
  };
}
