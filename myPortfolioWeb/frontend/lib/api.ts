const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

/** Extract error message from API response body - handles common formats */
async function getErrorMessage(response: Response, fallback: string): Promise<string> {
  try {
    const body = await response.json();
    if (body?.error && typeof body.error === 'string') return body.error;
    if (body?.message && typeof body.message === 'string') return body.message;
    if (Array.isArray(body?.errors) && body.errors[0]) return String(body.errors[0]);
  } catch {
    // Response body wasn't JSON
  }
  return fallback;
}

export interface Message {
  _id: string;
  name: string;
  email: string;
  message: string;
  deleted?: boolean;
  googleMeetLink?: string;
  replies?: Array<{
    message: string;
    timestamp: Date;
  }>;
  createdAt: string;
  updatedAt: string;
}

export interface Review {
  _id: string;
  name: string;
  rating: number;
  comment: string;
  approved: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Booking {
  _id: string;
  name: string;
  email: string;
  phone: string;
  serviceType: string;
  eventDate?: string;
  eventLocation?: string;
  budget?: string;
  additionalInfo?: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface Setting {
  _id: string;
  key: string;
  value: any;
  updatedAt: string;
}

// API Client Functions
export const api = {
  // Messages
  getMessages: async (): Promise<Message[]> => {
    const response = await fetch(`${API_BASE_URL}/messages`, {
      cache: 'no-store', // Always fetch fresh data so visitor sees admin replies
    });
    if (!response.ok) throw new Error('Failed to fetch messages');
    const data = await response.json();
    // Backend returns { messages: [], pagination: {...} }
    return Array.isArray(data) ? data : (data.messages || []);
  },

  createMessage: async (data: { name: string; email: string; message: string }): Promise<Message> => {
    const response = await fetch(`${API_BASE_URL}/messages`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error(await getErrorMessage(response, 'Failed to create message'));
    }
    return response.json();
  },

  getMessage: async (id: string, token: string): Promise<Message> => {
    const response = await fetch(`${API_BASE_URL}/messages/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!response.ok) throw new Error('Failed to fetch message');
    return response.json();
  },

  deleteMessage: async (id: string, token: string): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/messages/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!response.ok) throw new Error('Failed to delete message');
  },

  replyToMessage: async (id: string, message: string, token: string): Promise<Message> => {
    const response = await fetch(`${API_BASE_URL}/messages/${id}/reply`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ message }),
    });
    if (!response.ok) {
      throw new Error(await getErrorMessage(response, 'Failed to send reply'));
    }
    return response.json();
  },

  setGoogleMeetLink: async (id: string, googleMeetLink: string, token: string): Promise<Message> => {
    const response = await fetch(`${API_BASE_URL}/messages/${id}/google-meet`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ googleMeetLink }),
    });
    if (!response.ok) {
      throw new Error(await getErrorMessage(response, 'Failed to set Google Meet link'));
    }
    return response.json();
  },

  // Reviews
  getApprovedReviews: async (): Promise<Review[]> => {
    const response = await fetch(`${API_BASE_URL}/reviews/approved`, {
      cache: 'no-store',
    });
    if (!response.ok) throw new Error('Failed to fetch reviews');
    return response.json();
  },

  getAllReviews: async (token: string): Promise<Review[]> => {
    const response = await fetch(`${API_BASE_URL}/reviews`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!response.ok) throw new Error('Failed to fetch reviews');
    return response.json();
  },

  createReview: async (data: { name: string; rating: number; comment: string }): Promise<Review> => {
    const response = await fetch(`${API_BASE_URL}/reviews`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error(await getErrorMessage(response, 'Failed to create review'));
    }
    return response.json();
  },

  approveReview: async (id: string, token: string): Promise<Review> => {
    const response = await fetch(`${API_BASE_URL}/reviews/${id}/approve`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!response.ok) {
      throw new Error(await getErrorMessage(response, 'Failed to approve review'));
    }
    return response.json();
  },

  rejectReview: async (id: string, token: string): Promise<Review> => {
    const response = await fetch(`${API_BASE_URL}/reviews/${id}/reject`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!response.ok) {
      throw new Error(await getErrorMessage(response, 'Failed to reject review'));
    }
    return response.json();
  },

  deleteReview: async (id: string, token: string): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/reviews/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!response.ok) {
      throw new Error(await getErrorMessage(response, 'Failed to delete review'));
    }
  },

  // Bookings
  getAllBookings: async (token: string): Promise<Booking[]> => {
    const response = await fetch(`${API_BASE_URL}/bookings`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: 'no-store',
    });
    if (!response.ok) throw new Error('Failed to fetch bookings');
    const data = await response.json();
    // Backend returns { bookings: [], pagination: {...} }
    return Array.isArray(data) ? data : (data.bookings || []);
  },

  createBooking: async (data: {
    name: string;
    email: string;
    phone: string;
    serviceType: string;
    eventDate?: string;
    eventLocation?: string;
    budget?: string;
    additionalInfo?: string;
  }): Promise<Booking> => {
    const response = await fetch(`${API_BASE_URL}/bookings`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error(await getErrorMessage(response, 'Failed to create booking'));
    }
    return response.json();
  },

  updateBookingStatus: async (id: string, status: string, token: string): Promise<Booking> => {
    const response = await fetch(`${API_BASE_URL}/bookings/${id}/status`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ status }),
    });
    if (!response.ok) {
      throw new Error(await getErrorMessage(response, 'Failed to update booking status'));
    }
    return response.json();
  },

  softDeleteBooking: async (id: string, token: string): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/bookings/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!response.ok) {
      throw new Error(await getErrorMessage(response, 'Failed to archive booking'));
    }
  },

  // Settings
  getSetting: async (key: string): Promise<Setting> => {
    const response = await fetch(`${API_BASE_URL}/settings/${key}`);
    if (!response.ok) throw new Error('Failed to fetch setting');
    return response.json();
  },

  updateSetting: async (key: string, value: any, token: string): Promise<Setting> => {
    const response = await fetch(`${API_BASE_URL}/settings/${key}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ value }),
    });
    if (!response.ok) {
      throw new Error(await getErrorMessage(response, 'Failed to update setting'));
    }
    return response.json();
  },
};
