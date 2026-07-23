import { useState } from "react"
import { motion } from "framer-motion"
import { Check } from "lucide-react"
import { cn } from "@/lib/utils"

const INITIAL_DREAMS = [
  { id: 1, text: "Visitar Japón en la temporada de cerezos", completed: false },
  { id: 2, text: "Adoptar un golden retriever", completed: false },
  { id: 3, text: "Construir nuestra casa de los sueños", completed: false },
  { id: 4, text: "Ver las Auroras Boreales", completed: true },
  { id: 5, text: "Hacer un viaje por carretera", completed: false },
]

export default function DreamsPreview() {
  const [dreams, setDreams] = useState(INITIAL_DREAMS)

  const toggleDream = (id: number) => {
    setDreams(dreams.map(dream => 
      dream.id === id ? { ...dream, completed: !dream.completed } : dream
    ))
  }

  return (
    <section className="py-32 px-4 bg-muted/30">
      <div className="max-w-3xl mx-auto">
        <div className="mb-16 space-y-4 text-center md:text-left">
          <h2 className="text-3xl md:text-4xl font-heading font-light tracking-tight text-foreground">
            Sueños a cumplir
          </h2>
          <p className="text-muted-foreground text-lg">Todo lo que esperamos vivir</p>
        </div>

        <div className="space-y-2">
          {dreams.map((dream) => (
            <DreamItem key={dream.id} dream={dream} onToggle={() => toggleDream(dream.id)} />
          ))}
        </div>
      </div>
    </section>
  )
}

function DreamItem({ dream, onToggle }: { dream: any, onToggle: () => void }) {
  return (
    <motion.button
      layout
      onClick={onToggle}
      className={cn(
        "w-full group flex items-center gap-4 p-4 rounded-2xl transition-all duration-300 hover:bg-background border border-transparent hover:border-border/50",
        dream.completed ? "opacity-60" : "opacity-100"
      )}
    >
      <div className={cn(
        "relative flex items-center justify-center w-6 h-6 rounded-[6px] border transition-colors duration-300",
        dream.completed ? "bg-primary border-primary" : "border-muted-foreground/30 group-hover:border-primary/50 bg-background"
      )}>
        <motion.div
          initial={false}
          animate={{ scale: dream.completed ? 1 : 0, opacity: dream.completed ? 1 : 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
          <Check className="w-4 h-4 text-primary-foreground" strokeWidth={3} />
        </motion.div>
        
        {/* Subtle burst animation on click */}
        {dream.completed && (
          <motion.div
            initial={{ scale: 0.8, opacity: 0.8 }}
            animate={{ scale: 1.5, opacity: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="absolute inset-0 rounded-[6px] border border-primary pointer-events-none"
          />
        )}
      </div>
      
      <span className={cn(
        "font-sans text-lg transition-all duration-300 text-left",
        dream.completed ? "line-through text-muted-foreground decoration-muted-foreground/30" : "text-foreground"
      )}>
        {dream.text}
      </span>
    </motion.button>
  )
}
