import request from 'supertest';
import express from 'express';
import mongoose from 'mongoose';
import reviewRoutes from '../../src/routes/reviews';
import Review from '../../src/models/Review';

jest.mock('../../src/middleware/auth', () => ({
  authenticateAdmin: (req: any, res: any, next: any) => {
    req.user = { uid: 'test-admin-uid', email: 'admin@test.com' };
    next();
  },
}));

// Mock rate limiting middleware
jest.mock('../../src/middleware/rateLimiter', () => ({
  reviewLimiter: (req: any, res: any, next: any) => next(),
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
app.use('/api/reviews', reviewRoutes);

describe('Reviews API - Boundary Analysis & Edge Cases', () => {
  let testReviewId: string;

  beforeEach(async () => {
    const review = new Review({
      name: 'Test Reviewer',
      rating: 5,
      comment: 'Great service!',
      approved: false,
    });
    await review.save();
    testReviewId = review._id.toString();
  });

  describe('GET /api/reviews/approved - Get approved reviews (public)', () => {
    it('should return only approved reviews', async () => {
      await Review.create({
        name: 'Approved Reviewer',
        rating: 4,
        comment: 'Approved comment',
        approved: true,
      });

      const response = await request(app).get('/api/reviews/approved');
      expect(response.status).toBe(200);
      // Route returns array directly
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
      expect(response.body.every((r: any) => r.approved === true)).toBe(true);
    });

    it('should return empty array when no approved reviews exist', async () => {
      await Review.updateMany({}, { approved: false });
      const response = await request(app).get('/api/reviews/approved');
      expect(response.status).toBe(200);
      expect(response.body).toEqual([]);
    });

    it('should limit results to 6 reviews', async () => {
      // Create 10 approved reviews
      for (let i = 0; i < 10; i++) {
        await Review.create({
          name: `Reviewer ${i}`,
          rating: 5,
          comment: `Comment ${i}`,
          approved: true,
        });
      }

      const response = await request(app).get('/api/reviews/approved');
      expect(response.status).toBe(200);
      expect(response.body.length).toBeLessThanOrEqual(6);
    });

    it('should return reviews sorted by createdAt descending', async () => {
      const review1 = await Review.create({
        name: 'Reviewer 1',
        rating: 5,
        comment: 'First',
        approved: true,
        createdAt: new Date('2024-01-01'),
      });
      const review2 = await Review.create({
        name: 'Reviewer 2',
        rating: 4,
        comment: 'Second',
        approved: true,
        createdAt: new Date('2024-01-02'),
      });

      const response = await request(app).get('/api/reviews/approved');
      expect(response.status).toBe(200);
      const dates = response.body.map((r: any) => new Date(r.createdAt).getTime());
      expect(dates[0]).toBeGreaterThanOrEqual(dates[1]);
    });
  });

  describe('POST /api/reviews - Create review', () => {
    it('should create review with valid data', async () => {
      const reviewData = {
        name: 'John Doe',
        rating: 5,
        comment: 'Excellent service!',
      };

      const response = await request(app)
        .post('/api/reviews')
        .send(reviewData);

      expect(response.status).toBe(201);
      expect(response.body.name).toBe(reviewData.name);
      expect(response.body.rating).toBe(reviewData.rating);
      expect(response.body.comment).toBe(reviewData.comment);
      expect(response.body.approved).toBe(false);
    });

    // Boundary: Rating limits
    it('should reject rating below 1', async () => {
      const response = await request(app)
        .post('/api/reviews')
        .send({
          name: 'Test User',
          rating: 0,
          comment: 'Test comment',
        });

      expect(response.status).toBe(400);
    });

    it('should reject rating above 5', async () => {
      const response = await request(app)
        .post('/api/reviews')
        .send({
          name: 'Test User',
          rating: 6,
          comment: 'Test comment',
        });

      expect(response.status).toBe(400);
    });

    it('should accept minimum rating (1)', async () => {
      const response = await request(app)
        .post('/api/reviews')
        .send({
          name: 'Test User',
          rating: 1,
          comment: 'Test comment',
        });

      expect(response.status).toBe(201);
      expect(response.body.rating).toBe(1);
    });

    it('should accept maximum rating (5)', async () => {
      const response = await request(app)
        .post('/api/reviews')
        .send({
          name: 'Test User',
          rating: 5,
          comment: 'Test comment',
        });

      expect(response.status).toBe(201);
      expect(response.body.rating).toBe(5);
    });

    // Boundary: Missing required fields
    it('should reject review with missing name', async () => {
      const response = await request(app)
        .post('/api/reviews')
        .send({
          rating: 5,
          comment: 'Test comment',
        });

      expect(response.status).toBe(400);
    });

    it('should reject review with missing rating', async () => {
      const response = await request(app)
        .post('/api/reviews')
        .send({
          name: 'Test User',
          comment: 'Test comment',
        });

      expect(response.status).toBe(400);
    });

    it('should reject review with missing comment', async () => {
      const response = await request(app)
        .post('/api/reviews')
        .send({
          name: 'Test User',
          rating: 5,
        });

      expect(response.status).toBe(400);
    });

    // Boundary: Empty strings
    it('should reject empty name', async () => {
      const response = await request(app)
        .post('/api/reviews')
        .send({
          name: '',
          rating: 5,
          comment: 'Test comment',
        });

      expect(response.status).toBe(400);
    });

    it('should reject empty comment', async () => {
      const response = await request(app)
        .post('/api/reviews')
        .send({
          name: 'Test User',
          rating: 5,
          comment: '',
        });

      expect(response.status).toBe(400);
      expect(response.body.error).toBeDefined();
    });

    // Edge: Decimal ratings
    it('should handle decimal rating (2.5)', async () => {
      const response = await request(app)
        .post('/api/reviews')
        .send({
          name: 'Test User',
          rating: 2.5,
          comment: 'Test comment with at least 10 characters',
        });

      // parseInt(2.5) = 2, which is valid (1-5 range)
      expect(response.status).toBe(201);
      expect(response.body.rating).toBe(2);
    });

    // Edge: Very long comment
    it('should handle very long comment (2000 characters - max allowed)', async () => {
      const longComment = 'A'.repeat(2000);
      const response = await request(app)
        .post('/api/reviews')
        .send({
          name: 'Test User',
          rating: 5,
          comment: longComment,
        });

      expect(response.status).toBe(201);
      expect(response.body.comment).toBe(longComment);
    });

    it('should reject comment exceeding max length (2001 characters)', async () => {
      const longComment = 'A'.repeat(2001);
      const response = await request(app)
        .post('/api/reviews')
        .send({
          name: 'Test User',
          rating: 5,
          comment: longComment,
        });

      expect(response.status).toBe(400);
      expect(response.body.error).toContain('2000');
    });

    // Edge: Special characters
    it('should handle special characters in name and comment', async () => {
      const response = await request(app)
        .post('/api/reviews')
        .send({
          name: "O'Brien & Associates",
          rating: 5,
          comment: 'Great service! <script>alert("XSS")</script> This is a longer comment with at least 10 characters',
        });

      expect(response.status).toBe(201);
      // XSS should be sanitized
      expect(response.body.comment).not.toContain('<script>');
    });
  });

  describe('PUT /api/reviews/:id/approve - Approve review (admin)', () => {
    it('should approve review successfully', async () => {
      const response = await request(app)
        .put(`/api/reviews/${testReviewId}/approve`)
        .set('Authorization', 'Bearer valid-token');

      expect(response.status).toBe(200);
      expect(response.body.approved).toBe(true);
    });

    it('should return 404 for non-existent review', async () => {
      const fakeId = new mongoose.Types.ObjectId().toString();
      const response = await request(app)
        .put(`/api/reviews/${fakeId}/approve`)
        .set('Authorization', 'Bearer valid-token');

      expect(response.status).toBe(404);
    });

    it('should handle approving already approved review', async () => {
      await Review.findByIdAndUpdate(testReviewId, { approved: true });
      const response = await request(app)
        .put(`/api/reviews/${testReviewId}/approve`)
        .set('Authorization', 'Bearer valid-token');

      expect(response.status).toBe(200);
      expect(response.body.approved).toBe(true);
    });
  });

  describe('PUT /api/reviews/:id/reject - Reject review (admin)', () => {
    it('should reject review successfully', async () => {
      await Review.findByIdAndUpdate(testReviewId, { approved: true });
      const response = await request(app)
        .put(`/api/reviews/${testReviewId}/reject`)
        .set('Authorization', 'Bearer valid-token');

      expect(response.status).toBe(200);
      expect(response.body.approved).toBe(false);
    });

    it('should return 404 for non-existent review', async () => {
      const fakeId = new mongoose.Types.ObjectId().toString();
      const response = await request(app)
        .put(`/api/reviews/${fakeId}/reject`)
        .set('Authorization', 'Bearer valid-token');

      expect(response.status).toBe(404);
    });
  });
});
