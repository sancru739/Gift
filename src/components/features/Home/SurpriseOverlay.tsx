import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useNavigate } from "react-router-dom"

interface SurpriseOverlayProps {
  giftMode: boolean
  onComplete?: () => void
}

export default function SurpriseOverlay({ giftMode, onComplete }: SurpriseOverlayProps) {
  const [isVisible, setIsVisible] = useState(giftMode)
  const navigate = useNavigate()

  useEffect(() => {
    setIsVisible(giftMode)
  }, [giftMode])

  const handleOpen = () => {
    setIsVisible(false)
    if (onComplete) onComplete()
    // Small delay to allow the fade out animation to finish before navigating
    setTimeout(() => {
      navigate("/gift")
    }, 1000)
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, filter: "blur(10px)" }}
          animate={{ opacity: 1, filter: "blur(0px)" }}
          exit={{ opacity: 0, filter: "blur(20px)", transition: { duration: 1, ease: "easeInOut" } }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="fixed inset-0 z-[9999] flex items-center justify-center overflow-hidden bg-black text-white"
        >
          {/* Subtle slow moving background gradient */}
          <motion.div
            animate={{
              backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
            }}
            transition={{
              duration: 20,
              ease: "linear",
              repeat: Infinity,
            }}
            className="absolute inset-0 opacity-40"
            style={{
              background: "linear-gradient(-45deg, #0a0a0a, #1a1a1a, #0d1117, #000000)",
              backgroundSize: "400% 400%",
            }}
          />

          {/* Subtle Particles (simulated with absolute divs) */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {[...Array(15)].map((_, i) => (
              <motion.div
                key={i}
                initial={{
                  opacity: 0,
                  y: Math.random() * 100 + 50 + "%",
                  x: Math.random() * 100 + "%",
                  scale: Math.random() * 0.5 + 0.5,
                }}
                animate={{
                  opacity: [0, 0.5, 0],
                  y: "-10%",
                }}
                transition={{
                  duration: Math.random() * 10 + 10,
                  repeat: Infinity,
                  ease: "linear",
                  delay: Math.random() * 5,
                }}
                className="absolute w-1 h-1 bg-white rounded-full blur-[1px]"
              />
            ))}
          </div>

          {/* Glassmorphism Card */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 1.1, opacity: 0, transition: { duration: 0.8, ease: "easeIn" } }}
            transition={{ delay: 0.5, duration: 1, ease: [0.16, 1, 0.3, 1] }} // Custom spring-like easing
            className="relative z-10 flex flex-col items-center p-12 md:p-16 text-center border rounded-3xl bg-white/5 border-white/10 backdrop-blur-2xl shadow-2xl max-w-2xl mx-4"
          >
            <motion.h1 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.8, ease: "easeOut" }}
              className="text-4xl md:text-5xl font-light tracking-tight text-white/90 mb-4"
            >
              Tengo una sorpresa para vos.
            </motion.h1>

            <motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 1, duration: 0.8, ease: "easeOut" }}
              className="text-lg md:text-xl font-light text-white/50 mb-12 tracking-wide"
            >
              Estoy ansioso por decirte.
            </motion.p>

            <motion.button
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 1.2, duration: 0.8, ease: "easeOut" }}
              onClick={handleOpen}
              className="group relative px-10 py-4 overflow-hidden rounded-full bg-white/10 transition-all hover:bg-white/20 active:scale-95 border border-white/20 hover:border-white/40"
            >
              {/* Button Glow on Hover */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-r from-transparent via-white/10 to-transparent blur-md" />
              <span className="relative z-10 text-white font-medium tracking-widest uppercase text-sm">
                Abrir
              </span>
            </motion.button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
