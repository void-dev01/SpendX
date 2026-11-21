import crypto from 'crypto';
import { getDbClient } from '../config/supabase.js';
import { AppError } from '../middleware/errorHandler.js';
import { logger } from '../utils/logger.js';
import { NotificationService } from './notification.service.js';
import { localStore, RawBudget } from '../db/localStore.js';

export interface BudgetRecord {
  id: string;
  userId: string;
  name: string;
  category: string;
  allocatedAmount: number;
  spentAmount: number;
  spent: number;
  remainingAmount: number;
  remaining: number;
  utilizationPercentage: number;
  status: 'NORMAL' | 'WARNING' | 'CRITICAL';
  period: 'MONTHLY' | 'WEEKLY' | 'YEARLY';
  createdAt: string;
  updatedAt: string;
}

export class BudgetService {
  public static async getBudgets(userId: string): Promise<BudgetRecord[]> {
    const db = getDbClient();
    if (db && process.env.NODE_ENV !== 'test') {
      try {
        const { data: rawBudgets, error } = await db
          .from('budgets')
          .select('*')
          .eq('user_id', userId)
          .order('created_at', { ascending: false });

        if (!error && rawBudgets && rawBudgets.length > 0) {
          const now = new Date();
          const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
          const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999).toISOString();

          const { data: txns } = await db
            .from('transactions')
            .select('amount, category')
            .eq('user_id', userId)
            .eq('type', 'EXPENSE')
            .gte('date', startOfMonth)
            .lte('date', endOfMonth);

          const spentByCategory: Record<string, number> = {};
          (txns || []).forEach((t: any) => {
            const cat = (t.category || '').toLowerCase();
            spentByCategory[cat] = (spentByCategory[cat] || 0) + Number(t.amount);
          });

          return rawBudgets.map((b: any) => {
            const allocated = Number(b.allocated_amount || b.allocatedAmount) || 0;
            const catKey = (b.category || '').toLowerCase();
            const spentAmount = Math.round((spentByCategory[catKey] || 0) * 100) / 100;
            const remainingAmount = Math.max(0, Math.round((allocated - spentAmount) * 100) / 100);
            const utilizationPercentage = allocated > 0 ? Math.round((spentAmount / allocated) * 100) : 0;

            let status: 'NORMAL' | 'WARNING' | 'CRITICAL' = 'NORMAL';
            if (utilizationPercentage >= 100) status = 'CRITICAL';
            else if (utilizationPercentage >= 80) status = 'WARNING';

            return {
              id: b.id,
              userId: b.user_id || b.userId,
              name: b.name || `${b.category} Budget`,
              category: b.category,
              allocatedAmount: allocated,
              spentAmount,
              spent: spentAmount,
              remainingAmount,
              remaining: remainingAmount,
              utilizationPercentage,
              status,
              period: b.period || 'MONTHLY',
              createdAt: b.created_at || b.createdAt,
              updatedAt: b.updated_at || b.updatedAt,
            };
          });
        }
      } catch (err) {
        logger.warn({ err }, 'Supabase getBudgets failed, falling back to localStore');
      }
    }

    // Authoritative localStore offline / development fallback
    const rawList = localStore.getBudgets().filter((b) => b.userId === userId);
    const txns = localStore.getTransactions().filter((t) => t.userId === userId);

