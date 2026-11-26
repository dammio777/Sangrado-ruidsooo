import { gsap } from "gsap";
import { dur, gsapEase } from "./motion";
import { addTick, watchVisible } from "./ticker";
import { live } from "./live";
import { DEG_PER_SEC, rpm } from "./motion";

export interface SpinState {
  angle: number;
  power: number;
  dir: 1 | -1;
  visible: boolean;
}

export interface Spinner {
  state: SpinState;
  destroy: () => void;
  spinUp: (d?: number) => void;
  spinDown: (d?: number) => void;
}

/**
 * `record-spin`: 24 s por vuelta; la velocidad de scroll lo empuja hasta ×2;
 * arranca y frena en 1.2 s (power3.inOut) al entrar/salir de vista.
 */
export function createSpin(
  el: HTMLElement | SVGElement,
  opts: { watch?: Element | null; boost?: boolean; autoStart?: boolean; startAngle?: number } = {},
): Spinner {
  const s: SpinState = {
    angle: opts.startAngle ?? Math.random() * 360,
    power: 0,
    dir: 1,
    visible: true,
  };
  let powerTween: gsap.core.Tween | null = null;
  const spinUp = (d = 2 * dur.slow) => {
    powerTween?.kill();
    powerTween = gsap.to(s, { power: 1, duration: d, ease: gsapEase.inOut });
  };
  const spinDown = (d = 2 * dur.slow) => {
    powerTween?.kill();
    powerTween = gsap.to(s, { power: 0, duration: d, ease: gsapEase.inOut });
  };
  const apply = () => {
    el.style.transform = `rotate(${s.angle.toFixed(2)}deg)`;
  };
  apply();
  const off = addTick((_t, dt) => {
    if (!s.visible && s.power < 0.001) return;
    const boost = opts.boost === false ? 1 : 1 + live.vNorm * (rpm.maxBoost - 1);
    s.angle += dt * DEG_PER_SEC * s.power * boost * s.dir;
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
