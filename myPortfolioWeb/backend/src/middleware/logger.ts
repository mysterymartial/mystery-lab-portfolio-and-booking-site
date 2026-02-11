import { Request, Response, NextFunction } from 'express';
import morgan from 'morgan';
import fs from 'fs';
import path from 'path';

// Create logs directory if it doesn't exist
const logsDir = path.join(process.cwd(), 'logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

// Create write stream for access log
const accessLogStream = fs.createWriteStream(
  path.join(logsDir, 'access.log'),
  { flags: 'a' }
);

// Morgan logger for HTTP requests
export const httpLogger = morgan('combined', {
  stream: accessLogStream,
  skip: (req: Request, res: Response) => {
    // Skip logging health checks in production
    return req.url === '/health' && process.env.NODE_ENV === 'production';
  },
});

// Custom request logger middleware
export const requestLogger = (req: Request, res: Response, next: NextFunction): void => {
  const start = Date.now();

  res.on('finish', () => {
    const duration = Date.now() - start;
    const logEntry = {
      timestamp: new Date().toISOString(),
      method: req.method,
      url: req.url,
      status: res.statusCode,
      duration: `${duration}ms`,
      ip: req.ip || req.socket.remoteAddress,
      userAgent: req.get('user-agent'),
    };

    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.log(`[${logEntry.timestamp}] ${logEntry.method} ${logEntry.url} - ${logEntry.status} (${logEntry.duration})`);
    }

    // Log errors to separate file
    if (res.statusCode >= 400) {
      const errorLogPath = path.join(logsDir, 'errors.log');
      fs.appendFileSync(
        errorLogPath,
        JSON.stringify(logEntry) + '\n'
      );
    }
  });

  next();
};
