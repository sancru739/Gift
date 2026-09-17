import { useState, useCallback } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { BouquetIntro } from "./BouquetIntro"
import { BouquetView } from "./BouquetView"
import { BouquetFinale } from "./BouquetFinale"

type Phase = "intro" | "bouquet" | "finale"

export function SurpriseExperience() {
  const [phase, setPhase] = useState<Phase>("intro")

  const handleStart = useCallback(() => setPhase("bouquet"), [])
  const handleAllDiscovered = useCallback(() => setPhase("finale"), [])

  return (
    <div className="fixed inset-0 z-50 bg-[#0a0a0a] overflow-hidden">
      <AnimatePresence mode="wait">
        {phase === "intro" && (
          <motion.div
            key="intro"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, filter: "blur(12px)" }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] as const }}
            className="h-full w-full"
          >
            <BouquetIntro onStart={handleStart} />
          </motion.div>
        )}

        {phase === "bouquet" && (
          <motion.div
            key="bouquet"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, filter: "blur(12px)" }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] as const }}
            className="h-full w-full"
          >
            <BouquetView onAllDiscovered={handleAllDiscovered} />
          </motion.div>
        )}

        {phase === "finale" && (
          <motion.div
            key="finale"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] as const }}
            className="h-full w-full"
          >
            <BouquetFinale />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
