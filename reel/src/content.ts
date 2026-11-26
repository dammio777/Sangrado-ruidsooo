// Every line of copy in the reel. Nothing here is invented:
// – sessions are shown without year (brief §6);
// – venues stay hidden until their permission is confirmed (venueConfirmed);
// – services A1–A5 are the draft list [CONFIRMAR], used as-is.

export const content = {
  name: ["Cristian", "Calle"],
  role: ["Organizador de eventos", "y selector musical"],
  place: "Santa Elena, Medellín",
  handle: "@kristohd13",
  hook: { label: "CC-001 · Lado A", pre: "Esto es", accent: "Hi-Fi." },
  manifesto: [
    "High fidelity es reproducir algo tal como es: sin ruido, sin pérdida, sin atajos.",
    // no-voice version (brief §3): second line added
    "No solo al sonido: también a la atención, al lugar, a la comida, a la música y a la gente.",
  ],
  services: {
    label: "Lado A · 5 temas",
    items: [
      { n: "A1", t: "Organización de eventos" },
      { n: "A2", t: "Selektor en vinilo" },
      { n: "A3", t: "Música en la sala" },
      { n: "A4", t: "Bodas y celebraciones" },
      { n: "A5", t: "Experiencias con sabor" },
    ],
  },
  sessions: {
    heading: ["Algunas noches", "que ya sonaron."],
    items: [
      { name: "The B Side", venue: "Árboro × Gaia", day: "10 de julio", short: "10 jul", poster: null as string | null },
      { name: "Música en la sala", venue: "Jaguarundí", day: "29 de mayo", short: "29 may", poster: null as string | null },
      { name: "Selektor", venue: "El Maizal", day: "15 de mayo", short: "15 may", poster: null as string | null },
    ],
    // [CONFIRMAR] permission to name the venues. Flip to true once confirmed.
    venueConfirmed: false,
  },
  flip: ["Dale vuelta", "al disco"],
  sideB: {
    label: "CC-002 · Lado B",
    pre: "El",
    accent: "buen vivir",
    phrase: "Café y bici, sol y monte, diversión y trabajo.",
    pillars: [
      { t: "Crecimiento personal", icon: "mountain" as const },
      { t: "Desarrollo", icon: "bicycle" as const },
      { t: "Buen vivir", icon: "coffee" as const },
    ],
  },
  close: {
    line: ["Todo en alta", "fidelidad."],
    follow: "Sígueme para escuchar los dos lados.",
    dm: "Eventos: escríbeme por DM.",
  },
};
