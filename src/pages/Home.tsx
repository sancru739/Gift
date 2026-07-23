import Hero from "@/components/features/Home/Hero"
import TimelinePreview from "@/components/features/Home/TimelinePreview"
import GalleryPreview from "@/components/features/Home/GalleryPreview"
import CountdownSection from "@/components/features/Home/CountdownSection"
import SecretSection from "@/components/features/Home/SecretSection"

export default function Home() {
  return (
    <div className="flex-1 flex flex-col">
      <Hero />
      <TimelinePreview />
      <GalleryPreview />
      <CountdownSection />
      
      {/* Global Elements */}
      <SecretSection />
    </div>
  )
}
