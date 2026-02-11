'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/firebase'
import AdminDashboard from '@/components/AdminDashboard'

export default function AdminPage() {
  const { user, loading, signIn } = useAuth()
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const email = formData.get('email') as string
    const password = formData.get('password') as string

    try {
      await signIn(email, password)
    } catch (error: any) {
      alert('Login failed: ' + error.message)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-primary-dark">
        <div className="text-white text-xl">Loading...</div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-primary-dark via-primary-blue to-primary-dark px-4 sm:px-6">
        <div className="mb-6">
          <a
            href="/"
            className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/30 text-white rounded-xl text-sm font-semibold transition-all"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Home
          </a>
        </div>
        <div className="bg-gray-800 p-4 sm:p-6 md:p-8 rounded-lg shadow-xl max-w-md w-full">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4 sm:mb-6 text-center">Admin Login</h2>
          <form onSubmit={handleLogin} className="space-y-3 sm:space-y-4">
            <div>
              <label className="block text-gray-300 mb-2 text-sm sm:text-base">Email</label>
              <input
                type="email"
                name="email"
                required
                className="w-full px-3 py-2 sm:px-4 sm:py-2 bg-gray-700 text-white rounded-lg text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-primary-vibrant"
              />
            </div>
            <div>
              <label className="block text-gray-300 mb-2 text-sm sm:text-base">Password</label>
              <input
                type="password"
                name="password"
                required
                className="w-full px-3 py-2 sm:px-4 sm:py-2 bg-gray-700 text-white rounded-lg text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-primary-vibrant"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-primary-vibrant text-white py-2 sm:py-2.5 rounded-lg text-sm sm:text-base font-semibold hover:bg-blue-600 transition-colors"
            >
              Login
            </button>
          </form>
        </div>
      </div>
    )
  }

  return <AdminDashboard />
}
