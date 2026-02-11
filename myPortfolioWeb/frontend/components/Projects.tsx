'use client'

export default function Projects() {
  const projects = [
    {
      title: 'GigWave',
      description: 'A music gig marketplace platform connecting musicians with event organizers. Book live performances, studio sessions, and entertainment for any occasion.',
      link: 'https://gigwave-66jg-git-dev-agbaosi-bolarinwa-mysterys-projects.vercel.app/',
      tech: ['Next.js', 'TypeScript', 'Firebase'],
      icon: '🎵',
      gradient: 'from-blue-600 to-cyan-500',
      accent: 'violet',
    },
    {
      title: 'Purity Family Services',
      description: 'Premium home care platform delivering compassionate, licensed care. Companion care, personal care, medication management, and specialized support for families.',
      link: 'https://www.purityfamilyservice.com/',
      tech: ['Next.js', 'TypeScript', 'Healthcare'],
      icon: '🏥',
      gradient: 'from-teal-600 to-cyan-500',
      accent: 'teal',
    },
    {
      title: 'Semicolon Biometrics',
      description: 'IoT biometric attendance system with hardware device and cloud server. Real-time fingerprint recognition for workforce management and access control.',
      link: 'https://semicolon-biometrics.vercel.app',
      tech: ['Next.js', 'IoT', 'Biometrics', 'Hardware'],
      icon: '🔐',
      gradient: 'from-amber-600 to-orange-500',
      accent: 'amber',
    },
  ]

  return (
    <section id="projects" className="py-16 sm:py-20 md:py-24 relative overflow-hidden" style={{ backgroundColor: '#0a0e27' }}>
      {/* Subtle grid overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(59,130,246,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.03)_1px,transparent_1px)] bg-[size:64px_64px]" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight">
            Featured Projects
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Built with precision and care—scalable solutions across tech and healthcare.
          </p>
          <div className="w-20 h-1 bg-gradient-to-r from-primary-vibrant to-cyan-500 mx-auto mt-6 rounded-full" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {projects.map((project, index) => (
            <a
              key={index}
              href={project.link}
              target="_blank"
              rel="noopener noreferrer"
              className="group block"
            >
              <div className="h-full bg-slate-900/60 backdrop-blur-sm rounded-2xl border border-slate-700/50 hover:border-primary-vibrant/50 transition-all duration-300 overflow-hidden hover:shadow-2xl hover:shadow-primary-vibrant/10 hover:-translate-y-1 shadow-sm isolate">
                <div className="h-40 flex items-center justify-center relative overflow-hidden rounded-t-2xl" style={{ background: project.gradient === 'from-blue-600 to-cyan-500' ? 'linear-gradient(to bottom right, #2563eb, #06b6d4)' : project.gradient === 'from-teal-600 to-cyan-500' ? 'linear-gradient(to bottom right, #0d9488, #06b6d4)' : 'linear-gradient(to bottom right, #d97706, #f97316)' }}>
                  <span className="text-6xl opacity-90 group-hover:scale-110 transition-transform duration-300">
                    {project.icon}
                  </span>
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors" />
                </div>
                <div className="p-6 sm:p-8">
                  <h3 className="text-xl sm:text-2xl font-bold text-white mb-3 group-hover:text-primary-vibrant transition-colors">
                    {project.title}
                  </h3>
                  <p className="text-gray-400 mb-5 text-sm sm:text-base leading-relaxed">
                    {project.description}
                  </p>
                  <div className="flex flex-wrap gap-2 mb-5">
                    {project.tech.map((tech, techIndex) => (
                      <span
                        key={techIndex}
                        className="px-3 py-1.5 bg-slate-800/80 text-slate-300 rounded-lg text-xs font-medium border border-slate-700/50"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                  <span className="inline-flex items-center gap-2 text-primary-vibrant font-semibold text-sm group-hover:gap-3 transition-all">
                    View Project
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </span>
                </div>
              </div>
            </a>
          ))}
        </div>

        <div className="text-center mt-12">
          <a
            href="https://github.com/mysterymartial"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 sm:px-8 sm:py-4 bg-slate-800/80 text-white rounded-xl text-base font-semibold hover:bg-slate-700/80 transition-all border border-slate-700/50 hover:border-slate-600"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
            </svg>
            View More on GitHub
          </a>
        </div>
      </div>
    </section>
  )
}
