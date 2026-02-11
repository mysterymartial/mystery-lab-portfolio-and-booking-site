import { Request, Response, NextFunction } from 'express';

// API performance monitoring middleware
export const performanceMonitor = (req: Request, res: Response, next: NextFunction): void => {
  const start = Date.now();

  res.on('finish', () => {
    const duration = Date.now() - start;
    const { method, url } = req;
    const { statusCode } = res;

    // Log slow requests (> 1 second)
    if (duration > 1000) {
      console.warn(`⚠️ Slow request detected: ${method} ${url} - ${duration}ms`);
    }

    // Log to monitoring service if configured
    if (process.env.ENABLE_MONITORING === 'true') {
      // You can integrate with monitoring services like DataDog, New Relic, etc.
      // Example: monitoringService.recordMetric('api.duration', duration, { method, url, statusCode });
    }
  });

  next();
};

// Database query monitoring
export const logDatabaseQuery = (collection: string, operation: string, duration: number): void => {
  if (duration > 500) {
    console.warn(`⚠️ Slow database query: ${collection}.${operation} - ${duration}ms`);
  }
};
