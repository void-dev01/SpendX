import { Response, NextFunction } from 'express';
import { AuthenticatedRequest, ApiResponse } from '../types/index.js';
import { NotificationService } from '../services/notification.service.js';
import { AppError } from '../middleware/errorHandler.js';

export const getNotifications = async (
  req: AuthenticatedRequest,
  res: Response<ApiResponse>,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return next(new AppError('Unauthorized', 401));
    }

    const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 30;
    const notifications = await NotificationService.getUserNotifications(userId, limit);
    const unreadCount = await NotificationService.getUnreadCount(userId);

    res.status(200).json({
      success: true,
      data: {
        notifications,
        unreadCount,
      },
    });
  } catch (err) {
    next(err);
  }
};

export const markAsRead = async (
  req: AuthenticatedRequest,
  res: Response<ApiResponse>,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return next(new AppError('Unauthorized', 401));
    }

    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    if (!id) {
      return next(new AppError('Notification ID is required', 400));
    }

    const success = await NotificationService.markAsRead(userId, id);

    res.status(200).json({
      success: true,
      message: success ? 'Notification marked as read' : 'Notification not found',
    });
  } catch (err) {
    next(err);
  }
};
