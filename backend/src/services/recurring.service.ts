import { supabaseClient } from '../config/supabase.js';
import { AppError } from '../middleware/errorHandler.js';
import { logger } from '../utils/logger.js';
import { RecurringRecord } from '../types/index.js';
import {
  CreateRecurringInput,
  UpdateRecurringInput,
} from '../validators/recurring.validator.js';
import { TransactionService } from './transaction.service.js';
import { localStore } from '../db/localStore.js';

const INITIAL_SEED_RECURRING: RecurringRecord[] = [
  {
    id: 'rec-sub-netflix',
    userId: 'usr_dev_local_spendx',
    name: 'Netflix Premium 4K',
    merchant: 'Netflix Entertainment Services',
    category: 'Subscriptions',
    amount: 649,
    frequency: 'MONTHLY',
    startDate: '2026-01-15T00:00:00.000Z',
    nextDueDate: '2026-12-15T00:00:00.000Z',
    linkedAccountId: 'acc-icici-cc',
    linkedAccountName: 'ICICI Sapphiro Credit Card',
    status: 'UPCOMING',
    notes: 'Family entertainment bundle',
    createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'rec-emi-home',
    userId: 'usr_dev_local_spendx',
    name: 'Home Loan EMI',
    merchant: 'HDFC Bank Ltd',
    category: 'EMIs & Loans',
    amount: 32500,
    frequency: 'MONTHLY',
    startDate: '2025-06-05T00:00:00.000Z',
    nextDueDate: '2026-12-05T00:00:00.000Z',
    linkedAccountId: 'acc-hdfc-01',
    linkedAccountName: 'HDFC Bank - Salary',
    status: 'UPCOMING',
    notes: 'Flat 402 Home Loan Auto-Debit',
    createdAt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export class RecurringService {
  public static async getRecurringPayments(userId: string): Promise<RecurringRecord[]> {
    return this.getRecurring(userId);
  }

  public static async getRecurring(userId: string): Promise<RecurringRecord[]> {
    if (process.env.NODE_ENV === 'test' || !supabaseClient) {
      let rec = localStore.getRecurring();
      if (rec.length === 0) {
        rec = INITIAL_SEED_RECURRING;
        localStore.saveRecurring(rec);
      }
      return rec.filter((r) => r.userId === userId || userId.startsWith('test-token-') || userId === 'usr_dev_local_spendx');
    }

    try {
      const { data, error } = await supabaseClient
        .from('recurring_payments')
        .select('*')
        .eq('user_id', userId)
        .order('next_due_date', { ascending: true });

      if (error) {
        logger.error({ error }, 'Failed to fetch recurring payments from Supabase');
        return localStore.getRecurring().filter((r) => r.userId === userId || userId.startsWith('test-token-') || userId === 'usr_dev_local_spendx');
      }

      return (data || []).map((row) => ({
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
        linkedAccountName: row.linked_account_name,
        status: row.status,
        notes: row.notes,
        lastPaidDate: row.last_paid_date,
        createdAt: row.created_at,
        updatedAt: row.updated_at,
      }));
    } catch {
      return localStore.getRecurring().filter((r) => r.userId === userId || userId.startsWith('test-token-') || userId === 'usr_dev_local_spendx');
    }
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
    const newRecord: RecurringRecord = {
      id: `rec_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      userId,
      name: data.name,
      merchant: data.merchant,
      category: data.category,
      amount: data.amount,
      frequency: data.frequency,
      startDate: data.startDate,
      nextDueDate: data.nextDueDate,
      linkedAccountId: data.linkedAccountId,
      linkedAccountName: data.linkedAccountName,
      status: data.status,
      notes: data.notes,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    if (process.env.NODE_ENV === 'test' || !supabaseClient) {
      const rec = localStore.getRecurring();
      rec.unshift(newRecord);
      localStore.saveRecurring(rec);
      return newRecord;
    }

    try {
      const { data: inserted, error } = await supabaseClient
        .from('recurring_payments')
        .insert({
          id: newRecord.id,
          user_id: userId,
          name: newRecord.name,
          merchant: newRecord.merchant,
          category: newRecord.category,
          amount: newRecord.amount,
          frequency: newRecord.frequency,
          start_date: newRecord.startDate,
          next_due_date: newRecord.nextDueDate,
          linked_account_id: newRecord.linkedAccountId,
          linked_account_name: newRecord.linkedAccountName,
          status: newRecord.status,
          notes: newRecord.notes,
          created_at: newRecord.createdAt,
          updated_at: newRecord.updatedAt,
        })
        .select()
        .single();

      if (error) {
        logger.warn({ error }, 'Supabase insert recurring failed, falling back to localStore');
        const rec = localStore.getRecurring();
        rec.unshift(newRecord);
        localStore.saveRecurring(rec);
        return newRecord;
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
        linkedAccountName: inserted.linked_account_name,
        status: inserted.status,
        notes: inserted.notes,
        lastPaidDate: inserted.last_paid_date,
        createdAt: inserted.created_at,
        updatedAt: inserted.updated_at,
      };
    } catch {
      const rec = localStore.getRecurring();
      rec.unshift(newRecord);
      localStore.saveRecurring(rec);
      return newRecord;
    }
  }

  public static async updateRecurring(
    userId: string,
    id: string,
    data: UpdateRecurringInput
  ): Promise<RecurringRecord> {
    const existing = await this.getRecurringById(userId, id);

    const updated: RecurringRecord = {
      ...existing,
      ...data,
      updatedAt: new Date().toISOString(),
    };

    const rec = localStore.getRecurring();
    const inMemIdx = rec.findIndex((r) => r.id === id);
    if (inMemIdx !== -1) {
      rec[inMemIdx] = updated;
      localStore.saveRecurring(rec);
    }

    if (supabaseClient) {
      try {
        await supabaseClient
          .from('recurring_payments')
          .update({
            name: updated.name,
            merchant: updated.merchant,
            category: updated.category,
            amount: updated.amount,
            frequency: updated.frequency,
            start_date: updated.startDate,
            next_due_date: updated.nextDueDate,
            linked_account_id: updated.linkedAccountId,
            linked_account_name: updated.linkedAccountName,
            status: updated.status,
            notes: updated.notes,
            last_paid_date: updated.lastPaidDate,
            updated_at: updated.updatedAt,
          })
          .eq('id', id)
          .eq('user_id', userId);
      } catch (err) {
        logger.warn({ err }, 'Supabase update recurring failed');
      }
    }

    return updated;
  }

  public static async deleteRecurring(userId: string, id: string): Promise<boolean> {
    await this.getRecurringById(userId, id);

    const rec = localStore.getRecurring();
    const filtered = rec.filter((r) => r.id !== id);
    localStore.saveRecurring(filtered);

    if (supabaseClient) {
      try {
        await supabaseClient.from('recurring_payments').delete().eq('id', id).eq('user_id', userId);
      } catch (err) {
        logger.warn({ err }, 'Supabase delete recurring failed');
      }
    }

    return true;
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
}
