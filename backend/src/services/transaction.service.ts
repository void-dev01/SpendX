import crypto from 'crypto';
import { getDbClient } from '../config/supabase.js';
import { AppError } from '../middleware/errorHandler.js';
import { logger } from '../utils/logger.js';
import { Transaction, TransactionType } from '../types/index.js';
import { localStore } from '../db/localStore.js';

export interface QueryTransactionsParams {
  page?: number;
  limit?: number;
  type?: TransactionType;
  category?: string;
  startDate?: string;
  endDate?: string;
  search?: string;
  accountId?: string;
}

export class TransactionService {
  /**
   * Checks for duplicate transactions within a 24-hour window with matching amount, merchant and account.
   */
  public static async detectDuplicate(
    userId: string,
    accountId: string,
    amount: number,
    date: string,
    description: string
  ): Promise<boolean> {
    const db = getDbClient();
    if (db && process.env.NODE_ENV !== 'test') {
      try {
        const windowStart = new Date(new Date(date).getTime() - 24 * 60 * 60 * 1000).toISOString();
        const windowEnd = new Date(new Date(date).getTime() + 24 * 60 * 60 * 1000).toISOString();

        const { data, error } = await db
          .from('transactions')
          .select('id')
          .eq('user_id', userId)
          .eq('account_id', accountId)
          .eq('amount', amount)
          .eq('description', description)
          .gte('date', windowStart)
          .lte('date', windowEnd)
          .limit(1);

        if (!error && data && data.length > 0) {
          return true;
        }
      } catch (err) {
        logger.warn({ err }, 'Database duplicate check failed, checking localStore');
      }
    }

    const windowStart = new Date(new Date(date).getTime() - 24 * 60 * 60 * 1000).getTime();
    const windowEnd = new Date(new Date(date).getTime() + 24 * 60 * 60 * 1000).getTime();
    const txns = localStore.getTransactions();
    return txns.some((t) => {
      if (t.userId !== userId || t.accountId !== accountId || Math.abs(t.amount - amount) > 0.001 || t.description !== description) {
        return false;
      }
      const tDate = new Date(t.date).getTime();
      return tDate >= windowStart && tDate <= windowEnd;
    });
  }

  /**
   * Rule-based categorization fallback before AI inference
   */
  public static inferCategory(description: string): string {
    const text = description.toLowerCase();
    if (text.includes('grocery') || text.includes('supermarket') || text.includes('mart') || text.includes('food')) {
      return 'Groceries';
    }
    if (text.includes('uber') || text.includes('lyft') || text.includes('fuel') || text.includes('gas') || text.includes('metro')) {
      return 'Transportation';
    }
    if (text.includes('restaurant') || text.includes('cafe') || text.includes('coffee') || text.includes('starbucks') || text.includes('bistro')) {
      return 'Food & Dining';
    }
    if (text.includes('netflix') || text.includes('spotify') || text.includes('cinema') || text.includes('movie')) {
      return 'Entertainment & Leisure';
    }
    if (text.includes('electric') || text.includes('water') || text.includes('internet') || text.includes('utility') || text.includes('fiber')) {
      return 'Bills & Utilities';
    }
    if (text.includes('salary') || text.includes('payroll') || text.includes('dividend') || text.includes('credit')) {
      return 'Salary';
    }
    if (text.includes('rent') || text.includes('housing') || text.includes('apartment') || text.includes('maintenance')) {
      return 'Housing & Rent';
    }
    if (text.includes('hospital') || text.includes('pharmacy') || text.includes('medicine') || text.includes('doctor')) {
      return 'Healthcare & Medical';
    }
    if (text.includes('shopping') || text.includes('amazon') || text.includes('flipkart') || text.includes('clothing')) {
      return 'Shopping & Electronics';
    }
    return 'Other';
  }

