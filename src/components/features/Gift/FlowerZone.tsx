import { memo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import type { FlowerMemory } from "@/data/memoriesData"

interface FlowerZoneProps {
  flower: FlowerMemory
  isDiscovered: boolean
  isCurrentlyTapped: boolean
  isFinale?: boolean
  onTap: (flower: FlowerMemory, clientX: number, clientY: number) => void
}

export const FlowerZone = memo(function FlowerZone({
  flower,
  isDiscovered,
  isCurrentlyTapped,
  isFinale = false,
  onTap,
}: FlowerZoneProps) {
  const { x, y, size = 16 } = flower.position

  const handlePress = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation()
    let clientX = e.clientX
    let clientY = e.clientY

    if (!clientX && !clientY) {
      const rect = e.currentTarget.getBoundingClientRect()
      clientX = rect.left + rect.width / 2
      clientY = rect.top + rect.height / 2
    }

    onTap(flower, clientX, clientY)
  }

  return (
    <button
      type="button"
      className="absolute cursor-pointer rounded-full select-none outline-none focus:outline-none -webkit-tap-highlight-color-transparent active:scale-95 transition-transform duration-150"
      style={{
        left: `${x}%`,
        top: `${y}%`,
        width: `${size}%`,
        height: `${size}%`,
        transform: "translate(-50%, -50%)",
        touchAction: "manipulation",
      }}
      onClick={handlePress}
      aria-label={`Flor: ${flower.flowerName || flower.flowerType}${
        isDiscovered ? " (descubierta)" : ""
      }`}
    >
      {/* 
        Gota de rocío / brillo en flores descubiertas.
        En el estado final (isFinale), todas las flores realizan una sutil
        animación armónica conjunta de respiración de luz cálida.
      */}
      {!isCurrentlyTapped && (
        <motion.span
          initial={isDiscovered ? { scale: 0, opacity: 0 } : false}
          animate={
            isFinale
              ? { scale: [0.9, 1.4, 0.9], opacity: [0.45, 0.9, 0.45] }
              : isDiscovered
                ? { scale: [0.85, 1.15, 0.85], opacity: [0.35, 0.7, 0.35] }
                : { scale: 1, opacity: 1 }
          }
          transition={{
            duration: isFinale ? 2.8 : 3.8,
            repeat: isDiscovered || isFinale ? Infinity : 0,
            ease: "easeInOut",
            delay: isFinale ? (x * 0.02) % 1.5 : (x * 0.05) % 2,
          }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none flex items-center justify-center"
        >
          <span className="relative flex items-center justify-center transition-all duration-1000 opacity-100 scale-100">
            <span
              className={`rounded-full transition-all duration-700 ${
                isFinale
                  ? "w-2 h-2 bg-white/90 shadow-[0_0_14px_4px_rgba(212,163,115,0.7)]"
                  : isDiscovered
                    ? "w-1.5 h-1.5 bg-white/80 shadow-[0_0_10px_3px_rgba(212,163,115,0.5)]"
                    : "w-4 h-4 border-2 border-white/80 bg-white/20 backdrop-blur-md shadow-[0_0_12px_rgba(255,255,255,0.3)]"
              }`}
            />
          </span>
        </motion.span>
      )}

      {/* Micro-animación de halo al recibir tap (Ripple orgánico) */}
      <AnimatePresence>
        {isCurrentlyTapped && (
          <motion.span
            initial={{ scale: 0.6, opacity: 0.9 }}
            animate={{ scale: 2.2, opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.75, ease: "easeOut" }}
            className="absolute inset-0 rounded-full pointer-events-none bg-[radial-gradient(circle,_rgba(212,163,115,0.9)_0%,_rgba(212,163,115,0.4)_50%,_transparent_75%)]"
          />
        )}
      </AnimatePresence>
    </button>
  )
})
