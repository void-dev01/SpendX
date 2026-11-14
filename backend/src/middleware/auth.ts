import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../types/index.js';
import { AppError } from './errorHandler.js';
import { supabaseClient } from '../config/supabase.js';

export const requireAuth = async (
  req: AuthenticatedRequest,
  _res: Response,
  next: NextFunction
): Promise<void> => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next(new AppError('Authentication required: Missing or invalid authorization token', 401));
  }

  const token = authHeader.split(' ')[1];

  if (!supabaseClient) {
    // If Supabase is not yet configured with live credentials, handle safely
    return next(new AppError('Authentication service currently unconfigured', 503));
  }

  try {
    const { data: { user }, error } = await supabaseClient.auth.getUser(token);

    if (error || !user) {
      return next(new AppError('Invalid or expired authentication session', 401));
    }

    req.user = {
      id: user.id,
      email: user.email || '',
      role: user.role,
    };

    next();
  } catch {
    next(new AppError('Authentication verification failed', 500));
  }
};
