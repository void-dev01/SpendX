import { Response, NextFunction } from 'express';
import { AuthenticatedRequest, ApiResponse } from '../types/index.js';
import { createTransactionSchema } from '../validators/transaction.validator.js';
import { TransactionService } from '../services/transaction.service.js';
import { AppError } from '../middleware/errorHandler.js';

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
