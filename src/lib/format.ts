/** Fechas en es-CO. Las fechas ISO se interpretan en hora local (sin desfase UTC). */
function parse(iso: string) {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y ?? 1970, (m ?? 1) - 1, d ?? 1);
}

export function dayMonth(iso: string) {
  return new Intl.DateTimeFormat("es-CO", { day: "numeric", month: "long" }).format(parse(iso));
}

export function weekdayDayMonth(iso: string) {
  return new Intl.DateTimeFormat("es-CO", { weekday: "long", day: "numeric", month: "long" }).format(parse(iso));
}

/** "20:00" → "8:00 p. m." */
export function time12(hhmm: string) {
  const [h, m] = hhmm.split(":").map(Number);
  const d = new Date(2000, 0, 1, h ?? 0, m ?? 0);
  return new Intl.DateTimeFormat("es-CO", { hour: "numeric", minute: "2-digit", hour12: true })
    .format(d)
    .replace(/\s+/g, " ")
    .replace(/a\.?\s?m\.?/i, "a. m.")
    .replace(/p\.?\s?m\.?/i, "p. m.");
}

export function isUpcoming(iso: string | null, now: number) {
  if (!iso) return false;
  const d = parse(iso);
  d.setHours(23, 59, 59);
  return d.getTime() >= now;
}

export function formatNumber(n: number) {
  return new Intl.NumberFormat("es-CO").format(n);
}
