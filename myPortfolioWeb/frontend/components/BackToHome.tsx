'use client'

import Link from 'next/link'

export default function BackToHome() {
  return (
    <Link
      href="/"
      className="inline-flex items-center gap-2 px-4 py-2 sm:px-5 sm:py-2.5 bg-white/10 hover:bg-white/20 border border-white/30 text-white rounded-xl text-sm sm:text-base font-semibold transition-all shadow-sm"
    >
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
      </svg>
      Back to Home
    </Link>
  )
}
