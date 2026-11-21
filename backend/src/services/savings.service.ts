import crypto from 'crypto';
import { getDbClient } from '../config/supabase.js';
import { AppError } from '../middleware/errorHandler.js';
import { logger } from '../utils/logger.js';
import { NotificationService } from './notification.service.js';
import { localStore, RawSavingsGoal } from '../db/localStore.js';

export interface SavingsGoalRecord {
  id: string;
  userId: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  remainingAmount: number;
  progressPercentage: number;
  targetDate: string;
  category: string;
  status: 'IN_PROGRESS' | 'COMPLETED';
  createdAt: string;
  updatedAt: string;
}

export class SavingsService {
  public static async getGoals(userId: string): Promise<SavingsGoalRecord[]> {
    const db = getDbClient();
    if (db && process.env.NODE_ENV !== 'test') {
      try {
        const { data, error } = await db
          .from('savings_goals')
          .select('*')
          .eq('user_id', userId)
          .order('created_at', { ascending: false });

        if (!error && data && data.length > 0) {
          return data.map((g: any) => {
            const target = Number(g.target_amount || g.targetAmount) || 0;
            const current = Number(g.current_amount || g.currentAmount) || 0;
            const remainingAmount = Math.max(0, Math.round((target - current) * 100) / 100);
            const progressPercentage = target > 0 ? Math.min(100, Math.round((current / target) * 100)) : 0;
            const status = progressPercentage >= 100 ? 'COMPLETED' : 'IN_PROGRESS';

            return {
              id: g.id,
              userId: g.user_id || g.userId,
              name: g.name,
              targetAmount: target,
              currentAmount: current,
              remainingAmount,
              progressPercentage,
              targetDate: g.target_date || g.targetDate || new Date().toISOString(),
              category: g.category || 'General',
              status,
              createdAt: g.created_at || g.createdAt,
              updatedAt: g.updated_at || g.updatedAt,
            };
          });
        }
      } catch (err) {
        logger.warn({ err }, 'Supabase getGoals failed, falling back to localStore');
      }
    }

    // LocalStore fallback
    const rawList = localStore.getSavingsGoals().filter((g) => g.userId === userId);
    return rawList.map((g) => {
      const target = Number(g.targetAmount) || 0;
      const current = Number(g.currentAmount) || 0;
      const remainingAmount = Math.max(0, Math.round((target - current) * 100) / 100);
      const progressPercentage = target > 0 ? Math.min(100, Math.round((current / target) * 100)) : 0;
      const status: 'IN_PROGRESS' | 'COMPLETED' = progressPercentage >= 100 ? 'COMPLETED' : 'IN_PROGRESS';

      return {
        id: g.id,
        userId: g.userId,
        name: g.name,
        targetAmount: target,
        currentAmount: current,
        remainingAmount,
        progressPercentage,
        targetDate: g.targetDate,
        category: g.category || 'General',
        status,
        createdAt: g.createdAt,
        updatedAt: g.updatedAt,
      };
    });
  }

