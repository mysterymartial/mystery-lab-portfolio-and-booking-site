'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/lib/firebase'
import { api } from '@/lib/api'

export default function AdminSettings() {
  const { user, getIdToken } = useAuth()
  const [emailNotifications, setEmailNotifications] = useState(true)
  const [alertOnMessage, setAlertOnMessage] = useState(true)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user) {
      loadSettings()
    }
  }, [user])

  const loadSettings = async () => {
    try {
      const token = await getIdToken()
      
      // Load notification settings
      try {
        const notifications = await api.getSetting('notifications')
        setEmailNotifications(notifications.value?.emailNotifications ?? true)
        setAlertOnMessage(notifications.value?.alertOnMessage ?? true)
      } catch (error) {
        console.error('Error loading notification settings:', error)
      }
      
      setLoading(false)
    } catch (error) {
      console.error('Error loading settings:', error)
      setLoading(false)
    }
  }

  const saveSettings = async () => {
    try {
      const token = await getIdToken()
      
      // Save notification settings
      await api.updateSetting('notifications', {
        emailNotifications,
        alertOnMessage,
      }, token)
      
      alert('Settings saved successfully!')
    } catch (error) {
      console.error('Error saving settings:', error)
      alert('Failed to save settings')
    }
  }

  if (loading) {
    return <div className="text-gray-400">Loading settings...</div>
  }

  return (
    <div>
      <h2 className="text-xl sm:text-2xl font-bold text-white mb-4 sm:mb-6">Settings</h2>
      <div className="space-y-4 sm:space-y-5 md:space-y-6">
        <div className="bg-gray-700/50 p-4 sm:p-5 md:p-6 rounded-lg">
          <h3 className="text-lg sm:text-xl font-semibold text-white mb-3 sm:mb-4">Notification Settings</h3>
          <div className="space-y-3 sm:space-y-4">
            <div className="flex items-center justify-between gap-4">
              <div className="flex-1 min-w-0">
                <p className="text-gray-300 text-sm sm:text-base">Email Notifications</p>
                <p className="text-gray-400 text-xs sm:text-sm">Receive email notifications for new messages</p>
              </div>
              <button
                onClick={() => setEmailNotifications(!emailNotifications)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors flex-shrink-0 ${
                  emailNotifications ? 'bg-primary-vibrant' : 'bg-gray-600'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    emailNotifications ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between gap-4">
              <div className="flex-1 min-w-0">
                <p className="text-gray-300 text-sm sm:text-base">Alert on Message</p>
                <p className="text-gray-400 text-xs sm:text-sm">Show alerts when new messages arrive</p>
              </div>
              <button
                onClick={() => setAlertOnMessage(!alertOnMessage)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors flex-shrink-0 ${
                  alertOnMessage ? 'bg-primary-vibrant' : 'bg-gray-600'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    alertOnMessage ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        <button
          onClick={saveSettings}
          className="w-full sm:w-auto px-4 py-2 sm:px-6 sm:py-3 bg-primary-vibrant text-white rounded-lg text-sm sm:text-base font-semibold hover:bg-blue-600 transition-colors"
        >
          Save Settings
        </button>
      </div>
    </div>
  )
}
