import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, Upload, File as FileIcon, Image as ImageIcon, Loader2 } from "lucide-react"
import { supabase } from "@/lib/supabase"
import { Button } from "@/components/ui/Button"
import heic2any from "heic2any"

interface UploadModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

export default function UploadModal({ isOpen, onClose, onSuccess }: UploadModalProps) {
  const [file, setFile] = useState<File | null>(null)
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0])
      setError(null)
    }
  }

  const getFileType = (file: File) => {
    const name = file.name.toLowerCase()
    if (file.type.startsWith("image/") || name.match(/\.(jpg|jpeg|png|gif|webp|heic)$/)) return "image"
    if (file.type === "application/pdf" || name.endsWith(".pdf")) return "pdf"
    if (file.type.includes("document") || file.type.includes("word") || name.match(/\.(doc|docx)$/)) return "doc"
    if (name.endsWith(".txt")) return "txt"
    return "text"
  }

  const handleUpload = async () => {
    if (!file || !title.trim()) {
      setError("Por favor, ponle un título y selecciona un archivo.")
      return
    }

    setIsUploading(true)
    setError(null)

    try {
      let fileToUpload = file
      let fileName = file.name
      let fileExt = fileName.split('.').pop()?.toLowerCase()

      // Si es HEIC, lo convertimos a JPG para que se pueda ver en cualquier navegador
      if (fileExt === 'heic' || file.type === 'image/heic') {
        const convertedBlob = await heic2any({
          blob: file,
          toType: "image/jpeg",
          quality: 0.8
        }) as Blob
        
        fileToUpload = new File([convertedBlob], fileName.replace(/\.heic$/i, '.jpg'), { type: 'image/jpeg' })
        fileExt = 'jpg'
        fileName = fileToUpload.name
      }

      const uniqueFileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`
      const filePath = `${uniqueFileName}`

      // Upload file to storage
      const { error: uploadError } = await supabase.storage
        .from('detalles_archivos')
        .upload(filePath, file)

      if (uploadError) throw uploadError

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('detalles_archivos')
        .getPublicUrl(filePath)

      // Save to database
      const { error: dbError } = await supabase
        .from('detalles')
        .insert([
          {
            title: title.trim(),
            description: description.trim() || null,
            file_url: publicUrl,
            file_type: getFileType(fileToUpload)
          }
        ])

      if (dbError) throw dbError

      // Success
      setFile(null)
      setTitle("")
      setDescription("")
      onSuccess()
      onClose()
      
    } catch (err: any) {
      console.error("Error uploading:", err)
      setError(err.message || "Hubo un error al subir el archivo.")
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
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
            className="relative w-full max-w-lg bg-card text-card-foreground rounded-3xl p-6 shadow-2xl border border-border overflow-hidden"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-heading font-medium tracking-tight">Agregar Detalle</h2>
              <button 
                onClick={onClose}
                className="p-2 hover:bg-muted rounded-full transition-colors text-muted-foreground hover:text-foreground"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium mb-1">Título</label>
                <input 
                  type="text" 
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Ej: Cartita de nuestro primer mes"
                  className="w-full px-4 py-2 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Descripción (Opcional)</label>
                <textarea 
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Un pequeño mensaje o nota..."
                  rows={3}
                  className="w-full px-4 py-2 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Archivo</label>
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-border border-dashed rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors relative group cursor-pointer">
                  <div className="space-y-2 text-center">
                    {!file ? (
                      <>
                        <Upload className="mx-auto h-8 w-8 text-muted-foreground group-hover:text-primary transition-colors" />
                        <div className="flex text-sm text-muted-foreground justify-center">
                          <span className="relative rounded-md font-medium text-primary hover:text-primary/80 focus-within:outline-none">
                            Seleccionar archivo
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground">PDF, DOCX, PNG, JPG, TXT</p>
                      </>
                    ) : (
                      <div className="flex flex-col items-center gap-2">
                        {getFileType(file) === "image" ? <ImageIcon className="h-8 w-8 text-primary" /> : <FileIcon className="h-8 w-8 text-primary" />}
                        <span className="text-sm font-medium text-foreground truncate max-w-[200px]">{file.name}</span>
                        <button 
                          onClick={(e) => { e.stopPropagation(); setFile(null) }}
                          className="text-xs text-destructive hover:underline"
                        >
                          Quitar archivo
                        </button>
                      </div>
                    )}
                  </div>
                  <input 
                    type="file" 
                    onChange={handleFileChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                </div>
              </div>

              {error && (
                <div className="p-3 rounded-lg bg-destructive/10 text-destructive text-sm">
                  {error}
                </div>
              )}

              <div className="pt-2">
                <Button 
                  onClick={handleUpload} 
                  disabled={isUploading}
                  className="w-full rounded-xl py-6 text-base"
                >
                  {isUploading ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Subiendo...
                    </>
                  ) : (
                    "Guardar Detalle"
                  )}
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
