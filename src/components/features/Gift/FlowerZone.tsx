import { memo } from "react"
import type { FlowerMemory } from "@/data/memoriesData"

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
  const { x, y, size = 16 } = flower.position

  const handlePress = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation()
    let clientX = e.clientX
    let clientY = e.clientY

    // Fallback if triggered via keyboard or without mouse coordinates
    if (!clientX && !clientY) {
      const rect = e.currentTarget.getBoundingClientRect()
      clientX = rect.left + rect.width / 2
      clientY = rect.top + rect.height / 2
    }

    onTap(flower, clientX, clientY)
  }

  return (
    <button
      type="button"
      className="absolute cursor-pointer rounded-full select-none outline-none focus:outline-none -webkit-tap-highlight-color-transparent active:scale-95 transition-transform duration-150 min-w-[44px] min-h-[44px]"
      style={{
        left: `${x}%`,
        top: `${y}%`,
        width: `${size}%`,
        height: `${size}%`,
        transform: "translate(-50%, -50%)",
        touchAction: "manipulation",
      }}
      onClick={handlePress}
      aria-label={`Flor: ${flower.flowerName || flower.flowerType}${
        isDiscovered ? " (descubierta)" : ""
      }`}
    >
      {/* Invisible hotspot — zero visual borders or circles when idle */}
      {/* Micro-animación de halo momentánea al recibir tap */}
      {isCurrentlyTapped && (
        <span className="absolute inset-0 rounded-full animate-ping pointer-events-none opacity-40 bg-[radial-gradient(circle,_rgba(254,240,138,0.8)_0%,_rgba(212,163,115,0.4)_50%,_transparent_75%)]" />
      )}
    </button>
  )
})
