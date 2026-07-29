import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"

interface TimeLeft {
  days: number
  hours: number
  minutes: number
  seconds: number
}

interface CountdownProps {
  targetDate: string | number | Date
  onComplete?: () => void
}

export function Countdown({ targetDate, onComplete }: CountdownProps) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({ days: 0, hours: 0, minutes: 0, seconds: 0 })
  const [isFinished, setIsFinished] = useState(false)
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
    const targetTime = new Date(targetDate).getTime()
    
    const calculateTimeLeft = () => {
      const now = new Date().getTime()
      const difference = targetTime - now

      if (difference <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 })
        if (!isFinished) {
          setIsFinished(true)
          if (onComplete) onComplete()
        }
      } else {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000)
        })
      }
    }

    calculateTimeLeft()
    const timer = setInterval(calculateTimeLeft, 1000)

    return () => clearInterval(timer)
  }, [targetDate, isFinished, onComplete])

  if (!isMounted) return null

  return (
    <AnimatePresence mode="wait">
      {isFinished ? (
        <motion.div
          key="finished-state"
          initial={{ opacity: 0, y: 10, filter: "blur(10px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="py-12"
        >
          <h2 className="text-3xl md:text-5xl font-light tracking-tight text-white/90">
            It's finally today.
          </h2>
        </motion.div>
      ) : (
        <motion.div
          key="countdown-state"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.05, filter: "blur(10px)" }}
          transition={{ duration: 0.8 }}
          className="flex flex-wrap justify-center gap-4 md:gap-8"
        >
          {[
            { label: "Days", value: timeLeft.days },
            { label: "Hours", value: timeLeft.hours },
            { label: "Minutes", value: timeLeft.minutes },
            { label: "Seconds", value: timeLeft.seconds }
          ].map((unit, i) => (
            <motion.div
              key={unit.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1, duration: 0.5, ease: "easeOut" }}
              className="flex flex-col items-center"
            >
              <div className="w-20 h-20 md:w-28 md:h-28 flex items-center justify-center bg-white/5 rounded-2xl border border-white/10 shadow-inner backdrop-blur-md mb-3 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent opacity-50 pointer-events-none" />
                <span className="text-4xl md:text-6xl font-light tabular-nums tracking-tighter text-white">
                  {unit.value.toString().padStart(2, '0')}
                </span>
              </div>
              <span className="text-xs md:text-sm font-light text-white/50 tracking-widest uppercase">
                {unit.label}
              </span>
            </motion.div>
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  )
}
