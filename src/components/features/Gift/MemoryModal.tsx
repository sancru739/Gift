import { motion, AnimatePresence } from "framer-motion"
import { X } from "lucide-react"
import type { FlowerMemory } from "@/data/bouquetContent"

interface MemoryModalProps {
  flower: FlowerMemory | null
  onClose: () => void
}

export function MemoryModal({ flower, onClose }: MemoryModalProps) {
  return (
    <AnimatePresence>
      {flower && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Modal card */}
          <motion.div
            key="modal"
            initial={{ opacity: 0, y: 100, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 60, scale: 0.95 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] as const }}
            className="fixed inset-x-4 bottom-4 z-50 max-w-lg mx-auto md:inset-x-auto md:bottom-auto md:top-1/2 md:-translate-y-1/2"
          >
            <div className="relative bg-[#111]/95 border border-white/10 backdrop-blur-2xl rounded-3xl shadow-[0_0_60px_rgba(0,0,0,0.5)] overflow-hidden">
              {/* Close button */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 z-10 w-8 h-8 flex items-center justify-center rounded-full bg-white/5 border border-white/10 text-white/50 hover:bg-white/10 hover:text-white transition-all"
                aria-label="Cerrar"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Photo (if present) */}
              {flower.memory.photo && (
                <div className="w-full h-48 md:h-56 overflow-hidden">
                  <img
                    src={flower.memory.photo}
                    alt={flower.memory.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-x-0 top-0 h-48 md:h-56 bg-gradient-to-b from-transparent via-transparent to-[#111]/95 pointer-events-none" />
                </div>
              )}

              {/* Content */}
              <div className="p-6 md:p-8">
                {/* Flower name — subtle label */}
                <p className="text-xs font-light text-[#d4a373]/60 tracking-[0.3em] uppercase mb-3">
                  {flower.flower}
                </p>

                {/* Memory title */}
                <h3 className="text-2xl md:text-3xl font-light tracking-tight text-white/90 mb-4">
                  {flower.memory.title}
                </h3>

                {/* Date (if present) */}
                {flower.memory.date && (
                  <p className="text-sm font-light text-white/30 tracking-wider mb-4">
                    {flower.memory.date}
                  </p>
                )}

                {/* Memory text */}
                <p className="text-base md:text-lg font-light text-white/60 leading-relaxed">
                  {flower.memory.text}
                </p>

                {/* Decorative divider */}
                <div className="mt-6 w-12 h-[1px] bg-gradient-to-r from-[#d4a373]/40 to-transparent" />
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
