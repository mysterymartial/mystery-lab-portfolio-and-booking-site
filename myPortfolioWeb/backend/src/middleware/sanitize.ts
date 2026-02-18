import { Request, Response, NextFunction } from 'express';
import sanitizeHtml from 'sanitize-html';

export interface SanitizedRequest extends Request {
  sanitizedBody?: any;
  body: any;
}

/** Strip HTML tags from a string to prevent XSS */
function stripHtml(str: string): string {
  return sanitizeHtml(str, { allowedTags: [], allowedAttributes: {} }).trim();
}

// Sanitize string inputs to prevent XSS
export const sanitizeInput = (req: SanitizedRequest, res: Response, next: NextFunction): void => {
  if (req.body && typeof req.body === 'object') {
    const sanitizeObject = (obj: any): any => {
      if (typeof obj === 'string') {
        return stripHtml(obj);
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
  return stripHtml(str);
};
