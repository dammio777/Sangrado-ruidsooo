/**
 * ─────────────────────────────────────────────────────────────
 *  Cristian Calle · datos editables del sitio
 *  TODO el contenido vive aquí. Los campos en `null` se muestran
 *  como placeholders marcados (ver `?pending` en la URL).
 *  Etiquetas: [PONER] dato faltante · [AJUSTAR] borrador por confirmar
 *             [CONFIRMAR] dato por verificar con Cristian
 * ─────────────────────────────────────────────────────────────
 */

export type ImageCategory = "retrato" | "musica" | "sala" | "poster" | "buen-vivir";

export interface SiteImage {
  /** Ruta del archivo en /public/img/. `null` = aún no entregado → placeholder. */
  src: string | null;
  /** Nombre de archivo esperado (para el equipo). */
  wanted: string;
  alt: string;
  width: number;
  height: number;
  category: ImageCategory;
}

export interface Service {
  id: string;
  title: string;
  line: string;
  details: string[];
  whatsappText: string;
  pending: string[];
}

export interface Session {
  id: string;
  catalog: string;
  title: string;
  subtitle: string;
  venue: string;
  presenter?: string;
  /** ISO yyyy-mm-dd. El año es inferido del día de la semana del afiche [CONFIRMAR]. */
  date: string | null;
  dateConfirmed: boolean;
  /** "20:00" (24 h). Se muestra como "8:00 p. m." */
  time: string | null;
  address?: string;
  genres: string[];
  poster: SiteImage;
  pending: string[];
}

export interface Pillar {
  id: string;
  icon: "mountain" | "bicycle" | "sun" | "coffee";
  title: string;
  text: string;
}

export interface Reel {
  poster: SiteImage;
  video: string | null;
  url: string;
  caption: string;
  pending: boolean;
}

const img = (
  wanted: string,
  alt: string,
  category: ImageCategory,
  width = 1200,
  height = 1200,
): SiteImage => ({ src: null, wanted, alt, width, height, category });

export const images = {
  retrato: img("retrato.jpg", "Retrato de Cristian Calle con gafas de sol", "retrato", 1200, 1200),
  cabina: img("cabina-arboro.jpg", "Cristian Calle en la cabina, con audífonos, mezclando vinilos", "musica", 1600, 1200),
  vinilo: img("vinilo-manos.jpg", "Manos poniendo un vinilo en el tornamesa", "musica", 1600, 1200),
  sala: img("sala-chesterfield.jpg", "La sala con el sofá Chesterfield rojo", "sala", 1600, 1200),
  posterBSide: img("poster-b-side.jpg", "Afiche de The B Side, clásicos en vinilo", "poster"),
  posterSala: img("poster-musica-en-la-sala.jpg", "Afiche de Música en la sala", "poster"),
  posterMaizal: img("poster-selektor-maizal.jpg", "Afiche de Cristian Calle Selektor en El Maizal", "poster"),
  posterArboro: img("cabina-arboro.jpg", "Sesión de Cristian Calle en Árboro", "poster"),
  buenVivir: [1, 2, 3, 4, 5, 6].map((n) =>
    img(`buen-vivir-${n}.jpg`, `El buen vivir en la montaña, imagen ${n}`, "buen-vivir", 1080, 1920),
  ),
} as const;

export const person = {
  name: "Cristian Calle",
  fullName: "Cristian Calle Bustamante",
  roles: ["Organizador de eventos", "Selector musical en vinilo", "Creador de contenido sobre el buen vivir"],
  jobTitle: "Organizador de eventos y selector musical",
  location: {
    locality: "Santa Elena",
    city: "Medellín",
    region: "Antioquia",
    country: "CO",
    label: "Santa Elena, Medellín",
  },
  instagram: {
    handle: "@kristohd13",
    url: "https://www.instagram.com/kristohd13/",
    /** [ACTUALIZAR] — valor manual, nunca se consulta en vivo. */
    followers: 1432,
    posts: 30,
  },
  /** [PONER] número en formato internacional sin "+", ej. "573001234567". */
  whatsapp: null as string | null,
  /** [PONER] */
  email: null as string | null,
} as const;

