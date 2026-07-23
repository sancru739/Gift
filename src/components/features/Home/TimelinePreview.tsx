import { motion } from "framer-motion"
import { Card } from "@/components/ui/Card"
import { SITE_CONTENT } from "@/data/content"
import { cn } from "@/lib/utils"

export default function TimelinePreview() {
  return (
    <section id="timeline" className="py-32 px-4 bg-background relative overflow-hidden">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-24 space-y-4">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-3xl md:text-5xl font-heading font-light tracking-tight text-foreground"
          >
            El Viaje
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-muted-foreground text-lg md:text-xl font-light"
          >
            Momentos que nos formaron.
          </motion.p>
        </div>

        <div className="relative">
          {/* Central Line - Hidden on Mobile, Centered on Desktop */}
          <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-[1px] bg-border/50 md:transform md:-translate-x-1/2" />

          <div className="space-y-16 md:space-y-24">
            {SITE_CONTENT.timeline.map((milestone, index) => (
              <TimelineItem key={milestone.id} milestone={milestone} index={index} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

interface TimelineItemProps {
  milestone: {
    id: string
    date: string
    title: string
    description: string
    image?: string
  }
  index: number
}

function TimelineItem({ milestone, index }: TimelineItemProps) {
  // On desktop, even index is left, odd index is right. 
  // On mobile, everything is effectively "right" aligned to the left-side line.
  const isEven = index % 2 === 0

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{
        type: "spring",
        stiffness: 70,
        damping: 20,
        mass: 1.2,
        delay: 0.1,
      }}
      className={cn(
        "relative flex flex-col md:flex-row items-start md:items-center w-full pl-16 md:pl-0",
        isEven ? "md:justify-start" : "md:justify-end"
      )}
    >
      {/* Node on the line */}
      <div className={cn(
        "absolute top-8 md:top-1/2 left-8 md:left-1/2 w-4 h-4 rounded-full bg-primary ring-4 ring-background shadow-[0_0_15px_rgba(212,163,115,0.5)] transform -translate-x-1/2 -translate-y-1/2 z-10 transition-transform hover:scale-125 duration-300"
      )} />

      <div className={cn(
        "w-full md:w-[45%] transition-all duration-500 group"
      )}>
        <Card className="relative overflow-hidden bg-white/80 dark:bg-white/10 backdrop-blur-3xl border-white/50 dark:border-white/20 shadow-lg transition-all duration-500 hover:shadow-[0_20px_40px_rgba(212,163,115,0.25)] hover:-translate-y-2 cursor-default p-0 rounded-3xl">
          {milestone.image && (
            <div className="w-full h-48 md:h-64 overflow-hidden">
              <img 
                src={milestone.image} 
                alt={milestone.title} 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                loading="lazy"
              />
            </div>
          )}
          <div className="p-8 space-y-4">
            <span className="inline-block text-sm font-medium text-primary tracking-widest uppercase">
              {milestone.date}
            </span>
            <h3 className="text-2xl font-heading font-medium text-foreground tracking-tight">
              {milestone.title}
            </h3>
            <p className="text-foreground/90 font-medium leading-relaxed text-[15px] md:text-base">
              {milestone.description}
            </p>
          </div>
        </Card>
      </div>
    </motion.div>
  )
}
