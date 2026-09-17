import type { FlowerMemory } from "@/data/bouquetContent"

interface FlowerZoneProps {
  flower: FlowerMemory
  isDiscovered: boolean
  onTap: (flower: FlowerMemory, clientX: number, clientY: number) => void
}

export function FlowerZone({ flower, isDiscovered, onTap }: FlowerZoneProps) {
  const { zone } = flower

  const handleClick = (e: React.MouseEvent | React.TouchEvent) => {
    let clientX: number
    let clientY: number

    if ("touches" in e) {
      clientX = e.touches[0].clientX
      clientY = e.touches[0].clientY
    } else {
      clientX = e.clientX
      clientY = e.clientY
    }

    onTap(flower, clientX, clientY)
  }

  return (
    <div
      className="absolute cursor-pointer"
      style={{
        top: `${zone.top}%`,
        left: `${zone.left}%`,
        width: `${zone.width}%`,
        height: `${zone.height}%`,
      }}
      onClick={handleClick}
      onTouchStart={handleClick}
      role="button"
      tabIndex={0}
      aria-label={`Flor: ${flower.flower}${isDiscovered ? " (descubierta)" : ""}`}
    >
      {/* Completely invisible — no borders, no background, no indicator */}
      {/* The only visual feedback is the pulse effect in BouquetView */}
    </div>
  )
}
