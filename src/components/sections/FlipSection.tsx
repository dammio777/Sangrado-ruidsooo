import { useEffect, useRef } from "react";
import { gsap, loadMorph, morph } from "../../lib/gsap";
import { copy } from "../../config/site";
import { Record } from "../brand/Record";
import { motionOK } from "../../lib/env";
import { gsapEase } from "../../lib/motion";
import { createSpin } from "../../lib/spin";
import { ridgePath, sinePath } from "../../lib/signal";
import { setMood } from "../../lib/mood";

const W = 1440;
const H = 220;
const WAVE = sinePath(W, H, 6, 34, 140, 0.4);
const RIDGE = ridgePath(W, H, 140);

/**
 * 07 · Lado A → Lado B. Sin pin: sección de ~140svh con escenario `sticky` (CSS).
 * `fade-through`: el disco se desvanece mientras el sol crece (`scrub-grow`);
 * el mood cruza vino → crema y la onda se vuelve la cresta de la montaña.
 */
export function FlipSection() {
  const root = useRef<HTMLElement>(null);
  const record = useRef<HTMLDivElement>(null);
  const sun = useRef<HTMLDivElement>(null);
  const line = useRef<SVGPathElement>(null);

  useEffect(() => {
    if (!motionOK() || !root.current) return;
    const disc = record.current!.querySelector<SVGSVGElement>(".record__disc")!;
    const spinner = createSpin(disc, { watch: root.current });
    const moodProxy = { v: 0 };
    const ctx = gsap.context(() => {
      const css = getComputedStyle(document.documentElement);
      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: { trigger: root.current, start: "top 75%", end: "bottom 60%", scrub: 0.6 },
      });
      tl.fromTo(moodProxy, { v: 0 }, { v: 1, duration: 0.5, onUpdate: () => setMood("flip", moodProxy.v) }, 0.2)
        .fromTo(".flip__caption", { color: css.getPropertyValue("--c-brand-soft").trim() }, { color: css.getPropertyValue("--c-brand").trim(), duration: 0.3 }, 0.3)
        .fromTo(record.current, { opacity: 1, scale: 1 }, { opacity: 0, scale: 0.94, duration: 0.3, ease: gsapEase.inOut }, 0.3)
        .fromTo(sun.current, { opacity: 0, scale: 0.37 }, { opacity: 1, scale: 1, duration: 0.45, ease: gsapEase.inOut }, 0.35)
        .to(sun.current, { opacity: 0, duration: 0.15 }, 0.9)
        .fromTo(".flip__ridge-fill", { opacity: 0 }, { opacity: 1, duration: 0.3 }, 0.62);
      void loadMorph().then(() => {
        ctx.add(() => tl.fromTo(line.current, morph(WAVE), { ...morph(RIDGE), duration: 0.5, ease: gsapEase.inOut }, 0.4));
      });
    }, root);
    return () => {
      spinner.destroy();
      ctx.revert();
    };
  }, []);

  return (
    <section ref={root} className="flip" aria-labelledby="flip-title">
      <h2 id="flip-title" className="sr-only">
        {copy.flip.title}
      </h2>
      <div className="flip__sticky">
        <p className="eyebrow flip__caption" data-reveal="up">
          {copy.flip.caption}
        </p>
        <div className="flip__stage" aria-hidden="true">
          <div ref={record} className="flip__layer">
            <Record center="CC" sheen={false} />
          </div>
          <div ref={sun} className="flip__layer flip__sun" />
        </div>
        <p className="flip__static-label" aria-hidden="true">
          {copy.flip.sideB}
        </p>
        <svg className="flip__line" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" aria-hidden="true">
          <path className="flip__ridge-fill" d={`${RIDGE}L${W},${H}L0,${H}Z`} />
          <path ref={line} d={WAVE} />
        </svg>
      </div>
    </section>
  );
}
