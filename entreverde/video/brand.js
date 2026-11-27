// Configuración de marca: Entreverde. Todo sale del material recibido:
// PDF de artefinal del logo, captura del perfil de Instagram y fotos del lugar.
window.BRAND = {
  nombre: "Entreverde",
  usuario: "entrevrde", // así aparece en la captura del perfil
  lema: "Tragos y comidas que se comparten", // lema del logo (PDF)
  bio: [
    "“Tragos y comida que se comparten”",
    "📍 Santa Elena",
    "⏱️ Fines de semana: 4 pm a media noche",
  ],
  stats: { publicaciones: "17", seguidores: "1.799", seguidos: "22" }, // reales, de la captura

  // Paleta medida (ver assets/palette_medida.json)
  color: {
    primario: "#44493A",   // Oliva profundo: fondo del artboard 1 del logo
    secundario: "#758457", // Verde Entreverde: artboard 3 del PDF del logo
    acento: "#DBB485",     // Madera: las sillas de la barra (foto)
    claro: "#ECEBE8",      // Crema: tinta del logo
    oscuro: "#2A2D23",     // Carbón oliva: el oliva del logo llevado a sombra (como el contenedor negro)
    medio: "#616850",      // Oliva medio: artboard 2
    salvia: "#62665C",     // Gris salvia: artboard 4
    corten: "#694331",     // Aviso de acero corten (foto)
    luz: "#F2D8AE",        // Luz cálida de las banderas de noche (foto)
  },

  fuentes: {
    titular: "'Cormorant Garamond', serif",
    texto: "'Inter', sans-serif",
    etiqueta: "'Montserrat', sans-serif",
  },

  // Menú real, de las banderas del lugar
  menu: ["Hamburguesa", "Perro caliente", "Desgranados", "Platos a la plancha", "Bebidas calientes", "Cocteles", "Cerveza"],

  // Texto real de la historia destacada "Ubicación"
  destacada: ["Buena comida,", "brisa natural", "y el mejor ambiente.", "Te esperamos", "bajo el cielo abierto."],

  // Momento de la marca: reapertura (dato del cliente)
  reapertura: { arriba: "Estamos de", titulo: "Reapertura", anillo: "Reapertura · Entreverde · Santa Elena" },

  // Cierre: contacto de la agencia (pendiente)
  agencia: { nombre: "[TU AGENCIA]", contacto: "[TU @ / WHATSAPP]" },
};
