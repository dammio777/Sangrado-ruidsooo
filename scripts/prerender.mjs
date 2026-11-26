// Prerender estático: inyecta el HTML de React, JSON-LD, canonical y genera sitemap/robots.
import { readFileSync, writeFileSync, rmSync } from "node:fs";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";

const root = resolve(import.meta.dirname, "..");
const dist = resolve(root, "dist");
const SITE_URL = (process.env.SITE_URL || "").replace(/\/$/, "");

const { render, jsonLd } = await import(pathToFileURL(resolve(root, "dist-ssr/entry-server.js")).href);
let html = readFileSync(resolve(dist, "index.html"), "utf8");
const app = render();
html = html.replace("<!--app-html-->", app);
const ld = jsonLd(SITE_URL ? `${SITE_URL}/` : null)
  .map((o) => `<script type="application/ld+json">${JSON.stringify(o).replace(/</g, "\\u003c")}</script>`)
  .join("\n    ");
html = html.replace("<!--jsonld-->", ld);
html = html.replace(
  "<!--canonical-->",
  SITE_URL ? `<link rel="canonical" href="${SITE_URL}/" />\n    <meta property="og:url" content="${SITE_URL}/" />` : "",
);
html = html.replaceAll("%OG_IMAGE%", SITE_URL ? `${SITE_URL}/og.png` : "/og.png");
// CSS crítico en línea (una sola hoja, ~15 KB gzip): elimina un viaje bloqueante.
html = html.replace(/<link rel="stylesheet"[^>]*href="(\/assets\/[^"]+\.css)"[^>]*>/, (_m, href) => {
  const css = readFileSync(resolve(dist, "." + href), "utf8");
  return `<style>${css}</style>`;
});
// El JS hidrata contenido ya prerenderizado: se pide tras el primer pintado para no
// competir con el HTML/CSS/fuente en redes lentas.
const entry = html.match(/<script type="module" crossorigin src="([^"]+)"><\/script>/);
if (entry) {
  const preloads = [...html.matchAll(/<link rel="modulepreload" crossorigin href="([^"]+)">\n?\s*/g)];
  preloads.forEach((m) => (html = html.replace(m[0], "")));
  html = html.replace(entry[0], "");
  const urls = JSON.stringify([entry[1], ...preloads.map((m) => m[1])]);
  const loader = `<script>(function(){var u=${urls};function go(){u.forEach(function(h,i){var s=document.createElement(i?"link":"script");if(i){s.rel="modulepreload";s.href=h}else{s.type="module";s.src=h}s.crossOrigin="";document.head.appendChild(s)})}requestAnimationFrame(function(){setTimeout(go,0)})})();</script>`;
  html = html.replace("</body>", `${loader}\n  </body>`);
}
writeFileSync(resolve(dist, "index.html"), html);

const base = SITE_URL || "https://DOMINIO-PENDIENTE.example";
writeFileSync(
  resolve(dist, "sitemap.xml"),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n  <url><loc>${base}/</loc><changefreq>monthly</changefreq><priority>1.0</priority></url>\n</urlset>\n`,
);
writeFileSync(resolve(dist, "robots.txt"), `User-agent: *\nAllow: /\n\nSitemap: ${base}/sitemap.xml\n`);
rmSync(resolve(root, "dist-ssr"), { recursive: true, force: true });
console.log(`prerender ok · ${(html.length / 1024).toFixed(1)} KB html · SITE_URL=${SITE_URL || "(pendiente)"}`);
