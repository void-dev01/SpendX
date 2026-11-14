import { Request, Response } from 'express';
import { ApiResponse } from '../types/index.js';
import { isConfigured } from '../config/env.js';

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
