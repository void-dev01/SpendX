import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../types/index.js';
import { AnalyticsService } from '../services/analytics.service.js';
import { AppError } from '../middleware/errorHandler.js';

export const getAnalytics = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = req.user?.id;
    if (!userId) return next(new AppError('Unauthorized', 401));

    const period = (req.query.period as any) || 'this_month';
    const data = await AnalyticsService.getAnalyticsOverview(userId, period);
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
};
