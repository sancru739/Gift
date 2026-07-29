import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { giftConfig } from "@/config/gift"
import { Countdown } from "@/components/ui/Countdown"

export default function GiftPage() {
  const [isOpened, setIsOpened] = useState(false)
  const [showVideo, setShowVideo] = useState(false)
  const [isLocked, setIsLocked] = useState(false)

  // This will be replaced by the actual video URL the user wants
  const videoUrl = giftConfig.video 

  useEffect(() => {
    const unlockTime = new Date(giftConfig.unlockDate).getTime()
    if (new Date().getTime() < unlockTime) {
      setIsLocked(true)
    }
  }, [])

  const handleOpen = () => {
    setIsOpened(true)
    
    // Simulate animation time before revealing video
    setTimeout(() => {
      setShowVideo(true)
    }, 2500)
  }

  return (
    <div className="relative min-h-screen bg-[#0a0a0a] text-white flex flex-col items-center justify-center overflow-hidden font-sans">
      
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white/5 via-transparent to-transparent pointer-events-none" />

      <AnimatePresence>
        {!showVideo ? (
          <motion.div
            key="gift-view"
            exit={{ opacity: 0, scale: 1.1, filter: "blur(10px)" }}
            transition={{ duration: 1, ease: "easeInOut" }}
            className="relative z-10 flex flex-col items-center justify-center w-full max-w-lg px-6 text-center"
          >
            
            {/* Header Text */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="mb-12"
            >
              <p className="text-sm md:text-base font-light text-white/50 tracking-widest uppercase mb-4">
                Para mi persona favorita
              </p>
              <h1 className="text-4xl md:text-6xl font-light tracking-tight mb-4">
                Esto es para vos.
              </h1>
              <p className="text-lg font-light text-white/60">
                Espero que te guste.
              </p>
            </motion.div>

            {/* Gift Box Container */}
            <div className="relative mb-16 w-64 h-64 flex items-center justify-center">
              {/* Soft shadow */}
              <motion.div
                animate={{
                  scale: [1, 1.05, 1],
                  opacity: [0.3, 0.5, 0.3],
                }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -bottom-4 w-48 h-8 bg-white/20 rounded-[100%] blur-2xl"
              />

              {/* Gift Box Animation */}
              <motion.div
                animate={isOpened ? "opened" : "idle"}
                variants={{
                  idle: {
                    y: [0, -10, 0],
                    transition: { duration: 3, repeat: Infinity, ease: "easeInOut" }
                  },
                  opened: {
                    scale: 1.1,
                    y: 10,
                    transition: { duration: 0.5 }
                  }
                }}
                className="relative z-10 w-48 h-48"
              >
                {/* Custom Confetti on Open */}
                <AnimatePresence>
                  {isOpened && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      {[...Array(20)].map((_, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 1, scale: 0, x: 0, y: 0 }}
                          animate={{ 
                            opacity: 0, 
                            scale: Math.random() * 1 + 0.5,
                            x: (Math.random() - 0.5) * 400, 
                            y: (Math.random() - 0.5) * 400 
                          }}
                          transition={{ duration: 1.5, ease: "easeOut" }}
                          className="absolute w-2 h-2 rounded-full"
                          style={{
                            backgroundColor: ['#fff', '#fcd34d', '#f472b6', '#38bdf8'][Math.floor(Math.random() * 4)]
                          }}
                        />
                      ))}
                    </div>
                  )}
                </AnimatePresence>

                {/* The Box */}
                <div className="absolute inset-x-0 bottom-0 h-32 bg-white/10 border border-white/20 backdrop-blur-md rounded-lg shadow-2xl flex items-center justify-center">
                  {/* Vertical Ribbon */}
                  <div className="absolute top-0 bottom-0 w-8 bg-[#d4a373]/80" />
                  {/* Horizontal Ribbon */}
                  <div className="absolute left-0 right-0 h-8 bg-[#d4a373]/80" />
                </div>

                {/* The Lid (flies off when opened) */}
                <motion.div
                  variants={{
                    idle: { y: 0, rotate: 0 },
                    opened: { 
                      y: -150, 
                      rotate: 15, 
                      opacity: 0, 
                      transition: { duration: 0.8, ease: "easeOut" } 
                    }
                  }}
                  className="absolute inset-x-[-10px] bottom-[120px] h-12 bg-white/15 border border-white/30 backdrop-blur-xl rounded-md shadow-lg flex justify-center z-20"
                >
                  <div className="w-8 h-full bg-[#d4a373]" />
                  {/* Bow */}
                  <motion.div 
                    variants={{
                      idle: { scale: 1 },
                      opened: { scale: 0, transition: { duration: 0.3 } }
                    }}
                    className="absolute -top-6 flex gap-1"
                  >
                    <div className="w-8 h-8 rounded-full border-4 border-[#d4a373] origin-bottom-right transform -rotate-12" />
                    <div className="w-8 h-8 rounded-full border-4 border-[#d4a373] origin-bottom-left transform rotate-12" />
                  </motion.div>
                </motion.div>
              </motion.div>
            </div>

            {/* Open Button or Countdown */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="mt-8"
            >
              {isLocked ? (
                <div className="flex flex-col items-center gap-4">
                  <p className="text-sm font-light text-white/50 tracking-widest uppercase">
                    Disponible en
                  </p>
                  <div className="scale-75 md:scale-100 origin-top">
                    <Countdown 
                      targetDate={giftConfig.unlockDate} 
                      onComplete={() => setIsLocked(false)} 
                    />
                  </div>
                </div>
              ) : (
                <button
                  onClick={handleOpen}
                  disabled={isOpened}
                  className={`group relative px-12 py-4 rounded-full font-medium tracking-widest uppercase text-sm transition-all duration-500 border
                    ${isOpened 
                      ? 'bg-transparent border-white/10 text-white/30 cursor-not-allowed' 
                      : 'bg-white text-black hover:scale-105 hover:shadow-[0_0_40px_rgba(255,255,255,0.3)] border-transparent'
                    }
                  `}
                >
                  {isOpened ? 'Abriendo...' : 'Abrir Regalo'}
                </button>
              )}
            </motion.div>

          </motion.div>
        ) : (
          <motion.div
            key="video-view"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
            className="absolute inset-0 z-50 bg-black flex items-center justify-center"
          >
            <video 
              src={videoUrl}
              autoPlay 
              controls
              className="w-full h-full object-contain max-h-screen"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
