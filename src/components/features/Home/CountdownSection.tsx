import { useState, useEffect } from "react"
import { motion } from "framer-motion"

// Start date: January 11, 2026
const START_DATE = new Date("2026-01-11T00:00:00")

export default function CountdownSection() {
  const [timePassed, setTimePassed] = useState(calculateTimePassed())

  useEffect(() => {
    const timer = setInterval(() => {
      setTimePassed(calculateTimePassed())
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  function calculateTimePassed() {
    const difference = +new Date() - +START_DATE
    let passed = {
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
    }

    if (difference > 0) {
      passed = {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      }
    }
    return passed
  }

  return (
    <section className="py-40 bg-background flex flex-col items-center justify-center overflow-hidden">
      <div className="text-center space-y-4 mb-16">
        <h2 className="text-xl tracking-widest text-muted-foreground uppercase font-sans">
          Desde el 11 de Enero de 2026
        </h2>
      </div>

      <div className="flex gap-4 md:gap-12 text-center">
        <TimeUnit value={timePassed.days} label="Días" />
        <TimeUnit value={timePassed.hours} label="Horas" />
        <TimeUnit value={timePassed.minutes} label="Minutos" />
        <TimeUnit value={timePassed.seconds} label="Segundos" />
      </div>
    </section>
  )
}

function TimeUnit({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center">
      <div className="relative">
        <motion.span
          key={value}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="text-6xl md:text-[12vw] font-sans font-thin tracking-tighter leading-none text-transparent bg-clip-text bg-gradient-to-b from-primary to-primary/50"
        >
          {String(value).padStart(2, "0")}
        </motion.span>
      </div>
      <span className="text-sm md:text-lg text-muted-foreground mt-4 font-light tracking-wide">
        {label}
      </span>
    </div>
  )
}
