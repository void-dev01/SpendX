import { Response, NextFunction } from 'express';
import { AuthenticatedRequest, ApiResponse } from '../types/index.js';
import { AIService } from '../services/ai.service.js';
import { AIModelRegistry } from '../services/ai/ai.registry.js';
import { supabaseAdminClient } from '../config/supabase.js';
import { z } from 'zod';

const askCoachSchema = z.object({
  query: z.string().min(1, { message: 'Query cannot be empty' }).max(2000),
  sessionId: z.string().optional(),
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

export const getEligibleModels = async (
  _req: AuthenticatedRequest,
  res: Response<ApiResponse>,
  next: NextFunction
): Promise<void> => {
  try {
    const models = AIModelRegistry.getEligibleModels();
    res.status(200).json({
      success: true,
      data: models,
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
    const insights = await AIService.generateInsights(userId);

    // Also fetch any existing active insights from Supabase DB
    let storedInsights: any[] = [];
    if (supabaseAdminClient) {
      const { data } = await supabaseAdminClient
        .from('financial_insights')
        .select('*')
        .eq('user_id', userId)
        .eq('is_dismissed', false)
        .order('generated_at', { ascending: false });
      storedInsights = data || [];
    }

    res.status(200).json({
      success: true,
      message: 'Financial insights generated successfully',
      data: storedInsights.length > 0 ? storedInsights : insights,
    });
  } catch (err) {
    next(err);
  }
};

export const bookmarkInsight = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user?.id;
    const { id } = req.params;
    const { isBookmarked } = req.body;

    if (supabaseAdminClient && userId) {
      await supabaseAdminClient
        .from('financial_insights')
        .update({ is_bookmarked: Boolean(isBookmarked) })
        .eq('id', id)
        .eq('user_id', userId);
    }

    res.json({ success: true, message: 'Insight bookmark status updated' });
  } catch (err) {
    next(err);
  }
};

export const dismissInsight = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user?.id;
    const { id } = req.params;

    if (supabaseAdminClient && userId) {
      await supabaseAdminClient
        .from('financial_insights')
        .update({ is_dismissed: true })
        .eq('id', id)
        .eq('user_id', userId);
    }

    res.json({ success: true, message: 'Insight dismissed' });
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
    const validated = askCoachSchema.parse(req.body);
    const userId = req.user?.id || 'demo-user-id';

    const response = await AIService.askCoach(
      userId,
      validated.query,
      validated.context,
      validated.history,
      validated.sessionId
    );

    res.status(200).json({
      success: true,
      data: response,
    });
  } catch (err) {
    next(err);
  }
};

export const getSessions = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    const sessions = await AIService.getChatSessions(userId);
    res.json({ success: true, data: sessions });
  } catch (err) {
    next(err);
  }
};

export const getSessionMessages = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    const messages = await AIService.getSessionMessages(userId, req.params.id as string);
    res.json({ success: true, data: messages });
  } catch (err) {
    next(err);
  }
};

export const deleteSession = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    const result = await AIService.deleteChatSession(userId, req.params.id as string);
    res.json(result);
  } catch (err) {
    next(err);
  }
};
