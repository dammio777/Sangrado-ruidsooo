import { gsap, ScrollTrigger, SplitText } from "./gsap";
import { MQ, motionOK } from "./env";

/**
 * Entradas declarativas: data-reveal="up|lines|chars|clip|circle|draw".
 * data-reveal-group="hero" espera al evento `cc:reveal` (fin del intro).
 * Estados iniciales ocultos solo bajo html.js-motion (CSS).
 */
export function initReveals() {
  if (!motionOK()) return () => {};
  const mm = gsap.matchMedia();
  mm.add({ isDesktop: "(min-width: 1024px)", isMobile: MQ.isMobile }, (ctx) => {
    const dist = ctx.conditions?.isDesktop ? 28 : 16;
    const heroTl = gsap.timeline({ paused: true });
    const els = gsap.utils.toArray<HTMLElement>("[data-reveal]");

    const setup = (el: HTMLElement) => {
      const kind = el.dataset.reveal;
      const delay = Number(el.dataset.delay ?? 0);
      const isHero = el.dataset.revealGroup === "hero";
      const st = isHero ? undefined : { trigger: el, start: el.dataset.start ?? "top 85%", once: true };
      const attach = (tw: gsap.core.Animation) => {
        if (isHero) heroTl.add(tw, delay);
        return tw;
      };
      const d = isHero ? 0 : delay;

      switch (kind) {
        case "up":
          attach(
            gsap.fromTo(
              el,
              { y: dist, autoAlpha: 0 },
              { y: 0, autoAlpha: 1, duration: 0.9, ease: "expo.out", delay: d, scrollTrigger: st, clearProps: "transform" },
            ),
          );
          break;
        case "clip": {
          const inner = el.querySelector(":scope > *");
          const tl = gsap.timeline({ delay: d, scrollTrigger: st });
          tl.fromTo(el, { clipPath: "inset(100% 0% 0% 0%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: 1, ease: "expo.out" });
          if (inner) tl.fromTo(inner, { scale: 1.12 }, { scale: 1, duration: 1, ease: "expo.out" }, 0);
          attach(tl);
          break;
        }
        case "circle":
          attach(
            gsap.fromTo(
              el,
              { clipPath: "circle(0% at 50% 50%)" },
              { clipPath: "circle(50% at 50% 50%)", duration: 1.1, ease: "expo.out", delay: d, scrollTrigger: st },
            ),
          );
          break;
        case "draw": {
          const paths = el.querySelectorAll("path,circle,line,polyline");
          gsap.set(el, { autoAlpha: 1 });
          attach(
            gsap.fromTo(
              paths,
              { drawSVG: "0%" },
              { drawSVG: "100%", duration: 1.4, ease: "power2.inOut", stagger: 0.08, delay: d, scrollTrigger: st },
            ),
          );
          break;
        }
        case "lines":
        case "chars": {
          const type = kind === "chars" ? "chars,lines" : "lines";
          SplitText.create(el, {
            type,
            mask: kind === "chars" ? "lines" : "lines",
            autoSplit: true,
            aria: "none",
            linesClass: "split-line",
            onSplit(self) {
              gsap.set(el, { autoAlpha: 1 });
              const targets = kind === "chars" ? self.chars : self.lines;
              const tw = gsap.from(targets, {
                yPercent: 110,
                duration: 1,
                ease: "expo.out",
                stagger: kind === "chars" ? 0.025 : 0.08,
                delay: d,
                scrollTrigger: st,
              });
              if (isHero) heroTl.add(tw, delay);
              return tw;
            },
          });
          break;
        }
      }
    };
    // el hero primero; el resto en tareas cortas cuando el hilo queda libre (menos TBT)
    const hero = els.filter((e) => e.dataset.revealGroup === "hero");
    const rest = els.filter((e) => e.dataset.revealGroup !== "hero");
    hero.forEach(setup);
    let i = 0;
    let cancelled = false;
    const idle = (cb: () => void) =>
      "requestIdleCallback" in window ? window.requestIdleCallback(cb, { timeout: 600 }) : globalThis.setTimeout(cb, 16);
    const pump = () => {
      if (cancelled) return;
      const t0 = performance.now();
      while (i < rest.length && performance.now() - t0 < 12) ctx.add(() => setup(rest[i++]!));
      if (i < rest.length) idle(pump);
      else ScrollTrigger.refresh();
    };
    idle(pump);

    const play = () => heroTl.play();
    if (document.documentElement.dataset.revealed === "1") play();
    else window.addEventListener("cc:reveal", play, { once: true });
    return () => {
      cancelled = true;
      window.removeEventListener("cc:reveal", play);
    };
  });
  return () => mm.revert();
}

export function dispatchReveal() {
  if (document.documentElement.dataset.revealed === "1") return;
  document.documentElement.dataset.revealed = "1";
  window.dispatchEvent(new Event("cc:reveal"));
}

export function refreshAfterFonts() {
  const refresh = () => ScrollTrigger.refresh();
  if (document.fonts?.ready) void document.fonts.ready.then(refresh);
  window.addEventListener("load", refresh, { once: true });
}
