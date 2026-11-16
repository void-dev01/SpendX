import { Response, NextFunction } from 'express';
import { AuthenticatedRequest, ApiResponse } from '../types/index.js';
import {
  createRecurringSchema,
  updateRecurringSchema,
  detectPatternsSchema,
} from '../validators/recurring.validator.js';
import { RecurringService } from '../services/recurring.service.js';
import { AppError } from '../middleware/errorHandler.js';

export const getRecurring = async (
  req: AuthenticatedRequest,
  res: Response<ApiResponse>,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user?.id;
    if (!userId) return next(new AppError('Unauthorized', 401));

    const recurring = await RecurringService.getRecurring(userId);
    res.status(200).json({
      success: true,
      data: recurring,
    });
  } catch (err) {
    next(err);
  }
};

export const getRecurringById = async (
  req: AuthenticatedRequest,
  res: Response<ApiResponse>,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user?.id;
    if (!userId) return next(new AppError('Unauthorized', 401));

    const id = String(req.params.id);
    const recurring = await RecurringService.getRecurringById(userId, id);
    res.status(200).json({
      success: true,
      data: recurring,
    });
  } catch (err) {
    next(err);
  }
};

export const createRecurring = async (
  req: AuthenticatedRequest,
  res: Response<ApiResponse>,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user?.id;
    if (!userId) return next(new AppError('Unauthorized', 401));

    const validated = createRecurringSchema.parse(req.body);
    const created = await RecurringService.createRecurring(userId, validated);

    res.status(201).json({
      success: true,
      message: 'Recurring payment created successfully',
      data: created,
    });
  } catch (err) {
    next(err);
  }
};

export const updateRecurring = async (
  req: AuthenticatedRequest,
  res: Response<ApiResponse>,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user?.id;
    if (!userId) return next(new AppError('Unauthorized', 401));

    const id = String(req.params.id);
    const validated = updateRecurringSchema.parse(req.body);
    const updated = await RecurringService.updateRecurring(userId, id, validated);

    res.status(200).json({
      success: true,
      message: 'Recurring payment updated successfully',
      data: updated,
    });
  } catch (err) {
    next(err);
  }
};

export const deleteRecurring = async (
  req: AuthenticatedRequest,
  res: Response<ApiResponse>,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user?.id;
    if (!userId) return next(new AppError('Unauthorized', 401));

    const id = String(req.params.id);
    await RecurringService.deleteRecurring(userId, id);

    res.status(200).json({
      success: true,
      message: 'Recurring payment deleted successfully',
    });
  } catch (err) {
    next(err);
  }
};

export const detectPatterns = async (
  req: AuthenticatedRequest,
  res: Response<ApiResponse>,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user?.id;
    if (!userId) return next(new AppError('Unauthorized', 401));

    const validated = detectPatternsSchema.parse(req.body || {});
    const detected = await RecurringService.detectPatterns(userId, validated.lookbackDays);

    res.status(200).json({
      success: true,
      data: detected,
    });
  } catch (err) {
    next(err);
  }
};
