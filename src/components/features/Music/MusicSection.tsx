import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Cassette } from "./Cassette"
import { SpotifyEmbed } from "./SpotifyEmbed"
import { SongGrid } from "./SongGrid"
import { MUSIC_CONTENT } from "@/data/musicData"
import { fadeUp, staggerContainer } from "./animations"

export function MusicSection() {
  const [hasPlayedIntro, setHasPlayedIntro] = useState(false)
  const [showCassette, setShowCassette] = useState(false)
  const [showContent, setShowContent] = useState(false)

  useEffect(() => {
    const played = localStorage.getItem("music-intro-played") === "true"
    if (played) {
      setHasPlayedIntro(true)
      setShowContent(true)
    } else {
      // Sequence the intro text then the cassette
      const timer = setTimeout(() => {
        setShowCassette(true)
      }, 5000) // 5 seconds for the text to play out
      return () => clearTimeout(timer)
    }
  }, [])

  const handleCassetteInsert = () => {
    setShowCassette(false)
    localStorage.setItem("music-intro-played", "true")
    setTimeout(() => {
      setHasPlayedIntro(true)
      setShowContent(true)
    }, 1000) // Wait for cassette exit animation
  }

  return (
    <div className="w-full max-w-[900px] mx-auto px-4 md:px-8 py-20 md:py-32 flex flex-col items-center">
      
      {/* Title Area */}
      <motion.div 
        initial="hidden"
        animate="visible"
        variants={staggerContainer}
        className="text-center space-y-6 mb-16 md:mb-24"
      >
        <motion.h1 
          variants={fadeUp}
          className="text-4xl md:text-6xl font-heading font-light tracking-tight text-foreground bg-clip-text text-transparent bg-gradient-to-br from-foreground to-foreground/60"
        >
          {MUSIC_CONTENT.title}
        </motion.h1>
        <motion.p 
          variants={fadeUp}
          className="text-lg md:text-xl text-muted-foreground whitespace-pre-line leading-relaxed max-w-xl mx-auto"
        >
          {MUSIC_CONTENT.subtitle}
        </motion.p>
      </motion.div>

      {/* Main Content Area */}
      <div className="w-full relative min-h-[50vh] flex flex-col items-center justify-center">
        <AnimatePresence mode="wait">
          {!hasPlayedIntro && (
            <motion.div 
              key="intro"
              className="absolute inset-0 flex flex-col items-center justify-start pt-10"
              exit={{ opacity: 0, transition: { duration: 0.5 } }}
            >
              {!showCassette && (
                <motion.div 
                  initial="hidden"
                  animate="visible"
                  variants={staggerContainer}
                  className="space-y-4 text-center"
                >
                  {MUSIC_CONTENT.experienceMessage.map((msg, i) => (
                    <motion.p 
                      key={i}
                      variants={fadeUp}
                      className="text-lg md:text-xl font-light text-foreground/80 tracking-wide"
                    >
                      {msg}
                    </motion.p>
                  ))}
                </motion.div>
              )}

              {showCassette && (
                <motion.div 
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 1, ease: "easeOut" }}
                >
                  <Cassette onInsert={handleCassetteInsert} />
                </motion.div>
              )}
            </motion.div>
          )}

          {showContent && (
            <motion.div
              key="content"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.2, ease: [0.32, 0.72, 0, 1] }}
              className="w-full flex flex-col items-center"
            >
              <SpotifyEmbed 
                playlistUrl={MUSIC_CONTENT.playlistUrl} 
                openInSpotifyText={MUSIC_CONTENT.openInSpotify} 
              />
              <SongGrid />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

    </div>
  )
}
