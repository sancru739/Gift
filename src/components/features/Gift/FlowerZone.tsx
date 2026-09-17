import { memo } from "react"
import { motion } from "framer-motion"
import type { FlowerMemory } from "@/data/memoriesData"

interface FlowerZoneProps {
  flower: FlowerMemory
  isDiscovered: boolean
  isCurrentlyTapped: boolean
  onTap: (flower: FlowerMemory, clientX: number, clientY: number) => void
}

export const FlowerZone = memo(function FlowerZone({
  flower,
  isDiscovered,
  isCurrentlyTapped,
  onTap,
}: FlowerZoneProps) {
  const { x, y, size = 16 } = flower.position

  const handlePress = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation()
    let clientX = e.clientX
    let clientY = e.clientY

    // Fallback if triggered via keyboard or without mouse coordinates
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
      className="absolute cursor-pointer rounded-full select-none outline-none focus:outline-none -webkit-tap-highlight-color-transparent active:scale-95 transition-transform duration-150 min-w-[44px] min-h-[44px]"
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
        Flor descubierta: Indicador extremadamente sutil.
        Simula una pequeña gota de rocío / brillo de luz estelar tenue (1.5px)
        en el centro de la flor, sin marcos ni bordes que alteren la foto del ramo.
      */}
      {isDiscovered && !isCurrentlyTapped && (
        <motion.span
          initial={{ scale: 0, opacity: 0 }}
          animate={{
            scale: [0.85, 1.15, 0.85],
            opacity: [0.35, 0.7, 0.35],
          }}
          transition={{
            duration: 3.8,
            repeat: Infinity,
            ease: "easeInOut",
            delay: (x * 0.05) % 2,
          }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none flex items-center justify-center"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-[#fef08a] shadow-[0_0_8px_2px_rgba(254,240,138,0.5)]" />
        </motion.span>
      )}

      {/* Micro-animación de halo momentánea al recibir tap */}
      {isCurrentlyTapped && (
        <span className="absolute inset-0 rounded-full animate-ping pointer-events-none opacity-40 bg-[radial-gradient(circle,_rgba(254,240,138,0.8)_0%,_rgba(212,163,115,0.4)_50%,_transparent_75%)]" />
      )}
    </button>
  )
})
