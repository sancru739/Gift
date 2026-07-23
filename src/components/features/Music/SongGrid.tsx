import { motion } from "framer-motion"
import { SongCard } from "./SongCard"
import { staggerContainer } from "./animations"
import { SONGS } from "@/data/musicData"

export function SongGrid() {
  return (
    <motion.div 
      variants={staggerContainer}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      className="w-full grid grid-cols-1 md:grid-cols-2 gap-6 mt-16"
    >
      {SONGS.map((song) => (
        <SongCard key={song.id} song={song} />
      ))}
    </motion.div>
  )
}
