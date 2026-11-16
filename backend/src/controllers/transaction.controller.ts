import { Response, NextFunction } from 'express';
import { AuthenticatedRequest, ApiResponse } from '../types/index.js';
import {
  createTransactionSchema,
  updateTransactionSchema,
  queryTransactionsSchema,
} from '../validators/transaction.validator.js';
import { TransactionService } from '../services/transaction.service.js';
import { AppError } from '../middleware/errorHandler.js';
import { z } from 'zod';

const batchImportSchema = z.object({
  items: z.array(createTransactionSchema).min(1, 'At least one transaction is required for batch import'),
});

export const createTransaction = async (
  req: AuthenticatedRequest,
  res: Response<ApiResponse>,
  next: NextFunction
): Promise<void> => {
  try {
    const validatedData = createTransactionSchema.parse(req.body);
    const userId = req.user?.id;

    if (!userId) {
      return next(new AppError('Unauthorized: User identity could not be verified', 401));
    }

    const transaction = await TransactionService.createTransaction(userId, validatedData);

    res.status(201).json({
      success: true,
      message: 'Transaction recorded successfully',
      data: transaction,
    });
  } catch (err) {
    next(err);
  }
};

export const getTransactions = async (
  req: AuthenticatedRequest,
  res: Response<ApiResponse>,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user?.id;
    if (!userId) return next(new AppError('Unauthorized', 401));

    const parsedQuery = queryTransactionsSchema.parse(req.query);
    const search = typeof req.query.search === 'string' ? req.query.search : undefined;

    const result = await TransactionService.getTransactions(userId, {
      ...parsedQuery,
      search,
    });

    res.status(200).json({
      success: true,
      data: result.transactions,
      meta: {
        page: result.page,
        limit: result.limit,
        total: result.total,
      },
    });
  } catch (err) {
    next(err);
  }
};

export const getTransactionById = async (
  req: AuthenticatedRequest,
  res: Response<ApiResponse>,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user?.id;
    if (!userId) return next(new AppError('Unauthorized', 401));

    const id = String(req.params.id);
    const transaction = await TransactionService.getTransactionById(userId, id);

    res.status(200).json({
      success: true,
      data: transaction,
    });
  } catch (err) {
    next(err);
  }
};

export const updateTransaction = async (
  req: AuthenticatedRequest,
  res: Response<ApiResponse>,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user?.id;
    if (!userId) return next(new AppError('Unauthorized', 401));

    const id = String(req.params.id);
    const validatedData = updateTransactionSchema.parse(req.body);

    const updated = await TransactionService.updateTransaction(userId, id, validatedData);

    res.status(200).json({
      success: true,
      message: 'Transaction updated successfully',
      data: updated,
    });
  } catch (err) {
    next(err);
  }
};

export const deleteTransaction = async (
  req: AuthenticatedRequest,
  res: Response<ApiResponse>,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user?.id;
    if (!userId) return next(new AppError('Unauthorized', 401));

    const id = String(req.params.id);
    await TransactionService.deleteTransaction(userId, id);

    res.status(200).json({
      success: true,
      message: 'Transaction deleted successfully',
    });
  } catch (err) {
    next(err);
  }
};

export const batchImportTransactions = async (
  req: AuthenticatedRequest,
  res: Response<ApiResponse>,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user?.id;
    if (!userId) return next(new AppError('Unauthorized', 401));

    const { items } = batchImportSchema.parse(req.body);
    const result = await TransactionService.batchCreateTransactions(userId, items);

    res.status(201).json({
      success: true,
      message: `Batch import complete: ${result.inserted} inserted, ${result.duplicates} duplicates skipped`,
      data: result,
    });
  } catch (err) {
    next(err);
  }
};
