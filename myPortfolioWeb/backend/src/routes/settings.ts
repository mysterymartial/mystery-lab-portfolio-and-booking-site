import { Router, Request, Response } from 'express';
import Setting from '../models/Setting';
import { authenticateAdmin } from '../middleware/auth';
import { sanitizeInput, sanitizeString } from '../middleware/sanitize';
import { asyncHandler } from '../middleware/errorHandler';

const router = Router();

// Get a setting (public for theme, admin for others) - Cached
router.get('/:key', asyncHandler(async (req: Request, res: Response) => {
  const keyParam = Array.isArray(req.params.key) ? req.params.key[0] : req.params.key;
  const key = sanitizeString(keyParam);
  const setting = await Setting.findOne({ key }).lean();
  
  if (!setting) {
    res.status(404).json({ error: 'Setting not found' });
    return;
  }
  
  // Cache settings for 1 minute
  res.set('Cache-Control', 'public, max-age=60');
  res.json(setting);
}));

// Update a setting (admin only) - Sanitized
router.put('/:key', authenticateAdmin, sanitizeInput, asyncHandler(async (req: Request, res: Response) => {
  const keyParam = Array.isArray(req.params.key) ? req.params.key[0] : req.params.key;
  const key = sanitizeString(keyParam);
  const { value } = req.body;
  
  const setting = await Setting.findOneAndUpdate(
    { key },
    { value },
    { upsert: true, new: true }
  );
  
  res.json(setting);
}));

export default router;
