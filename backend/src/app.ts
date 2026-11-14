import express, { Express } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import { pinoHttp } from 'pino-http';
import { env } from './config/env.js';
import { logger } from './utils/logger.js';
import { errorHandler } from './middleware/errorHandler.js';
import { globalRateLimiter } from './middleware/rateLimiter.js';
import routes from './routes/index.js';

export const createApp = (): Express => {
  const app = express();

  // Security Middleware
  app.use(helmet());
  app.use(
    cors({
      origin: env.FRONTEND_URL,
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization'],
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

  // API Routes
  app.use('/api/v1', routes);

  // Centralized Error Handling Middleware
  app.use(errorHandler);

  return app;
};
