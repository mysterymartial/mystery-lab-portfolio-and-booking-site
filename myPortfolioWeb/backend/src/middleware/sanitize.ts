import { Request, Response, NextFunction } from 'express';
import createDOMPurify from 'dompurify';
import { JSDOM } from 'jsdom';

const window = new JSDOM('').window;
const DOMPurify = createDOMPurify(window as any);

export interface SanitizedRequest extends Request {
  sanitizedBody?: any;
  body: any;
}

// Sanitize string inputs to prevent XSS
export const sanitizeInput = (req: SanitizedRequest, res: Response, next: NextFunction): void => {
  if (req.body && typeof req.body === 'object') {
    const sanitizeObject = (obj: any): any => {
      if (typeof obj === 'string') {
        // Remove HTML tags and sanitize
        return DOMPurify.sanitize(obj, { ALLOWED_TAGS: [] });
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
};

// Sanitize specific fields
export const sanitizeString = (str: string): string => {
  if (typeof str !== 'string') return str;
  return DOMPurify.sanitize(str, { ALLOWED_TAGS: [] }).trim();
};
