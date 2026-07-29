import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { VideoPlaceholder } from "./VideoPlaceholder"

interface VideoPlayerProps {
  src: string
  onEnded: () => void
}

export function VideoPlayer({ src, onEnded }: VideoPlayerProps) {
  const [hasError, setHasError] = useState(false)
  const [isReady, setIsReady] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    // Wait 500ms before starting playback as requested
    const timer = setTimeout(() => {
      setIsReady(true)
      if (videoRef.current) {
        // Attempt to play if the browser allows unmuted autoplay
        // Note: Browsers may block unmuted autoplay without user interaction, 
        // but since this is navigated to after a click (opening the gift), 
        // the user has interacted and it should play fine.
        videoRef.current.play().catch((err) => {
          console.warn("Autoplay was prevented by browser:", err)
          // Fallback if needed, though interaction usually covers this
        })
      }
    }, 500)

    return () => clearTimeout(timer)
  }, [])

  const handleError = () => {
    setHasError(true)
  }

  return (
    <div className="relative w-full h-full flex items-center justify-center bg-black">
      <AnimatePresence mode="wait">
        {hasError ? (
          <VideoPlaceholder key="error-placeholder" />
        ) : (
          <motion.video
            key="cinematic-video"
            ref={videoRef}
            src={src}
            onError={handleError}
            onEnded={onEnded}
            playsInline
            controls={false}
            muted={false}
            // Start invisible, then smoothly fade and unblur when ready
            initial={{ opacity: 0, filter: "blur(20px)" }}
            animate={isReady ? { opacity: 1, filter: "blur(0px)" } : { opacity: 0, filter: "blur(20px)" }}
            transition={{ duration: 2, ease: "easeOut" }}
            className="absolute inset-0 w-full h-full object-contain md:object-cover rounded-2xl md:rounded-3xl"
          />
        )}
      </AnimatePresence>
    </div>
  )
}
