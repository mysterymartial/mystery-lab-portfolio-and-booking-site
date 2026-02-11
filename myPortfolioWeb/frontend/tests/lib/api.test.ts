import { api } from '@/lib/api'

// Mock fetch globally
global.fetch = jest.fn()

const mockFetch = fetch as jest.MockedFunction<typeof fetch>

describe('API Client - Boundary Analysis & Edge Cases', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('getMessages', () => {
    it('should fetch messages successfully', async () => {
      const mockMessages = [
        {
          _id: '1',
          name: 'Test User',
          email: 'test@example.com',
          message: 'Test message',
          deleted: false,
          createdAt: new Date().toISOString(),
        },
      ]

      // Backend returns { messages: [], pagination: {...} }
      const backendResponse = {
        messages: mockMessages,
        pagination: { total: 1, limit: 50, skip: 0, hasMore: false },
      }

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => backendResponse,
      } as Response)

      // API client extracts messages array from response
      const result = await api.getMessages()
      expect(result).toEqual(mockMessages)
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/messages')
      )
    })

    it('should handle empty response', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ messages: [], pagination: { total: 0, limit: 50, skip: 0, hasMore: false } }),
      } as Response)

      const result = await api.getMessages()
      expect(result).toEqual([])
    })

    it('should throw error on failed request', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
      } as Response)

      await expect(api.getMessages()).rejects.toThrow()
    })

    it('should handle network errors', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Network error'))

      await expect(api.getMessages()).rejects.toThrow('Network error')
    })
  })

  describe('createMessage', () => {
    it('should create message successfully', async () => {
      const messageData = {
        name: 'Test User',
        email: 'test@example.com',
        message: 'Test message',
      }

      const mockResponse = {
        _id: '1',
        ...messageData,
        deleted: false,
        createdAt: new Date().toISOString(),
      }

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      } as Response)

      const result = await api.createMessage(messageData)
      expect(result).toEqual(mockResponse)
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/messages'),
        expect.objectContaining({
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(messageData),
        })
      )
    })

    // Boundary: Empty strings
    it('should send empty strings if provided', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({}),
      } as Response)

      await api.createMessage({
        name: '',
        email: '',
        message: '',
      })

      expect(mockFetch).toHaveBeenCalled()
    })

    // Boundary: Very long strings
    it('should handle very long message data', async () => {
      const longMessage = 'A'.repeat(100000)
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({}),
      } as Response)

      await api.createMessage({
        name: 'Test',
        email: 'test@example.com',
        message: longMessage,
      })

      expect(mockFetch).toHaveBeenCalled()
    })
  })

  describe('createReview', () => {
    it('should create review successfully', async () => {
      const reviewData = {
        name: 'Test Reviewer',
        rating: 5,
        comment: 'Great service!',
      }

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ _id: '1', ...reviewData }),
      } as Response)

      const result = await api.createReview(reviewData)
      expect(result.name).toBe(reviewData.name)
      expect(result.rating).toBe(reviewData.rating)
    })

    // Boundary: Rating limits
    it('should send rating value as-is (validation on backend)', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({}),
      } as Response)

      await api.createReview({
        name: 'Test',
        rating: 0, // Invalid, but API client doesn't validate
        comment: 'Test',
      })

      expect(mockFetch).toHaveBeenCalled()
    })
  })

  describe('createBooking', () => {
    it('should create booking with all fields', async () => {
      const bookingData = {
        name: 'Test User',
        email: 'test@example.com',
        phone: '08159089791',
        serviceType: 'website',
        eventDate: '2024-12-25',
        eventLocation: 'Lagos',
        budget: '$1000',
        additionalInfo: 'Urgent',
      }

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ _id: '1', ...bookingData }),
      } as Response)

      const result = await api.createBooking(bookingData)
      expect(result).toMatchObject(bookingData)
    })

    it('should create booking with only required fields', async () => {
      const bookingData = {
        name: 'Test User',
        email: 'test@example.com',
        phone: '08159089791',
        serviceType: 'website',
      }

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ _id: '1', ...bookingData }),
      } as Response)

      await api.createBooking(bookingData)
      expect(mockFetch).toHaveBeenCalled()
    })
  })

  describe('Admin endpoints with authentication', () => {
    const mockToken = 'test-token'

    it('should include Authorization header for admin endpoints', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({}),
      } as Response)

      await api.deleteMessage('message-id', mockToken)

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/messages/message-id'),
        expect.objectContaining({
          method: 'DELETE',
          headers: expect.objectContaining({
            Authorization: `Bearer ${mockToken}`,
          }),
        })
      )
    })

    it('should handle empty token', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({}),
      } as Response)

      await api.deleteMessage('message-id', '')

      expect(mockFetch).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({
          headers: expect.objectContaining({
            Authorization: 'Bearer ',
          }),
        })
      )
    })
  })

  describe('Error handling', () => {
    it('should throw error for non-ok responses', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 400,
        statusText: 'Bad Request',
      } as Response)

      await expect(api.getMessages()).rejects.toThrow()
    })

    it('should handle JSON parsing errors', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => {
          throw new Error('Invalid JSON')
        },
      } as Response)

      await expect(api.getMessages()).rejects.toThrow()
    })
  })
})