export const services: Service[] = [
  {
    id: "A1",
    title: "Organización de eventos",
    line: "De la idea al último tema de la noche.",
    details: [
      "Una conversación para entender el plan, la gente y el lugar.",
      "Concepto, ambiente y ritmo de la noche pensados de principio a fin.",
      "Música, atención y detalles en la misma frecuencia.",
    ],
    whatsappText: "Hola Cristian, quiero hablar de la organización de un evento.",
    pending: ["Lista y alcance del servicio [CONFIRMAR]"],
  },
  {
    id: "A2",
    title: "Selektor en vinilo",
    line: "Sets de música sabrosa: rock, salsa, soul, jazz, blues y fusiones.",
    details: [
      "Selección en vinilo leída en vivo, según el momento y la gente.",
      "Clásicos y joyas de rock, salsa, soul, jazz, blues y fusiones.",
      "Duración y formato del set a la medida del plan.",
    ],
    whatsappText: "Hola Cristian, quiero un set de Selektor en vinilo.",
    pending: ["Qué incluye el set [AJUSTAR]"],
  },
  {
    id: "A3",
    title: "Música en la sala",
    line: "Sesiones íntimas y fiestas en casa con sonido de verdad.",
    details: [
      "Un recorrido musical como el de las fiestas en la sala de la casa.",
      "Pensado para grupos pequeños y espacios con alma.",
      "Buen sonido, buena música y nada a medias.",
    ],
    whatsappText: "Hola Cristian, quiero una sesión de Música en la sala.",
    pending: ["Qué incluye [AJUSTAR]"],
  },
  {
    id: "A4",
    title: "Bodas y celebraciones",
    line: "La música y la experiencia del día más importante.",
    details: [
      "Acompañamiento para que la música cuente la historia del día.",
      "Momentos clave pensados con la pareja.",
      "La misma alta fidelidad, del brindis al último baile.",
    ],
    whatsappText: "Hola Cristian, quiero hablar de música para una boda o celebración.",
    pending: ["Servicio por confirmar [CONFIRMAR]"],
  },
  {
    id: "A5",
    title: "Experiencias con sabor",
    line: "Comida, música y lugar en la misma frecuencia.",
    details: [
      "Encuentros donde la mesa, la música y el espacio suenan juntos.",
      "Para marcas, lugares y planes que quieren algo distinto.",
      "Cada detalle en su punto.",
    ],
    whatsappText: "Hola Cristian, quiero hablar de una experiencia con sabor.",
    pending: ["Servicio por confirmar [CONFIRMAR]"],
  },
];

export const sessions: Session[] = [
  {
    id: "b-side",
    catalog: "CC-01",
    title: "The B Side",
    subtitle: "Classics on vinyl",
    venue: "Árboro × Gaia",
    date: "2026-07-10",
    dateConfirmed: false,
    time: "20:00",
    genres: ["Rock", "Salsa", "Soul", "Jazz", "Blues", "Fusiones"],
    poster: images.posterBSide,
    pending: ["Año [CONFIRMAR]", "Permiso para nombrar el lugar [CONFIRMAR]", "Archivo del afiche [PONER]"],
  },
  {
    id: "musica-en-la-sala",
    catalog: "CC-02",
    title: "Música en la sala",
    subtitle: "Un recorrido musical por las fiestas en la sala de la casa",
    venue: "Jaguarundí",
    presenter: "Jaguarundí presenta Cristian Calle",
    date: "2026-05-29",
    dateConfirmed: false,
    time: "19:00",
    address: "Vía Santa Elena km 10, sector La Rosita",
    genres: [],
    poster: images.posterSala,
    pending: ["Año [CONFIRMAR]", "Permiso para nombrar el lugar [CONFIRMAR]", "Archivo del afiche [PONER]"],
  },
  {
    id: "selektor-maizal",
    catalog: "CC-03",
    title: "Selektor",
    subtitle: "De solo música sabrosa",
    venue: "El Maizal · pub, laboratorio sonoro",
    date: "2026-05-15",
    dateConfirmed: false,
    time: null,
    address: "Santa Elena, vereda El Plan",
    genres: ["Solo música sabrosa"],
    poster: images.posterMaizal,
    pending: ["Año [CONFIRMAR]", "Hora [CONFIRMAR]", "Archivo del afiche [PONER]"],
  },
  {
    id: "arboro",
    catalog: "CC-04",
    title: "Sesión en Árboro",
    subtitle: "Selektor en la cabina",
    venue: "Árboro",
    date: null,
    dateConfirmed: false,
    time: null,
    genres: [],
    poster: images.posterArboro,
    pending: ["Fecha y detalles [CONFIRMAR]", "Foto de cabina [PONER]"],
  },
];

export const pillars: Pillar[] = [
  {
    id: "crecimiento",
    icon: "mountain",
    title: "Crecimiento personal",
    text: "Hábitos, decisiones y aprendizajes para ser mejor cada día.",
  },
  {
    id: "desarrollo",
    icon: "bicycle",
    title: "Desarrollo",
    text: "Trabajo, disciplina y propósito: crecer haciendo.",
  },
  {
    id: "buen-vivir",
    icon: "sun",
    title: "Buen vivir",
    text: "Sol, monte, buena mesa, buena música y gratitud.",
  },
];

