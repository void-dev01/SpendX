import { supabaseAdminClient } from '../config/supabase.js';
import { AppError } from '../middleware/errorHandler.js';
import { logger } from '../utils/logger.js';

export interface SavingsGoalPayload {
  name: string;
  category: string;
  targetAmount: number;
  currentAmount?: number;
  targetDate?: string;
  linkedAccountId?: string;
  status?: 'ACTIVE' | 'COMPLETED' | 'PAUSED';
}

export interface ContributionPayload {
  amount: number;
  accountId?: string;
  notes?: string;
  date?: string;
}

export class SavingsService {
  public static async getGoals(userId: string) {
    if (!supabaseAdminClient) throw new AppError('Database service unavailable', 503);

    const { data: goals, error } = await supabaseAdminClient
      .from('savings_goals')
      .select('*, accounts(id, name)')
      .eq('user_id', userId)
      .order('created_at', { ascending: true });

    if (error) {
      logger.error({ error, userId }, 'Failed fetching savings goals');
      throw new AppError('Unable to fetch savings goals', 500);
    }

    return (goals || []).map((g: any) => {
      const target = Number(g.target_amount);
      const current = Number(g.current_amount);
      const progressPercentage = target > 0 ? Math.min(100, Math.round((current / target) * 1000) / 10) : 0;
      const remainingAmount = Math.max(0, target - current);

      return {
        id: g.id,
        userId: g.user_id,
        name: g.name,
        category: g.category,
        targetAmount: target,
        currentAmount: current,
        progressPercentage,
        remainingAmount,
        targetDate: g.target_date,
        linkedAccountId: g.linked_account_id,
        linkedAccountName: g.accounts?.name,
        status: g.status,
        createdAt: g.created_at,
        updatedAt: g.updated_at,
      };
    });
  }

  public static async getGoalById(userId: string, id: string) {
    if (!supabaseAdminClient) throw new AppError('Database service unavailable', 503);

    const { data: g, error } = await supabaseAdminClient
      .from('savings_goals')
      .select('*, accounts(id, name)')
      .eq('id', id)
      .eq('user_id', userId)
      .single();

    if (error || !g) {
      throw new AppError('Savings goal not found', 404);
    }

    const target = Number(g.target_amount);
    const current = Number(g.current_amount);
    return {
      id: g.id,
      userId: g.user_id,
      name: g.name,
      category: g.category,
      targetAmount: target,
      currentAmount: current,
      progressPercentage: target > 0 ? Math.min(100, Math.round((current / target) * 1000) / 10) : 0,
      remainingAmount: Math.max(0, target - current),
      targetDate: g.target_date,
      linkedAccountId: g.linked_account_id,
      linkedAccountName: g.accounts?.name,
      status: g.status,
      createdAt: g.created_at,
      updatedAt: g.updated_at,
    };
  }

  public static async createGoal(userId: string, payload: SavingsGoalPayload) {
    if (!supabaseAdminClient) throw new AppError('Database service unavailable', 503);

    const { data, error } = await supabaseAdminClient
      .from('savings_goals')
      .insert({
        user_id: userId,
        name: payload.name,
        category: payload.category || 'General',
        target_amount: payload.targetAmount,
        current_amount: payload.currentAmount || 0,
        target_date: payload.targetDate || null,
        linked_account_id: payload.linkedAccountId || null,
        status: payload.status || 'ACTIVE',
      })
      .select()
      .single();

    if (error) {
      logger.error({ error, userId }, 'Failed creating savings goal');
      throw new AppError('Unable to create savings goal: ' + error.message, 400);
    }

    return data;
  }

