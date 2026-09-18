/**
 * =======================================================================
 * DATOS DE LOS RECUERDOS DEL RAMO — 21 DE SEPTIEMBRE
 * =======================================================================
 *
 * Podés modificar fácilmente los textos, títulos, fechas y posiciones
 * sin tocar ningún componente de la interfaz.
 *
 * POSICIONES (Porcentajes respecto a la imagen 0-100%):
 * - x: Posición horizontal (de 0 = izquierda a 100 = derecha)
 * - y: Posición vertical (de 0 = arriba a 100 = abajo)
 * - size: Diámetro del área táctil (opcional, por defecto 16%)
 */

export type FlowerType =
  | "hibiscus"
  | "freesia"
  | "sunflower"
  | "rose"
  | "gerbera"
  | "daisy"
  | "alstroemeria"
  | "baby-breath"
  | "other"

export interface FlowerPosition {
  x: number // Porcentaje horizontal (0 a 100)
  y: number // Porcentaje vertical (0 a 100)
  size?: number // Tamaño relativo en porcentaje (por defecto ~16%)
}

export interface FlowerMemory {
  id: string
  flowerType: FlowerType | string
  flowerName: string // Etiqueta descriptiva para el modal (ej: "Hibiscus Central")
  position: FlowerPosition
  title: string // Título del recuerdo
  message: string // Texto o relato del recuerdo
  date?: string // Fecha u ocasión opcional (ej: "14 de Febrero", "Septiembre 2025")
  image?: string // Imagen / foto opcional asociada a este recuerdo
}

export interface BouquetConfig {
  image: string
  intro: {
    preTitle: string
    title: string
    hint: string
    hintSub: string
  }
  finale: {
    preTitle: string
    title: string
    subtitle: string
    finalNote: string
    countdownLabel: string
  }
  memories: FlowerMemory[]
}

