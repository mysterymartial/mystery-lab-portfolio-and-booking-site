'use client'

import { useState } from 'react'
import { api } from '@/lib/api'

interface ReviewFormProps {
  onSuccess?: () => void
}

export default function ReviewForm({ onSuccess }: ReviewFormProps) {
  const [name, setName] = useState('')
  const [rating, setRating] = useState(5)
  const [comment, setComment] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)

    try {
      await api.createReview({ name, rating, comment })
      setSubmitted(true)
      setName('')
      setRating(5)
      setComment('')
      setTimeout(() => setSubmitted(false), 5000)
      if (onSuccess) onSuccess()
    } catch (error) {
      console.error('Error submitting review:', error)
      alert(error instanceof Error ? error.message : 'Failed to submit review. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  if (submitted) {
    return (
      <div className="max-w-2xl mx-auto bg-green-500/20 border border-green-500 p-4 sm:p-6 rounded-lg text-center">
        <p className="text-green-400 text-sm sm:text-base md:text-lg px-4">
          Thank you! Your review has been submitted and is pending approval.
        </p>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto bg-gray-800/50 p-4 sm:p-6 md:p-8 rounded-lg border border-primary-blue/30">
      <h3 className="text-xl sm:text-2xl font-bold text-white mb-4 sm:mb-6 text-center">Leave a Review</h3>
      <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5 md:space-y-6">
        <div>
          <label className="block text-gray-300 mb-2 text-sm sm:text-base">Your Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full px-3 py-2 sm:px-4 sm:py-2 bg-gray-700 text-white rounded-lg text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-primary-vibrant"
          />
        </div>

        <div suppressHydrationWarning>
          <label className="block text-gray-300 mb-2 text-sm sm:text-base">Rating</label>
          <div className="flex space-x-1 sm:space-x-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                className={`text-2xl sm:text-3xl ${
                  star <= rating ? 'text-yellow-500' : 'text-gray-500'
                } hover:text-yellow-400 transition-colors`}
                aria-label={`${star} star`}
              >
                <svg className="w-6 h-6 sm:w-8 sm:h-8" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                </svg>
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-gray-300 mb-2 text-sm sm:text-base">Your Review</label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            required
            rows={4}
            className="w-full px-3 py-2 sm:px-4 sm:py-2 bg-gray-700 text-white rounded-lg text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-primary-vibrant resize-y"
          />
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="w-full px-4 py-2 sm:px-6 sm:py-3 bg-primary-vibrant text-white rounded-lg text-sm sm:text-base font-semibold hover:bg-blue-600 transition-colors disabled:opacity-50"
          suppressHydrationWarning
        >
          {submitting ? 'Submitting...' : 'Submit Review'}
        </button>
      </form>
    </div>
  )
}
