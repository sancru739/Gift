import { AnimatePresence, motion } from "framer-motion"
import { useEasterEggs } from "@/hooks/useEasterEggs"
import { SITE_CONTENT } from "@/data/content"
import { Heart, Music, Lock } from "lucide-react"
import { useEffect, useRef } from "react"
import confetti from "canvas-confetti"
import { PremiumModal } from "@/components/ui/PremiumModal"

export function EasterEggOverlay() {
  const { unlocked, clearEgg } = useEasterEggs()
  const audioRef = useRef<HTMLAudioElement | null>(null)
  
  const { easterEggs } = SITE_CONTENT

  // Te Amo Confetti/Hearts effect
  useEffect(() => {
    if (unlocked.teAmo) {
      const duration = 3000
      const end = Date.now() + duration

      const frame = () => {
        confetti({
          particleCount: 5,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors: ['#ff0000', '#ff4d4d', '#ff9999'],
          shapes: ['circle']
        })
        confetti({
          particleCount: 5,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors: ['#ff0000', '#ff4d4d', '#ff9999'],
          shapes: ['circle']
        })

        if (Date.now() < end) {
          requestAnimationFrame(frame)
        } else {
          clearEgg('teAmo')
        }
      }
      frame()
    }
  }, [unlocked.teAmo, clearEgg])

  // Secret Music
  useEffect(() => {
    if (unlocked.shortcutPlayed) {
      if (!audioRef.current) {
        audioRef.current = new Audio(easterEggs.secretMusicSrc)
      }
      audioRef.current.play().catch(() => {})
      
      const timer = setTimeout(() => {
        clearEgg('shortcutPlayed')
      }, 5000)
      return () => clearTimeout(timer)
    } else if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.currentTime = 0
    }
  }, [unlocked.shortcutPlayed, easterEggs.secretMusicSrc, clearEgg])

  return (
    <>
      <AnimatePresence>
        {/* Date Unlocked: Secret Letter */}
        {unlocked.dateUnlocked && (
          <PremiumModal onClose={() => clearEgg('dateUnlocked')}>
            <div className="p-8 md:p-12 text-center max-w-lg mx-auto">
              <Lock className="w-8 h-8 text-primary mx-auto mb-6" />
              <div className="text-xs font-sans tracking-widest text-primary uppercase mb-4">
                {easterEggs.hiddenLetter.date}
              </div>
              <h2 className="text-3xl font-heading mb-6">{easterEggs.hiddenLetter.title}</h2>
              <p className="font-sans text-muted-foreground leading-relaxed italic">
                "{easterEggs.hiddenLetter.content}"
              </p>
            </div>
          </PremiumModal>
        )}

        {/* Logo Clicks: Secret Image */}
        {unlocked.logoClicks && (
          <PremiumModal onClose={() => clearEgg('logoClicks')} transparent>
            <div className="flex items-center justify-center p-4 h-full">
              <img 
                src={easterEggs.hiddenImage} 
                alt="Secret Memory" 
                className="max-w-full max-h-[80vh] rounded-[2rem] shadow-2xl border-4 border-white/20"
              />
            </div>
          </PremiumModal>
        )}

        {/* Mouse Hold: Secret Message */}
        {unlocked.mouseHold && (
          <PremiumModal onClose={() => clearEgg('mouseHold')} dark>
            <div className="p-12 text-center max-w-md mx-auto flex flex-col items-center justify-center h-full min-h-[50vh]">
              <Heart className="w-12 h-12 text-red-500 mx-auto mb-8 animate-[pulse_2s_ease-in-out_infinite]" />
              <p className="text-2xl font-heading font-light text-white leading-relaxed">
                {easterEggs.mouseHoldMessage}
              </p>
            </div>
          </PremiumModal>
        )}

        {/* Shortcut Played: Toast Notification */}
        {unlocked.shortcutPlayed && (
          <motion.div
            initial={{ opacity: 0, y: 50, x: "-50%" }}
            animate={{ opacity: 1, y: 0, x: "-50%" }}
            exit={{ opacity: 0, y: 20, x: "-50%" }}
            className="fixed bottom-12 left-1/2 z-[100] bg-black/80 backdrop-blur-md text-white px-6 py-3 rounded-full flex items-center gap-3 shadow-2xl border border-white/10"
          >
            <Music className="w-4 h-4 text-primary animate-bounce" />
            <span className="text-sm font-sans tracking-wide">Reproduciendo pista secreta...</span>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
