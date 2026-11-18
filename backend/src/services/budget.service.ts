import { supabaseAdminClient } from '../config/supabase.js';
import { AppError } from '../middleware/errorHandler.js';
import { logger } from '../utils/logger.js';

export interface BudgetPayload {
  name: string;
  category: string;
  allocatedAmount: number;
  period?: 'MONTHLY' | 'YEARLY';
  monthYear?: string; // YYYY-MM-DD
}

export class BudgetService {
  public static async getBudgets(userId: string, targetMonthYear?: string) {
    if (!supabaseAdminClient) throw new AppError('Database service unavailable', 503);

    // Default to current month start date
    const now = new Date();
    const currentMonthStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-01`;
    const targetMonth = targetMonthYear || currentMonthStr;

    // 1. Fetch budgets for the user
    const { data: budgets, error } = await supabaseAdminClient
      .from('budgets')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: true });

    if (error) {
      logger.error({ error, userId }, 'Failed fetching budgets');
      throw new AppError('Unable to fetch budgets', 500);
    }

    if (!budgets || budgets.length === 0) {
      return [];
    }

    // 2. Determine date boundary for month
    const [year, month] = targetMonth.split('-').map(Number);
    const startDate = new Date(year, month - 1, 1).toISOString();
    const endDate = new Date(year, month, 0, 23, 59, 59, 999).toISOString();

    // 3. Fetch all expenses for the user in this period
    const { data: txns } = await supabaseAdminClient
      .from('transactions')
      .select('amount, category, type, status')
      .eq('user_id', userId)
      .eq('type', 'EXPENSE')
      .gte('date', startDate)
      .lte('date', endDate);

    // Aggregate category spent
    const spentByCategory: Record<string, number> = {};
    (txns || []).forEach((t) => {
      if (t.status === 'FAILED') return;
      const cat = t.category;
      spentByCategory[cat] = (spentByCategory[cat] || 0) + Number(t.amount);
    });

    // 4. Augment budgets with deterministic metrics
    return budgets.map((b) => {
      const allocated = Number(b.allocated_amount);
      const spent = spentByCategory[b.category] || 0;
      const remaining = allocated - spent;
      const utilizationPercentage = allocated > 0 ? Math.round((spent / allocated) * 1000) / 10 : 0;
      const status: 'normal' | 'warning' | 'danger' =
        utilizationPercentage >= 100 ? 'danger' : utilizationPercentage >= 80 ? 'warning' : 'normal';

      return {
        id: b.id,
        userId: b.user_id,
        name: b.name,
        category: b.category,
        allocatedAmount: allocated,
        spent: Math.round(spent * 100) / 100,
        remaining: Math.round(remaining * 100) / 100,
        utilizationPercentage,
        status,
        period: b.period,
        monthYear: b.month_year,
        createdAt: b.created_at,
        updatedAt: b.updated_at,
      };
    });
  }

  public static async createBudget(userId: string, payload: BudgetPayload) {
    if (!supabaseAdminClient) throw new AppError('Database service unavailable', 503);

    const now = new Date();
    const monthYear = payload.monthYear || `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-01`;

    const { data, error } = await supabaseAdminClient
      .from('budgets')
      .insert({
        user_id: userId,
        name: payload.name,
        category: payload.category,
        allocated_amount: payload.allocatedAmount,
        period: payload.period || 'MONTHLY',
        month_year: monthYear,
      })
      .select()
      .single();

    if (error) {
      logger.error({ error, userId }, 'Failed creating budget');
      throw new AppError('Unable to create budget: ' + error.message, 400);
    }

    return data;
  }

  public static async updateBudget(userId: string, id: string, payload: Partial<BudgetPayload>) {
    if (!supabaseAdminClient) throw new AppError('Database service unavailable', 503);

    const updateObj: Record<string, any> = { updated_at: new Date().toISOString() };
    if (payload.name !== undefined) updateObj.name = payload.name;
    if (payload.category !== undefined) updateObj.category = payload.category;
    if (payload.allocatedAmount !== undefined) updateObj.allocated_amount = payload.allocatedAmount;
    if (payload.period !== undefined) updateObj.period = payload.period;
    if (payload.monthYear !== undefined) updateObj.month_year = payload.monthYear;

    const { data, error } = await supabaseAdminClient
      .from('budgets')
      .update(updateObj)
      .eq('id', id)
      .eq('user_id', userId)
      .select()
      .single();

    if (error || !data) {
      throw new AppError('Unable to update budget', 400);
    }

    return data;
  }

  public static async deleteBudget(userId: string, id: string) {
    if (!supabaseAdminClient) throw new AppError('Database service unavailable', 503);

    const { error } = await supabaseAdminClient
      .from('budgets')
      .delete()
      .eq('id', id)
      .eq('user_id', userId);

    if (error) {
      throw new AppError('Unable to delete budget', 400);
    }

    return { id, deleted: true };
  }
}
