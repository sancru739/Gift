import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Plus, X, Image as ImageIcon, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"
import ReactMarkdown from "react-markdown"
import { PremiumModal } from "@/components/ui/PremiumModal"
import { supabase, type Letter } from "@/lib/supabase"

export default function Letters() {
  const [letters, setLetters] = useState<Letter[]>([])
  const [selectedLetter, setSelectedLetter] = useState<string | null>(null)
  const [isAdding, setIsAdding] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchLetters()
  }, [])

  async function fetchLetters() {
    try {
      const { data, error } = await supabase
        .from("letters")
        .select("*")
        .order("created_at", { ascending: false })
      
      if (error) throw error
      if (data) setLetters(data)
    } catch (err) {
      console.error("Error fetching letters:", err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex-1 flex flex-col bg-background min-h-screen pt-24 px-4 md:px-8 pb-32">
      <div className="max-w-4xl mx-auto w-full">
        <div className="flex justify-between items-end mb-16">
          <div>
            <h1 className="text-4xl md:text-6xl font-heading font-light tracking-tight text-foreground">
              Cartas Diarias
            </h1>
            <p className="text-muted-foreground text-lg mt-4">
              Palabras guardadas para el momento exacto en que las necesites.
            </p>
          </div>
          
          <button
            onClick={() => setIsAdding(true)}
            className="hidden md:flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-full hover:scale-105 transition-transform shadow-lg shadow-primary/20"
          >
            <Plus className="w-5 h-5" />
            <span>Nueva Carta</span>
          </button>
        </div>

        {loading ? (
          <div className="py-20 flex justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : letters.length === 0 ? (
          <div className="py-20 text-center border border-dashed border-border rounded-3xl">
            <p className="text-muted-foreground">Aún no hay cartas escritas.</p>
            <p className="text-sm text-muted-foreground mt-2">Usa el botón para crear la primera.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {letters.map((letter, index) => (
              <motion.div
                key={letter.id}
                layoutId={`letter-card-${letter.id}`}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ ease: [0.32, 0.72, 0, 1], duration: 0.8, delay: Math.min(index * 0.1, 0.6) }}
                onClick={() => setSelectedLetter(letter.id)}
                className="relative h-80 rounded-[2rem] p-8 flex flex-col justify-between overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-border/50 bg-card cursor-pointer hover:-translate-y-1 transition-transform duration-500 hover:shadow-[0_20px_40px_rgba(212,163,115,0.08)] group"
              >
                {letter.image_url && (
                  <div className="absolute inset-0 z-0">
                    <img 
                      src={letter.image_url} 
                      alt="" 
                      loading="lazy"
                      className="w-full h-full object-cover transition-all duration-700 blur-sm opacity-20 scale-100 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background/90 to-background/20" />
                  </div>
                )}

                <div className="relative z-10 flex justify-between items-start">
                  <span className="text-xs font-sans tracking-widest text-muted-foreground uppercase bg-background/50 backdrop-blur-md px-3 py-1 rounded-full border border-border/50">
                    {new Date(letter.created_at).toLocaleDateString("es-ES", { month: 'long', day: 'numeric' })}
                  </span>
                </div>

                <div className="relative z-10">
                  <h3 className="font-heading text-2xl font-medium leading-tight text-foreground line-clamp-2">
                    {letter.title}
                  </h3>
                  <p className="text-sm text-muted-foreground mt-2 line-clamp-2 font-sans">
                    {letter.content.substring(0, 100)}...
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Floating Add Button for Mobile */}
      <button
        onClick={() => setIsAdding(true)}
        className="md:hidden fixed bottom-24 right-6 w-14 h-14 bg-primary text-primary-foreground rounded-full shadow-xl shadow-primary/30 flex items-center justify-center z-40 hover:scale-110 transition-transform"
      >
        <Plus className="w-6 h-6" />
      </button>

      <AnimatePresence>
        {selectedLetter && (
          <ExpandedLetter 
            letter={letters.find(l => l.id === selectedLetter)!} 
            onClose={() => setSelectedLetter(null)} 
          />
        )}
        
        {isAdding && (
          <AddLetterModal 
            onClose={() => setIsAdding(false)} 
            onSuccess={() => {
              setIsAdding(false)
              fetchLetters()
            }}
          />
        )}
      </AnimatePresence>
    </div>
  )
}

function ExpandedLetter({ letter, onClose }: { letter: Letter, onClose: () => void }) {
  return (
    <PremiumModal 
      onClose={onClose}
      layoutId={`letter-card-${letter.id}`}
      innerClassName="max-w-3xl max-h-[85vh] bg-card rounded-[2rem] md:rounded-[3rem] overflow-y-auto hide-scrollbar pointer-events-auto flex flex-col"
    >
      {letter.image_url && (
        <div className="w-full h-64 md:h-80 relative shrink-0">
          <img src={letter.image_url} alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-card to-transparent" />
        </div>
      )}

      <div className={cn("px-6 md:px-16 pb-16 flex-1", letter.image_url ? "-mt-20 relative z-10" : "pt-12")}>
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ease: [0.32, 0.72, 0, 1], duration: 0.8, delay: 0.2 }}
          className="max-w-2xl mx-auto"
        >
          <div className="mb-12">
            <motion.div layoutId={`letter-date-${letter.id}`} className="text-sm font-sans tracking-widest text-primary uppercase mb-4">
              {new Date(letter.created_at).toLocaleDateString("es-ES", { month: 'long', day: 'numeric', year: 'numeric' })}
            </motion.div>
            <motion.h3 layoutId={`letter-title-${letter.id}`} className="font-heading text-4xl md:text-5xl text-foreground">
              {letter.title}
            </motion.h3>
          </div>

          <div className="prose prose-lg dark:prose-invert prose-p:font-sans prose-p:font-light prose-p:leading-relaxed prose-p:text-muted-foreground prose-blockquote:font-heading prose-blockquote:italic prose-blockquote:text-xl prose-blockquote:border-primary prose-blockquote:bg-primary/5 prose-blockquote:py-1 prose-blockquote:px-6 prose-blockquote:rounded-r-xl max-w-none">
            <ReactMarkdown>{letter.content}</ReactMarkdown>
          </div>
        </motion.div>
      </div>
    </PremiumModal>
  )
}

function AddLetterModal({ onClose, onSuccess }: { onClose: () => void, onSuccess: () => void }) {
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setImageFile(file)
      setImagePreview(URL.createObjectURL(file))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title || !content) {
      setError("Por favor completa el título y el contenido.")
      return
    }

    setIsSubmitting(true)
    setError("")

    try {
      let image_url = null

      if (imageFile) {
        const fileExt = imageFile.name.split('.').pop()
        const fileName = `${Math.random()}.${fileExt}`
        const filePath = `${fileName}`

        // Check if SUPABASE is configured before trying to upload
        if (!import.meta.env.VITE_SUPABASE_URL) {
          throw new Error("Supabase no está configurado. Faltan las variables de entorno.")
        }

        const { error: uploadError } = await supabase.storage
          .from('letter-images')
          .upload(filePath, imageFile)

        if (uploadError) {
          throw new Error("Error al subir la imagen. Asegúrate de haber creado el bucket 'letter-images' en Supabase.")
        }

        const { data: publicUrlData } = supabase.storage
          .from('letter-images')
          .getPublicUrl(filePath)
        
        image_url = publicUrlData.publicUrl
      }

      const { error: insertError } = await supabase
        .from("letters")
        .insert([
          { title, content, image_url }
        ])

      if (insertError) {
        throw new Error("Error al guardar la carta. Asegúrate de haber creado la tabla 'letters'.")
      }

      onSuccess()
    } catch (err: any) {
      setError(err.message || "Ocurrió un error al guardar la carta.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-background/80 backdrop-blur-sm"
        onClick={onClose}
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative w-full max-w-2xl bg-card border border-border shadow-2xl rounded-[2rem] overflow-hidden z-10 flex flex-col max-h-[90vh]"
      >
        <div className="flex justify-between items-center p-6 border-b border-border/50 shrink-0">
          <h2 className="text-2xl font-heading font-medium">Nueva Carta</h2>
          <button onClick={onClose} className="p-2 bg-muted rounded-full hover:bg-muted/80 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto">
          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 text-red-500 rounded-xl text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-2">Foto (Opcional)</label>
              <div className="flex items-center justify-center w-full">
                <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-border rounded-2xl cursor-pointer hover:bg-muted/50 transition-colors overflow-hidden relative group">
                  {imagePreview ? (
                    <>
                      <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <span className="text-white font-medium">Cambiar imagen</span>
                      </div>
                    </>
                  ) : (
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <ImageIcon className="w-8 h-8 text-muted-foreground mb-3" />
                      <p className="mb-2 text-sm text-muted-foreground"><span className="font-semibold text-primary">Haz clic para subir</span> o arrastra</p>
                    </div>
                  )}
                  <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
                </label>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-2">Título</label>
              <input 
                type="text" 
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="Un título especial..."
                className="w-full px-4 py-3 bg-muted/50 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 text-foreground"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-2">Carta (Soporta Markdown)</label>
              <textarea 
                value={content}
                onChange={e => setContent(e.target.value)}
                placeholder="Escribe lo que sientes aquí..."
                rows={8}
                className="w-full px-4 py-3 bg-muted/50 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 text-foreground resize-none"
              />
            </div>

            <div className="pt-4 flex justify-end gap-4">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-3 rounded-full font-medium text-muted-foreground hover:bg-muted transition-colors"
                disabled={isSubmitting}
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-8 py-3 bg-primary text-primary-foreground rounded-full font-medium hover:scale-105 transition-transform shadow-lg shadow-primary/20 flex items-center gap-2"
              >
                {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
                Guardar Carta
              </button>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  )
}
