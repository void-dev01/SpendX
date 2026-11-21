import crypto from 'crypto';
import { getDbClient } from '../config/supabase.js';
import { AppError } from '../middleware/errorHandler.js';
import { logger } from '../utils/logger.js';
import { RecurringRecord } from '../types/index.js';
import {
  CreateRecurringInput,
  UpdateRecurringInput,
} from '../validators/recurring.validator.js';
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
    const db = getDbClient();
    if (db && process.env.NODE_ENV !== 'test') {
      try {
        const { data, error } = await db
          .from('recurring_payments')
          .select('*, accounts(name)')
          .eq('user_id', userId)
          .order('next_due_date', { ascending: true });

        if (!error && data && data.length > 0) {
          return data.map((row: any) => ({
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
        }
      } catch (err) {
        logger.warn({ err }, 'Supabase getRecurring failed, falling back to localStore');
      }
    }

    const rec = localStore.getRecurring();
    return rec.filter((r) => r.userId === userId);
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
    if (db && process.env.NODE_ENV !== 'test') {
      try {
        await db.from('recurring_payments').insert({
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
        });
      } catch (err) {
        logger.warn({ err }, 'Supabase createRecurring failed, persisting to localStore');
      }
    }

    const rec = localStore.getRecurring();
    rec.unshift(newRecord);
    localStore.saveRecurring(rec);
    return newRecord;
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

    if (db && process.env.NODE_ENV !== 'test') {
      try {
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

        await db.from('recurring_payments').update(payload).eq('id', id).eq('user_id', userId);
      } catch (err) {
        logger.warn({ err }, 'Supabase updateRecurring failed');
      }
    }

    const rec = localStore.getRecurring();
    const inMemIdx = rec.findIndex((r) => r.id === id);
    if (inMemIdx !== -1) {
      rec[inMemIdx] = updated;
      localStore.saveRecurring(rec);
    }
    return updated;
  }

  public static async deleteRecurring(userId: string, id: string): Promise<boolean> {
    await this.getRecurringById(userId, id);
    const db = getDbClient();

    if (db && process.env.NODE_ENV !== 'test') {
      try {
        await db.from('recurring_payments').delete().eq('id', id).eq('user_id', userId);
      } catch (err) {
        logger.warn({ err }, 'Supabase deleteRecurring failed');
      }
    }

    const rec = localStore.getRecurring();
    const filtered = rec.filter((r) => r.id !== id);
    localStore.saveRecurring(filtered);
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
    const txns = localStore.getTransactions().filter((t) => t.userId === userId && new Date(t.date) >= new Date(startDate));

    const groups = new Map<string, Array<{ date: string; amount: number }>>();

    for (const t of txns) {
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
