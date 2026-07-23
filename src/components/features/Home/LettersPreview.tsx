import { motion } from "framer-motion"

const LETTERS = [
  { id: 1, date: "12 Oct, 2023", snippet: "Estaba pensando en cómo la luz acariciaba tu rostro esta mañana..." },
  { id: 2, date: "04 Nov, 2023", snippet: "A veces olvido lo afortunados que somos. Luego recuerdo aquella cafetería..." },
  { id: 3, date: "25 Dic, 2023", snippet: "Feliz Navidad. Eres el único regalo que realmente quise conservar." },
  { id: 4, date: "01 Ene, 2024", snippet: "Un nuevo año. Más tiempo para pasar explorando el mapa de tu mente." },
]

export default function LettersPreview() {
  return (
    <section className="py-32 bg-background overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 mb-16">
        <h2 className="text-3xl md:text-4xl font-heading font-light tracking-tight text-foreground">
          Palabras en el Tiempo
        </h2>
      </div>

      <div className="flex overflow-x-auto pb-12 pt-4 px-4 md:px-12 snap-x snap-mandatory hide-scrollbar gap-8">
        {LETTERS.map((letter, index) => (
          <motion.div
            key={letter.id}
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="snap-center shrink-0 w-[85vw] md:w-[400px] h-[500px] bg-card rounded-[24px] p-10 flex flex-col justify-between shadow-[0_4px_20px_rgb(0,0,0,0.03)] hover:shadow-[0_20px_40px_rgb(0,0,0,0.06)] transition-all duration-500 cursor-pointer hover:-translate-y-2 border border-black/[0.02]"
          >
            <div className="text-sm font-sans tracking-widest text-muted-foreground">
              {letter.date}
            </div>
            
            <div className="flex-1 flex items-center justify-center">
              <p className="font-heading italic text-2xl text-foreground/80 leading-relaxed text-center">
                "{letter.snippet}"
              </p>
            </div>
            
            <div className="text-center text-xs font-sans text-muted-foreground uppercase tracking-widest">
              Leer Carta
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
