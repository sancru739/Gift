import { motion } from "framer-motion"
import { bouquetContent } from "@/data/bouquetContent"

interface BouquetIntroProps {
  onStart: () => void
}

export function BouquetIntro({ onStart }: BouquetIntroProps) {
  const { intro } = bouquetContent

  return (
    <div className="h-full w-full flex flex-col items-center justify-center px-6 text-center relative overflow-hidden">
      {/* Subtle background glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(212,163,115,0.08)_0%,_transparent_70%)] pointer-events-none" />

      {/* Pre-title */}
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="text-sm md:text-base font-light text-[#d4a373]/70 tracking-[0.3em] uppercase mb-8"
      >
        {intro.preTitle}
      </motion.p>

      {/* Title */}
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="text-3xl md:text-5xl lg:text-6xl font-light tracking-tight text-white/90 mb-16"
      >
        {intro.title}
      </motion.h1>

      {/* CTA */}
      <motion.button
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2, duration: 0.8, ease: [0.16, 1, 0.3, 1] as const }}
        onClick={onStart}
        className="px-12 py-4 rounded-full bg-white text-black font-medium tracking-widest uppercase text-sm hover:scale-105 hover:shadow-[0_0_40px_rgba(212,163,115,0.3)] transition-all duration-500 border border-transparent"
      >
        Ver ramo
      </motion.button>
    </div>
  )
}
