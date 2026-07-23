import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"

interface CassetteProps {
  onInsert: () => void
}

export function Cassette({ onInsert }: CassetteProps) {
  const [isInserting, setIsInserting] = useState(false)

  const playCassetteSound = () => {
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)()
      
      // First click (inserting)
      const osc1 = ctx.createOscillator()
      const gain1 = ctx.createGain()
      osc1.type = 'square'
      osc1.frequency.setValueAtTime(100, ctx.currentTime)
      osc1.frequency.exponentialRampToValueAtTime(40, ctx.currentTime + 0.1)
      gain1.gain.setValueAtTime(0.5, ctx.currentTime)
      gain1.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1)
      osc1.connect(gain1)
      gain1.connect(ctx.destination)
      osc1.start()
      osc1.stop(ctx.currentTime + 0.1)

      // Second click (locking in place)
      setTimeout(() => {
        const osc2 = ctx.createOscillator()
        const gain2 = ctx.createGain()
        osc2.type = 'square'
        osc2.frequency.setValueAtTime(150, ctx.currentTime)
        osc2.frequency.exponentialRampToValueAtTime(50, ctx.currentTime + 0.15)
        gain2.gain.setValueAtTime(0.6, ctx.currentTime)
        gain2.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.15)
        osc2.connect(gain2)
        gain2.connect(ctx.destination)
        osc2.start()
        osc2.stop(ctx.currentTime + 0.15)
      }, 300)

    } catch (e) {
      console.warn("AudioContext not supported or blocked", e)
    }
  }

  const handleClick = () => {
    if (isInserting) return
    setIsInserting(true)
    playCassetteSound()
    
    // Animate insertion, then trigger callback
    setTimeout(() => {
      onInsert()
    }, 1200) // Delay to let animation finish before showing playlist
  }

  return (
    <AnimatePresence>
      {!isInserting ? (
        <motion.div
          exit={{ 
            y: 200, 
            opacity: 0, 
            rotateX: 45,
            transition: { duration: 1, ease: "easeIn" } 
          }}
          className="flex justify-center items-center py-20 perspective-1000"
        >
          <motion.div
            onClick={handleClick}
            whileHover={{ 
              y: -10, 
              rotateZ: 2, 
              scale: 1.05,
              boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)"
            }}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className={cn(
              "relative cursor-pointer w-64 h-40 md:w-80 md:h-48 rounded-xl overflow-hidden",
              "bg-gradient-to-br from-zinc-800 to-zinc-900 border-2 border-zinc-700 shadow-2xl",
              "flex flex-col items-center justify-between p-4"
            )}
          >
            {/* Top screws */}
            <div className="w-full flex justify-between px-2">
              <div className="w-2 h-2 rounded-full bg-zinc-700 shadow-inner" />
              <div className="w-2 h-2 rounded-full bg-zinc-700 shadow-inner" />
            </div>

            {/* Sticker / Label */}
            <div className="w-full h-24 bg-[#E5D5C5] rounded-md border border-zinc-600 flex flex-col items-center pt-2 relative overflow-hidden">
              <div className="w-full border-t-4 border-red-500/80 mb-2" />
              <span className="font-heading text-zinc-800 font-bold tracking-widest text-sm uppercase">
                Mix Vol. 1
              </span>
              <div className="flex gap-12 mt-2">
                {/* Reels */}
                <div className="w-8 h-8 rounded-full bg-zinc-900 border-4 border-zinc-200 flex items-center justify-center">
                  <div className="w-2 h-2 bg-zinc-200 rounded-full" />
                </div>
                <div className="w-8 h-8 rounded-full bg-zinc-900 border-4 border-zinc-200 flex items-center justify-center">
                  <div className="w-2 h-2 bg-zinc-200 rounded-full" />
                </div>
              </div>
              {/* Tape window */}
              <div className="absolute bottom-2 w-32 h-6 bg-zinc-900 rounded opacity-80" />
            </div>

            {/* Bottom area */}
            <div className="w-48 h-8 border-t-2 border-zinc-700/50 trapezoid bg-zinc-800 flex items-center justify-center">
              <div className="w-2 h-2 rounded-full bg-zinc-700 mx-8" />
              <div className="w-2 h-2 rounded-full bg-zinc-700 mx-8" />
            </div>

          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  )
}
