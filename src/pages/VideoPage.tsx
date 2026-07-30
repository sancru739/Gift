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
          <VideoLayout key="video-layout">
            <VideoPlayer 
              src={`${import.meta.env.BASE_URL}videos/surprise.mp4`} 
              onEnded={handleVideoEnded} 
            />
          </VideoLayout>
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
