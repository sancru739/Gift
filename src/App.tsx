import { Routes, Route, useLocation } from "react-router-dom"
import { lazy, Suspense } from "react"
import { MainLayout } from "@/components/layout/MainLayout"
import { giftConfig } from "@/config/gift"

// Lazy load route components for performance
const Home = lazy(() => import("@/pages/Home"))
const Gallery = lazy(() => import("@/pages/Gallery"))
const Dreams = lazy(() => import("@/pages/Dreams"))
const Details = lazy(() => import("@/pages/Details"))
const CountdownPage = lazy(() => import("@/pages/CountdownPage"))
const MusicPage = lazy(() => import("@/pages/MusicPage"))
const GiftPage = lazy(() => import("@/pages/GiftPage"))
const VideoPage = lazy(() => import("@/pages/VideoPage"))
const RevealPage = lazy(() => import("@/pages/RevealPage"))

export function App() {
  const location = useLocation()

  return (
    <Suspense fallback={<div className="min-h-screen bg-black" />}>
      <Routes location={location}>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Home />} />
          <Route path="gallery" element={<Gallery />} />
          <Route path="music" element={<MusicPage />} />
          <Route path="dreams" element={<Dreams />} />
          <Route path="detalles" element={<Details />} />
          <Route path="countdown" element={<CountdownPage />} />
          {giftConfig.enabled && (
            <>
              <Route path="gift" element={<GiftPage />} />
              <Route path="video" element={<VideoPage />} />
              <Route path="reveal" element={<RevealPage />} />
            </>
          )}
        </Route>
      </Routes>
    </Suspense>
  )
}

export default App

export default App
