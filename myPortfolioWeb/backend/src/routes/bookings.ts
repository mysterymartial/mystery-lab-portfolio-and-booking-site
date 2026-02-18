import { Router, Request, Response } from 'express';
import Booking from '../models/Booking';
import { sendEmail } from '../config/email';
import { authenticateAdmin } from '../middleware/auth';
import { bookingLimiter } from '../middleware/rateLimiter';
import { sanitizeInput, sanitizeString } from '../middleware/sanitize';
import { asyncHandler } from '../middleware/errorHandler';

const router = Router();

// Get all bookings (admin only) - Optimized query
router.get('/', authenticateAdmin, asyncHandler(async (req: Request, res: Response) => {
  const limit = parseInt(req.query.limit as string) || 50;
  const skip = parseInt(req.query.skip as string) || 0;
  const status = req.query.status as string;
  
  const query: any = { deleted: { $ne: true } };
  if (status) {
    query.status = status;
  }
  
  const bookings = await Booking.find(query)
    .sort({ createdAt: -1 })
    .limit(limit)
    .skip(skip)
    .lean()
    .exec();
  
  const total = await Booking.countDocuments(query);
  
  res.set('Cache-Control', 'private, max-age=30');
  res.json({
    bookings,
    pagination: {
      total,
      limit,
      skip,
      hasMore: skip + limit < total,
    },
  });
}));

// Create a new booking - Rate limited and sanitized
router.post('/', bookingLimiter, sanitizeInput, asyncHandler(async (req: Request, res: Response) => {
  const {
    name,
    email,
    phone,
    serviceType,
    eventDate,
    eventLocation,
    budget,
    additionalInfo,
  } = req.body;

  if (!name || !email || !phone || !serviceType) {
    res.status(400).json({ error: 'Name, email, phone, and service type are required' });
    return;
  }

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    res.status(400).json({ error: 'Invalid email format' });
    return;
  }

  // Sanitize all inputs
  const sanitizedName = sanitizeString(name);
  const sanitizedEmail = sanitizeString(email.toLowerCase());
  const sanitizedPhone = sanitizeString(phone);
  const sanitizedServiceType = sanitizeString(serviceType);
  const sanitizedEventDate = eventDate ? sanitizeString(eventDate) : undefined;
  const sanitizedEventLocation = eventLocation ? sanitizeString(eventLocation) : undefined;
  const sanitizedBudget = budget ? sanitizeString(budget) : undefined;
  const sanitizedAdditionalInfo = additionalInfo ? sanitizeString(additionalInfo) : undefined;

  // Validate required fields
  if (sanitizedName.length < 2 || sanitizedName.length > 100) {
    res.status(400).json({ error: 'Name must be between 2 and 100 characters' });
    return;
  }

  if (sanitizedPhone.length < 10 || sanitizedPhone.length > 20) {
    res.status(400).json({ error: 'Phone must be between 10 and 20 characters' });
    return;
  }

  if (sanitizedEventDate) {
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(sanitizedEventDate)) {
      res.status(400).json({ error: 'Event date must be in YYYY-MM-DD format' });
      return;
    }
    const eventDateObj = new Date(sanitizedEventDate);
    if (isNaN(eventDateObj.getTime())) {
      res.status(400).json({ error: 'Invalid event date' });
      return;
    }
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    eventDateObj.setHours(0, 0, 0, 0);
    if (eventDateObj < today) {
      res.status(400).json({ error: 'Event date cannot be in the past' });
      return;
    }
  }

  const booking = new Booking({
    name: sanitizedName,
    email: sanitizedEmail,
    phone: sanitizedPhone,
    serviceType: sanitizedServiceType,
    eventDate: sanitizedEventDate,
    eventLocation: sanitizedEventLocation,
    budget: sanitizedBudget,
    additionalInfo: sanitizedAdditionalInfo,
    status: 'pending',
  });

  await booking.save();

  // Send email notification (fire-and-forget - don't block response)
  const adminEmail = process.env.ADMIN_EMAIL;
  if (adminEmail) {
    sendEmail(
      adminEmail,
      `New Booking Request from ${sanitizedName}`,
      `New booking request:\n\nName: ${sanitizedName}\nEmail: ${sanitizedEmail}\nPhone: ${sanitizedPhone}\nService: ${sanitizedServiceType}\nDate: ${sanitizedEventDate || 'Not specified'}\nLocation: ${sanitizedEventLocation || 'Not specified'}\nBudget: ${sanitizedBudget || 'Not specified'}\n\nAdditional Info: ${sanitizedAdditionalInfo || 'None'}`
    ).catch((err) => console.error('Booking email notification failed:', err));
  }

  res.status(201).json({
      _id: booking._id,
      name: booking.name,
      email: booking.email,
      phone: booking.phone,
      serviceType: booking.serviceType,
      status: booking.status,
      eventDate: booking.eventDate,
      eventLocation: booking.eventLocation,
      budget: booking.budget,
      additionalInfo: booking.additionalInfo,
      createdAt: booking.createdAt,
    });
}));

// Update booking status (admin only)
router.put('/:id/status', authenticateAdmin, asyncHandler(async (req: Request, res: Response) => {
  const { status } = req.body;
  if (!status || typeof status !== 'string') {
    res.status(400).json({ error: 'Status is required' });
    return;
  }
  const booking = await Booking.findOneAndUpdate(
    { _id: req.params.id, deleted: { $ne: true } },
    { status },
    { new: true }
  );

  if (!booking) {
    res.status(404).json({ error: 'Booking not found' });
    return;
  }

  res.json(booking);
}));

// Soft delete booking (admin only)
router.delete('/:id', authenticateAdmin, asyncHandler(async (req: Request, res: Response) => {
  const booking = await Booking.findOneAndUpdate(
    { _id: req.params.id },
    { deleted: true },
    { new: true }
  );

  if (!booking) {
    res.status(404).json({ error: 'Booking not found' });
    return;
  }

  res.json({ message: 'Booking archived', _id: booking._id });
}));

export default router;
