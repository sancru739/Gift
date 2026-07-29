import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { FileText, Image as ImageIcon, File, Download, Trash2, Eye, X } from "lucide-react"
import { supabase, type DetailItem } from "@/lib/supabase"
import TextViewerModal from "./TextViewerModal"

export default function DetailsGallery({ refreshTrigger }: { refreshTrigger: number }) {
  const [items, setItems] = useState<DetailItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  // States for text viewer
  const [viewerOpen, setViewerOpen] = useState(false)
  const [selectedTextItem, setSelectedTextItem] = useState<{title: string, url: string} | null>(null)
  
  // States for image viewer
  const [imageViewerOpen, setImageViewerOpen] = useState(false)
  const [selectedImageItem, setSelectedImageItem] = useState<{title: string, url: string} | null>(null)
  
  // State for deleting
  const [deletingId, setDeletingId] = useState<string | null>(null)

  useEffect(() => {
    async function fetchItems() {
      try {
        setLoading(true)
        const { data, error } = await supabase
          .from("detalles")
          .select("*")
          .order("created_at", { ascending: false })

        if (error) throw error
        setItems(data || [])
      } catch (err: any) {
        console.error("Error fetching details:", err)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchItems()
  }, [refreshTrigger])

  if (loading) {
    return (
      <div className="min-h-[40vh] flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-[40vh] flex items-center justify-center text-muted-foreground text-center px-4">
        <p>Hubo un problema al cargar los detalles.<br/><span className="text-sm opacity-70">({error})</span></p>
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="min-h-[40vh] flex flex-col items-center justify-center text-muted-foreground text-center px-4 space-y-4">
        <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
          <FileText className="w-8 h-8 opacity-50" />
        </div>
        <p className="text-xl font-light">Aún no hay detalles guardados.</p>
        <p className="text-sm opacity-70">Un espacio para nuestras cartas, documentos y recuerdos especiales.</p>
      </div>
    )
  }

  const getIcon = (type: string) => {
    if (type === "image") return <ImageIcon className="w-5 h-5" />
    if (type === "pdf" || type === "doc") return <File className="w-5 h-5" />
    return <FileText className="w-5 h-5" />
  }

  const handleDelete = async (item: DetailItem) => {
    if (!window.confirm(`¿Estás seguro de que quieres borrar "${item.title}"?`)) return

    try {
      setDeletingId(item.id)
      
      // 1. Extract file path from URL
      // The URL format is usually: .../storage/v1/object/public/detalles_archivos/fileName
      const urlParts = item.file_url.split('/detalles_archivos/')
      if (urlParts.length === 2) {
        const filePath = urlParts[1]
        // Remove from storage bucket
        await supabase.storage.from('detalles_archivos').remove([filePath])
      }

      // 2. Remove from database
      const { error: dbError } = await supabase
        .from('detalles')
        .delete()
        .eq('id', item.id)

      if (dbError) throw dbError

      // 3. Update UI
      setItems(items.filter(i => i.id !== item.id))
    } catch (err: any) {
      console.error("Error al borrar:", err)
      alert("Hubo un error al borrar el archivo.")
    } finally {
      setDeletingId(null)
    }
  }

  const handleOpenText = (item: DetailItem) => {
    setSelectedTextItem({ title: item.title, url: item.file_url })
    setViewerOpen(true)
  }

  const handleOpenImage = (item: DetailItem) => {
    setSelectedImageItem({ title: item.title, url: item.file_url })
    setImageViewerOpen(true)
  }

  return (
    <>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {items.map((item, index) => {
        // Mejoramos la detección de imágenes por si falla el file_type
        const isImage = item.file_type === "image" || item.file_url.match(/\.(jpg|jpeg|png|gif|webp|heic)($|\?)/i)
        
        return (
        <motion.div
          key={item.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
          className="group relative bg-card text-card-foreground rounded-3xl overflow-hidden border border-border shadow-sm hover:shadow-xl transition-all duration-500"
        >
          {isImage ? (
            <div className="aspect-video w-full overflow-hidden bg-muted relative cursor-pointer" onClick={() => handleOpenImage(item)}>
              <img 
                src={item.file_url} 
                alt={item.title} 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-white/40 transition-colors">
                  <Eye className="w-5 h-5" />
                </div>
              </div>
            </div>
          ) : (
            <div className="aspect-video w-full bg-primary/5 flex flex-col items-center justify-center relative group-hover:bg-primary/10 transition-colors">
              <div className="w-16 h-16 rounded-full bg-background flex items-center justify-center shadow-sm text-primary mb-4 transition-transform group-hover:scale-110 duration-500">
                {getIcon(item.file_type)}
              </div>
              <span className="text-sm font-medium text-muted-foreground uppercase tracking-wider">{item.file_type}</span>
              
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center bg-black/5 backdrop-blur-[2px]">
                {item.file_type === "txt" ? (
                  <button 
                    onClick={() => handleOpenText(item)}
                    className="px-6 py-2 bg-background border border-border rounded-full shadow-md text-sm font-medium hover:bg-muted transition-colors flex items-center gap-2"
                  >
                    <Eye className="w-4 h-4" />
                    Leer Carta
                  </button>
                ) : (
                  <a 
                    href={item.file_url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="px-6 py-2 bg-background border border-border rounded-full shadow-md text-sm font-medium hover:bg-muted transition-colors flex items-center gap-2"
                  >
                    <Download className="w-4 h-4" />
                    Abrir Archivo
                  </a>
                )}
              </div>
            </div>
          )}
          
          {/* Delete Button */}
          <button
            onClick={() => handleDelete(item)}
            disabled={deletingId === item.id}
            className="absolute top-3 right-3 p-2 bg-red-500/10 text-red-500 rounded-full opacity-0 group-hover:opacity-100 hover:bg-red-500 hover:text-white transition-all disabled:opacity-50"
            title="Borrar archivo"
          >
            {deletingId === item.id ? (
              <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
            ) : (
              <Trash2 className="w-4 h-4" />
            )}
          </button>
          
          <div className="p-6">
            <h3 className="text-xl font-heading font-medium tracking-tight mb-2 line-clamp-1">
              {item.title}
            </h3>
            {item.description && (
              <p className="text-muted-foreground text-sm line-clamp-2">
                {item.description}
              </p>
            )}
            <p className="text-xs text-muted-foreground/50 mt-4 font-mono">
              {new Date(item.created_at).toLocaleDateString()}
            </p>
          </div>
        </motion.div>
      )})}
    </div>

    <TextViewerModal
      isOpen={viewerOpen}
      onClose={() => setViewerOpen(false)}
      title={selectedTextItem?.title || ""}
      fileUrl={selectedTextItem?.url || ""}
    />

    {/* Image Viewer Lightbox */}
    <AnimatePresence>
      {imageViewerOpen && selectedImageItem && (
        <motion.div 
          initial={{ opacity: 0, filter: "blur(10px)" }}
          animate={{ opacity: 1, filter: "blur(0px)" }}
          exit={{ opacity: 0, filter: "blur(10px)" }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="fixed inset-0 z-[150] bg-black/90 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => setImageViewerOpen(false)}
        >
          <button 
            onClick={() => setImageViewerOpen(false)}
            className="absolute top-6 right-6 p-2 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors z-[160]"
            aria-label="Close viewer"
          >
            <X className="w-6 h-6" />
          </button>
          <motion.img 
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.95 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            src={selectedImageItem.url} 
            alt={selectedImageItem.title} 
            className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          />
        </motion.div>
      )}
    </AnimatePresence>
    </>
  )
}
