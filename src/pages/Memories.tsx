import { useState, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { SITE_CONTENT } from "@/data/content"
import { MapPin, Calendar, Tag, ChevronRight, ChevronLeft } from "lucide-react"
import { cn } from "@/lib/utils"

export default function Memories() {
  const [filterYear, setFilterYear] = useState<string | null>(null)
  const [filterCategory, setFilterCategory] = useState<string | null>(null)
  const [filterLocation, setFilterLocation] = useState<string | null>(null)

  const { memories } = SITE_CONTENT

  // Extract unique filter options
  const years = useMemo(() => Array.from(new Set(memories.map(m => m.year))).sort((a, b) => b.localeCompare(a)), [memories])
  const categories = useMemo(() => Array.from(new Set(memories.map(m => m.category))).sort(), [memories])
  const locations = useMemo(() => Array.from(new Set(memories.map(m => m.location))).sort(), [memories])

  // Filter memories
  const filteredMemories = useMemo(() => {
    return memories.filter(m => {
      if (filterYear && m.year !== filterYear) return false
      if (filterCategory && m.category !== filterCategory) return false
      if (filterLocation && m.location !== filterLocation) return false
      return true
    })
  }, [memories, filterYear, filterCategory, filterLocation])

  return (
    <div className="flex-1 flex flex-col bg-background min-h-screen pt-24 px-4 md:px-8 pb-32">
      <div className="max-w-4xl mx-auto w-full">
        <div className="mb-16">
          <h1 className="text-4xl md:text-6xl font-heading font-light tracking-tight text-foreground">
            Recuerdos
          </h1>
          <p className="text-muted-foreground text-lg mt-4">
            Las historias que nos hicieron quienes somos.
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-4 mb-16 border-b border-border/50 pb-8">
          <FilterSelect 
            icon={<Calendar className="w-4 h-4" />} 
            options={years} 
            value={filterYear} 
            onChange={setFilterYear} 
            placeholder="Todos los Años" 
          />
          <FilterSelect 
            icon={<Tag className="w-4 h-4" />} 
            options={categories} 
            value={filterCategory} 
            onChange={setFilterCategory} 
            placeholder="Todas las Categorías" 
          />
          <FilterSelect 
            icon={<MapPin className="w-4 h-4" />} 
            options={locations} 
            value={filterLocation} 
            onChange={setFilterLocation} 
            placeholder="Todos los Lugares" 
          />
          
          {(filterYear || filterCategory || filterLocation) && (
            <button 
              onClick={() => {
                setFilterYear(null)
                setFilterCategory(null)
                setFilterLocation(null)
              }}
              className="text-xs font-sans uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors ml-auto"
            >
              Limpiar Filtros
            </button>
          )}
        </div>

        {/* Memory Cards */}
        <div className="space-y-24">
          <AnimatePresence mode="popLayout">
            {filteredMemories.map((memory, index) => (
              <motion.div
                key={memory.id}
                layout
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8, ease: [0.32, 0.72, 0, 1], delay: Math.min((index % 5) * 0.1, 0.5) }}
                className="bg-card rounded-[2rem] p-6 md:p-12 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-border/50 flex flex-col gap-8 group"
              >
                {/* Header info */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-border/30 pb-6">
                  <div>
                    <h2 className="text-3xl md:text-4xl font-heading font-medium text-foreground mb-4">
                      {memory.title}
                    </h2>
                    <div className="flex flex-wrap items-center gap-4 text-sm font-sans tracking-widest uppercase text-muted-foreground">
                      <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4 text-primary" /> {memory.date}</span>
                      <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4 text-primary" /> {memory.location}</span>
                      <span className="flex items-center gap-1.5"><Tag className="w-4 h-4 text-primary" /> {memory.category}</span>
                    </div>
                  </div>
                </div>

                {/* Story */}
                <p className="text-lg leading-relaxed text-muted-foreground font-light">
                  {memory.story}
                </p>

                {/* Photos */}
                {memory.photos && memory.photos.length > 0 && (
                  <div className="mt-4">
                    <PhotoGallery photos={memory.photos} />
                  </div>
                )}
              </motion.div>
            ))}

            {filteredMemories.length === 0 && (
              <motion.div 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                className="text-center py-24 text-muted-foreground"
              >
                No se encontraron recuerdos para estos filtros.
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}

function FilterSelect({ 
  icon, 
  options, 
  value, 
  onChange, 
  placeholder 
}: { 
  icon: React.ReactNode, 
  options: string[], 
  value: string | null, 
  onChange: (val: string | null) => void, 
  placeholder: string 
}) {
  return (
    <div className="relative group">
      <select 
        value={value || ""} 
        onChange={(e) => onChange(e.target.value === "" ? null : e.target.value)}
        className="appearance-none bg-muted/50 hover:bg-muted border border-border/50 text-foreground text-sm font-sans tracking-wide py-2.5 pl-10 pr-10 rounded-full cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
        aria-label={placeholder}
      >
        <option value="">{placeholder}</option>
        {options.map(opt => (
          <option key={opt} value={opt}>{opt}</option>
        ))}
      </select>
      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none">
        {icon}
      </div>
      <div className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none">
        <ChevronRight className="w-4 h-4 rotate-90" />
      </div>
    </div>
  )
}

function PhotoGallery({ photos }: { photos: string[] }) {
  const [currentIndex, setCurrentIndex] = useState(0)

  if (photos.length === 1) {
    return (
      <div className="w-full h-[300px] md:h-[400px] rounded-2xl overflow-hidden relative">
        <img src={photos[0]} alt="Foto del recuerdo" loading="lazy" className="w-full h-full object-cover" />
      </div>
    )
  }

  const next = () => setCurrentIndex((prev) => (prev + 1) % photos.length)
  const prev = () => setCurrentIndex((prev) => (prev - 1 + photos.length) % photos.length)

  return (
    <div className="relative w-full h-[300px] md:h-[400px] rounded-2xl overflow-hidden group">
      <AnimatePresence mode="wait">
        <motion.img
          key={currentIndex}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          src={photos[currentIndex]}
          alt={`Foto del recuerdo ${currentIndex + 1}`}
          loading="lazy"
          className="w-full h-full object-cover absolute inset-0"
        />
      </AnimatePresence>

      <div className="absolute inset-0 flex items-center justify-between p-4 opacity-0 group-hover:opacity-100 transition-opacity">
        <button 
          onClick={prev}
          className="w-10 h-10 rounded-full bg-background/50 backdrop-blur-md flex items-center justify-center text-foreground hover:bg-background transition-colors shadow-lg"
        >
          <ChevronLeft className="w-5 h-5 pr-0.5" />
        </button>
        <button 
          onClick={next}
          className="w-10 h-10 rounded-full bg-background/50 backdrop-blur-md flex items-center justify-center text-foreground hover:bg-background transition-colors shadow-lg"
        >
          <ChevronRight className="w-5 h-5 pl-0.5" />
        </button>
      </div>

      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
        {photos.map((_, idx) => (
          <div 
            key={idx} 
            className={cn(
              "w-2 h-2 rounded-full transition-all duration-300 shadow-sm",
              idx === currentIndex ? "bg-white w-4" : "bg-white/50"
            )}
          />
        ))}
      </div>
    </div>
  )
}