  public static async createTransaction(
    userId: string,
    data: Omit<Transaction, 'id' | 'userId' | 'createdAt' | 'updatedAt'>
  ): Promise<Transaction> {
    const amount = Math.round(Number(data.amount) * 100) / 100;
    if (isNaN(amount) || amount <= 0) {
      throw new AppError('Transaction amount must be a positive number', 400);
    }

    const isDuplicate = await this.detectDuplicate(
      userId,
      data.accountId,
      amount,
      data.date,
      data.description
    );

    if (isDuplicate) {
      throw new AppError('Potential duplicate transaction detected within 24-hour window', 409);
    }

    const assignedCategory = data.category || this.inferCategory(data.description);
    const txnId = crypto.randomUUID();

    const newTxn: Transaction = {
      id: txnId,
      userId,
      ...data,
      amount,
      category: assignedCategory,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const db = getDbClient();
    if (db && process.env.NODE_ENV !== 'test') {
      try {
        await db.from('transactions').insert({
          id: txnId,
          user_id: userId,
          account_id: data.accountId,
          amount,
          type: data.type,
          category: assignedCategory,
          description: data.description,
          date: data.date,
          payment_method: data.paymentMethod || 'UPI',
          merchant_name: data.merchantName || null,
          is_recurring: data.isRecurring || false,
          notes: data.notes || null,
          status: data.status || 'COMPLETED',
        });

        // Update account balance in Supabase
        const { data: acc } = await db
          .from('accounts')
          .select('balance, type')
          .eq('id', data.accountId)
          .eq('user_id', userId)
          .single();

        if (acc) {
          let bal = Number(acc.balance) || 0;
          if (data.type === 'EXPENSE') bal = acc.type === 'CREDIT_CARD' ? bal + amount : bal - amount;
          else if (data.type === 'INCOME') bal = acc.type === 'CREDIT_CARD' ? bal - amount : bal + amount;

          await db
            .from('accounts')
            .update({ balance: Math.round(bal * 100) / 100, updated_at: new Date().toISOString() })
            .eq('id', data.accountId)
            .eq('user_id', userId);
        }
      } catch (err) {
        logger.warn({ err }, 'Supabase createTransaction failed, saving to localStore');
      }
    }

    // Always persist to localStore
    const txns = localStore.getTransactions();
    txns.unshift(newTxn);
    localStore.saveTransactions(txns);

    // Reconcile and update linked account balance in localStore
    const accounts = localStore.getAccounts();
    const linkedAcc = accounts.find((a) => a.id === data.accountId);
    if (linkedAcc) {
      if (data.type === 'EXPENSE') {
        linkedAcc.balance = linkedAcc.type === 'CREDIT_CARD' ? linkedAcc.balance + amount : linkedAcc.balance - amount;
      } else if (data.type === 'INCOME') {
        linkedAcc.balance = linkedAcc.type === 'CREDIT_CARD' ? linkedAcc.balance - amount : linkedAcc.balance + amount;
      }
      linkedAcc.updatedAt = new Date().toISOString();
      localStore.saveAccounts(accounts);
    }

    return newTxn;
  }

  public static async getTransactions(
    userId: string,
    params: QueryTransactionsParams
  ): Promise<{ transactions: Transaction[]; total: number; page: number; limit: number }> {
    const page = Math.max(1, params.page || 1);
    const limit = Math.min(100, Math.max(1, params.limit || 20));

    const db = getDbClient();
    if (db && process.env.NODE_ENV !== 'test') {
      try {
        let query = db
          .from('transactions')
          .select('*, accounts(name)', { count: 'exact' })
          .eq('user_id', userId)
          .order('date', { ascending: false });

        if (params.type) query = query.eq('type', params.type);
        if (params.category) query = query.ilike('category', params.category);
        if (params.accountId) query = query.eq('account_id', params.accountId);
        if (params.startDate) query = query.gte('date', params.startDate);
        if (params.endDate) query = query.lte('date', params.endDate);
        if (params.search) {
          query = query.or(`description.ilike.%${params.search}%,merchant_name.ilike.%${params.search}%`);
        }

        const from = (page - 1) * limit;
        const to = from + limit - 1;
        const { data, count, error } = await query.range(from, to);

        if (!error && data && data.length > 0) {
          const transactions: Transaction[] = data.map((row: any) => ({
            id: row.id,
            userId: row.user_id,
            accountId: row.account_id,
            accountName: row.accounts?.name,
            amount: Number(row.amount),
            type: row.type,
            category: row.category,
            description: row.description,
            date: row.date,
            paymentMethod: row.payment_method,
            status: row.status,
            merchantName: row.merchant_name || undefined,
            isRecurring: row.is_recurring,
            notes: row.notes || undefined,
            createdAt: row.created_at,
            updatedAt: row.updated_at,
          }));

          return {
            transactions,
            total: count ?? transactions.length,
            page,
            limit,
          };
        }
      } catch (err) {
        logger.warn({ err }, 'Error querying Supabase transactions, using localStore');
      }
    }

    // LocalStore fallback
    const txns = localStore.getTransactions();
    let filtered = txns.filter((t) => t.userId === userId);
    if (params.type) filtered = filtered.filter((t) => t.type === params.type);
    if (params.category) filtered = filtered.filter((t) => t.category.toLowerCase() === params.category!.toLowerCase());
    if (params.accountId) filtered = filtered.filter((t) => t.accountId === params.accountId);
    if (params.startDate) filtered = filtered.filter((t) => new Date(t.date) >= new Date(params.startDate!));
    if (params.endDate) filtered = filtered.filter((t) => new Date(t.date) <= new Date(params.endDate!));
    if (params.search) {
      const s = params.search.toLowerCase();
      filtered = filtered.filter((t) => t.description.toLowerCase().includes(s) || (t.merchantName && t.merchantName.toLowerCase().includes(s)));
    }

    const total = filtered.length;
    const startIndex = (page - 1) * limit;
    const transactions = filtered.slice(startIndex, startIndex + limit);
    return { transactions, total, page, limit };
  }

  public static async getTransactionById(userId: string, id: string): Promise<Transaction> {
    const db = getDbClient();
    if (db && process.env.NODE_ENV !== 'test') {
      try {
        const { data, error } = await db
          .from('transactions')
          .select('*, accounts(name)')
          .eq('id', id)
          .eq('user_id', userId)
          .single();

        if (!error && data) {
          return {
            id: data.id,
            userId: data.user_id,
            accountId: data.account_id,
            accountName: data.accounts?.name,
            amount: Number(data.amount),
            type: data.type,
            category: data.category,
            description: data.description,
            date: data.date,
            paymentMethod: data.payment_method,
            status: data.status,
            merchantName: data.merchant_name || undefined,
            isRecurring: data.is_recurring,
            notes: data.notes || undefined,
            createdAt: data.created_at,
            updatedAt: data.updated_at,
          };
        }
      } catch (err) {
        logger.warn({ err }, 'Supabase getTransactionById failed, looking up in localStore');
      }
    }

    const txns = localStore.getTransactions();
    const txn = txns.find((t) => t.id === id && t.userId === userId);
    if (!txn) throw new AppError('Transaction not found', 404);
    return txn;
  }

  public static async updateTransaction(
    userId: string,
    id: string,
    updates: Partial<Omit<Transaction, 'id' | 'userId' | 'createdAt' | 'updatedAt'>>
  ): Promise<Transaction> {
    await this.getTransactionById(userId, id);

    const db = getDbClient();
    if (db && process.env.NODE_ENV !== 'test') {
      try {
        const payload: Record<string, unknown> = { updated_at: new Date().toISOString() };
        if (updates.accountId) payload.account_id = updates.accountId;
        if (updates.amount !== undefined) payload.amount = Math.round(Number(updates.amount) * 100) / 100;
        if (updates.type) payload.type = updates.type;
        if (updates.category) payload.category = updates.category;
        if (updates.description) payload.description = updates.description;
        if (updates.date) payload.date = updates.date;
        if (updates.paymentMethod) payload.payment_method = updates.paymentMethod;
        if (updates.merchantName !== undefined) payload.merchant_name = updates.merchantName;
        if (updates.isRecurring !== undefined) payload.is_recurring = updates.isRecurring;
        if (updates.status !== undefined) payload.status = updates.status;
        if (updates.notes !== undefined) payload.notes = updates.notes;

        await db.from('transactions').update(payload).eq('id', id).eq('user_id', userId);
      } catch (err) {
        logger.warn({ err }, 'Supabase updateTransaction failed');
      }
    }

    const txns = localStore.getTransactions();
    const idx = txns.findIndex((t) => t.id === id && t.userId === userId);
    if (idx === -1) throw new AppError('Transaction not found', 404);

    const updated: Transaction = {
      ...txns[idx],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    txns[idx] = updated;
    localStore.saveTransactions(txns);

    return updated;
  }

  public static async deleteTransaction(userId: string, id: string): Promise<void> {
    await this.getTransactionById(userId, id);

    const db = getDbClient();
    if (db && process.env.NODE_ENV !== 'test') {
      try {
        await db.from('transactions').delete().eq('id', id).eq('user_id', userId);
      } catch (err) {
        logger.warn({ err }, 'Supabase deleteTransaction failed');
      }
    }

    const txns = localStore.getTransactions();
    const idx = txns.findIndex((t) => t.id === id && t.userId === userId);
    if (idx !== -1) {
      const deletedTxn = txns[idx];
      txns.splice(idx, 1);
      localStore.saveTransactions(txns);

      // Reconcile and reverse balance on linked account
      const accounts = localStore.getAccounts();
      const linkedAcc = accounts.find((a) => a.id === deletedTxn.accountId);
      if (linkedAcc) {
        if (deletedTxn.type === 'EXPENSE') {
          linkedAcc.balance = linkedAcc.type === 'CREDIT_CARD' ? linkedAcc.balance - Math.abs(deletedTxn.amount) : linkedAcc.balance + Math.abs(deletedTxn.amount);
        } else if (deletedTxn.type === 'INCOME') {
          linkedAcc.balance = linkedAcc.type === 'CREDIT_CARD' ? linkedAcc.balance + Math.abs(deletedTxn.amount) : linkedAcc.balance - Math.abs(deletedTxn.amount);
        }
        linkedAcc.updatedAt = new Date().toISOString();
        localStore.saveAccounts(accounts);
      }
    }
  }

  public static async batchCreateTransactions(
    userId: string,
    items: Array<Omit<Transaction, 'id' | 'userId' | 'createdAt' | 'updatedAt'>>
  ): Promise<{ inserted: number; duplicates: number; items: Transaction[] }> {
    let inserted = 0;
    let duplicates = 0;
    const createdItems: Transaction[] = [];

    for (const item of items) {
      const isDup = await this.detectDuplicate(
        userId,
        item.accountId,
        item.amount,
        item.date,
        item.description
      );

      if (isDup) {
        duplicates++;
        continue;
      }

      const created = await this.createTransaction(userId, item);
      createdItems.push(created);
      inserted++;
    }

    return { inserted, duplicates, items: createdItems };
  }
}
