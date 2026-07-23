import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { SITE_CONTENT } from "@/data/content"

import { PremiumModal } from "@/components/ui/PremiumModal"

export default function Gallery() {
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null)

  return (
    <div className="flex-1 flex flex-col bg-background min-h-screen pt-24 px-4 md:px-8 pb-32">
      <div className="max-w-[1600px] mx-auto w-full">
        <div className="mb-20 px-4">
          <h1 className="text-4xl md:text-6xl font-heading font-light tracking-tight text-foreground">
            Galería
          </h1>
          <p className="text-muted-foreground text-lg mt-4">
            Una colección de luz, capturada en el tiempo.
          </p>
        </div>

        {/* Pinterest-like Masonry Grid using CSS Columns */}
        <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-6 space-y-6">
          {SITE_CONTENT.gallery.map((photo, index) => (
            <motion.div
              key={photo.id}
              layoutId={`gallery-container-${photo.id}`}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "100px" }}
              transition={{ ease: [0.32, 0.72, 0, 1], duration: 0.8, delay: Math.min((index % 4) * 0.1, 0.5) }}
              onClick={() => setSelectedPhoto(photo.id)}
              className="break-inside-avoid relative overflow-hidden rounded-[2rem] cursor-pointer group bg-muted"
            >
              <motion.img
                layoutId={`gallery-image-${photo.id}`}
                src={photo.src}
                alt={photo.alt}
                loading="lazy"
                className="w-full h-auto object-cover transition-transform duration-[2s] ease-out group-hover:scale-105"
              />
              
              {/* Hover overlay for date/caption */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-6">
                <p className="text-white/80 text-xs font-sans tracking-widest uppercase mb-2">
                  {photo.date}
                </p>
                <p className="text-white font-sans text-sm line-clamp-2">
                  {photo.caption}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Fullscreen Modal */}
      <AnimatePresence>
        {selectedPhoto && (
          <ExpandedPhoto 
            photoId={selectedPhoto} 
            onClose={() => setSelectedPhoto(null)} 
          />
        )}
      </AnimatePresence>
    </div>
  )
}

function ExpandedPhoto({ photoId, onClose }: { photoId: string, onClose: () => void }) {
  const photo = SITE_CONTENT.gallery.find(p => p.id === photoId)
  
  if (!photo) return null

  return (
    <PremiumModal 
      onClose={onClose}
      transparent
      innerClassName="max-w-[1800px] h-full flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-16 pointer-events-none"
    >
      {/* Image Container */}
      <motion.div
        layoutId={`gallery-container-${photo.id}`}
        transition={{ ease: [0.32, 0.72, 0, 1], duration: 0.8 }}
        className="relative w-full lg:w-2/3 h-[50vh] lg:h-[85vh] rounded-[2rem] md:rounded-[3rem] overflow-hidden shadow-2xl pointer-events-auto"
      >
        <motion.img 
          layoutId={`gallery-image-${photo.id}`}
          transition={{ ease: [0.32, 0.72, 0, 1], duration: 0.8 }}
          src={photo.src} 
          alt={photo.alt} 
          className="w-full h-full object-cover" 
        />
      </motion.div>

      {/* Caption Container */}
      <motion.div 
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 20 }}
        transition={{ ease: [0.32, 0.72, 0, 1], duration: 0.8, delay: 0.1 }}
        className="w-full lg:w-1/3 flex flex-col justify-center pointer-events-auto px-4 lg:px-0"
      >
        <div className="space-y-6 max-w-md">
          <div className="w-12 h-[1px] bg-primary" />
          <p className="text-sm font-sans tracking-widest text-primary uppercase">
            {photo.date}
          </p>
          <p className="font-heading text-2xl md:text-3xl lg:text-4xl text-foreground leading-snug">
            {photo.caption}
          </p>
        </div>
      </motion.div>
    </PremiumModal>
  )
}
