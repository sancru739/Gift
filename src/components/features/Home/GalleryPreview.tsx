import { motion } from "framer-motion"
import { Link } from "react-router-dom"
import { SITE_CONTENT } from "@/data/content"
import { ArrowRight } from "lucide-react"

export default function GalleryPreview() {
  return (
    <section className="py-32 px-4 bg-muted/30">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-end mb-16">
          <div className="space-y-4">
            <h2 className="text-3xl md:text-4xl font-heading font-light tracking-tight text-foreground">
              Luz Capturada
            </h2>
            <p className="text-muted-foreground text-lg">Fragmentos del tiempo.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 group">
          {SITE_CONTENT.gallery.slice(0, 4).map((photo, index) => (
            <motion.div
              key={photo.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
              className={`relative overflow-hidden rounded-[24px] bg-muted ${photo.aspect} transition-all duration-700 hover:z-10 group-hover:brightness-50 hover:!brightness-110`}
            >
              <img
                src={photo.src}
                alt="Memory"
                loading="lazy"
                className="w-full h-full object-cover transition-transform duration-[2s] ease-out hover:scale-105"
              />
            </motion.div>
          ))}
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-16 flex justify-center"
        >
          <Link 
            to="/gallery"
            className="group inline-flex items-center gap-2 px-8 py-4 bg-primary text-primary-foreground rounded-full hover:scale-105 transition-all shadow-lg hover:shadow-primary/25 font-medium tracking-wide"
          >
            Ver Galería Completa
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