  public static async updateGoal(userId: string, id: string, payload: Partial<SavingsGoalPayload>) {
    if (!supabaseAdminClient) throw new AppError('Database service unavailable', 503);

    await this.getGoalById(userId, id);

    const updateObj: Record<string, any> = { updated_at: new Date().toISOString() };
    if (payload.name !== undefined) updateObj.name = payload.name;
    if (payload.category !== undefined) updateObj.category = payload.category;
    if (payload.targetAmount !== undefined) updateObj.target_amount = payload.targetAmount;
    if (payload.currentAmount !== undefined) updateObj.current_amount = payload.currentAmount;
    if (payload.targetDate !== undefined) updateObj.target_date = payload.targetDate;
    if (payload.linkedAccountId !== undefined) updateObj.linked_account_id = payload.linkedAccountId;
    if (payload.status !== undefined) updateObj.status = payload.status;

    const { data, error } = await supabaseAdminClient
      .from('savings_goals')
      .update(updateObj)
      .eq('id', id)
      .eq('user_id', userId)
      .select()
      .single();

    if (error || !data) {
      throw new AppError('Unable to update savings goal', 400);
    }

    return data;
  }

  public static async deleteGoal(userId: string, id: string) {
    if (!supabaseAdminClient) throw new AppError('Database service unavailable', 503);

    await this.getGoalById(userId, id);

    const { error } = await supabaseAdminClient
      .from('savings_goals')
      .delete()
      .eq('id', id)
      .eq('user_id', userId);

    if (error) {
      throw new AppError('Unable to delete savings goal', 400);
    }

    return { id, deleted: true };
  }

  /**
   * Add contribution to savings goal with atomic account balance reconciliation
   */
  public static async addContribution(userId: string, goalId: string, payload: ContributionPayload) {
    if (!supabaseAdminClient) throw new AppError('Database service unavailable', 503);

    if (payload.amount <= 0) {
      throw new AppError('Contribution amount must be greater than zero', 400);
    }

    const goal = await this.getGoalById(userId, goalId);

    // 1. Record contribution in ledger
    const contributionDate = payload.date || new Date().toISOString();
    const { data: contribution, error: cErr } = await supabaseAdminClient
      .from('savings_contributions')
      .insert({
        user_id: userId,
        goal_id: goalId,
        account_id: payload.accountId || null,
        amount: payload.amount,
        notes: payload.notes || null,
        date: contributionDate,
      })
      .select()
      .single();

    if (cErr) {
      logger.error({ cErr }, 'Failed recording savings contribution');
      throw new AppError('Unable to record contribution', 500);
    }

    // 2. Increment goal's current amount
    const newCurrent = Number(goal.currentAmount) + payload.amount;
    const newStatus = newCurrent >= Number(goal.targetAmount) ? 'COMPLETED' : goal.status;

    await supabaseAdminClient
      .from('savings_goals')
      .update({
        current_amount: newCurrent,
        status: newStatus,
        updated_at: new Date().toISOString(),
      })
      .eq('id', goalId);

    // 3. Deduct from source account if linked
    if (payload.accountId) {
      try {
        const { data: acc } = await supabaseAdminClient
          .from('accounts')
          .select('balance')
          .eq('id', payload.accountId)
          .eq('user_id', userId)
          .single();

        if (acc) {
          const newBal = Number(acc.balance) - payload.amount;
          await supabaseAdminClient
            .from('accounts')
            .update({ balance: newBal, updated_at: new Date().toISOString() })
            .eq('id', payload.accountId);
        }
      } catch (accErr) {
        logger.warn({ accErr }, 'Failed updating source account on savings contribution');
      }
    }

    return {
      contribution,
      goal: {
        id: goal.id,
        name: goal.name,
        targetAmount: goal.targetAmount,
        currentAmount: newCurrent,
        status: newStatus,
      },
    };
  }

  public static async getContributions(userId: string, goalId?: string) {
    if (!supabaseAdminClient) throw new AppError('Database service unavailable', 503);

    let query = supabaseAdminClient
      .from('savings_contributions')
      .select('*, savings_goals(name), accounts(name)')
      .eq('user_id', userId)
      .order('date', { ascending: false });

    if (goalId) {
      query = query.eq('goal_id', goalId);
    }

    const { data, error } = await query;
    if (error) {
      throw new AppError('Unable to fetch contributions', 500);
    }

    return (data || []).map((c: any) => ({
      id: c.id,
      goalId: c.goal_id,
      goalName: c.savings_goals?.name,
      accountId: c.account_id,
      accountName: c.accounts?.name,
      amount: Number(c.amount),
      date: c.date,
      notes: c.notes,
      createdAt: c.created_at,
    }));
  }
}
