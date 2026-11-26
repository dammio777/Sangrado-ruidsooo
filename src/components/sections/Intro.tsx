import { useEffect, useRef, useState } from "react";
import { gsap, morph } from "../../lib/gsap";
import { noisyPath, sinePath } from "../../lib/signal";
import { dur, gsapEase, introMax } from "../../lib/motion";
import { dispatchReveal } from "../../lib/reveal";
import { useUI } from "../../lib/store";
import { audio } from "../../lib/sound";
import { person } from "../../config/site";

const W = 1000;
const H = 120;
const NOISY = noisyPath(W, H, 40, 120, 3);
const SINE = sinePath(W, H, 6, 26, 120);
const KEY = "cc-intro";

/**
 * 00 · Intro (≤ 1,2 s): la onda se dibuja, se limpia en un seno y sube el nombre.
 * Overlay sobre el hero ya renderizado (nunca un muro). Se salta en visitas
 * repetidas, deep links y reduced motion (lo decide el script del <head>).
 */
export function Intro() {
  const [done, setDone] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const wave = useRef<SVGPathElement>(null);
  const name = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const html = document.documentElement;
    const finish = () => {
      try {
        sessionStorage.setItem(KEY, "1");
      } catch {
        /* sin storage */
      }
      html.classList.remove("intro-on");
      useUI.getState().setIntroPlaying(false);
      dispatchReveal();
      setDone(true);
    };
    // Si el JS llegó tarde, el respaldo CSS ya lo ocultó.
    if (!html.classList.contains("intro-on") || !html.classList.contains("js-motion") || performance.now() > 2000) {
      finish();
      return;
    }
    root.current?.classList.add("intro--js");
    useUI.getState().setIntroPlaying(true);

    const tl = gsap.timeline({ onComplete: finish });
    tl.fromTo(wave.current, { drawSVG: "0%" }, { drawSVG: "100%", duration: 0.4, ease: gsapEase.inOut }, 0)
      .to(wave.current, { ...morph(SINE), duration: 0.4, ease: gsapEase.outSoft }, 0.25)
      .call(() => audio()?.needleDrop(), undefined, 0.3)
      .fromTo(name.current, { yPercent: 110 }, { yPercent: 0, duration: 0.5, ease: gsapEase.out }, 0.35)
      .call(() => dispatchReveal(), undefined, 0.8)
      .to(root.current, { opacity: 0, duration: dur.base + 0.03, ease: gsapEase.inOut }, introMax - 0.35);

    // Cualquier entrada → termina en ≤ 250 ms
    let skipped = false;
    const skip = () => {
      if (skipped) return;
      skipped = true;
      const remaining = tl.duration() - tl.time();
      if (remaining > 0.25) tl.timeScale(remaining / 0.25);
    };
    const evs: (keyof WindowEventMap)[] = ["pointerdown", "keydown", "wheel", "touchstart", "scroll"];
    evs.forEach((e) => window.addEventListener(e, skip, { passive: true }));
    return () => {
      evs.forEach((e) => window.removeEventListener(e, skip));
      tl.kill();
    };
  }, []);

  if (done) return null;
  return (
    <div ref={root} className="intro" data-surface="dark" aria-hidden="true">
      <svg className="intro__wave" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none">
        <path ref={wave} d={NOISY} />
      </svg>
      <p className="intro__name">
        <span ref={name}>{person.name}</span>
      </p>
    </div>
  );
}
