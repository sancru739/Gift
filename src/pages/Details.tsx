import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import DetailsGallery from "@/components/features/Details/DetailsGallery"
import UploadModal from "@/components/features/Details/UploadModal"
import { Lock } from "lucide-react"

export default function Details() {
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false)
  const [refreshTrigger, setRefreshTrigger] = useState(0)

  // Secret trigger: type "admin"
  useEffect(() => {
    let typed = ""
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if typing in an input or textarea
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return
      }

      typed += e.key
      if (typed.length > 5) typed = typed.slice(1)
      if (typed.toLowerCase() === "admin") {
        setIsUploadModalOpen(true)
        typed = ""
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [])

  const handleUploadSuccess = () => {
    // Increment to trigger a re-fetch in the gallery
    setRefreshTrigger(prev => prev + 1)
  }

  return (
    <div className="flex-1 flex flex-col min-h-screen bg-background relative">
      
      {/* Header Section */}
      <section className="pt-32 pb-16 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-primary/5 pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[50vh] bg-primary/10 blur-[120px] rounded-full pointer-events-none" />
        
        <div className="max-w-5xl mx-auto relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-muted-foreground text-sm tracking-widest uppercase mb-8"
          >
            <Lock className="w-4 h-4" />
            Rincón Especial
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-4xl md:text-6xl font-heading font-light tracking-tight text-foreground mb-6"
          >
            Detalles y Recuerdos
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-lg md:text-xl text-muted-foreground font-light max-w-2xl mx-auto"
          >
            Cartas, documentos y pequeños grandes tesoros que merecen ser guardados para siempre.
          </motion.p>
        </div>
      </section>

      {/* Gallery Section */}
      <section className="flex-1 px-4 pb-32 max-w-6xl mx-auto w-full">
        <DetailsGallery refreshTrigger={refreshTrigger} />
      </section>

      <UploadModal 
        isOpen={isUploadModalOpen} 
        onClose={() => setIsUploadModalOpen(false)} 
        onSuccess={handleUploadSuccess}
      />
    </div>
  )
}
