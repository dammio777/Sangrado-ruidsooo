import { person, services, sessions, reels, pillars, copy } from "./site";

/** Guardia tipada en arranque: en desarrollo avisa qué campos faltan. */
export function validateConfig(): string[] {
  const missing: string[] = [];
  const req = (cond: unknown, label: string) => {
    if (!cond) missing.push(label);
  };
  req(person.name, "person.name");
  req(person.instagram.url.startsWith("https://"), "person.instagram.url");
  req(Number.isFinite(person.instagram.followers), "person.instagram.followers");
  if (!person.whatsapp) missing.push("person.whatsapp [PONER]");
  else req(/^57\d{10}$/.test(person.whatsapp), "person.whatsapp (formato 57XXXXXXXXXX)");
  if (!person.email) missing.push("person.email [PONER]");
  services.forEach((s, i) => {
    req(s.id && s.title && s.line, `services[${i}] id/title/line`);
    req(s.details.length > 0, `services[${i}].details`);
  });
  sessions.forEach((s, i) => {
    req(s.title && s.venue, `sessions[${i}] title/venue`);
    if (s.date) req(/^\d{4}-\d{2}-\d{2}$/.test(s.date), `sessions[${i}].date (ISO)`);
    if (!s.poster.src) missing.push(`sessions[${i}].poster.src [PONER]`);
  });
  req(pillars.length === 3, "pillars (3)");
  req(reels.length >= 3 && reels.length <= 6, "reels (3–6)");
  req(copy.contact.template.includes("{nombre}"), "copy.contact.template");
  if (import.meta.env.DEV && missing.length) {
    console.info(`[site.ts] Campos pendientes (${missing.length}):\n· ${missing.join("\n· ")}`);
  }
  return missing;
}
