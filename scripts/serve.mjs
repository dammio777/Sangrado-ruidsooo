// Servidor estático con gzip para medir como en producción (vite preview no comprime).
import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import { extname, join, resolve } from "node:path";
import { gzipSync } from "node:zlib";
const root = resolve(import.meta.dirname, "../dist");
const types = { ".html": "text/html; charset=utf-8", ".js": "text/javascript", ".css": "text/css", ".svg": "image/svg+xml", ".png": "image/png", ".woff2": "font/woff2", ".json": "application/json", ".webmanifest": "application/manifest+json", ".xml": "application/xml", ".txt": "text/plain" };
const port = Number(process.env.PORT || 4174);
createServer(async (req, res) => {
  let p = decodeURIComponent(new URL(req.url, "http://x").pathname);
  if (p.endsWith("/")) p += "index.html";
  let file = join(root, p);
  try { if ((await stat(file)).isDirectory()) file = join(file, "index.html"); } catch { file = join(root, "index.html"); }
  try {
    let body = await readFile(file);
    const ext = extname(file);
    const headers = { "content-type": types[ext] || "application/octet-stream", "cache-control": p.startsWith("/assets/") || p.startsWith("/fonts/") ? "public, max-age=31536000, immutable" : "no-cache" };
    if (/gzip/.test(req.headers["accept-encoding"] || "") && !/\.(png|woff2)$/.test(ext)) { body = gzipSync(body, { level: 9 }); headers["content-encoding"] = "gzip"; }
    res.writeHead(200, headers); res.end(body);
  } catch { res.writeHead(404); res.end("not found"); }
}).listen(port, () => console.log(`serving dist on http://localhost:${port}`));