/** [PONER] 3–6 reels (mp4 o URL del post). Mientras tanto, marcos pendientes que llevan al perfil. */
export const reels: Reel[] = [
  {
    poster: images.buenVivir[0]!,
    video: null,
    url: person.instagram.url,
    caption: "Café y bici, sol y monte, diversión y trabajo.",
    pending: true,
  },
  {
    poster: images.buenVivir[1]!,
    video: null,
    url: person.instagram.url,
    caption: "Reel del buen vivir · próximamente",
    pending: true,
  },
  {
    poster: images.buenVivir[2]!,
    video: null,
    url: person.instagram.url,
    caption: "Reel del buen vivir · próximamente",
    pending: true,
  },
];

export const contactTypes = [
  "Evento privado",
  "Boda",
  "Música en la sala",
  "Marca / empresa",
  "Colaboración buen vivir",
] as const;

export const nav = [
  { id: "hifi", label: "Hi-Fi", track: "A1" },
  { id: "lo-que-hace", label: "Lo que hace", track: "A2" },
  { id: "sesiones", label: "Sesiones", track: "A3" },
  { id: "buen-vivir", label: "El buen vivir", track: "B1" },
  { id: "contacto", label: "Contacto", track: "B2" },
] as const;

export const copy = {
  skip: "Saltar al contenido",
  hero: {
    label: "CC-001 · LADO A · SANTA ELENA, MEDELLÍN",
    accent: "Hi-Fi",
    footnote: "(high fidelity)",
    lead: "Eventos, música y experiencias en alta fidelidad: buen sonido, buena música y cada detalle en su punto.",
    primary: "Hablemos de tu evento",
    secondary: "Escuchar el lado B",
    portraitCaption: "Foto próximamente",
  },
  marquee: {
    row1: ["Rock", "Salsa", "Soul", "Jazz", "Blues", "Fusiones", "Clásicos en vinilo"],
    row2: ["MÚSICA SABROSA", "EVENTOS", "EXPERIENCIAS", "SANTA ELENA", "MEDELLÍN"],
  },
  manifesto: {
    eyebrow: "HI-FI = HIGH FIDELITY",
    heading: "Qué es Hi-Fi",
    body: "High fidelity es reproducir algo tal como es: sin ruido, sin pérdida, sin atajos. Cristian lleva esa idea a todo lo que hace. No solo al sonido: también a la atención, al lugar, a la comida, a la música y a la gente. Nada a medias. Todo en alta fidelidad.",
    specTitle: "HOJA TÉCNICA · CC-001",
    spec: [
      ["Respuesta", "de la primera idea al último tema"],
      ["Ruido", "0"],
      ["Fidelidad", "100 %"],
      ["Formato", "vinilo, en vivo, en la sala"],
      ["Origen", "Santa Elena, Medellín"],
    ] as [string, string][],
    vuLabel: "NIVEL DE SEÑAL",
  },
  services: {
    heading: "Lo que hace",
    label: "LADO A · 5 TEMAS",
    open: "Ver detalle",
    included: "Qué incluye",
    cta: "Cotizar por WhatsApp",
    close: "Cerrar",
  },
  sessions: {
    heading: "Sesiones",
    lead: "Algunas noches que ya sonaron.",
    label: "BUSCAR EN LA CAJA",
    prev: "Disco anterior",
    next: "Disco siguiente",
    pull: "Sacar el disco",
    putBack: "Guardar el disco",
    upcoming: "PRÓXIMA",
    played: "SONÓ EL",
    noDate: "FECHA POR CONFIRMAR",
    posterSoon: "Afiche próximamente",
    hint: "Arrastra, usa las flechas o el teclado",
    cta: "Llévalo a tu evento",
  },
  flip: {
    caption: "DALE VUELTA AL DISCO",
    sideA: "LADO A · HI-FI",
    sideB: "LADO B · EL BUEN VIVIR",
  },
  buenVivir: {
    eyebrow: "CC-002 · LADO B",
    heading: "El buen vivir",
    accent: "Café y bici, sol y monte, diversión y trabajo.",
    lead: "Cristian hace videos sobre crecimiento personal, desarrollo y el buen vivir: lo que aprende, lo que practica y la vida sencilla en la montaña, contado sin filtro.",
    gratitude: "Gracias, papá Dios.",
    reelsLabel: "REELS",
    reelSoon: "Reel próximamente",
    igHeading: "Síguelo en Instagram",
    followers: "seguidores",
    igButton: "Ver en Instagram",
    share: "Compartir",
    shareText: "Cristian Calle: eventos, música y buen vivir en alta fidelidad.",
  },
  contact: {
    label: "CC-003 · DE VUELTA AL LADO A",
    heading: "Hagamos algo en alta fidelidad.",
    lead: "Cuéntale a Cristian qué tienes en mente: un evento, una fiesta en casa, una boda o una colaboración.",
    fields: {
      nombre: "Nombre",
      celular: "Celular",
      tipo: "Tipo de plan",
      fecha: "Fecha",
      personas: "Número de personas",
      lugar: "Lugar",
      mensaje: "Mensaje",
      optional: "opcional",
    },
    placeholders: {
      nombre: "¿Cómo te llamas?",
      celular: "300 123 4567",
      personas: "Ej. 40",
      lugar: "Ej. Santa Elena",
      mensaje: "Cuéntale el plan, el ambiente que buscas, lo que imaginas…",
    },
    errors: {
      nombre: "Escribe tu nombre.",
      celular: "Escribe un celular de Colombia de 10 dígitos (empieza por 3).",
      tipo: "Elige el tipo de plan.",
      mensaje: "Cuéntale un poco más (mínimo 10 caracteres).",
      personas: "Escribe solo números.",
    },
    submit: "Enviar por WhatsApp",
    submitting: "Abriendo WhatsApp…",
    sent: "Listo. Se abrió WhatsApp con tu mensaje: solo dale enviar.",
    sentHint: "¿No se abrió? Copia el mensaje y pégalo en el chat.",
    copy: "Copiar mensaje",
    copied: "Mensaje copiado",
    copyError: "No se pudo copiar. Selecciona el texto manualmente.",
    again: "Escribir otro mensaje",
    direct: "DIRECTO",
    whatsappLabel: "WHATSAPP",
    instagramLabel: "INSTAGRAM",
    emailLabel: "CORREO",
    pendingValue: "Muy pronto",
    template:
      "¡Hola Cristian! Te escribo desde tu página.\nSoy {nombre} · Cel: {celular}\nTipo: {tipo} · Fecha: {fecha} · Personas: {personas}\nLugar: {lugar}\n{mensaje}",
    empty: "—",
  },
  footer: {
    small: "© 2026 Cristian Calle · Santa Elena, Medellín · Hecho en alta fidelidad.",
    back: "Volver al lado A",
    runout: "FIN DEL LADO · RUNOUT",
  },
  sound: {
    label: "SONIDO",
    on: "Silenciar",
    off: "Activar sonido",
    pending: "El sonido arrancará con tu primer clic",
  },
  floating: "Hablemos",
  navCta: "Hablemos",
  menu: { open: "Abrir menú", close: "Cerrar menú" },
  cursor: { record: "GIRAR", view: "VER" },
  photoSoon: "Foto próximamente",
  toast: { linkCopied: "Enlace copiado" },
} as const;

