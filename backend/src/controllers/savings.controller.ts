import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../types/index.js';
import { SavingsService } from '../services/savings.service.js';
import { AppError } from '../middleware/errorHandler.js';

export const getGoals = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = req.user?.id;
    if (!userId) return next(new AppError('Unauthorized', 401));

    const goals = await SavingsService.getGoals(userId);
    res.json({ success: true, data: goals });
  } catch (err) {
    next(err);
  }
};

export const getGoalById = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = req.user?.id;
    if (!userId) return next(new AppError('Unauthorized', 401));

    const goal = await SavingsService.getGoalById(userId, req.params.id as string);
    res.json({ success: true, data: goal });
  } catch (err) {
    next(err);
  }
};

export const createGoal = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = req.user?.id;
    if (!userId) return next(new AppError('Unauthorized', 401));

    const goal = await SavingsService.createGoal(userId, req.body);
    res.status(201).json({ success: true, data: goal, message: 'Savings goal created successfully' });
  } catch (err) {
    next(err);
  }
};

export const updateGoal = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = req.user?.id;
    if (!userId) return next(new AppError('Unauthorized', 401));

    const goal = await SavingsService.updateGoal(userId, req.params.id as string, req.body);
    res.json({ success: true, data: goal, message: 'Savings goal updated successfully' });
  } catch (err) {
    next(err);
  }
};

export const deleteGoal = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = req.user?.id;
    if (!userId) return next(new AppError('Unauthorized', 401));

    const result = await SavingsService.deleteGoal(userId, req.params.id as string);
    res.json({ success: true, data: result, message: 'Savings goal deleted successfully' });
  } catch (err) {
    next(err);
  }
};

export const addContribution = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = req.user?.id;
    if (!userId) return next(new AppError('Unauthorized', 401));

    const result = await SavingsService.addContribution(userId, req.params.id as string, req.body);
    res.status(201).json({ success: true, data: result, message: 'Contribution added successfully' });
  } catch (err) {
    next(err);
  }
};

export const getContributions = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = req.user?.id;
    if (!userId) return next(new AppError('Unauthorized', 401));

    const contributions = await SavingsService.getContributions(userId, req.query.goalId as string);
    res.json({ success: true, data: contributions });
  } catch (err) {
    next(err);
  }
};
