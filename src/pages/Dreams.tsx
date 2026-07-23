import { useState, useMemo } from "react"
import { motion } from "framer-motion"
import { SITE_CONTENT } from "@/data/content"
import { Plane, Utensils, Film, Map, Target, Star, CheckCircle2, CircleDashed, Clock, Lock } from "lucide-react"
import { cn } from "@/lib/utils"

export default function Dreams() {
  const [activeCategory, setActiveCategory] = useState<string>("Todos")
  
  const { dreams } = SITE_CONTENT

  const categories = useMemo(() => {
    const cats = new Set(dreams.map(d => d.category))
    return ["Todos", ...Array.from(cats).sort()]
  }, [dreams])

  const filteredDreams = useMemo(() => {
    if (activeCategory === "Todos") return dreams
    return dreams.filter(d => d.category === activeCategory)
  }, [dreams, activeCategory])

  return (
    <div className="flex-1 flex flex-col bg-background min-h-screen pt-24 px-4 md:px-8 pb-32">
      <div className="max-w-6xl mx-auto w-full">
        <div className="mb-16">
          <h1 className="text-4xl md:text-6xl font-heading font-light tracking-tight text-foreground">
            Sueños a cumplir
          </h1>
          <p className="text-muted-foreground text-lg mt-4">
            Todo lo que esperamos vivir
          </p>
        </div>

        {/* Locked Overlay */}
        <div className="relative w-full">
          {/* Overlay text */}
          <div className="absolute inset-0 z-50 flex items-center justify-center -top-20">
            <div className="bg-background/60 backdrop-blur-md px-10 py-6 rounded-[2rem] border border-border shadow-2xl flex flex-col items-center gap-4">
              <Lock className="w-8 h-8 text-muted-foreground" />
              <h2 className="text-3xl md:text-5xl font-heading text-foreground font-medium tracking-tight">
                Para más adelante
              </h2>
            </div>
          </div>

          <div className="blur-xl opacity-40 select-none pointer-events-none transition-all duration-1000">
            {/* Categories Tab Bar */}
            <div className="flex overflow-x-auto hide-scrollbar gap-2 mb-12 pb-4">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  className={cn(
                    "px-6 py-2.5 rounded-full font-sans text-sm tracking-wide transition-all whitespace-nowrap",
                    activeCategory === category 
                      ? "bg-foreground text-background shadow-md" 
                      : "bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                >
                  {category}
                </button>
              ))}
            </div>

            {/* Dreams Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredDreams.map((dream, index) => (
                <DreamCard key={dream.id} dream={dream} index={index} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function DreamCard({ dream, index }: { dream: any, index: number }) {
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "Viajes": return <Plane className="w-4 h-4" />
      case "Restaurantes": return <Utensils className="w-4 h-4" />
      case "Películas": return <Film className="w-4 h-4" />
      case "Ciudades": return <Map className="w-4 h-4" />
      case "Metas": return <Target className="w-4 h-4" />
      case "Lista de Deseos": return <Star className="w-4 h-4" />
      default: return <Star className="w-4 h-4" />
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Completado": return <CheckCircle2 className="w-4 h-4 text-green-500" />
      case "En Progreso": return <Clock className="w-4 h-4 text-primary" />
      default: return <CircleDashed className="w-4 h-4 text-muted-foreground" />
    }
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ ease: [0.32, 0.72, 0, 1], duration: 0.8, delay: Math.min((index % 3) * 0.1, 0.3) }}
      className="bg-card rounded-[2rem] p-8 flex flex-col justify-between shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-border/50 group hover:shadow-[0_20px_40px_rgba(212,163,115,0.08)] transition-all duration-500 hover:-translate-y-1"
    >
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary w-fit">
            {getCategoryIcon(dream.category)}
            <span className="text-xs font-sans font-medium tracking-wide uppercase">{dream.category}</span>
          </div>
          
          <div className="flex items-center gap-1.5 bg-muted/50 px-3 py-1 rounded-full">
            {getStatusIcon(dream.status)}
            <span className="text-xs font-sans tracking-wide text-muted-foreground">{dream.status}</span>
          </div>
        </div>

        <h3 className="text-2xl font-heading font-medium text-foreground leading-snug">
          {dream.title}
        </h3>

        <p className="text-sm font-sans text-muted-foreground italic leading-relaxed">
          {dream.notes}
        </p>
      </div>

      <div className="mt-8 space-y-3">
        <div className="flex items-center justify-between text-xs font-sans text-muted-foreground">
          <span>Progreso</span>
          <span>{dream.progress}%</span>
        </div>
        
        {/* Beautiful Animated Progress Bar */}
        <div className="h-2 w-full bg-muted rounded-full overflow-hidden relative">
          <motion.div 
            initial={{ width: 0 }}
            whileInView={{ width: `${dream.progress}%` }}
            viewport={{ once: true }}
            transition={{ ease: [0.32, 0.72, 0, 1], duration: 1.5, delay: 0.2 }}
            className={cn(
              "h-full rounded-full relative overflow-hidden",
              dream.status === "Completado" ? "bg-green-500/80" : "bg-primary"
            )}
          >
            {/* Shimmer effect for In Progress items */}
            {dream.status === "En Progreso" && (
              <motion.div
                initial={{ x: "-100%" }}
                animate={{ x: "200%" }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 w-1/2 bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-12"
              />
            )}
          </motion.div>
        </div>
      </div>
    </motion.div>
  )
}
