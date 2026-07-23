import { useEffect, useState } from "react"

export type EasterEggState = {
  teAmo: boolean;
  dateUnlocked: boolean;
  logoClicks: boolean;
  shortcutPlayed: boolean;
  mouseHold: boolean;
}

export function useEasterEggs() {
  const [unlocked, setUnlocked] = useState<EasterEggState>({
    teAmo: false,
    dateUnlocked: false,
    logoClicks: false,
    shortcutPlayed: false,
    mouseHold: false,
  })

  // 1. Typing "te amo"
  // 2. Typing specific date "14052021"
  useEffect(() => {
    let keyBuffer = ""
    const TE_AMO = "teamo"
    const DATE = "14052021" // May 14, 2021

    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if typing in an input
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return

      // Handle keyboard shortcut Ctrl+Shift+L
      if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'l') {
        e.preventDefault()
        setUnlocked(prev => ({ ...prev, shortcutPlayed: true }))
        return
      }

      const char = e.key.toLowerCase()
      // Only keep alphanumeric to build the buffer
      if (/^[a-z0-9]$/.test(char)) {
        keyBuffer += char
        // Keep buffer from growing infinitely
        if (keyBuffer.length > 20) {
          keyBuffer = keyBuffer.slice(-20)
        }

        if (keyBuffer.includes(TE_AMO) && !unlocked.teAmo) {
          setUnlocked(prev => ({ ...prev, teAmo: true }))
          keyBuffer = "" // Reset after trigger
        } else if (keyBuffer.includes(DATE) && !unlocked.dateUnlocked) {
          setUnlocked(prev => ({ ...prev, dateUnlocked: true }))
          keyBuffer = "" // Reset after trigger
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [unlocked.teAmo, unlocked.dateUnlocked])

  // 3. Holding the mouse for 5 seconds
  useEffect(() => {
    let timeoutId: NodeJS.Timeout

    const handleMouseDown = (e: MouseEvent) => {
      // Only trigger on the main background/non-interactive elements to avoid blocking UI
      if ((e.target as HTMLElement).closest('button, a, input')) return
      
      timeoutId = setTimeout(() => {
        setUnlocked(prev => ({ ...prev, mouseHold: true }))
      }, 5000)
    }

    const handleMouseUp = () => {
      clearTimeout(timeoutId)
    }

    window.addEventListener('mousedown', handleMouseDown)
    window.addEventListener('mouseup', handleMouseUp)
    window.addEventListener('mouseleave', handleMouseUp)

    return () => {
      window.removeEventListener('mousedown', handleMouseDown)
      window.removeEventListener('mouseup', handleMouseUp)
      window.removeEventListener('mouseleave', handleMouseUp)
      clearTimeout(timeoutId)
    }
  }, [])

  // 4. Logo clicks via custom event
  useEffect(() => {
    const handleLogoEgg = () => setUnlocked(prev => ({ ...prev, logoClicks: true }))
    window.addEventListener('EASTER_EGG_LOGO', handleLogoEgg)
    return () => window.removeEventListener('EASTER_EGG_LOGO', handleLogoEgg)
  }, [])

  // Provide a way to clear specific eggs (e.g. closing modals)
  const clearEgg = (egg: keyof EasterEggState) => {
    setUnlocked(prev => ({ ...prev, [egg]: false }))
  }

  return { unlocked, clearEgg }
}
