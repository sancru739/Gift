import { useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X } from "lucide-react"
import type { FlowerMemory } from "@/data/memoriesData"

interface MemoryModalProps {
  flower: FlowerMemory | null
  onClose: () => void
}

export function MemoryModal({ flower, onClose }: MemoryModalProps) {
  // Lock body scroll on mobile/desktop while open
  useEffect(() => {
    if (flower) {
      document.body.style.overflow = "hidden"
      return () => {
        document.body.style.overflow = ""
      }
    }
  }, [flower])

  // ESC key support for desktop
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [onClose])

  return (
    <AnimatePresence>
      {flower && (
        <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center pointer-events-auto">
          {/* Backdrop — intercepts all touch & clicks to protect background */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-md touch-none select-none"
            onClick={onClose}
            aria-hidden="true"
          />

          {/* Modal Card — Bottom sheet on mobile, centered modal on desktop */}
          <motion.div
            key="modal-card"
            initial={{ opacity: 0, y: 60, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.96 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] as const }}
            drag="y"
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={0.4}
            onDragEnd={(_, info) => {
              if (info.offset.y > 100 || info.velocity.y > 500) {
                onClose();
              }
            }}
            className="relative z-50 w-full max-w-lg mx-3 mb-3 md:mb-0 md:mx-auto max-h-[85vh] flex flex-col bg-black/60 border border-white/10 backdrop-blur-2xl rounded-3xl shadow-[0_20px_70px_rgba(0,0,0,0.8)] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="memory-title"
          >
            {/* Drag Handle (Pill) para mobile */}
            <div className="w-full flex justify-center pt-3 pb-1 md:hidden touch-none shrink-0 cursor-grab active:cursor-grabbing">
              <div className="w-10 h-1.5 bg-white/20 rounded-full" />
            </div>

            {/* Close Button — Large touch target for mobile (min 44x44px) */}
            <button
              type="button"
              onClick={onClose}
              autoFocus
              className="absolute top-4 right-4 z-20 w-11 h-11 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 active:scale-95 text-white/70 hover:text-white transition-all border border-white/10"
              aria-label="Cerrar recuerdo"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Scrollable container for memory content */}
            <div 
              className="overflow-y-auto overscroll-contain flex-1"
              onPointerDown={(e) => e.stopPropagation()}
            >
              {/* Optional Photo */}
              {flower.image && (
                <div className="relative w-full h-40 sm:h-52 md:h-60 shrink-0 overflow-hidden bg-black/40">
                  <img
                    src={flower.image}
                    alt={flower.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#121212] via-transparent to-transparent pointer-events-none" />
                </div>
              )}

              {/* Memory content details */}
              <div 
                className="p-6 md:p-8"
                style={{ paddingBottom: "calc(2rem + env(safe-area-inset-bottom))" }}
              >
                {/* Flower identifier badge */}
                <div className="flex items-center gap-2 mb-3">
                  <span className="w-2 h-2 rounded-full bg-[#d4a373] animate-pulse" />
                  <p className="text-xs font-light text-[#d4a373] tracking-[0.25em] uppercase">
                    {flower.flowerName || flower.flowerType}
                  </p>
                </div>

                {/* Memory Title */}
                <h3
                  id="memory-title"
                  className="text-2xl md:text-3xl font-light tracking-tight text-white mb-2"
                >
                  {flower.title}
                </h3>

                {/* Date (if specified) */}
                {flower.date && (
                  <p className="text-xs font-light text-white/40 tracking-wider mb-5 uppercase">
                    {flower.date}
                  </p>
                )}

                {/* Memory Body Text / Message */}
                <p className="text-base md:text-lg font-light text-white/75 leading-relaxed whitespace-pre-line">
                  {flower.message}
                </p>

                {/* Warm decorative gold divider */}
                <div className="mt-8 w-16 h-[1px] bg-gradient-to-r from-[#d4a373]/60 via-[#d4a373]/20 to-transparent" />
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
