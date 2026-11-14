import { Response, NextFunction } from 'express';
import { AuthenticatedRequest, ApiResponse } from '../types/index.js';
import { AIService } from '../services/ai.service.js';
import { z } from 'zod';

const askCoachSchema = z.object({
  query: z.string().min(2, { message: 'Query must be at least 2 characters long' }).max(500),
});

export const getInsights = async (
  req: AuthenticatedRequest,
  res: Response<ApiResponse>,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user?.id || 'demo-user-id';
    const mockSummary = { Groceries: 450, Dining: 230, Utilities: 180, Transportation: 120 };
    const insights = await AIService.generateInsights(userId, mockSummary);

    res.status(200).json({
      success: true,
      message: 'Financial insights generated successfully',
      data: insights,
    });
  } catch (err) {
    next(err);
  }
};

export const askCoach = async (
  req: AuthenticatedRequest,
  res: Response<ApiResponse>,
  next: NextFunction
): Promise<void> => {
  try {
    const { query } = askCoachSchema.parse(req.body);
    const userId = req.user?.id || 'demo-user-id';
    const response = await AIService.askCoach(userId, query);

    res.status(200).json({
      success: true,
      data: { answer: response },
    });
  } catch (err) {
    next(err);
  }
};
