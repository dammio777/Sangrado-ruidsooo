import { lazy, Suspense, useEffect, useState } from "react";
import { LazyMotion } from "motion/react";
import { copy } from "./config/site";
import { validateConfig } from "./config/validate";
import { initReveals, refreshAfterFonts } from "./lib/reveal";
import { restoreSound } from "./lib/sound";
import { live } from "./lib/live";
import { Navbar } from "./components/sections/Navbar";
import { Hero } from "./components/sections/Hero";
import { Manifesto } from "./components/sections/Manifesto";
import { Services } from "./components/sections/Services";
import { Sessions } from "./components/sections/Sessions";
import { FlipSection } from "./components/sections/FlipSection";
import { BuenVivir } from "./components/sections/BuenVivir";
import { Contact } from "./components/sections/Contact";
import { Footer } from "./components/sections/Footer";
import { Floating } from "./components/sections/Floating";
import { Intro } from "./components/sections/Intro";
import { Toast } from "./components/ui/Toast";

const loadFeatures = () => import("./components/ui/motion-features").then((r) => r.default);
const Overlays = lazy(() => import("./components/sections/Overlays"));

declare global {
  interface Window {
    __ccFail?: number;
  }
}

export function App() {
  const [dev, setDev] = useState<{ demo: boolean; pending: boolean } | null>(null);

  useEffect(() => {
    window.clearTimeout(window.__ccFail);
    document.documentElement.classList.add("is-ready");
    const offReveals = initReveals();
    refreshAfterFonts();
    restoreSound();
    validateConfig();
    const q = new URLSearchParams(location.search);
    if (q.has("demo") || q.has("pending")) setDev({ demo: q.has("demo"), pending: q.has("pending") });

    const move = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      live.pointerX = e.clientX / window.innerWidth;
      live.pointerY = e.clientY / window.innerHeight;
      live.pointerActive = true;
    };
    const leave = () => (live.pointerActive = false);
    window.addEventListener("pointermove", move, { passive: true });
    document.documentElement.addEventListener("pointerleave", leave);
    return () => {
      offReveals();
      window.removeEventListener("pointermove", move);
      document.documentElement.removeEventListener("pointerleave", leave);
    };
  }, []);

  return (
    <LazyMotion features={loadFeatures} strict>
      <a className="skip" href="#main">
        {copy.skip}
      </a>
      <div className="mood mood--brand" aria-hidden="true" />
      <div className="mood mood--light" aria-hidden="true" />
      <Navbar />
      <main id="main" tabIndex={-1}>
        <Hero />
        <Manifesto />
        <Services />
        <Sessions />
        <FlipSection />
        <BuenVivir />
        <Contact />
      </main>
      <Footer />
      <Floating />
      <Toast />
      <Intro />
      <div className="grain" aria-hidden="true" />
      {dev && (
        <Suspense fallback={null}>
          <Overlays demo={dev.demo} pending={dev.pending} />
        </Suspense>
      )}
    </LazyMotion>
  );
}
