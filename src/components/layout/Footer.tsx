import { motion } from "framer-motion"

export function Footer() {
  return (
    <footer className="w-full bg-background pt-64 pb-12 flex flex-col items-center justify-end relative">
      <div className="w-full h-40 bg-gradient-to-b from-background to-muted/30 absolute bottom-0 left-0 -z-10 pointer-events-none" />
      <motion.p 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false, amount: 0.8 }}
        transition={{ ease: [0.32, 0.72, 0, 1], duration: 1.2 }}
        className="text-[11px] uppercase tracking-[0.3em] font-sans text-muted-foreground/50"
      >
        Continuará.
      </motion.p>
    </footer>
  )
}
