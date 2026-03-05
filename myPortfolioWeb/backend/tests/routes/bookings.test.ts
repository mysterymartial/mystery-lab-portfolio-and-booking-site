import request from 'supertest';
import express from 'express';
import mongoose from 'mongoose';
import bookingRoutes from '../../src/routes/bookings';
import Booking from '../../src/models/Booking';
import { sendEmail } from '../../src/config/email';

jest.mock('../../src/middleware/auth', () => ({
  authenticateAdmin: (req: any, res: any, next: any) => {
    req.user = { uid: 'test-admin-uid', email: 'admin@test.com' };
    next();
  },
}));

jest.mock('../../src/config/email', () => ({
  sendEmail: jest.fn().mockResolvedValue(true),
}));

// Mock rate limiting middleware
jest.mock('../../src/middleware/rateLimiter', () => ({
  bookingLimiter: (req: any, res: any, next: any) => next(),
  apiLimiter: (req: any, res: any, next: any) => next(),
}));

// Mock sanitization middleware - simple XSS removal without jsdom
jest.mock('../../src/middleware/sanitize', () => {
  // Simple HTML tag removal to match DOMPurify behavior
  const removeHtmlTags = (str: string): string => {
    return str.replace(/<[^>]*>/g, '').trim();
  };
  
  return {
    sanitizeInput: (req: any, res: any, next: any) => {
      if (req.body && typeof req.body === 'object') {
        const sanitizeObject = (obj: any): any => {
          if (typeof obj === 'string') {
            return removeHtmlTags(obj);
          } else if (Array.isArray(obj)) {
            return obj.map(sanitizeObject);
          } else if (obj && typeof obj === 'object') {
            const sanitized: any = {};
            for (const key in obj) {
              sanitized[key] = sanitizeObject(obj[key]);
            }
            return sanitized;
          }
          return obj;
        };
        req.sanitizedBody = sanitizeObject(req.body);
        req.body = req.sanitizedBody;
      }
      next();
    },
    sanitizeString: (str: string) => {
      if (typeof str !== 'string') return str;
      return removeHtmlTags(str);
    },
  };
});

const app = express();
app.use(express.json());
app.use('/api/bookings', bookingRoutes);

