import { motion } from "framer-motion"
import { Play } from "lucide-react"
import { fadeUp } from "./animations"

interface SongCardProps {
  song: {
    id: string
    title: string
    artist: string
    cover: string
    spotify: string
    message: string
  }
}

export function SongCard({ song }: SongCardProps) {
  return (
    <motion.div
      variants={fadeUp}
      whileHover={{ y: -5, scale: 1.02 }}
      className="group relative flex flex-col sm:flex-row gap-6 p-6 rounded-[2rem] bg-card border border-border/50 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden"
    >
      {/* Background Glow on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

      {/* Album Cover */}
      <div className="relative w-24 h-24 sm:w-32 sm:h-32 rounded-xl overflow-hidden shadow-md shrink-0">
        <img 
          src={song.cover} 
          alt={`${song.title} by ${song.artist}`}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
        />
        
        {/* Play overlay */}
        <a 
          href={song.spotify}
          target="_blank"
          rel="noopener noreferrer"
          className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        >
          <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground transform scale-75 group-hover:scale-100 transition-transform duration-300">
            <Play className="w-4 h-4 ml-1 fill-current" />
          </div>
        </a>
      </div>

      {/* Content */}
      <div className="flex flex-col justify-center gap-2 z-10">
        <div>
          <h3 className="font-heading font-semibold text-xl tracking-tight text-foreground">{song.title}</h3>
          <p className="text-muted-foreground text-sm">{song.artist}</p>
        </div>
        
        <div className="mt-2 text-sm italic text-foreground/80 leading-relaxed border-l-2 border-primary/30 pl-4 py-1">
          "{song.message}"
        </div>
      </div>
    </motion.div>
  )
}
