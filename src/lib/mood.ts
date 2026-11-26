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
  if (el) el.style.opacity = (parts.flip * (1 - parts.contact)).toFixed(3);
}
