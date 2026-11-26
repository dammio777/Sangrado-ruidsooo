import { StrictMode } from "react";
import { createRoot, hydrateRoot } from "react-dom/client";
import "./styles/index.css";
import { App } from "./App";
import { loadMorph, registerGSAP } from "./lib/gsap";
import { startTicker } from "./lib/ticker";
import { initScroll } from "./lib/scroll";
import { live } from "./lib/live";
import { lowPower } from "./lib/env";

// Plugins, reloj único y scroll antes de hidratar (los efectos hijos corren primero).
registerGSAP();
void loadMorph();
live.lowPower = lowPower();
startTicker();
initScroll();

const el = document.getElementById("root")!;
const app = (
  <StrictMode>
    <App />
  </StrictMode>
);
if (el.hasChildNodes()) hydrateRoot(el, app);
else createRoot(el).render(app);
