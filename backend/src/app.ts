import express, { Express } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import * as Sentry from '@sentry/node';
import { pinoHttp } from 'pino-http';
import { env } from './config/env.js';
import { logger } from './utils/logger.js';
import { errorHandler } from './middleware/errorHandler.js';
import { globalRateLimiter } from './middleware/rateLimiter.js';
import { inputSanitizer } from './middleware/sanitizer.js';
import { preventHPP } from './middleware/hpp.js';
import { verifyOrigin } from './middleware/originCheck.js';
import routes from './routes/index.js';

// Initialize Sentry error tracking if DSN is provided
if (env.SENTRY_DSN && env.SENTRY_DSN.trim().length > 0) {
  Sentry.init({
    dsn: env.SENTRY_DSN.trim(),
    environment: env.NODE_ENV,
    tracesSampleRate: 0.1,
  });
}

export const createApp = (): Express => {
  const app = express();

  // 1. Disable server fingerprinting (Anti-Reconnaissance)
  app.disable('x-powered-by');

  // 2. Enterprise Helmet Security Headers & Policies
  app.use(
    helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          scriptSrc: ["'self'", "'unsafe-inline'"],
          styleSrc: ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
          fontSrc: ["'self'", 'https://fonts.gstatic.com', 'data:'],
          imgSrc: ["'self'", 'data:', 'blob:', 'https:'],
          connectSrc: [
            "'self'",
            'https://*.supabase.co',
            'https://*.vercel.app',
            'http://localhost:*',
            'https://openrouter.ai',
            'https://generativelanguage.googleapis.com',
          ],
          frameAncestors: ["'none'"],
          objectSrc: ["'none'"],
          baseUri: ["'self'"],
          formAction: ["'self'"],
        },
      },
      crossOriginResourcePolicy: { policy: 'cross-origin' },
      crossOriginOpenerPolicy: { policy: 'same-origin-allow-popups' },
      hsts: {
        maxAge: 31536000,
        includeSubDomains: true,
        preload: true,
      },
      frameguard: { action: 'deny' },
      noSniff: true,
      referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
    })
  );

  // 3. Strict Device Permissions Policy Header
  app.use((_req, res, next) => {
    res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=(), payment=()');
    res.setHeader('X-Permitted-Cross-Domain-Policies', 'none');
    next();
  });

  // 4. Strict CORS Configuration
  app.use(
    cors({
      origin: (origin, callback) => {
        // Allow requests with no origin (like mobile apps, curl, server-to-server)
        if (!origin) return callback(null, true);
        // Allow any localhost port
        if (origin.startsWith('http://localhost:') || origin.startsWith('http://127.0.0.1:')) {
          return callback(null, true);
        }
        // Allow any Vercel deployment preview / production domain
        if (origin.endsWith('.vercel.app') || origin.includes('.vercel.app')) {
          return callback(null, true);
        }
        // Allow configured frontend URL
        if (env.FRONTEND_URL && origin === env.FRONTEND_URL) {
          return callback(null, true);
        }
        return callback(new Error('Not allowed by CORS'), false);
      },
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
    })
  );

  // 5. Request Logging (with automatic PII/token redaction)
  if (env.NODE_ENV !== 'test') {
    app.use(pinoHttp({ logger }));
  }

  // 6. Global Rate Limiting
  app.use(globalRateLimiter);

  // 7. CSRF / Origin Verification for Mutations
  app.use(verifyOrigin);

  // 8. Body Parsing with Safe Payload Size Limit (1MB Anti-DoS)
  app.use(express.json({ limit: '1mb' }));
  app.use(express.urlencoded({ extended: true, limit: '1mb' }));

  // 9. HTTP Parameter Pollution (HPP) Prevention
  app.use(preventHPP());

  // 10. Automated XSS, NoSQL & SQL Injection Input Sanitization
  app.use(inputSanitizer);

  // Root health / welcome check for quick verification on Vercel
  app.get('/', (_req, res) => {
    res.json({
      name: 'SPENDX API',
      status: 'operational',
      version: '1.0.0',
      health: '/api/v1/health',
    });
  });

  app.get('/health', (_req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // API Routes
  app.use('/api/v1', routes);

  // Centralized Error Handling Middleware
  app.use(errorHandler);

  return app;
};
