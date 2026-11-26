import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { DrawSVGPlugin } from "gsap/DrawSVGPlugin";
import { useGSAP } from "@gsap/react";

let registered = false;

export function registerGSAP() {
  if (registered || typeof window === "undefined") return;
  gsap.registerPlugin(
    ScrollTrigger,
    SplitText,
    DrawSVGPlugin,
    useGSAP,
  );
  gsap.defaults({ ease: "power3.out", duration: 1 });
  ScrollTrigger.config({ ignoreMobileResize: true });
  registered = true;
}

export { gsap, ScrollTrigger, SplitText, useGSAP };

/* Plugins diferidos (fuera del bundle inicial) */
let morphReady: Promise<void> | null = null;
let morphLoaded = false;
export function loadMorph() {
  morphReady ??= import("gsap/MorphSVGPlugin").then((m) => {
    gsap.registerPlugin(m.MorphSVGPlugin);
    morphLoaded = true;
  });
  return morphReady;
}
/** MorphSVG si ya cargó; si no, interpolación de `d` (los paths comparten estructura). */
export function morph(d: string): gsap.TweenVars {
  return morphLoaded ? { morphSVG: d } : { attr: { d } };
}
