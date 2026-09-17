import { useState, useCallback, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { memoriesData } from "@/data/memoriesData"
import type { FlowerMemory } from "@/data/memoriesData"
import { FlowerZone } from "./FlowerZone"
import { MemoryModal } from "./MemoryModal"

const STORAGE_KEY = "sept21_discovered_memories"

interface BouquetViewProps {
  onAllDiscovered: () => void
}

export function BouquetView({ onAllDiscovered }: BouquetViewProps) {
  const { memories, intro, image } = memoriesData

  // Persistencia elegante en localStorage durante la sesión o recargas
  const [discoveredIds, setDiscoveredIds] = useState<Set<string>>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) {
        const parsed = JSON.parse(saved)
        if (Array.isArray(parsed)) return new Set(parsed)
      }
    } catch {
      // Ignore if localStorage unavailable
    }
    return new Set()
  })

  const [activeFlower, setActiveFlower] = useState<FlowerMemory | null>(null)
  const [tappedFlowerId, setTappedFlowerId] = useState<string | null>(null)
  const [showHint, setShowHint] = useState(() => discoveredIds.size === 0)
  const [pulsePosition, setPulsePosition] = useState<{ x: number; y: number } | null>(null)

  // Guardar en localStorage cuando se descubra una flor
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(Array.from(discoveredIds)))
    } catch {
      // Ignore if quota exceeded or restricted
    }
  }, [discoveredIds])

  const handleFlowerTap = useCallback((flower: FlowerMemory, clientX: number, clientY: number) => {
    // 1. Vibración háptica suave si el dispositivo lo admite
    if (typeof navigator !== "undefined" && "vibrate" in navigator) {
      try {
        navigator.vibrate(25)
      } catch {
        // Ignore
      }
    }

    // 2. Micro-animación de pulso en el punto exacto del toque
    setPulsePosition({ x: clientX, y: clientY })
    setTappedFlowerId(flower.id)

    setTimeout(() => {
      setPulsePosition(null)
      setTappedFlowerId(null)
    }, 600)

    if (showHint) setShowHint(false)

    // 3. Abrir el modal del recuerdo
    setActiveFlower(flower)
  }, [showHint])

  const handleCloseModal = useCallback(() => {
    if (activeFlower) {
      setDiscoveredIds((prev) => {
        const next = new Set(prev)
        const isNewlyDiscovered = !next.has(activeFlower.id)
        next.add(activeFlower.id)

        // Si se acaba de descubrir el último recuerdo, transicionar al final tras cerrar
        if (isNewlyDiscovered && next.size === memories.length) {
          setTimeout(() => onAllDiscovered(), 700)
        }

        return next
      })
    }
    setActiveFlower(null)
  }, [activeFlower, memories.length, onAllDiscovered])

  const allCompleted = discoveredIds.size === memories.length

  return (
    <div className="h-full w-full relative bg-[#0a0a0a] overflow-hidden flex items-center justify-center select-none">
      {/* Luz ambiental sutil */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(212,163,115,0.06)_0%,_transparent_65%)] pointer-events-none" />

      {/* Contenedor del Ramo fotorrealista (proporción 9:16 fija) */}
      <motion.div
        initial={{ opacity: 0, scale: 1.03 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] as const }}
        className="relative aspect-[9/16] h-full max-h-full max-w-full flex items-center justify-center select-none"
      >
        {/* Fotografía principal del ramo */}
        <img
          src={image}
          alt="Ramo de flores"
          className="w-full h-full object-cover select-none pointer-events-none"
          draggable={false}
        />

        {/* Zonas interactivas invisibles — deshabilitadas mientras el modal está activo */}
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

      {/* Animación sutil de pulso al tocar */}
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

      {/* Texto de guía sutil — desaparece tras la primera interacción */}
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

      {/* 
        Sistema de progreso discreto y poético (NO gamificado):
        Muestra delicadamente en una esquina flotante los recuerdos descubiertos.
      */}
      {discoveredIds.size > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="absolute bottom-4 right-4 z-20 flex items-center gap-2 bg-black/40 backdrop-blur-xl px-3.5 py-1.5 rounded-full border border-white/10 shadow-lg select-none"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-[#d4a373] animate-pulse" />
          <div className="flex items-center text-[11px] font-light text-white/60 tracking-wider">
            {/* Animación mínima al incrementar el número */}
            <AnimatePresence mode="wait">
              <motion.span
                key={discoveredIds.size}
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 4 }}
                transition={{ duration: 0.25 }}
                className="text-white font-medium mr-1"
              >
                {discoveredIds.size}
              </motion.span>
            </AnimatePresence>
            <span>de {memories.length} recuerdos</span>
          </div>

          {/* Si ya descubrió todos, botón sutil para revivir el final */}
          {allCompleted && (
            <button
              onClick={onAllDiscovered}
              className="ml-2 pl-2 border-l border-white/20 text-[10px] text-[#d4a373] hover:text-white transition-colors cursor-pointer"
            >
              Ver final
            </button>
          )}
        </motion.div>
      )}

      {/* Modal elegante para el recuerdo */}
      <MemoryModal flower={activeFlower} onClose={handleCloseModal} />
    </div>
  )
}
