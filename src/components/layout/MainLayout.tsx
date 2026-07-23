import { Outlet } from "react-router-dom"
import { Navbar } from "./Navbar"
import { Footer } from "./Footer"
import { AnimatePresence, motion } from "framer-motion"
import { useLocation } from "react-router-dom"
import { EasterEggOverlay } from "./EasterEggOverlay"
import MusicWidget from "@/components/features/Music/MusicWidget"

export function MainLayout() {
  const location = useLocation()

  return (
    <div className="relative flex min-h-screen flex-col bg-background text-foreground">
      <Navbar />
      <EasterEggOverlay />
      <main className="flex-1 flex flex-col">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="flex-1 flex flex-col"
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
