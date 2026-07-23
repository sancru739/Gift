import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Play, Pause, SkipForward, SkipBack, Volume2, VolumeX, X } from "lucide-react"
import { SITE_CONTENT } from "@/data/content"
import { cn } from "@/lib/utils"

export default function MusicWidget() {
  const [isExpanded, setIsExpanded] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [progress, setProgress] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(() => {
    const saved = localStorage.getItem("music-volume")
    return saved !== null ? parseFloat(saved) : 0.5
  })
  const [isMuted, setIsMuted] = useState(false)
  
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const { music } = SITE_CONTENT

  // Initialize audio volume
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume
    }
  }, [volume, isMuted])

  // Save volume to localStorage
  useEffect(() => {
    localStorage.setItem("music-volume", volume.toString())
  }, [volume])

  const togglePlay = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (!audioRef.current) return
    
    if (isPlaying) {
      audioRef.current.pause()
    } else {
      audioRef.current.play()
    }
    setIsPlaying(!isPlaying)
  }

  const lastUpdateTime = useRef(0)

  const handleTimeUpdate = () => {
    if (!audioRef.current) return
    const currentTime = audioRef.current.currentTime
    // Throttle updates to once per second to prevent massive re-renders
    if (currentTime - lastUpdateTime.current >= 1 || currentTime < lastUpdateTime.current) {
      setProgress(currentTime)
      lastUpdateTime.current = currentTime
    }
  }

  const handleLoadedMetadata = () => {
    if (!audioRef.current) return
    setDuration(audioRef.current.duration)
  }

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.stopPropagation()
    const newTime = parseFloat(e.target.value)
    if (audioRef.current) {
      audioRef.current.currentTime = newTime
    }
    setProgress(newTime)
  }

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.stopPropagation()
    const newVolume = parseFloat(e.target.value)
    setVolume(newVolume)
    if (newVolume > 0 && isMuted) {
      setIsMuted(false)
    }
  }

  const formatTime = (time: number) => {
    if (isNaN(time)) return "0:00"
    const mins = Math.floor(time / 60)
    const secs = Math.floor(time % 60)
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <>
      <audio
        ref={audioRef}
        src={music.src}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={() => setIsPlaying(false)}
      />

      <div className="fixed bottom-6 right-6 z-50">
        <motion.div
          layout
          initial={{ borderRadius: 32 }}
          className={cn(
            "bg-white/70 dark:bg-black/70 backdrop-blur-2xl border border-white/20 dark:border-white/10 shadow-2xl overflow-hidden flex items-center transition-all duration-500",
            isExpanded ? "w-[calc(100vw-3rem)] sm:w-[340px] rounded-3xl" : "w-16 h-16 rounded-full cursor-pointer hover:scale-105 hover:shadow-[0_0_20px_rgba(212,163,115,0.3)]"
          )}
          onClick={() => !isExpanded && setIsExpanded(true)}
        >
          <AnimatePresence mode="wait">
            {!isExpanded ? (
              <motion.div
                key="collapsed"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="w-full h-full relative"
              >
                <img 
                  src={music.albumCover} 
                  alt={music.title} 
                  className={cn("w-full h-full object-cover rounded-full p-1", isPlaying && "animate-[spin_8s_linear_infinite]")}
                />
                <div className="absolute inset-0 rounded-full border-2 border-primary/50" />
              </motion.div>
            ) : (
              <motion.div
                key="expanded"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="w-full p-4 flex flex-col gap-4"
              >
                {/* Header / Info */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img 
                      src={music.albumCover} 
                      alt={music.title} 
                      className={cn("w-12 h-12 object-cover rounded-lg shadow-md", isPlaying && "animate-[pulse_4s_ease-in-out_infinite]")}
                    />
                    <div className="flex flex-col">
                      <span className="text-sm font-semibold leading-tight text-foreground truncate max-w-[150px]">{music.title}</span>
                      <span className="text-xs text-muted-foreground">{music.artist}</span>
                    </div>
                  </div>
                  <button 
                    onClick={(e) => { e.stopPropagation(); setIsExpanded(false) }} 
                    aria-label="Close music player"
                    className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/5 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                
                {/* Progress Bar */}
                <div className="flex items-center gap-3 px-1">
                  <span className="text-[10px] font-mono text-muted-foreground min-w-[30px]">{formatTime(progress)}</span>
                  <div className="relative flex-1 h-2 flex items-center group">
                    <input
                      type="range"
                      min="0"
                      max={duration || 100}
                      value={progress}
                      aria-label="Seek time"
                      onChange={handleSeek}
                      onClick={(e) => e.stopPropagation()}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    />
                    <div className="w-full h-1 bg-black/10 dark:bg-white/10 rounded-full overflow-hidden relative pointer-events-none">
                      <div 
                        className="absolute top-0 left-0 h-full bg-primary group-hover:bg-primary/80 transition-colors" 
                        style={{ width: `${(progress / (duration || 1)) * 100}%` }}
                      />
                    </div>
                  </div>
                  <span className="text-[10px] font-mono text-muted-foreground min-w-[30px] text-right">-{formatTime((duration || 0) - progress)}</span>
                </div>
                
                {/* Controls & Volume */}
                <div className="flex items-center justify-between px-2 pt-1">
                  {/* Volume Control */}
                  <div className="flex items-center gap-2 group w-auto sm:w-24">
                    <button 
                      onClick={(e) => { e.stopPropagation(); setIsMuted(!isMuted) }}
                      aria-label={isMuted || volume === 0 ? "Unmute" : "Mute"}
                      className="text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {isMuted || volume === 0 ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                    </button>
                    <div className="relative flex-1 h-2 flex items-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.01"
                        value={isMuted ? 0 : volume}
                        aria-label="Volume"
                        onChange={handleVolumeChange}
                        onClick={(e) => e.stopPropagation()}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                      />
                      <div className="w-full h-1 bg-black/10 dark:bg-white/10 rounded-full overflow-hidden pointer-events-none">
                        <div 
                          className="h-full bg-primary" 
                          style={{ width: `${(isMuted ? 0 : volume) * 100}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Playback Controls */}
                  <div className="flex items-center justify-center gap-4">
                    <button aria-label="Previous track" className="text-foreground/50 hover:text-foreground transition-colors">
                      <SkipBack className="w-4 h-4 fill-current" />
                    </button>
                    <button 
                      onClick={togglePlay}
                      aria-label={isPlaying ? "Pause" : "Play"}
                      className="w-10 h-10 rounded-full bg-foreground text-background flex items-center justify-center hover:scale-105 transition-transform shadow-lg"
                    >
                      {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current ml-1" />}
                    </button>
                    <button aria-label="Next track" className="text-foreground/50 hover:text-foreground transition-colors">
                      <SkipForward className="w-4 h-4 fill-current" />
                    </button>
                  </div>
                  
                  {/* Spacer to balance the layout */}
                  <div className="hidden sm:block sm:w-24" />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </>
  )
}
