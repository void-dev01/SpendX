import { Response, NextFunction } from 'express';
import { AuthenticatedRequest, ApiResponse } from '../types/index.js';
import { AnalyticsService } from '../services/analytics.service.js';
import { AppError } from '../middleware/errorHandler.js';

export const getFinancialSummary = async (
  req: AuthenticatedRequest,
  res: Response<ApiResponse>,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user?.id;
    if (!userId) return next(new AppError('Unauthorized', 401));

    const summary = await AnalyticsService.getSummary(userId);
    res.status(200).json({
      success: true,
      data: summary,
    });
  } catch (err) {
    next(err);
  }
};

export const getHealthScore = async (
  req: AuthenticatedRequest,
  res: Response<ApiResponse>,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user?.id;
    if (!userId) return next(new AppError('Unauthorized', 401));

    const health = await AnalyticsService.getHealthScore(userId);
    res.status(200).json({
      success: true,
      data: health,
    });
  } catch (err) {
    next(err);
  }
};

export const getBurnRate = async (
  req: AuthenticatedRequest,
  res: Response<ApiResponse>,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user?.id;
    if (!userId) return next(new AppError('Unauthorized', 401));

    const burnRate = await AnalyticsService.getBurnRate(userId);
    res.status(200).json({
      success: true,
      data: burnRate,
    });
  } catch (err) {
    next(err);
  }
};
