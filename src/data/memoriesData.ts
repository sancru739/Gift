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
    line1: string
    line2: string
    greeting: string
  }
  memories: FlowerMemory[]
}

export const memoriesData: BouquetConfig = {
  // Imagen principal del ramo (fotorrealista, formato vertical 9:16)
  image: import.meta.env.BASE_URL + "images/bouquet.webp",

  // Textos de introducción (breves, poéticos y sutiles)
  intro: {
    preTitle: "Para vos.",
    title: "Hay algo que quiero mostrarte.",
    hint: "Tocá una flor.",
    hintSub: "Cada una guarda un recuerdo.",
  },

  // Configuración del mensaje de cierre al descubrir todos los recuerdos
  finale: {
    line1: "Y entre todos estos recuerdos,",
    line2: "hay uno que todavía quiero seguir construyendo con vos.",
    greeting: "Feliz 21 de septiembre.",
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
      title: "1. Canciones",
      message: "Desde que te conoci todas las canciones de amor me recuerdan a vos.",
      date: "",
      image: "",
    },
    {
      id: "hibiscus-02",
      flowerType: "hibiscus",
      flowerName: "Hibiscus Fucsia",
      position: { x: 61, y: 33, size: 18 },
      title: "2. Gracias",
      message: "Gracias por hacerme sentir especial, por tratarme como el dia 1, con tanto amor.",
      date: "",
      image: "",
    },
    {
      id: "hibiscus-03",
      flowerType: "hibiscus",
      flowerName: "Hibiscus Coral",
      position: { x: 89, y: 42, size: 18 },
      title: "3. La distancia",
      message: "Aunque estemos lejos, cada mensaje o llamada tuya me hace sentir que estás acá al lado mío.",
      date: "",
      image: "",
    },
    {
      id: "freesia-01",
      flowerType: "freesia",
      flowerName: "Fresias Amarillas",
      position: { x: 21, y: 29, size: 16 },
      title: "4. Mi apoyo",
      message: "Gracias por siempre apoyarme en mis cosas, por animarme a seguir y crecer.",
      date: "",
      image: "",
    },
    {
      id: "freesia-02",
      flowerType: "freesia",
      flowerName: "Fresias Crema",
      position: { x: 65, y: 23, size: 16 },
      title: "5. Charlas",
      message: "Me encanta sentir que puedo hablar de cualquier cosa con vos, pasar de momentos pavos a momentos serios y sentimentales, momentos donde podria pasar toda la vida hablando con vos.",
      date: "",
      image: "",
    },
    {
      id: "freesia-03",
      flowerType: "freesia",
      flowerName: "Fresias del Centro",
      position: { x: 63, y: 41, size: 15 },
      title: "6. Tu paciencia",
      message: "Primero, de nada, gracias a mi estás desarrollando mucho tu paciencia jaja. Segundo, gracias por bancarte mis pavadas y actitudes que te hacen enojar, o momentos donde te cuento cosas que no entendes y aun asi me escuchas.",
      date: "",
      image: "",
    },
    {
      id: "sunflower-01",
      flowerType: "sunflower",
      flowerName: "Girasol Radiante",
      position: { x: 68, y: 58, size: 20 },
      title: "7. Planes",
      message: "Me encanta saber que los dos aspiramos a un futuro juntos, me emociona saber que voy a pasar el resto de mi vida juntos y que un dia esta distancia se va a acabar.",
      date: "",
      image: "",
    },
    {
      id: "rose-01",
      flowerType: "rose",
      flowerName: "Rosa Roja",
      position: { x: 74, y: 49, size: 17 },
      title: "8. Mi lugar seguro",
      message: "Saber que cualquier cosa que pase siempre vas a estar ahi para mi, tenés la palabra justa para hacerme sentir mejor, y solo con verte me olvido de todos mis problemas.",
      date: "",
      image: "",
    },
    {
      id: "rose-02",
      flowerType: "rose",
      flowerName: "Rosa Rosa Suave",
      position: { x: 37, y: 58, size: 16 },
      title: "9. Dia a dia",
      message: "Me encanta que seas parte de mi dia a dia, que nos contemos todo lo que nos pase, aun que estemos distanciados, hacernos sentir parte de cada cosa chiquita del otro.",
      date: "",
      image: "",
    },
    {
      id: "rose-03",
      flowerType: "rose",
      flowerName: "Rosa Rosa Lateral",
      position: { x: 24, y: 40, size: 16 },
      title: "10. Elegirnos",
      message: "A pesar de los km que nos separan, de tener dias dificiles, o momentos donde queremos nuestro espacio, siempre nos elegimos y tenemos la certeza de permanecer juntos.",
      date: "",
      image: "",
    },
    {
      id: "gerbera-01",
      flowerType: "gerbera",
      flowerName: "Gerbera Coral",
      position: { x: 20, y: 48, size: 17 },
      title: "11. Tu cariño",
      message: "La ternura con la que me cuidás y lo seguro que me siento cuando estoy con vos.",
      date: "",
      image: "",
    },
    {
      id: "gerbera-02",
      flowerType: "gerbera",
      flowerName: "Gerbera Fucsia",
      position: { x: 77, y: 41, size: 16 },
      title: "12. Futuro",
      message: "Las ganas inmensas que tengo de abrazarte fuerte y seguir construyendo esto tan lindo que tenemos.",
      date: "",
      image: "",
    },
    {
      id: "daisy-01",
      flowerType: "daisy",
      flowerName: "Margaritas Blancas",
      position: { x: 88, y: 51, size: 16 },
      title: "13. Llamadas",
      message: "Mi momento favorito del dia es cuando pasamos tiempo en llamada, volver a escucharte y estar con vos hace que los dias pesen menos y sean mas felices.",
      date: "",
      image: "",
    },
    {
      id: "freesia-04",
      flowerType: "freesia",
      flowerName: "Fresia de la Base",
      position: { x: 26, y: 54, size: 16 },
      title: "14. Despedidas",
      message: "Algo que detesto, despedirme de vos, te extraño cada dia que pasa, pero me alegra saber que nos volveremos a encontrar.",
      date: "",
      image: "",
    },
  ],
}
