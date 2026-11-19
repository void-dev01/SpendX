import { Request, Response, NextFunction } from 'express';
import { env } from '../config/env.js';
import { logger } from '../utils/logger.js';

const SAFE_METHODS = new Set(['GET', 'HEAD', 'OPTIONS']);

/**
 * Validates request origin on state-changing HTTP methods (POST, PUT, PATCH, DELETE)
 * Provides defense-in-depth against Cross-Site Request Forgery (CSRF).
 */
export const verifyOrigin = (req: Request, res: Response, next: NextFunction): void => {
  if (SAFE_METHODS.has(req.method)) {
    return next();
  }

  const origin = req.headers.origin;
  const referer = req.headers.referer;

  // If no origin or referer header is provided (like native mobile apps, server-to-server, curl), pass through
  if (!origin && !referer) {
    return next();
  }

  const sourceUrl = origin || referer;

  try {
    const url = new URL(sourceUrl as string);
    const hostname = url.hostname;

    // Allow localhost & loopback
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
      return next();
    }

    // Allow Vercel preview & production deployments
    if (hostname.endsWith('.vercel.app')) {
      return next();
    }

    // Allow configured frontend URL
    if (env.FRONTEND_URL) {
      const allowedUrl = new URL(env.FRONTEND_URL);
      if (hostname === allowedUrl.hostname) {
        return next();
      }
    }

    // In non-production, be forgiving
    if (env.NODE_ENV !== 'production') {
      return next();
    }

    logger.warn({ origin, referer, ip: req.ip }, 'Blocked request with unverified origin/referer');
    res.status(403).json({
      success: false,
      message: 'Forbidden: Request origin is not authorized',
    });
  } catch (error) {
    logger.warn({ sourceUrl, error }, 'Invalid origin or referer URL header');
    res.status(403).json({
      success: false,
      message: 'Forbidden: Malformed origin header',
    });
  }
};
