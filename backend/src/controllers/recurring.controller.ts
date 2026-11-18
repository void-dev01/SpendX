import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../types/index.js';
import { RecurringService } from '../services/recurring.service.js';
import { AppError } from '../middleware/errorHandler.js';

export const getRecurringPayments = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = req.user?.id;
    if (!userId) return next(new AppError('Unauthorized', 401));

    const data = await RecurringService.getRecurringPayments(userId);
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
};

export const getById = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = req.user?.id;
    if (!userId) return next(new AppError('Unauthorized', 401));

    const item = await RecurringService.getById(userId, req.params.id as string);
    res.json({ success: true, data: item });
  } catch (err) {
    next(err);
  }
};

export const create = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = req.user?.id;
    if (!userId) return next(new AppError('Unauthorized', 401));

    const item = await RecurringService.create(userId, req.body);
    res.status(201).json({ success: true, data: item, message: 'Recurring payment created successfully' });
  } catch (err) {
    next(err);
  }
};

export const update = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = req.user?.id;
    if (!userId) return next(new AppError('Unauthorized', 401));

    const item = await RecurringService.update(userId, req.params.id as string, req.body);
    res.json({ success: true, data: item, message: 'Recurring payment updated successfully' });
  } catch (err) {
    next(err);
  }
};

export const updateStatus = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = req.user?.id;
    if (!userId) return next(new AppError('Unauthorized', 401));

    const item = await RecurringService.updateStatus(userId, req.params.id as string, req.body.status);
    res.json({ success: true, data: item, message: 'Status updated successfully' });
  } catch (err) {
    next(err);
  }
};

export const remove = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = req.user?.id;
    if (!userId) return next(new AppError('Unauthorized', 401));

    const result = await RecurringService.delete(userId, req.params.id as string);
    res.json({ success: true, data: result, message: 'Recurring payment deleted successfully' });
  } catch (err) {
    next(err);
  }
};
