import { Router, Request, Response } from 'express';
import Message from '../models/Message';
import { sendEmail } from '../config/email';
import { authenticateAdmin, AuthRequest } from '../middleware/auth';
import { messageLimiter } from '../middleware/rateLimiter';
import { sanitizeInput, sanitizeString } from '../middleware/sanitize';
import { asyncHandler } from '../middleware/errorHandler';

const router = Router();

// Get all messages (non-deleted) - Optimized query with limit
router.get('/', asyncHandler(async (req: Request, res: Response) => {
  // Handle case where /api/messages/ (with trailing slash) is interpreted as empty ID
  // GET / route doesn't require auth, but GET /:id does
  // If request has Authorization header and no query params, it's likely meant for /:id route
  if (req.headers.authorization && Object.keys(req.query).length === 0) {
    // Check if original URL had trailing slash (indicates empty ID)
    const originalUrl = req.originalUrl || req.url;
    if (originalUrl.endsWith('/') && !originalUrl.includes('?')) {
      res.status(404).json({ error: 'Message not found' });
      return;
    }
  }
  const limit = parseInt(req.query.limit as string) || 50;
  const skip = parseInt(req.query.skip as string) || 0;
  
  const messages = await Message.find({ deleted: false })
    .sort({ createdAt: -1 })
    .limit(limit)
    .skip(skip)
    .select('name email message createdAt replies googleMeetLink deleted')
    .lean()
    .exec();
  
  const total = await Message.countDocuments({ deleted: false });
  
  res.set('Cache-Control', 'no-store, must-revalidate'); // No cache - chat data must be fresh for real-time replies
  res.json({
    messages,
    pagination: {
      total,
      limit,
      skip,
      hasMore: skip + limit < total,
    },
  });
}));

// Create a new message - Rate limited and sanitized
router.post('/', messageLimiter, sanitizeInput, asyncHandler(async (req: Request, res: Response) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    res.status(400).json({ error: 'Name, email, and message are required' });
    return;
  }

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    res.status(400).json({ error: 'Invalid email format' });
    return;
  }

  // Sanitize inputs
  const sanitizedName = sanitizeString(name);
  const sanitizedEmail = sanitizeString(email.toLowerCase());
  const sanitizedMessage = sanitizeString(message);

  // Validate lengths
  if (sanitizedName.length < 2 || sanitizedName.length > 100) {
    res.status(400).json({ error: 'Name must be between 2 and 100 characters' });
    return;
  }

  if (sanitizedMessage.length < 2 || sanitizedMessage.length > 5000) {
    res.status(400).json({ error: 'Message must be between 2 and 5000 characters' });
    return;
  }

  const newMessage = new Message({
    name: sanitizedName,
    email: sanitizedEmail,
    message: sanitizedMessage,
  });
  await newMessage.save();

    // Send email notification (fire-and-forget - don't block response)
    const adminEmail = process.env.ADMIN_EMAIL;
    if (adminEmail) {
      sendEmail(
        adminEmail,
        `New Message from ${name}`,
        `Name: ${name}\nEmail: ${email}\nMessage: ${message}`
      ).catch((err) => console.error('Message email notification failed:', err));
    }

    res.status(201).json({
      _id: newMessage._id,
      name: newMessage.name,
      email: newMessage.email,
      message: newMessage.message,
      createdAt: newMessage.createdAt,
    });
}));

// Get a single message (admin only) - Optimized query
router.get('/:id', authenticateAdmin, asyncHandler(async (req: Request, res: Response) => {
  // Handle empty ID
  if (!req.params.id || req.params.id.trim() === '') {
    res.status(404).json({ error: 'Message not found' });
    return;
  }
  
  const message = await Message.findById(req.params.id)
    .select('-__v')
    .lean();
  
  if (!message) {
    res.status(404).json({ error: 'Message not found' });
    return;
  }
  
  res.set('Cache-Control', 'private, max-age=30');
  res.json(message);
}));

// Soft delete a message (admin only)
router.delete('/:id', authenticateAdmin, asyncHandler(async (req: Request, res: Response) => {
  // First check if message exists and is not already deleted
  const existingMessage = await Message.findById(req.params.id).lean();
  if (!existingMessage) {
    res.status(404).json({ error: 'Message not found' });
    return;
  }
  if (existingMessage.deleted === true) {
    res.status(404).json({ error: 'Message not found' });
    return;
  }
  
  // Now perform the soft delete
  const message = await Message.findByIdAndUpdate(
    req.params.id,
    { deleted: true },
    { new: true }
  );
  if (!message) {
    res.status(404).json({ error: 'Message not found' });
    return;
  }
  res.json({ message: 'Message deleted successfully' });
}));

// Add reply to a message (admin only) - Sanitized
router.post('/:id/reply', authenticateAdmin, sanitizeInput, asyncHandler(async (req: Request, res: Response) => {
  const { message: replyText } = req.body;
  
  if (!replyText || typeof replyText !== 'string') {
    res.status(400).json({ error: 'Reply message is required' });
    return;
  }

  const sanitizedReply = sanitizeString(replyText);
  
  if (sanitizedReply.length < 5 || sanitizedReply.length > 2000) {
    res.status(400).json({ error: 'Reply must be between 5 and 2000 characters' });
    return;
  }

  const message = await Message.findById(req.params.id);

  if (!message) {
    res.status(404).json({ error: 'Message not found' });
    return;
  }

  message.replies.push({
    message: sanitizedReply,
    timestamp: new Date(),
  });

  await message.save();

  // Send email to the original sender
  await sendEmail(
    message.email,
    'Reply to your message',
    `Hello ${message.name},\n\n${sanitizedReply}\n\nBest regards,\nMystery Lab`
  );

  res.json(message);
}));

// Set Google Meet link (admin only) - Sanitized
router.put('/:id/google-meet', authenticateAdmin, sanitizeInput, asyncHandler(async (req: Request, res: Response) => {
  const { googleMeetLink } = req.body;
  
  // Accept empty string as valid (allows clearing the link)
  if (typeof googleMeetLink === 'string') {
    const sanitizedLink = sanitizeString(googleMeetLink);
    const message = await Message.findByIdAndUpdate(
      req.params.id,
      { googleMeetLink: sanitizedLink },
      { new: true }
    );

    if (!message) {
      res.status(404).json({ error: 'Message not found' });
      return;
    }

    res.json(message);
  } else {
    res.status(400).json({ error: 'Invalid Google Meet link' });
  }
}));

export default router;
