import { useState, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { memoriesData } from "@/data/memoriesData"
import type { FlowerMemory } from "@/data/memoriesData"
import { FlowerZone } from "./FlowerZone"
import { MemoryModal } from "./MemoryModal"

interface BouquetViewProps {
  onAllDiscovered: () => void
}

export function BouquetView({ onAllDiscovered }: BouquetViewProps) {
  const { memories, intro, image } = memoriesData
  const [discoveredIds, setDiscoveredIds] = useState<Set<string>>(new Set())
  const [activeFlower, setActiveFlower] = useState<FlowerMemory | null>(null)
  const [tappedFlowerId, setTappedFlowerId] = useState<string | null>(null)
  const [showHint, setShowHint] = useState(true)
  const [pulsePosition, setPulsePosition] = useState<{ x: number; y: number } | null>(null)

  const handleFlowerTap = useCallback((flower: FlowerMemory, clientX: number, clientY: number) => {
    // 1. Subtle mobile haptic feedback if supported (Android / iOS)
    if (typeof navigator !== "undefined" && "vibrate" in navigator) {
      try {
        navigator.vibrate(25)
      } catch {
        // Ignore if unsupported or restricted
      }
    }

    // 2. Subtle micro-animation at touch coordinates
    setPulsePosition({ x: clientX, y: clientY })
    setTappedFlowerId(flower.id)

    setTimeout(() => {
      setPulsePosition(null)
      setTappedFlowerId(null)
    }, 600)

    // Hide hint after user's first interaction
    if (showHint) setShowHint(false)

    // 3. Open memory modal
    setActiveFlower(flower)
  }, [showHint])

  const handleCloseModal = useCallback(() => {
    if (activeFlower) {
      setDiscoveredIds((prev) => {
        const next = new Set(prev)
        next.add(activeFlower.id)

        // If all flowers discovered, transition to finale after modal closes
        if (next.size === memories.length) {
          setTimeout(() => onAllDiscovered(), 700)
        }

        return next
      })
    }
    setActiveFlower(null)
  }, [activeFlower, memories.length, onAllDiscovered])

  return (
    <div className="h-full w-full relative bg-[#0a0a0a] overflow-hidden flex items-center justify-center select-none">
      {/* Ambient background light */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(212,163,115,0.06)_0%,_transparent_65%)] pointer-events-none" />

      {/* Photorealistic Bouquet Frame — Fixed 9:16 aspect ratio matching image */}
      <motion.div
        initial={{ opacity: 0, scale: 1.03 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] as const }}
        className="relative aspect-[9/16] h-full max-h-full max-w-full flex items-center justify-center select-none"
      >
        {/* Real bouquet photograph */}
        <img
          src={image}
          alt="Ramo de flores"
          className="w-full h-full object-cover select-none pointer-events-none"
          draggable={false}
        />

        {/* Interactive Hotspots — Disabled while modal is open */}
        <div
          className={`absolute inset-0 transition-opacity duration-300 ${
            activeFlower ? "pointer-events-none" : "pointer-events-auto"
          }`}
        >
          {memories.map((flower) => (
            <FlowerZone
              key={flower.id}
              flower={flower}
              isDiscovered={discoveredIds.has(flower.id)}
              isCurrentlyTapped={tappedFlowerId === flower.id}
              onTap={handleFlowerTap}
            />
          ))}
        </div>
      </motion.div>

      {/* Touch pulse ripple effect */}
      <AnimatePresence>
        {pulsePosition && (
          <motion.div
            key="pulse-outer"
            initial={{ scale: 0.2, opacity: 0.8 }}
            animate={{ scale: 2.2, opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.55, ease: "easeOut" }}
            className="fixed w-16 h-16 rounded-full border border-[#d4a373]/80 bg-[#d4a373]/20 pointer-events-none -translate-x-1/2 -translate-y-1/2 z-30"
            style={{ left: pulsePosition.x, top: pulsePosition.y }}
          />
        )}
      </AnimatePresence>

      {/* Subtle hint text */}
      <AnimatePresence>
        {showHint && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ delay: 1, duration: 0.8 }}
            className="absolute bottom-6 left-0 right-0 flex flex-col items-center text-center pointer-events-none z-10 px-4"
          >
            <motion.p
              animate={{ opacity: [0.6, 1, 0.6] }}
              transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
              className="text-sm md:text-base font-light text-white/80 tracking-wide mb-1 drop-shadow-md"
            >
              {intro.hint}
            </motion.p>
            <p className="text-xs md:text-sm font-light text-white/50 tracking-wider">
              {intro.hintSub}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Progress counter */}
      {discoveredIds.size > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute bottom-4 right-4 z-10 bg-black/40 backdrop-blur-md px-3 py-1 rounded-full border border-white/10"
        >
          <p className="text-[11px] font-light text-[#d4a373] tracking-widest">
            {discoveredIds.size} / {memories.length}
          </p>
        </motion.div>
      )}

      {/* Memory Modal */}
      <MemoryModal flower={activeFlower} onClose={handleCloseModal} />
    </div>
  )
}
