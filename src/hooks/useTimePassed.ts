import { useState, useEffect } from "react"

export interface TimePassed {
  days: number
  hours: number
  minutes: number
  seconds: number
}

export function useTimePassed(startDate: Date | string | number): TimePassed {
  const [timePassed, setTimePassed] = useState<TimePassed>({ days: 0, hours: 0, minutes: 0, seconds: 0 })

  useEffect(() => {
    const targetDate = new Date(startDate).getTime()

    const calculateTimePassed = () => {
      const now = new Date().getTime()
      const difference = now - targetDate

      if (difference > 0) {
        setTimePassed({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        })
      }
    }

    calculateTimePassed()
    const timer = setInterval(calculateTimePassed, 1000)

    return () => clearInterval(timer)
  }, [startDate])

  return timePassed
}
