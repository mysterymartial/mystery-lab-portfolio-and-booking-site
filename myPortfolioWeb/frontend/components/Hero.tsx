'use client'

import Image from 'next/image'
import Link from 'next/link'

export default function Hero() {
  return (
    <section
      className="relative min-h-screen flex items-center justify-center bg-cover bg-center bg-fixed bg-no-repeat"
      style={{
        backgroundImage: 'url(/profile-bg.png)',
      }}
    >
      <div className="absolute inset-0 z-[1]" style={{ background: 'linear-gradient(to bottom, rgba(10,14,39,0.25), rgba(10,14,39,0.2), rgba(10,14,39,0.35))' }}></div>
      <div className="absolute inset-0 z-[1] pointer-events-none" style={{ background: 'radial-gradient(ellipse at center, rgba(59,130,246,0.05) 0%, transparent 70%)' }}></div>
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="mb-8 animate-fade-in">
          <Image
            src="/logo.png"
            alt="Mystery Lab Logo"
            width={200}
            height={200}
            className="mx-auto rounded-2xl shadow-2xl shadow-primary-vibrant/20 ring-2 ring-white/10"
          />
        </div>
        <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-4 sm:mb-6 break-words px-2 animate-fade-in">
          Agbaosi Bolarinwa Minasu
        </h1>
        <h2 className="text-2xl sm:text-4xl md:text-5xl font-semibold text-primary-silver mb-3 sm:mb-4">
          (Mystery)
        </h2>
        <div className="mb-4 sm:mb-6">
          <p className="text-base sm:text-xl md:text-2xl lg:text-3xl text-primary-vibrant mb-2 font-semibold px-2">
            CEO of Mystery Lab | CTO of ALO LABS
          </p>
        </div>
        <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-white mb-2 font-semibold px-2">
          Fullstack Software Engineer & Embedded Systems Engineer
        </p>
        <p className="text-sm sm:text-base md:text-lg text-gray-300 mb-3 sm:mb-4 max-w-3xl mx-auto px-4">
          Expert in Cybersecurity, DevOps, Fintech APIs & ML | Blockchain & Web3 | Professional Musician | Martial Arts Practitioner
        </p>
        <p className="text-xs sm:text-sm md:text-base text-gray-400 mb-4 sm:mb-6 max-w-2xl mx-auto px-4">
          Specializing in Kickboxing, Taekwondo, Brazilian Jiu-Jitsu, Wrestling & More
        </p>
        <p className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-300 mb-8 sm:mb-12 max-w-3xl mx-auto px-4">
          Giving you more than you can imagine · <span className="text-primary-vibrant font-semibold">Available for employer contracts & full-time roles</span>
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center flex-wrap">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 px-4 py-2 sm:px-6 sm:py-3 md:px-8 md:py-4 bg-white/10 backdrop-blur-sm border-2 border-white/30 text-white rounded-xl text-sm sm:text-base md:text-lg font-semibold hover:bg-white/20 hover:border-white/50 hover:scale-[1.02] transition-all duration-200 shadow-sm"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            Home
          </Link>
          <Link
            href="/booking"
            className="px-4 py-2 sm:px-6 sm:py-3 md:px-8 md:py-4 bg-primary-vibrant text-white rounded-xl text-sm sm:text-base md:text-lg font-semibold hover:bg-blue-500 hover:shadow-lg hover:shadow-primary-vibrant/25 hover:scale-[1.02] transition-all duration-200"
          >
            Book a Gig
          </Link>
          <Link
            href="/#services"
            className="px-4 py-2 sm:px-6 sm:py-3 md:px-8 md:py-4 bg-white/5 backdrop-blur-sm border-2 border-white/30 text-white rounded-xl text-sm sm:text-base md:text-lg font-semibold hover:bg-white/10 hover:border-white/50 hover:scale-[1.02] transition-all duration-200 shadow-sm"
          >
            View Services
          </Link>
          <Link
            href="/booking"
            className="px-4 py-2 sm:px-6 sm:py-3 md:px-8 md:py-4 bg-green-600 text-white rounded-xl text-sm sm:text-base md:text-lg font-semibold hover:bg-green-500 hover:shadow-lg hover:shadow-green-500/25 hover:scale-[1.02] transition-all duration-200 flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
            </svg>
            Chat Now
          </Link>
        </div>
      </div>
    </section>
  )
}
