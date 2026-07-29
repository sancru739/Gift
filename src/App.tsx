import { Routes, Route, useLocation } from "react-router-dom"
import { lazy, Suspense } from "react"
import type { ComponentType } from "react"
import { MainLayout } from "@/components/layout/MainLayout"
import { giftConfig } from "@/config/gift"

// Wrapper to handle chunk load errors (404s after a new deploy) by auto-reloading once
function lazyWithRetry<T extends ComponentType<any>>(componentImport: () => Promise<{ default: T }>) {
  return lazy(async () => {
    const pageHasAlreadyBeenForceRefreshed = JSON.parse(
      window.sessionStorage.getItem('page-has-been-force-refreshed') || 'false'
    )
    try {
      const component = await componentImport()
      window.sessionStorage.setItem('page-has-been-force-refreshed', 'false')
      return component
    } catch (error) {
      if (!pageHasAlreadyBeenForceRefreshed) {
        window.sessionStorage.setItem('page-has-been-force-refreshed', 'true')
        window.location.reload()
        // Return a promise that never resolves while the page is reloading
        return new Promise<{ default: T }>(() => {}) 
      }
      throw error
    }
  })
}

// Lazy load route components for performance
const Home = lazyWithRetry(() => import("@/pages/Home"))
const Gallery = lazyWithRetry(() => import("@/pages/Gallery"))
const Dreams = lazyWithRetry(() => import("@/pages/Dreams"))
const Details = lazyWithRetry(() => import("@/pages/Details"))
const CountdownPage = lazyWithRetry(() => import("@/pages/CountdownPage"))
const MusicPage = lazyWithRetry(() => import("@/pages/MusicPage"))
const GiftPage = lazyWithRetry(() => import("@/pages/GiftPage"))
const VideoPage = lazyWithRetry(() => import("@/pages/VideoPage"))
const RevealPage = lazyWithRetry(() => import("@/pages/RevealPage"))

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
