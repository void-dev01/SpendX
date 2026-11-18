import { Response, NextFunction } from 'express';
import { AuthenticatedRequest, ApiResponse } from '../types/index.js';
import { BudgetService } from '../services/budget.service.js';
import { createBudgetSchema, updateBudgetSchema } from '../validators/budget.validator.js';
import { AppError } from '../middleware/errorHandler.js';

export const getBudgets = async (
  req: AuthenticatedRequest,
  res: Response<ApiResponse>,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user?.id;
    if (!userId) return next(new AppError('Unauthorized', 401));

    const budgets = await BudgetService.getBudgets(userId);
    res.status(200).json({
      success: true,
      data: budgets,
    });
  } catch (err) {
    next(err);
  }
};

export const createBudget = async (
  req: AuthenticatedRequest,
  res: Response<ApiResponse>,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user?.id;
    if (!userId) return next(new AppError('Unauthorized', 401));

    const validated = createBudgetSchema.parse(req.body);
    const created = await BudgetService.createBudget(userId, validated);

    res.status(201).json({
      success: true,
      message: 'Budget category limit created',
      data: created,
    });
  } catch (err) {
    next(err);
  }
};

export const updateBudget = async (
  req: AuthenticatedRequest,
  res: Response<ApiResponse>,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user?.id;
    if (!userId) return next(new AppError('Unauthorized', 401));

    const id = String(req.params.id);
    const validated = updateBudgetSchema.parse(req.body);
    const updated = await BudgetService.updateBudget(userId, id, validated);

    res.status(200).json({
      success: true,
      message: 'Budget limit updated',
      data: updated,
    });
  } catch (err) {
    next(err);
  }
};

export const deleteBudget = async (
  req: AuthenticatedRequest,
  res: Response<ApiResponse>,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user?.id;
    if (!userId) return next(new AppError('Unauthorized', 401));

    const id = String(req.params.id);
    await BudgetService.deleteBudget(userId, id);

    res.status(200).json({
      success: true,
      message: 'Budget limit deleted',
    });
  } catch (err) {
    next(err);
  }
};

export const checkBudgetThresholds = async (
  req: AuthenticatedRequest,
  res: Response<ApiResponse>,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user?.id;
    if (!userId) return next(new AppError('Unauthorized', 401));

    const result = await BudgetService.checkThresholds(userId);
    res.status(200).json({
      success: true,
      message: `Budget check completed, ${result.alertedCount} notifications dispatched`,
      data: result,
    });
  } catch (err) {
    next(err);
  }
};
