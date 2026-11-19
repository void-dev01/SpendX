import express, { Express } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import * as Sentry from '@sentry/node';
import { pinoHttp } from 'pino-http';
import { env } from './config/env.js';
import { logger } from './utils/logger.js';
import { errorHandler } from './middleware/errorHandler.js';
import { globalRateLimiter } from './middleware/rateLimiter.js';
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

  // Security Middleware
  app.use(helmet());
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
        return callback(null, true);
      },
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
    })
  );

  // Request Logging
  if (env.NODE_ENV !== 'test') {
    app.use(pinoHttp({ logger }));
  }

  // Rate Limiting
  app.use(globalRateLimiter);

  // Body Parsing
  app.use(express.json({ limit: '1mb' }));
  app.use(express.urlencoded({ extended: true, limit: '1mb' }));

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
