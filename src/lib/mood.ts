/**
 * Capa de mood crema: un solo dueño de su opacidad.
 * El flip (vino→crema) y el contacto (crema→vino) aportan su progreso;
 * opacidad = flip × (1 − contacto). Así dos scrubs nunca se pisan.
 */
const parts = { flip: 0, contact: 0 };
let el: HTMLElement | null = null;

export function setMood(key: keyof typeof parts, v: number) {
  parts[key] = Math.min(1, Math.max(0, v));
  el ??= document.querySelector<HTMLElement>(".mood--light");
  const o = parts.flip * (1 - parts.contact);
  if (el) el.style.opacity = o.toFixed(3);
  // fondo real (para elementos fijos como la píldora flotante)
  const bg = o > 0.5 ? "light" : "brand";
  if (document.documentElement.dataset.bg !== bg) document.documentElement.dataset.bg = bg;
}
