import { motion, useScroll, useTransform } from "framer-motion"
import { Button } from "@/components/ui/Button"
import { useEffect, useState } from "react"
import { SITE_CONTENT } from "@/data/content"

export default function Hero() {
  const { scrollY } = useScroll()
  const y = useTransform(scrollY, [0, 1000], [0, 300])
  const opacity = useTransform(scrollY, [0, 500], [1, 0])

  const handleWalkWithMe = () => {
    const timelineElement = document.getElementById("timeline");
    if (!timelineElement) return;

    const timelineTop = timelineElement.getBoundingClientRect().top + window.scrollY;
    
    window.scrollTo({ top: timelineTop, behavior: "smooth" });
    
    setTimeout(() => {
      const targetY = timelineTop + timelineElement.offsetHeight - window.innerHeight + 100;
      const duration = 60000; // 60 seconds to scroll very slowly
      let startTime: number | null = null;
      let animationFrameId: number;
      let isAutoScrolling = true;

      const stopScroll = () => {
        isAutoScrolling = false;
        cancelAnimationFrame(animationFrameId);
        window.removeEventListener("wheel", stopScroll);
        window.removeEventListener("touchstart", stopScroll);
      };

      window.addEventListener("wheel", stopScroll, { passive: true });
      window.addEventListener("touchstart", stopScroll, { passive: true });

      const animateScroll = (currentTime: number) => {
        if (!isAutoScrolling) return;
        if (!startTime) startTime = currentTime;
        const timeElapsed = currentTime - startTime;
        const progress = Math.min(timeElapsed / duration, 1);
        
        window.scrollTo(0, timelineTop + (targetY - timelineTop) * progress);

        if (timeElapsed < duration) {
          animationFrameId = requestAnimationFrame(animateScroll);
        } else {
          stopScroll();
        }
      };

      animationFrameId = requestAnimationFrame(animateScroll);
    }, 800);
  };

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-background">
      {/* Animated Gradient Background */}
      <motion.div 
        style={{ y, opacity }}
        className="absolute inset-0 z-0 flex items-center justify-center pointer-events-none"
      >
        <div className="absolute top-[20%] left-[20%] w-[50vw] h-[50vw] bg-primary/10 rounded-full blur-[100px] opacity-50 animate-[pulse_8s_ease-in-out_infinite]" />
        <div className="absolute bottom-[20%] right-[20%] w-[60vw] h-[60vw] bg-muted/60 rounded-full blur-[100px] opacity-50 animate-[pulse_10s_ease-in-out_infinite_reverse]" />
      </motion.div>

      {/* Floating Lights */}
      <FloatingLights />

      {/* Glass Effect Center Content */}
      <div className="relative z-10 w-full px-4 flex flex-col items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="relative max-w-3xl w-full flex flex-col items-center text-center p-12 md:p-16 rounded-[2rem] bg-white/20 dark:bg-white/10 backdrop-blur-xl border border-white/30 shadow-2xl space-y-8"
        >
          <div className="space-y-4">
            <h1 className="font-sans font-light text-5xl md:text-7xl lg:text-8xl tracking-tight text-foreground bg-clip-text text-transparent bg-gradient-to-b from-foreground to-foreground/70">
              {SITE_CONTENT.hero.headline}
            </h1>
            <p className="font-sans font-normal text-lg md:text-xl text-muted-foreground tracking-wide">
              {SITE_CONTENT.hero.subtitle}
            </p>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.8, ease: "easeOut" }}
          >
            <Button 
              onClick={handleWalkWithMe}
              className="group relative rounded-full px-10 py-7 bg-foreground text-background hover:bg-foreground overflow-hidden transition-all duration-500 shadow-[0_0_20px_rgba(212,163,115,0.2)] hover:shadow-[0_0_40px_rgba(212,163,115,0.5)] border border-transparent hover:border-primary/30"
            >
              <span className="relative z-10 font-sans tracking-wide group-hover:tracking-[0.15em] transition-all duration-500 ease-out text-sm md:text-base">
                {SITE_CONTENT.hero.cta}
              </span>
              <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}

function FloatingLights() {
  const [lights, setLights] = useState<{ id: number, x: number, y: number, size: number, duration: number, delay: number }[]>([])

  useEffect(() => {
    // Reduced from 40 to 12 for significant performance improvement
    const generated = Array.from({ length: 12 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 4 + 2,
      duration: Math.random() * 15 + 15,
      delay: Math.random() * -20,
    }))
    setLights(generated)
  }, [])

  return (
    <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
      {lights.map((light) => (
        <motion.div
          key={light.id}
          className="absolute rounded-full bg-primary/30 blur-[2px]"
          style={{
            left: `${light.x}%`,
            top: `${light.y}%`,
            width: light.size,
            height: light.size,
          }}
          animate={{
            y: ["0%", "-200%"],
            opacity: [0, 0.8, 0],
            scale: [1, 1.5, 1],
          }}
          transition={{
            duration: light.duration,
            delay: light.delay,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      ))}
    </div>
  )
}
