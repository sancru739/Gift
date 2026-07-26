import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Heart } from "lucide-react"

export default function WelcomeLetter() {
  const [isVisible, setIsVisible] = useState(false)
  const [isDismissing, setIsDismissing] = useState(false)

  useEffect(() => {
    // Check if the user has already seen the welcome letter this session
    // We use sessionStorage so it shows once per visit (if they close the tab and come back, it shows again)
    // If you want it to show ONLY ONCE EVER, change this to localStorage
    const hasSeenWelcome = sessionStorage.getItem("hasSeenWelcomeLetter")
    
    if (!hasSeenWelcome) {
      // Small delay before showing to let the main layout mount
      const timer = setTimeout(() => {
        setIsVisible(true)
      }, 500)
      return () => clearTimeout(timer)
    }
  }, [])

  const handleContinue = () => {
    setIsDismissing(true)
    // Save to session storage
    sessionStorage.setItem("hasSeenWelcomeLetter", "true")
    
    // Dispatch event to start the music
    window.dispatchEvent(new CustomEvent("START_MUSIC"))

    // Wait for the exit animation before completely unmounting
    setTimeout(() => {
      setIsVisible(false)
    }, 1200)
  }

  if (!isVisible && !isDismissing) return null

  return (
    <AnimatePresence>
      {!isDismissing && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, filter: "blur(10px)" }}
          transition={{ duration: 1, ease: "easeInOut" }}
          className="fixed inset-0 z-[999] bg-[#1a1715] flex items-center justify-center p-4 overflow-y-auto"
        >
          {/* Decorative background elements */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/10 via-[#1a1715] to-[#1a1715] pointer-events-none" />
          
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 1.2, delay: 0.5, ease: "easeOut" }}
            className="relative w-full max-w-2xl bg-[#FDFBF7] text-[#333333] p-8 md:p-16 rounded-[2rem] shadow-2xl overflow-hidden my-8"
          >
            {/* Paper texture overlay (subtle) */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/cream-paper.png")' }} />
            
            <div className="relative z-10 flex flex-col items-center text-center">
              <Heart className="w-8 h-8 text-[#D4A373] mb-8" />
              
              <h1 className="text-3xl md:text-5xl font-heading font-light tracking-wide text-[#2C2A29] mb-8">
                Para mi persona favorita
              </h1>
              
              <div className="space-y-6 text-lg font-light leading-relaxed text-[#4A4744] mb-12 max-w-lg">
                <p>
                  Hola mi amor,
                </p>
                <p>
                  Hice este rincón especial pensando en nosotros. Aquí están nuestras fotos, nuestros recuerdos y todas esas pequeñas cosas que hacen que nuestra historia sea única.
                </p>
                <p>
                  (Puedes editar este texto más tarde dándome las instrucciones).
                </p>
                <p className="pt-4 font-heading italic text-xl text-[#D4A373]">
                  Te amo.
                </p>
              </div>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleContinue}
                className="px-10 py-4 bg-[#2C2A29] text-[#FDFBF7] rounded-full font-medium tracking-wide uppercase text-sm hover:bg-[#D4A373] transition-colors duration-500 shadow-xl"
              >
                Abrir Regalo
              </motion.button>
              
              <p className="text-xs text-black/30 mt-6 tracking-widest uppercase">
                (Asegúrate de tener el volumen encendido)
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
