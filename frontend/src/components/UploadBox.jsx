import { useState, useRef, useCallback, useEffect } from 'react'

function UploadBox({ onImageSelect, disabled }) {
  const [isDragOver, setIsDragOver] = useState(false)
  const [preview, setPreview] = useState(null)
  const [fileInfo, setFileInfo] = useState(null)
  const fileInputRef = useRef(null)

  const handleFile = useCallback((file) => {
    if (!file) return

    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/bmp']
    if (!validTypes.includes(file.type)) {
      alert('Please upload a valid image file (JPEG, PNG, WebP, GIF, or BMP)')
      return
    }

    // Store file info
    const sizeInMB = (file.size / (1024 * 1024)).toFixed(2)
    const formatName = file.type.split('/')[1].toUpperCase()

    const reader = new FileReader()
    reader.onload = (e) => {
      const img = new Image()
      img.onload = () => {
        setFileInfo({
          name: file.name,
          size: sizeInMB,
          format: formatName,
          dimensions: `${img.width} × ${img.height}`
        })
      }
      img.src = e.target.result
      setPreview(e.target.result)
    }
    reader.readAsDataURL(file)
    onImageSelect(file)
  }, [onImageSelect])

  const handleDragOver = useCallback((e) => {
    e.preventDefault()
    if (!disabled) setIsDragOver(true)
  }, [disabled])

  const handleDragLeave = useCallback((e) => {
    e.preventDefault()
    setIsDragOver(false)
  }, [])

  const handleDrop = useCallback((e) => {
    e.preventDefault()
    setIsDragOver(false)
    if (!disabled) handleFile(e.dataTransfer.files[0])
  }, [disabled, handleFile])

  const handleClick = () => {
    if (!disabled) fileInputRef.current?.click()
  }

  const clearImage = (e) => {
    e.stopPropagation()
    setPreview(null)
    setFileInfo(null)
    onImageSelect(null)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  // Paste from clipboard support
  useEffect(() => {
    const handlePaste = (e) => {
      if (disabled) return
      const items = e.clipboardData?.items
      if (!items) return

      for (let i = 0; i < items.length; i++) {
        if (items[i].type.indexOf('image') !== -1) {
          const file = items[i].getAsFile()
          handleFile(file)
          break
        }
      }
    }

    document.addEventListener('paste', handlePaste)
    return () => document.removeEventListener('paste', handlePaste)
  }, [disabled, handleFile])

  return (
    <div
      onClick={handleClick}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`
        relative w-full min-h-[280px] rounded-2xl border-2 border-dashed cursor-pointer
        flex flex-col items-center justify-center p-8 transition-all duration-300
        ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        ${isDragOver
          ? 'border-emerald-500 bg-emerald-50/50 scale-[1.02] shadow-glow-emerald'
          : preview
            ? 'border-neutral-200 bg-neutral-50'
            : 'border-neutral-300 hover:border-neutral-400 bg-white hover:bg-neutral-50 hover-glow'
        }
      `}
    >
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={(e) => handleFile(e.target.files[0])}
        className="hidden"
        disabled={disabled}
      />

      {preview ? (
        <div className="flex flex-col items-center animate-scale-in w-full">
          <div className="relative group img-hover-zoom rounded-xl overflow-hidden">
            <img
              src={preview}
              alt="Preview"
              className="max-h-[180px] max-w-full object-contain rounded-xl shadow-lg"
            />
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl flex items-center justify-center">
              <span className="text-white text-sm font-medium">Click to change</span>
            </div>
          </div>

          {/* File Info */}
          {fileInfo && (
            <div className="mt-4 w-full max-w-xs space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="text-neutral-400">Format</span>
                <span className="font-medium text-neutral-600">{fileInfo.format}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-neutral-400">Size</span>
                <span className="font-medium text-neutral-600">{fileInfo.size} MB</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-neutral-400">Dimensions</span>
                <span className="font-medium text-neutral-600">{fileInfo.dimensions}</span>
              </div>
            </div>
          )}

          <button
            onClick={clearImage}
            disabled={disabled}
            className="mt-4 text-sm text-neutral-500 hover:text-neutral-900 transition-colors flex items-center gap-1.5 group"
          >
            <svg className="w-4 h-4 transition-transform group-hover:scale-110" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
            Remove image
          </button>
        </div>
      ) : (
        <div className="flex flex-col items-center text-center">
          {/* Icon */}
          <div className={`
            w-16 h-16 mb-5 rounded-2xl flex items-center justify-center transition-all duration-300
            ${isDragOver
              ? 'bg-neutral-900 scale-110'
              : 'bg-neutral-100 group-hover:bg-neutral-200'
            }
          `}>
            {isDragOver ? (
              <svg className="w-8 h-8 text-white animate-bounce" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            ) : (
              <svg className="w-8 h-8 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
              </svg>
            )}
          </div>

          {/* Text */}
          <p className={`text-base font-medium mb-2 transition-colors ${isDragOver ? 'text-emerald-700' : 'text-neutral-700'}`}>
            {isDragOver ? 'Drop your image here' : 'Drag and drop your image'}
          </p>
          <p className="text-sm text-neutral-400 mb-4">
            click to browse or paste from clipboard
          </p>

          {/* Supported formats */}
          <div className="flex items-center gap-2">
            {['JPG', 'PNG', 'WebP'].map((format) => (
              <span
                key={format}
                className="px-2 py-1 text-xs font-medium text-neutral-400 bg-neutral-100 rounded-md"
              >
                {format}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default UploadBox
