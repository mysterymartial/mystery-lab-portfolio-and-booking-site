import { Router, Request, Response } from 'express';
import Review from '../models/Review';
import { authenticateAdmin } from '../middleware/auth';
import { reviewLimiter } from '../middleware/rateLimiter';
import { sanitizeInput, sanitizeString } from '../middleware/sanitize';
import { asyncHandler } from '../middleware/errorHandler';

const router = Router();

// Get all approved reviews (public) - Optimized with caching
router.get('/approved', asyncHandler(async (req: Request, res: Response) => {
  const limit = parseInt(req.query.limit as string) || 6;
  
  const reviews = await Review.find({ approved: true })
    .sort({ createdAt: -1 })
    .limit(limit)
    .select('name rating comment createdAt approved')
    .lean()
    .exec();
  
  // Cache for 5 minutes (reviews don't change frequently)
  res.set('Cache-Control', 'public, max-age=300');
  res.json(reviews);
}));

// Get all reviews (admin only)
router.get('/', authenticateAdmin, async (req: Request, res: Response) => {
  try {
    const reviews = await Review.find().sort({ createdAt: -1 }).exec();
    res.json(reviews);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Create a new review - Rate limited and sanitized
router.post('/', reviewLimiter, sanitizeInput, asyncHandler(async (req: Request, res: Response) => {
  const { name, rating, comment } = req.body;

  if (!name || rating === undefined || !comment) {
    res.status(400).json({ error: 'Name, rating, and comment are required' });
    return;
  }

  const numRating = parseInt(rating);
  if (isNaN(numRating) || numRating < 1 || numRating > 5) {
    res.status(400).json({ error: 'Rating must be between 1 and 5' });
    return;
  }

  // Sanitize inputs
  const sanitizedName = sanitizeString(name);
  const sanitizedComment = sanitizeString(comment);

  // Validate lengths
  if (sanitizedName.length < 2 || sanitizedName.length > 100) {
    res.status(400).json({ error: 'Name must be between 2 and 100 characters' });
    return;
  }

  if (sanitizedComment.length < 10 || sanitizedComment.length > 2000) {
    res.status(400).json({ error: 'Comment must be between 10 and 2000 characters' });
    return;
  }

  const review = new Review({
    name: sanitizedName,
    rating: numRating,
    comment: sanitizedComment,
    approved: false,
  });
  await review.save();

  res.status(201).json({
    _id: review._id,
    name: review.name,
    rating: review.rating,
    comment: review.comment,
    approved: review.approved,
    createdAt: review.createdAt,
  });
}));

// Approve a review (admin only)
router.put('/:id/approve', authenticateAdmin, asyncHandler(async (req: Request, res: Response) => {
  const review = await Review.findByIdAndUpdate(
    req.params.id,
    { approved: true },
    { new: true }
  );

  if (!review) {
    res.status(404).json({ error: 'Review not found' });
    return;
  }

  res.json(review);
}));

// Reject a review (admin only)
router.put('/:id/reject', authenticateAdmin, asyncHandler(async (req: Request, res: Response) => {
  const review = await Review.findByIdAndUpdate(
    req.params.id,
    { approved: false },
    { new: true }
  );

  if (!review) {
    res.status(404).json({ error: 'Review not found' });
    return;
  }

  res.json(review);
}));

export default router;
