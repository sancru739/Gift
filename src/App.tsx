import { Routes, Route, useLocation } from "react-router-dom"
import { MainLayout } from "@/components/layout/MainLayout"
import Home from "@/pages/Home"
import Gallery from "@/pages/Gallery"
import Dreams from "@/pages/Dreams"
import CountdownPage from "@/pages/CountdownPage"
import MusicPage from "@/pages/MusicPage"

function App() {
  const location = useLocation()

  return (
    <Routes location={location} key={location.pathname}>
      <Route path="/" element={<MainLayout />}>
        <Route index element={<Home />} />
        <Route path="gallery" element={<Gallery />} />
        <Route path="music" element={<MusicPage />} />
        <Route path="dreams" element={<Dreams />} />
        <Route path="countdown" element={<CountdownPage />} />
      </Route>
    </Routes>
  )
}

export default App
