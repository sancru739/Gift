import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import type { Variants } from "framer-motion"
import confetti from "canvas-confetti"
import { giftConfig } from "@/config/gift"
import { Countdown } from "@/components/ui/Countdown"
import { bouquetContent } from "@/data/bouquetContent"

export function BouquetFinale() {
  const { finale } = bouquetContent
  const [showContent, setShowContent] = useState(false)

  useEffect(() => {
    const duration = 4000
    const end = Date.now() + duration

    const frame = () => {
      confetti({
        particleCount: 3,
        angle: 60,
        spread: 80,
        origin: { x: 0, y: 0.7 },
        colors: ["#d4a373", "#ffffff", "#f472b6", "#fcd34d"],
      })
      confetti({
        particleCount: 3,
        angle: 120,
        spread: 80,
        origin: { x: 1, y: 0.7 },
        colors: ["#d4a373", "#ffffff", "#f472b6", "#fcd34d"],
      })

      if (Date.now() < end) {
        requestAnimationFrame(frame)
      }
    }

    const timeout = setTimeout(() => {
      frame()
      setShowContent(true)
    }, 800)

    return () => clearTimeout(timeout)
  }, [])

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.4,
        delayChildren: 0.5,
      },
    },
  }

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 30, filter: "blur(10px)" },
    visible: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: { duration: 1.2, ease: [0.16, 1, 0.3, 1] as const },
    },
  }

  return (
    <div className="h-full w-full flex flex-col items-center justify-center px-6 text-center relative overflow-hidden">
      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            initial={{
              opacity: 0,
              y: `${Math.random() * 100 + 50}%`,
              x: `${Math.random() * 100}%`,
              scale: Math.random() * 0.6 + 0.3,
            }}
            animate={{
              opacity: [0, Math.random() * 0.3 + 0.1, 0],
              y: "-10%",
            }}
            transition={{
              duration: Math.random() * 18 + 12,
              repeat: Infinity,
              ease: "linear",
              delay: Math.random() * 5,
            }}
            className="absolute w-1 h-1 rounded-full bg-[#d4a373] blur-[1px]"
          />
        ))}
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate={showContent ? "visible" : "hidden"}
        className="relative z-10 flex flex-col items-center max-w-2xl"
      >
        <motion.p
          variants={itemVariants}
          className="text-sm font-light text-[#d4a373]/70 tracking-[0.3em] uppercase mb-8"
        >
          {finale.preTitle}
        </motion.p>

        <motion.h1
          variants={itemVariants}
          className="text-5xl md:text-7xl lg:text-8xl font-light tracking-tight text-white mb-6"
        >
          {finale.title}
        </motion.h1>

        <motion.p
          variants={itemVariants}
          className="text-xl md:text-2xl font-light text-white/60 tracking-wide mb-16"
        >
          {finale.subtitle}
        </motion.p>

        <motion.div
          variants={itemVariants}
          className="w-24 h-[1px] bg-gradient-to-r from-transparent via-[#d4a373]/50 to-transparent mb-12"
        />

        <motion.p
          variants={itemVariants}
          className="text-sm font-light text-white/40 tracking-widest uppercase mb-6"
        >
          {finale.countdownLabel}
        </motion.p>

        <motion.div variants={itemVariants} className="mb-12 scale-90 md:scale-100">
          <Countdown targetDate={giftConfig.meetingDate} />
        </motion.div>

        <motion.p
          variants={itemVariants}
          className="text-base md:text-lg font-light text-white/40 italic max-w-md"
        >
          &ldquo;{finale.finalNote}&rdquo;
        </motion.p>
      </motion.div>
    </div>
  )
}