describe('Bookings API - Boundary Analysis & Edge Cases', () => {
  describe('POST /api/bookings - Create booking', () => {
    it('should create booking with all required fields', async () => {
      const bookingData = {
        name: 'John Doe',
        email: 'john@example.com',
        phone: '08159089791',
        serviceType: 'website',
      };

      const response = await request(app)
        .post('/api/bookings')
        .send(bookingData);

      expect(response.status).toBe(201);
      expect(response.body.name).toBe(bookingData.name);
      expect(response.body.status).toBe('pending');
    });

    it('should create booking with all optional fields', async () => {
      const bookingData = {
        name: 'Jane Doe',
        email: 'jane@example.com',
        phone: '08159089791',
        serviceType: 'mobile-app',
        eventDate: '2026-12-25',
        eventLocation: 'Lagos, Nigeria',
        budget: '$1000-$2000',
        additionalInfo: 'Need iOS and Android versions',
      };

      const response = await request(app)
        .post('/api/bookings')
        .send(bookingData);

      expect(response.status).toBe(201);
      expect(response.body.eventDate).toBe(bookingData.eventDate);
      expect(response.body.eventLocation).toBe(bookingData.eventLocation);
      expect(response.body.budget).toBe(bookingData.budget);
      expect(response.body.additionalInfo).toBe(bookingData.additionalInfo);
    });

    it('should send email notification when ADMIN_EMAIL is set', async () => {
      const prevAdminEmail = process.env.ADMIN_EMAIL;
      process.env.ADMIN_EMAIL = 'admin@example.com';

      const bookingData = {
        name: 'Booking Email Test',
        email: 'booker@example.com',
        phone: '08159089791',
        serviceType: 'website',
      };

      await request(app).post('/api/bookings').send(bookingData);

      expect(sendEmail).toHaveBeenCalledWith(
        'admin@example.com',
        'New Booking Request from Booking Email Test',
        expect.stringContaining('Booking Email Test')
      );
      expect(sendEmail).toHaveBeenCalledWith(
        'admin@example.com',
        'New Booking Request from Booking Email Test',
        expect.stringContaining('booker@example.com')
      );

      process.env.ADMIN_EMAIL = prevAdminEmail;
    });

    // Boundary: Missing required fields
    it('should reject booking without name', async () => {
      const response = await request(app)
        .post('/api/bookings')
        .send({
          email: 'test@example.com',
          phone: '08159089791',
          serviceType: 'website',
        });

      expect(response.status).toBe(400);
    });

    it('should reject booking without email', async () => {
      const response = await request(app)
        .post('/api/bookings')
        .send({
          name: 'Test User',
          phone: '08159089791',
          serviceType: 'website',
        });

      expect(response.status).toBe(400);
    });

    it('should reject booking without phone', async () => {
      const response = await request(app)
        .post('/api/bookings')
        .send({
          name: 'Test User',
          email: 'test@example.com',
          serviceType: 'website',
        });

      expect(response.status).toBe(400);
    });

    it('should reject booking without serviceType', async () => {
      const response = await request(app)
        .post('/api/bookings')
        .send({
          name: 'Test User',
          email: 'test@example.com',
          phone: '08159089791',
        });

      expect(response.status).toBe(400);
    });

    // Boundary: Empty strings
    it('should reject empty name', async () => {
      const response = await request(app)
        .post('/api/bookings')
        .send({
          name: '',
          email: 'test@example.com',
          phone: '08159089791',
          serviceType: 'website',
        });

      expect(response.status).toBe(400);
    });

    it('should accept empty optional fields', async () => {
      const response = await request(app)
        .post('/api/bookings')
        .send({
          name: 'Test User',
          email: 'test@example.com',
          phone: '08159089791',
          serviceType: 'website',
          eventDate: '',
          eventLocation: '',
          budget: '',
          additionalInfo: '',
        });

      expect(response.status).toBe(201);
    });

    // Edge: Very long strings
    it('should handle name at max length (100 characters)', async () => {
      const longName = 'A'.repeat(100);
      const response = await request(app)
        .post('/api/bookings')
        .send({
          name: longName,
          email: 'test@example.com',
          phone: '08159089791',
          serviceType: 'website',
        });

      expect(response.status).toBe(201);
      expect(response.body.name).toBe(longName);
    });

    it('should reject name exceeding max length (101 characters)', async () => {
      const longName = 'A'.repeat(101);
      const response = await request(app)
        .post('/api/bookings')
        .send({
          name: longName,
          email: 'test@example.com',
          phone: '08159089791',
          serviceType: 'website',
        });

      expect(response.status).toBe(400);
      expect(response.body.error).toContain('100');
    });

    it('should handle very long additionalInfo', async () => {
      const longInfo = 'A'.repeat(10000);
      const response = await request(app)
        .post('/api/bookings')
        .send({
          name: 'Test User',
          email: 'test@example.com',
          phone: '08159089791',
          serviceType: 'website',
          additionalInfo: longInfo,
        });

      expect(response.status).toBe(201);
    });

    // Edge: Date formats - only YYYY-MM-DD is accepted, and must not be in the past
    it('should accept valid YYYY-MM-DD date in the future', async () => {
      const futureDate = '2026-12-25';
      const response = await request(app)
        .post('/api/bookings')
        .send({
          name: 'Test User',
          email: 'test@example.com',
          phone: '08159089791',
          serviceType: 'website',
          eventDate: futureDate,
        });

      expect(response.status).toBe(201);
      expect(response.body.eventDate).toBe(futureDate);
    });

    it('should reject invalid date formats', async () => {
      const invalidDates = ['25/12/2024', 'Dec 25, 2024', 'invalid'];
      for (const date of invalidDates) {
        const response = await request(app)
          .post('/api/bookings')
          .send({
            name: 'Test User',
            email: 'test@example.com',
            phone: '08159089791',
            serviceType: 'website',
            eventDate: date,
          });
        expect(response.status).toBe(400);
      }
    });

    // Edge: Phone number formats
    it('should accept various phone number formats', async () => {
      const phoneFormats = [
        '08159089791',
        '+2348159089791',
        '0815-908-9791',
        '(0815) 908-9791',
      ];

      for (const phone of phoneFormats) {
        const response = await request(app)
          .post('/api/bookings')
          .send({
            name: 'Test User',
            email: 'test@example.com',
            phone: phone,
            serviceType: 'website',
          });

        expect(response.status).toBe(201);
      }
    });
  });

  describe('GET /api/bookings - Get all bookings (admin)', () => {
    it('should return all bookings', async () => {
      await Booking.create({
        name: 'Test User',
        email: 'test@example.com',
        phone: '08159089791',
        serviceType: 'website',
      });

      const response = await request(app)
        .get('/api/bookings')
        .set('Authorization', 'Bearer valid-token');

      expect(response.status).toBe(200);
      expect(response.body.bookings).toBeDefined();
      expect(Array.isArray(response.body.bookings)).toBe(true);
      expect(response.body.pagination).toBeDefined();
    });

    it('should return empty array when no bookings exist', async () => {
      await Booking.deleteMany({});
      const response = await request(app)
        .get('/api/bookings')
        .set('Authorization', 'Bearer valid-token');

      expect(response.status).toBe(200);
      expect(response.body.bookings).toEqual([]);
      expect(response.body.pagination).toBeDefined();
    });
  });

  describe('PUT /api/bookings/:id/status - Update status (admin)', () => {
    let bookingId: string;

    beforeEach(async () => {
      const booking = await Booking.create({
        name: 'Test User',
        email: 'test@example.com',
        phone: '08159089791',
        serviceType: 'website',
      });
      bookingId = booking._id.toString();
    });

    it('should update booking status', async () => {
      const response = await request(app)
        .put(`/api/bookings/${bookingId}/status`)
        .set('Authorization', 'Bearer valid-token')
        .send({ status: 'confirmed' });

      expect(response.status).toBe(200);
      expect(response.body.status).toBe('confirmed');
    });

    it('should return 404 for non-existent booking', async () => {
      const fakeId = new mongoose.Types.ObjectId().toString();
      const response = await request(app)
        .put(`/api/bookings/${fakeId}/status`)
        .set('Authorization', 'Bearer valid-token')
        .send({ status: 'confirmed' });

      expect(response.status).toBe(404);
    });

    // Edge: Various status values
    it('should accept various status values', async () => {
      const statuses = ['pending', 'confirmed', 'cancelled', 'completed'];
      
      for (const status of statuses) {
        const response = await request(app)
          .put(`/api/bookings/${bookingId}/status`)
          .set('Authorization', 'Bearer valid-token')
          .send({ status });

        expect(response.status).toBe(200);
        expect(response.body.status).toBe(status);
      }
    });

    it('should reject empty status', async () => {
      const response = await request(app)
        .put(`/api/bookings/${bookingId}/status`)
        .set('Authorization', 'Bearer valid-token')
        .send({ status: '' });

      expect(response.status).toBe(400);
      expect(response.body.error).toBeDefined();
    });
  });
});
