import { lazy, Suspense, useCallback, useEffect, useRef, useState } from "react";
import { gsap } from "../../lib/gsap";
import { copy, services } from "../../config/site";
import { useUI } from "../../lib/store";
import { Record } from "../brand/Record";
import { MiniWaveform } from "../brand/Waveform";
import { Button } from "../ui/Button";
import { IconArrowRight, IconWhatsApp } from "../brand/Icons";
import { createSpin } from "../../lib/spin";
import { motionOK } from "../../lib/env";
import { dur, gsapEase } from "../../lib/motion";
import { tick } from "../../lib/sound";
import { waLink } from "../../lib/whatsapp";

const Sheet = lazy(() => import("../ui/Sheet"));
const preloadSheet = () => void import("../ui/Sheet");

/** 05 · Lo que hace — tracklist A1–A5 con disco sticky (CSS). */
export function Services() {
  const sheetId = useUI((s) => s.sheet);
  const openSheet = useUI((s) => s.openSheet);
  const closeSheet = useUI((s) => s.closeSheet);
  const [active, setActive] = useState(0);
  const recWrap = useRef<HTMLDivElement>(null);
  const center = useRef<SVGTextElement | null>(null);

  useEffect(() => {
    const wrap = recWrap.current;
    if (!wrap) return;
    center.current = wrap.querySelector<SVGTextElement>(".record__center");
    if (!motionOK()) return;
    const disc = wrap.querySelector<SVGSVGElement>(".record__disc")!;
    const spinner = createSpin(disc, { watch: wrap });
    return () => spinner.destroy();
  }, []);

  // tema activo → el número del label cambia con `fade-through`
  const first = useRef(true);
  useEffect(() => {
    const el = center.current;
    if (!el) return;
    const id = services[active]!.id;
    if (first.current || !motionOK()) {
      first.current = false;
      el.textContent = id;
      return;
    }
    const tl = gsap
      .timeline()
      .to(el, { opacity: 0, duration: dur.fast, ease: gsapEase.inOut })
      .call(() => void (el.textContent = id))
      .to(el, { opacity: 1, duration: dur.base, ease: gsapEase.outSoft });
    return () => {
      tl.kill();
      el.textContent = id;
      el.style.opacity = "";
    };
  }, [active]);

  const activate = (i: number) => {
    if (i !== active) {
      setActive(i);
      tick(1 + i * 0.08);
    }
  };

  const found = services.find((s) => s.id === sheetId);
  const last = useRef(found);
  if (found) last.current = found;
  const current = last.current;
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    if (sheetId) setMounted(true);
  }, [sheetId]);
  const close = useCallback(() => closeSheet(), [closeSheet]);

  return (
    <section id="lo-que-hace" className="services section" data-surface="brand" data-nav-surface="brand" aria-labelledby="services-title">
      <div className="container">
        <header className="section-head">
          <h2 id="services-title" className="heading" data-reveal="lines" data-focus-target>
            {copy.services.heading}
          </h2>
          <span className="eyebrow" data-reveal="up" data-delay="0.1">
            {copy.services.label}
          </span>
        </header>
        <div className="services__grid">
          <div className="services__deck" aria-hidden="true">
            <div className="services__sticky">
              <div ref={recWrap} className="services__record">
                <Record ring="LADO A · LO QUE HACE · CINCO TEMAS · HI-FI · " center="A1" sheen={false} grooveCount={22} />
              </div>
              <p className="mono services__now">
                <span className="services__now-dot" /> {services[active]!.id} · {services[active]!.title.toUpperCase()}
              </p>
            </div>
          </div>
          <ol className="tracklist">
            {services.map((s, i) => (
              <li key={s.id} className="tracklist__item" data-reveal="up" data-delay={String(i * 0.06)}>
                <button
                  type="button"
                  className={`track ${i === active ? "is-active" : ""}`}
                  onPointerEnter={() => {
                    activate(i);
                    preloadSheet();
                  }}
                  onFocus={() => activate(i)}
                  onClick={() => openSheet(s.id)}
                  aria-haspopup="dialog"
                  data-pending={s.pending.join(" · ")}
                >
                  <span className="track__no mono">{s.id}</span>
                  <span className="track__title">{s.title}</span>
                  <span className="track__line">{s.line}</span>
                  <span className="track__wave">
                    <MiniWaveform seed={i + 1} />
                  </span>
                  <span className="track__open" aria-hidden="true">
                    <IconArrowRight />
                  </span>
                </button>
              </li>
            ))}
          </ol>
        </div>
      </div>
      {mounted && (
        <Suspense fallback={null}>
          <Sheet open={!!found} onClose={close} labelledBy="sheet-title">
            {current && (
              <div className="detail">
                <span className="eyebrow">
                  {current.id} · {copy.services.label.split(" · ")[0]}
                </span>
                <h3 id="sheet-title" className="subheading detail__title">
                  {current.title}
                </h3>
                <p className="lead detail__line">{current.line}</p>
                <hr className="rule" />
                <p className="mono detail__inc">{copy.services.included}</p>
                <ul className="detail__list" data-pending={current.pending.join(" · ")}>
                  {current.details.map((d) => (
                    <li key={d}>{d}</li>
                  ))}
                </ul>
                <div className="detail__cta">
                  <Button href={waLink(current.whatsappText)} external icon={<IconWhatsApp size={18} />}>
                    {copy.services.cta}
                  </Button>
                </div>
              </div>
            )}
          </Sheet>
        </Suspense>
      )}
    </section>
  );
}

