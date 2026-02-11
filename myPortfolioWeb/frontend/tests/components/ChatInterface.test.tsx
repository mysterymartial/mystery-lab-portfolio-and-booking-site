import { render, screen, waitFor, fireEvent, cleanup } from '@testing-library/react'
import '@testing-library/jest-dom'
import ChatInterface from '@/components/ChatInterface'

// Mock the API module BEFORE importing the component
jest.mock('@/lib/api', () => ({
  api: {
    getMessages: jest.fn(() => Promise.resolve([])),
    createMessage: jest.fn(() => Promise.resolve({})),
    getMessage: jest.fn(() => Promise.resolve({})),
    deleteMessage: jest.fn(() => Promise.resolve(undefined)),
    replyToMessage: jest.fn(() => Promise.resolve({})),
    setGoogleMeetLink: jest.fn(() => Promise.resolve({})),
    getApprovedReviews: jest.fn(() => Promise.resolve([])),
    getAllReviews: jest.fn(() => Promise.resolve([])),
    createReview: jest.fn(() => Promise.resolve({})),
    approveReview: jest.fn(() => Promise.resolve({})),
    rejectReview: jest.fn(() => Promise.resolve({})),
    getAllBookings: jest.fn(() => Promise.resolve([])),
    createBooking: jest.fn(() => Promise.resolve({})),
    updateBookingStatus: jest.fn(() => Promise.resolve({})),
    getSetting: jest.fn(() => Promise.resolve({ value: { darkMode: false } })),
    updateSetting: jest.fn(() => Promise.resolve({})),
  },
}))

jest.mock('@/lib/firebase', () => ({
  auth: {},
  useAuth: () => ({
    user: null,
    loading: false,
    signIn: jest.fn(),
    logout: jest.fn(),
    getIdToken: jest.fn(),
  }),
}))

// Import AFTER mocking
import { api } from '@/lib/api'
const mockApi = api

