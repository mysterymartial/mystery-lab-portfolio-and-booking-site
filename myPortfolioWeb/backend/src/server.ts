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

// CORS configuration
const allowedOrigins = [
  process.env.FRONTEND_URL || 'http://localhost:3000',
  process.env.PRODUCTION_URL,
].filter(Boolean);

app.use(cors({
  origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) return callback(null, true);
    // Allow Vercel deployments (*.vercel.app)
    if (origin.endsWith('.vercel.app')) return callback(null, true);
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
