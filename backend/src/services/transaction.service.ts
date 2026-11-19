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
    if (process.env.NODE_ENV === 'test') {
      const windowStart = new Date(new Date(date).getTime() - 24 * 60 * 60 * 1000).getTime();
      const windowEnd = new Date(new Date(date).getTime() + 24 * 60 * 60 * 1000).getTime();
      const txns = localStore.getTransactions();
      const found = txns.some((t) => {
        if (t.userId !== userId || t.accountId !== accountId || Math.abs(t.amount - amount) > 0.001 || t.description !== description) {
          return false;
        }
        const tDate = new Date(t.date).getTime();
        return tDate >= windowStart && tDate <= windowEnd;
      });
      return found;
    }

    const db = getDbClient();
    if (db) {
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

        if (error) {
          logger.error({ error }, 'Error querying database for duplicate transactions');
          return false;
        }

        return (data && data.length > 0) || false;
      } catch (err) {
        logger.error({ err }, 'Failed duplicate check execution');
        return false;
      }
    }

    return false;
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
    if (text.includes('restaurant') || text.includes('cafe') || text.includes('coffee') || text.includes('starbucks')) {
      return 'Food & Dining';
    }
    if (text.includes('netflix') || text.includes('spotify') || text.includes('cinema') || text.includes('movie')) {
      return 'Entertainment & Leisure';
    }
    if (text.includes('electric') || text.includes('water') || text.includes('internet') || text.includes('utility')) {
      return 'Utilities & Bills';
    }
    if (text.includes('salary') || text.includes('payroll') || text.includes('dividend')) {
      return 'Salary';
    }
    if (text.includes('rent') || text.includes('housing') || text.includes('apartment')) {
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

    if (process.env.NODE_ENV === 'test') {
      const newTxn: Transaction = {
        id: txnId,
        userId,
        ...data,
        amount,
        category: assignedCategory,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      const txns = localStore.getTransactions();
      txns.unshift(newTxn);
      localStore.saveTransactions(txns);

      // Reconcile localStore linked account
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

    const db = getDbClient();
    if (db) {
      try {
        const { data: record, error } = await db
          .from('transactions')
          .insert({
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
            is_recurring: Boolean(data.isRecurring),
            status: data.status || 'COMPLETED',
            notes: data.notes || null,
          })
          .select()
          .single();

        if (error || !record) {
          logger.error({ error }, 'Failed to insert transaction into Supabase');
          throw new AppError('Failed to record transaction: ' + (error?.message || 'DB error'), 500);
        }

        // Reconcile real Supabase Account Balance
        try {
          const { data: acc } = await db
            .from('accounts')
            .select('balance, type')
            .eq('id', data.accountId)
            .eq('user_id', userId)
            .single();

          if (acc) {
            let newBal = Number(acc.balance) || 0;
            if (data.type === 'EXPENSE') {
              newBal = acc.type === 'CREDIT_CARD' ? newBal + amount : newBal - amount;
            } else if (data.type === 'INCOME') {
              newBal = acc.type === 'CREDIT_CARD' ? newBal - amount : newBal + amount;
            }

            await db
              .from('accounts')
              .update({ balance: Math.round(newBal * 100) / 100, updated_at: new Date().toISOString() })
              .eq('id', data.accountId)
              .eq('user_id', userId);
          }
        } catch (accErr) {
          logger.warn({ accErr }, 'Could not automatically reconcile account balance');
        }

        return {
          id: record.id,
          userId: record.user_id,
          accountId: record.account_id,
          amount: Number(record.amount),
          type: record.type,
          category: record.category,
          description: record.description,
          date: record.date,
          paymentMethod: record.payment_method,
          status: record.status,
          merchantName: record.merchant_name || undefined,
          isRecurring: record.is_recurring,
          notes: record.notes || undefined,
          createdAt: record.created_at,
          updatedAt: record.updated_at,
        };
      } catch (err) {
        if (err instanceof AppError) throw err;
        logger.error({ err }, 'Error in createTransaction');
        throw new AppError('Failed to create transaction', 500);
      }
    }

    throw new AppError('Database connection unavailable', 503);
  }

  public static async getTransactions(
    userId: string,
    params: QueryTransactionsParams
  ): Promise<{ transactions: Transaction[]; total: number; page: number; limit: number }> {
    const page = Math.max(1, params.page || 1);
    const limit = Math.min(100, Math.max(1, params.limit || 20));

    if (process.env.NODE_ENV === 'test') {
      const txns = localStore.getTransactions();
      let filtered = txns.filter((t) => t.userId === userId || userId === 'usr_dev_local_spendx');
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

    const db = getDbClient();
    if (db) {
      try {
        let query = db
          .from('transactions')
          .select('*, accounts(name)', { count: 'exact' })
          .eq('user_id', userId)
          .order('date', { ascending: false });

        if (params.type) query = query.eq('type', params.type);
        if (params.category) query = query.eq('category', params.category);
        if (params.accountId) query = query.eq('account_id', params.accountId);
        if (params.startDate) query = query.gte('date', params.startDate);
        if (params.endDate) query = query.lte('date', params.endDate);
        if (params.search) query = query.ilike('description', `%${params.search}%`);

        const from = (page - 1) * limit;
        const to = from + limit - 1;
        query = query.range(from, to);

        const { data, count, error } = await query;
        if (error) {
          logger.error({ error }, 'Failed to fetch transactions from Supabase');
          throw new AppError('Failed to fetch transactions', 500);
        }

        const transactions: Transaction[] = (data || []).map((record: any) => ({
          id: record.id,
          userId: record.user_id,
          accountId: record.account_id,
          accountName: record.accounts?.name || undefined,
          amount: Number(record.amount),
          type: record.type,
          category: record.category,
          description: record.description,
          date: record.date,
          paymentMethod: record.payment_method,
          status: record.status,
          merchantName: record.merchant_name || undefined,
          isRecurring: record.is_recurring,
          notes: record.notes || undefined,
          createdAt: record.created_at,
          updatedAt: record.updated_at,
        }));

        return {
          transactions,
          total: count ?? transactions.length,
          page,
          limit,
        };
      } catch (err) {
        if (err instanceof AppError) throw err;
        logger.error({ err }, 'Error querying transactions');
        return { transactions: [], total: 0, page, limit };
      }
    }

    return { transactions: [], total: 0, page, limit };
  }

  public static async getTransactionById(userId: string, id: string): Promise<Transaction> {
    if (process.env.NODE_ENV === 'test') {
      const txns = localStore.getTransactions();
      const txn = txns.find((t) => t.id === id && (t.userId === userId || userId === 'usr_dev_local_spendx'));
      if (!txn) throw new AppError('Transaction not found', 404);
      return txn;
    }

    const db = getDbClient();
    if (db) {
      const { data, error } = await db
        .from('transactions')
        .select('*, accounts(name)')
        .eq('id', id)
        .eq('user_id', userId)
        .single();

      if (error || !data) throw new AppError('Transaction not found', 404);

      return {
        id: data.id,
        userId: data.user_id,
        accountId: data.account_id,
        accountName: data.accounts?.name || undefined,
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

    throw new AppError('Database connection unavailable', 503);
  }

  public static async updateTransaction(
    userId: string,
    id: string,
    updates: Partial<Omit<Transaction, 'id' | 'userId' | 'createdAt' | 'updatedAt'>>
  ): Promise<Transaction> {
    const existing = await this.getTransactionById(userId, id);

    if (process.env.NODE_ENV === 'test') {
      const txns = localStore.getTransactions();
      const idx = txns.findIndex((t) => t.id === id && (t.userId === userId || userId === 'usr_dev_local_spendx'));
      if (idx === -1) throw new AppError('Transaction not found', 404);
      const oldTxn = txns[idx];
      txns[idx] = {
        ...txns[idx],
        ...updates,
        updatedAt: new Date().toISOString(),
      };
      const updatedTxn = txns[idx];
      localStore.saveTransactions(txns);

      // Reconcile balance adjustment on linked account
      const accounts = localStore.getAccounts();
      const linkedAcc = accounts.find((a) => a.id === updatedTxn.accountId);
      if (linkedAcc) {
        if (oldTxn.type === 'EXPENSE') linkedAcc.balance += Math.abs(oldTxn.amount);
        if (oldTxn.type === 'INCOME') linkedAcc.balance -= Math.abs(oldTxn.amount);
        if (updatedTxn.type === 'EXPENSE') linkedAcc.balance -= Math.abs(updatedTxn.amount);
        if (updatedTxn.type === 'INCOME') linkedAcc.balance += Math.abs(updatedTxn.amount);
        linkedAcc.updatedAt = new Date().toISOString();
        localStore.saveAccounts(accounts);
      }

      return updatedTxn;
    }

    const db = getDbClient();
    if (db) {
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

      const { data, error } = await db
        .from('transactions')
        .update(payload)
        .eq('id', id)
        .eq('user_id', userId)
        .select()
        .single();

      if (error || !data) throw new AppError('Transaction update failed or not found', 404);

      // Reconcile balance on account in Supabase
      try {
        const targetAccountId = updates.accountId || existing.accountId;
        const { data: acc } = await db
          .from('accounts')
          .select('balance, type')
          .eq('id', targetAccountId)
          .eq('user_id', userId)
          .single();

        if (acc) {
          let bal = Number(acc.balance) || 0;
          // Revert old transaction
          if (existing.type === 'EXPENSE') bal = acc.type === 'CREDIT_CARD' ? bal - existing.amount : bal + existing.amount;
          else if (existing.type === 'INCOME') bal = acc.type === 'CREDIT_CARD' ? bal + existing.amount : bal - existing.amount;

          // Apply new transaction
          const newAmt = updates.amount !== undefined ? Number(updates.amount) : existing.amount;
          const newType = updates.type || existing.type;
          if (newType === 'EXPENSE') bal = acc.type === 'CREDIT_CARD' ? bal + newAmt : bal - newAmt;
          else if (newType === 'INCOME') bal = acc.type === 'CREDIT_CARD' ? bal - newAmt : bal + newAmt;

          await db
            .from('accounts')
            .update({ balance: Math.round(bal * 100) / 100, updated_at: new Date().toISOString() })
            .eq('id', targetAccountId)
            .eq('user_id', userId);
        }
      } catch (balErr) {
        logger.warn({ balErr }, 'Failed updating account balance on transaction update');
      }

      return {
        id: data.id,
        userId: data.user_id,
        accountId: data.account_id,
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

    throw new AppError('Database connection unavailable', 503);
  }

  public static async deleteTransaction(userId: string, id: string): Promise<void> {
    const existing = await this.getTransactionById(userId, id);

    if (process.env.NODE_ENV === 'test') {
      const txns = localStore.getTransactions();
      const idx = txns.findIndex((t) => t.id === id && (t.userId === userId || userId === 'usr_dev_local_spendx'));
      if (idx === -1) throw new AppError('Transaction not found', 404);
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

      return;
    }

    const db = getDbClient();
    if (db) {
      const { error } = await db
        .from('transactions')
        .delete()
        .eq('id', id)
        .eq('user_id', userId);

      if (error) {
        logger.error({ error }, 'Failed to delete transaction from Supabase');
        throw new AppError('Failed to delete transaction', 500);
      }

      // Reverse balance impact on account
      try {
        const { data: acc } = await db
          .from('accounts')
          .select('balance, type')
          .eq('id', existing.accountId)
          .eq('user_id', userId)
          .single();

        if (acc) {
          let bal = Number(acc.balance) || 0;
          if (existing.type === 'EXPENSE') {
            bal = acc.type === 'CREDIT_CARD' ? bal - existing.amount : bal + existing.amount;
          } else if (existing.type === 'INCOME') {
            bal = acc.type === 'CREDIT_CARD' ? bal + existing.amount : bal - existing.amount;
          }

          await db
            .from('accounts')
            .update({ balance: Math.round(bal * 100) / 100, updated_at: new Date().toISOString() })
            .eq('id', existing.accountId)
            .eq('user_id', userId);
        }
      } catch (accErr) {
        logger.warn({ accErr }, 'Failed reversing account balance on transaction delete');
      }

      return;
    }

    throw new AppError('Database connection unavailable', 503);
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
