import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import { VideoLayout } from "@/components/features/Video/VideoLayout"
import { VideoPlayer } from "@/components/features/Video/VideoPlayer"

export default function VideoPage() {
  const navigate = useNavigate()
  const [isFadingOut, setIsFadingOut] = useState(false)

  const handleVideoEnded = () => {
    // Fade to black before navigating
    setIsFadingOut(true)
    
    // Wait for the fade animation to finish before routing
    setTimeout(() => {
      navigate("/reveal")
    }, 1500)
  }

  return (
    <div className="relative min-h-screen bg-black">
      <AnimatePresence>
        {!isFadingOut && (
          <div className="flex flex-col items-center justify-center h-screen w-full p-6 text-center z-50 relative">
            <h2 className="text-3xl md:text-5xl font-light mb-8 text-white">
              Tu Video Especial
            </h2>
            <p className="text-lg md:text-xl font-light text-white/70 mb-12 max-w-lg">
              He guardado el video en Google Drive para que lo veas con la mejor calidad y sin interrupciones.
            </p>
            <div className="flex flex-col gap-6">
              <a
                href="https://drive.google.com/file/d/1rFYbpx2KPu5edwxwO5LlFQOOTmvFtEHk/view?usp=sharing"
                target="_blank"
                rel="noopener noreferrer"
                className="px-8 py-4 bg-white text-black rounded-full font-medium tracking-widest uppercase hover:scale-105 hover:shadow-[0_0_40px_rgba(255,255,255,0.3)] transition-all duration-300"
              >
                Ver Video en Drive
              </a>
              <button
                onClick={handleVideoEnded}
                className="px-8 py-4 bg-transparent border border-white/20 text-white rounded-full font-medium tracking-widest uppercase hover:bg-white/10 transition-all duration-300"
              >
                Continuar al siguiente paso
              </button>
            </div>
          </div>
        )}
      </AnimatePresence>
      
      {/* Black overlay that fades in when navigating away */}
      <AnimatePresence>
        {isFadingOut && (
          <motion.div
            key="fade-to-black"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, ease: "easeInOut" }}
            className="fixed inset-0 z-[100] bg-black pointer-events-none"
          />
        )}
      </AnimatePresence>
    </div>
  )
}
