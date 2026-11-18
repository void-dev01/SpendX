import { supabaseAdminClient } from '../config/supabase.js';
import { AppError } from '../middleware/errorHandler.js';
import { logger } from '../utils/logger.js';

export interface RecurringPayload {
  name: string;
  merchant: string;
  category: string;
  amount: number;
  frequency: 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'QUARTERLY' | 'YEARLY';
  startDate: string;
  nextDueDate: string;
  linkedAccountId?: string;
  notes?: string;
}

export class RecurringService {
  public static async getRecurringPayments(userId: string) {
    if (!supabaseAdminClient) throw new AppError('Database service unavailable', 503);

    const { data, error } = await supabaseAdminClient
      .from('recurring_payments')
      .select('*, accounts(id, name)')
      .eq('user_id', userId)
      .order('next_due_date', { ascending: true });

    if (error) {
      logger.error({ error, userId }, 'Failed fetching recurring payments');
      throw new AppError('Unable to fetch recurring payments', 500);
    }

    return (data || []).map((r: any) => ({
      id: r.id,
      userId: r.user_id,
      name: r.name,
      merchant: r.merchant,
      category: r.category,
      amount: Number(r.amount),
      frequency: r.frequency,
      startDate: r.start_date,
      nextDueDate: r.next_due_date,
      linkedAccountId: r.linked_account_id,
      linkedAccountName: r.accounts?.name,
      status: r.status,
      notes: r.notes,
      lastPaidDate: r.last_paid_date,
      createdAt: r.created_at,
      updatedAt: r.updated_at,
    }));
  }

  public static async getById(userId: string, id: string) {
    if (!supabaseAdminClient) throw new AppError('Database service unavailable', 503);

    const { data, error } = await supabaseAdminClient
      .from('recurring_payments')
      .select('*, accounts(id, name)')
      .eq('id', id)
      .eq('user_id', userId)
      .single();

    if (error || !data) {
      throw new AppError('Recurring commitment not found', 404);
    }

    return {
      id: data.id,
      userId: data.user_id,
      name: data.name,
      merchant: data.merchant,
      category: data.category,
      amount: Number(data.amount),
      frequency: data.frequency,
      startDate: data.start_date,
      nextDueDate: data.next_due_date,
      linkedAccountId: data.linked_account_id,
      linkedAccountName: data.accounts?.name,
      status: data.status,
      notes: data.notes,
      lastPaidDate: data.last_paid_date,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    };
  }

  public static async create(userId: string, payload: RecurringPayload) {
    if (!supabaseAdminClient) throw new AppError('Database service unavailable', 503);

    const { data, error } = await supabaseAdminClient
      .from('recurring_payments')
      .insert({
        user_id: userId,
        name: payload.name,
        merchant: payload.merchant,
        category: payload.category,
        amount: payload.amount,
        frequency: payload.frequency,
        start_date: payload.startDate,
        next_due_date: payload.nextDueDate,
        linked_account_id: payload.linkedAccountId || null,
        status: 'UPCOMING',
        notes: payload.notes || null,
      })
      .select()
      .single();

    if (error) {
      logger.error({ error, userId }, 'Failed creating recurring schedule');
      throw new AppError('Unable to create recurring payment: ' + error.message, 400);
    }

    return data;
  }

  public static async update(userId: string, id: string, payload: Partial<RecurringPayload>) {
    if (!supabaseAdminClient) throw new AppError('Database service unavailable', 503);

    await this.getById(userId, id);

    const updateObj: Record<string, any> = { updated_at: new Date().toISOString() };
    if (payload.name !== undefined) updateObj.name = payload.name;
    if (payload.merchant !== undefined) updateObj.merchant = payload.merchant;
    if (payload.category !== undefined) updateObj.category = payload.category;
    if (payload.amount !== undefined) updateObj.amount = payload.amount;
    if (payload.frequency !== undefined) updateObj.frequency = payload.frequency;
    if (payload.startDate !== undefined) updateObj.start_date = payload.startDate;
    if (payload.nextDueDate !== undefined) updateObj.next_due_date = payload.nextDueDate;
    if (payload.linkedAccountId !== undefined) updateObj.linked_account_id = payload.linkedAccountId;
    if (payload.notes !== undefined) updateObj.notes = payload.notes;

    const { data, error } = await supabaseAdminClient
      .from('recurring_payments')
      .update(updateObj)
      .eq('id', id)
      .eq('user_id', userId)
      .select()
      .single();

    if (error || !data) {
      throw new AppError('Unable to update recurring schedule', 400);
    }

    return data;
  }

  public static async updateStatus(
    userId: string,
    id: string,
    status: 'UPCOMING' | 'DUE_TODAY' | 'OVERDUE' | 'PAID' | 'PAUSED' | 'CANCELLED'
  ) {
    if (!supabaseAdminClient) throw new AppError('Database service unavailable', 503);

    await this.getById(userId, id);

    const updateObj: Record<string, any> = {
      status,
      updated_at: new Date().toISOString(),
    };

    if (status === 'PAID') {
      updateObj.last_paid_date = new Date().toISOString();
    }

    const { data, error } = await supabaseAdminClient
      .from('recurring_payments')
      .update(updateObj)
      .eq('id', id)
      .eq('user_id', userId)
      .select()
      .single();

    if (error || !data) {
      throw new AppError('Unable to update status', 400);
    }

    return data;
  }

  public static async delete(userId: string, id: string) {
    if (!supabaseAdminClient) throw new AppError('Database service unavailable', 503);

    await this.getById(userId, id);

    const { error } = await supabaseAdminClient
      .from('recurring_payments')
      .delete()
      .eq('id', id)
      .eq('user_id', userId);

    if (error) {
      throw new AppError('Unable to delete recurring payment', 400);
    }

    return { id, deleted: true };
  }
}
