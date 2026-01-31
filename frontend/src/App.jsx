import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Detector from './pages/Detector'

function App() {
  return (
    <div className="min-h-screen bg-white">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/detector" element={<Detector />} />
      </Routes>
    </div>
  )
}

export default App
