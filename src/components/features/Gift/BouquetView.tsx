import { useState, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { bouquetContent } from "@/data/bouquetContent"
import type { FlowerMemory } from "@/data/bouquetContent"
import { FlowerZone } from "./FlowerZone"
import { MemoryModal } from "./MemoryModal"

interface BouquetViewProps {
  onAllDiscovered: () => void
}

export function BouquetView({ onAllDiscovered }: BouquetViewProps) {
  const { flowers, intro } = bouquetContent
  const [discoveredIds, setDiscoveredIds] = useState<Set<string>>(new Set())
  const [activeFlower, setActiveFlower] = useState<FlowerMemory | null>(null)
  const [showHint, setShowHint] = useState(true)
  const [pulsePosition, setPulsePosition] = useState<{ x: number; y: number } | null>(null)

  const handleFlowerTap = useCallback((flower: FlowerMemory, clientX: number, clientY: number) => {
    // Show pulse at tap position
    setPulsePosition({ x: clientX, y: clientY })
    setTimeout(() => setPulsePosition(null), 600)

    // Hide hint after first tap
    if (showHint) setShowHint(false)

    // Open the memory
    setActiveFlower(flower)
  }, [showHint])

  const handleCloseModal = useCallback(() => {
    if (activeFlower) {
      setDiscoveredIds((prev) => {
        const next = new Set(prev)
        next.add(activeFlower.id)

        // Check if all discovered
        if (next.size === flowers.length) {
          // Small delay before finale
          setTimeout(() => onAllDiscovered(), 800)
        }

        return next
      })
    }
    setActiveFlower(null)
  }, [activeFlower, flowers.length, onAllDiscovered])

  return (
    <div className="h-full w-full relative bg-black overflow-hidden flex items-center justify-center">
      {/* Bouquet image */}
      <motion.div
        initial={{ opacity: 0, scale: 1.05 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] as const }}
        className="relative w-full h-full flex items-center justify-center"
      >
        <img
          src={bouquetContent.image}
          alt="Ramo de flores"
          className="w-full h-full object-contain select-none"
          draggable={false}
        />

        {/* Invisible flower zones */}
        <div className="absolute inset-0">
          {/* We need to position zones relative to the image, not the container.
              Since the image uses object-contain, we create an overlay that matches
              the image dimensions within the container */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative" style={{ aspectRatio: '9/16', height: '100%', maxWidth: '100%' }}>
              {flowers.map((flower) => (
                <FlowerZone
                  key={flower.id}
                  flower={flower}
                  isDiscovered={discoveredIds.has(flower.id)}
                  onTap={handleFlowerTap}
                />
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Pulse effect on tap */}
      <AnimatePresence>
        {pulsePosition && (
          <motion.div
            key="pulse"
            initial={{ scale: 0, opacity: 0.6 }}
            animate={{ scale: 2.5, opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="fixed w-12 h-12 rounded-full bg-[#d4a373]/30 pointer-events-none -translate-x-1/2 -translate-y-1/2"
            style={{ left: pulsePosition.x, top: pulsePosition.y }}
          />
        )}
      </AnimatePresence>

      {/* Hint text — disappears after first tap */}
      <AnimatePresence>
        {showHint && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ delay: 1, duration: 0.8 }}
            className="absolute bottom-8 left-0 right-0 flex flex-col items-center text-center pointer-events-none z-10"
          >
            <motion.p
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              className="text-base md:text-lg font-light text-white/70 tracking-wide mb-1"
            >
              {intro.hint}
            </motion.p>
            <p className="text-sm font-light text-white/40 tracking-wider">
              {intro.hintSub}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Discovered counter — very subtle, bottom corner */}
      {discoveredIds.size > 0 && discoveredIds.size < flowers.length && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute bottom-4 right-4 z-10"
        >
          <p className="text-xs font-light text-white/20 tracking-widest">
            {discoveredIds.size} / {flowers.length}
          </p>
        </motion.div>
      )}

      {/* Memory Modal */}
      <MemoryModal
        flower={activeFlower}
        onClose={handleCloseModal}
      />
    </div>
  )
}
