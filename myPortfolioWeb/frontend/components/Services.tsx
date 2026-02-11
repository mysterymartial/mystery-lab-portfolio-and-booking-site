'use client'

export default function Services() {
  const techServices = [
    'Tech Products',
    'Website Development',
    'Mobile Apps',
    'Desktop Apps',
    'IoT Devices',
    'Embedded System Electronics',
    'Game Development',
    'Blockchain & Web3',
    'Fintech & Payment APIs',
    'System Design',
    'System Architecture',
    'Cybersecurity',
    'DevOps',
    'AI, ML & Data Science',
  ]

  const musicServices = [
    'Saxophone Performance',
    'Birthday Surprise',
    'Live Band',
    'Studio Recordings',
    'Any Genre of Music',
  ]

  const martialArtsServices = [
    'Taekwondo',
    'Kickboxing',
    'Brazilian Jiu-Jitsu (BJJ)',
    'Wrestling',
    'MMA',
    'Self-Defense Classes',
  ]

  return (
    <section id="services" className="py-16 sm:py-20 md:py-24 bg-[#0a0e27]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight">Our Services</h2>
          <div className="w-20 h-1 bg-gradient-to-r from-primary-vibrant to-cyan-500 mx-auto rounded-full mb-4"></div>
          <p className="text-gray-400 text-base sm:text-lg md:text-xl px-4 max-w-2xl mx-auto">Giving you more than you can imagine</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {/* Tech Services */}
          <div className="bg-slate-900/50 backdrop-blur-sm p-6 sm:p-8 rounded-2xl border border-slate-700/50 hover:border-primary-vibrant/40 hover:shadow-xl hover:shadow-primary-vibrant/10 hover:-translate-y-1 transition-all duration-300 shadow-sm">
            <div className="text-3xl sm:text-4xl mb-3 sm:mb-4">💻</div>
            <h3 className="text-xl sm:text-2xl font-bold text-white mb-4 sm:mb-6">Technology</h3>
            <ul className="space-y-2 sm:space-y-3">
              {techServices.map((service, index) => (
                <li key={index} className="flex items-start text-gray-300 text-sm sm:text-base">
                  <span className="text-primary-vibrant mr-2 flex-shrink-0">•</span>
                  <span>{service}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Music Services */}
          <div className="bg-slate-900/60 backdrop-blur-sm p-6 sm:p-8 rounded-2xl border border-slate-700/50 hover:border-primary-vibrant/40 hover:shadow-xl hover:shadow-primary-vibrant/10 hover:-translate-y-0.5 transition-all duration-300 shadow-lg">
            <div className="text-3xl sm:text-4xl mb-3 sm:mb-4">🎷</div>
            <h3 className="text-xl sm:text-2xl font-bold text-white mb-4 sm:mb-6">Music</h3>
            <div className="flex flex-wrap gap-2">
              {musicServices.map((service, index) => (
                <span key={index} className="px-3 py-1.5 bg-slate-800/80 text-slate-300 rounded-lg text-xs sm:text-sm font-medium border border-slate-700/50 hover:border-primary-vibrant/30 hover:text-primary-vibrant transition-colors">
                  {service}
                </span>
              ))}
            </div>
          </div>

          {/* Martial Arts Services */}
          <div className="bg-slate-900/60 backdrop-blur-sm p-6 sm:p-8 rounded-2xl border border-slate-700/50 hover:border-primary-vibrant/40 hover:shadow-xl hover:shadow-primary-vibrant/10 hover:-translate-y-0.5 transition-all duration-300 sm:col-span-2 lg:col-span-1 shadow-lg">
            <div className="text-3xl sm:text-4xl mb-3 sm:mb-4">🥋</div>
            <h3 className="text-xl sm:text-2xl font-bold text-white mb-4 sm:mb-6">Martial Arts</h3>
            <div className="flex flex-wrap gap-2">
              {martialArtsServices.map((service, index) => (
                <span key={index} className="px-3 py-1.5 bg-slate-800/80 text-slate-300 rounded-lg text-xs sm:text-sm font-medium border border-slate-700/50 hover:border-primary-vibrant/30 hover:text-primary-vibrant transition-colors">
                  {service}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="text-center mt-12">
          <a
            href="/booking"
            className="inline-block px-8 py-4 bg-primary-vibrant text-white rounded-xl text-base sm:text-lg font-semibold hover:bg-blue-500 hover:shadow-lg hover:shadow-primary-vibrant/25 hover:scale-[1.02] transition-all duration-200"
          >
            Book a Service
          </a>
        </div>
      </div>
    </section>
  )
}
