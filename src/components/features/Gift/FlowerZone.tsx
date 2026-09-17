import { memo } from "react"
import type { FlowerMemory } from "@/data/bouquetContent"

interface FlowerZoneProps {
  flower: FlowerMemory
  isDiscovered: boolean
  isCurrentlyTapped: boolean
  onTap: (flower: FlowerMemory, clientX: number, clientY: number) => void
}

export const FlowerZone = memo(function FlowerZone({
  flower,
  isDiscovered,
  isCurrentlyTapped,
  onTap,
}: FlowerZoneProps) {
  const { zone } = flower

  const handlePress = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation()
    let x = e.clientX
    let y = e.clientY

    // Fallback if triggered via keyboard or without coordinates
    if (!x && !y) {
      const rect = e.currentTarget.getBoundingClientRect()
      x = rect.left + rect.width / 2
      y = rect.top + rect.height / 2
    }

    onTap(flower, x, y)
  }

  return (
    <button
      type="button"
      className="absolute cursor-pointer rounded-full select-none outline-none focus:outline-none -webkit-tap-highlight-color-transparent active:scale-95 transition-transform duration-150 min-w-[44px] min-h-[44px]"
      style={{
        top: `${zone.top}%`,
        left: `${zone.left}%`,
        width: `${zone.width}%`,
        height: `${zone.height}%`,
        touchAction: "manipulation",
      }}
      onClick={handlePress}
      aria-label={`Flor: ${flower.flower}${isDiscovered ? " (descubierta)" : ""}`}
    >
      {/* Invisible normally — no permanent borders, no permanent circles, no text */}
      {/* Sutil micro-animación al ser tocada */}
      {isCurrentlyTapped && (
        <span
          className="absolute inset-0 rounded-full animate-ping pointer-events-none opacity-40 bg-[radial-gradient(circle,_rgba(254,240,138,0.8)_0%,_rgba(212,163,115,0.4)_50%,_transparent_75%)]"
        />
      )}
    </button>
  )
})
