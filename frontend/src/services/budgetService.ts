/**
 * SPENDX Budget Service
 * Reconciles category budget limits with live transaction telemetry,
 * calculates deterministic utilization, alerts, and insights.
 */

import { authService } from './authService';
import { supabase } from './supabase';
import { apiClient } from './api';
import { transactionService, TransactionRecord } from './transactionService';
import { getUserScopedKey } from '../lib/userStorage';

export type BudgetPeriod = 'THIS_MONTH' | 'PREVIOUS_MONTH' | 'ALL_TIME';
export type BudgetStatus = 'NORMAL' | 'APPROACHING' | 'NEAR_LIMIT' | 'EXCEEDED';

export interface BudgetRecord {
  id: string;
  userId: string;
  name: string;
  category: string;
  allocatedAmount: number;
  period: 'MONTHLY' | 'YEARLY';
  alertThreshold: number; // e.g. 80 (%)
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface BudgetWithMetrics extends BudgetRecord {
  spent: number;
  remaining: number;
  utilizationPercentage: number;
  status: BudgetStatus;
  matchingTransactionCount: number;
}

export interface OverallBudgetMetrics {
  totalBudget: number;
  totalSpent: number;
  remainingBudget: number;
  overallUtilization: number;
  status: BudgetStatus;
}

export interface BudgetAlert {
  id: string;
  category: string;
  severity: 'WARNING' | 'DANGER' | 'INFO';
  title: string;
  description: string;
  budgetId: string;
}

export interface BudgetInsight {
  id: string;
  title: string;
  description: string;
  type: 'POSITIVE' | 'NEUTRAL' | 'WARNING';
}

export const INITIAL_DEMO_BUDGETS: BudgetRecord[] = [
  {
    id: 'bgt-food',
    userId: 'demo-user-id',
    name: 'Food & Dining Budget',
    category: 'Food & Dining',
    allocatedAmount: 8000,
    period: 'MONTHLY',
    alertThreshold: 80,
    notes: 'Includes restaurants, dining out, and daily coffees',
    createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'bgt-shopping',
    userId: 'demo-user-id',
    name: 'Shopping & Apparel',
    category: 'Shopping',
    allocatedAmount: 6000,
    period: 'MONTHLY',
    alertThreshold: 80,
    notes: 'Personal clothing, gadgets, and retail purchases',
    createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'bgt-transport',
    userId: 'demo-user-id',
    name: 'Transportation & Fuel',
    category: 'Transport',
    allocatedAmount: 4000,
    period: 'MONTHLY',
    alertThreshold: 85,
    notes: 'Petrol, cab rides, and city transit',
    createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'bgt-utilities',
    userId: 'demo-user-id',
    name: 'Household Bills & Utilities',
    category: 'Bills & Utilities',
    allocatedAmount: 5000,
    period: 'MONTHLY',
    alertThreshold: 90,
    notes: 'Electricity, fiber internet, water, and gas subscriptions',
    createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'bgt-entertainment',
    userId: 'demo-user-id',
    name: 'Entertainment & OTT',
    category: 'Entertainment',
    allocatedAmount: 2500,
    period: 'MONTHLY',
    alertThreshold: 75,
    notes: 'Streaming services, movies, and events',
    createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

const LOCAL_STORAGE_BUDGETS_KEY = 'spendx_budgets_store_v1';

export const budgetService = {
  getStorageKey(): string {
    return getUserScopedKey(LOCAL_STORAGE_BUDGETS_KEY);
  },

  getStoredBudgets(): BudgetRecord[] {
    try {
      const stored = localStorage.getItem(this.getStorageKey());
      if (stored) {
        const parsed: BudgetRecord[] = JSON.parse(stored);
        const user = authService.getUser();
        if (user?.id && user.id !== 'demo-user-id' && import.meta.env.MODE !== 'test') {
          return parsed.filter((b) => b.userId === user.id);
        }
        return parsed;
      }
    } catch (e) {
      console.warn('Failed to parse cached budgets', e);
    }
    return [];
  },

  saveStoredBudgets(budgets: BudgetRecord[]): void {
    try {
      localStorage.setItem(this.getStorageKey(), JSON.stringify(budgets));
    } catch (e) {
      console.warn('Failed to cache budgets', e);
    }
  },

  /**
   * Retrieves all user budgets
   */
  async getBudgets(): Promise<BudgetRecord[]> {
    const user = authService.getUser();

    // In unit test environment, return stored test fixture
    if (import.meta.env.MODE === 'test') {
      return this.getStoredBudgets();
    }

    if (user && user.id !== 'demo-user-id') {
      try {
        const res = await apiClient.get('/budgets');
        if (res.data?.success && Array.isArray(res.data?.data)) {
          const mapped = res.data.data.map((b: any) => ({
            id: b.id,
            userId: b.user_id || b.userId,
            name: b.name || `${b.category} Budget`,
            category: b.category,
            allocatedAmount: Number(b.allocatedAmount || b.allocated_amount || b.amount) || 0,
            period: b.period || 'MONTHLY',
            alertThreshold: b.alertThreshold || b.alert_threshold || 80,
            notes: b.notes,
            createdAt: b.createdAt || b.created_at || new Date().toISOString(),
            updatedAt: b.updatedAt || b.updated_at || new Date().toISOString(),
          }));
          this.saveStoredBudgets(mapped);
          return mapped;
        }
      } catch (apiErr) {
        console.warn('API /budgets failed, checking direct Supabase', apiErr);
      }

      if (supabase) {
        try {
          const { data, error } = await supabase
            .from('budgets')
            .select('*')
            .eq('user_id', user.id)
            .order('created_at', { ascending: true });

          if (!error && data) {
            const mapped = data.map((b) => ({
              id: b.id,
              userId: b.user_id,
              name: b.name || `${b.category} Budget`,
              category: b.category,
              allocatedAmount: Number(b.allocated_amount || b.amount) || 0,
              period: b.period || 'MONTHLY',
              alertThreshold: b.alert_threshold || 80,
              notes: b.notes,
              createdAt: b.created_at || new Date().toISOString(),
              updatedAt: b.updated_at || new Date().toISOString(),
            }));
            this.saveStoredBudgets(mapped);
            return mapped;
          }
        } catch (err) {
          console.warn('Could not query Supabase budgets', err);
        }
      }

      // Fallback to locally stored budgets if backend/Supabase are offline
      return this.getStoredBudgets();
    }

    return this.getStoredBudgets();
  },

  /**
   * Get single budget by ID
   */
  async getBudgetById(id: string): Promise<BudgetRecord | null> {
    const all = await this.getBudgets();
    return all.find((b) => b.id === id) || null;
  },

  /**
   * Reconciles budget records with actual transactions in the selected period
   */
  computeBudgetsWithMetrics(
    budgets: BudgetRecord[],
    transactions: TransactionRecord[],
    period: BudgetPeriod = 'THIS_MONTH'
  ): BudgetWithMetrics[] {
    // 1. Filter transactions by period
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    const periodTransactions = transactions.filter((t) => {
      // Exclude income and transfers from spending
      if (t.type !== 'EXPENSE') return false;

      const d = new Date(t.date);
      if (period === 'THIS_MONTH') {
        return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
      }
      if (period === 'PREVIOUS_MONTH') {
        const prevMonth = currentMonth === 0 ? 11 : currentMonth - 1;
        const prevYear = currentMonth === 0 ? currentYear - 1 : currentYear;
        return d.getMonth() === prevMonth && d.getFullYear() === prevYear;
      }
      // ALL_TIME
      return true;
    });

    // 2. Aggregate spending per category
    const categorySpendingMap: Record<string, { total: number; count: number }> = {};

    periodTransactions.forEach((t) => {
      const cat = t.category;
      if (!categorySpendingMap[cat]) {
        categorySpendingMap[cat] = { total: 0, count: 0 };
      }
      categorySpendingMap[cat].total += t.amount;
      categorySpendingMap[cat].count += 1;
    });

    // 3. Map budgets with deterministic progress
    return budgets.map((b) => {
      const spendData = categorySpendingMap[b.category] || { total: 0, count: 0 };
      const spent = spendData.total;
      const remaining = Math.max(0, b.allocatedAmount - spent);
      const utilization =
        b.allocatedAmount > 0 ? (spent / b.allocatedAmount) * 100 : 0;

      let status: BudgetStatus = 'NORMAL';
      if (utilization >= 100) {
        status = 'EXCEEDED';
      } else if (utilization >= 90) {
        status = 'NEAR_LIMIT';
      } else if (utilization >= 70) {
        status = 'APPROACHING';
      }

      return {
        ...b,
        spent,
        remaining,
        utilizationPercentage: Number(utilization.toFixed(1)),
        status,
        matchingTransactionCount: spendData.count,
      };
    });
  },

  /**
   * Convenience helper to fetch budgets and calculate metrics using live transactions
   */
  async getBudgetsWithMetrics(): Promise<BudgetWithMetrics[]> {
    const [budgets, transactions] = await Promise.all([
      this.getBudgets(),
      transactionService.getTransactions(),
    ]);
    return this.computeBudgetsWithMetrics(budgets, transactions, 'THIS_MONTH');
  },

  /**
   * Compute overall budget metrics across active budgets
   */
  computeOverallMetrics(budgetMetrics: BudgetWithMetrics[]): OverallBudgetMetrics {
    let totalBudget = 0;
    let totalSpent = 0;

    budgetMetrics.forEach((b) => {
      totalBudget += b.allocatedAmount;
      totalSpent += b.spent;
    });

    const remainingBudget = Math.max(0, totalBudget - totalSpent);
    const overallUtilization =
      totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0;

    let status: BudgetStatus = 'NORMAL';
    if (overallUtilization >= 100) {
      status = 'EXCEEDED';
    } else if (overallUtilization >= 90) {
      status = 'NEAR_LIMIT';
    } else if (overallUtilization >= 70) {
      status = 'APPROACHING';
    }

    return {
      totalBudget,
      totalSpent,
      remainingBudget,
      overallUtilization: Number(overallUtilization.toFixed(1)),
      status,
    };
  },

  /**
   * Generate data-driven alerts for budgets exceeding or near limit
   */
  generateAlerts(budgetMetrics: BudgetWithMetrics[]): BudgetAlert[] {
    const alerts: BudgetAlert[] = [];

    budgetMetrics.forEach((b) => {
      if (b.status === 'EXCEEDED') {
        const overspent = b.spent - b.allocatedAmount;
        alerts.push({
          id: `alert-exceeded-${b.id}`,
          category: b.category,
          severity: 'DANGER',
          title: `${b.category} Budget Exceeded`,
          description: `You have spent ${transactionService.formatINR(b.spent)}, which is ${transactionService.formatINR(overspent)} over your allocated limit.`,
          budgetId: b.id,
        });
      } else if (b.status === 'NEAR_LIMIT') {
        alerts.push({
          id: `alert-near-${b.id}`,
          category: b.category,
          severity: 'WARNING',
          title: `${b.category} Near Limit (${b.utilizationPercentage}%)`,
          description: `Only ${transactionService.formatINR(b.remaining)} remaining. Consider moderating daily discretionary spend.`,
          budgetId: b.id,
        });
      }
    });

    return alerts;
  },

  /**
   * Generate data-driven spending insights
   */
  generateInsights(budgetMetrics: BudgetWithMetrics[]): BudgetInsight[] {
    if (budgetMetrics.length === 0) return [];

    const insights: BudgetInsight[] = [];

    // 1. Highest spending category
    const sortedBySpent = [...budgetMetrics].sort((a, b) => b.spent - a.spent);
    if (sortedBySpent[0] && sortedBySpent[0].spent > 0) {
      insights.push({
        id: 'insight-highest-spent',
        title: `Top Outflow: ${sortedBySpent[0].category}`,
        description: `${sortedBySpent[0].category} accounts for ${transactionService.formatINR(sortedBySpent[0].spent)} across ${sortedBySpent[0].matchingTransactionCount} transactions.`,
        type: 'NEUTRAL',
      });
    }

    // 2. Category closest to its limit
    const sortedByUtil = [...budgetMetrics].sort(
      (a, b) => b.utilizationPercentage - a.utilizationPercentage
    );
    if (sortedByUtil[0] && sortedByUtil[0].utilizationPercentage >= 70) {
      insights.push({
        id: 'insight-highest-util',
        title: `Highest Utilization: ${sortedByUtil[0].category}`,
        description: `Currently at ${sortedByUtil[0].utilizationPercentage}% of the ${transactionService.formatINR(sortedByUtil[0].allocatedAmount)} ceiling.`,
        type: sortedByUtil[0].utilizationPercentage >= 90 ? 'WARNING' : 'NEUTRAL',
      });
    }

    // 3. Category with highest remaining budget
    const sortedByRemaining = [...budgetMetrics].sort((a, b) => b.remaining - a.remaining);
    if (sortedByRemaining[0] && sortedByRemaining[0].remaining > 0) {
      insights.push({
        id: 'insight-highest-remaining',
        title: `Healthy Reserve: ${sortedByRemaining[0].category}`,
        description: `${transactionService.formatINR(sortedByRemaining[0].remaining)} remains available for this billing period.`,
        type: 'POSITIVE',
      });
    }

    return insights;
  },

  /**
   * Create new budget
   */
  async createBudget(
    data: Omit<BudgetRecord, 'id' | 'userId' | 'createdAt' | 'updatedAt'>
  ): Promise<BudgetRecord> {
    const user = authService.getUser();

    if (user && user.id !== 'demo-user-id') {
      try {
        const res = await apiClient.post('/budgets', {
          name: data.name,
          category: data.category,
          allocatedAmount: data.allocatedAmount,
          period: data.period,
        });
        if (res.data?.success && res.data?.data) {
          const b = res.data.data;
          const created: BudgetRecord = {
            id: b.id,
            userId: b.user_id,
            name: b.name,
            category: b.category,
            allocatedAmount: Number(b.allocated_amount),
            period: b.period,
            alertThreshold: data.alertThreshold || 80,
            notes: data.notes,
            createdAt: b.created_at,
            updatedAt: b.updated_at,
          };
          const current = this.getStoredBudgets();
          this.saveStoredBudgets([...current.filter((x) => x.id !== created.id), created]);
          return created;
        }
      } catch (err) {
        console.warn('API /budgets post failed, attempting Supabase direct insert', err);
      }

      if (supabase) {
        const now = new Date();
        const monthYear = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-01`;
        const { data: record, error } = await supabase
          .from('budgets')
          .insert({
            user_id: user.id,
            name: data.name,
            category: data.category,
            allocated_amount: data.allocatedAmount,
            period: data.period || 'MONTHLY',
            month_year: monthYear,
          })
          .select()
          .single();

        if (!error && record) {
          const created: BudgetRecord = {
            id: record.id,
            userId: record.user_id,
            name: record.name,
            category: record.category,
            allocatedAmount: Number(record.allocated_amount),
            period: record.period,
            alertThreshold: data.alertThreshold || 80,
            notes: data.notes,
            createdAt: record.created_at,
            updatedAt: record.updated_at,
          };
          const current = this.getStoredBudgets();
          this.saveStoredBudgets([...current.filter((x) => x.id !== created.id), created]);
          return created;
        }
      }
    }

    const userId = user?.id || 'demo-user-id';
    const newRecord: BudgetRecord = {
      ...data,
      id: `bgt_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      userId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const current = this.getStoredBudgets();
    const updated = [...current, newRecord];
    this.saveStoredBudgets(updated);

    return newRecord;
  },

  /**
   * Update existing budget
   */
  async updateBudget(
    id: string,
    updates: Partial<Omit<BudgetRecord, 'id' | 'userId' | 'createdAt'>>
  ): Promise<BudgetRecord> {
    const user = authService.getUser();

    if (user && user.id !== 'demo-user-id') {
      try {
        const res = await apiClient.patch(`/budgets/${id}`, updates);
        if (res.data?.success && res.data?.data) {
          const b = res.data.data;
          const updated: BudgetRecord = {
            id: b.id,
            userId: b.user_id,
            name: b.name,
            category: b.category,
            allocatedAmount: Number(b.allocated_amount),
            period: b.period,
            alertThreshold: updates.alertThreshold || 80,
            notes: updates.notes,
            createdAt: b.created_at,
            updatedAt: b.updated_at,
          };
          const current = this.getStoredBudgets();
          const idx = current.findIndex((item) => item.id === id);
          if (idx !== -1) {
            current[idx] = updated;
            this.saveStoredBudgets(current);
          }
          return updated;
        }
      } catch (err) {
        console.warn('API /budgets update failed', err);
      }
    }

    const current = this.getStoredBudgets();
    const index = current.findIndex((b) => b.id === id);

    if (index === -1) {
      throw new Error(`Budget with ID "${id}" not found.`);
    }

    const updatedRecord: BudgetRecord = {
      ...current[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    current[index] = updatedRecord;
    this.saveStoredBudgets(current);

    return updatedRecord;
  },

  /**
   * Delete budget safely
   */
  async deleteBudget(id: string): Promise<void> {
    const user = authService.getUser();
    if (user && user.id !== 'demo-user-id') {
      try {
        await apiClient.delete(`/budgets/${id}`);
      } catch (err) {
        console.warn('API /budgets delete failed', err);
      }
    }

    const current = this.getStoredBudgets();
    const filtered = current.filter((b) => b.id !== id);
    this.saveStoredBudgets(filtered);
  },

  formatINR(amount: number): string {
    return transactionService.formatINR(amount);
  },
};
