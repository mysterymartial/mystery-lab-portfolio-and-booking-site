'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="fixed top-0 w-full z-50 bg-primary-dark/95 backdrop-blur-xl border-b border-slate-700/50 shadow-sm">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" suppressHydrationWarning>
        <div className="flex items-center justify-between h-16 sm:h-20">
          <Link href="/" className="flex items-center space-x-2 sm:space-x-3">
            <Image
              src="/logo.png"
              alt="Mystery Lab Logo"
              width={50}
              height={50}
              className="rounded-lg w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12"
            />
            <span className="text-base sm:text-lg md:text-xl font-bold text-white">Mystery Lab</span>
          </Link>

          <div className="hidden lg:flex items-center space-x-4 xl:space-x-6 2xl:space-x-8">
            <Link href="/" className="text-sm xl:text-base text-gray-300 hover:text-primary-vibrant transition-colors py-1 border-b-2 border-transparent hover:border-primary-vibrant">
              Home
            </Link>
            <Link href="/#services" className="text-sm xl:text-base text-gray-300 hover:text-primary-vibrant transition-colors py-1 border-b-2 border-transparent hover:border-primary-vibrant">
              Services
            </Link>
            <Link href="/booking" className="text-sm xl:text-base text-gray-300 hover:text-primary-vibrant transition-colors py-1 border-b-2 border-transparent hover:border-primary-vibrant">
              Book a Gig
            </Link>
            <Link href="/#projects" className="text-sm xl:text-base text-gray-300 hover:text-primary-vibrant transition-colors py-1 border-b-2 border-transparent hover:border-primary-vibrant">
              Projects
            </Link>
            <Link href="/#resume" className="text-sm xl:text-base text-gray-300 hover:text-primary-vibrant transition-colors py-1 border-b-2 border-transparent hover:border-primary-vibrant">
              Resume/CV
            </Link>
            <Link href="/#contact" className="text-sm xl:text-base text-gray-300 hover:text-primary-vibrant transition-colors py-1 border-b-2 border-transparent hover:border-primary-vibrant">
              Contact
            </Link>
            <Link
              href="/booking"
              className="px-2 py-1 xl:px-4 xl:py-2 bg-green-600 text-white rounded-xl hover:bg-green-500 hover:shadow-lg hover:shadow-green-500/25 transition-all duration-200 flex items-center gap-1 xl:gap-2 text-xs xl:text-sm"
            >
              <svg className="w-3 h-3 xl:w-4 xl:h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
              </svg>
              Chat
            </Link>
            <Link
              href="/admin"
              className="px-2 py-1 xl:px-4 xl:py-2 bg-primary-vibrant text-white rounded-xl hover:bg-blue-500 transition-all duration-200 text-xs xl:text-sm"
            >
              Admin
            </Link>
          </div>

          <button
            type="button"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden text-white p-2"
            aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
          >
            <svg className={`w-6 h-6 ${isMenuOpen ? 'hidden' : 'block'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
            <svg className={`w-6 h-6 ${isMenuOpen ? 'block' : 'hidden'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {isMenuOpen && (
          <div className="lg:hidden py-4 space-y-3 sm:space-y-4 border-t border-slate-700/50 mt-2">
            <Link href="/" onClick={() => setIsMenuOpen(false)} className="block text-sm sm:text-base text-gray-300 hover:text-white transition-colors py-1">Home</Link>
            <Link href="/booking" onClick={() => setIsMenuOpen(false)} className="block text-sm sm:text-base text-gray-300 hover:text-white transition-colors py-1">Book a Gig</Link>
            <Link href="/#services" onClick={() => setIsMenuOpen(false)} className="block text-sm sm:text-base text-gray-300 hover:text-white transition-colors py-1">Services</Link>
            <Link href="/#projects" onClick={() => setIsMenuOpen(false)} className="block text-sm sm:text-base text-gray-300 hover:text-white transition-colors py-1">Projects</Link>
            <Link href="/#resume" onClick={() => setIsMenuOpen(false)} className="block text-sm sm:text-base text-gray-300 hover:text-white transition-colors py-1">Resume/CV</Link>
            <Link href="/#contact" onClick={() => setIsMenuOpen(false)} className="block text-sm sm:text-base text-gray-300 hover:text-white transition-colors py-1">Contact</Link>
            <Link href="/admin" onClick={() => setIsMenuOpen(false)} className="block px-4 py-2 bg-primary-vibrant text-white rounded-xl w-fit text-sm sm:text-base hover:bg-blue-500 transition-colors">
              Admin
            </Link>
          </div>
        )}
      </nav>
    </header>
  )
}
