import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  define: {
    __BUILD_TIME__: JSON.stringify(Date.now()),
  },
  build: {
    target: "es2020",
    cssMinify: true,
    modulePreload: { polyfill: false },
  },
  ssr: {
    noExternal: ["gsap", "@gsap/react", "motion", "lenis", "zustand"],
  },
});
