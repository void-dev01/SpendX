import crypto from 'crypto';
import { getDbClient } from '../config/supabase.js';
import { AppError } from '../middleware/errorHandler.js';
import { logger } from '../utils/logger.js';
import { RecurringRecord } from '../types/index.js';
import {
  CreateRecurringInput,
  UpdateRecurringInput,
} from '../validators/recurring.validator.js';
import { TransactionService } from './transaction.service.js';
import { localStore } from '../db/localStore.js';

const normalizeStatus = (status?: string): 'UPCOMING' | 'DUE_TODAY' | 'OVERDUE' | 'PAID' | 'PAUSED' | 'CANCELLED' => {
  if (!status) return 'UPCOMING';
  const upper = status.toUpperCase();
  if (upper === 'ACTIVE') return 'UPCOMING';
  if (['UPCOMING', 'DUE_TODAY', 'OVERDUE', 'PAID', 'PAUSED', 'CANCELLED'].includes(upper)) {
    return upper as any;
  }
  return 'UPCOMING';
};

export class RecurringService {
  public static async getRecurringPayments(userId: string): Promise<RecurringRecord[]> {
    return this.getRecurring(userId);
  }

  public static async getRecurring(userId: string): Promise<RecurringRecord[]> {
    if (process.env.NODE_ENV === 'test') {
      const rec = localStore.getRecurring();
      return rec.filter((r) => r.userId === userId || userId === 'usr_dev_local_spendx');
    }

    const db = getDbClient();
    if (db) {
      try {
        const { data, error } = await db
          .from('recurring_payments')
          .select('*, accounts(name)')
          .eq('user_id', userId)
          .order('next_due_date', { ascending: true });

        if (error) {
          logger.error({ error }, 'Failed to fetch recurring payments from Supabase');
          throw new AppError('Failed to fetch recurring payments', 500);
        }

        return (data || []).map((row: any) => ({
          id: row.id,
          userId: row.user_id,
          name: row.name,
          merchant: row.merchant,
          category: row.category,
          amount: Number(row.amount),
          frequency: row.frequency,
          startDate: row.start_date,
          nextDueDate: row.next_due_date,
          linkedAccountId: row.linked_account_id,
          linkedAccountName: row.accounts?.name || undefined,
          status: row.status,
          notes: row.notes,
          lastPaidDate: row.last_paid_date,
          createdAt: row.created_at,
          updatedAt: row.updated_at,
        }));
      } catch (err) {
        if (err instanceof AppError) throw err;
        logger.error({ err }, 'Error querying recurring payments');
        return [];
      }
    }

    return [];
  }

  public static async getRecurringById(userId: string, id: string): Promise<RecurringRecord> {
    const list = await this.getRecurring(userId);
    const item = list.find((r) => r.id === id);
    if (!item) {
      throw new AppError('Recurring payment schedule not found', 404);
    }
    return item;
  }

