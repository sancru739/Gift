import { motion } from "framer-motion"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"
import type { ReactNode } from "react"

export interface PremiumModalProps {
  children: ReactNode
  onClose: () => void
  layoutId?: string
  transparent?: boolean
  dark?: boolean
  className?: string
  innerClassName?: string
}

export function PremiumModal({ 
  children, 
  onClose, 
  layoutId, 
  transparent = false, 
  dark = false,
  className,
  innerClassName
}: PremiumModalProps) {
  return (
    <div 
      className={cn(
        "fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8 pointer-events-auto",
        className
      )}
      role="dialog"
      aria-modal="true"
    >
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.4 }}
        className={cn(
          "absolute inset-0 backdrop-blur-2xl",
          dark ? "bg-black/95" : transparent ? "bg-black/60" : "bg-background/90"
        )}
        onClick={onClose}
        aria-label="Close modal background"
      />
      
      {/* Modal Container */}
      <motion.div
        {...(layoutId ? { layoutId } : {
          initial: { opacity: 0, scale: 0.95, y: 20 },
          animate: { opacity: 1, scale: 1, y: 0 },
          exit: { opacity: 0, scale: 0.95, y: 20 }
        })}
        transition={{ ease: [0.32, 0.72, 0, 1], duration: 0.8 }}
        className={cn(
          "relative z-10 w-full flex flex-col",
          !transparent && "bg-card rounded-[2rem] md:rounded-[3rem] shadow-2xl border border-border/50 overflow-hidden",
          innerClassName
        )}
      >
        {/* Close Button */}
        <div className="absolute top-4 right-4 md:top-8 md:right-8 z-50">
          <button 
            onClick={onClose}
            aria-label="Close"
            className={cn(
              "p-3 rounded-full transition-colors backdrop-blur-md shadow-sm",
              dark || transparent 
                ? "bg-white/10 hover:bg-white/20 text-white" 
                : "bg-muted/80 hover:bg-muted text-foreground"
            )}
          >
            <X className="w-5 h-5 md:w-6 md:h-6" />
          </button>
        </div>
        
        {children}
      </motion.div>
    </div>
  )
}
