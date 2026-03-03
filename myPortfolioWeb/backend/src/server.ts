// CRITICAL: Load environment variables FIRST before any other imports
// This must be the very first import to ensure env vars are available
import './config/env';

import express from 'express';
import cors from 'cors';
import compression from 'compression';
import { connectDB } from './config/database';
import { initSentry } from './config/sentry';
import { securityHeaders } from './middleware/security';
import { apiLimiter, adminLimiter } from './middleware/rateLimiter';
import { requestLogger, httpLogger } from './middleware/logger';
import { performanceMonitor } from './middleware/monitoring';
import { errorHandler } from './middleware/errorHandler';
import messageRoutes from './routes/messages';
import reviewRoutes from './routes/reviews';
import bookingRoutes from './routes/bookings';
import settingRoutes from './routes/settings';

// Initialize Sentry before anything else
initSentry();

const app = express();
const PORT = process.env.PORT || 5000;

// Trust proxy (for rate limiting behind reverse proxy)
app.set('trust proxy', 1);

// Security headers
app.use(securityHeaders);

// Compression middleware
app.use(compression());

// CORS configuration - all origins from env, no hardcoded domains
function getWwwVariant(url: string): string | null {
  try {
    const u = new URL(url);
    if (u.hostname.startsWith('www.')) {
      u.hostname = u.hostname.slice(4);
      return u.toString();
    }
    u.hostname = 'www.' + u.hostname;
    return u.toString();
  } catch {
    return null;
  }
}

const prodUrl = process.env.PRODUCTION_URL;
const prodWww = prodUrl ? getWwwVariant(prodUrl) : null;
const allowedOrigins = [
  process.env.FRONTEND_URL || 'http://localhost:3000',
  prodUrl,
  prodWww,
  ...(process.env.CORS_ALLOWED_ORIGINS?.split(',').map((s) => s.trim()).filter(Boolean) || []),
].filter(Boolean);

// Derive domain suffix from PRODUCTION_URL (e.g. https://www.mysterylab.it.com -> .mysterylab.it.com)
function getDomainSuffixFromProdUrl(): string | null {
  const url = process.env.PRODUCTION_URL;
  if (!url) return null;
  try {
    const host = new URL(url).hostname.replace(/^www\./, '');
    return host ? '.' + host : null;
  } catch {
    return null;
  }
}

const domainSuffix = process.env.CORS_ALLOWED_DOMAIN_SUFFIX || getDomainSuffixFromProdUrl();

app.use(cors({
  origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean | string) => void) => {
    if (!origin || origin === 'null') return callback(null, true);
    if (allowedOrigins.includes(origin)) return callback(null, origin);
    if (origin.endsWith('.vercel.app')) return callback(null, origin);
    if (domainSuffix && origin.endsWith(domainSuffix)) return callback(null, origin);
    callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Request logging
app.use(httpLogger);
app.use(requestLogger);
app.use(performanceMonitor);

// Rate limiting
app.use('/api', apiLimiter);

// Health check (no rate limiting)
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'Mystery Lab Backend API is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
  });
});

// API Routes
app.use('/api/messages', messageRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/settings', adminLimiter, settingRoutes);

// 404 handler
app.use((req: express.Request, res: express.Response) => {
  res.status(404).json({ error: 'Route not found' });
});

// Error handling middleware (must be last)
app.use(errorHandler);

// Connect to MongoDB and start server
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`🔒 Security headers enabled`);
    console.log(`📊 Rate limiting enabled`);
    console.log(`📝 Request logging enabled`);
  });
}).catch((error) => {
  console.error('Failed to start server:', error);
  process.exit(1);
});

export default app;
