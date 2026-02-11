'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/lib/firebase'
import { api, Review } from '@/lib/api'
import { formatDate } from '@/lib/formatDate'

export default function AdminReviews() {
  const { user, getIdToken } = useAuth()
  const [reviews, setReviews] = useState<Review[]>([])

  useEffect(() => {
    if (user) {
      loadReviews()
    }
  }, [user])

  const loadReviews = async () => {
    try {
      const token = await getIdToken()
      const reviewsData = await api.getAllReviews(token)
      setReviews(reviewsData)
    } catch (error) {
      console.error('Error loading reviews:', error)
    }
  }

  const handleApprove = async (reviewId: string) => {
    try {
      const token = await getIdToken()
      await api.approveReview(reviewId, token)
      loadReviews()
    } catch (error) {
      console.error('Error approving review:', error)
      alert('Failed to approve review')
    }
  }

  const handleReject = async (reviewId: string) => {
    if (confirm('Are you sure you want to reject this review?')) {
      try {
        const token = await getIdToken()
        await api.rejectReview(reviewId, token)
        loadReviews()
      } catch (error) {
        console.error('Error rejecting review:', error)
        alert('Failed to reject review')
      }
    }
  }

  return (
    <div>
      <h2 className="text-xl sm:text-2xl font-bold text-white mb-3 sm:mb-4">Reviews Management</h2>
      <div className="space-y-3 sm:space-y-4">
        {reviews.length === 0 ? (
          <p className="text-gray-400 text-sm sm:text-base">No reviews</p>
        ) : (
          reviews.map((review) => (
            <div
              key={review._id}
              className={`p-3 sm:p-4 rounded-lg border ${
                review.approved
                  ? 'bg-green-500/10 border-green-500/30'
                  : 'bg-gray-700/50 border-gray-600'
              }`}
            >
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-start gap-2 sm:gap-0 mb-2">
                <div className="flex-1 min-w-0">
                  <p className="text-white font-semibold text-sm sm:text-base">{review.name}</p>
                  <div className="flex text-yellow-400 mt-1">
                    {[...Array(5)].map((_, i) => (
                      <svg
                        key={i}
                        className={`w-3 h-3 sm:w-4 sm:h-4 ${i < review.rating ? 'fill-current' : 'text-gray-600'}`}
                        viewBox="0 0 20 20"
                      >
                        <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                      </svg>
                    ))}
                  </div>
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  {!review.approved && (
                    <>
                      <button
                        onClick={() => handleApprove(review._id)}
                        className="px-2 py-1 sm:px-3 sm:py-1 bg-green-600 text-white rounded hover:bg-green-700 text-xs sm:text-sm"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleReject(review._id)}
                        className="px-2 py-1 sm:px-3 sm:py-1 bg-red-600 text-white rounded hover:bg-red-700 text-xs sm:text-sm"
                      >
                        Reject
                      </button>
                    </>
                  )}
                  {review.approved && (
                    <span className="px-2 py-1 sm:px-3 sm:py-1 bg-green-600 text-white rounded text-xs sm:text-sm">Approved</span>
                  )}
                </div>
              </div>
              <p className="text-gray-300 mt-2 text-sm sm:text-base break-words">{review.comment}</p>
              <p className="text-gray-500 text-xs mt-2" suppressHydrationWarning>
                {formatDate(review.createdAt)}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
