import { useEffect, useRef, type MouseEvent } from "react";
import { gsap } from "../../lib/gsap";
import { copy, images, person } from "../../config/site";
import { Record } from "../brand/Record";
import { Tonearm } from "../brand/Tonearm";
import { Oscilloscope } from "../brand/Oscilloscope";
import { SiteImg } from "../brand/Placeholder";
import { Button } from "../ui/Button";
import { Scramble } from "../ui/Scramble";
import { IconArrowRight, IconWhatsApp } from "../brand/Icons";
import { attachScratch, createSpin, spinners } from "../../lib/spin";
import { matches, MQ, motionOK } from "../../lib/env";
import { scrollToId } from "../../lib/scroll";
import { waLink } from "../../lib/whatsapp";

export function Hero() {
  const recordWrap = useRef<HTMLDivElement>(null);
  const rec = useRef<HTMLDivElement>(null);
  const arm = useRef<SVGGElement>(null);

  useEffect(() => {
    const wrap = recordWrap.current;
    const disc = rec.current?.querySelector<SVGSVGElement>(".record__disc");
    const sheen = rec.current?.querySelector<HTMLElement>(".record__sheen");
    if (!wrap || !disc || !motionOK()) return;
    const spinner = createSpin(disc, { watch: wrap });
    spinners.hero = spinner;
    const offScratch = matches(MQ.isDesktop) ? attachScratch(wrap, spinner) : () => {};
    gsap.set(arm.current, { svgOrigin: "96 36", rotation: -24 });
    const armIn = gsap.to(arm.current, { rotation: -15, duration: 1.2, ease: "power3.inOut", delay: 0.6, paused: true });
    const onReveal = () => armIn.play();
    if (document.documentElement.dataset.revealed === "1") armIn.play();
    else window.addEventListener("cc:reveal", onReveal, { once: true });

    // brillo cónico: sigue el ángulo del cursor (el disco gira debajo; el brillo no)
    let offSheen = () => {};
    if (sheen && matches(MQ.isDesktop)) {
      const rot = gsap.quickTo(sheen, "rotation", { duration: 0.6, ease: "power3.out" });
      let last = 0;
      const move = (e: PointerEvent) => {
        const r = wrap.getBoundingClientRect();
        let a = (Math.atan2(e.clientY - (r.top + r.height / 2), e.clientX - (r.left + r.width / 2)) * 180) / Math.PI + 90;
        // ángulo continuo (sin saltos de 360°)
        while (a - last > 180) a -= 360;
        while (a - last < -180) a += 360;
        last = a;
        rot(a);
      };
      window.addEventListener("pointermove", move, { passive: true });
      offSheen = () => window.removeEventListener("pointermove", move);
    }
    return () => {
      spinner.destroy();
      delete spinners.hero;
      offScratch();
      offSheen();
      armIn.kill();
      window.removeEventListener("cc:reveal", onReveal);
    };
  }, []);

  const toB = (e: MouseEvent) => {
    e.preventDefault();
    scrollToId("buen-vivir");
  };

  return (
    <section id="top" className="hero" data-surface="brand" data-nav-surface="brand" aria-labelledby="hero-title">
      <div className="hero__grid container">
        <div className="hero__copy">
          <Scramble text={copy.hero.label} className="eyebrow hero__label" trigger="hero" />
          <h1 id="hero-title" className="hero__title" data-focus-target>
            <span className="hero__name" data-reveal="lines" data-reveal-group="hero" data-delay="0.05">
              {person.name}
            </span>
            <span className="hero__accent-wrap">
              <span className="hero__accent" data-reveal="lines" data-reveal-group="hero" data-delay="0.2">
                {copy.hero.accent}
              </span>
              <span className="hero__foot mono" data-reveal="up" data-reveal-group="hero" data-delay="0.45">
                {copy.hero.footnote}
              </span>
            </span>
          </h1>
          <p className="lead hero__lead" data-reveal="up" data-reveal-group="hero" data-delay="0.4" data-pending="Lead del hero [AJUSTAR]">
            {copy.hero.lead}
          </p>
          <div className="hero__ctas" data-reveal="up" data-reveal-group="hero" data-delay="0.55">
            <Button href={waLink("¡Hola Cristian! Te escribo desde tu página: quiero hablar de un evento.")} external magnetic icon={<IconWhatsApp size={18} />}>
              {copy.hero.primary}
            </Button>
            <Button href="#buen-vivir" variant="secondary" onClick={toB} icon={<IconArrowRight />}>
              {copy.hero.secondary}
            </Button>
          </div>
        </div>

        <div className="hero__media">
          <div ref={recordWrap} className="hero__record" data-hero-record data-cursor="record">
            <Record ref={rec} ring="CRISTIAN CALLE · HI-FI · LADO A · 33⅓ RPM · CC-001 · " />
            <Tonearm ref={arm} className="hero__arm" />
          </div>
          <div className="hero__portrait" data-reveal="circle" data-reveal-group="hero" data-delay="0.15">
            <SiteImg image={images.retrato} round priority />
          </div>
          <span className="hero__catalog mono" aria-hidden="true">
            33⅓ RPM · STEREO
          </span>
        </div>
      </div>
      <div className="hero__osc">
        <Oscilloscope height={110} />
      </div>
    </section>
  );
}
