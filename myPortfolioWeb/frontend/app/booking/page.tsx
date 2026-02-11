'use client'

import { useState } from 'react'
import ChatInterface from '@/components/ChatInterface'
import BookingForm from '@/components/BookingForm'
import BackToHome from '@/components/BackToHome'

export default function BookingPage() {
  const [activeTab, setActiveTab] = useState<'chat' | 'booking'>('chat')

  return (
    <div className="min-h-screen bg-[#0a0e27] py-12 sm:py-16 md:py-20 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-4 sm:mb-6">
          <BackToHome />
        </div>
        <div className="text-center mb-6 sm:mb-8">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-2 sm:mb-3 md:mb-4">Book a Gig</h1>
          <p className="text-base sm:text-lg md:text-xl text-primary-silver px-4">Get in touch to discuss your project</p>
        </div>

        <div className="flex justify-center mb-6 sm:mb-8 gap-2 sm:gap-3 md:gap-4" suppressHydrationWarning>
          <button
            type="button"
            onClick={() => setActiveTab('chat')}
            className={`px-4 py-2 sm:px-5 sm:py-2.5 md:px-6 md:py-3 rounded-lg text-sm sm:text-base font-semibold transition-all ${
              activeTab === 'chat'
                ? 'bg-primary-vibrant text-white'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            Chat
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('booking')}
            className={`px-4 py-2 sm:px-5 sm:py-2.5 md:px-6 md:py-3 rounded-lg text-sm sm:text-base font-semibold transition-all ${
              activeTab === 'booking'
                ? 'bg-primary-vibrant text-white'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            Booking Form
          </button>
        </div>

        {activeTab === 'chat' ? <ChatInterface /> : <BookingForm />}
      </div>
    </div>
  )
}
