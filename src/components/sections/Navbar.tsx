import { useEffect, useRef, type MouseEvent } from "react";
import { gsap, ScrollTrigger } from "../../lib/gsap";
import { copy, nav, person, site } from "../../config/site";
import { useUI } from "../../lib/store";
import { scrollToId } from "../../lib/scroll";
import { addTick } from "../../lib/ticker";
import { createSpin } from "../../lib/spin";
import { live } from "../../lib/live";
import { motionOK } from "../../lib/env";
import { useFocusTrap, useScrollLock } from "../../lib/a11y";
import { waHref } from "../../lib/whatsapp";
import { Record } from "../brand/Record";
import { SoundToggle } from "../ui/SoundToggle";
import { IconInstagram, IconWhatsApp } from "../brand/Icons";

const RING = 2 * Math.PI * 15;

export function Navbar() {
  const bar = useRef<HTMLElement>(null);
  const mark = useRef<HTMLSpanElement>(null);
  const ring = useRef<SVGCircleElement>(null);
  const menu = useRef<HTMLDivElement>(null);
  const surface = useUI((s) => s.navSurface);
  const active = useUI((s) => s.activeNav);
  const open = useUI((s) => s.menuOpen);
  const setMenu = useUI((s) => s.setMenu);

  const closeMenu = () => setMenu(false);
  useFocusTrap(menu, open, closeMenu);
  useScrollLock(open);

  // marca: `record-spin` (24 s/vuelta, empuje ≤ ×2) + anillo de progreso
  useEffect(() => {
    const disc = mark.current?.querySelector<SVGSVGElement>(".record__disc");
    const spinner = disc && motionOK() ? createSpin(disc) : null;
    const off = addTick(() => {
      if (ring.current) ring.current.style.strokeDashoffset = String(RING * (1 - live.progress));
    });
    return () => {
      off();
      spinner?.destroy();
    };
  }, []);

  // superficie bajo la barra + sección activa + ocultar en scroll rápido hacia abajo
  useEffect(() => {
    const ui = useUI.getState();
    const meta = document.querySelector('meta[name="theme-color"]');
    const sections = gsap.utils.toArray<HTMLElement>("[data-nav-surface]");
    const triggers = sections.map((sec) =>
      ScrollTrigger.create({
        trigger: sec,
        start: "top 28px",
        end: "bottom 28px",
        onToggle: (self) => {
          if (!self.isActive) return;
          const s = sec.dataset.navSurface === "light" ? "light" : "brand";
          ui.setNavSurface(s);
          document.documentElement.dataset.mood = s;
          meta?.setAttribute("content", s === "light" ? site.themeLight : site.themeBrand);
        },
      }),
    );
    const navTriggers = nav.map((n) =>
      ScrollTrigger.create({
        trigger: `#${n.id}`,
        start: "top 50%",
        end: "bottom 50%",
        onToggle: (self) => {
          if (self.isActive) ui.setActiveNav(n.id);
          else if (useUI.getState().activeNav === n.id) ui.setActiveNav(null);
        },
      }),
    );
    const hide = ScrollTrigger.create({
      start: 120,
      end: "max",
      onUpdate: (self) => {
        const el = bar.current;
        if (!el) return;
        el.classList.toggle("is-compact", self.scroll() > 40);
        if (useUI.getState().menuOpen) return;
        if (self.direction === 1 && self.getVelocity() > 900) el.classList.add("is-hidden");
        else if (self.direction === -1) el.classList.remove("is-hidden");
      },
      onLeaveBack: () => bar.current?.classList.remove("is-hidden", "is-compact"),
    });
    return () => {
      triggers.forEach((t) => t.kill());
      navTriggers.forEach((t) => t.kill());
      hide.kill();
    };
  }, []);

  const go = (id: string) => (e: MouseEvent) => {
    e.preventDefault();
    setMenu(false);
    scrollToId(id);
  };

  return (
    <>
      <header ref={bar} className="nav" data-surface={surface} data-menu={open ? "open" : undefined}>
        <span className="nav__bg nav__bg--brand" aria-hidden="true" />
        <span className="nav__bg nav__bg--light" aria-hidden="true" />
        <div className="nav__inner">
          <a href="#top" className="nav__brand" onClick={go("top")} aria-label={copy.a11y.home}>
            <span ref={mark} className="nav__mark">
              <Record variant="mini" sheen={false} />
              <svg className="nav__ring" viewBox="0 0 34 34" aria-hidden="true">
                <circle cx="17" cy="17" r="15" className="nav__ring-track" />
                <circle ref={ring} cx="17" cy="17" r="15" className="nav__ring-bar" strokeDasharray={RING} strokeDashoffset={RING} />
              </svg>
            </span>
            <span className="nav__word">{person.name}</span>
          </a>
          <nav className="nav__links" aria-label={copy.a11y.mainNav}>
            <ul>
              {nav.map((n) => (
                <li key={n.id}>
                  <a href={`#${n.id}`} onClick={go(n.id)} aria-current={active === n.id ? "location" : undefined}>
                    {n.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          <div className="nav__right">
            <SoundToggle />
            <a href="#contacto" className="nav__cta" onClick={go("contacto")}>
              {copy.navCta}
            </a>
            <button
              type="button"
              className="nav__burger icon-btn"
              aria-expanded={open}
              aria-controls="menu"
              aria-label={open ? copy.menu.close : copy.menu.open}
              onClick={() => setMenu(!open)}
            >
              <span />
              <span />
            </button>
          </div>
        </div>
      </header>

      <div
        id="menu"
        ref={menu}
        className={`menu ${open ? "is-open" : ""}`}
        data-surface="brand"
        role="dialog"
        aria-modal="true"
        aria-label={copy.a11y.menu}
        inert={!open}
      >
        <div className="menu__inner">
          <span className="mono menu__eyebrow">CC-001 · TRACKLIST</span>
          <ol className="menu__list">
            {nav.map((n, i) => (
              <li key={n.id} style={{ "--i": i } as React.CSSProperties}>
                <a href={`#${n.id}`} onClick={go(n.id)}>
                  <span className="mono menu__track">{n.track}</span>
                  <span className="menu__label">
                    <span>{n.label}</span>
                  </span>
                </a>
              </li>
            ))}
          </ol>
          <div className="menu__foot">
            <SoundToggle />
            <div className="menu__social">
              <a href={person.instagram.url} target="_blank" rel="noopener" className="icon-btn" aria-label={`${copy.a11y.instagram} ${person.instagram.handle}`}>
                <IconInstagram />
              </a>
              <a href={waHref()} className="icon-btn" aria-label={copy.a11y.whatsapp} onClick={person.whatsapp ? undefined : go("contacto")}>
                <IconWhatsApp />
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
