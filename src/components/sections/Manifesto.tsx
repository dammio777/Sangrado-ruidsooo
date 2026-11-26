import { useEffect, useRef } from "react";
import { gsap, loadMorph, morph, SplitText } from "../../lib/gsap";
import { copy } from "../../config/site";
import { Scramble } from "../ui/Scramble";
import { VuMeter } from "../brand/VuMeter";
import { motionOK } from "../../lib/env";
import { noisyPath, sinePath } from "../../lib/signal";

const W = 1200;
const H = 200;
const NOISY = noisyPath(W, H, 80, 140, 9);
const CLEAN = sinePath(W, H, 4, 54, 140);

/** 04 · Qué es Hi-Fi — `highlight-words` + `noise-to-signal` en el mismo scrub. */
export function Manifesto() {
  const para = useRef<HTMLParagraphElement>(null);
  const block = useRef<HTMLDivElement>(null);
  const grain = useRef<HTMLDivElement>(null);
  const wave = useRef<SVGPathElement>(null);

  useEffect(() => {
    if (!motionOK() || !para.current) return;
    const ctx = gsap.context(() => {
      const split = SplitText.create(para.current!, {
        type: "words",
        wordsClass: "hw",
        aria: "none",
        autoSplit: true,
        onSplit(self) {
          return gsap.fromTo(
            self.words,
            { opacity: 0.18 },
            {
              opacity: 1,
              stagger: 0.1,
              ease: "none",
              scrollTrigger: { trigger: para.current, start: "top 75%", end: "bottom 45%", scrub: true },
            },
          );
        },
      });
      const tl = gsap.timeline({
        scrollTrigger: { trigger: para.current, start: "top 75%", end: "bottom 45%", scrub: true },
      });
      tl.fromTo(grain.current, { opacity: 0.5 }, { opacity: 0, ease: "none" }, 0);
      void loadMorph().then(() => {
        tl.fromTo(wave.current, morph(NOISY), { ...morph(CLEAN), ease: "none" }, 0);
      });
      return () => split.revert();
    }, block);
    return () => ctx.revert();
  }, []);

  return (
    <section id="hifi" className="manifesto section" data-surface="dark" data-nav-surface="brand" aria-labelledby="hifi-title">
      <div className="container manifesto__grid">
        <div ref={block} className="manifesto__main">
          <Scramble text={copy.manifesto.eyebrow} className="eyebrow" />
          <h2 id="hifi-title" className="sr-only" data-focus-target>
            {copy.manifesto.heading}
          </h2>
          <div className="manifesto__body">
            <div className="manifesto__signal" aria-hidden="true">
              <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none">
                <path ref={wave} d={CLEAN} />
              </svg>
              <div ref={grain} className="manifesto__grain" />
            </div>
            <p ref={para} className="manifesto__text" data-pending="Manifiesto [AJUSTAR]">
              {copy.manifesto.body}
            </p>
          </div>
        </div>
        <aside className="manifesto__side" aria-label="Hoja técnica">
          <div className="spec">
            <p className="spec__title mono" data-reveal="up">
              {copy.manifesto.specTitle}
            </p>
            <dl className="spec__list">
              {copy.manifesto.spec.map(([k, v], i) => (
                <div className="spec__row" key={k} data-reveal="up" data-delay={String(i * 0.06)}>
                  <dt className="mono">{k}</dt>
                  <dd>{v}</dd>
                </div>
              ))}
            </dl>
          </div>
          <figure className="manifesto__vu" data-reveal="up" data-delay="0.2">
            <VuMeter label="VU" />
            <figcaption className="mono">{copy.manifesto.vuLabel}</figcaption>
          </figure>
        </aside>
      </div>
    </section>
  );
}
