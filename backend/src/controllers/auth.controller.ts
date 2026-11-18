import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../types/index.js';
import { supabaseAdminClient } from '../config/supabase.js';
import { AppError } from '../middleware/errorHandler.js';

export const getMe = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return next(new AppError('Unauthorized', 401));
    }

    if (!supabaseAdminClient) {
      res.json({
        success: true,
        data: {
          id: userId,
          email: req.user?.email,
          fullName: 'Developer',
          currency: 'INR',
        },
      });
      return;
    }

    const { data: profile, error } = await supabaseAdminClient
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error || !profile) {
      // Return basic user info from auth
      res.json({
        success: true,
        data: {
          id: userId,
          email: req.user?.email,
          fullName: req.user?.email?.split('@')[0] || 'User',
          currency: 'INR',
        },
      });
      return;
    }

    res.json({
      success: true,
      data: {
        id: profile.id,
        email: profile.email,
        fullName: profile.full_name,
        currency: profile.currency || 'INR',
        avatarUrl: profile.avatar_url,
        createdAt: profile.created_at,
        updatedAt: profile.updated_at,
      },
    });
  } catch (err) {
    next(err);
  }
};

export const updateMe = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return next(new AppError('Unauthorized', 401));
    }

    const { fullName, currency, avatarUrl } = req.body;

    if (!supabaseAdminClient) {
      res.json({ success: true, message: 'Profile updated' });
      return;
    }

    const updateObj: Record<string, any> = { updated_at: new Date().toISOString() };
    if (fullName !== undefined) updateObj.full_name = fullName;
    if (currency !== undefined) updateObj.currency = currency;
    if (avatarUrl !== undefined) updateObj.avatar_url = avatarUrl;

    const { data, error } = await supabaseAdminClient
      .from('profiles')
      .update(updateObj)
      .eq('id', userId)
      .select()
      .single();

    if (error) {
      return next(new AppError('Failed to update profile: ' + error.message, 400));
    }

    res.json({
      success: true,
      data,
      message: 'Profile updated successfully',
    });
  } catch (err) {
    next(err);
  }
};
