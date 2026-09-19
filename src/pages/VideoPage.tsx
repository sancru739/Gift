import { giftConfig } from "@/config/gift"
import { motion } from "framer-motion"

export default function VideoPage() {
  const videoUrl = giftConfig.video

  return (
    <div className="flex-1 flex flex-col relative min-h-screen overflow-hidden bg-black pt-16">
      
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white/5 via-transparent to-transparent pointer-events-none" />

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5, ease: "easeInOut" }}
        className="relative z-10 w-full h-full flex-1 flex flex-col items-center justify-center p-4 md:p-8"
      >
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-5xl font-light tracking-tight text-white mb-2">
            Sorpresa en Octubre
          </h1>
          <p className="text-white/50 tracking-widest uppercase text-sm">
            Nuestro video especial
          </p>
        </div>

        <div className="w-full max-w-5xl aspect-video rounded-xl md:rounded-3xl overflow-hidden shadow-2xl border border-white/10 bg-white/5">
          <video 
            src={videoUrl}
            controls
            className="w-full h-full object-contain"
          />
        </div>
      </motion.div>
    </div>
  )
}
