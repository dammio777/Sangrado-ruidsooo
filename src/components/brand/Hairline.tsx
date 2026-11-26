import { useEffect, useRef } from "react";
import { gsap, loadMorph, morph } from "../../lib/gsap";
import { motionOK } from "../../lib/env";
import { dur, gsapEase } from "../../lib/motion";
import { noisyPath, sinePath } from "../../lib/signal";

const W = 1440;
const H = 80;
const CLEAN = sinePath(W, H, 5, 16, 160);
const NOISY = noisyPath(W, H, 26, 160, 4);

/**
 * Hairline SVG de onda (reemplaza osciloscopio/VU).
 * `draw`: se dibuja al entrar (`draw-line`). `clarity`: pasa de ruidosa a seno limpio con el scroll.
 */
export function Hairline({ mode = "draw", className = "", group }: { mode?: "draw" | "clarity"; className?: string; group?: "hero" }) {
  const path = useRef<SVGPathElement>(null);
  const root = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const el = path.current;
    if (!el || !motionOK()) return;
    if (mode === "draw") {
      const tw = gsap.fromTo(
        el,
        { drawSVG: "0%" },
        { drawSVG: "100%", duration: 1.4, ease: gsapEase.inOut, paused: true, scrollTrigger: group ? undefined : { trigger: root.current, start: "top 90%", once: true } },
      );
      const play = () => tw.play();
      if (group === "hero") {
        if (document.documentElement.dataset.revealed === "1") play();
        else window.addEventListener("cc:reveal", play, { once: true });
      } else tw.play();
      return () => {
        window.removeEventListener("cc:reveal", play);
        tw.scrollTrigger?.kill();
        tw.kill();
      };
    }
    let tw: gsap.core.Tween | null = null;
    let dead = false;
    void loadMorph().then(() => {
      if (dead) return;
      tw = gsap.fromTo(el, { ...morph(NOISY), opacity: 0.35 }, {
        ...morph(CLEAN),
        opacity: 1,
        ease: "none",
        duration: dur.reveal,
        scrollTrigger: { trigger: root.current, start: "top 85%", end: "bottom 40%", scrub: true },
      });
    });
    return () => {
      dead = true;
      tw?.scrollTrigger?.kill();
      tw?.kill();
    };
  }, [mode, group]);

  return (
    <svg ref={root} className={`hairline ${className}`} viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" aria-hidden="true" focusable="false">
      <path ref={path} d={CLEAN} />
    </svg>
  );
}
