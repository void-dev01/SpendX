import { Request, Response, NextFunction } from 'express';

/**
 * HTTP Parameter Pollution (HPP) Protection Middleware
 * Normalizes query string parameters so duplicate keys cannot be used to bypass validation schemas.
 */
export const preventHPP = (whitelist: string[] = []): ((req: Request, res: Response, next: NextFunction) => void) => {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (req.query && typeof req.query === 'object') {
      const sanitizedQuery: Record<string, unknown> = {};

      for (const [key, value] of Object.entries(req.query)) {
        if (Array.isArray(value) && !whitelist.includes(key)) {
          // Take the last item in case of unintended duplicate parameter pollution
          sanitizedQuery[key] = value[value.length - 1];
        } else {
          sanitizedQuery[key] = value;
        }
      }

      req.query = sanitizedQuery as Request['query'];
    }

    next();
  };
};
