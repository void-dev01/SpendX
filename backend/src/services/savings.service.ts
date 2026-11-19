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
    if (process.env.NODE_ENV === 'test') {
      const rawList = localStore.getSavingsGoals().filter((g) => g.userId === userId || userId === 'usr_dev_local_spendx');

      return rawList.map((g) => {
        const remainingAmount = Math.max(0, g.targetAmount - g.currentAmount);
        const progressPercentage = g.targetAmount > 0 ? Math.min(100, Math.round((g.currentAmount / g.targetAmount) * 100)) : 0;
        const status = progressPercentage >= 100 ? 'COMPLETED' : 'IN_PROGRESS';

        return {
          ...g,
          remainingAmount,
          progressPercentage,
          status,
        };
      });
    }

    const db = getDbClient();
    if (db) {
      try {
        const { data, error } = await db
          .from('savings_goals')
          .select('*')
          .eq('user_id', userId)
          .order('created_at', { ascending: false });

        if (error) {
          logger.error({ error }, 'Failed to fetch savings goals from Supabase');
          throw new AppError('Failed to fetch savings goals', 500);
        }

        return (data || []).map((g: any) => {
          const target = Number(g.target_amount) || 0;
          const current = Number(g.current_amount) || 0;
          const remainingAmount = Math.max(0, Math.round((target - current) * 100) / 100);
          const progressPercentage = target > 0 ? Math.min(100, Math.round((current / target) * 100)) : 0;
          const status = progressPercentage >= 100 ? 'COMPLETED' : 'IN_PROGRESS';

          return {
            id: g.id,
            userId: g.user_id,
            name: g.name,
            targetAmount: target,
            currentAmount: current,
            remainingAmount,
            progressPercentage,
            targetDate: g.target_date || new Date().toISOString(),
            category: g.category || 'General',
            status,
            createdAt: g.created_at,
            updatedAt: g.updated_at,
          };
        });
      } catch (err) {
        if (err instanceof AppError) throw err;
        logger.error({ err }, 'Exception fetching savings goals');
        return [];
      }
    }

    return [];
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

    if (process.env.NODE_ENV === 'test') {
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
      goals.push(item);
      localStore.saveSavingsGoals(goals);
      const progressPercentage = Math.min(100, Math.round((currentAmount / targetAmount) * 100));
      return {
        ...item,
        remainingAmount: Math.max(0, targetAmount - currentAmount),
        progressPercentage,
        status: progressPercentage >= 100 ? 'COMPLETED' : 'IN_PROGRESS',
      };
    }

    const db = getDbClient();
    if (db) {
      const { data: record, error } = await db
        .from('savings_goals')
        .insert({
          id: goalId,
          user_id: userId,
          name: data.name,
          target_amount: targetAmount,
          current_amount: currentAmount,
          target_date: data.targetDate,
          category,
          status: 'ACTIVE',
        })
        .select()
        .single();

      if (error || !record) {
        logger.error({ error }, 'Failed to create savings goal in Supabase');
        throw new AppError('Failed to create savings goal: ' + (error?.message || ''), 500);
      }

      const target = Number(record.target_amount);
      const current = Number(record.current_amount);
      const progressPercentage = target > 0 ? Math.min(100, Math.round((current / target) * 100)) : 0;

      return {
        id: record.id,
        userId: record.user_id,
        name: record.name,
        targetAmount: target,
        currentAmount: current,
        remainingAmount: Math.max(0, target - current),
        progressPercentage,
        targetDate: record.target_date,
        category: record.category,
        status: progressPercentage >= 100 ? 'COMPLETED' : 'IN_PROGRESS',
        createdAt: record.created_at,
        updatedAt: record.updated_at,
      };
    }

    throw new AppError('Database connection unavailable', 503);
  }

  public static async updateGoal(
    userId: string,
    id: string,
    updates: { name?: string; targetAmount?: number; currentAmount?: number; targetDate?: string; category?: string }
  ): Promise<SavingsGoalRecord> {
    if (process.env.NODE_ENV === 'test') {
      const goals = localStore.getSavingsGoals();
      const idx = goals.findIndex((g) => g.id === id && (g.userId === userId || userId === 'usr_dev_local_spendx'));
      if (idx === -1) throw new AppError('Savings goal not found', 404);
      goals[idx] = {
        ...goals[idx],
        ...updates,
        updatedAt: new Date().toISOString(),
      };
      localStore.saveSavingsGoals(goals);
      const g = goals[idx];
      const progressPercentage = Math.min(100, Math.round((g.currentAmount / g.targetAmount) * 100));
      return {
        ...g,
        remainingAmount: Math.max(0, g.targetAmount - g.currentAmount),
        progressPercentage,
        status: progressPercentage >= 100 ? 'COMPLETED' : 'IN_PROGRESS',
      };
    }

    const db = getDbClient();
    if (db) {
      const payload: Record<string, unknown> = { updated_at: new Date().toISOString() };
      if (updates.name) payload.name = updates.name;
      if (updates.targetAmount !== undefined) payload.target_amount = Number(updates.targetAmount);
      if (updates.currentAmount !== undefined) payload.current_amount = Number(updates.currentAmount);
      if (updates.targetDate) payload.target_date = updates.targetDate;
      if (updates.category) payload.category = updates.category;

      const { data, error } = await db
        .from('savings_goals')
        .update(payload)
        .eq('id', id)
        .eq('user_id', userId)
        .select()
        .single();

      if (error || !data) throw new AppError('Savings goal not found', 404);

      const target = Number(data.target_amount);
      const current = Number(data.current_amount);
      const progressPercentage = target > 0 ? Math.min(100, Math.round((current / target) * 100)) : 0;

      return {
        id: data.id,
        userId: data.user_id,
        name: data.name,
        targetAmount: target,
        currentAmount: current,
        remainingAmount: Math.max(0, target - current),
        progressPercentage,
        targetDate: data.target_date,
        category: data.category,
        status: progressPercentage >= 100 ? 'COMPLETED' : 'IN_PROGRESS',
        createdAt: data.created_at,
        updatedAt: data.updated_at,
      };
    }

    throw new AppError('Database connection unavailable', 503);
  }

  public static async deleteGoal(userId: string, id: string): Promise<void> {
    if (process.env.NODE_ENV === 'test') {
      const goals = localStore.getSavingsGoals();
      const idx = goals.findIndex((g) => g.id === id && (g.userId === userId || userId === 'usr_dev_local_spendx'));
      if (idx === -1) throw new AppError('Savings goal not found', 404);
      goals.splice(idx, 1);
      localStore.saveSavingsGoals(goals);
      return;
    }

    const db = getDbClient();
    if (db) {
      const { error, count } = await db
        .from('savings_goals')
        .delete({ count: 'exact' })
        .eq('id', id)
        .eq('user_id', userId);

      if (error) throw new AppError('Failed to delete savings goal', 500);
      if (count === 0) throw new AppError('Savings goal not found', 404);
      return;
    }

    throw new AppError('Database connection unavailable', 503);
  }

  public static async recordContribution(
    userId: string,
    id: string,
    amount: number,
    notes?: string
  ): Promise<{ goal: SavingsGoalRecord; milestoneCelebrated: boolean }> {
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

    return { goal: updated, milestoneCelebrated };
  }
}
