'use client'

import { useState, useEffect } from 'react'
import ChatInterface from './ChatInterface'

/**
 * Wrapper that defers ChatInterface until after mount.
 * Renders identical placeholder on server and client to prevent hydration mismatch.
 */
export default function ClientOnlyChat() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="bg-gray-800/50 rounded-lg border border-primary-blue/30 p-4 sm:p-5 md:p-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-0 mb-4 sm:mb-6">
            <h2 className="text-xl sm:text-2xl font-bold text-white">Chat with Me</h2>
          </div>
          <div className="bg-gray-900/50 rounded-lg p-3 sm:p-4 h-64 sm:h-80 md:h-96 overflow-y-auto mb-3 sm:mb-4 flex items-center justify-center">
            <p className="text-gray-400 text-sm sm:text-base">Loading...</p>
          </div>
          <div className="space-y-3 sm:space-y-4 opacity-50">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 h-10 rounded-lg bg-gray-700/50" />
            <div className="h-20 rounded-lg bg-gray-700/50" />
            <div className="h-12 rounded-lg bg-gray-700/50" />
          </div>
        </div>
      </div>
    )
  }

  return <ChatInterface />
}
