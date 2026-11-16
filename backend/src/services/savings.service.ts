import { supabaseClient } from '../config/supabase.js';
import { AppError } from '../middleware/errorHandler.js';
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
    let rawList: RawSavingsGoal[] = [];

    if (!supabaseClient) {
      rawList = localStore.getSavingsGoals().filter((g) => g.userId === userId || userId.startsWith('test-token-') || userId === 'usr_dev_local_spendx');
      if (rawList.length === 0) {
        rawList = [
          {
            id: 'goal_emergency_01',
            userId,
            name: 'Emergency Buffer 6-Months',
            targetAmount: 200000,
            currentAmount: 125000,
            targetDate: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000).toISOString(),
            category: 'Emergency Fund',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
          {
            id: 'goal_vacation_02',
            userId,
            name: 'Japan Autumn Tour',
            targetAmount: 150000,
            currentAmount: 60000,
            targetDate: new Date(Date.now() + 240 * 24 * 60 * 60 * 1000).toISOString(),
            category: 'Travel',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
        ];
        localStore.saveSavingsGoals(rawList);
      }
    } else {
      const { data, error } = await supabaseClient
        .from('savings_goals')
        .select('*')
        .eq('user_id', userId);

      if (error) throw new AppError('Failed to fetch savings goals', 500);

      rawList = (data || []).map((g) => ({
        id: g.id,
        userId: g.user_id,
        name: g.name,
        targetAmount: g.target_amount,
        currentAmount: g.current_amount || 0,
        targetDate: g.target_date || new Date().toISOString(),
        category: g.category || 'General',
        createdAt: g.created_at,
        updatedAt: g.updated_at,
      }));
    }

    return rawList.map((g) => {
      const remainingAmount = Math.max(0, g.targetAmount - g.currentAmount);
      const progressPercentage = Math.min(100, Math.round((g.currentAmount / g.targetAmount) * 100));
      const status = progressPercentage >= 100 ? 'COMPLETED' : 'IN_PROGRESS';

      return {
        ...g,
        remainingAmount,
        progressPercentage,
        status,
      };
    });
  }

  public static async createGoal(
    userId: string,
    data: { name: string; targetAmount: number; currentAmount?: number; targetDate: string; category?: string }
  ): Promise<SavingsGoalRecord> {
    const currentAmount = data.currentAmount || 0;
    const category = data.category || 'General';

    if (!supabaseClient) {
      const item = {
        id: `goal_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        userId,
        name: data.name,
        targetAmount: data.targetAmount,
        currentAmount,
        targetDate: data.targetDate,
        category,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      const goals = localStore.getSavingsGoals();
      goals.push(item);
      localStore.saveSavingsGoals(goals);
      const progressPercentage = Math.min(100, Math.round((currentAmount / data.targetAmount) * 100));
      return {
        ...item,
        remainingAmount: Math.max(0, data.targetAmount - currentAmount),
        progressPercentage,
        status: progressPercentage >= 100 ? 'COMPLETED' : 'IN_PROGRESS',
      };
    }

    const { data: record, error } = await supabaseClient
      .from('savings_goals')
      .insert({
        user_id: userId,
        name: data.name,
        target_amount: data.targetAmount,
        current_amount: currentAmount,
        target_date: data.targetDate,
        category,
      })
      .select()
      .single();

    if (error || !record) throw new AppError('Failed to create savings goal', 500);

    const progressPercentage = Math.min(100, Math.round((record.current_amount / record.target_amount) * 100));

    return {
      id: record.id,
      userId: record.user_id,
      name: record.name,
      targetAmount: record.target_amount,
      currentAmount: record.current_amount,
      remainingAmount: Math.max(0, record.target_amount - record.current_amount),
      progressPercentage,
      targetDate: record.target_date,
      category: record.category,
      status: progressPercentage >= 100 ? 'COMPLETED' : 'IN_PROGRESS',
      createdAt: record.created_at,
      updatedAt: record.updated_at,
    };
  }

  public static async updateGoal(
    userId: string,
    id: string,
    updates: { name?: string; targetAmount?: number; currentAmount?: number; targetDate?: string; category?: string }
  ): Promise<SavingsGoalRecord> {
    if (!supabaseClient) {
      const goals = localStore.getSavingsGoals();
      const idx = goals.findIndex((g) => g.id === id && (g.userId === userId || userId.startsWith('test-token-') || userId === 'usr_dev_local_spendx'));
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

    const payload: Record<string, unknown> = {};
    if (updates.name) payload.name = updates.name;
    if (updates.targetAmount) payload.target_amount = updates.targetAmount;
    if (updates.currentAmount !== undefined) payload.current_amount = updates.currentAmount;
    if (updates.targetDate) payload.target_date = updates.targetDate;
    if (updates.category) payload.category = updates.category;

    const { data, error } = await supabaseClient
      .from('savings_goals')
      .update(payload)
      .eq('id', id)
      .eq('user_id', userId)
      .select()
      .single();

    if (error || !data) throw new AppError('Savings goal not found', 404);

    const progressPercentage = Math.min(100, Math.round((data.current_amount / data.target_amount) * 100));

    return {
      id: data.id,
      userId: data.user_id,
      name: data.name,
      targetAmount: data.target_amount,
      currentAmount: data.current_amount,
      remainingAmount: Math.max(0, data.target_amount - data.current_amount),
      progressPercentage,
      targetDate: data.target_date,
      category: data.category,
      status: progressPercentage >= 100 ? 'COMPLETED' : 'IN_PROGRESS',
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    };
  }

  public static async deleteGoal(userId: string, id: string): Promise<void> {
    if (!supabaseClient) {
      const goals = localStore.getSavingsGoals();
      const idx = goals.findIndex((g) => g.id === id && (g.userId === userId || userId.startsWith('test-token-') || userId === 'usr_dev_local_spendx'));
      if (idx === -1) throw new AppError('Savings goal not found', 404);
      goals.splice(idx, 1);
      localStore.saveSavingsGoals(goals);
      return;
    }

    const { error, count } = await supabaseClient
      .from('savings_goals')
      .delete()
      .eq('id', id)
      .eq('user_id', userId);

    if (error) throw new AppError('Failed to delete savings goal', 500);
    if (count === 0) throw new AppError('Savings goal not found', 404);
  }

  public static async recordContribution(
    userId: string,
    id: string,
    amount: number,
    _notes?: string
  ): Promise<{ goal: SavingsGoalRecord; milestoneCelebrated: boolean }> {
    const goals = await this.getGoals(userId);
    const existing = goals.find((g) => g.id === id);
    if (!existing) throw new AppError('Savings goal not found', 404);

    const previousPercentage = existing.progressPercentage;
    const newCurrent = existing.currentAmount + amount;
    const updated = await this.updateGoal(userId, id, { currentAmount: newCurrent });
    const newPercentage = updated.progressPercentage;

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