export const memoriesData: BouquetConfig = {
  // Imagen principal del ramo (fotorrealista, formato vertical 9:16)
  image: import.meta.env.BASE_URL + "images/bouquet.jpg",

  // Textos de introducción (breves, poéticos y sutiles)
  intro: {
    preTitle: "Para vos.",
    title: "Hay algo que quiero mostrarte.",
    hint: "Tocá una flor.",
    hintSub: "Cada una guarda un recuerdo.",
  },

  // Configuración del mensaje final al descubrir todos los recuerdos
  finale: {
    preTitle: "Descubriste todos los recuerdos",
    title: "Te amo.",
    subtitle: "Hoy, mañana, y todos los días que vengan.",
    finalNote: "Cada segundo que pasa es uno menos para volver a abrazarte.",
    countdownLabel: "Para volver a vernos",
  },

  // =====================================================================
  // LISTA DE RECUERDOS (Placeholders identificables listos para tus textos)
  // =====================================================================
  memories: [
    {
      id: "hibiscus-01",
      flowerType: "hibiscus",
      flowerName: "Hibiscus Central",
      position: { x: 48, y: 45, size: 22 },
      title: "[Título del Recuerdo #1 — Hibiscus Protagonista]",
      message:
        "[Escribí acá el recuerdo principal que quieras compartir. Esta es la flor más grande y destacada del ramo, el corazón de la sorpresa.]",
      date: "Septiembre 2025",
      image: "", // Si querés agregar foto, poné la ruta ej: "/Gift/images/foto1.jpg"
    },
    {
      id: "hibiscus-02",
      flowerType: "hibiscus",
      flowerName: "Hibiscus Fucsia",
      position: { x: 61, y: 33, size: 18 },
      title: "[Título del Recuerdo #2 — Hibiscus Superior]",
      message:
        "[Escribí acá otro recuerdo especial o mensaje íntimo asociado a esta flor fucsia brillante.]",
      date: "",
      image: "",
    },
    {
      id: "hibiscus-03",
      flowerType: "hibiscus",
      flowerName: "Hibiscus Coral",
      position: { x: 89, y: 42, size: 18 },
      title: "[Título del Recuerdo #3 — Hibiscus Coral]",
      message:
        "[Escribí acá un momento divertido, una anécdota o algo que siempre te haga sonreír al recordarlo.]",
      date: "",
      image: "",
    },
    {
      id: "freesia-01",
      flowerType: "freesia",
      flowerName: "Fresias Amarillas",
      position: { x: 21, y: 29, size: 16 },
      title: "[Título del Recuerdo #4 — Fresias de la Primavera]",
      message:
        "[Escribí acá un recuerdo relacionado con el 21 de septiembre, el amarillo de la primavera o cómo ilumina tus días.]",
      date: "21 de Septiembre",
      image: "",
    },
    {
      id: "freesia-02",
      flowerType: "freesia",
      flowerName: "Fresias Crema",
      position: { x: 65, y: 23, size: 16 },
      title: "[Título del Recuerdo #5 — Fresias Crema]",
      message:
        "[Escribí acá un recuerdo de tranquilidad, un abrazo o una tarde compartida que te haya marcado.]",
      date: "",
      image: "",
    },
    {
      id: "freesia-03",
      flowerType: "freesia",
      flowerName: "Fresias del Centro",
      position: { x: 63, y: 41, size: 15 },
      title: "[Título del Recuerdo #6 — Pequeños Detalles]",
      message:
        "[Escribí acá sobre un detalle simple que amás de ella: su risa, su mirada o sus ocurrencias.]",
      date: "",
      image: "",
    },
    {
      id: "sunflower-01",
      flowerType: "sunflower",
      flowerName: "Girasol Radiante",
      position: { x: 68, y: 58, size: 20 },
      title: "[Título del Recuerdo #7 — Girasol]",
      message:
        "[Escribí acá un recuerdo sobre la alegría, la luz que trae a tu vida y lo mucho que admirás su energía.]",
      date: "",
      image: "",
    },
    {
      id: "rose-01",
      flowerType: "rose",
      flowerName: "Rosa Roja",
      position: { x: 74, y: 49, size: 17 },
      title: "[Título del Recuerdo #8 — Rosa Roja]",
      message:
        "[Escribí acá una declaración sincera y apasionada de lo que sentís por ella.]",
      date: "",
      image: "",
    },
    {
      id: "rose-02",
      flowerType: "rose",
      flowerName: "Rosa Rosa Suave",
      position: { x: 37, y: 58, size: 16 },
      title: "[Título del Recuerdo #9 — Ternura]",
      message:
        "[Escribí acá sobre los momentos dulces, la ternura y la complicidad entre ustedes.]",
      date: "",
      image: "",
    },
    {
      id: "rose-03",
      flowerType: "rose",
      flowerName: "Rosa Rosa Lateral",
      position: { x: 24, y: 40, size: 16 },
      title: "[Título del Recuerdo #10 — Primer Encuentro]",
      message:
        "[Escribí acá sobre la primera vez que se vieron o cuando supiste que era alguien única.]",
      date: "",
      image: "",
    },
    {
      id: "gerbera-01",
      flowerType: "gerbera",
      flowerName: "Gerbera Coral",
      position: { x: 20, y: 48, size: 17 },
      title: "[Título del Recuerdo #11 — Gerbera]",
      message:
        "[Escribí acá sobre un viaje, una salida o una aventura que hayan compartido juntos.]",
      date: "",
      image: "",
    },
    {
      id: "gerbera-02",
      flowerType: "gerbera",
      flowerName: "Gerbera Fucsia",
      position: { x: 77, y: 41, size: 16 },
      title: "[Título del Recuerdo #12 — Risas Compartidas]",
      message:
        "[Escribí acá un recuerdo gracioso o una charla que no querías que terminara nunca.]",
      date: "",
      image: "",
    },
    {
      id: "daisy-01",
      flowerType: "daisy",
      flowerName: "Margaritas Blancas",
      position: { x: 88, y: 51, size: 16 },
      title: "[Título del Recuerdo #13 — Margaritas]",
      message:
        "[Escribí acá sobre la belleza de las cosas cotidianas y simples que construyen su historia día a día.]",
      date: "",
      image: "",
    },
    {
      id: "freesia-04",
      flowerType: "freesia",
      flowerName: "Fresia de la Base",
      position: { x: 26, y: 54, size: 16 },
      title: "[Título del Recuerdo #14 — El Futuro Juntos]",
      message:
        "[Escribí acá sobre los sueños y planes que tienen para adelante.]",
      date: "",
      image: "",
    },
  ],
}
