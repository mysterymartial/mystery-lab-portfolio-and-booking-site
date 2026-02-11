import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import BookingForm from '@/components/BookingForm'

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
    createBooking: jest.fn(() => Promise.resolve({
      _id: '1',
      name: '',
      email: '',
      phone: '',
      serviceType: '',
      status: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    })),
    updateBookingStatus: jest.fn(() => Promise.resolve({})),
    getSetting: jest.fn(() => Promise.resolve({ value: { darkMode: false } })),
    updateSetting: jest.fn(() => Promise.resolve({})),
  },
}))

// Import AFTER mocking
import { api } from '@/lib/api'
const mockApi = api

describe('BookingForm Component - Boundary Analysis & Edge Cases', () => {
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
    mockApi.createBooking.mockResolvedValue({
      _id: '1',
      name: '',
      email: '',
      phone: '',
      serviceType: '',
      status: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    })
    mockApi.updateBookingStatus.mockResolvedValue({})
    mockApi.getSetting.mockResolvedValue({ value: { darkMode: false } })
    mockApi.updateSetting.mockResolvedValue({})
  })

  describe('Form Rendering', () => {
    it('should render all form fields', async () => {
      render(<BookingForm />)
      await waitFor(() => {
        expect(screen.getByLabelText(/Full Name/i)).toBeInTheDocument()
        expect(screen.getByLabelText(/Email/i)).toBeInTheDocument()
        expect(screen.getByLabelText(/Phone/i)).toBeInTheDocument()
        expect(screen.getByLabelText(/Service Type/i)).toBeInTheDocument()
      })
    })

    it('should render optional fields', async () => {
      render(<BookingForm />)
      await waitFor(() => {
        expect(screen.getByLabelText(/^Date$/i)).toBeInTheDocument()
        expect(screen.getByLabelText(/^Location$/i)).toBeInTheDocument()
        expect(screen.getByLabelText(/Budget Range/i)).toBeInTheDocument()
        expect(screen.getByLabelText(/Additional Information/i)).toBeInTheDocument()
      })
    })
  })

  describe('Form Submission - Required Fields', () => {
    it('should submit with all required fields', async () => {
      mockApi.createBooking.mockImplementation(() => Promise.resolve({
        _id: '1',
        name: 'John Doe',
        email: 'john@example.com',
        phone: '08159089791',
        serviceType: 'website',
        status: 'pending',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }))

      render(<BookingForm />)
      await waitFor(() => {
        expect(screen.getByLabelText(/Full Name/i)).toBeInTheDocument()
      })

      fireEvent.change(screen.getByLabelText(/Full Name/i), {
        target: { value: 'John Doe' },
      })
      fireEvent.change(screen.getByLabelText(/Email/i), {
        target: { value: 'john@example.com' },
      })
      fireEvent.change(screen.getByLabelText(/Phone/i), {
        target: { value: '08159089791' },
      })
      fireEvent.change(screen.getByLabelText(/Service Type/i), {
        target: { value: 'website' },
      })

      fireEvent.click(screen.getByText('Submit Booking Request'))

      await waitFor(() => {
        expect(mockApi.createBooking).toHaveBeenCalledWith({
          name: 'John Doe',
          email: 'john@example.com',
          phone: '08159089791',
          serviceType: 'website',
          eventDate: '',
          eventLocation: '',
          budget: '',
          additionalInfo: '',
        })
      })
    })

    // Boundary: Missing required fields
    it('should prevent submission without name', async () => {
      render(<BookingForm />)
      await waitFor(() => {
        expect(screen.getByLabelText(/Full Name/i)).toBeInTheDocument()
      })

      fireEvent.change(screen.getByLabelText(/Email/i), {
        target: { value: 'test@example.com' },
      })
      fireEvent.change(screen.getByLabelText(/Phone/i), {
        target: { value: '08159089791' },
      })
      fireEvent.change(screen.getByLabelText(/Service Type/i), {
        target: { value: 'website' },
      })

      fireEvent.click(screen.getByText('Submit Booking Request'))

      await waitFor(() => {
        expect(mockApi.createBooking).not.toHaveBeenCalled()
      })
    })

    it('should prevent submission without email', async () => {
      render(<BookingForm />)
      await waitFor(() => {
        expect(screen.getByLabelText(/Full Name/i)).toBeInTheDocument()
      })

      fireEvent.change(screen.getByLabelText(/Full Name/i), {
        target: { value: 'Test User' },
      })
      fireEvent.change(screen.getByLabelText(/Phone/i), {
        target: { value: '08159089791' },
      })
      fireEvent.change(screen.getByLabelText(/Service Type/i), {
        target: { value: 'website' },
      })

      fireEvent.click(screen.getByText('Submit Booking Request'))

      await waitFor(() => {
        expect(mockApi.createBooking).not.toHaveBeenCalled()
      })
    })

    it('should prevent submission without phone', async () => {
      render(<BookingForm />)
      await waitFor(() => {
        expect(screen.getByLabelText(/Full Name/i)).toBeInTheDocument()
      })

      fireEvent.change(screen.getByLabelText(/Full Name/i), {
        target: { value: 'Test User' },
      })
      fireEvent.change(screen.getByLabelText(/Email/i), {
        target: { value: 'test@example.com' },
      })
      fireEvent.change(screen.getByLabelText(/Service Type/i), {
        target: { value: 'website' },
      })

      fireEvent.click(screen.getByText('Submit Booking Request'))

      await waitFor(() => {
        expect(mockApi.createBooking).not.toHaveBeenCalled()
      })
    })

    it('should prevent submission without serviceType', async () => {
      render(<BookingForm />)
      await waitFor(() => {
        expect(screen.getByLabelText(/Full Name/i)).toBeInTheDocument()
      })

      fireEvent.change(screen.getByLabelText(/Full Name/i), {
        target: { value: 'Test User' },
      })
      fireEvent.change(screen.getByLabelText(/Email/i), {
        target: { value: 'test@example.com' },
      })
      fireEvent.change(screen.getByLabelText(/Phone/i), {
        target: { value: '08159089791' },
      })

      fireEvent.click(screen.getByText('Submit Booking Request'))

      await waitFor(() => {
        expect(mockApi.createBooking).not.toHaveBeenCalled()
      })
    })
  })

  describe('Service Type Selection', () => {
    it('should have all service options', async () => {
      render(<BookingForm />)
      await waitFor(() => {
        expect(screen.getByLabelText(/Service Type/i)).toBeInTheDocument()
      })
      const serviceSelect = screen.getByLabelText(/Service Type/i) as HTMLSelectElement

      // Check that options exist by their values
      expect(serviceSelect.querySelector('option[value="tech-product"]')).toBeInTheDocument()
      expect(serviceSelect.querySelector('option[value="website"]')).toBeInTheDocument()
      expect(serviceSelect.querySelector('option[value="mobile-app"]')).toBeInTheDocument()
      expect(serviceSelect.querySelector('option[value="saxophone-performance"]')).toBeInTheDocument()
      expect(serviceSelect.querySelector('option[value="self-defense"]')).toBeInTheDocument()
      
      // Check option text content
      const options = Array.from(serviceSelect.options)
      const optionTexts = options.map(opt => opt.textContent)
      expect(optionTexts).toContain('Tech Product')
      expect(optionTexts).toContain('Website')
      expect(optionTexts).toContain('Mobile App')
      expect(optionTexts).toContain('Saxophone Performance')
      expect(optionTexts).toContain('Self-Defense Classes')
    })

    it('should allow selecting different service types', async () => {
      render(<BookingForm />)
      await waitFor(() => {
        expect(screen.getByLabelText(/Service Type/i)).toBeInTheDocument()
      })
      const serviceSelect = screen.getByLabelText(/Service Type/i)

      fireEvent.change(serviceSelect, { target: { value: 'mobile-app' } })
      expect(serviceSelect).toHaveValue('mobile-app')

      fireEvent.change(serviceSelect, { target: { value: 'saxophone-performance' } })
      expect(serviceSelect).toHaveValue('saxophone-performance')
    })
  })

  describe('Optional Fields', () => {
    it('should submit with optional fields filled', async () => {
      mockApi.createBooking.mockImplementation(() => Promise.resolve({
        _id: '1',
        name: 'Test User',
        email: 'test@example.com',
        phone: '08159089791',
        serviceType: 'website',
        eventDate: '2024-12-25',
        eventLocation: 'Lagos, Nigeria',
        budget: '$1000-$2000',
        additionalInfo: 'Need urgent delivery',
        status: 'pending',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }))

      render(<BookingForm />)
      await waitFor(() => {
        expect(screen.getByLabelText(/Full Name/i)).toBeInTheDocument()
      })

      fireEvent.change(screen.getByLabelText(/Full Name/i), {
        target: { value: 'Test User' },
      })
      fireEvent.change(screen.getByLabelText(/Email/i), {
        target: { value: 'test@example.com' },
      })
      fireEvent.change(screen.getByLabelText(/Phone/i), {
        target: { value: '08159089791' },
      })
      fireEvent.change(screen.getByLabelText(/Service Type/i), {
        target: { value: 'website' },
      })
      fireEvent.change(screen.getByLabelText(/^Date$/i), {
        target: { value: '2024-12-25' },
      })
      fireEvent.change(screen.getByLabelText(/^Location$/i), {
        target: { value: 'Lagos, Nigeria' },
      })
      fireEvent.change(screen.getByLabelText(/Budget Range/i), {
        target: { value: '$1000-$2000' },
      })
      fireEvent.change(screen.getByLabelText(/Additional Information/i), {
        target: { value: 'Need urgent delivery' },
      })

      fireEvent.click(screen.getByText('Submit Booking Request'))

      await waitFor(() => {
        expect(mockApi.createBooking).toHaveBeenCalledWith(
          expect.objectContaining({
            eventDate: '2024-12-25',
            eventLocation: 'Lagos, Nigeria',
            budget: '$1000-$2000',
            additionalInfo: 'Need urgent delivery',
          })
        )
      })
    })
  })

  describe('Boundary: Input Lengths', () => {
    it('should handle very long name', async () => {
      render(<BookingForm />)
      await waitFor(() => {
        expect(screen.getByLabelText(/Full Name/i)).toBeInTheDocument()
      })
      const longName = 'A'.repeat(500)
      const nameInput = screen.getByLabelText(/Full Name/i)

      fireEvent.change(nameInput, { target: { value: longName } })
      expect(nameInput).toHaveValue(longName)
    })

    it('should handle very long additionalInfo', async () => {
      render(<BookingForm />)
      await waitFor(() => {
        expect(screen.getByLabelText(/Additional Information/i)).toBeInTheDocument()
      })
      const longInfo = 'A'.repeat(10000)
      const infoInput = screen.getByLabelText(/Additional Information/i)

      fireEvent.change(infoInput, { target: { value: longInfo } })
      expect(infoInput).toHaveValue(longInfo)
    })
  })

  describe('Success State', () => {
    it('should show success message after submission', async () => {
      mockApi.createBooking.mockImplementation(() => Promise.resolve({
        _id: '1',
        name: 'Test User',
        email: 'test@example.com',
        phone: '08159089791',
        serviceType: 'website',
        status: 'pending',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }))

      render(<BookingForm />)
      await waitFor(() => {
        expect(screen.getByLabelText(/Full Name/i)).toBeInTheDocument()
      })

      fireEvent.change(screen.getByLabelText(/Full Name/i), {
        target: { value: 'Test User' },
      })
      fireEvent.change(screen.getByLabelText(/Email/i), {
        target: { value: 'test@example.com' },
      })
      fireEvent.change(screen.getByLabelText(/Phone/i), {
        target: { value: '08159089791' },
      })
      fireEvent.change(screen.getByLabelText(/Service Type/i), {
        target: { value: 'website' },
      })

      fireEvent.click(screen.getByText('Submit Booking Request'))

      await waitFor(() => {
        expect(screen.getByText(/Thank you!/i)).toBeInTheDocument()
      })
    })

    it('should reset form after successful submission', async () => {
      mockApi.createBooking.mockImplementation(() => Promise.resolve({
        _id: '1',
        name: 'Test User',
        email: 'test@example.com',
        phone: '08159089791',
        serviceType: 'website',
        status: 'pending',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }))

      render(<BookingForm />)
      await waitFor(() => {
        expect(screen.getByLabelText(/Full Name/i)).toBeInTheDocument()
      })

      fireEvent.change(screen.getByLabelText(/Full Name/i), { target: { value: 'Test User' } })
      fireEvent.change(screen.getByLabelText(/Email/i), {
        target: { value: 'test@example.com' },
      })
      fireEvent.change(screen.getByLabelText(/Phone/i), {
        target: { value: '08159089791' },
      })
      fireEvent.change(screen.getByLabelText(/Service Type/i), {
        target: { value: 'website' },
      })

      fireEvent.click(screen.getByText('Submit Booking Request'))

      await waitFor(() => {
        expect(screen.getByText(/Thank you!/i)).toBeInTheDocument()
      })

      // Wait for form to reappear after 5 seconds and verify it's reset
      await waitFor(
        () => {
          const nameInput = screen.getByLabelText(/Full Name/i)
          expect(nameInput).toHaveValue('')
        },
        { timeout: 7000 }
      )
    }, 10000)
  })

  describe('Error Handling', () => {
    it('should handle API errors', async () => {
      mockApi.createBooking.mockImplementation(() => Promise.reject(new Error('API Error')))
      window.alert = jest.fn()

      render(<BookingForm />)
      await waitFor(() => {
        expect(screen.getByLabelText(/Full Name/i)).toBeInTheDocument()
      })

      fireEvent.change(screen.getByLabelText(/Full Name/i), {
        target: { value: 'Test User' },
      })
      fireEvent.change(screen.getByLabelText(/Email/i), {
        target: { value: 'test@example.com' },
      })
      fireEvent.change(screen.getByLabelText(/Phone/i), {
        target: { value: '08159089791' },
      })
      fireEvent.change(screen.getByLabelText(/Service Type/i), {
        target: { value: 'website' },
      })

      fireEvent.click(screen.getByText('Submit Booking Request'))

      await waitFor(() => {
        expect(window.alert).toHaveBeenCalled()
      })
    })
  })
})
