import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { ScrambleTextPlugin } from "gsap/ScrambleTextPlugin";
import { DrawSVGPlugin } from "gsap/DrawSVGPlugin";
import { CustomEase } from "gsap/CustomEase";
import { useGSAP } from "@gsap/react";

let registered = false;

export function registerGSAP() {
  if (registered || typeof window === "undefined") return;
  gsap.registerPlugin(
    ScrollTrigger,
    SplitText,
    ScrambleTextPlugin,
    DrawSVGPlugin,
    CustomEase,
    useGSAP,
  );
  CustomEase.create("platter", "M0,0 C0.45,0 0.25,1 1,1");
  gsap.defaults({ ease: "expo.out", duration: 0.9 });
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

type FlipT = typeof import("gsap/Flip").Flip;
let flipReady: Promise<FlipT> | null = null;
export function loadFlip() {
  flipReady ??= import("gsap/Flip").then((m) => {
    gsap.registerPlugin(m.Flip);
    return m.Flip;
  });
  return flipReady;
}
