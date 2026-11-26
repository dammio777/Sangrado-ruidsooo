import { useEffect, useRef } from "react";
import { gsap, loadMorph, morph } from "../../lib/gsap";
import { copy } from "../../config/site";
import { Record } from "../brand/Record";
import { Scramble } from "../ui/Scramble";
import { MQ, motionOK } from "../../lib/env";
import { createSpin } from "../../lib/spin";
import { ridgePath, sinePath } from "../../lib/signal";
import { setMood } from "../../lib/mood";

const W = 1440;
const H = 220;
const WAVE = sinePath(W, H, 6, 34, 140, 0.4);
const RIDGE = ridgePath(W, H, 140);

/**
 * 07 · El disco se voltea. Sin pin: sección de ~140svh con el disco `sticky`.
 * rotateY 0→180° (label A→B a los 90°), mood vino→crema, los surcos se van
 * y el label crece hasta ser el sol; la onda se vuelve la cresta de la montaña.
 */
export function FlipSection() {
  const root = useRef<HTMLElement>(null);
  const disc = useRef<HTMLDivElement>(null);
  const faceA = useRef<HTMLDivElement>(null);
  const faceB = useRef<HTMLDivElement>(null);
  const line = useRef<SVGPathElement>(null);

  useEffect(() => {
    if (!motionOK() || !root.current) return;
    const recA = faceA.current!.querySelector<SVGSVGElement>(".record__disc")!;
    const spinner = createSpin(recA, { watch: root.current, boost: true });
    const moodProxy = { v: 0 };
    const mm = gsap.matchMedia();
    mm.add({ desktop: "(min-width: 1024px)", mobile: MQ.isMobile }, (ctx) => {
      const desktop = !!ctx.conditions?.desktop;
      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: { trigger: root.current, start: "top 75%", end: "bottom 60%", scrub: 0.6 },
      });
      if (desktop) {
        tl.fromTo(disc.current, { rotateY: 0 }, { rotateY: 180, duration: 0.5, ease: "power2.inOut" }, 0.05);
      } else {
        // móvil: flip 2D simplificado (scaleX) con cambio de cara a la mitad
        tl.fromTo(faceA.current, { scaleX: 1 }, { scaleX: 0, duration: 0.25, ease: "power2.in" }, 0.05)
          .set(faceA.current, { autoAlpha: 0 }, 0.3)
          .fromTo(faceB.current, { scaleX: 0, autoAlpha: 0 }, { scaleX: 1, autoAlpha: 1, duration: 0.25, ease: "power2.out", immediateRender: false }, 0.3);
      }
      tl.fromTo(moodProxy, { v: 0 }, { v: 1, duration: 0.5, onUpdate: () => setMood("flip", moodProxy.v) }, 0.2);
      const css = getComputedStyle(document.documentElement);
      tl.fromTo(
        ".flip__caption",
        { color: css.getPropertyValue("--c-accent").trim() },
        { color: css.getPropertyValue("--c-brand").trim(), duration: 0.3 },
        0.3,
      );
      tl.fromTo(".flip__b-grooves", { opacity: 1 }, { opacity: 0, duration: 0.3 }, 0.5)
        .fromTo(".flip__sun", { scale: 0.37, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.35, ease: "power2.out" }, 0.5)
        .to(".flip__sun", { opacity: 0, yPercent: -12, duration: 0.15, ease: "power1.in" }, 0.9)
        .fromTo(".flip__ridge-fill", { opacity: 0 }, { opacity: 1, duration: 0.3 }, 0.62);
      void loadMorph().then(() => {
        tl.fromTo(line.current, morph(WAVE), { ...morph(RIDGE), duration: 0.5, ease: "power2.inOut" }, 0.4);
      });
    }, root);
    return () => {
      spinner.destroy();
      mm.revert();
    };
  }, []);

  return (
    <section ref={root} className="flip" aria-labelledby="flip-title">
      <h2 id="flip-title" className="sr-only">
        Lado B
      </h2>
      <div className="flip__sticky">
        <Scramble text={copy.flip.caption} className="eyebrow flip__caption" />
        <div className="flip__stage" aria-hidden="true">
          <div ref={disc} className="flip__disc">
            <div ref={faceA} className="flip__face flip__face--a">
              <Record ring={`${copy.flip.sideA} · 33⅓ RPM · CRISTIAN CALLE · `} center="A" sheen={false} />
            </div>
            <div ref={faceB} className="flip__face flip__face--b">
              <Record ring={`${copy.flip.sideB} · 33⅓ RPM · CRISTIAN CALLE · `} center="B" sheen={false} className="flip__b-grooves" />
              <div className="flip__sun" />
            </div>
          </div>
        </div>
        <p className="flip__static-label mono" aria-hidden="true">
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
