import { renderToString } from "react-dom/server";
import { App } from "./App";
import { person, sessions, site } from "./config/site";

export function render() {
  return renderToString(<App />);
}

/** JSON-LD: Person + Event solo para sesiones con fecha confirmada. */
export function jsonLd(siteUrl: string | null) {
  const personLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: person.fullName,
    alternateName: person.name,
    jobTitle: person.jobTitle,
    description: site.description,
    address: {
      "@type": "PostalAddress",
      addressLocality: `${person.location.locality}, ${person.location.city}`,
      addressRegion: person.location.region,
      addressCountry: person.location.country,
    },
    sameAs: [person.instagram.url],
    ...(siteUrl ? { url: siteUrl } : {}),
  };
  const events = sessions
    .filter((s) => s.date && s.dateConfirmed)
    .map((s) => ({
      "@context": "https://schema.org",
      "@type": "Event",
      name: `${s.title} · ${person.name}`,
      startDate: s.time ? `${s.date}T${s.time}:00-05:00` : s.date,
      location: { "@type": "Place", name: s.venue, address: s.address ?? `${person.location.locality}, ${person.location.city}` },
      performer: { "@type": "Person", name: person.fullName },
      eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    }));
  return [personLd, ...events];
}