describe('ChatInterface Component - Boundary Analysis & Edge Cases', () => {
  beforeEach(() => {
    // Reset call history but keep implementations
    mockApi.getMessages.mockClear()
    mockApi.createMessage.mockClear()
    mockApi.getMessage.mockClear()
    mockApi.deleteMessage.mockClear()
    mockApi.replyToMessage.mockClear()
    mockApi.setGoogleMeetLink.mockClear()
    mockApi.getApprovedReviews.mockClear()
    mockApi.getAllReviews.mockClear()
    mockApi.createReview.mockClear()
    mockApi.approveReview.mockClear()
    mockApi.rejectReview.mockClear()
    mockApi.getAllBookings.mockClear()
    mockApi.createBooking.mockClear()
    mockApi.updateBookingStatus.mockClear()
    mockApi.getSetting.mockClear()
    mockApi.updateSetting.mockClear()
    
    // Ensure all mocks return Promises
    mockApi.getMessages.mockResolvedValue([])
    mockApi.createMessage.mockResolvedValue({})
    mockApi.getMessage.mockResolvedValue({})
    mockApi.deleteMessage.mockResolvedValue(undefined)
    mockApi.replyToMessage.mockResolvedValue({})
    mockApi.setGoogleMeetLink.mockResolvedValue({})
    mockApi.getApprovedReviews.mockResolvedValue([])
    mockApi.getAllReviews.mockResolvedValue([])
    mockApi.createReview.mockResolvedValue({})
    mockApi.approveReview.mockResolvedValue({})
    mockApi.rejectReview.mockResolvedValue({})
    mockApi.getAllBookings.mockResolvedValue([])
    mockApi.createBooking.mockResolvedValue({})
    mockApi.updateBookingStatus.mockResolvedValue({})
    mockApi.getSetting.mockResolvedValue({ value: { darkMode: false } })
    mockApi.updateSetting.mockResolvedValue({})
  })

  describe('Rendering', () => {
    it('should render chat interface', async () => {
      render(<ChatInterface />)
      await waitFor(() => {
        expect(screen.getByText('Chat with Me')).toBeInTheDocument()
      })
    })

    it('should render WhatsApp button', async () => {
      render(<ChatInterface />)
      await waitFor(() => {
        expect(screen.getByText('WhatsApp')).toBeInTheDocument()
      })
    })

    it('should render empty state when no messages', async () => {
      render(<ChatInterface />)
      await waitFor(() => {
        expect(screen.getByText(/No messages yet/i)).toBeInTheDocument()
      })
    })
  })

  describe('Message Display', () => {
    it('should display messages correctly', async () => {
      const mockMessages = [
        {
          _id: '1',
          name: 'John Doe',
          email: 'john@example.com',
          message: 'Hello!',
          deleted: false,
          createdAt: new Date().toISOString(),
        },
      ]
      mockApi.getMessages.mockImplementation(() => Promise.resolve(mockMessages))
      render(<ChatInterface />)
      // Wait for initial render to complete
      await waitFor(() => {
        expect(screen.getByText('Chat with Me')).toBeInTheDocument()
      })

      await waitFor(() => {
        expect(screen.getByText('John Doe')).toBeInTheDocument()
        expect(screen.getByText('Hello!')).toBeInTheDocument()
      })
    })

    it('should filter out deleted messages', async () => {
      const mockMessages = [
        {
          _id: '1',
          name: 'Active User',
          email: 'active@example.com',
          message: 'Active message',
          deleted: false,
          createdAt: new Date().toISOString(),
        },
        {
          _id: '2',
          name: 'Deleted User',
          email: 'deleted@example.com',
          message: 'Deleted message',
          deleted: true,
          createdAt: new Date().toISOString(),
        },
      ]
      mockApi.getMessages.mockImplementation(() => Promise.resolve(mockMessages))
      render(<ChatInterface />)

      await waitFor(() => {
        expect(screen.getByText('Active User')).toBeInTheDocument()
        expect(screen.queryByText('Deleted User')).not.toBeInTheDocument()
      })
    })

    it('should handle very long messages', async () => {
      const longMessage = 'A'.repeat(1000)
      const mockMessages = [
        {
          _id: '1',
          name: 'Test User',
          email: 'test@example.com',
          message: longMessage,
          deleted: false,
          createdAt: new Date().toISOString(),
        },
      ]
      mockApi.getMessages.mockImplementation(() => Promise.resolve(mockMessages))
      render(<ChatInterface />)

      await waitFor(() => {
        expect(screen.getByText(longMessage)).toBeInTheDocument()
      })
    })

    it('should display multiple messages', async () => {
      const mockMessages = Array.from({ length: 10 }, (_, i) => ({
        _id: `${i}`,
        name: `User ${i}`,
        email: `user${i}@example.com`,
        message: `Message ${i}`,
        deleted: false,
        createdAt: new Date().toISOString(),
      }))
      mockApi.getMessages.mockImplementation(() => Promise.resolve(mockMessages))
      render(<ChatInterface />)

      await waitFor(() => {
        expect(screen.getByText('User 0')).toBeInTheDocument()
        expect(screen.getByText('User 9')).toBeInTheDocument()
      })
    })
  })

  describe('Form Submission', () => {
    it('should submit message with valid data', async () => {
      // Mock getMessages for initial load and reload after submission
      mockApi.getMessages
        .mockImplementationOnce(() => Promise.resolve([])) // Initial load
        .mockImplementationOnce(() => Promise.resolve([{ // After submission reload
          _id: '1',
          name: 'Test User',
          email: 'test@example.com',
          message: 'Test message',
          deleted: false,
          createdAt: new Date().toISOString(),
        }]))
      mockApi.createMessage.mockImplementation(() => Promise.resolve({
        _id: '1',
        name: 'Test User',
        email: 'test@example.com',
        message: 'Test message',
        deleted: false,
        createdAt: new Date().toISOString(),
      }))

      render(<ChatInterface />)

      fireEvent.change(screen.getByPlaceholderText('Your Name'), {
        target: { value: 'Test User' },
      })
      fireEvent.change(screen.getByPlaceholderText('Your Email'), {
        target: { value: 'test@example.com' },
      })
      fireEvent.change(screen.getByPlaceholderText('Type your message...'), {
        target: { value: 'Test message' },
      })

      fireEvent.click(screen.getByText('Send Message'))

      await waitFor(() => {
        expect(mockApi.createMessage).toHaveBeenCalledWith({
          name: 'Test User',
          email: 'test@example.com',
          message: 'Test message',
        })
      })
    })

    // Boundary: Empty fields
    it('should prevent submission with empty name', async () => {
      render(<ChatInterface />)
      await waitFor(() => {
        expect(screen.getByText('Chat with Me')).toBeInTheDocument()
      })

      fireEvent.change(screen.getByPlaceholderText('Your Email'), {
        target: { value: 'test@example.com' },
      })
      fireEvent.change(screen.getByPlaceholderText('Type your message...'), {
        target: { value: 'Test message' },
      })

      const submitButton = screen.getByText('Send Message')
      fireEvent.click(submitButton)

      await waitFor(() => {
        expect(mockApi.createMessage).not.toHaveBeenCalled()
      })
    })

    it('should prevent submission with empty email', async () => {
      render(<ChatInterface />)
      await waitFor(() => {
        expect(screen.getByText('Chat with Me')).toBeInTheDocument()
      })

      fireEvent.change(screen.getByPlaceholderText('Your Name'), {
        target: { value: 'Test User' },
      })
      fireEvent.change(screen.getByPlaceholderText('Type your message...'), {
        target: { value: 'Test message' },
      })

      fireEvent.click(screen.getByText('Send Message'))

      await waitFor(() => {
        expect(mockApi.createMessage).not.toHaveBeenCalled()
      })
    })

    it('should prevent submission with empty message', async () => {
      render(<ChatInterface />)
      await waitFor(() => {
        expect(screen.getByText('Chat with Me')).toBeInTheDocument()
      })

      fireEvent.change(screen.getByPlaceholderText('Your Name'), {
        target: { value: 'Test User' },
      })
      fireEvent.change(screen.getByPlaceholderText('Your Email'), {
        target: { value: 'test@example.com' },
      })

      fireEvent.click(screen.getByText('Send Message'))

      await waitFor(() => {
        expect(mockApi.createMessage).not.toHaveBeenCalled()
      })
    })

    // Boundary: Maximum length inputs
    it('should handle very long name input', async () => {
      const longName = 'A'.repeat(1000)
      render(<ChatInterface />)
      await waitFor(() => {
        expect(screen.getByText('Chat with Me')).toBeInTheDocument()
      })

      const nameInput = screen.getByPlaceholderText('Your Name')
      fireEvent.change(nameInput, { target: { value: longName } })

      expect(nameInput).toHaveValue(longName)
    })

    it('should handle very long message input', async () => {
      const longMessage = 'A'.repeat(10000)
      render(<ChatInterface />)
      await waitFor(() => {
        expect(screen.getByText('Chat with Me')).toBeInTheDocument()
      })

      const messageInput = screen.getByPlaceholderText('Type your message...')
      fireEvent.change(messageInput, { target: { value: longMessage } })

      expect(messageInput).toHaveValue(longMessage)
    })

    // Edge: Special characters
    it('should handle special characters in inputs', async () => {
      mockApi.createMessage.mockImplementation(() => Promise.resolve({
        _id: '1',
        name: "O'Brien",
        email: 'test+tag@example.com',
        message: '<script>alert("XSS")</script>',
        deleted: false,
        createdAt: new Date().toISOString(),
      }))

      render(<ChatInterface />)
      await waitFor(() => {
        expect(screen.getByText('Chat with Me')).toBeInTheDocument()
      })

      fireEvent.change(screen.getByPlaceholderText('Your Name'), {
        target: { value: "O'Brien" },
      })
      fireEvent.change(screen.getByPlaceholderText('Your Email'), {
        target: { value: 'test+tag@example.com' },
      })
      fireEvent.change(screen.getByPlaceholderText('Type your message...'), {
        target: { value: '<script>alert("XSS")</script>' },
      })

      fireEvent.click(screen.getByText('Send Message'))

      await waitFor(() => {
        expect(mockApi.createMessage).toHaveBeenCalled()
      })
    })

    // Edge: Email validation
    it('should accept valid email formats', async () => {
      const validEmails = [
        'test@example.com',
        'test.email+tag@example.co.uk',
        'user_name@example-domain.com',
      ]

      for (const email of validEmails) {
        cleanup()
        render(<ChatInterface />)
        await waitFor(() => {
          expect(screen.getByText('Chat with Me')).toBeInTheDocument()
        })
        const emailInput = screen.getByPlaceholderText('Your Email')
        fireEvent.change(emailInput, { target: { value: email } })
        expect(emailInput).toHaveValue(email)
      }
    })
  })

  describe('Error Handling', () => {
    it('should handle API errors gracefully', async () => {
      mockApi.getMessages.mockImplementation(() => Promise.reject(new Error('API Error')))
      render(<ChatInterface />)
      // Component should still render despite error
      await waitFor(() => {
        expect(screen.getByText('Chat with Me')).toBeInTheDocument()
      })

      await waitFor(() => {
        // Component should still render despite error
        expect(screen.getByText('Chat with Me')).toBeInTheDocument()
      })
    })

    it('should handle submission errors', async () => {
      mockApi.createMessage.mockImplementation(() => Promise.reject(new Error('Failed to send')))

      render(<ChatInterface />)
      await waitFor(() => {
        expect(screen.getByText('Chat with Me')).toBeInTheDocument()
      })

      fireEvent.change(screen.getByPlaceholderText('Your Name'), {
        target: { value: 'Test User' },
      })
      fireEvent.change(screen.getByPlaceholderText('Your Email'), {
        target: { value: 'test@example.com' },
      })
      fireEvent.change(screen.getByPlaceholderText('Type your message...'), {
        target: { value: 'Test message' },
      })

      // Mock window.alert
      window.alert = jest.fn()

      fireEvent.click(screen.getByText('Send Message'))

      await waitFor(() => {
        expect(window.alert).toHaveBeenCalled()
      })
    })
  })

  describe('WhatsApp Integration', () => {
    it('should open WhatsApp link in new tab', async () => {
      const openSpy = jest.spyOn(window, 'open').mockImplementation()

      render(<ChatInterface />)
      await waitFor(() => {
        expect(screen.getByText('Chat with Me')).toBeInTheDocument()
      })
      fireEvent.click(screen.getByText('WhatsApp'))

      expect(openSpy).toHaveBeenCalledWith(
        'https://wa.me/2348159089791',
        '_blank'
      )

      openSpy.mockRestore()
    })
  })

  describe('Loading States', () => {
    it('should show loading state during submission', async () => {
      mockApi.createMessage.mockImplementation(
        () =>
          new Promise(resolve =>
            setTimeout(
              () =>
                resolve({
                  _id: '1',
                  name: 'Test',
                  email: 'test@example.com',
                  message: 'Test',
                  deleted: false,
                  createdAt: new Date().toISOString(),
                }),
              1000
            )
          )
      )

      render(<ChatInterface />)
      await waitFor(() => {
        expect(screen.getByText('Chat with Me')).toBeInTheDocument()
      })

      fireEvent.change(screen.getByPlaceholderText('Your Name'), {
        target: { value: 'Test User' },
      })
      fireEvent.change(screen.getByPlaceholderText('Your Email'), {
        target: { value: 'test@example.com' },
      })
      fireEvent.change(screen.getByPlaceholderText('Type your message...'), {
        target: { value: 'Test message' },
      })

      fireEvent.click(screen.getByText('Send Message'))

      expect(screen.getByText('Sending...')).toBeInTheDocument()
    })
  })
})
