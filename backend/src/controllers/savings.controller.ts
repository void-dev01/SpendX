import { Response, NextFunction } from 'express';
import { AuthenticatedRequest, ApiResponse } from '../types/index.js';
import { SavingsService } from '../services/savings.service.js';
import {
  createSavingsGoalSchema,
  updateSavingsGoalSchema,
  recordContributionSchema,
} from '../validators/savings.validator.js';
import { AppError } from '../middleware/errorHandler.js';

export const getSavingsGoals = async (
  req: AuthenticatedRequest,
  res: Response<ApiResponse>,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user?.id;
    if (!userId) return next(new AppError('Unauthorized', 401));

    const goals = await SavingsService.getGoals(userId);
    res.status(200).json({
      success: true,
      data: goals,
    });
  } catch (err) {
    next(err);
  }
};

export const createSavingsGoal = async (
  req: AuthenticatedRequest,
  res: Response<ApiResponse>,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user?.id;
    if (!userId) return next(new AppError('Unauthorized', 401));

    const validated = createSavingsGoalSchema.parse(req.body);
    const created = await SavingsService.createGoal(userId, validated);

    res.status(201).json({
      success: true,
      message: 'Savings goal created',
      data: created,
    });
  } catch (err) {
    next(err);
  }
};

export const updateSavingsGoal = async (
  req: AuthenticatedRequest,
  res: Response<ApiResponse>,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user?.id;
    if (!userId) return next(new AppError('Unauthorized', 401));

    const id = String(req.params.id);
    const validated = updateSavingsGoalSchema.parse(req.body);
    const updated = await SavingsService.updateGoal(userId, id, validated);

    res.status(200).json({
      success: true,
      message: 'Savings goal updated',
      data: updated,
    });
  } catch (err) {
    next(err);
  }
};

export const deleteSavingsGoal = async (
  req: AuthenticatedRequest,
  res: Response<ApiResponse>,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user?.id;
    if (!userId) return next(new AppError('Unauthorized', 401));

    const id = String(req.params.id);
    await SavingsService.deleteGoal(userId, id);

    res.status(200).json({
      success: true,
      message: 'Savings goal deleted',
    });
  } catch (err) {
    next(err);
  }
};

export const recordContribution = async (
  req: AuthenticatedRequest,
  res: Response<ApiResponse>,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user?.id;
    if (!userId) return next(new AppError('Unauthorized', 401));

    const id = String(req.params.id);
    const { amount, notes } = recordContributionSchema.parse(req.body);
    const result = await SavingsService.recordContribution(userId, id, amount, notes);

    res.status(200).json({
      success: true,
      message: result.milestoneCelebrated
        ? 'Contribution recorded and milestone unlocked!'
        : 'Contribution recorded successfully',
      data: result,
    });
  } catch (err) {
    next(err);
  }
};