export const site = {
  /** [PONER] dominio definitivo → también en la variable SITE_URL del build. */
  url: null as string | null,
  title: "Cristian Calle | Eventos, música y buen vivir en alta fidelidad · Medellín",
  description:
    "Cristian Calle organiza eventos y selecciona música en vinilo en Santa Elena, Medellín. Hi-Fi en todo lo que hace, y videos sobre crecimiento personal y el buen vivir.",
  themeBrand: "#5C1A24",
  themeLight: "#F2E6D0",
};

/** Lista de material pendiente (overlay `?pending`). */
export function pendingList(): string[] {
  const out: string[] = [];
  if (!person.whatsapp) out.push("Número de WhatsApp [PONER]");
  if (!person.email) out.push("Correo [PONER]");
  if (!site.url) out.push("Dominio definitivo / SITE_URL [PONER]");
  out.push("Seguidores de Instagram (valor manual) [ACTUALIZAR]");
  const allImages: SiteImage[] = [
    images.retrato,
    images.cabina,
    images.vinilo,
    images.sala,
    images.posterBSide,
    images.posterSala,
    images.posterMaizal,
    ...images.buenVivir,
  ];
  allImages.filter((i) => !i.src).forEach((i) => out.push(`Imagen ${i.wanted} [PONER]`));
  services.forEach((s) => s.pending.forEach((p) => out.push(`${s.id} · ${s.title}: ${p}`)));
  sessions.forEach((s) => s.pending.forEach((p) => out.push(`${s.title}: ${p}`)));
  if (reels.some((r) => r.pending)) out.push("3–6 reels del buen vivir (mp4 o URL del post) [PONER]");
  out.push("Bio corta en sus palabras [PONER]");
  out.push("Textos marcados [AJUSTAR]: lead del hero, manifiesto, hoja técnica, pilares, contacto");
  out.push("Tercera persona vs. primera persona [AJUSTAR]");
  out.push("Testimonios: ninguno hasta que existan reales");
  out.push("Logo (si existe; si no, wordmark + monograma CC)");
  return out;
}
