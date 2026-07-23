import { motion } from "framer-motion"
import { ExternalLink } from "lucide-react"
import { fadeUp } from "./animations"

interface SpotifyEmbedProps {
  playlistUrl: string
  openInSpotifyText: string
}

export function SpotifyEmbed({ playlistUrl, openInSpotifyText }: SpotifyEmbedProps) {
  // Convert standard playlist URL to embed URL
  const embedUrl = playlistUrl.replace('spotify.com/', 'spotify.com/embed/')

  return (
    <motion.div 
      variants={fadeUp}
      className="w-full flex flex-col items-center gap-6"
    >
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
        <a 
          href={playlistUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="group flex items-center gap-2 px-6 py-3 rounded-full bg-[#1DB954] text-white hover:bg-[#1ed760] transition-all hover:scale-105 shadow-lg shadow-[#1DB954]/20"
        >
          <span className="font-semibold tracking-wide text-sm">{openInSpotifyText}</span>
          <ExternalLink className="w-4 h-4" />
        </a>

        <a 
          href="https://music.youtube.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="group flex items-center gap-2 px-6 py-3 rounded-full bg-[#FF0000] text-white hover:bg-[#ff3333] transition-all hover:scale-105 shadow-lg shadow-[#FF0000]/20"
        >
          <span className="font-semibold tracking-wide text-sm">Abrir en YT Music</span>
          <ExternalLink className="w-4 h-4" />
        </a>
      </div>

      <div className="w-full max-w-2xl rounded-2xl overflow-hidden shadow-2xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 p-1">
        <iframe 
          title="Spotify Playlist"
          src={`${embedUrl}?utm_source=generator&theme=0`} 
          width="100%" 
          height="352" 
          frameBorder="0" 
          allowFullScreen 
          allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" 
          loading="lazy"
          className="rounded-xl w-full"
        />
      </div>
    </motion.div>
  )
}
