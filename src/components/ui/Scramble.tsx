import { createElement, useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "../../lib/gsap";
import { motionOK } from "../../lib/env";
import { scrambleChars } from "../../lib/motion";

type Trigger = "scroll" | "hero" | "hover" | "manual";

export function staticGlyphs(text: string) {
  let out = "";
  for (let i = 0; i < text.length; i++) {
    const c = text[i]!;
    out += c === " " ? " " : scrambleChars[(i * 7 + 3) % scrambleChars.length];
  }
  return out;
}

/**
 * `signal-scramble`: el texto llega como estática y sintoniza.
 * El texto real queda en el DOM (sr-only); los fragmentos visibles son aria-hidden.
 */
export function Scramble({
  text,
  as = "span",
  className = "",
  trigger = "scroll",
  duration = 0.9,
  delay = 0,
}: {
  text: string;
  as?: "span" | "p" | "div";
  className?: string;
  trigger?: Trigger;
  duration?: number;
  delay?: number;
}) {
  const vis = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = vis.current;
    if (!el) return;
    const run = (d = duration, dl = delay) =>
      gsap.to(el, {
        duration: d,
        delay: dl,
        ease: "none",
        scrambleText: { text, chars: scrambleChars, revealDelay: 0.25, speed: 0.6 },
      });
    if (trigger === "hover") {
      const host = el.closest("a,button") ?? el;
      let tw: gsap.core.Tween | null = null;
      const enter = () => {
        if (!motionOK()) return;
        tw?.kill();
        tw = run(0.7, 0);
      };
      host.addEventListener("pointerenter", enter);
      host.addEventListener("focus", enter);
      return () => {
        host.removeEventListener("pointerenter", enter);
        host.removeEventListener("focus", enter);
        tw?.kill();
      };
    }
    if (!motionOK()) return;
    el.textContent = staticGlyphs(text);
    el.classList.add("is-static");
    let st: ScrollTrigger | null = null;
    let tw: gsap.core.Tween | null = null;
    const go = () => {
      el.classList.remove("is-static");
      tw = run();
    };
    if (trigger === "scroll") {
      st = ScrollTrigger.create({ trigger: el, start: "top 90%", once: true, onEnter: go });
    } else if (trigger === "hero") {
      const h = () => go();
      window.addEventListener("cc:reveal", h, { once: true });
      if (document.documentElement.dataset.revealed === "1") go();
      return () => {
        window.removeEventListener("cc:reveal", h);
        tw?.kill();
      };
    } else {
      const h = () => go();
      el.addEventListener("cc:scramble", h);
      return () => el.removeEventListener("cc:scramble", h);
    }
    return () => {
      st?.kill();
      tw?.kill();
    };
  }, [text, trigger, duration, delay]);

  return createElement(
    as,
    { className: `scr ${className}` },
    <span className="sr-only">{text}</span>,
    <span ref={vis} className="scr__vis" aria-hidden="true">
      {text}
    </span>,
  );
}
