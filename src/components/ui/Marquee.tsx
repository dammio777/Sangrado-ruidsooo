import { useEffect, useRef, type ReactNode } from "react";
import { gsap } from "../../lib/gsap";
import { addTick, watchVisible } from "../../lib/ticker";
import { live } from "../../lib/live";
import { motionOK } from "../../lib/env";

/** Pista de marquesina: xPercent continuo + `velocity-skew` (±4°) + empuje por velocidad. */
export function MarqueeRow({ children, speed = 3.2, reverse = false, className = "" }: { children: ReactNode; speed?: number; reverse?: boolean; className?: string }) {
  const track = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = track.current;
    if (!el || !motionOK()) return;
    let x = reverse ? -50 : 0;
    let skew = 0;
    let visible = false;
    const row = el.parentElement!;
    const unwatch = watchVisible(row, (v) => {
      visible = v;
      row.classList.toggle("is-on", v);
    });
    const dir = reverse ? 1 : -1;
    const off = addTick((_t, dt) => {
      if (!visible) return;
      const boost = 1 + live.vNorm * 3;
      x += dir * speed * dt * boost;
      if (x <= -50) x += 50;
      if (x > 0) x -= 50;
      const target = gsap.utils.clamp(-4, 4, -live.velocity / 320);
      skew += (target - skew) * Math.min(1, dt * 8);
      el.style.transform = `translate3d(${x.toFixed(3)}%,0,0) skewX(${skew.toFixed(2)}deg)`;
    });
    return () => {
      off();
      unwatch();
    };
  }, [speed, reverse]);
  return (
    <div className={`marquee__row ${className}`}>
      <div ref={track} className="marquee__track">
        <div className="marquee__copy">{children}</div>
        <div className="marquee__copy" aria-hidden="true">
          {children}
        </div>
      </div>
    </div>
  );
}
