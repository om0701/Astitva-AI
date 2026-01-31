import { useEffect, useState } from 'react'

function ConfidenceBar({ confidence, label }) {
  const [width, setWidth] = useState(0)
  const [count, setCount] = useState(0)

  useEffect(() => {
    // Animate width
    const widthTimer = setTimeout(() => setWidth(confidence * 100), 200)

    // Animate count
    const duration = 1000
    const steps = 60
    const increment = (confidence * 100) / steps
    let current = 0

    const countInterval = setInterval(() => {
      current += increment
      if (current >= confidence * 100) {
        setCount(Math.round(confidence * 100))
        clearInterval(countInterval)
      } else {
        setCount(Math.round(current))
      }
    }, duration / steps)

    return () => {
      clearTimeout(widthTimer)
      clearInterval(countInterval)
    }
  }, [confidence])

  const isReal = label === 'REAL'
  const confidencePercent = Math.round(confidence * 100)

  // Determine confidence level and color
  const getConfidenceLevel = () => {
    // If it's FAKE, high confidence is bad (Red)
    if (!isReal) {
      if (confidencePercent >= 80) return { level: 'High', color: 'red' }
      if (confidencePercent >= 60) return { level: 'Medium', color: 'orange' }
      return { level: 'Low', color: 'yellow' }
    }

    // If it's REAL, high confidence is good (Emerald)
    if (confidencePercent >= 80) return { level: 'High', color: 'emerald' }
    if (confidencePercent >= 60) return { level: 'Medium', color: 'teal' }
    return { level: 'Low', color: 'cyan' }
  }

  const confidenceInfo = getConfidenceLevel()

  return (
    <div className="w-full">
      <div className="flex justify-between items-baseline mb-3">
        <span className="text-sm font-medium text-neutral-500">Confidence Level</span>
        <div className="flex items-baseline gap-0.5">
          <span className="text-3xl font-bold text-neutral-900 tabular-nums">{count}</span>
          <span className="text-lg font-medium text-neutral-400">%</span>
        </div>
      </div>

      <div className="relative h-3 bg-neutral-100 rounded-full overflow-hidden">
        <div
          className={`absolute inset-y-0 left-0 rounded-full transition-all duration-1000 ease-out 
            ${!isReal
              ? 'bg-gradient-to-r from-red-500 to-rose-600'
              : 'bg-gradient-to-r from-emerald-400 to-teal-500'
            }`}
          style={{ width: `${width}%` }}
        >
          {/* Shine effect */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_ease-in-out_infinite] bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>
          </div>
        </div>
      </div>

      {/* Scale */}
      <div className="flex justify-between mt-2">
        <span className="text-xs text-neutral-300">0%</span>
        <span className="text-xs text-neutral-300">50%</span>
        <span className="text-xs text-neutral-300">100%</span>
      </div>
    </div>
  )
}

export default ConfidenceBar
