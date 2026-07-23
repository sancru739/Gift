import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Lock, Unlock } from "lucide-react"
import { cn } from "@/lib/utils"

export default function SecretSection() {
  const [isOpen, setIsOpen] = useState(false)
  const [pin, setPin] = useState("")
  const [isUnlocked, setIsUnlocked] = useState(false)
  const [error, setError] = useState(false)

  const CORRECT_PIN = "143" // Simple pin for demo

  // Secret trigger: type "secret"
  useEffect(() => {
    let typed = ""
    const handleKeyDown = (e: KeyboardEvent) => {
      typed += e.key
      if (typed.length > 6) typed = typed.slice(1)
      if (typed.toLowerCase() === "secret") {
        setIsOpen(true)
        typed = ""
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [])

  const handlePinInput = (num: string) => {
    if (isUnlocked) return
    if (error) {
      setError(false)
      setPin(num)
      return
    }
    
    const newPin = pin + num
    setPin(newPin)
    
    if (newPin.length === 3) {
      if (newPin === CORRECT_PIN) {
        setTimeout(() => setIsUnlocked(true), 300)
      } else {
        setTimeout(() => {
          setError(true)
          setPin("")
        }, 300)
      }
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1 }}
          className="fixed inset-0 z-[100] bg-[#1C1917] text-[#FDFBF7] flex flex-col items-center justify-center p-4 overflow-hidden"
        >
          {/* Subtle noise/texture overlay could go here */}
          
          <button 
            onClick={() => setIsOpen(false)}
            className="absolute top-8 right-8 text-white/30 hover:text-white/70 transition-colors tracking-widest text-xs uppercase"
          >
            Cerrar
          </button>

          {!isUnlocked ? (
            <motion.div
              key="locked"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20, filter: "blur(10px)" }}
              transition={{ duration: 0.8 }}
              className="flex flex-col items-center max-w-sm w-full"
            >
              <Lock className="w-6 h-6 mb-12 text-white/30" />
              
              <div className="flex gap-4 mb-16">
                {[0, 1, 2].map((i) => (
                  <motion.div 
                    key={i}
                    animate={error ? { x: [-10, 10, -10, 10, 0] } : {}}
                    transition={{ duration: 0.4 }}
                    className={cn(
                      "w-4 h-4 rounded-full border transition-all duration-300",
                      pin.length > i ? "bg-[#D4A373] border-[#D4A373]" : "border-white/20",
                      error && "bg-red-500/50 border-red-500/50"
                    )}
                  />
                ))}
              </div>

              <div className="grid grid-cols-3 gap-6 w-64">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                  <button
                    key={num}
                    onClick={() => handlePinInput(num.toString())}
                    className="w-16 h-16 rounded-full border border-white/5 flex items-center justify-center text-xl font-light hover:bg-white/5 active:bg-white/10 transition-colors"
                  >
                    {num}
                  </button>
                ))}
                <div />
                <button
                  onClick={() => handlePinInput("0")}
                  className="w-16 h-16 rounded-full border border-white/5 flex items-center justify-center text-xl font-light hover:bg-white/5 active:bg-white/10 transition-colors"
                >
                  0
                </button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="unlocked"
              initial={{ opacity: 0, scale: 0.95, filter: "blur(10px)" }}
              animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
              transition={{ duration: 1.2, delay: 0.2 }}
              className="text-center max-w-2xl"
            >
              <Unlock className="w-6 h-6 mb-12 mx-auto text-[#D4A373]" />
              <p className="font-heading italic text-3xl md:text-5xl leading-relaxed text-white/90">
                "Eres mi hoy y todos mis mañanas."
              </p>
              <p className="mt-12 text-sm tracking-widest text-white/40 uppercase">
                La Habitación Oculta
              </p>
            </motion.div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  )
}
