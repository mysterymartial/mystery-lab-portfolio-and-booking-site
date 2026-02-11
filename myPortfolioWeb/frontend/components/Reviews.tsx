'use client'

import { useState, useEffect } from 'react'
import { api, Review } from '@/lib/api'
import ReviewForm from './ReviewForm'

function DeferredReviewForm({ onSuccess }: { onSuccess: () => void }) {
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])
  return (
    <div className="max-w-2xl mx-auto min-h-[16rem]" suppressHydrationWarning>
      {mounted ? <ReviewForm onSuccess={onSuccess} /> : null}
    </div>
  )
}

export default function Reviews() {
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadReviews()
  }, [])

  const loadReviews = async () => {
    try {
      const reviewsData = await api.getApprovedReviews()
      setReviews(reviewsData)
    } catch (error) {
      console.error('Error fetching reviews:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <section id="reviews" className="py-12 sm:py-16 md:py-20 bg-[#0a0e27]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 sm:mb-12 md:mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-3 sm:mb-4">Client Reviews</h2>
          <div className="w-16 sm:w-20 md:w-24 h-1 bg-primary-vibrant mx-auto"></div>
        </div>

        {loading ? (
          <div className="text-center text-gray-300 text-sm sm:text-base">Loading reviews...</div>
        ) : reviews.length === 0 ? (
          <div className="text-center text-gray-300 mb-6 sm:mb-8 text-sm sm:text-base px-4">
            No reviews yet. Be the first to leave a review!
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6 mb-8 sm:mb-10 md:mb-12">
            {reviews.map((review) => (
              <div
                key={review._id}
                className="bg-slate-900/50 backdrop-blur-sm p-4 sm:p-5 md:p-6 rounded-2xl border border-slate-700/50 hover:border-primary-vibrant/30 hover:shadow-lg hover:shadow-primary-vibrant/5 transition-all duration-300 shadow-sm"
              >
                <div className="flex items-center mb-3 sm:mb-4">
                  <div className="flex text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      <svg
                        key={i}
                        className={`w-4 h-4 sm:w-5 sm:h-5 ${i < review.rating ? 'fill-current' : 'text-gray-600'}`}
                        viewBox="0 0 20 20"
                      >
                        <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                      </svg>
                    ))}
                  </div>
                </div>
                <p className="text-gray-300 text-sm sm:text-base mb-3 sm:mb-4 leading-relaxed">{review.comment}</p>
                <p className="text-primary-silver font-semibold text-sm sm:text-base">— {review.name}</p>
              </div>
            ))}
          </div>
        )}

        <DeferredReviewForm onSuccess={loadReviews} />
      </div>
    </section>
  )
}
