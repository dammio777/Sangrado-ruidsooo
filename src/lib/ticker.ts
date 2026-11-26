import { gsap } from "gsap";
import { live } from "./live";

type Tick = (time: number, dt: number) => void;
const subs = new Set<Tick>();
let started = false;

/** Un solo reloj (gsap.ticker) para Lenis, discos, osciloscopio y medidores. */
export function addTick(fn: Tick): () => void {
  subs.add(fn);
  return () => {
    subs.delete(fn);
  };
}

export function startTicker() {
  if (started) return;
  started = true;
  gsap.ticker.add((time: number, deltaTime: number) => {
    const dt = Math.min(deltaTime, 64) / 1000;
    // velocidad: decae cuando el scroll se detiene
    live.velocity *= Math.exp(-dt * 5);
    const target = Math.min(Math.abs(live.velocity) / 2800, 1);
    // sube rápido; vuelve a ×1 en ~0.8 s
    const rate = target > live.vNorm ? 12 : 4;
    live.vNorm += (target - live.vNorm) * (1 - Math.exp(-dt * rate));
    subs.forEach((f) => f(time, dt));
  });
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) gsap.ticker.sleep();
    else gsap.ticker.wake();
  });
}

/** Limita un callback a N fps dentro del reloj único. */
export function fpsGate(fps: number) {
  const step = 1 / fps;
  let acc = step;
  return (dt: number) => {
    acc += dt;
    if (acc >= step) {
      acc = acc % step;
      return true;
    }
    return false;
  };
}

/** Bandera de visibilidad (IntersectionObserver) para pausar fuera de pantalla. */
export function watchVisible(
  el: Element,
  cb: (visible: boolean) => void,
  rootMargin = "80px 0px",
): () => void {
  const io = new IntersectionObserver(
    (entries) => {
      for (const e of entries) cb(e.isIntersecting);
    },
    { rootMargin },
  );
  io.observe(el);
  return () => io.disconnect();
}
