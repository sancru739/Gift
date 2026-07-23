import { Link, useLocation } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"
import { Heart, Menu, X } from "lucide-react"
import { useState, useEffect } from "react"

const NAV_LINKS = [
  { href: "/", label: "Inicio" },
  { href: "/gallery", label: "Galería" },
  { href: "/music", label: "Música" },
  { href: "/dreams", label: "Sueños" },
  { href: "/countdown", label: "Cuenta Regresiva" },
]

export function Navbar() {
  const [logoClicks, setLogoClicks] = useState(0)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const location = useLocation()

  const handleLogoClick = () => {
    const newCount = logoClicks + 1
    setLogoClicks(newCount)
    if (newCount === 7) {
      window.dispatchEvent(new CustomEvent('EASTER_EGG_LOGO'))
      setLogoClicks(0)
    }
  }

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false)
  }, [location.pathname])

  return (
    <>
      <motion.header 
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ ease: [0.32, 0.72, 0, 1], duration: 0.8 }}
        className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60"
      >
        <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-8">
          <Link 
            to="/"
            onClick={handleLogoClick}
            aria-label="Home and toggle secret menu"
            className="flex items-center gap-2 group cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-md"
          >
            <Heart className="h-5 w-5 text-primary group-hover:scale-110 transition-transform duration-500 ease-out" />
            <span className="font-heading font-semibold text-lg tracking-tight">Nosotros</span>
          </Link>
          
          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
            {NAV_LINKS.map((link) => {
              const isActive = location.pathname === link.href
              return (
                <Link
                  key={link.href}
                  to={link.href}
                  className={cn(
                    "relative py-1 transition-colors hover:text-foreground",
                    isActive ? "text-foreground" : "text-foreground/60"
                  )}
                >
                  {link.label}
                  {isActive && (
                    <motion.div
                      layoutId="navbar-indicator"
                      className="absolute -bottom-[21px] left-0 right-0 h-[2px] bg-foreground"
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    />
                  )}
                </Link>
              )
            })}
          </nav>

          {/* Mobile Menu Toggle */}
          <button 
            className="md:hidden p-2 text-foreground/80 hover:text-foreground"
            onClick={() => setIsMobileMenuOpen(true)}
            aria-label="Open menu"
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </motion.header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[100] bg-background/95 backdrop-blur-xl md:hidden flex flex-col"
          >
            <div className="flex items-center justify-between h-16 px-4 border-b border-border/20">
              <Link 
                to="/"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center gap-2"
              >
                <Heart className="h-5 w-5 text-primary" />
                <span className="font-heading font-semibold text-lg tracking-tight">Nosotros</span>
              </Link>
              <button 
                className="p-2 text-foreground/80 hover:text-foreground bg-muted/50 rounded-full"
                onClick={() => setIsMobileMenuOpen(false)}
                aria-label="Close menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <nav className="flex-1 overflow-y-auto py-8 px-6 flex flex-col gap-6">
              {NAV_LINKS.map((link, i) => {
                const isActive = location.pathname === link.href
                return (
                  <motion.div
                    key={link.href}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1, duration: 0.4 }}
                  >
                    <Link
                      to={link.href}
                      className={cn(
                        "block text-3xl font-heading font-light tracking-tight transition-colors",
                        isActive ? "text-foreground" : "text-muted-foreground hover:text-foreground/80"
                      )}
                    >
                      {link.label}
                    </Link>
                  </motion.div>
                )
              })}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
