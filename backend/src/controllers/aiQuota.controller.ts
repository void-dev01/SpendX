import { Response, NextFunction } from 'express';
import { z } from 'zod';
import { AuthenticatedRequest } from '../types/index.js';
import { AIMessageQuotaService } from '../services/aiMessageQuota.service.js';
import { AppError } from '../middleware/errorHandler.js';

const queueMessageSchema = z.object({
  query: z.string().min(1, { message: 'Query cannot be empty' }).max(2000),
  sessionId: z.string().optional(),
});

const updateQueuedSchema = z.object({
  query: z.string().min(1, { message: 'Query cannot be empty' }).max(2000),
});

export const getAIQuota = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return next(new AppError('Unauthorized', 401));
    }

    const quota = await AIMessageQuotaService.getQuota(userId);
    res.status(200).json({
      success: true,
      data: quota,
    });
  } catch (err) {
    next(err);
  }
};

export const queueAIMessage = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return next(new AppError('Unauthorized', 401));
    }

    const validated = queueMessageSchema.parse(req.body);
    const queued = await AIMessageQuotaService.queueMessage(
      userId,
      validated.query,
      validated.sessionId
    );

    res.status(201).json({
      success: true,
      message: 'Message queued successfully for tomorrow',
      data: queued,
    });
  } catch (err) {
    next(err);
  }
};

export const getQueuedMessages = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return next(new AppError('Unauthorized', 401));
    }

    const list = await AIMessageQuotaService.getQueuedMessages(userId);
    res.status(200).json({
      success: true,
      data: list,
    });
  } catch (err) {
    next(err);
  }
};

export const updateQueuedMessage = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return next(new AppError('Unauthorized', 401));
    }

    const id = req.params.id as string;
    const validated = updateQueuedSchema.parse(req.body);
    const updated = await AIMessageQuotaService.updateQueuedMessage(userId, id, validated.query);

    if (!updated) {
      return next(new AppError('Queued message not found', 404));
    }

    res.status(200).json({
      success: true,
      message: 'Queued message updated successfully',
      data: updated,
    });
  } catch (err) {
    next(err);
  }
};

export const cancelQueuedMessage = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return next(new AppError('Unauthorized', 401));
    }

    const id = req.params.id as string;
    const success = await AIMessageQuotaService.cancelQueuedMessage(userId, id);

    if (!success) {
      return next(new AppError('Queued message not found or already cancelled', 404));
    }

    res.status(200).json({
      success: true,
      message: 'Queued message cancelled successfully',
    });
  } catch (err) {
    next(err);
  }
};
