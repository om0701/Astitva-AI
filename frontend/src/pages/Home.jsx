import { Link } from 'react-router-dom'

function Home() {
  const features = [
    {
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
        </svg>
      ),
      title: 'Neural Detection',
      desc: 'Advanced AI analyzes pixel patterns invisible to the human eye'
    },
    {
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
        </svg>
      ),
      title: 'Instant Results',
      desc: 'Get your verdict in under 2 seconds with confidence scoring'
    },
    {
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
        </svg>
      ),
      title: 'Private & Secure',
      desc: 'Images processed locally, never stored on our servers'
    }
  ]

  return (
    <div className="min-h-screen bg-[#fafafa] gradient-mesh noise-bg">
      {/* Navbar */}
      <nav className="fixed top-0 inset-x-0 z-50 glass-card border-b border-neutral-200/50">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 bg-neutral-900 rounded-xl flex items-center justify-center transition-transform group-hover:scale-105">
              <span className="text-white font-bold">A</span>
            </div>
            <span className="font-semibold text-neutral-900">Astitva AI</span>
          </Link>

          <div className="flex items-center gap-6">
            <a href="#features" className="text-sm text-neutral-500 hover:text-neutral-900 transition-colors hidden sm:block">
              Features
            </a>
            <Link
              to="/detector"
              className="btn-primary inline-flex items-center h-10 px-5 text-sm font-medium text-white rounded-full"
            >
              <span>Launch App</span>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="animate-fade-up inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card shadow-soft mb-8 hover-glow">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-sm text-neutral-600">AI-Powered Detection</span>
          </div>

          {/* Headline */}
          <h1 className="animate-fade-up delay-100 text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-neutral-900 mb-6">
            Verify image
            <span className="block bg-gradient-to-r from-neutral-900 via-neutral-600 to-neutral-900 bg-clip-text text-transparent">
              authenticity instantly
            </span>
          </h1>

          {/* Subheadline */}
          <p className="animate-fade-up delay-200 text-lg sm:text-xl text-neutral-500 max-w-2xl mx-auto mb-10 leading-relaxed">
            Upload any photo to detect deepfakes and AI-generated content.
            Get instant results powered by advanced neural networks.
          </p>

          {/* CTA */}
          <div className="animate-fade-up delay-300 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/detector"
              className="btn-primary group inline-flex items-center gap-2 h-14 px-8 text-base font-medium text-white rounded-2xl"
            >
              <span>Start analyzing</span>
              <svg
                className="w-4 h-4 transition-transform group-hover:translate-x-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>

            <a
              href="#how-it-works"
              className="inline-flex items-center gap-2 h-14 px-6 text-base text-neutral-600 hover:text-neutral-900 transition-colors"
            >
              <span>See how it works</span>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </a>
          </div>
        </div>


      </section>

      {/* Features */}
      <section id="features" className="py-24 px-6 bg-white border-y border-neutral-100">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-neutral-900 mb-4">
              Why Astitva AI?
            </h2>
            <p className="text-neutral-500 max-w-xl mx-auto">
              Built with state-of-the-art technology to give you accurate results every time
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {features.map((feature, i) => (
              <div
                key={i}
                className="glass-card hover-tilt hover-glow p-6 cursor-default group"
              >
                <div className="w-12 h-12 rounded-xl bg-neutral-100 flex items-center justify-center mb-5 text-neutral-600 group-hover:bg-neutral-900 group-hover:text-white transition-all duration-300">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-semibold text-neutral-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-neutral-500 leading-relaxed">
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-neutral-900 mb-4">
              How it works
            </h2>
            <p className="text-neutral-500 max-w-xl mx-auto">
              Three simple steps to verify any image
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 lg:gap-12 relative px-4">
            {/* Connecting Line (Desktop) */}
            <div className="hidden md:block absolute top-12 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-neutral-200 to-transparent -z-10 opacity-50" />

            {[
              { num: '01', title: 'Upload', desc: 'Drag and drop your image or click to browse. Supports JPEG, PNG, and WebP.' },
              { num: '02', title: 'Analyze', desc: 'Our neural network scans for artifacts and pixel patterns invisible to the human eye.' },
              { num: '03', title: 'Results', desc: 'Get a clear verdict with confidence score in under 2 seconds.' }
            ].map((step, i) => (
              <div key={i} className="relative group bg-white p-6 rounded-2xl border border-neutral-100 hover:border-neutral-200 shadow-sm hover:shadow-md transition-all duration-300">
                {/* Number removed */}

                <div className="relative pt-4">
                  <div className="w-10 h-10 rounded-full bg-neutral-900 text-white flex items-center justify-center font-bold mb-4 shadow-lg shadow-neutral-500/20 group-hover:scale-110 transition-transform">
                    {i + 1}
                  </div>
                  <h3 className="text-xl font-bold text-neutral-900 mb-2">
                    {step.title}
                  </h3>
                  <p className="text-sm text-neutral-500 leading-relaxed font-medium">
                    {step.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6 bg-neutral-900 relative overflow-hidden">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Ready to verify your images?
          </h2>
          <p className="text-neutral-400 text-lg mb-10">
            Free to use. No sign up required. Start now.
          </p>
          <Link
            to="/detector"
            className="group inline-flex items-center gap-2 h-14 px-8 bg-white text-neutral-900 font-medium rounded-2xl hover:bg-neutral-100 transition-colors"
          >
            <span>Get started free</span>
            <svg
              className="w-4 h-4 transition-transform group-hover:translate-x-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-neutral-200 bg-white">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-neutral-900 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xs">A</span>
            </div>
            <span className="text-sm text-neutral-600">Astitva AI</span>
          </div>
          <p className="text-sm text-neutral-400">
            Deepfake detection powered by deep learning
          </p>
        </div>
      </footer>
    </div>
  )
}

export default Home
