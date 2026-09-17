/**
 * Contenido del ramo interactivo — 21 de septiembre.
 *
 * TODO: Editá los textos de cada recuerdo antes del 21.
 * Las zonas (top/left/width/height) son porcentajes sobre la imagen del ramo.
 */

export interface FlowerMemory {
  id: string
  flower: string
  zone: {
    top: number
    left: number
    width: number
    height: number
  }
  memory: {
    title: string
    text: string
    date?: string
    photo?: string
  }
}

export const bouquetContent = {
  // Imagen del ramo
  image: import.meta.env.BASE_URL + "images/bouquet.jpg",

  // Pantalla de intro
  intro: {
    preTitle: "21 de septiembre",
    title: "Esto es para vos.",
    hint: "Tocá una flor...",
    hintSub: "Cada una guarda un recuerdo.",
  },

  // Flores interactivas — 7 flores mapeadas sobre la imagen
  // Las zonas están calibradas para la imagen generada (9:16)
  flowers: [
    {
      id: "hibiscus",
      flower: "Hibiscus",
      zone: { top: 37, left: 34, width: 32, height: 18 },
      memory: {
        title: "Nuestro comienzo",
        text: "Placeholder: Escribí acá el recuerdo asociado al Hibiscus. Esta es la flor protagonista del ramo.",
        date: "Septiembre 2025",
      },
    },
    {
      id: "fresia-amarilla",
      flower: "Fresia",
      zone: { top: 25, left: 13, width: 18, height: 12 },
      memory: {
        title: "Un momento especial",
        text: "Placeholder: Escribí acá el recuerdo asociado a la Fresia.",
        date: "",
      },
    },
    {
      id: "fresia-crema",
      flower: "Fresia crema",
      zone: { top: 19, left: 57, width: 18, height: 10 },
      memory: {
        title: "Esa vez que...",
        text: "Placeholder: Escribí acá el recuerdo asociado a la Fresia crema.",
        date: "",
      },
    },
    {
      id: "girasol",
      flower: "Girasol",
      zone: { top: 52, left: 58, width: 21, height: 13 },
      memory: {
        title: "Luz en mis días",
        text: "Placeholder: Escribí acá el recuerdo asociado al Girasol.",
        date: "",
      },
    },
    {
      id: "rosa-roja",
      flower: "Rosa roja",
      zone: { top: 45, left: 65, width: 17, height: 10 },
      memory: {
        title: "Lo que siento",
        text: "Placeholder: Escribí acá el recuerdo asociado a la Rosa roja.",
        date: "",
      },
    },
    {
      id: "gerbera",
      flower: "Gerbera coral",
      zone: { top: 44, left: 12, width: 17, height: 11 },
      memory: {
        title: "Tu sonrisa",
        text: "Placeholder: Escribí acá el recuerdo asociado a la Gerbera.",
        date: "",
      },
    },
    {
      id: "margaritas",
      flower: "Margaritas",
      zone: { top: 45, left: 80, width: 15, height: 11 },
      memory: {
        title: "Las cosas simples",
        text: "Placeholder: Escribí acá el recuerdo asociado a las Margaritas.",
        date: "",
      },
    },
  ] as FlowerMemory[],

  // Mensaje final al descubrir todas las flores
  finale: {
    preTitle: "Descubriste todos los recuerdos",
    title: "Te amo.",
    subtitle: "Hoy, mañana, y todos los días que vengan.",
    finalNote: "Cada segundo que pasa es uno menos para volver a abrazarte.",
    countdownLabel: "Para volver a vernos",
  },
}
