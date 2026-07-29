import { motion } from "framer-motion"
import { Film } from "lucide-react"

export function VideoPlaceholder() {
  return (
    <motion.div
      initial={{ opacity: 0, filter: "blur(10px)" }}
      animate={{ opacity: 1, filter: "blur(0px)" }}
      transition={{ duration: 1, ease: "easeOut" }}
      className="absolute inset-0 flex flex-col items-center justify-center bg-black/50 backdrop-blur-xl"
    >
      <motion.div
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-6"
      >
        <Film className="w-6 h-6 text-white/40" />
      </motion.div>
      <h2 className="text-xl md:text-2xl font-light text-white/80 tracking-wide mb-2">
        A special moment awaits
      </h2>
      <p className="text-sm font-light text-white/40 tracking-widest uppercase">
        Preparing surprise...
      </p>
    </motion.div>
  )
}
