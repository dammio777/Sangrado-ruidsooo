import { copy, person } from "../config/site";

export interface ContactData {
  nombre: string;
  celular: string;
  tipo: string;
  fecha: string;
  personas: string;
  lugar: string;
  mensaje: string;
}

export function buildMessage(d: ContactData): string {
  const e = copy.contact.empty;
  const map: Record<string, string> = {
    nombre: d.nombre.trim() || e,
    celular: d.celular.replace(/\D/g, "").replace(/(\d{3})(\d{3})(\d{4})/, "$1 $2 $3") || e,
    tipo: d.tipo || e,
    fecha: d.fecha ? formatLongDate(d.fecha) : e,
    personas: d.personas.trim() || e,
    lugar: d.lugar.trim() || e,
    mensaje: d.mensaje.trim(),
  };
  return copy.contact.template.replace(/\{(\w+)\}/g, (_, k: string) => map[k] ?? "");
}

/** wa.me con número si existe; si no, wa.me/?text= deja elegir el chat (pendiente [PONER]). */
export function waLink(text: string): string {
  const base = person.whatsapp ? `https://wa.me/${person.whatsapp}` : "https://wa.me/";
  return `${base}?text=${encodeURIComponent(text)}`;
}

export function waHref(): string {
  return person.whatsapp ? `https://wa.me/${person.whatsapp}` : "#contacto";
}

function formatLongDate(iso: string) {
  const [y, m, d] = iso.split("-").map(Number);
  if (!y || !m || !d) return iso;
  return new Intl.DateTimeFormat("es-CO", { day: "numeric", month: "long", year: "numeric" }).format(
    new Date(y, m - 1, d),
  );
}
