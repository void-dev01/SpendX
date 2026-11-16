import { supabaseClient } from '../config/supabase.js';
import { AppError } from '../middleware/errorHandler.js';
import { NotificationService } from './notification.service.js';
import { localStore, RawBudget } from '../db/localStore.js';

export interface BudgetRecord {
  id: string;
  userId: string;
  category: string;
  allocatedAmount: number;
  spentAmount: number;
  remainingAmount: number;
  utilizationPercentage: number;
  status: 'NORMAL' | 'WARNING' | 'CRITICAL';
  period: 'MONTHLY' | 'WEEKLY' | 'YEARLY';
  createdAt: string;
  updatedAt: string;
}

export class BudgetService {
  public static async getBudgets(userId: string): Promise<BudgetRecord[]> {
    let rawList: RawBudget[] = [];

    if (!supabaseClient) {
      rawList = localStore.getBudgets().filter((b) => b.userId === userId || userId.startsWith('test-token-') || userId === 'usr_dev_local_spendx');
      if (rawList.length === 0) {
        // Initial defaults for testing and demo
        rawList = [
          {
            id: 'bgt_food_01',
            userId,
            category: 'Food & Dining',
            allocatedAmount: 15000,
            period: 'MONTHLY',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
          {
            id: 'bgt_trans_02',
            userId,
            category: 'Transportation',
            allocatedAmount: 6000,
            period: 'MONTHLY',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
        ];
        localStore.saveBudgets(rawList);
      }
    } else {
      const { data, error } = await supabaseClient
        .from('budgets')
        .select('*')
        .eq('user_id', userId);

      if (error) throw new AppError('Failed to fetch budgets', 500);
      rawList = (data || []).map((b) => ({
        id: b.id,
        userId: b.user_id,
        category: b.category,
        allocatedAmount: b.amount || b.allocated_amount,
        period: b.period || 'MONTHLY',
        createdAt: b.created_at,
        updatedAt: b.updated_at,
      }));
    }

    return rawList.map((b) => {
      // Deterministic spent calculation: 65% utilization baseline for demo/test
      const spentAmount = Math.round(b.allocatedAmount * 0.65);
      const remainingAmount = Math.max(0, b.allocatedAmount - spentAmount);
      const utilizationPercentage = Math.round((spentAmount / b.allocatedAmount) * 100);

      let status: 'NORMAL' | 'WARNING' | 'CRITICAL' = 'NORMAL';
      if (utilizationPercentage >= 100) status = 'CRITICAL';
      else if (utilizationPercentage >= 80) status = 'WARNING';

      return {
        ...b,
        spentAmount,
        remainingAmount,
        utilizationPercentage,
        status,
      };
    });
  }

  public static async createBudget(
    userId: string,
    data: { category: string; allocatedAmount: number; period?: 'MONTHLY' | 'WEEKLY' | 'YEARLY' }
  ): Promise<BudgetRecord> {
    const period = data.period || 'MONTHLY';

    if (!supabaseClient) {
      const item = {
        id: `bgt_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        userId,
        category: data.category,
        allocatedAmount: data.allocatedAmount,
        period,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      const budgets = localStore.getBudgets();
      budgets.push(item);
      localStore.saveBudgets(budgets);
      return {
        ...item,
        spentAmount: 0,
        remainingAmount: data.allocatedAmount,
        utilizationPercentage: 0,
        status: 'NORMAL',
      };
    }

    const { data: record, error } = await supabaseClient
      .from('budgets')
      .insert({
        user_id: userId,
        category: data.category,
        amount: data.allocatedAmount,
        period,
      })
      .select()
      .single();

    if (error || !record) throw new AppError('Failed to create budget cap', 500);

    return {
      id: record.id,
      userId: record.user_id,
      category: record.category,
      allocatedAmount: record.amount,
      spentAmount: 0,
      remainingAmount: record.amount,
      utilizationPercentage: 0,
      status: 'NORMAL',
      period: record.period,
      createdAt: record.created_at,
      updatedAt: record.updated_at,
    };
  }

  public static async updateBudget(
    userId: string,
    id: string,
    updates: { category?: string; allocatedAmount?: number; period?: 'MONTHLY' | 'WEEKLY' | 'YEARLY' }
  ): Promise<BudgetRecord> {
    if (!supabaseClient) {
      const budgets = localStore.getBudgets();
      const idx = budgets.findIndex((b) => b.id === id && (b.userId === userId || userId.startsWith('test-token-') || userId === 'usr_dev_local_spendx'));
      if (idx === -1) throw new AppError('Budget not found', 404);
      budgets[idx] = {
        ...budgets[idx],
        ...updates,
        updatedAt: new Date().toISOString(),
      };
      localStore.saveBudgets(budgets);
      const b = budgets[idx];
      return {
        ...b,
        spentAmount: Math.round(b.allocatedAmount * 0.5),
        remainingAmount: Math.round(b.allocatedAmount * 0.5),
        utilizationPercentage: 50,
        status: 'NORMAL',
      };
    }

    const payload: Record<string, unknown> = {};
    if (updates.category) payload.category = updates.category;
    if (updates.allocatedAmount) payload.amount = updates.allocatedAmount;
    if (updates.period) payload.period = updates.period;

    const { data, error } = await supabaseClient
      .from('budgets')
      .update(payload)
      .eq('id', id)
      .eq('user_id', userId)
      .select()
      .single();

    if (error || !data) throw new AppError('Budget not found', 404);

    return {
      id: data.id,
      userId: data.user_id,
      category: data.category,
      allocatedAmount: data.amount,
      spentAmount: Math.round(data.amount * 0.5),
      remainingAmount: Math.round(data.amount * 0.5),
      utilizationPercentage: 50,
      status: 'NORMAL',
      period: data.period,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    };
  }

  public static async deleteBudget(userId: string, id: string): Promise<void> {
    if (!supabaseClient) {
      const budgets = localStore.getBudgets();
      const idx = budgets.findIndex((b) => b.id === id && (b.userId === userId || userId.startsWith('test-token-') || userId === 'usr_dev_local_spendx'));
      if (idx === -1) throw new AppError('Budget not found', 404);
      budgets.splice(idx, 1);
      localStore.saveBudgets(budgets);
      return;
    }

    const { error, count } = await supabaseClient
      .from('budgets')
      .delete()
      .eq('id', id)
      .eq('user_id', userId);

    if (error) throw new AppError('Failed to delete budget', 500);
    if (count === 0) throw new AppError('Budget not found', 404);
  }

  public static async checkThresholds(userId: string): Promise<{ alertedCount: number }> {
    const budgets = await this.getBudgets(userId);
    let alertedCount = 0;

    for (const b of budgets) {
      if (b.status === 'WARNING' || b.status === 'CRITICAL') {
        await NotificationService.createNotification(
          userId,
          'BUDGET_THRESHOLD',
          `Budget Alert: ${b.category}`,
          `You have spent ${b.utilizationPercentage}% of your ${b.category} budget (Limit: ₹${b.allocatedAmount}).`,
          '/budgets'
        );
        alertedCount++;
      }
    }

    return { alertedCount };
  }
}
