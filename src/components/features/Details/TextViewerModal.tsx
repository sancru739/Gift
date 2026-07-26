import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, Heart, Loader2 } from "lucide-react"

interface TextViewerModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  fileUrl: string
}

export default function TextViewerModal({ isOpen, onClose, title, fileUrl }: TextViewerModalProps) {
  const [content, setContent] = useState<string>("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (isOpen && fileUrl) {
      const fetchText = async () => {
        try {
          setLoading(true)
          setError(null)
          const response = await fetch(fileUrl)
          if (!response.ok) throw new Error("No se pudo cargar el texto")
          const text = await response.text()
          setContent(text)
        } catch (err: any) {
          setError(err.message || "Error al cargar la carta")
        } finally {
          setLoading(false)
        }
      }
      fetchText()
    }
  }, [isOpen, fileUrl])

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          onClick={(e) => e.stopPropagation()}
          className="relative w-full max-w-3xl max-h-[85vh] bg-[#FDFBF7] rounded-[2rem] shadow-2xl overflow-hidden flex flex-col"
        >
          {/* Paper texture overlay (subtle) */}
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/cream-paper.png")' }} />
          
          {/* Header */}
          <div className="relative z-10 flex items-center justify-between p-6 border-b border-[#D4A373]/20">
            <div className="flex items-center gap-3">
              <Heart className="w-5 h-5 text-[#D4A373]" />
              <h2 className="text-xl font-heading font-medium text-[#2C2A29]">{title}</h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-black/5 text-[#4A4744] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content Area */}
          <div className="relative z-10 flex-1 overflow-y-auto p-8 md:p-12 custom-scrollbar">
            {loading ? (
              <div className="flex flex-col items-center justify-center h-full min-h-[200px] text-[#D4A373]">
                <Loader2 className="w-8 h-8 animate-spin mb-4" />
                <p className="font-light">Desplegando la carta...</p>
              </div>
            ) : error ? (
              <div className="flex flex-col items-center justify-center h-full min-h-[200px] text-red-400">
                <p className="font-light">{error}</p>
              </div>
            ) : (
              <div className="prose prose-stone max-w-none">
                {/* We render the text with whitespace preserved to maintain paragraphs */}
                <p className="text-lg font-light leading-relaxed text-[#4A4744] whitespace-pre-wrap font-serif">
                  {content}
                </p>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
