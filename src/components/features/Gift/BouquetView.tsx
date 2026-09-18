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

  // Persistencia de recuerdos descubiertos
  const [discoveredIds, setDiscoveredIds] = useState<Set<string>>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) {
        const parsed = JSON.parse(saved)
        if (Array.isArray(parsed)) return new Set(parsed)
      }
    } catch {
      // Ignore
    }
    return new Set()
  })

  // Estado para la introducción inicial
  // Si ya descubrió algún recuerdo en una visita previa, la intro no vuelve a mostrarse
  const [showIntro, setShowIntro] = useState(() => discoveredIds.size === 0)
  const [activeFlower, setActiveFlower] = useState<FlowerMemory | null>(null)
  const [tappedFlowerId, setTappedFlowerId] = useState<string | null>(null)
  const [pulsePosition, setPulsePosition] = useState<{ x: number; y: number } | null>(null)

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(Array.from(discoveredIds)))
    } catch {
      // Ignore
    }
  }, [discoveredIds])

  const handleFlowerTap = useCallback((flower: FlowerMemory, clientX: number, clientY: number) => {
    // Cuando el usuario toca una flor por primera vez, la intro se desvanece suavemente
    if (showIntro) {
      setShowIntro(false)
    }

    // Vibración háptica suave en celular si está disponible
    if (typeof navigator !== "undefined" && "vibrate" in navigator) {
      try {
        navigator.vibrate(25)
      } catch {
        // Ignore
      }
    }

    // Micro-animación de pulso
    setPulsePosition({ x: clientX, y: clientY })
    setTappedFlowerId(flower.id)

    setTimeout(() => {
      setPulsePosition(null)
      setTappedFlowerId(null)
    }, 600)

    // Abrir el recuerdo
    setActiveFlower(flower)
  }, [showIntro])

  const handleCloseModal = useCallback(() => {
    if (activeFlower) {
      setDiscoveredIds((prev) => {
        const next = new Set(prev)
        const isNewlyDiscovered = !next.has(activeFlower.id)
        next.add(activeFlower.id)

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
    <div className="h-full w-full relative bg-[#0a0a0a] overflow-hidden flex items-center justify-center select-none font-sans">
      {/* Luz de fondo cálida y ambiental */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(212,163,115,0.08)_0%,_transparent_70%)] pointer-events-none" />

      {/* =======================================================================
          INTRODUCCIÓN ELEGANTE Y BREVE:
          Flota sobre el ramo y desaparece con una suave transición cuando el
          usuario comienza a interactuar.
          ======================================================================= */}
      <AnimatePresence>
        {showIntro && (
          <>
            {/* Mensaje superior: "Para vos. / Hay algo que quiero mostrarte." */}
            <motion.div
              initial={{ opacity: 0, y: -15, filter: "blur(4px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -10, filter: "blur(8px)" }}
              transition={{ delay: 0.3, duration: 1, ease: [0.16, 1, 0.3, 1] as const }}
              className="absolute top-8 md:top-12 inset-x-0 z-20 flex flex-col items-center text-center px-6 pointer-events-none"
            >
              <p className="text-xs md:text-sm font-light text-[#d4a373] tracking-[0.35em] uppercase mb-2">
                {intro.preTitle}
              </p>
              <h1 className="text-xl md:text-2xl lg:text-3xl font-extralight text-white/95 tracking-wide drop-shadow-md">
                {intro.title}
              </h1>
            </motion.div>

            {/* Mensaje inferior: "Tocá una flor. / Cada una guarda un recuerdo." */}
            <motion.div
              initial={{ opacity: 0, y: 15, filter: "blur(4px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: 10, filter: "blur(8px)" }}
              transition={{ delay: 1.1, duration: 1, ease: [0.16, 1, 0.3, 1] as const }}
              className="absolute bottom-10 md:bottom-12 inset-x-0 z-20 flex flex-col items-center text-center px-6 pointer-events-none"
            >
              {/* Micro-pulsación sutil para guiar la mirada */}
              <motion.div
                animate={{
                  opacity: [0.75, 1, 0.75],
                  y: [0, -3, 0],
                }}
                transition={{
                  duration: 2.6,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="flex flex-col items-center"
              >
                <div className="w-1.5 h-1.5 rounded-full bg-[#d4a373] mb-2.5 shadow-[0_0_8px_rgba(212,163,115,0.8)]" />
                <p className="text-base md:text-lg font-light text-white tracking-wide mb-1 drop-shadow-md">
                  {intro.hint}
                </p>
                <p className="text-xs md:text-sm font-extralight text-white/60 tracking-widest">
                  {intro.hintSub}
                </p>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Sutil gradiente para asegurar contraste en textos superior e inferior */}
      <div className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-black/70 via-black/20 to-transparent pointer-events-none z-10" />
      <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none z-10" />

      {/* =======================================================================
          RAMO DE FLORES — PROTAGONISTA ABSOLUTO
          ======================================================================= */}
      <motion.div
        initial={{ opacity: 0, scale: 1.04 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] as const }}
        className="relative aspect-[9/16] h-full max-h-full max-w-full flex items-center justify-center select-none"
      >
        <img
          src={image}
          alt="Ramo de flores"
          className="w-full h-full object-cover select-none pointer-events-none"
          draggable={false}
        />

        {/* Zonas interactivas invisibles */}
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

      {/* Efecto de pulso en el punto exacto del toque */}
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

      {/* Sistema de progreso poético en la esquina inferior (aparece tras interactuar) */}
      {!showIntro && discoveredIds.size > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="absolute bottom-4 right-4 z-20 flex items-center gap-2 bg-black/45 backdrop-blur-xl px-3.5 py-1.5 rounded-full border border-white/10 shadow-lg select-none"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-[#d4a373] animate-pulse" />
          <div className="flex items-center text-[11px] font-light text-white/60 tracking-wider">
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

      {/* Modal elegante para visualizar el recuerdo */}
      <MemoryModal flower={activeFlower} onClose={handleCloseModal} />
    </div>
  )
}
