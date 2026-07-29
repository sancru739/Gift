import type { ReactNode } from "react"
import { motion } from "framer-motion"

interface VideoLayoutProps {
  children: ReactNode
}

export function VideoLayout({ children }: VideoLayoutProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 1.5, ease: "easeInOut" } }}
      transition={{ duration: 1 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black overflow-hidden p-4 md:p-12"
    >
      <div className="relative w-full max-w-5xl aspect-video rounded-2xl md:rounded-3xl shadow-[0_0_50px_rgba(255,255,255,0.05)] bg-white/5 border border-white/5 flex items-center justify-center overflow-hidden">
        {children}
      </div>
    </motion.div>
  )
}
