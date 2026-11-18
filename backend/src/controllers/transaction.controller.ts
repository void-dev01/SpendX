import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../types/index.js';
import { TransactionService } from '../services/transaction.service.js';
import { AppError } from '../middleware/errorHandler.js';

export const getTransactions = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = req.user?.id;
    if (!userId) return next(new AppError('Unauthorized', 401));

    const options = {
      page: req.query.page ? parseInt(req.query.page as string, 10) : 1,
      limit: req.query.limit ? parseInt(req.query.limit as string, 10) : 20,
      search: req.query.search as string,
      type: req.query.type as any,
      category: req.query.category as string,
      accountId: req.query.accountId as string,
      startDate: req.query.startDate as string,
      endDate: req.query.endDate as string,
      sortBy: req.query.sortBy as any,
      sortOrder: req.query.sortOrder as any,
    };

    const result = await TransactionService.getTransactions(userId, options);
    res.json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
};

export const getTransactionById = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = req.user?.id;
    if (!userId) return next(new AppError('Unauthorized', 401));

    const transaction = await TransactionService.getTransactionById(userId, req.params.id as string);
    res.json({ success: true, data: transaction });
  } catch (err) {
    next(err);
  }
};

export const createTransaction = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = req.user?.id;
    if (!userId) return next(new AppError('Unauthorized', 401));

    const transaction = await TransactionService.createTransaction(userId, req.body);
    res.status(201).json({
      success: true,
      data: transaction,
      message: 'Transaction recorded successfully',
    });
  } catch (err) {
    next(err);
  }
};

export const updateTransaction = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = req.user?.id;
    if (!userId) return next(new AppError('Unauthorized', 401));

    const transaction = await TransactionService.updateTransaction(userId, req.params.id as string, req.body);
    res.json({
      success: true,
      data: transaction,
      message: 'Transaction updated successfully',
    });
  } catch (err) {
    next(err);
  }
};

export const deleteTransaction = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = req.user?.id;
    if (!userId) return next(new AppError('Unauthorized', 401));

    const result = await TransactionService.deleteTransaction(userId, req.params.id as string);
    res.json({
      success: true,
      data: result,
      message: 'Transaction deleted successfully',
    });
  } catch (err) {
    next(err);
  }
};
