import { MusicSection } from "@/components/features/Music/MusicSection"

export default function MusicPage() {
  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Soft background gradients for the whole page */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[10%] left-[20%] w-[40vw] h-[40vw] bg-primary/5 rounded-full blur-[100px] opacity-60" />
        <div className="absolute bottom-[20%] right-[10%] w-[50vw] h-[50vw] bg-muted/30 rounded-full blur-[100px] opacity-60" />
      </div>

      <div className="relative z-10">
        <MusicSection />
      </div>
    </div>
  )
}
