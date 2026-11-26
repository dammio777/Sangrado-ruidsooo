import { useEffect, useRef } from "react";
import { addTick } from "../../lib/ticker";
import { live } from "../../lib/live";
import { motionOK } from "../../lib/env";

/** Brazo de progreso en el margen izquierdo (escritorio): baja con la página y se levanta al 100 %. */
export function TonearmProgress() {
  const head = useRef<HTMLDivElement>(null);
  const root = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!head.current || !root.current) return;
    let lifted = false;
    let last = -1;
    const off = addTick(() => {
      const p = live.progress;
      if (Math.abs(p - last) < 0.0005) return;
      last = p;
      const h = root.current!.clientHeight - 28;
      head.current!.style.transform = `translate3d(0, ${(p * h).toFixed(1)}px, 0)`;
      root.current!.style.setProperty("--p", p.toFixed(4));
      const shouldLift = p > 0.995;
      if (shouldLift !== lifted) {
        lifted = shouldLift;
        root.current!.classList.toggle("is-lifted", lifted);
      }
    });
    if (!motionOK()) root.current.classList.add("is-static");
    return off;
  }, []);
  return (
    <div ref={root} className="tprog" aria-hidden="true">
      <span className="tprog__track" />
      <span className="tprog__fill" />
      <div ref={head} className="tprog__head">
        <span className="tprog__needle" />
      </div>
      <span className="tprog__label mono">A</span>
      <span className="tprog__label tprog__label--end mono">B</span>
    </div>
  );
}
