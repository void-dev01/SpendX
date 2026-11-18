import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../types/index.js';
import { BudgetService } from '../services/budget.service.js';
import { AppError } from '../middleware/errorHandler.js';

export const getBudgets = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = req.user?.id;
    if (!userId) return next(new AppError('Unauthorized', 401));

    const monthYear = req.query.monthYear as string;
    const budgets = await BudgetService.getBudgets(userId, monthYear);
    res.json({ success: true, data: budgets });
  } catch (err) {
    next(err);
  }
};

export const createBudget = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = req.user?.id;
    if (!userId) return next(new AppError('Unauthorized', 401));

    const budget = await BudgetService.createBudget(userId, req.body);
    res.status(201).json({ success: true, data: budget, message: 'Budget created successfully' });
  } catch (err) {
    next(err);
  }
};

export const updateBudget = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = req.user?.id;
    if (!userId) return next(new AppError('Unauthorized', 401));

    const budget = await BudgetService.updateBudget(userId, req.params.id as string, req.body);
    res.json({ success: true, data: budget, message: 'Budget updated successfully' });
  } catch (err) {
    next(err);
  }
};

export const deleteBudget = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = req.user?.id;
    if (!userId) return next(new AppError('Unauthorized', 401));

    const result = await BudgetService.deleteBudget(userId, req.params.id as string);
    res.json({ success: true, data: result, message: 'Budget deleted successfully' });
  } catch (err) {
    next(err);
  }
};
