'use client'

import { useState } from 'react'
import { api } from '@/lib/api'

export default function BookingForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    serviceType: '',
    eventDate: '',
    eventLocation: '',
    budget: '',
    additionalInfo: '',
  })
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Client-side validation (HTML5 required also handles this, but this ensures test compatibility)
    if (!formData.name || !formData.email || !formData.phone || !formData.serviceType) {
      return
    }
    
    setSubmitting(true)

    try {
      await api.createBooking(formData)
      setSubmitted(true)
      setFormData({
        name: '',
        email: '',
        phone: '',
        serviceType: '',
        eventDate: '',
        eventLocation: '',
        budget: '',
        additionalInfo: '',
      })
      setTimeout(() => setSubmitted(false), 5000)
    } catch (error) {
      console.error('Error submitting booking:', error)
      alert('Failed to submit booking. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  if (submitted) {
    return (
      <div className="max-w-2xl mx-auto bg-green-500/20 border border-green-500 p-8 rounded-lg text-center">
        <p className="text-green-400 text-xl mb-4">
          Thank you! Your booking request has been submitted.
        </p>
        <p className="text-gray-300">
          We'll get back to you soon via email or WhatsApp.
        </p>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto bg-gray-800/50 rounded-lg border border-primary-blue/30 p-4 sm:p-6 md:p-8 shadow-lg">
      <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4 sm:mb-6 text-center">Booking Form</h2>
      <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5 md:space-y-6">
        <div>
          <label htmlFor="booking-name" className="block text-gray-300 mb-2 text-sm sm:text-base">Full Name *</label>
          <input
            id="booking-name"
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 sm:px-4 sm:py-2 bg-gray-700 text-white rounded-lg text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-primary-vibrant border border-transparent"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          <div>
            <label htmlFor="booking-email" className="block text-gray-300 mb-2 text-sm sm:text-base">Email *</label>
            <input
              id="booking-email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 sm:px-4 sm:py-2 bg-gray-700 text-white rounded-lg text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-primary-vibrant border border-transparent"
            />
          </div>
          <div>
            <label htmlFor="booking-phone" className="block text-gray-300 mb-2 text-sm sm:text-base">Phone *</label>
            <input
              id="booking-phone"
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 sm:px-4 sm:py-2 bg-gray-700 text-white rounded-lg text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-primary-vibrant border border-transparent"
            />
          </div>
        </div>

        <div>
          <label htmlFor="booking-serviceType" className="block text-gray-300 mb-2 text-sm sm:text-base">Service Type *</label>
          <select
            id="booking-serviceType"
            name="serviceType"
            value={formData.serviceType}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 sm:px-4 sm:py-2 bg-gray-700 text-white rounded-lg text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-primary-vibrant border border-transparent"
          >
            <option value="">Select a service</option>
            <optgroup label="Technology">
              <option value="tech-product">Tech Product</option>
              <option value="website">Website</option>
              <option value="mobile-app">Mobile App</option>
              <option value="desktop-app">Desktop App</option>
              <option value="game-dev">Game Development</option>
              <option value="blockchain">Blockchain & Web3</option>
              <option value="fintech">Fintech & Payment APIs</option>
              <option value="iot-device">IoT Device</option>
              <option value="embedded-system">Embedded System</option>
              <option value="system-design">System Design</option>
              <option value="system-architecture">System Architecture</option>
              <option value="cybersecurity">Cybersecurity</option>
              <option value="devops">DevOps</option>
              <option value="ai-ml-data">AI, ML & Data Science</option>
            </optgroup>
            <optgroup label="Music">
              <option value="saxophone-performance">Saxophone Performance</option>
              <option value="birthday-surprise">Birthday Surprise</option>
              <option value="live-band">Live Band</option>
              <option value="studio-recording">Studio Recording</option>
              <option value="any-genre">Any Genre of Music</option>
            </optgroup>
            <optgroup label="Martial Arts">
              <option value="taekwondo">Taekwondo</option>
              <option value="kickboxing">Kickboxing</option>
              <option value="bjj">Brazilian Jiu-Jitsu (BJJ)</option>
              <option value="wrestling">Wrestling</option>
              <option value="mma">MMA</option>
              <option value="self-defense">Self-Defense Classes</option>
            </optgroup>
          </select>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          <div>
            <label htmlFor="booking-eventDate" className="block text-gray-300 mb-2 text-sm sm:text-base">Date</label>
            <input
              id="booking-eventDate"
              type="date"
              name="eventDate"
              value={formData.eventDate}
              onChange={handleChange}
              className="w-full px-3 py-2 sm:px-4 sm:py-2 bg-gray-700 text-white rounded-lg text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-primary-vibrant border border-transparent"
            />
          </div>
          <div>
            <label htmlFor="booking-budget" className="block text-gray-300 mb-2 text-sm sm:text-base">Budget Range</label>
            <input
              id="booking-budget"
              type="text"
              name="budget"
              value={formData.budget}
              onChange={handleChange}
              placeholder="e.g., $500-$1000"
              className="w-full px-3 py-2 sm:px-4 sm:py-2 bg-gray-700 text-white rounded-lg text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-primary-vibrant border border-transparent"
            />
          </div>
        </div>

        <div>
            <label htmlFor="booking-eventLocation" className="block text-gray-300 mb-2 text-sm sm:text-base">Location</label>
          <input
            id="booking-eventLocation"
            type="text"
            name="eventLocation"
            value={formData.eventLocation}
            onChange={handleChange}
            placeholder="City, Country"
            className="w-full px-3 py-2 sm:px-4 sm:py-2 bg-gray-700 text-white rounded-lg text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-primary-vibrant border border-transparent"
          />
        </div>

        <div>
          <label htmlFor="booking-additionalInfo" className="block text-gray-300 mb-2 text-sm sm:text-base">Additional Information</label>
          <textarea
            id="booking-additionalInfo"
            name="additionalInfo"
            value={formData.additionalInfo}
            onChange={handleChange}
            rows={4}
            placeholder="Tell us more about your project or event..."
            className="w-full px-3 py-2 sm:px-4 sm:py-2 bg-gray-700 text-white rounded-lg text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-primary-vibrant border border-transparent resize-y"
          />
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="w-full px-4 py-2 sm:px-6 sm:py-3 bg-primary-vibrant text-white rounded-lg text-sm sm:text-base font-semibold hover:bg-blue-600 transition-colors disabled:opacity-50"
        >
          {submitting ? 'Submitting...' : 'Submit Booking Request'}
        </button>

        <p className="text-center text-gray-400 text-xs sm:text-sm px-4">
          Or contact directly via{' '}
          <a href="https://wa.me/2348159089791" className="text-primary-vibrant hover:underline">
            WhatsApp
          </a>
        </p>
      </form>
    </div>
  )
}
