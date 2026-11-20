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

  // In test environment, handle mock tokens strictly
  if (process.env.NODE_ENV === 'test') {
    if (token.startsWith('test-token-') || token === 'test-token') {
      const mockUserId = token.startsWith('test-token-') ? token.replace('test-token-', '') || 'test-user-id' : 'test-user-id';
      req.user = {
        id: mockUserId,
        email: `${mockUserId}@spendx.local`,
        role: 'authenticated',
      };
      return next();
    } else {
      return next(new AppError('Invalid or expired authentication session', 401));
    }
  }

  // In local development mode, allow explicit dev tokens or frontend demo session tokens
  if (process.env.NODE_ENV !== 'production' && (token === 'spendx-dev-token' || token.startsWith('spendx_session_'))) {
    let resolvedId = '00000000-0000-4000-8000-000000000001';
    let resolvedEmail = 'developer@spendx.local';

    const parts = token.split('_');
    // Format: spendx_session_<base64payload>_<sig>
    if (parts.length >= 3) {
      try {
        const payloadJson = Buffer.from(parts[2], 'base64url').toString('utf-8');
        const parsed = JSON.parse(payloadJson);
        if (parsed.id && parsed.email) {
          resolvedId = parsed.id;
          resolvedEmail = parsed.email;
        }
      } catch {
        // keep fallback
      }
    }

    req.user = {
      id: resolvedId,
      email: resolvedEmail,
      role: 'authenticated',
    };
    return next();
  }

  if (!supabaseClient) {
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
