// Lighthouse móvil sobre el servidor con gzip: node scripts/lh.mjs [url]
import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
const url = process.argv[2] || "http://localhost:4174/";
const out = "verify-out/lh-mobile.json";
try {
  execFileSync("npx", ["lighthouse", url, "--quiet", "--chrome-flags=--headless=new --no-sandbox", "--output=json", `--output-path=${out}`, "--only-categories=performance,accessibility,best-practices,seo"], { stdio: "ignore" });
} catch { /* lighthouse devuelve !=0 con avisos */ }
const r = JSON.parse(readFileSync(out, "utf8"));
console.log(Object.entries(r.categories).map(([k, v]) => `${k}: ${Math.round(v.score * 100)}`).join(" | "));
const a = r.audits;
for (const k of ["first-contentful-paint", "largest-contentful-paint", "cumulative-layout-shift", "total-blocking-time", "speed-index", "interactive", "total-byte-weight", "dom-size"]) console.log(`${k}: ${a[k].displayValue}`);
for (const [k, v] of Object.entries(a)) if (v.score !== null && v.score < 0.9 && !["informative", "notApplicable", "manual"].includes(v.scoreDisplayMode)) console.log(`  · ${k} (${v.score}) ${v.displayValue || ""}`);
