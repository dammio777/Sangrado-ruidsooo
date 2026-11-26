import { useEffect, useRef, useState } from "react";
import { gsap, loadFlip, morph } from "../../lib/gsap";
import { Record } from "../brand/Record";
import { Tonearm } from "../brand/Tonearm";
import { createSpin, spinners } from "../../lib/spin";
import { flatPath, noisyPath, sinePath } from "../../lib/signal";
import { scrambleChars } from "../../lib/motion";
import { dispatchReveal } from "../../lib/reveal";
import { useUI } from "../../lib/store";
import { audio } from "../../lib/sound";
import { staticGlyphs } from "../ui/Scramble";

const W = 1000;
const H = 120;
const FLAT = flatPath(W, H, 120);
const NOISY = noisyPath(W, H, 46, 120, 3);
const SINE = sinePath(W, H, 7, 30, 120);
const NAME = "CRISTIAN CALLE";
const KEY = "cc-intro";

/**
 * 00 · Needle drop (≤ 1.8 s). Overlay sobre el hero ya renderizado (nunca un muro).
 * Se salta en visitas repetidas, deep links y reduced motion (decidido en el <head>).
 */
export function Intro() {
  const [done, setDone] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const bg = useRef<HTMLDivElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const recWrap = useRef<HTMLDivElement>(null);
  const rec = useRef<HTMLDivElement>(null);
  const arm = useRef<SVGGElement>(null);
  const wave = useRef<SVGPathElement>(null);
  const name = useRef<HTMLDivElement>(null);
  const hifi = useRef<HTMLDivElement>(null);
  const needle = useRef<SVGLineElement>(null);

  useEffect(() => {
    const html = document.documentElement;
    const finish = () => {
      try {
        sessionStorage.setItem(KEY, "1");
      } catch {
        /* sin storage */
      }
      html.classList.remove("intro-on");
      useUI.getState().setIntroPlaying(false);
      dispatchReveal();
      setDone(true);
    };
    // El <head> decide si hay intro. Si el JS llegó tarde, el fallback CSS ya lo ocultó.
    if (!html.classList.contains("intro-on") || !html.classList.contains("js-motion") || performance.now() > 2600) {
      finish();
      return;
    }
    root.current?.classList.add("intro--js");
    useUI.getState().setIntroPlaying(true);
    const disc = rec.current!.querySelector<SVGSVGElement>(".record__disc")!;
    const spinner = createSpin(disc, { autoStart: false, boost: false });

    const nameEl = name.current!;
    nameEl.textContent = staticGlyphs(NAME);
    gsap.set(arm.current, { rotation: -24, svgOrigin: "96 36" });
    gsap.set(needle.current, { rotation: -45, svgOrigin: "40 40" });
    gsap.set(recWrap.current, { xPercent: 70, autoAlpha: 0 });

    const target = document.querySelector<HTMLElement>("[data-hero-record]");
    const tl = gsap.timeline({ defaults: { ease: "expo.out" }, onComplete: finish });

    // 1 · el disco entra y arranca (platter)
    tl.to(recWrap.current, { xPercent: 0, autoAlpha: 1, duration: 0.6 }, 0)
      .call(() => spinner.spinUp(1.1), undefined, 0.05)
      // 2 · el brazo cae sobre el surco exterior + sacudida de 1 px
      .to(arm.current, { rotation: -15, duration: 0.5, ease: "power3.inOut" }, 0.3)
      .to(stage.current, { y: 1, duration: 0.03, yoyo: true, repeat: 1, ease: "none" }, 0.8)
      .call(() => audio()?.needleDrop(), undefined, 0.8)
      // 3 · línea plana → estática → seno limpio; la aguja VU sube y se asienta
      .to(wave.current, { ...morph(NOISY), duration: 0.22, ease: "none" }, 0.45)
      .to(wave.current, { ...morph(SINE), duration: 0.55, ease: "power3.out" }, 0.7)
      .to(needle.current, { rotation: 18, duration: 0.9, ease: "elastic.out(1, 0.55)" }, 0.7)
      // 4 · el nombre sintoniza
      .to(
        nameEl,
        { duration: 0.8, ease: "none", scrambleText: { text: NAME, chars: scrambleChars, revealDelay: 0.25, speed: 0.6 } },
        0.35,
      )
      // 5 · HI-FI → HI·gh FI·delity → HI-FI
      .fromTo(hifi.current, { autoAlpha: 0, y: 8 }, { autoAlpha: 1, y: 0, duration: 0.3 }, 0.85)
      .to(".intro__hifi-short", { autoAlpha: 0, duration: 0.12 }, 1.0)
      .fromTo(
        ".intro__hifi-long",
        { clipPath: "inset(0% 50% 0% 50%)", autoAlpha: 1 },
        { clipPath: "inset(0% 0% 0% 0%)", duration: 0.26, ease: "power3.out" },
        1.0,
      )
      .to(".intro__hifi-long", { clipPath: "inset(0% 50% 0% 50%)", duration: 0.18, ease: "power3.in" }, 1.3)
      .to(".intro__hifi-short", { autoAlpha: 1, duration: 0.12 }, 1.42);

    // 6 · el disco vuela (Flip) a su lugar tras el retrato y el overlay se abre en círculo
    const end = 1.3;
    tl.call(() => dispatchReveal(), undefined, end + 0.05);
    tl.to([name.current, hifi.current, wave.current, arm.current, ".intro__vu"], { autoAlpha: 0, duration: 0.25, ease: "power2.out" }, end);
    if (target) {
      let Flip: Awaited<ReturnType<typeof loadFlip>> | null = null;
      void loadFlip().then((f) => (Flip = f));
      tl.add(() => {
        const dur = 0.5 / Math.max(1, tl.timeScale());
        if (Flip) {
          Flip.fit(recWrap.current!, target, { duration: dur, ease: "power3.inOut", absolute: true });
        } else {
          // respaldo si el plugin aún no llegó: mismo encaje manual
          const a = recWrap.current!.getBoundingClientRect();
          const b = target.getBoundingClientRect();
          gsap.to(recWrap.current, {
            x: `+=${b.left + b.width / 2 - (a.left + a.width / 2)}`,
            y: `+=${b.top + b.height / 2 - (a.top + a.height / 2)}`,
            scale: b.width / a.width,
            duration: dur,
            ease: "power3.inOut",
          });
        }
      }, end);
    }
    const hole = { r: 0 };
    const setHole = () => {
      const r = target?.getBoundingClientRect();
      const w = window.innerWidth;
      const h = window.innerHeight;
      const cx = r ? r.left + r.width / 2 : w / 2;
      const cy = r ? r.top + r.height / 2 : h / 2;
      const rr = Math.max(0.01, hole.r);
      bg.current!.style.clipPath = `path(evenodd, "M0 0H${w}V${h}H0Z M${cx - rr} ${cy}a${rr} ${rr} 0 1 0 ${rr * 2} 0a${rr} ${rr} 0 1 0 ${-rr * 2} 0Z")`;
    };
    tl.to(hole, { r: Math.hypot(window.innerWidth, window.innerHeight), duration: 0.5, ease: "power3.in", onUpdate: setHole }, end + 0.05);
    tl.to(recWrap.current, { autoAlpha: 0, duration: 0.12 }, end + 0.45);
    tl.call(
      () => {
        const hero = spinners.hero;
        if (hero) hero.state.angle = spinner.state.angle;
      },
      undefined,
      end + 0.44,
    );

    // Cualquier entrada → termina en 250 ms
    let skipped = false;
    const skip = () => {
      if (skipped) return;
      skipped = true;
      const remaining = tl.duration() - tl.time();
      if (remaining > 0.25) tl.timeScale(remaining / 0.25);
    };
    const evs: (keyof WindowEventMap)[] = ["pointerdown", "keydown", "wheel", "touchstart", "scroll"];
    evs.forEach((e) => window.addEventListener(e, skip, { passive: true }));
    return () => {
      evs.forEach((e) => window.removeEventListener(e, skip));
      tl.kill();
      spinner.destroy();
    };
  }, []);

  if (done) return null;
  return (
    <div ref={root} className="intro" data-surface="dark" aria-hidden="true">
      <div ref={bg} className="intro__bg" />
      <div ref={stage} className="intro__stage">
        <div className="intro__deck">
          <div ref={recWrap} className="intro__record">
            <Record ref={rec} sheen={false} ring={null} />
            <Tonearm ref={arm} className="intro__arm" />
          </div>
        </div>
        <div className="intro__text">
          <div ref={name} className="intro__name">
            {NAME}
          </div>
          <div ref={hifi} className="intro__hifi mono">
            <span className="intro__hifi-short">HI-FI</span>
            <span className="intro__hifi-long">
              HI<em>·gh</em> FI<em>·delity</em>
            </span>
          </div>
        </div>
        <svg className="intro__wave" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none">
          <path ref={wave} d={FLAT} />
        </svg>
        <svg className="intro__vu" viewBox="0 0 80 48">
          <path d="M8 40 A 34 34 0 0 1 72 40" />
          <line ref={needle} x1="40" y1="40" x2="40" y2="10" />
          <circle cx="40" cy="40" r="2.5" />
        </svg>
        <span className="intro__corner mono">33⅓ RPM · LADO A</span>
      </div>
    </div>
  );
}
