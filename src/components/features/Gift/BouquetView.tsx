import { useState, useCallback, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import type { Variants } from "framer-motion"
import { Volume2, VolumeX } from "lucide-react"
import { memoriesData } from "@/data/memoriesData"
import type { FlowerMemory } from "@/data/memoriesData"
import { giftConfig } from "@/config/gift"
import { FlowerZone } from "./FlowerZone"
import { MemoryModal } from "./MemoryModal"

const STORAGE_KEY = "sept21_discovered_memories"

interface BouquetViewProps {
  onAllDiscovered?: () => void
}

export function BouquetView({ onAllDiscovered }: BouquetViewProps) {
  const { memories, intro, finale, image } = memoriesData

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

  // Estados de interfaz
  const [showIntro, setShowIntro] = useState(() => discoveredIds.size === 0)
  const [activeFlower, setActiveFlower] = useState<FlowerMemory | null>(null)
  const [tappedFlowerId, setTappedFlowerId] = useState<string | null>(null)
  const [pulsePosition, setPulsePosition] = useState<{ x: number; y: number } | null>(null)

  // Estado final: se activa cuando todos los recuerdos fueron descubiertos
  const [isFinaleActive, setIsFinaleActive] = useState(() => discoveredIds.size === memories.length)
  const [showFinaleCard, setShowFinaleCard] = useState(() => discoveredIds.size === memories.length)

  // Audio opcional si está configurado
  const [hasStartedMusic, setHasStartedMusic] = useState(false)
  const hasStartedMusicRef = useRef(false)
  const [isMuted, setIsMuted] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  // Prevención de re-renders innecesarios y memory leaks
  const showIntroRef = useRef(discoveredIds.size === 0)
  const pulseTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Sincronizar localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(Array.from(discoveredIds)))
    } catch {
      // Ignore
    }
  }, [discoveredIds])

  // Limpiar audio y timeouts al desmontar
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause()
      }
      if (pulseTimeoutRef.current) {
        clearTimeout(pulseTimeoutRef.current)
      }
    }
  }, [])

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted
      setIsMuted(!isMuted)
    }
  }

  const handleFlowerTap = useCallback((flower: FlowerMemory, clientX: number, clientY: number) => {
    if (showIntroRef.current) {
      showIntroRef.current = false
      setShowIntro(false)
    }

    // Iniciar música en la primera interacción
    if (!hasStartedMusicRef.current && giftConfig.surpriseMusic) {
      hasStartedMusicRef.current = true
      setHasStartedMusic(true)
      const audio = new Audio(giftConfig.surpriseMusic)
      audio.loop = true
      audio.volume = 0.4
      audioRef.current = audio
      audio.play().catch(() => {
        // Autoplay bloqueado por el navegador
      })
    }

    // Vibración háptica suave en celular
    if (typeof navigator !== "undefined" && "vibrate" in navigator) {
      try {
        navigator.vibrate(25)
      } catch {
        // Ignore
      }
    }

    setPulsePosition({ x: clientX, y: clientY })
    setTappedFlowerId(flower.id)

    if (pulseTimeoutRef.current) {
      clearTimeout(pulseTimeoutRef.current)
    }
    pulseTimeoutRef.current = setTimeout(() => {
      setPulsePosition(null)
      setTappedFlowerId(null)
    }, 600)

    setActiveFlower(flower)
  }, [])

  const handleCloseModal = useCallback(() => {
    if (activeFlower) {
      setDiscoveredIds((prev) => {
        const next = new Set(prev)
        const isNewlyDiscovered = !next.has(activeFlower.id)
        next.add(activeFlower.id)

        // Si se descubrió el último recuerdo:
        if (isNewlyDiscovered && next.size === memories.length) {
          // Breve pausa para cerrar el modal antes de iniciar la transición final
          setTimeout(() => {
            setIsFinaleActive(true)
            setShowFinaleCard(true)
            onAllDiscovered?.()
          }, 600)
        }

        return next
      })
    }
    setActiveFlower(null)
  }, [activeFlower, memories.length, onAllDiscovered])

  // Sistema "Fat Finger": Encontrar la flor más cercana si el usuario falla el botón
  const handleContainerClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (isFinaleActive && showFinaleCard) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX;
    const y = e.clientY;

    let closestFlower: FlowerMemory | null = null;
    let minDistance = Infinity;

    memories.forEach((flower) => {
      const flowerXPx = rect.left + (flower.position.x / 100) * rect.width;
      const flowerYPx = rect.top + (flower.position.y / 100) * rect.height;
      const dist = Math.sqrt(Math.pow(x - flowerXPx, 2) + Math.pow(y - flowerYPx, 2));
      
      if (dist < minDistance) {
        minDistance = dist;
        closestFlower = flower;
      }
    });

    // 75px de radio máximo para compensar
    if (closestFlower && minDistance <= 75) {
      handleFlowerTap(closestFlower, x, y);
    } else if (showIntroRef.current) {
      showIntroRef.current = false;
      setShowIntro(false);
    }
  }, [isFinaleActive, showFinaleCard, memories, handleFlowerTap]);

  // Variantes para el mensaje final
  const finaleContainerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.35,
        delayChildren: 0.4,
      },
    },
  }

  const finaleItemVariants: Variants = {
    hidden: { opacity: 0, y: 16, filter: "blur(6px)" },
    visible: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: { duration: 1.2, ease: [0.16, 1, 0.3, 1] as const },
    },
  }

  return (
    <div className="h-full w-full relative bg-[#0a0a0a] overflow-hidden flex items-center justify-center select-none font-sans">
      {/* Luz de fondo cálida y ambiental */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(212,163,115,0.08)_0%,_transparent_70%)] pointer-events-none" />

      {/* Control de audio discreto en la esquina superior si la música fue iniciada */}
      {hasStartedMusic && (
        <button
          onClick={toggleMute}
          className="absolute z-30 w-9 h-9 rounded-full bg-black/40 backdrop-blur-md border border-white/10 flex items-center justify-center text-white/60 hover:text-white transition-all cursor-pointer"
          style={{ top: "calc(1.5rem + env(safe-area-inset-top))", right: "calc(1.5rem + env(safe-area-inset-right))" }}
          aria-label={isMuted ? "Activar música" : "Silenciar música"}
        >
          {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
        </button>
      )}

      {/* =======================================================================
          INTRODUCCIÓN INICIAL BREVE
          ======================================================================= */}
      <AnimatePresence>
        {showIntro && !isFinaleActive && (
          <>
            {/* Mensaje superior */}
            <motion.div
              initial={{ opacity: 0, y: -15, filter: "blur(4px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -10, filter: "blur(8px)" }}
              transition={{ delay: 0.3, duration: 1, ease: [0.16, 1, 0.3, 1] as const }}
              className="absolute inset-x-0 z-20 flex flex-col items-center text-center px-6 pointer-events-none"
              style={{ top: "calc(2rem + env(safe-area-inset-top))" }}
            >
              <p className="text-xs md:text-sm font-light text-[#d4a373] tracking-[0.35em] uppercase mb-2">
                {intro.preTitle}
              </p>
              <h1 className="text-xl md:text-2xl lg:text-3xl font-extralight text-white/95 tracking-wide drop-shadow-md [text-shadow:0_4px_20px_rgba(0,0,0,0.8)]">
                {intro.title}
              </h1>
            </motion.div>

            {/* Mensaje inferior */}
            <motion.div
              initial={{ opacity: 0, y: 15, filter: "blur(4px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: 10, filter: "blur(8px)" }}
              transition={{ delay: 1.1, duration: 1, ease: [0.16, 1, 0.3, 1] as const }}
              className="absolute inset-x-0 z-20 flex flex-col items-center text-center px-6 pointer-events-none"
              style={{ bottom: "calc(2.5rem + env(safe-area-inset-bottom))" }}
            >
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
                <p className="text-base md:text-lg font-light text-white tracking-wide mb-1 drop-shadow-md [text-shadow:0_4px_16px_rgba(0,0,0,0.8)]">
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

      {/* Sutiles gradientes de borde */}
      <div className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-black/70 via-black/20 to-transparent pointer-events-none z-10" />
      <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none z-10" />

      {/* =======================================================================
          RAMO DE FLORES — PROTAGONISTA
          1. Transición visual sutil en estado final (suave ajuste de profundidad).
          2. Animación armónica conjunta de las flores descubiertas.
          ======================================================================= */}
      <motion.div
        initial={{ opacity: 0, scale: 1.04 }}
        animate={{
          opacity: 1,
          scale: isFinaleActive && showFinaleCard ? 1.02 : 1,
          filter: isFinaleActive && showFinaleCard ? "brightness(0.65) contrast(1.05)" : "brightness(1) contrast(1)",
        }}
        transition={{ duration: 2, ease: [0.16, 1, 0.3, 1] as const }}
        className="relative flex items-center justify-center w-full h-full select-none touch-manipulation bg-[#1a1a1a]/40"
      >
        <div 
          className="relative max-w-full max-h-[100dvh] flex items-center justify-center cursor-crosshair"
          onClick={handleContainerClick}
        >
          <img
            src={image}
            alt="Ramo de flores"
            className="w-auto h-auto max-w-full max-h-[100dvh] object-contain pointer-events-none"
            draggable={false}
            fetchPriority="high"
            loading="eager"
          />

          <div
            className={`absolute inset-0 transition-opacity duration-300 ${
              activeFlower || (isFinaleActive && showFinaleCard) ? "pointer-events-none" : "pointer-events-auto"
            }`}
          >
            {memories.map((flower) => (
              <FlowerZone
                key={flower.id}
                flower={flower}
                isDiscovered={discoveredIds.has(flower.id)}
                isCurrentlyTapped={tappedFlowerId === flower.id}
                isFinale={isFinaleActive}
                onTap={handleFlowerTap}
              />
            ))}
          </div>
        </div>
      </motion.div>

      {/* Efecto de pulso en el toque */}
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

      {/* =======================================================================
          3. EL PROGRESO DESAPARECE EN EL ESTADO FINAL
          (Sólo se muestra mientras el usuario está descubriendo)
          ======================================================================= */}
      <AnimatePresence>
        {!showIntro && discoveredIds.size > 0 && !isFinaleActive && (
          <motion.div
            key="progress-tracker"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10, filter: "blur(6px)" }}
            transition={{ duration: 0.5 }}
            className="absolute z-20 flex items-center gap-2 bg-black/45 backdrop-blur-xl px-3.5 py-1.5 rounded-full border border-white/10 shadow-lg select-none"
            style={{ bottom: "calc(1rem + env(safe-area-inset-bottom))", right: "calc(1rem + env(safe-area-inset-right))" }}
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
          </motion.div>
        )}
      </AnimatePresence>

      {/* =======================================================================
          4. ESTADO FINAL: MENSAJE FINAL
          Sin confetti, sin corazones cayendo, sin estridencias.
          Composición pura, tipografía poética y cierre natural.
          ======================================================================= */}
      <AnimatePresence>
        {isFinaleActive && showFinaleCard && (
          <motion.div
            key="finale-card"
            initial={{ opacity: 0, scale: 0.95, filter: "blur(10px)" }}
            animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
            exit={{ opacity: 0, scale: 0.95, filter: "blur(8px)" }}
            transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] as const }}
            className="fixed inset-0 z-40 flex flex-col items-center justify-center px-6 text-center"
          >
            {/* Backdrop oscuro con desenfoque suave para enfocar el mensaje */}
            <div
              className="absolute inset-0 bg-black/45 backdrop-blur-[6px]"
              onClick={() => setShowFinaleCard(false)}
            />

            {/* Tarjeta del mensaje de cierre */}
            <motion.div
              variants={finaleContainerVariants}
              initial="hidden"
              animate="visible"
              className="relative z-10 max-w-lg w-full bg-[#111]/90 border border-white/10 backdrop-blur-2xl rounded-3xl p-8 md:p-12 shadow-[0_25px_80px_rgba(0,0,0,0.8)]"
            >
              {/* Sutil punto de luz dorada */}
              <motion.div variants={finaleItemVariants} className="flex justify-center mb-6">
                <span className="w-2 h-2 rounded-full bg-[#d4a373] shadow-[0_0_12px_rgba(212,163,115,0.8)]" />
              </motion.div>

              {/* Línea 1 */}
              <motion.p
                variants={finaleItemVariants}
                className="text-lg md:text-xl font-light text-white/80 leading-relaxed tracking-wide"
              >
                {finale.line1}
              </motion.p>

              {/* Línea 2 */}
              <motion.p
                variants={finaleItemVariants}
                className="text-xl md:text-2xl font-light text-white leading-relaxed tracking-tight mt-2"
              >
                {finale.line2}
              </motion.p>

              {/* Línea divisoria minimalista */}
              <motion.div
                variants={finaleItemVariants}
                className="w-16 h-[1px] bg-gradient-to-r from-transparent via-[#d4a373]/60 to-transparent my-7 mx-auto"
              />

              {/* Saludo final: "Feliz 21 de septiembre." */}
              <motion.p
                variants={finaleItemVariants}
                className="text-sm md:text-base font-light text-[#d4a373] tracking-[0.25em] uppercase"
              >
                {finale.greeting}
              </motion.p>

              {/* Opción sutil para contemplar el ramo iluminado */}
              <motion.div variants={finaleItemVariants} className="mt-8">
                <button
                  type="button"
                  onClick={() => setShowFinaleCard(false)}
                  className="text-xs font-light text-white/40 hover:text-white/80 tracking-widest uppercase transition-colors cursor-pointer border-b border-white/10 hover:border-white/30 pb-0.5"
                >
                  Ver ramo iluminado
                </button>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Botón flotante mínimo si el usuario minimizó el mensaje final para admirar las flores */}
      <AnimatePresence>
        {isFinaleActive && !showFinaleCard && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.4 }}
            className="absolute inset-x-0 z-30 flex justify-center pointer-events-auto"
            style={{ bottom: "calc(1.5rem + env(safe-area-inset-bottom))" }}
          >
            <button
              type="button"
              onClick={() => setShowFinaleCard(true)}
              className="px-5 py-2 rounded-full bg-black/60 backdrop-blur-xl border border-white/15 text-xs font-light text-[#d4a373] hover:text-white tracking-widest uppercase transition-all shadow-lg cursor-pointer"
            >
              Leer mensaje final
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal de recuerdos (permite releer cualquier memoria si el mensaje final está minimizado) */}
      <MemoryModal flower={activeFlower} onClose={handleCloseModal} />
    </div>
  )
}
