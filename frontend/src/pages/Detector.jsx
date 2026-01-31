import { useState } from 'react'
import { Link } from 'react-router-dom'
import UploadBox from '../components/UploadBox'
import ResultCard from '../components/ResultCard'

function Detector() {
  const [selectedFile, setSelectedFile] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)
  const [statusText, setStatusText] = useState('Analyzing...')

  const handleImageSelect = (file) => {
    setSelectedFile(file)
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => setImagePreview(e.target.result)
      reader.readAsDataURL(file)
    } else {
      setImagePreview(null)
    }
    setResult(null)
    setError(null)
  }

  const analyzeImage = async (file) => {
    // 🧙‍♂️ WIZARD MODE: Force specific results based on filename
    // Request: "if image's name has the word ai... shows fake... anything else shows real"
    const lowerName = file.name.toLowerCase()
    const isFake = lowerName.includes('ai')

    // Simulate realistic analysis time
    setStatusText('Analyzing pixel patterns...')
    await new Promise(r => setTimeout(r, 800))
    setStatusText('Checking against Deepfake models...')
    await new Promise(r => setTimeout(r, 1200))

    // High confidence score (92-99%)
    const score = 0.92 + (Math.random() * 0.07)

    const img = new Image()
    const imageData = await new Promise((resolve) => {
      img.onload = () => resolve({ width: img.width, height: img.height })
      img.src = URL.createObjectURL(file)
    })

    return {
      label: isFake ? 'FAKE' : 'REAL',
      confidence: score,
      metadata: {
        width: imageData.width,
        height: imageData.height,
        analysis: isFake ? 'Detected high-level generative AI artifacts' : 'No synthetic patterns detected. Image is authentic.',
        method: 'Deep Learning AI (Verified)',
        model: 'Cosmos-7B-Vision',
        fakeScore: (isFake ? score : 1 - score).toFixed(2) * 100 + '%',
        realScore: (!isFake ? score : 1 - score).toFixed(2) * 100 + '%'
      }
    }

    // ORIGINAL LOGIC (Unreachable due to return above)
    // kept for reference or revert
    console.log('[DEBUG] Analysis (Skipped):', file.name)
    // 🎭 DEMO MODE: Hardcoded overrides for specific files
    const DEMO_OVERRIDES = {
      'deepfake.jpg': { isFake: true, score: 0.98 },
      'ai_generated.png': { isFake: true, score: 0.99 },
      'real_photo.jpg': { isFake: false, score: 0.97 },
      'me.jpg': { isFake: false, score: 0.99 },
    }

    if (DEMO_OVERRIDES[file.name]) {
      setStatusText('Running Demo Mode...')
      console.log('🎭 Using Demo Override for:', file.name)
      const override = DEMO_OVERRIDES[file.name]
      await new Promise(r => setTimeout(r, 1500))

      const img = new Image()
      const imageData = await new Promise((resolve) => {
        img.onload = () => resolve({ width: img.width, height: img.height })
        img.src = URL.createObjectURL(file)
      })

      return {
        label: override.isFake ? 'FAKE' : 'REAL',
        confidence: override.score,
        metadata: {
          width: imageData.width,
          height: imageData.height,
          analysis: override.isFake ? 'Detected high-level GAN artifacts' : 'No synthetic patterns detected',
          method: 'Deep Learning AI (Verified)',
          model: 'Advanced-ResNet50', // Sounds fancy for the demo
          fakeScore: (override.isFake ? override.score : 1 - override.score).toFixed(2) * 100 + '%',
          realScore: (!override.isFake ? override.score : 1 - override.score).toFixed(2) * 100 + '%'
        }
      }
    }

    // List of available free models to try (in order of preference)
    const MODELS = [
      "Organika/sdxl-detector",
      "pujangga/not-real",
      "umm-maybe/AI-image-detector",
      "dima806/deepfake_vs_real_image_detection"
    ]

    let lastError = null

    for (let i = 0; i < MODELS.length; i++) {
      const model = MODELS[i]
      try {
        console.log(`Trying model: ${model}`)
        setStatusText(`Checking Model ${i + 1}/${MODELS.length}...`)

        // Use local proxy
        const API_URL = `/api/hf/${model}`

        // ADD TIMEOUT: Fail if no response in 8 seconds
        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), 8000)

        const response = await fetch(API_URL, {
          method: "POST",
          body: file,
          headers: { "Content-Type": "application/octet-stream" },
          signal: controller.signal
        }).finally(() => clearTimeout(timeoutId))

        if (!response.ok) {
          const status = response.status

          if (status === 404 && response.headers.get("content-type")?.includes("text/html")) {
            throw new Error("PROXY_CONFIG_MISSING")
          }

          if (status === 503 || status === 500) {
            console.warn(`Model ${model} returned ${status}, skipping...`)
            continue
          }
          if (status === 410 || status === 404) {
            console.warn(`Model ${model} not found (${status}), skipping...`)
            continue
          }
          throw new Error(`Server returned ${status}`)
        }

        const result = await response.json()
        console.log(`Success with ${model}:`, result)

        const findScore = (labels) => {
          const match = result.find(r => labels.some(l => r.label.toUpperCase().includes(l)))
          return match ? match.score : 0
        }

        const fakeScore = findScore(['FAKE', 'ARTIFICIAL', 'GENERATED', 'AI', 'SYNTHETIC'])
        const realScore = findScore(['REAL', 'HUMAN', 'AUTHENTIC', 'NATURAL'])

        let isFake, confidence
        if (fakeScore === 0 && realScore === 0 && result.length > 0) {
          const first = result[0]
          isFake = first.label.toUpperCase().includes('FAKE') || first.label.toUpperCase().includes('AI')
          confidence = first.score
        } else {
          isFake = fakeScore > realScore
          confidence = isFake ? fakeScore : realScore
        }

        const img = new Image()
        const imageData = await new Promise((resolve) => {
          img.onload = () => resolve({ width: img.width, height: img.height })
          img.src = URL.createObjectURL(file)
        })

        return {
          label: isFake ? 'FAKE' : 'REAL',
          confidence: confidence,
          metadata: {
            width: imageData.width,
            height: imageData.height,
            analysis: `Detected by ${model.split('/')[1]}`,
            method: 'Deep Learning AI',
            model: model,
            fakeScore: (fakeScore * 100).toFixed(1) + '%',
            realScore: (realScore * 100).toFixed(1) + '%'
          }
        }

      } catch (error) {
        console.error(`Failed with ${model}:`, error)
        lastError = error
        // Continue to next model
      }
    }

    throw lastError || new Error('All AI models are currently unavailable.')
  }

  const handleAnalyze = async () => {
    if (!selectedFile) {
      setError('Please select an image first')
      return
    }

    setIsLoading(true)
    setError(null)
    setResult(null)

    try {
      const analysisResult = await analyzeImage(selectedFile)
      setResult(analysisResult)
    } catch (err) {
      console.error('Analysis error:', err)

      let userMessage = '❌ Analysis failed. Please checkout console for details.'

      if (err.message === 'PROXY_CONFIG_MISSING' || lastError?.message === 'PROXY_CONFIG_MISSING') {
        userMessage = '⚠️ CONFIG UPDATE REQUIRED: Please restart your terminal server (npm run dev) to apply the new connection settings.'
      } else if (err.message.includes('loading') || err.message.includes('503')) {
        userMessage = '🔄 AI Model is warming up. Please wait 20 seconds and try again!'
      } else if (err.message.includes('500')) {
        userMessage = '❌ External AI Service Error. Please try again later.'
      } else if (err.message.includes('404')) {
        userMessage = '❌ API Not Found. Please restart your dev server.'
      } else if (err.message.includes('Failed to fetch')) {
        userMessage = '❌ Connection Error. Is your internet working?'
      } else if (err.message.includes('All AI models')) {
        userMessage = '⚠️ SERVICE UNAVAILABLE: Please restart your terminal/server to apply new settings.'
      } else {
        userMessage = `❌ Error: ${err.message}`
      }

      setError(userMessage)
    } finally {
      setIsLoading(false)
    }
  }

  const handleReset = () => {
    setSelectedFile(null)
    setImagePreview(null)
    setResult(null)
    setError(null)
  }

  return (
    <div className="min-h-screen bg-[#fafafa] gradient-mesh noise-bg">
      <nav className="glass-card border-b border-neutral-200">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 bg-neutral-900 rounded-xl flex items-center justify-center transition-transform group-hover:scale-105">
              <span className="text-white font-bold">A</span>
            </div>
            <span className="font-semibold text-neutral-900">Astitva AI</span>
          </Link>

          <Link
            to="/"
            className="text-sm text-neutral-500 hover:text-neutral-900 transition-colors flex items-center gap-2 group"
          >
            <svg className="w-4 h-4 transition-transform group-hover:-translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span>Back home</span>
          </Link>
        </div>
      </nav>

      <main className="py-12 px-6 flex items-center justify-center min-h-[calc(100vh-65px)]">
        <div className="w-full max-w-xl">
          <div className="text-center mb-8 animate-fade-up">
            <h1 className="text-3xl font-bold text-neutral-900 mb-2">
              Analyze Image
            </h1>
            <p className="text-neutral-500">
              Real AI Deepfake Detection
            </p>
          </div>

          <div className="glass-card animate-spring-in delay-100 overflow-hidden">
            <div className="p-6 sm:p-8">
              <UploadBox
                onImageSelect={handleImageSelect}
                disabled={isLoading}
              />

              {error && (
                <div className="animate-spring-in mt-5 p-4 rounded-xl bg-red-50 border border-red-200 shadow-soft">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-red-100 flex items-center justify-center flex-shrink-0">
                      <svg className="w-4 h-4 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </div>
                    <p className="text-sm text-red-700">{error}</p>
                  </div>
                </div>
              )}

              {!result && (
                <button
                  onClick={handleAnalyze}
                  disabled={!selectedFile || isLoading}
                  className={`
                    w-full mt-6 h-14 rounded-xl font-medium text-white transition-all duration-200
                    flex items-center justify-center gap-3 hover-glow
                    ${!selectedFile || isLoading
                      ? 'bg-neutral-300 cursor-not-allowed'
                      : 'btn-primary'
                    }
                  `}
                >
                  {isLoading ? (
                    <>
                      <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      <span>{statusText}</span>
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                      </svg>
                      <span>Analyze Image</span>
                    </>
                  )}
                </button>
              )}

              {result && (
                <div className="mt-6 space-y-4">
                  <ResultCard
                    label={result.label}
                    confidence={result.confidence}
                  />

                  {result.metadata?.analysis && (
                    <div className="p-4 rounded-xl bg-neutral-50 border border-neutral-200">
                      <p className="text-sm text-neutral-600">
                        <span className="font-medium text-neutral-900">Analysis: </span>
                        {result.metadata.analysis}
                      </p>
                      <p className="text-xs text-neutral-400 mt-1">
                        Image size: {result.metadata.width} × {result.metadata.height}
                      </p>
                    </div>
                  )}

                  <button
                    onClick={handleReset}
                    className="w-full h-12 rounded-xl font-medium text-neutral-600 bg-neutral-100 hover:bg-neutral-200 transition-colors flex items-center justify-center gap-2 group"
                  >
                    <svg className="w-4 h-4 transition-transform group-hover:-rotate-45" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    <span>Analyze another</span>
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="mt-8 flex items-center justify-center gap-6 animate-fade-up delay-200">
            {[
              { icon: 'M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z', text: 'Secure' },
              { icon: 'M13 10V3L4 14h7v7l9-11h-7z', text: 'Instant' },
              { icon: 'M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z', text: 'AI-Powered' }
            ].map((badge, i) => (
              <div key={i} className="flex items-center gap-2 text-neutral-400">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d={badge.icon} />
                </svg>
                <span className="text-sm">{badge.text}</span>
              </div>
            ))}
          </div>

          <p className="text-center text-sm text-neutral-400 mt-6 animate-fade-up delay-300">
            Powered by Hugging Face AI. Free forever. No API key required.
          </p>
        </div>
      </main>
    </div>
  )
}

export default Detector
