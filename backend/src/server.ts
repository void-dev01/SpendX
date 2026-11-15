import { createApp } from './app.js';
import { env } from './config/env.js';
import { logger } from './utils/logger.js';
import { SchedulerService } from './services/scheduler.service.js';

const app = createApp();

const server = app.listen(env.PORT, () => {
  logger.info(`🚀 SPENDX Backend API operational on port ${env.PORT} in ${env.NODE_ENV} mode`);
  logger.info(`🔗 CORS configured to accept requests from: ${env.FRONTEND_URL}`);

  // Start background jobs scheduler in non-test environments
  if (process.env.NODE_ENV !== 'test') {
    SchedulerService.start();
  }
});

const gracefulShutdown = (signal: string) => {
  logger.info(`Received ${signal}. Shutting down gracefully...`);
  SchedulerService.stop();
  server.close(() => {
    logger.info('HTTP server closed.');
    process.exit(0);
  });
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));
