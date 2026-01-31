import { useState } from 'react'

function ImageInsights({ file, imageUrl }) {
    const [metadata, setMetadata] = useState(null)
    const [isExpanded, setIsExpanded] = useState(false)

    // Extract basic metadata from file if available
    useState(() => {
        if (file) {
            const img = new Image()
            img.onload = () => {
                setMetadata({
                    fileName: file.name,
                    fileSize: (file.size / (1024 * 1024)).toFixed(2) + ' MB',
                    fileType: file.type.split('/')[1].toUpperCase(),
                    dimensions: `${img.width} × ${img.height}`,
                    aspectRatio: (img.width / img.height).toFixed(2),
                    megapixels: ((img.width * img.height) / 1000000).toFixed(1) + ' MP'
                })
            }
            img.src = imageUrl
        }
    }, [file, imageUrl])

    if (!metadata) return null

    const insights = [
        { label: 'File Name', value: metadata.fileName, icon: 'M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z' },
        { label: 'Format', value: metadata.fileType, icon: 'M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z' },
        { label: 'File Size', value: metadata.fileSize, icon: 'M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4' },
        { label: 'Dimensions', value: metadata.dimensions, icon: 'M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4' },
        { label: 'Aspect Ratio', value: metadata.aspectRatio, icon: 'M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3' },
        { label: 'Resolution', value: metadata.megapixels, icon: 'M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z' }
    ]

    return (
        <div className="mt-6 animate-spring-in">
            <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="w-full flex items-center justify-between p-4 rounded-xl bg-neutral-50 hover:bg-neutral-100 transition-colors group"
            >
                <div className="flex items-center gap-2">
                    <svg className="w-5 h-5 text-neutral-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="font-medium text-neutral-700">Image Insights</span>
                </div>
                <svg
                    className={`w-5 h-5 text-neutral-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
            </button>

            {isExpanded && (
                <div className="mt-3 grid grid-cols-2 gap-3 animate-fade-in">
                    {insights.map((insight, i) => (
                        <div
                            key={i}
                            className="glass-card p-3 hover-glow group"
                            style={{ animationDelay: `${i * 50}ms` }}
                        >
                            <div className="flex items-start gap-3">
                                <div className="w-8 h-8 rounded-lg bg-neutral-100 flex items-center justify-center flex-shrink-0 group-hover:bg-neutral-900 group-hover:text-white transition-colors">
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d={insight.icon} />
                                    </svg>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-xs text-neutral-400 mb-0.5">{insight.label}</p>
                                    <p className="text-sm font-medium text-neutral-900 truncate">{insight.value}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

export default ImageInsights
