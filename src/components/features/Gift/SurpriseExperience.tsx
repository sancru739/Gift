import { createPortal } from "react-dom"
import { BouquetView } from "./BouquetView"

export function SurpriseExperience() {
  return createPortal(
    <div className="fixed inset-0 z-[100] bg-[#0a0a0a] overflow-hidden h-dvh w-screen">
      <BouquetView />
    </div>,
    document.body
  )
}
