import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../types/index.js';
import { ImportService } from '../services/import.service.js';
import { AppError } from '../middleware/errorHandler.js';

export const commitBatch = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = req.user?.id;
    if (!userId) return next(new AppError('Unauthorized', 401));

    const result = await ImportService.commitBatch(userId, req.body);
    res.status(201).json({ success: true, data: result, message: 'Batch imported successfully' });
  } catch (err) {
    next(err);
  }
};

export const getCaptureHistory = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = req.user?.id;
    if (!userId) return next(new AppError('Unauthorized', 401));

    const history = await ImportService.getCaptureHistory(userId);
    res.json({ success: true, data: history });
  } catch (err) {
    next(err);
  }
};