    return rawList.map((b) => {
      const spent = txns
        .filter((t) => t.category.toLowerCase() === b.category.toLowerCase() && t.type === 'EXPENSE')
        .reduce((sum, t) => sum + Number(t.amount || 0), 0);

      const spentAmount = spent;
      const remainingAmount = Math.max(0, b.allocatedAmount - spentAmount);
      const utilizationPercentage = b.allocatedAmount > 0 ? Math.round((spentAmount / b.allocatedAmount) * 100) : 0;
      let status: 'NORMAL' | 'WARNING' | 'CRITICAL' = 'NORMAL';
      if (utilizationPercentage >= 100) status = 'CRITICAL';
      else if (utilizationPercentage >= 80) status = 'WARNING';

      return {
        id: b.id,
        userId: b.userId,
        name: (b as any).name || `${b.category} Budget`,
        category: b.category,
        allocatedAmount: b.allocatedAmount,
        spentAmount,
        spent: spentAmount,
        remainingAmount,
        remaining: remainingAmount,
        utilizationPercentage,
        status,
        period: b.period,
        createdAt: b.createdAt,
        updatedAt: b.updatedAt,
      };
    });
  }

  public static async createBudget(
    userId: string,
    data: { name?: string; category: string; allocatedAmount: number; period?: 'MONTHLY' | 'WEEKLY' | 'YEARLY' }
  ): Promise<BudgetRecord> {
    const period = data.period || 'MONTHLY';
    const allocated = Math.round(Number(data.allocatedAmount) * 100) / 100;
    if (isNaN(allocated) || allocated <= 0) {
      throw new AppError('Allocated budget amount must be positive', 400);
    }

    const budgetName = data.name?.trim() || `${data.category} Budget`;
    const budgetId = crypto.randomUUID();

    const db = getDbClient();
    if (db && process.env.NODE_ENV !== 'test') {
      try {
        const now = new Date();
        const monthYear = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-01`;

        await db.from('budgets').insert({
          id: budgetId,
          user_id: userId,
          name: budgetName,
          category: data.category,
          allocated_amount: allocated,
          period: period === 'YEARLY' ? 'YEARLY' : 'MONTHLY',
          month_year: monthYear,
        });
      } catch (err) {
        logger.warn({ err }, 'Supabase insert budget failed, persisting to localStore');
      }
    }

    // Always persist to localStore for local reliability
    const item: RawBudget = {
      id: budgetId,
      userId,
      category: data.category,
      allocatedAmount: allocated,
      period,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    (item as any).name = budgetName;
    const budgets = localStore.getBudgets();
    budgets.unshift(item);
    localStore.saveBudgets(budgets);

    // Reconcile actual spent from existing transactions
    const txns = localStore.getTransactions().filter((t) => t.userId === userId);
    const spentAmount = txns
      .filter((t) => t.category.toLowerCase() === data.category.toLowerCase() && t.type === 'EXPENSE')
      .reduce((sum, t) => sum + Number(t.amount || 0), 0);

    const remainingAmount = Math.max(0, allocated - spentAmount);
    const utilizationPercentage = allocated > 0 ? Math.round((spentAmount / allocated) * 100) : 0;
    let status: 'NORMAL' | 'WARNING' | 'CRITICAL' = 'NORMAL';
    if (utilizationPercentage >= 100) status = 'CRITICAL';
    else if (utilizationPercentage >= 80) status = 'WARNING';

    return {
      id: budgetId,
      userId,
      name: budgetName,
      category: data.category,
      allocatedAmount: allocated,
      spentAmount,
      spent: spentAmount,
      remainingAmount,
      remaining: remainingAmount,
      utilizationPercentage,
      status,
      period,
      createdAt: item.createdAt,
      updatedAt: item.updatedAt,
    };
  }

  public static async updateBudget(
    userId: string,
    id: string,
    updates: { name?: string; category?: string; allocatedAmount?: number; period?: 'MONTHLY' | 'WEEKLY' | 'YEARLY' }
  ): Promise<BudgetRecord> {
    const db = getDbClient();
    if (db && process.env.NODE_ENV !== 'test') {
      try {
        const payload: Record<string, unknown> = { updated_at: new Date().toISOString() };
        if (updates.name) payload.name = updates.name;
        if (updates.category) payload.category = updates.category;
        if (updates.allocatedAmount !== undefined) payload.allocated_amount = Number(updates.allocatedAmount);
        if (updates.period) payload.period = updates.period === 'YEARLY' ? 'YEARLY' : 'MONTHLY';

        await db.from('budgets').update(payload).eq('id', id).eq('user_id', userId);
      } catch (err) {
        logger.warn({ err }, 'Supabase update budget failed, updating localStore');
      }
    }

    const budgets = localStore.getBudgets();
    const idx = budgets.findIndex((b) => b.id === id && b.userId === userId);
    if (idx === -1) throw new AppError('Budget not found', 404);

    budgets[idx] = {
      ...budgets[idx],
      category: updates.category || budgets[idx].category,
      allocatedAmount: updates.allocatedAmount !== undefined ? updates.allocatedAmount : budgets[idx].allocatedAmount,
      period: updates.period || budgets[idx].period,
      updatedAt: new Date().toISOString(),
    };
    if (updates.name) (budgets[idx] as any).name = updates.name;
    localStore.saveBudgets(budgets);

    const b = budgets[idx];
    const txns = localStore.getTransactions().filter((t) => t.userId === userId);
    const spentAmount = txns
      .filter((t) => t.category.toLowerCase() === b.category.toLowerCase() && t.type === 'EXPENSE')
      .reduce((sum, t) => sum + Number(t.amount || 0), 0);
    const remainingAmount = Math.max(0, b.allocatedAmount - spentAmount);
    const utilizationPercentage = b.allocatedAmount > 0 ? Math.round((spentAmount / b.allocatedAmount) * 100) : 0;
    let status: 'NORMAL' | 'WARNING' | 'CRITICAL' = 'NORMAL';
    if (utilizationPercentage >= 100) status = 'CRITICAL';
    else if (utilizationPercentage >= 80) status = 'WARNING';

    return {
      id: b.id,
      userId: b.userId,
      name: (b as any).name || `${b.category} Budget`,
      category: b.category,
      allocatedAmount: b.allocatedAmount,
      spentAmount,
      spent: spentAmount,
      remainingAmount,
      remaining: remainingAmount,
      utilizationPercentage,
      status,
      period: b.period,
      createdAt: b.createdAt,
      updatedAt: b.updatedAt,
    };
  }

  public static async deleteBudget(userId: string, id: string): Promise<void> {
    const db = getDbClient();
    if (db && process.env.NODE_ENV !== 'test') {
      try {
        await db.from('budgets').delete().eq('id', id).eq('user_id', userId);
      } catch (err) {
        logger.warn({ err }, 'Supabase delete budget failed');
      }
    }

    const budgets = localStore.getBudgets();
    const idx = budgets.findIndex((b) => b.id === id && b.userId === userId);
    if (idx !== -1) {
      budgets.splice(idx, 1);
      localStore.saveBudgets(budgets);
    }
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
