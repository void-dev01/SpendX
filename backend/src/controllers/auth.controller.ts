import crypto from 'crypto';
import { Request, Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../types/index.js';
import { supabaseAdminClient, supabaseClient } from '../config/supabase.js';
import { AppError } from '../middleware/errorHandler.js';
import { localStore } from '../db/localStore.js';
import { registerSchema, loginSchema } from '../validators/auth.validator.js';

function hashPassword(password: string, salt: string): string {
  return crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
}

function generateSessionToken(user: { id: string; email: string }): string {
  const payload = Buffer.from(JSON.stringify({ id: user.id, email: user.email, t: Date.now() })).toString('base64url');
  const sig = crypto.createHmac('sha256', 'spendx-secret-key').update(payload).digest('hex').slice(0, 16);
  return `spendx_session_${payload}_${sig}`;
}

export const register = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const parseResult = registerSchema.safeParse(req.body);
    if (!parseResult.success) {
      return next(new AppError(parseResult.error.errors[0]?.message || 'Invalid registration details', 400));
    }

    const { email, password, fullName } = parseResult.data;
    const trimmedEmail = email.trim().toLowerCase();

    if (supabaseAdminClient && process.env.NODE_ENV !== 'test') {
      const { data, error } = await supabaseAdminClient.auth.admin.createUser({
        email: trimmedEmail,
        password,
        user_metadata: { full_name: fullName.trim() },
        email_confirm: true,
      });

      if (error) {
        return next(new AppError(error.message, 400));
      }

      if (data.user) {
        await supabaseAdminClient.from('profiles').upsert({
          id: data.user.id,
          email: trimmedEmail,
          full_name: fullName.trim(),
          currency: 'INR',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        });

        if (supabaseClient && process.env.NODE_ENV !== 'test') {
          const signInRes = await supabaseClient.auth.signInWithPassword({
            email: trimmedEmail,
            password,
          });
          const token = signInRes.data.session?.access_token || `spendx_session_${data.user.id}`;
          res.status(201).json({
            success: true,
            user: {
              id: data.user.id,
              email: trimmedEmail,
              fullName: fullName.trim(),
              currency: 'INR',
            },
            token,
          });
          return;
        }
      }
    }

    // Local / In-memory store
    const db = localStore.read();
    const existing = db.users.find((u) => u.email.toLowerCase() === trimmedEmail);
    if (existing) {
      return next(new AppError('An account with this email already exists. Please sign in.', 409));
    }

    const salt = crypto.randomBytes(16).toString('hex');
    const passwordHash = hashPassword(password, salt);
    const userId = 'usr_' + crypto.randomUUID().replace(/-/g, '').slice(0, 12);
    const now = new Date().toISOString();

    const newUser = {
      id: userId,
      email: trimmedEmail,
      fullName: fullName.trim(),
      currency: 'INR',
      passwordHash,
      salt,
      createdAt: now,
      updatedAt: now,
    };

    db.users.push(newUser);
    localStore.write(db);

    const token = generateSessionToken(newUser);

    res.status(201).json({
      success: true,
      user: {
        id: newUser.id,
        email: newUser.email,
        fullName: newUser.fullName,
        currency: newUser.currency,
      },
      token,
      message: 'Account registered successfully',
    });
  } catch (err) {
    next(err);
  }
};

export const login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const parseResult = loginSchema.safeParse(req.body);
    if (!parseResult.success) {
      return next(new AppError(parseResult.error.errors[0]?.message || 'Invalid credentials', 400));
    }

    const { email, password } = parseResult.data;
    const trimmedEmail = email.trim().toLowerCase();

    if (supabaseClient && process.env.NODE_ENV !== 'test') {
      const { data, error } = await supabaseClient.auth.signInWithPassword({
        email: trimmedEmail,
        password,
      });

      if (error || !data.user || !data.session) {
        return next(new AppError(error?.message || 'Invalid email or password', 401));
      }

      res.json({
        success: true,
        user: {
          id: data.user.id,
          email: data.user.email || trimmedEmail,
          fullName: data.user.user_metadata?.full_name || trimmedEmail.split('@')[0],
          currency: 'INR',
        },
        token: data.session.access_token,
      });
      return;
    }

    // Local / In-memory store validation
    const db = localStore.read();
    const user = db.users.find((u) => u.email.toLowerCase() === trimmedEmail);

    if (!user) {
      return next(new AppError('No account found with this email. Please sign up first.', 401));
    }

    if (!user.passwordHash || !user.salt) {
      return next(new AppError('Invalid credentials. Please reset your password or sign up.', 401));
    }

    const computedHash = hashPassword(password, user.salt);
    if (computedHash !== user.passwordHash) {
      return next(new AppError('Invalid password. Please check your credentials.', 401));
    }

    const token = generateSessionToken(user);

    res.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        currency: user.currency || 'INR',
      },
      token,
      message: 'Signed in successfully',
    });
  } catch (err) {
    next(err);
  }
};

export const getMe = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return next(new AppError('Unauthorized', 401));
    }

    if (!supabaseAdminClient) {
      const db = localStore.read();
      const localUser = db.users.find((u) => u.id === userId || u.email.toLowerCase() === req.user?.email?.toLowerCase());
      res.json({
        success: true,
        data: {
          id: userId,
          email: req.user?.email || localUser?.email || 'user@spendx.local',
          fullName: localUser?.fullName || req.user?.email?.split('@')[0] || 'User',
          currency: localUser?.currency || 'INR',
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
      const db = localStore.read();
      const localUser = db.users.find((u) => u.id === userId || u.email.toLowerCase() === req.user?.email?.toLowerCase());
      if (localUser) {
        if (fullName !== undefined) localUser.fullName = fullName;
        if (currency !== undefined) localUser.currency = currency;
        localUser.updatedAt = new Date().toISOString();
        localStore.write(db);
      }
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

export const deleteMe = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return next(new AppError('Unauthorized', 401));
    }

    if (supabaseAdminClient && process.env.NODE_ENV !== 'test') {
      await supabaseAdminClient.from('profiles').delete().eq('id', userId);
      const { error } = await supabaseAdminClient.auth.admin.deleteUser(userId);
      if (error) {
        return next(new AppError('Failed to delete account: ' + error.message, 500));
      }
    } else {
      const db = localStore.read();
      db.users = db.users.filter((u) => u.id !== userId && u.email.toLowerCase() !== req.user?.email?.toLowerCase());
      db.accounts = db.accounts.filter((a) => a.userId !== userId);
      db.transactions = db.transactions.filter((t) => t.userId !== userId);
      db.budgets = db.budgets.filter((b) => b.userId !== userId);
      db.savingsGoals = db.savingsGoals.filter((s) => s.userId !== userId);
      localStore.write(db);
    }

    res.json({
      success: true,
      message: 'Account and all associated financial records permanently deleted',
    });
  } catch (err) {
    next(err);
  }
};
