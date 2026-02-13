'use client'

import dynamic from 'next/dynamic'

const Projects = dynamic(() => import('@/components/Projects'), {
  ssr: false,
  loading: () => (
    <section id="projects" className="py-16 sm:py-20 md:py-24 relative overflow-hidden" style={{ backgroundColor: '#0a0e27' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">Featured Projects</h2>
          <div className="w-20 h-1 bg-gradient-to-r from-blue-500 to-cyan-500 mx-auto rounded-full" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-80 bg-slate-900/60 rounded-2xl border border-slate-700/50 animate-pulse" />
          ))}
        </div>
      </div>
    </section>
  ),
})

export default function ClientOnlyProjects() {
  return <Projects />
}
