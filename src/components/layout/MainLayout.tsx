import { Outlet } from "react-router-dom"
import { Navbar } from "./Navbar"
import { Footer } from "./Footer"
import { AnimatePresence, motion } from "framer-motion"
import { useLocation } from "react-router-dom"
import { EasterEggOverlay } from "./EasterEggOverlay"
import MusicWidget from "@/components/features/Music/MusicWidget"
import WelcomeLetter from "@/components/features/Home/WelcomeLetter"
import SurpriseOverlay from "@/components/features/Home/SurpriseOverlay"
import { giftConfig } from "@/config/gift"

export function MainLayout() {
  const location = useLocation()

  return (
    <div className="relative flex min-h-screen flex-col bg-background text-foreground">
      {giftConfig.enabled && giftConfig.showIntro ? (
        <SurpriseOverlay giftMode={true} />
      ) : (
        <WelcomeLetter />
      )}
      <Navbar />
      <EasterEggOverlay />
      <main className="flex-1 flex flex-col">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 15, filter: "blur(8px)", scale: 0.98 }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)", scale: 1 }}
            exit={{ opacity: 0, y: -15, filter: "blur(8px)", scale: 0.98 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }} // Spring-like graceful ease
            className="flex-1 flex flex-col w-full h-full"
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </main>
      <MusicWidget />
      <Footer />
    </div>
  )
}
