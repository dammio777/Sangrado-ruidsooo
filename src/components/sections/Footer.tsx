import { useEffect, useRef } from "react";
import { gsap, loadMorph, morph } from "../../lib/gsap";
import { copy, nav, person } from "../../config/site";
import { motionOK } from "../../lib/env";
import { scrollToId, scrollToTop } from "../../lib/scroll";
import { flatPath, sinePath } from "../../lib/signal";
import { waHref } from "../../lib/whatsapp";
import { IconArrowUp, IconInstagram, IconWhatsApp } from "../brand/Icons";

const W = 1440;
const H = 60;
const WAVE = sinePath(W, H, 18, 18, 160);
const FLAT = flatPath(W, H, 160);

/** 10 · Runout groove: nombre gigante ajustado al ancho, la onda se aplana al final. */
export function Footer() {
  const name = useRef<HTMLParagraphElement>(null);
  const wave = useRef<SVGPathElement>(null);
  const root = useRef<HTMLElement>(null);

  // tamaño medido: el nombre ocupa exactamente el ancho
  useEffect(() => {
    const el = name.current;
    if (!el) return;
    const fit = () => {
      const parent = el.parentElement!;
      const avail = parent.clientWidth;
      el.style.fontSize = "100px";
      const w = el.scrollWidth;
      if (w > 0) el.style.fontSize = `${Math.floor((avail / w) * 100 * 0.995 * 100) / 100}px`;
    };
    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(el.parentElement!);
    void document.fonts?.ready.then(fit);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    if (!motionOK()) return;
    let tw: gsap.core.Tween | null = null;
    let dead = false;
    void loadMorph().then(() => {
      if (dead) return;
      tw = gsap.fromTo(wave.current, morph(WAVE), {
        ...morph(FLAT),
        ease: "none",
        scrollTrigger: { trigger: root.current, start: "top 70%", end: "bottom bottom", scrub: 0.5 },
      });
    });
    return () => {
      dead = true;
      tw?.scrollTrigger?.kill();
      tw?.kill();
    };
  }, []);

  const back = () => {
    document.documentElement.classList.add("is-rewinding");
    scrollToTop(() => {
      document.documentElement.classList.remove("is-rewinding");
      document.getElementById("hero-title")?.focus({ preventScroll: true });
    });
  };

  return (
    <footer ref={root} className="footer" data-surface="dark" data-nav-surface="brand">
      <div className="container">
        <div className="footer__name-wrap">
          <p ref={name} className="footer__name" data-reveal="lines" data-start="top 95%" aria-hidden="true">
            {person.name}
          </p>
        </div>
        <svg className="footer__wave" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" aria-hidden="true">
          <path ref={wave} d={WAVE} />
        </svg>
        <div className="footer__grid">
          <nav aria-label="Pie de página" className="footer__nav">
            <ul>
              {nav.map((n) => (
                <li key={n.id}>
                  <a
                    href={`#${n.id}`}
                    onClick={(e) => {
                      e.preventDefault();
                      scrollToId(n.id);
                    }}
                  >
                    <span className="mono">{n.track}</span> {n.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          <div className="footer__social">
            <a href={person.instagram.url} target="_blank" rel="noopener" className="footer__link">
              <IconInstagram size={18} /> {person.instagram.handle}
            </a>
            <a href={waHref()} className="footer__link" {...(person.whatsapp ? { target: "_blank", rel: "noopener" } : {})}>
              <IconWhatsApp size={18} /> WhatsApp
            </a>
          </div>
          <button type="button" className="btn btn--secondary footer__back" onClick={back}>
            <span className="btn__roll">
              <span className="btn__label">{copy.footer.back}</span>
              <span className="btn__label btn__label--dup" aria-hidden="true">
                {copy.footer.back}
              </span>
            </span>
            <IconArrowUp />
          </button>
        </div>
        <div className="footer__base mono">
          <span>{copy.footer.small}</span>
          <span aria-hidden="true">{copy.footer.runout}</span>
        </div>
      </div>
    </footer>
  );
}
