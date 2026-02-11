'use client'

import { useState, useEffect, useRef } from 'react'
import { api, Message } from '@/lib/api'

export default function ChatInterface() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [messages, setMessages] = useState<Message[]>([])
  const [submitting, setSubmitting] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    loadMessages()
    // Poll for new messages every 5 seconds
    const interval = setInterval(loadMessages, 5000)
    return () => clearInterval(interval)
  }, [])

  const loadMessages = async () => {
    try {
      const msgs = await api.getMessages()
      setMessages(msgs.filter((m) => !m.deleted))
      setTimeout(() => {
        if (messagesEndRef.current && typeof messagesEndRef.current.scrollIntoView === 'function') {
          messagesEndRef.current.scrollIntoView({ behavior: 'smooth' })
        }
      }, 100)
    } catch (error) {
      console.error('Error loading messages:', error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name || !email || !message) return

    setSubmitting(true)
    try {
      await api.createMessage({ name, email, message })
      setMessage('')
      loadMessages()
    } catch (error) {
      console.error('Error sending message:', error)
      alert('Failed to send message. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  const openWhatsApp = () => {
    window.open('https://wa.me/2348159089791', '_blank')
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6">
      <div className="bg-gray-800/50 rounded-lg border border-primary-blue/30 p-4 sm:p-5 md:p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-0 mb-4 sm:mb-6">
          <h2 className="text-xl sm:text-2xl font-bold text-white">Chat with Me</h2>
          <button
            onClick={openWhatsApp}
            className="w-full sm:w-auto px-3 py-2 sm:px-4 sm:py-2 bg-green-600 text-white rounded-lg text-sm sm:text-base hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
          >
            <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
            </svg>
            WhatsApp
          </button>
        </div>

        <div className="bg-gray-900/50 rounded-lg p-3 sm:p-4 h-64 sm:h-80 md:h-96 overflow-y-auto mb-3 sm:mb-4">
          {messages.length === 0 ? (
            <div className="text-center text-gray-400 py-6 sm:py-8 text-sm sm:text-base">
              No messages yet. Start the conversation!
            </div>
          ) : (
            <div className="space-y-3 sm:space-y-4">
              {messages.map((msg) => (
                <div key={msg._id} className="bg-gray-800 p-3 sm:p-4 rounded-lg">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-start gap-2 mb-2">
                    <div className="w-full sm:w-auto">
                      <p className="text-white font-semibold text-sm sm:text-base">
                        {typeof msg.name === 'string' ? msg.name : ''}
                      </p>
                      <p className="text-gray-400 text-xs sm:text-sm break-all">
                        {typeof msg.email === 'string' ? msg.email : ''}
                      </p>
                    </div>
                    <p className="text-gray-500 text-xs sm:text-sm whitespace-nowrap" suppressHydrationWarning>
                      {msg.createdAt && typeof msg.createdAt === 'string'
                        ? new Date(msg.createdAt).toLocaleString()
                        : ''}
                    </p>
                  </div>
                  <p className="text-gray-300 text-sm sm:text-base break-words">
                    {typeof msg.message === 'string' ? msg.message : ''}
                  </p>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <input
              type="text"
              placeholder="Your Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="px-3 py-2 sm:px-4 sm:py-2 bg-gray-700 text-white rounded-lg text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-primary-vibrant"
            />
            <input
              type="email"
              placeholder="Your Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="px-3 py-2 sm:px-4 sm:py-2 bg-gray-700 text-white rounded-lg text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-primary-vibrant"
            />
          </div>
          <textarea
            placeholder="Type your message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
            rows={3}
            className="w-full px-3 py-2 sm:px-4 sm:py-2 bg-gray-700 text-white rounded-lg text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-primary-vibrant resize-y"
          />
          <button
            type="submit"
            disabled={submitting}
            className="w-full px-4 py-2 sm:px-6 sm:py-3 bg-primary-vibrant text-white rounded-lg text-sm sm:text-base font-semibold hover:bg-blue-600 transition-colors disabled:opacity-50"
          >
            {submitting ? 'Sending...' : 'Send Message'}
          </button>
        </form>
      </div>
    </div>
  )
}
