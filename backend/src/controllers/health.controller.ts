import { Request, Response } from 'express';
import { ApiResponse } from '../types/index.js';
import { isConfigured, env } from '../config/env.js';
import { SchedulerService } from '../services/scheduler.service.js';

export const getHealth = (_req: Request, res: Response<ApiResponse>): void => {
  res.status(200).json({
    success: true,
    message: 'SPENDX Core API is operational',
    data: {
      service: 'spendx-backend',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      integrations: {
        supabaseConfigured: isConfigured.supabase,
        geminiConfigured: isConfigured.gemini,
      },
    },
  });
};

export const getReadiness = (_req: Request, res: Response<ApiResponse>): void => {
  const memoryUsage = process.memoryUsage();

  res.status(200).json({
    success: true,
    message: 'SPENDX service ready to accept traffic',
    data: {
      status: 'READY',
      environment: env.NODE_ENV,
      nodeVersion: process.version,
      uptimeSeconds: Math.floor(process.uptime()),
      memory: {
        rssMb: Math.round(memoryUsage.rss / (1024 * 1024)),
        heapUsedMb: Math.round(memoryUsage.heapUsed / (1024 * 1024)),
        heapTotalMb: Math.round(memoryUsage.heapTotal / (1024 * 1024)),
      },
      scheduler: SchedulerService.getStatus(),
      database: {
        status: isConfigured.supabase ? 'CONFIGURED' : 'STANDALONE_DEVELOPMENT',
      },
    },
  });
};
