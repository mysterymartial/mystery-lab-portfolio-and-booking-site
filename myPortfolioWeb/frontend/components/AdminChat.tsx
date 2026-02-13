'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/lib/firebase'
import { api, Message } from '@/lib/api'
import { formatDate } from '@/lib/formatDate'

export default function AdminChat() {
  const { user, getIdToken } = useAuth()
  const [messages, setMessages] = useState<Message[]>([])
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null)
  const [replyText, setReplyText] = useState('')
  const [googleMeetLink, setGoogleMeetLink] = useState('')

  useEffect(() => {
    if (user) {
      loadMessages()
    }
  }, [user])

  const loadMessages = async () => {
    try {
      const token = await getIdToken()
      const msgs = await api.getMessages()
      setMessages(msgs.filter((m) => !m.deleted))
    } catch (error) {
      console.error('Error loading messages:', error)
    }
  }

  const handleSoftDelete = async (messageId: string) => {
    if (confirm('Are you sure you want to delete this chat?')) {
      // Optimistic update: remove from UI immediately
      setMessages((prev) => prev.filter((m) => m._id !== messageId))
      if (selectedMessage?._id === messageId) {
        setSelectedMessage(null)
      }
      try {
        const token = await getIdToken()
        await api.deleteMessage(messageId, token)
      } catch (error) {
        console.error('Error deleting message:', error)
        loadMessages()
        alert(error instanceof Error ? error.message : 'Failed to delete message')
      }
    }
  }

  const handleReply = async () => {
    if (!selectedMessage || !replyText.trim() || !user) return

    try {
      const token = await getIdToken()
      await api.replyToMessage(selectedMessage._id, replyText, token)
      setReplyText('')
      loadMessages()
      alert('Reply sent successfully!')
    } catch (error) {
      console.error('Error sending reply:', error)
      alert(error instanceof Error ? error.message : 'Failed to send reply')
    }
  }

  const handleSetGoogleMeet = async () => {
    if (!selectedMessage || !googleMeetLink.trim() || !user) return

    try {
      const token = await getIdToken()
      await api.setGoogleMeetLink(selectedMessage._id, googleMeetLink, token)
      setGoogleMeetLink('')
      loadMessages()
      alert('Google Meet link saved!')
    } catch (error) {
      console.error('Error setting Google Meet link:', error)
      alert(error instanceof Error ? error.message : 'Failed to save Google Meet link')
    }
  }

  const handleSetAndSendGoogleMeet = async () => {
    if (!selectedMessage || !googleMeetLink.trim() || !user) return

    const link = googleMeetLink.trim()
    try {
      const token = await getIdToken()
      await api.setGoogleMeetLink(selectedMessage._id, link, token)
      const message = `Here is your Google Meet link: ${link}`
      await api.replyToMessage(selectedMessage._id, message, token)
      setGoogleMeetLink('')
      loadMessages()
      alert('Google Meet link saved and sent to the visitor via email and website chat!')
    } catch (error) {
      console.error('Error setting/sending Google Meet link:', error)
      alert(error instanceof Error ? error.message : 'Failed to save or send Google Meet link')
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-5 md:gap-6">
      <div>
        <h2 className="text-xl sm:text-2xl font-bold text-white mb-3 sm:mb-4">Messages</h2>
        <div className="space-y-2 max-h-[400px] sm:max-h-[500px] md:max-h-[600px] overflow-y-auto">
          {messages.length === 0 ? (
            <p className="text-gray-400 text-sm sm:text-base">No messages</p>
          ) : (
            messages.map((msg) => (
              <div
                key={msg._id}
                onClick={() => setSelectedMessage(msg)}
                className={`p-3 sm:p-4 rounded-lg cursor-pointer transition-all ${
                  selectedMessage?._id === msg._id
                    ? 'bg-primary-vibrant/20 border-2 border-primary-vibrant'
                    : 'bg-gray-700/50 hover:bg-gray-700'
                }`}
              >
                <div className="flex flex-col sm:flex-row justify-between items-start gap-2 sm:gap-0">
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-semibold text-sm sm:text-base">{msg.name}</p>
                    <p className="text-gray-400 text-xs sm:text-sm break-all">{msg.email}</p>
                    <p className="text-gray-300 text-xs sm:text-sm mt-2 line-clamp-2 break-words">{msg.message}</p>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      handleSoftDelete(msg._id)
                    }}
                    className="text-red-400 hover:text-red-300 text-xs sm:text-sm whitespace-nowrap"
                  >
                    Delete
                  </button>
                </div>
                <p className="text-gray-500 text-xs mt-2" suppressHydrationWarning>
                  {formatDate(msg.createdAt)}
                </p>
              </div>
            ))
          )}
        </div>
      </div>

      {selectedMessage && (
        <div className="mt-4 lg:mt-0">
          <h2 className="text-xl sm:text-2xl font-bold text-white mb-3 sm:mb-4">Chat Details</h2>
          <div className="bg-gray-700/50 p-3 sm:p-4 rounded-lg mb-3 sm:mb-4">
            <p className="text-white font-semibold mb-2 text-sm sm:text-base">{selectedMessage.name}</p>
            <p className="text-gray-400 text-xs sm:text-sm mb-3 sm:mb-4 break-all">{selectedMessage.email}</p>
            <p className="text-gray-300 mb-3 sm:mb-4 text-sm sm:text-base break-words">{selectedMessage.message}</p>
            {selectedMessage.googleMeetLink && (
              <div className="mb-3 sm:mb-4">
                <p className="text-gray-400 text-xs sm:text-sm mb-2">Google Meet:</p>
                <a
                  href={selectedMessage.googleMeetLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary-vibrant hover:underline text-xs sm:text-sm break-all"
                >
                  {selectedMessage.googleMeetLink}
                </a>
              </div>
            )}
          </div>

          {selectedMessage.replies && selectedMessage.replies.length > 0 && (
            <div className="mb-3 sm:mb-4">
              <h3 className="text-white font-semibold mb-2 text-sm sm:text-base">Replies:</h3>
              {selectedMessage.replies.map((reply, idx) => (
                <div key={idx} className="bg-gray-700/50 p-2 sm:p-3 rounded-lg mb-2">
                  <p className="text-gray-300 text-xs sm:text-sm break-words">{reply.message}</p>
                  <p className="text-gray-500 text-xs mt-1" suppressHydrationWarning>
                    {formatDate(reply.timestamp)}
                  </p>
                </div>
              ))}
            </div>
          )}

          <div className="space-y-3 sm:space-y-4">
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <label className="block text-gray-300 text-sm sm:text-base">Set Google Meet Link</label>
                <a
                  href="https://meet.google.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary-vibrant hover:underline text-xs sm:text-sm font-medium"
                >
                  Create new meeting
                </a>
                <span className="text-gray-500 text-xs">(opens Google Meet; sign in, start meeting, copy link, paste below)</span>
              </div>
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="url"
                  value={googleMeetLink}
                  onChange={(e) => setGoogleMeetLink(e.target.value)}
                  placeholder="https://meet.google.com/abc-defg-hij"
                  className="flex-1 px-3 py-2 sm:px-4 sm:py-2 bg-gray-700 text-white rounded-lg text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-primary-vibrant"
                />
                <div className="flex gap-2">
                  <button
                    onClick={handleSetGoogleMeet}
                    className="px-3 py-2 sm:px-4 sm:py-2 bg-slate-600 text-white rounded-lg text-sm sm:text-base hover:bg-slate-500 whitespace-nowrap"
                  >
                    Set
                  </button>
                  <button
                    onClick={handleSetAndSendGoogleMeet}
                    className="px-3 py-2 sm:px-4 sm:py-2 bg-primary-vibrant text-white rounded-lg text-sm sm:text-base hover:bg-blue-600 whitespace-nowrap"
                  >
                    Set & Send
                  </button>
                </div>
              </div>
              <p className="text-gray-500 text-xs mt-1">Set & Send saves the link, emails it, and shows it in the website chat.</p>
            </div>

            <div>
              <label className="block text-gray-300 mb-2 text-sm sm:text-base">Reply</label>
              <textarea
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                rows={3}
                className="w-full px-3 py-2 sm:px-4 sm:py-2 bg-gray-700 text-white rounded-lg text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-primary-vibrant mb-2 resize-y"
              />
              <button
                onClick={handleReply}
                className="w-full px-3 py-2 sm:px-4 sm:py-2 bg-primary-vibrant text-white rounded-lg text-sm sm:text-base hover:bg-blue-600"
              >
                Send Reply
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