  public static async createGoal(
    userId: string,
    data: { name: string; targetAmount: number; currentAmount?: number; targetDate: string; category?: string }
  ): Promise<SavingsGoalRecord> {
    const currentAmount = Math.round(Number(data.currentAmount || 0) * 100) / 100;
    const targetAmount = Math.round(Number(data.targetAmount) * 100) / 100;
    if (isNaN(targetAmount) || targetAmount <= 0) {
      throw new AppError('Target amount must be a positive number', 400);
    }
    const category = data.category || 'General';
    const goalId = crypto.randomUUID();

    const db = getDbClient();
    if (db && process.env.NODE_ENV !== 'test') {
      try {
        await db.from('savings_goals').insert({
          id: goalId,
          user_id: userId,
          name: data.name,
          target_amount: targetAmount,
          current_amount: currentAmount,
          target_date: data.targetDate,
          category,
          status: 'ACTIVE',
        });
      } catch (err) {
        logger.warn({ err }, 'Supabase createGoal failed, saving to localStore');
      }
    }

    // Always persist to localStore
    const item: RawSavingsGoal = {
      id: goalId,
      userId,
      name: data.name,
      targetAmount,
      currentAmount,
      targetDate: data.targetDate,
      category,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    const goals = localStore.getSavingsGoals();
    goals.unshift(item);
    localStore.saveSavingsGoals(goals);

    const progressPercentage = Math.min(100, Math.round((currentAmount / targetAmount) * 100));
    return {
      ...item,
      remainingAmount: Math.max(0, targetAmount - currentAmount),
      progressPercentage,
      status: progressPercentage >= 100 ? 'COMPLETED' : 'IN_PROGRESS',
    };
  }

  public static async updateGoal(
    userId: string,
    id: string,
    updates: { name?: string; targetAmount?: number; currentAmount?: number; targetDate?: string; category?: string }
  ): Promise<SavingsGoalRecord> {
    const db = getDbClient();
    if (db && process.env.NODE_ENV !== 'test') {
      try {
        const payload: Record<string, unknown> = { updated_at: new Date().toISOString() };
        if (updates.name) payload.name = updates.name;
        if (updates.targetAmount !== undefined) payload.target_amount = Number(updates.targetAmount);
        if (updates.currentAmount !== undefined) payload.current_amount = Number(updates.currentAmount);
        if (updates.targetDate) payload.target_date = updates.targetDate;
        if (updates.category) payload.category = updates.category;

        await db.from('savings_goals').update(payload).eq('id', id).eq('user_id', userId);
      } catch (err) {
        logger.warn({ err }, 'Supabase updateGoal failed');
      }
    }

    const goals = localStore.getSavingsGoals();
    const idx = goals.findIndex((g) => g.id === id && g.userId === userId);
    if (idx === -1) throw new AppError('Savings goal not found', 404);

    goals[idx] = {
      ...goals[idx],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    localStore.saveSavingsGoals(goals);

    const g = goals[idx];
    const target = Number(g.targetAmount);
    const current = Number(g.currentAmount);
    const progressPercentage = target > 0 ? Math.min(100, Math.round((current / target) * 100)) : 0;
    return {
      ...g,
      targetAmount: target,
      currentAmount: current,
      remainingAmount: Math.max(0, target - current),
      progressPercentage,
      status: progressPercentage >= 100 ? 'COMPLETED' : 'IN_PROGRESS',
    };
  }

  public static async deleteGoal(userId: string, id: string): Promise<void> {
    const db = getDbClient();
    if (db && process.env.NODE_ENV !== 'test') {
      try {
        await db.from('savings_goals').delete().eq('id', id).eq('user_id', userId);
      } catch (err) {
        logger.warn({ err }, 'Supabase deleteGoal failed');
      }
    }

    const goals = localStore.getSavingsGoals();
    const idx = goals.findIndex((g) => g.id === id && g.userId === userId);
    if (idx !== -1) {
      goals.splice(idx, 1);
      localStore.saveSavingsGoals(goals);
    }
  }

  public static async recordContribution(
    userId: string,
    id: string,
    amount: number,
    notes?: string
  ): Promise<{ goal: SavingsGoalRecord; milestoneCelebrated: boolean; contribution: any }> {
    const numAmount = Math.round(Number(amount) * 100) / 100;
    if (isNaN(numAmount) || numAmount <= 0) {
      throw new AppError('Contribution amount must be positive', 400);
    }

    const goals = await this.getGoals(userId);
    const existing = goals.find((g) => g.id === id);
    if (!existing) throw new AppError('Savings goal not found', 404);

    const previousPercentage = existing.progressPercentage;
    const newCurrent = existing.currentAmount + numAmount;
    const updated = await this.updateGoal(userId, id, { currentAmount: newCurrent });
    const newPercentage = updated.progressPercentage;

    const db = getDbClient();
    if (db && process.env.NODE_ENV !== 'test') {
      try {
        await db.from('savings_contributions').insert({
          goal_id: id,
          user_id: userId,
          amount: numAmount,
          notes: notes || 'Goal top-up contribution',
        });
      } catch (cErr) {
        logger.warn({ cErr }, 'Failed to insert contribution record');
      }
    }

    let milestoneCelebrated = false;
    if (previousPercentage < 50 && newPercentage >= 50) {
      await NotificationService.createNotification(
        userId,
        'SAVINGS_MILESTONE',
        `Halfway Milestone Reached! 🌟`,
        `Congratulations! You've achieved 50% of your "${existing.name}" savings target!`,
        '/savings'
      );
      milestoneCelebrated = true;
    } else if (previousPercentage < 100 && newPercentage >= 100) {
      await NotificationService.createNotification(
        userId,
        'SAVINGS_MILESTONE',
        `Goal Completed! 🏆`,
        `Amazing dedication! You've completely funded your "${existing.name}" goal!`,
        '/savings'
      );
      milestoneCelebrated = true;
    }

    const contributionRecord = {
      id: `contrib_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      goalId: id,
      userId,
      amount: numAmount,
      notes: notes || 'Goal top-up contribution',
      createdAt: new Date().toISOString(),
    };

    return { goal: updated, milestoneCelebrated, contribution: contributionRecord };
  }
}
