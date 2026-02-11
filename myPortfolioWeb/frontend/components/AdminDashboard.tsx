'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useAuth } from '@/lib/firebase'
import AdminChat from './AdminChat'
import AdminReviews from './AdminReviews'
import AdminSettings from './AdminSettings'
import AdminBookings from './AdminBookings'

export default function AdminDashboard() {
  const { logout } = useAuth()
  const [activeTab, setActiveTab] = useState<'chats' | 'reviews' | 'bookings' | 'settings'>('chats')

  const handleLogout = async () => {
    try {
      await logout()
    } catch (error: any) {
      alert('Logout failed: ' + error.message)
    }
  }

  return (
    <div className="min-h-screen bg-[#0a0e27]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 md:py-8">
        <div className="mb-4 sm:mb-6">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-4 py-2 sm:px-5 sm:py-2.5 bg-white/10 hover:bg-white/20 border border-white/30 text-white rounded-xl text-sm sm:text-base font-semibold transition-all"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Home
          </Link>
        </div>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-0 mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white">Admin Dashboard</h1>
          <button
            onClick={handleLogout}
            className="px-4 py-2 sm:px-5 sm:py-2 md:px-6 md:py-2 bg-red-600 text-white rounded-lg text-sm sm:text-base hover:bg-red-700 transition-colors"
          >
            Logout
          </button>
        </div>

        <div className="flex flex-wrap gap-2 sm:gap-3 md:gap-4 mb-6 sm:mb-8">
          <button
            onClick={() => setActiveTab('chats')}
            className={`px-3 py-2 sm:px-4 sm:py-2 md:px-6 md:py-3 rounded-lg text-xs sm:text-sm md:text-base font-semibold transition-all ${
              activeTab === 'chats'
                ? 'bg-primary-vibrant text-white'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            Chats
          </button>
          <button
            onClick={() => setActiveTab('reviews')}
            className={`px-3 py-2 sm:px-4 sm:py-2 md:px-6 md:py-3 rounded-lg text-xs sm:text-sm md:text-base font-semibold transition-all ${
              activeTab === 'reviews'
                ? 'bg-primary-vibrant text-white'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            Reviews
          </button>
          <button
            onClick={() => setActiveTab('bookings')}
            className={`px-3 py-2 sm:px-4 sm:py-2 md:px-6 md:py-3 rounded-lg text-xs sm:text-sm md:text-base font-semibold transition-all ${
              activeTab === 'bookings'
                ? 'bg-primary-vibrant text-white'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            Bookings
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`px-3 py-2 sm:px-4 sm:py-2 md:px-6 md:py-3 rounded-lg text-xs sm:text-sm md:text-base font-semibold transition-all ${
              activeTab === 'settings'
                ? 'bg-primary-vibrant text-white'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            Settings
          </button>
        </div>

        <div className="bg-gray-800/50 rounded-lg border border-primary-blue/30 p-6 shadow-sm">
          {activeTab === 'chats' && <AdminChat />}
          {activeTab === 'reviews' && <AdminReviews />}
          {activeTab === 'bookings' && <AdminBookings />}
          {activeTab === 'settings' && <AdminSettings />}
        </div>
      </div>
    </div>
  )
}
