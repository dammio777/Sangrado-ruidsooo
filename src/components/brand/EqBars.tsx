import { useEffect, useRef } from "react";
import { addTick, fpsGate, watchVisible } from "../../lib/ticker";
import { live } from "../../lib/live";
import { motionOK } from "../../lib/env";
import { noise1 } from "../../lib/signal";
import { audio } from "../../lib/sound";

/** eq-bars: solo scaleY (origen abajo), ruido procedimental o AnalyserNode. 30 fps, pausa fuera de vista. */
export function EqBars({ count = 4, active = true, className = "" }: { count?: number; active?: boolean; className?: string }) {
  const root = useRef<HTMLSpanElement>(null);
  const activeRef = useRef(active);
  activeRef.current = active;

  useEffect(() => {
    const el = root.current;
    if (!el || !motionOK()) return;
    const bars = Array.from(el.children) as HTMLElement[];
    let visible = false;
    const gate = fpsGate(30);
    const unwatch = watchVisible(el, (v) => (visible = v), "0px");
    let settled = false;
    const off = addTick((t, dt) => {
      if (!visible || !gate(dt)) return;
      if (!activeRef.current) {
        if (!settled) {
          bars.forEach((b) => (b.style.transform = "scaleY(0.25)"));
          settled = true;
        }
        return;
      }
      settled = false;
      const a = audio();
      const bands = live.soundOn && a ? a.readBands(bars.length) : null;
      bars.forEach((b, i) => {
        const v = bands ? 0.15 + bands[i]! * 0.85 : 0.25 + 0.75 * Math.abs(noise1(t * 3.1 + i * 7.7));
        b.style.transform = `scaleY(${v.toFixed(3)})`;
      });
    });
    return () => {
      off();
      unwatch();
    };
  }, []);

  return (
    <span ref={root} className={`eq ${className}`} aria-hidden="true">
      {Array.from({ length: count }, (_, i) => (
        <span key={i} className="eq__bar" />
      ))}
    </span>
  );
}
