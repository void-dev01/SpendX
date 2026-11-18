import { Response, NextFunction } from 'express';
import { AuthenticatedRequest, ApiResponse } from '../types/index.js';
import { ImportService } from '../services/import.service.js';
import { validateBatchSchema, commitBatchSchema } from '../validators/import.validator.js';
import { AppError } from '../middleware/errorHandler.js';

export const validateBatch = async (
  req: AuthenticatedRequest,
  res: Response<ApiResponse>,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user?.id;
    if (!userId) return next(new AppError('Unauthorized', 401));

    const { items } = validateBatchSchema.parse(req.body);
    const result = await ImportService.validateBatch(userId, items);

    res.status(200).json({
      success: true,
      message: 'Batch validation complete',
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

export const commitBatch = async (
  req: AuthenticatedRequest,
  res: Response<ApiResponse>,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user?.id;
    if (!userId) return next(new AppError('Unauthorized', 401));

    const { source, fileName, items } = commitBatchSchema.parse(req.body);
    const result = await ImportService.commitBatch(userId, source, fileName, items);

    res.status(201).json({
      success: true,
      message: `Successfully imported ${result.insertedCount} transactions, skipped ${result.duplicateCount} duplicates`,
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

export const getImportHistory = async (
  req: AuthenticatedRequest,
  res: Response<ApiResponse>,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user?.id;
    if (!userId) return next(new AppError('Unauthorized', 401));

    const history = await ImportService.getHistory(userId);
    res.status(200).json({
      success: true,
      data: history,
    });
  } catch (err) {
    next(err);
  }
};
