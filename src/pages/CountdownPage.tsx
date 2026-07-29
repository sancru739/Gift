import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import confetti from "canvas-confetti"
import { SITE_CONTENT } from "@/data/content"
import { Countdown } from "@/components/ui/Countdown"

export default function CountdownPage() {
  const [isZero, setIsZero] = useState(false)
  const { motivationalMessage } = SITE_CONTENT.countdown

  // Check immediately on mount if date is already passed
  useEffect(() => {
    const target = new Date(SITE_CONTENT.countdown.targetDate).getTime()
    if (new Date().getTime() >= target) {
      setIsZero(true)
      fireConfetti()
    }
  }, [])

  const handleComplete = () => {
    setIsZero(true)
    fireConfetti()
  }

  function fireConfetti() {
    const duration = 5 * 1000
    const animationEnd = Date.now() + duration
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 }

    const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min

    const interval: any = setInterval(function() {
      const timeLeft = animationEnd - Date.now()

      if (timeLeft <= 0) {
        return clearInterval(interval)
      }

      const particleCount = 50 * (timeLeft / duration)
      
      // Warm gold/cream confetti colors matching our palette
      const colors = ['#D4A373', '#FDFBF7', '#E5E5E5']

      confetti(Object.assign({}, defaults, { 
        particleCount, 
        colors,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } 
      }))
      confetti(Object.assign({}, defaults, { 
        particleCount, 
        colors,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } 
      }))
    }, 250)
  }

  return (
    <div className="flex-1 flex flex-col relative min-h-screen overflow-hidden bg-background">
      {/* Animated Background */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-background via-muted/30 to-background animate-[pulse_10s_ease-in-out_infinite]" />
        <div className="absolute -top-[20%] -right-[10%] w-[70vw] h-[70vw] rounded-full bg-primary/10 blur-[120px] mix-blend-multiply opacity-50 animate-[spin_20s_linear_infinite]" />
        <div className="absolute -bottom-[20%] -left-[10%] w-[70vw] h-[70vw] rounded-full bg-primary/5 blur-[120px] mix-blend-multiply opacity-50 animate-[spin_25s_linear_infinite_reverse]" />
      </div>

      <div className="relative z-10 flex-1 flex flex-col items-center justify-center p-4">
        
        <AnimatePresence mode="wait">
          {isZero ? (
            <motion.div
              key="zero-state"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="text-center space-y-6"
            >
              <h1 className="text-6xl md:text-8xl font-heading font-light tracking-tight text-foreground bg-clip-text text-transparent bg-gradient-to-b from-primary to-primary/60">
                Por fin juntos.
              </h1>
            </motion.div>
          ) : (
            <motion.div
              key="countdown-state"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
              className="flex flex-col items-center"
            >
              <div className="text-center space-y-4 mb-16">
                <h2 className="text-sm md:text-base tracking-[0.3em] text-muted-foreground uppercase font-sans">
                  Hasta nuestro próximo encuentro
                </h2>
              </div>

              <div className="w-full max-w-4xl mx-auto mb-16">
                <Countdown 
                  targetDate={SITE_CONTENT.countdown.targetDate}
                  onComplete={handleComplete}
                />
              </div>

              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1, duration: 1 }}
                className="mt-12 max-w-lg text-center"
              >
                <p className="font-heading italic text-2xl text-foreground/80">
                  "{motivationalMessage}"
                </p>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  )
}
