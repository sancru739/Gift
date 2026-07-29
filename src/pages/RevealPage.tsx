import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import type { Variants } from "framer-motion"
import { useNavigate } from "react-router-dom"
import { Countdown } from "@/components/ui/Countdown"

export default function RevealPage() {
  const navigate = useNavigate()
  const targetDate = "2026-10-09T00:00:00"
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  const handleContinue = () => {
    navigate("/")
  }

  // Animation variants for staggered text reveal
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
        delayChildren: 0.5
      }
    }
  }

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20, filter: "blur(10px)" },
    visible: { 
      opacity: 1, 
      y: 0, 
      filter: "blur(0px)",
      transition: { duration: 1, ease: "easeOut" }
    }
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-black overflow-hidden font-sans text-white">
      
      {/* Animated Subtle Gradient Background */}
      <motion.div
        animate={{
          backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
        }}
        transition={{
          duration: 15,
          ease: "linear",
          repeat: Infinity,
        }}
        className="absolute inset-0 opacity-30"
        style={{
          background: "linear-gradient(-45deg, #0a0a0a, #1a1515, #0d1117, #151010)",
          backgroundSize: "400% 400%",
        }}
      />

      {/* Floating Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            initial={{
              opacity: 0,
              y: Math.random() * 100 + 50 + "%",
              x: Math.random() * 100 + "%",
              scale: Math.random() * 0.5 + 0.5,
            }}
            animate={{
              opacity: [0, Math.random() * 0.3 + 0.2, 0],
              y: "-10%",
            }}
            transition={{
              duration: Math.random() * 15 + 15,
              repeat: Infinity,
              ease: "linear",
              delay: Math.random() * 5,
            }}
            className="absolute w-1 h-1 rounded-full bg-[#d4a373] blur-[1px]"
          />
        ))}
      </div>

      <AnimatePresence>
        {isMounted && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, filter: "blur(20px)" }}
            animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
            transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
            className="relative z-10 w-full max-w-4xl mx-4 p-8 md:p-16 flex flex-col items-center text-center bg-white/5 border border-white/10 backdrop-blur-2xl shadow-[0_0_50px_rgba(0,0,0,0.5)] rounded-[2rem]"
          >
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="flex flex-col items-center w-full"
            >
              {/* Header */}
              <motion.p variants={itemVariants} className="text-sm md:text-base font-light text-[#d4a373]/80 tracking-widest uppercase mb-4">
                No podía esperar más.
              </motion.p>
              
              <motion.h1 variants={itemVariants} className="text-4xl md:text-5xl lg:text-6xl font-light tracking-tight text-white/90 mb-8">
                Nos vamos a volver a ver.
              </motion.h1>

              {/* Date Highlight */}
              <motion.div variants={itemVariants} className="mb-12">
                <span className="px-8 py-3 rounded-full border border-[#d4a373]/30 bg-[#d4a373]/10 text-xl md:text-2xl font-light tracking-widest text-[#d4a373]">
                  9 de Octubre, 2026
                </span>
              </motion.div>

              {/* Countdown Display */}
              <motion.div variants={itemVariants} className="mb-12 w-full">
                <Countdown targetDate={targetDate} />
              </motion.div>

              {/* Emotional Text */}
              <motion.p variants={itemVariants} className="text-lg md:text-xl font-light text-white/60 tracking-wide mb-12 max-w-lg">
                "Cada segundo que pasa es uno menos para volver a abrazarte."
              </motion.p>

              {/* Action Button */}
              <motion.button
                variants={itemVariants}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleContinue}
                className="group relative px-12 py-4 overflow-hidden rounded-full bg-white/10 transition-all hover:bg-white/20 border border-white/20 hover:border-white/40"
              >
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-r from-transparent via-white/10 to-transparent blur-md" />
                <span className="relative z-10 text-white font-medium tracking-widest uppercase text-sm">
                  Continuar
                </span>
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
