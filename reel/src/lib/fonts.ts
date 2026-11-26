import { loadFont } from "@remotion/fonts";
import { staticFile } from "remotion";

// DESIGN.md §2: Fraunces (display), IBM Plex Mono (labels), DM Sans (body).
// Self-hosted woff2, latin subset (copied from @fontsource packages).
export const fontsReady = Promise.all([
  loadFont({ family: "Fraunces", url: staticFile("fonts/fraunces-latin-full-normal.woff2"), weight: "100 900", style: "normal" }),
  loadFont({ family: "Fraunces", url: staticFile("fonts/fraunces-latin-full-italic.woff2"), weight: "100 900", style: "italic" }),
  loadFont({ family: "DM Sans", url: staticFile("fonts/dm-sans-latin-opsz-normal.woff2"), weight: "100 1000", style: "normal" }),
  loadFont({ family: "IBM Plex Mono", url: staticFile("fonts/ibm-plex-mono-latin-400-normal.woff2"), weight: "400", style: "normal" }),
  loadFont({ family: "IBM Plex Mono", url: staticFile("fonts/ibm-plex-mono-latin-500-normal.woff2"), weight: "500", style: "normal" }),
]);
