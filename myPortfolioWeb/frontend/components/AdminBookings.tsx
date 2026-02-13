'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/lib/firebase'
import { api, Booking } from '@/lib/api'
import { formatDate } from '@/lib/formatDate'

export default function AdminBookings() {
  const { user, getIdToken } = useAuth()
  const [bookings, setBookings] = useState<Booking[]>([])
  const [actingId, setActingId] = useState<string | null>(null)
  const [loadError, setLoadError] = useState(false)

  useEffect(() => {
    if (user) {
      loadBookings()
    }
  }, [user])

  const loadBookings = async () => {
    try {
      setLoadError(false)
      const token = await getIdToken()
      const bookingsData = await api.getAllBookings(token)
      setBookings(bookingsData)
    } catch (error) {
      console.error('Error loading bookings:', error)
      setLoadError(true)
    }
  }

  const handleUpdateStatus = async (id: string, status: string) => {
    try {
      setActingId(id)
      setBookings((prev) => prev.map((b) => (b._id === id ? { ...b, status } : b)))
      const token = await getIdToken()
      await api.updateBookingStatus(id, status, token)
      await loadBookings()
    } catch (error) {
      console.error('Error updating status:', error)
      alert(error instanceof Error ? error.message : 'Failed to update booking status')
      await loadBookings()
    } finally {
      setActingId(null)
    }
  }

  const handleSoftDelete = async (id: string) => {
    if (!confirm('Archive this booking? It will be hidden from the list.')) return
    try {
      setActingId(id)
      setBookings((prev) => prev.filter((b) => b._id !== id))
      const token = await getIdToken()
      await api.softDeleteBooking(id, token)
      await loadBookings()
    } catch (error) {
      console.error('Error archiving booking:', error)
      alert(error instanceof Error ? error.message : 'Failed to archive booking')
      await loadBookings()
    } finally {
      setActingId(null)
    }
  }

  return (
    <div>
      <h2 className="text-xl sm:text-2xl font-bold text-white mb-3 sm:mb-4">Booking Requests</h2>
      <div className="space-y-3 sm:space-y-4">
        {loadError ? (
          <p className="text-amber-400 text-sm sm:text-base">
            Failed to load bookings.{' '}
            <button type="button" onClick={loadBookings} className="underline hover:text-amber-300">
              Retry
            </button>
          </p>
        ) : bookings.length === 0 ? (
          <p className="text-gray-400 text-sm sm:text-base">No bookings</p>
        ) : (
          bookings.map((booking) => (
            <div key={booking._id} className="bg-gray-700/50 p-4 sm:p-5 md:p-6 rounded-lg">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <p className="text-white font-semibold text-base sm:text-lg mb-2">{booking.name}</p>
                  <p className="text-gray-400 text-xs sm:text-sm break-all">Email: {booking.email}</p>
                  <p className="text-gray-400 text-xs sm:text-sm break-all">Phone: {booking.phone}</p>
                  <p className="text-gray-400 text-xs sm:text-sm">Service: {booking.serviceType}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-xs sm:text-sm">Date: {booking.eventDate || 'Not specified'}</p>
                  <p className="text-gray-400 text-xs sm:text-sm break-words">Location: {booking.eventLocation || 'Not specified'}</p>
                  <p className="text-gray-400 text-xs sm:text-sm">Budget: {booking.budget || 'Not specified'}</p>
                  <span className={`inline-block px-2 py-1 sm:px-3 sm:py-1 rounded text-xs sm:text-sm mt-2 ${
                    booking.status === 'pending' ? 'bg-yellow-600' :
                    booking.status === 'accepted' ? 'bg-blue-600' :
                    booking.status === 'rejected' ? 'bg-red-600' : 'bg-green-600'
                  }`}>
                    {booking.status}
                  </span>
                </div>
              </div>
              <div className="flex flex-wrap gap-2 mt-3 sm:mt-4">
                {booking.status === 'pending' && (
                  <>
                    <button
                      onClick={() => handleUpdateStatus(booking._id, 'accepted')}
                      disabled={actingId === booking._id}
                      className="px-2 py-1 sm:px-3 sm:py-1 bg-green-600 text-white rounded hover:bg-green-700 text-xs sm:text-sm disabled:opacity-50"
                    >
                      {actingId === booking._id ? '...' : 'Accept'}
                    </button>
                    <button
                      onClick={() => handleUpdateStatus(booking._id, 'rejected')}
                      disabled={actingId === booking._id}
                      className="px-2 py-1 sm:px-3 sm:py-1 bg-red-600 text-white rounded hover:bg-red-700 text-xs sm:text-sm disabled:opacity-50"
                    >
                      {actingId === booking._id ? '...' : 'Reject'}
                    </button>
                  </>
                )}
                {booking.status === 'accepted' && (
                  <button
                    onClick={() => handleUpdateStatus(booking._id, 'completed')}
                    disabled={actingId === booking._id}
                    className="px-2 py-1 sm:px-3 sm:py-1 bg-primary-vibrant text-white rounded hover:bg-blue-600 text-xs sm:text-sm disabled:opacity-50"
                  >
                    {actingId === booking._id ? '...' : 'Mark complete'}
                  </button>
                )}
                <button
                  onClick={() => handleSoftDelete(booking._id)}
                  disabled={actingId === booking._id}
                  className="px-2 py-1 sm:px-3 sm:py-1 bg-gray-600 text-white rounded hover:bg-gray-500 text-xs sm:text-sm disabled:opacity-50"
                >
                  {actingId === booking._id ? '...' : 'Archive'}
                </button>
              </div>
              {booking.additionalInfo && (
                <div className="mt-3 sm:mt-4">
                  <p className="text-gray-300 text-sm sm:text-base break-words">{booking.additionalInfo}</p>
                </div>
              )}
              <p className="text-gray-500 text-xs mt-3 sm:mt-4" suppressHydrationWarning>
                Submitted: {formatDate(booking.createdAt)}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
