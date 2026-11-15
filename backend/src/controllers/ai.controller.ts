import { Response, NextFunction } from 'express';
import { AuthenticatedRequest, ApiResponse } from '../types/index.js';
import { AIService } from '../services/ai.service.js';
import { z } from 'zod';

const askCoachSchema = z.object({
  query: z.string().min(1, { message: 'Query cannot be empty' }).max(2000),
  context: z.record(z.any()).optional(),
  history: z
    .array(
      z.object({
        role: z.enum(['user', 'assistant', 'model']),
        content: z.string(),
      })
    )
    .optional(),
});

export const getAIStatus = async (
  _req: AuthenticatedRequest,
  res: Response<ApiResponse>,
  next: NextFunction
): Promise<void> => {
  try {
    const status = AIService.getStatus();
    res.status(200).json({
      success: true,
      data: status,
    });
  } catch (err) {
    next(err);
  }
};

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
    const { query, context, history } = askCoachSchema.parse(req.body);
    const userId = req.user?.id || 'demo-user-id';
    const result = await AIService.askCoach(userId, query, context, history);

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (err) {
    next(err);
  }
};
