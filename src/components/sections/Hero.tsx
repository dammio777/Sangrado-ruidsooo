import { useEffect, useRef, type MouseEvent } from "react";
import { copy, images, person } from "../../config/site";
import { Record } from "../brand/Record";
import { Hairline } from "../brand/Hairline";
import { SiteImg } from "../brand/Placeholder";
import { Button } from "../ui/Button";
import { IconArrowRight, IconWhatsApp } from "../brand/Icons";
import { createSpin } from "../../lib/spin";
import { motionOK } from "../../lib/env";
import { scrollToId } from "../../lib/scroll";
import { waLink } from "../../lib/whatsapp";

export function Hero() {
  const recordWrap = useRef<HTMLDivElement>(null);
  const rec = useRef<HTMLDivElement>(null);

  // `record-spin` (24 s/vuelta); el brillo es fijo: el disco gira debajo
  useEffect(() => {
    const wrap = recordWrap.current;
    const disc = rec.current?.querySelector<SVGSVGElement>(".record__disc");
    if (!wrap || !disc || !motionOK()) return;
    const spinner = createSpin(disc, { watch: wrap });
    return () => spinner.destroy();
  }, []);

  const toB = (e: MouseEvent) => {
    e.preventDefault();
    scrollToId("buen-vivir");
  };

  return (
    <section id="top" className="hero" data-surface="brand" data-nav-surface="brand" aria-labelledby="hero-title">
      <div className="hero__grid container">
        <div className="hero__copy">
          <p className="eyebrow hero__label" data-reveal="up" data-reveal-group="hero">
            {copy.hero.label}
          </p>
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
            <Button href={waLink("¡Hola Cristian! Te escribo desde tu página: quiero hablar de un evento.")} external icon={<IconWhatsApp size={18} />}>
              {copy.hero.primary}
            </Button>
            <Button href="#buen-vivir" variant="secondary" onClick={toB} icon={<IconArrowRight />}>
              {copy.hero.secondary}
            </Button>
          </div>
        </div>

        <div className="hero__media">
          <div ref={recordWrap} className="hero__record" data-hero-record>
            <Record ref={rec} />
          </div>
          <div className="hero__portrait" data-reveal="circle" data-reveal-group="hero" data-delay="0.15">
            <SiteImg image={images.retrato} round priority />
          </div>
        </div>
      </div>
      <div className="hero__line">
        <Hairline mode="draw" group="hero" />
      </div>
    </section>
  );
}
