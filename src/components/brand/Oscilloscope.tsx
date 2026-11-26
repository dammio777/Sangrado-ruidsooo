import { useEffect, useRef } from "react";
import { addTick, fpsGate, watchVisible } from "../../lib/ticker";
import { live } from "../../lib/live";
import { matches, MQ, motionOK } from "../../lib/env";
import { signalAt } from "../../lib/signal";
import { audio } from "../../lib/sound";

/**
 * Línea de osciloscopio: canvas 2D (DPR ≤ 2), línea crema 1.5 px.
 * Amplitud según velocidad de scroll y cursor; con sonido usa el AnalyserNode.
 * 30 fps (20 en bajo consumo), pausa fuera de pantalla. Reduced motion: seno estático.
 */
export function Oscilloscope({ className = "", height = 120 }: { className?: string; height?: number }) {
  const canvas = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const cv = canvas.current;
    if (!cv) return;
    const ctx = cv.getContext("2d");
    if (!ctx) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let w = 0;
    let h = 0;
    let color = "#F2E6D0";
    const resize = () => {
      const r = cv.getBoundingClientRect();
      w = r.width;
      h = r.height;
      cv.width = Math.round(w * dpr);
      cv.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      color = getComputedStyle(cv).color || color;
    };
    const ro = new ResizeObserver(() => {
      resize();
      if (!animated) draw(0, true);
    });
    ro.observe(cv);
    resize();

    const mobile = matches(MQ.isMobile);
    const animated = motionOK();
    const pts = mobile ? 90 : 180;
    let pointerAmp = 0;

    const draw = (t: number, still = false) => {
      ctx.clearRect(0, 0, w, h);
      ctx.lineWidth = 1.5;
      ctx.strokeStyle = color;
      ctx.lineJoin = "round";
      ctx.beginPath();
      const mid = h / 2;
      const a = audio();
      const td = !still && live.soundOn && a ? a.readTime() : null;
      // amplitud: base + velocidad + cercanía del cursor (Y)
      const pY = live.pointerActive ? 1 - Math.min(1, Math.abs(live.pointerY - 0.5) * 2) : 0;
      pointerAmp += (pY - pointerAmp) * 0.08;
      const amp = still ? h * 0.18 : h * (0.12 + live.vNorm * 0.32 + pointerAmp * 0.08);
      for (let i = 0; i <= pts; i++) {
        const x = i / pts;
        let v: number;
        if (td) {
          const idx = Math.floor(x * (td.length - 1));
          v = ((td[idx]! - 128) / 128) * 3.2 + signalAt(x, t, 0.1) * 0.25;
        } else if (still) {
          v = Math.sin(x * Math.PI * 2 * 3);
        } else {
          v = signalAt(x, t, 0.25 + live.vNorm * 0.6);
        }
        // cerca del cursor la señal se acentúa
        const near = live.pointerActive && !still ? Math.exp(-((x - live.pointerX) ** 2) / 0.01) * 0.6 : 0;
        // bordes atenuados
        const edge = Math.sin(x * Math.PI) ** 0.6;
        const y = mid + v * amp * edge * (1 + near);
        if (i === 0) ctx.moveTo(x * w, y);
        else ctx.lineTo(x * w, y);
      }
      ctx.stroke();
    };

    if (!animated) {
      draw(0, true);
      return () => ro.disconnect();
    }
    let visible = false;
    const gate = fpsGate(live.lowPower ? 20 : 30);
    const unwatch = watchVisible(cv, (v) => (visible = v));
    const off = addTick((t, dt) => {
      if (!visible || !gate(dt)) return;
      draw(t);
    });
    return () => {
      off();
      unwatch();
      ro.disconnect();
    };
  }, []);

  return <canvas ref={canvas} className={`osc ${className}`} style={{ height }} aria-hidden="true" />;
}