  public static async createRecurring(userId: string, data: CreateRecurringInput): Promise<RecurringRecord> {
    const recId = crypto.randomUUID();
    const amount = Math.round(Number(data.amount) * 100) / 100;
    if (isNaN(amount) || amount <= 0) {
      throw new AppError('Amount must be positive', 400);
    }

    const startDate = data.startDate || new Date().toISOString();
    const status = normalizeStatus(data.status);

    const newRecord: RecurringRecord = {
      id: recId,
      userId,
      name: data.name,
      merchant: data.merchant,
      category: data.category,
      amount,
      frequency: data.frequency,
      startDate,
      nextDueDate: data.nextDueDate,
      linkedAccountId: data.linkedAccountId,
      linkedAccountName: data.linkedAccountName,
      status,
      notes: data.notes,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const db = getDbClient();

    if (process.env.NODE_ENV === 'test') {
      const rec = localStore.getRecurring();
      rec.unshift(newRecord);
      localStore.saveRecurring(rec);
      return newRecord;
    }

    if (db) {
      try {
        const { data: inserted, error } = await db
          .from('recurring_payments')
          .insert({
            id: recId,
            user_id: userId,
            name: newRecord.name,
            merchant: newRecord.merchant,
            category: newRecord.category,
            amount: newRecord.amount,
            frequency: newRecord.frequency,
            start_date: newRecord.startDate,
            next_due_date: newRecord.nextDueDate,
            linked_account_id: newRecord.linkedAccountId || null,
            status: newRecord.status,
            notes: newRecord.notes || null,
          })
          .select('*, accounts(name)')
          .single();

        if (error || !inserted) {
          logger.error({ error }, 'Supabase insert recurring failed');
          throw new AppError('Failed to create recurring payment: ' + (error?.message || ''), 500);
        }

        return {
          id: inserted.id,
          userId: inserted.user_id,
          name: inserted.name,
          merchant: inserted.merchant,
          category: inserted.category,
          amount: Number(inserted.amount),
          frequency: inserted.frequency,
          startDate: inserted.start_date,
          nextDueDate: inserted.next_due_date,
          linkedAccountId: inserted.linked_account_id,
          linkedAccountName: inserted.accounts?.name || data.linkedAccountName,
          status: inserted.status,
          notes: inserted.notes,
          lastPaidDate: inserted.last_paid_date,
          createdAt: inserted.created_at,
          updatedAt: inserted.updated_at,
        };
      } catch (err) {
        if (err instanceof AppError) throw err;
        logger.error({ err }, 'Exception creating recurring payment');
        throw new AppError('Failed to create recurring payment', 500);
      }
    }

    throw new AppError('Database connection unavailable', 503);
  }

  public static async updateRecurring(
    userId: string,
    id: string,
    data: UpdateRecurringInput
  ): Promise<RecurringRecord> {
    const existing = await this.getRecurringById(userId, id);
    const db = getDbClient();

    const updated: RecurringRecord = {
      ...existing,
      ...data,
      amount: data.amount !== undefined ? Number(data.amount) : existing.amount,
      status: data.status ? normalizeStatus(data.status) : existing.status,
      updatedAt: new Date().toISOString(),
    };

    if (process.env.NODE_ENV === 'test') {
      const rec = localStore.getRecurring();
      const inMemIdx = rec.findIndex((r) => r.id === id);
      if (inMemIdx !== -1) {
        rec[inMemIdx] = updated;
        localStore.saveRecurring(rec);
      }
      return updated;
    }

    if (db) {
      const payload: Record<string, unknown> = { updated_at: updated.updatedAt };
      if (data.name !== undefined) payload.name = data.name;
      if (data.merchant !== undefined) payload.merchant = data.merchant;
      if (data.category !== undefined) payload.category = data.category;
      if (data.amount !== undefined) payload.amount = Number(data.amount);
      if (data.frequency !== undefined) payload.frequency = data.frequency;
      if (data.startDate !== undefined) payload.start_date = data.startDate;
      if (data.nextDueDate !== undefined) payload.next_due_date = data.nextDueDate;
      if (data.linkedAccountId !== undefined) payload.linked_account_id = data.linkedAccountId;
      if (data.status !== undefined) payload.status = normalizeStatus(data.status);
      if (data.notes !== undefined) payload.notes = data.notes;

      const { data: result, error } = await db
        .from('recurring_payments')
        .update(payload)
        .eq('id', id)
        .eq('user_id', userId)
        .select('*, accounts(name)')
        .single();

      if (error || !result) {
        logger.error({ error }, 'Failed to update recurring payment');
        throw new AppError('Failed to update recurring payment schedule', 500);
      }

      return {
        id: result.id,
        userId: result.user_id,
        name: result.name,
        merchant: result.merchant,
        category: result.category,
        amount: Number(result.amount),
        frequency: result.frequency,
        startDate: result.start_date,
        nextDueDate: result.next_due_date,
        linkedAccountId: result.linked_account_id,
        linkedAccountName: result.accounts?.name || updated.linkedAccountName,
        status: result.status,
        notes: result.notes,
        lastPaidDate: result.last_paid_date,
        createdAt: result.created_at,
        updatedAt: result.updated_at,
      };
    }

    throw new AppError('Database connection unavailable', 503);
  }

  public static async deleteRecurring(userId: string, id: string): Promise<boolean> {
    await this.getRecurringById(userId, id);
    const db = getDbClient();

    if (process.env.NODE_ENV === 'test') {
      const rec = localStore.getRecurring();
      const filtered = rec.filter((r) => r.id !== id);
      localStore.saveRecurring(filtered);
      return true;
    }

    if (db) {
      const { error } = await db
        .from('recurring_payments')
        .delete({ count: 'exact' })
        .eq('id', id)
        .eq('user_id', userId);

      if (error) {
        logger.error({ error }, 'Failed to delete recurring payment');
        throw new AppError('Failed to delete recurring payment', 500);
      }
      return true;
    }

    throw new AppError('Database connection unavailable', 503);
  }

  /**
   * Scans user transactions over lookback window to detect repeating amount/merchant patterns.
   */
  public static async detectPatterns(
    userId: string,
    lookbackDays = 90
  ): Promise<Array<{ merchant: string; amount: number; frequency: string; occurrences: number; confidence: number }>> {
    const startDate = new Date(Date.now() - lookbackDays * 24 * 60 * 60 * 1000).toISOString();
    const result = await TransactionService.getTransactions(userId, { startDate, limit: 1000 });
    const transactions = result.transactions;

    const groups = new Map<string, Array<{ date: string; amount: number }>>();

    for (const t of transactions) {
      if (t.type !== 'EXPENSE') continue;
      const key = `${(t.merchantName || t.description).trim().toLowerCase()}__${t.amount}`;
      if (!groups.has(key)) {
        groups.set(key, []);
      }
      groups.get(key)!.push({ date: t.date, amount: t.amount });
    }

    const detected: Array<{ merchant: string; amount: number; frequency: string; occurrences: number; confidence: number }> = [];

    for (const [key, items] of groups.entries()) {
      if (items.length >= 2) {
        const [merchant, amtStr] = key.split('__');
        detected.push({
          merchant: merchant.charAt(0).toUpperCase() + merchant.slice(1),
          amount: parseFloat(amtStr),
          frequency: 'MONTHLY',
          occurrences: items.length,
          confidence: Math.min(95, 60 + items.length * 10),
        });
      }
    }

    return detected;
  }

  public static async executeScheduledPayment(
    userId: string,
    recurringId: string,
    paidDate = new Date().toISOString()
  ): Promise<{ transactionId: string; nextDueDate: string }> {
    const recurring = await this.getRecurringById(userId, recurringId);

    if (!recurring.linkedAccountId) {
      throw new AppError('Recurring payment does not have a linked account configured', 400);
    }

    // Record formal transaction
    const txn = await TransactionService.createTransaction(userId, {
      accountId: recurring.linkedAccountId,
      amount: recurring.amount,
      type: 'EXPENSE',
      category: recurring.category,
      description: `Auto-Debit: ${recurring.name}`,
      merchantName: recurring.merchant,
      date: paidDate,
      isRecurring: true,
    });

    // Compute next due date based on frequency
    const curDue = new Date(recurring.nextDueDate);
    const nextDue = new Date(curDue);

    switch (recurring.frequency) {
      case 'DAILY':
        nextDue.setDate(curDue.getDate() + 1);
        break;
      case 'WEEKLY':
        nextDue.setDate(curDue.getDate() + 7);
        break;
      case 'MONTHLY':
        nextDue.setMonth(curDue.getMonth() + 1);
        break;
      case 'QUARTERLY':
        nextDue.setMonth(curDue.getMonth() + 3);
        break;
      case 'YEARLY':
        nextDue.setFullYear(curDue.getFullYear() + 1);
        break;
    }

    await this.updateRecurring(userId, recurringId, {
      nextDueDate: nextDue.toISOString(),
      status: 'UPCOMING',
    });

    return {
      transactionId: txn.id,
      nextDueDate: nextDue.toISOString(),
    };
  }
}
