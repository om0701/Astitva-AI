import ConfidenceBar from './ConfidenceBar'

function ResultCard({ label, confidence }) {
  const isReal = label === 'REAL'

  return (
    <div className="space-y-4 animate-fade-up">
      {/* Verdict Card */}
      <div className={`
        relative overflow-hidden rounded-2xl border p-6 transition-all duration-300
        ${isReal
          ? 'bg-gradient-to-br from-emerald-50 to-teal-50 border-emerald-200 shadow-glow-emerald'
          : 'bg-gradient-to-br from-red-50 to-orange-50 border-red-200 shadow-glow-red'
        }
      `}>
        {/* Background decoration */}
        <div className={`
          absolute -right-8 -top-8 w-32 h-32 rounded-full opacity-20
          ${isReal ? 'bg-emerald-400' : 'bg-red-400'}
        `}></div>

        <div className="relative flex items-center gap-5">
          {/* Icon */}
          <div className={`
            w-16 h-16 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg transition-transform hover:scale-110
            ${isReal
              ? 'bg-gradient-to-br from-emerald-500 to-teal-600 animate-pulse-glow'
              : 'bg-gradient-to-br from-red-500 to-rose-600'
            }
          `}>
            {isReal ? (
              <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
              </svg>
            )}
          </div>

          {/* Text */}
          <div>
            <p className={`text-sm font-medium mb-1 ${isReal ? 'text-emerald-600' : 'text-red-600'}`}>
              Analysis Complete
            </p>
            <p className={`text-2xl font-bold ${isReal ? 'text-emerald-900' : 'text-red-900'}`}>
              {isReal ? 'Authentic Image' : 'Likely AI-Generated'}
            </p>
            <p className={`text-sm mt-1 ${isReal ? 'text-emerald-700' : 'text-red-700'}`}>
              {isReal
                ? 'This image appears to be a genuine photograph'
                : 'Patterns consistent with synthetic media detected'
              }
            </p>
          </div>
        </div>
      </div>

      {/* Confidence */}
      <div className="glass-card p-6">
        <ConfidenceBar confidence={confidence} label={label} />
      </div>

      {/* Details */}
      <div className="rounded-2xl border border-neutral-200 bg-white p-5">
        <div className="flex items-center justify-between">
          <span className="text-sm text-neutral-500">Verdict</span>
          <span className={`
            inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium
            ${isReal
              ? 'bg-emerald-100 text-emerald-700'
              : 'bg-red-100 text-red-700'
            }
          `}>
            <span className={`w-2 h-2 rounded-full ${isReal ? 'bg-emerald-500' : 'bg-red-500'}`}></span>
            {label}
          </span>
        </div>
      </div>

      {/* Disclaimer */}
      <p className="text-xs text-center text-neutral-400 leading-relaxed">
        This analysis is based on machine learning and should be used as one factor
        in determining image authenticity. Results may not be 100% accurate.
      </p>
    </div>
  )
}

export default ResultCard
