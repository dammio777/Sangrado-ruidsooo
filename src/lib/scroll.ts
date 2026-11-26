import type Lenis from "lenis";
import { gsap, ScrollTrigger } from "./gsap";
import { MQ, NAV_OFFSET, matches } from "./env";
import { live } from "./live";

let lenis: Lenis | null = null;

/** Lenis solo en escritorio (puntero fino). Scroll nativo en táctil. */
export function initScroll() {
  if (matches(MQ.isDesktop) && !matches(MQ.reduceMotion)) {
    void import("lenis").then(({ default: L }) => {
      lenis = new L({ duration: 1.0, smoothWheel: true, syncTouch: false });
      lenis.on("scroll", ScrollTrigger.update);
      gsap.ticker.add((time: number) => lenis?.raf(time * 1000));
      gsap.ticker.lagSmoothing(0);
    });
  }
  // trigger global: velocidad + progreso
  ScrollTrigger.create({
    start: 0,
    end: "max",
    onUpdate: (self) => {
      live.velocity = self.getVelocity();
      live.progress = self.progress;
    },
  });
}

export function getLenis() {
  return lenis;
}

export function stopScroll() {
  lenis?.stop();
}
export function startScroll() {
  lenis?.start();
}

/** Scroll suave a un ancla con offset de la barra; mueve el foco al encabezado. */
export function scrollToId(id: string, opts: { focus?: boolean; updateHash?: boolean } = {}) {
  const el = document.getElementById(id);
  if (!el) return;
  const reduce = matches(MQ.reduceMotion);
  const done = () => {
    if (opts.focus !== false) {
      const heading = el.querySelector<HTMLElement>("[data-focus-target]") ?? el;
      if (!heading.hasAttribute("tabindex")) heading.setAttribute("tabindex", "-1");
      heading.focus({ preventScroll: true });
    }
  };
  if (opts.updateHash !== false) history.pushState(null, "", `#${id}`);
  if (lenis) {
    lenis.scrollTo(el, { offset: -NAV_OFFSET + 1, duration: 1.2, onComplete: done });
  } else {
    const top = el.getBoundingClientRect().top + window.scrollY - NAV_OFFSET + 1;
    window.scrollTo({ top, behavior: reduce ? "auto" : "smooth" });
    window.setTimeout(done, reduce ? 0 : 700);
  }
}

export function scrollToTop(onComplete?: () => void) {
  const reduce = matches(MQ.reduceMotion);
  history.pushState(null, "", location.pathname + location.search);
  if (lenis) lenis.scrollTo(0, { duration: 1.6, onComplete });
  else {
    window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
    window.setTimeout(() => onComplete?.(), 900);
  }
}
