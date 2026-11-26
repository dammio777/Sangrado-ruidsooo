import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { addTick, fpsGate, watchVisible } from "../../lib/ticker";
import { live } from "../../lib/live";
import { motionOK } from "../../lib/env";
import { levelAt } from "../../lib/signal";
import { audio } from "../../lib/sound";

/** VU: aguja −45° → +45° guiada por velocidad de scroll (o nivel de audio). */
export function VuMeter({ label = "VU", className = "" }: { label?: string; className?: string }) {
  const needle = useRef<SVGLineElement>(null);
  const lamp = useRef<SVGCircleElement>(null);
  const root = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!motionOK() || !needle.current || !root.current) return;
    const to = gsap.quickTo(needle.current, "rotation", { duration: 0.25, ease: "elastic.out(1, 0.55)" });
    gsap.set(needle.current, { svgOrigin: "100 104", rotation: -45 });
    let visible = false;
    let peak = 0;
    const gate = fpsGate(30);
    const unwatch = watchVisible(root.current, (v) => (visible = v));
    const off = addTick((t, dt) => {
      if (!visible || !gate(dt)) return;
      const a = audio();
      const sound = live.soundOn && a ? a.readLevel() : 0;
      const idle = 0.08 + levelAt(t * 0.6, 3) * 0.08;
      const v = Math.min(1, Math.max(idle, live.vNorm * 1.05, sound));
      to(-45 + v * 90);
      if (v > 0.85) peak = 1;
      peak = Math.max(0, peak - dt * 3);
      lamp.current?.setAttribute("opacity", String(0.18 + peak * 0.82));
    });
    return () => {
      off();
      unwatch();
    };
  }, []);

  const ticks = [-45, -33, -22, -12, -3, 6, 16, 27, 45];
  const labels: [number, string][] = [
    [-45, "−20"],
    [-22, "−7"],
    [-3, "−3"],
    [16, "0"],
    [45, "+3"],
  ];
  const pt = (deg: number, r: number) => {
    const a = ((deg - 90) * Math.PI) / 180;
    return [100 + Math.cos(a) * r, 104 + Math.sin(a) * r] as const;
  };
  const arc = (from: number, to: number, r: number) => {
    const [x1, y1] = pt(from, r);
    const [x2, y2] = pt(to, r);
    return `M${x1.toFixed(2)},${y1.toFixed(2)} A${r},${r} 0 0 1 ${x2.toFixed(2)},${y2.toFixed(2)}`;
  };
  return (
    <svg ref={root} viewBox="0 0 200 128" className={`vu ${className}`} aria-hidden="true" focusable="false">
      <rect x="1" y="1" width="198" height="126" rx="6" className="vu__panel" />
      <path d={arc(-45, 16, 70)} className="vu__scale" />
      <path d={arc(16, 45, 70)} className="vu__red" />
      {ticks.map((d) => {
        const [x1, y1] = pt(d, 70);
        const [x2, y2] = pt(d, d >= 16 ? 79 : 76);
        return <line key={d} x1={x1} y1={y1} x2={x2} y2={y2} className={d >= 16 ? "vu__tick vu__tick--red" : "vu__tick"} />;
      })}
      {labels.map(([d, t]) => {
        const [x, y] = pt(d, 89);
        return (
          <text key={t} x={x} y={y + 3} textAnchor="middle" className="vu__num">
            {t}
          </text>
        );
      })}
      <text x="100" y="80" textAnchor="middle" className="vu__label">
        {label}
      </text>
      <line ref={needle} x1="100" y1="104" x2="100" y2="34" className="vu__needle" transform="rotate(-45 100 104)" />
      <circle cx="100" cy="104" r="5" className="vu__hub" />
      <circle ref={lamp} cx="178" cy="20" r="4" className="vu__lamp" opacity="0.18" />
      <text x="168" y="23" textAnchor="end" className="vu__peak">
        PEAK
      </text>
    </svg>
  );
}
