/**
 * SPENDX Savings Service
 * Handles savings goals lifecycle, contribution accounting,
 * source account balance deductions, transfer logging, and telemetry.
 */

import { authService } from './authService';
import { supabase } from './supabase';
import { accountService } from './accountService';
import { transactionService } from './transactionService';

export type GoalCategory =
  | 'Emergency Fund'
  | 'Technology'
  | 'Travel'
  | 'Vehicle'
  | 'Home'
  | 'Education'
  | 'Wedding'
  | 'Other';

export type GoalStatus = 'ACTIVE' | 'COMPLETED' | 'PAUSED' | 'ARCHIVED';

export interface SavingsContributionRecord {
  id: string;
  goalId: string;
  amount: number;
  sourceAccountId: string;
  sourceAccountName: string;
  date: string;
  notes?: string;
  createdAt: string;
}

export interface SavingsGoalRecord {
  id: string;
  userId: string;
  name: string;
  category: GoalCategory;
  targetAmount: number;
  currentAmount: number;
  targetDate: string; // ISO date string
  status: GoalStatus;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface SavingsOverviewMetrics {
  totalSaved: number;
  totalTarget: number;
  remainingToSave: number;
  overallProgress: number;
  activeGoalCount: number;
  completedGoalCount: number;
}

export interface SavingsInsight {
  id: string;
  title: string;
  description: string;
  type: 'POSITIVE' | 'NEUTRAL' | 'WARNING';
}

export const SAVINGS_CATEGORIES: GoalCategory[] = [
  'Emergency Fund',
  'Technology',
  'Travel',
  'Vehicle',
  'Home',
  'Education',
  'Wedding',
  'Other',
];

export const INITIAL_DEMO_SAVINGS_GOALS: SavingsGoalRecord[] = [
  {
    id: 'goal-emergency-fund',
    userId: 'demo-user-id',
    name: 'Emergency Fund',
    category: 'Emergency Fund',
    targetAmount: 50000,
    currentAmount: 32000,
    targetDate: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'ACTIVE',
    notes: '6 months of core living expense buffer deposited in liquid vault',
    createdAt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'goal-new-laptop',
    userId: 'demo-user-id',
    name: 'New Laptop',
    category: 'Technology',
    targetAmount: 80000,
    currentAmount: 24000,
    targetDate: new Date(Date.now() + 240 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'ACTIVE',
    notes: 'MacBook Pro M3 workstation upgrade for software development',
    createdAt: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'goal-japan-trip',
    userId: 'demo-user-id',
    name: 'Japan Autumn Trip',
    category: 'Travel',
    targetAmount: 150000,
    currentAmount: 45000,
    targetDate: new Date(Date.now() + 330 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'ACTIVE',
    notes: 'Tokyo & Kyoto 10-day vacation flights and bullet train pass',
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export const INITIAL_DEMO_CONTRIBUTIONS: SavingsContributionRecord[] = [
  {
    id: 'contrib-101',
    goalId: 'goal-emergency-fund',
    amount: 10000,
    sourceAccountId: 'acc-hdfc-01',
    sourceAccountName: 'HDFC Bank - Salary',
    date: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
    notes: 'Monthly automated savings allocation',
    createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'contrib-102',
    goalId: 'goal-new-laptop',
    amount: 8000,
    sourceAccountId: 'acc-hdfc-01',
    sourceAccountName: 'HDFC Bank - Salary',
    date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    notes: 'Freelance project milestone bonus allocation',
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'contrib-103',
    goalId: 'goal-japan-trip',
    amount: 15000,
    sourceAccountId: 'acc-sbi-02',
    sourceAccountName: 'SBI Savings Vault',
    date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    notes: 'Travel vault monthly deposit',
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

const LOCAL_STORAGE_SAVINGS_GOALS_KEY = 'spendx_savings_goals_v1';
const LOCAL_STORAGE_SAVINGS_CONTRIBS_KEY = 'spendx_savings_contribs_v1';

export const savingsService = {
  getStoredGoals(): SavingsGoalRecord[] {
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_SAVINGS_GOALS_KEY);
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.warn('Failed to parse cached savings goals', e);
    }
    this.saveStoredGoals(INITIAL_DEMO_SAVINGS_GOALS);
    return INITIAL_DEMO_SAVINGS_GOALS;
  },

  saveStoredGoals(goals: SavingsGoalRecord[]): void {
    try {
      localStorage.setItem(LOCAL_STORAGE_SAVINGS_GOALS_KEY, JSON.stringify(goals));
    } catch (e) {
      console.warn('Failed to cache savings goals', e);
    }
  },

  getStoredContributions(): SavingsContributionRecord[] {
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_SAVINGS_CONTRIBS_KEY);
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.warn('Failed to parse cached contributions', e);
    }
    this.saveStoredContributions(INITIAL_DEMO_CONTRIBUTIONS);
    return INITIAL_DEMO_CONTRIBUTIONS;
  },

  saveStoredContributions(contribs: SavingsContributionRecord[]): void {
    try {
      localStorage.setItem(LOCAL_STORAGE_SAVINGS_CONTRIBS_KEY, JSON.stringify(contribs));
    } catch (e) {
      console.warn('Failed to cache contributions', e);
    }
  },

  /**
   * Retrieves all savings goals
   */
  async getGoals(): Promise<SavingsGoalRecord[]> {
    const user = authService.getUser();

    if (supabase && user && user.id !== 'demo-user-id') {
      try {
        const { data, error } = await supabase
          .from('savings_goals')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: true });

        if (!error && data && data.length > 0) {
          return data.map((g) => ({
            id: g.id,
            userId: g.user_id,
            name: g.name,
            category: g.category || 'Other',
            targetAmount: Number(g.target_amount) || 0,
            currentAmount: Number(g.current_amount) || 0,
            targetDate: g.target_date || new Date().toISOString(),
            status: (g.status as GoalStatus) || 'ACTIVE',
            notes: g.notes,
            createdAt: g.created_at || new Date().toISOString(),
            updatedAt: g.updated_at || new Date().toISOString(),
          }));
        }
      } catch (err) {
        console.warn('Could not query Supabase savings goals, using local store', err);
      }
    }

    return this.getStoredGoals();
  },

  /**
   * Get single savings goal by ID
   */
  async getGoalById(id: string): Promise<SavingsGoalRecord | null> {
    const goals = await this.getGoals();
    return goals.find((g) => g.id === id) || null;
  },

  /**
   * Get contributions for a specific goal
   */
  async getGoalContributions(goalId: string): Promise<SavingsContributionRecord[]> {
    const contribs = this.getStoredContributions();
    return contribs
      .filter((c) => c.goalId === goalId)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  },

  /**
   * Computes overview summary metrics
   */
  computeOverviewMetrics(goals: SavingsGoalRecord[]): SavingsOverviewMetrics {
    let totalSaved = 0;
    let totalTarget = 0;
    let activeGoalCount = 0;
    let completedGoalCount = 0;

    goals.forEach((g) => {
      if (g.status === 'ARCHIVED') return;
      if (g.status === 'COMPLETED') {
        completedGoalCount++;
      } else {
        activeGoalCount++;
      }
      totalSaved += g.currentAmount;
      totalTarget += g.targetAmount;
    });

    const remainingToSave = Math.max(0, totalTarget - totalSaved);
    const overallProgress =
      totalTarget > 0 ? Number(((totalSaved / totalTarget) * 100).toFixed(1)) : 0;

    return {
      totalSaved,
      totalTarget,
      remainingToSave,
      overallProgress,
      activeGoalCount,
      completedGoalCount,
    };
  },

  /**
   * Generate data-driven savings insights
   */
  generateInsights(goals: SavingsGoalRecord[]): SavingsInsight[] {
    const activeGoals = goals.filter((g) => g.status === 'ACTIVE');
    if (activeGoals.length === 0) return [];

    const insights: SavingsInsight[] = [];

    // 1. Goal closest to completion
    const sortedByProgress = [...activeGoals].sort((a, b) => {
      const progA = a.targetAmount > 0 ? a.currentAmount / a.targetAmount : 0;
      const progB = b.targetAmount > 0 ? b.currentAmount / b.targetAmount : 0;
      return progB - progA;
    });

    const topGoal = sortedByProgress[0];
    if (topGoal) {
      const pct = Math.round((topGoal.currentAmount / topGoal.targetAmount) * 100);
      insights.push({
        id: 'insight-closest',
        title: `Closest Milestone: ${topGoal.name}`,
        description: `${pct}% completed (${transactionService.formatINR(topGoal.currentAmount)} of ${transactionService.formatINR(topGoal.targetAmount)}). Only ${transactionService.formatINR(topGoal.targetAmount - topGoal.currentAmount)} to go.`,
        type: 'POSITIVE',
      });
    }

    // 2. Monthly savings projection for the goal with target date
    const goalWithDate = activeGoals.find((g) => new Date(g.targetDate).getTime() > Date.now());
    if (goalWithDate) {
      const remainingAmount = goalWithDate.targetAmount - goalWithDate.currentAmount;
      const daysRemaining = Math.max(
        1,
        (new Date(goalWithDate.targetDate).getTime() - Date.now()) / (24 * 60 * 60 * 1000)
      );
      const monthsRemaining = Math.max(1, Math.ceil(daysRemaining / 30));
      const neededPerMonth = Math.ceil(remainingAmount / monthsRemaining);

      insights.push({
        id: 'insight-projection',
        title: `Pacing Projection: ${goalWithDate.name}`,
        description: `Save ~${transactionService.formatINR(neededPerMonth)}/month over the next ${monthsRemaining} months to reach your target by ${new Date(goalWithDate.targetDate).toLocaleDateString('en-IN')}.`,
        type: 'NEUTRAL',
      });
    }

    return insights;
  },

  /**
   * Create new savings goal
   */
  async createGoal(
    data: Omit<SavingsGoalRecord, 'id' | 'userId' | 'createdAt' | 'updatedAt'>
  ): Promise<SavingsGoalRecord> {
    const user = authService.getUser();
    const userId = user?.id || 'demo-user-id';

    const newRecord: SavingsGoalRecord = {
      ...data,
      id: `goal_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      userId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const current = this.getStoredGoals();
    const updated = [newRecord, ...current];
    this.saveStoredGoals(updated);

    return newRecord;
  },

  /**
   * Update existing savings goal
   */
  async updateGoal(
    id: string,
    updates: Partial<Omit<SavingsGoalRecord, 'id' | 'userId' | 'createdAt'>>
  ): Promise<SavingsGoalRecord> {
    const current = this.getStoredGoals();
    const index = current.findIndex((g) => g.id === id);

    if (index === -1) {
      throw new Error(`Savings Goal with ID "${id}" not found.`);
    }

    const updatedRecord: SavingsGoalRecord = {
      ...current[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    // Auto-mark completed if target reached
    if (updatedRecord.currentAmount >= updatedRecord.targetAmount) {
      updatedRecord.status = 'COMPLETED';
    }

    current[index] = updatedRecord;
    this.saveStoredGoals(current);

    return updatedRecord;
  },

  /**
   * Add money contribution to a savings goal
   * Reconciles source account balance and creates internal transfer transaction
   */
  async addContribution(
    goalId: string,
    data: {
      amount: number;
      sourceAccountId: string;
      sourceAccountName: string;
      date: string;
      notes?: string;
    }
  ): Promise<{ goal: SavingsGoalRecord; contribution: SavingsContributionRecord }> {
    const goals = this.getStoredGoals();
    const goalIndex = goals.findIndex((g) => g.id === goalId);

    if (goalIndex === -1) {
      throw new Error(`Savings goal #${goalId} not found.`);
    }

    const goal = goals[goalIndex];
    const newCurrentAmount = goal.currentAmount + data.amount;
    const isCompleted = newCurrentAmount >= goal.targetAmount;

    // 1. Create contribution record
    const contribution: SavingsContributionRecord = {
      id: `contrib_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      goalId,
      amount: data.amount,
      sourceAccountId: data.sourceAccountId,
      sourceAccountName: data.sourceAccountName,
      date: data.date,
      notes: data.notes,
      createdAt: new Date().toISOString(),
    };

    const currentContribs = this.getStoredContributions();
    this.saveStoredContributions([contribution, ...currentContribs]);

    // 2. Update goal
    const updatedGoal: SavingsGoalRecord = {
      ...goal,
      currentAmount: newCurrentAmount,
      status: isCompleted ? 'COMPLETED' : goal.status,
      updatedAt: new Date().toISOString(),
    };
    goals[goalIndex] = updatedGoal;
    this.saveStoredGoals(goals);

    // 3. Deduct amount from source account in accountService
    try {
      const sourceAccount = await accountService.getAccountById(data.sourceAccountId);
      if (sourceAccount) {
        const newBalance = Math.max(0, sourceAccount.balance - data.amount);
        await accountService.updateAccount(sourceAccount.id, { balance: newBalance });
      }
    } catch (e) {
      console.warn('Could not deduct contribution from account balance', e);
    }

    // 4. Log transfer transaction in transactionService (ensures financial ledger consistency)
    try {
      await transactionService.createTransaction({
        accountId: data.sourceAccountId,
        accountName: data.sourceAccountName,
        amount: data.amount,
        type: 'TRANSFER',
        category: 'Savings Allocation',
        description: `Deposit to Goal: ${goal.name}`,
        merchantName: 'SPENDX Savings Vault',
        date: data.date,
        paymentMethod: 'Bank Transfer',
        status: 'COMPLETED',
        notes: data.notes || `Contribution to savings goal "${goal.name}"`,
        isRecurring: false,
      });
    } catch (e) {
      console.warn('Could not log transfer transaction for contribution', e);
    }

    return { goal: updatedGoal, contribution };
  },

  /**
   * Delete savings goal safely
   */
  async deleteGoal(id: string): Promise<void> {
    const current = this.getStoredGoals();
    const filtered = current.filter((g) => g.id !== id);
    this.saveStoredGoals(filtered);
  },

  formatINR(amount: number): string {
    return transactionService.formatINR(amount);
  },
};
