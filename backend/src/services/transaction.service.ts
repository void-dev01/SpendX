import { supabaseClient } from '../config/supabase.js';
import { AppError } from '../middleware/errorHandler.js';
import { logger } from '../utils/logger.js';
import { Transaction, TransactionType } from '../types/index.js';

// In-memory fallback repository for transactions (supports tests and offline development)
const inMemoryTransactions: Transaction[] = [];

export interface QueryTransactionsParams {
  page?: number;
  limit?: number;
  type?: TransactionType;
  category?: string;
  startDate?: string;
  endDate?: string;
  search?: string;
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
    if (!supabaseClient) {
      const windowStart = new Date(new Date(date).getTime() - 24 * 60 * 60 * 1000).getTime();
      const windowEnd = new Date(new Date(date).getTime() + 24 * 60 * 60 * 1000).getTime();
      const found = inMemoryTransactions.some((t) => {
        if (t.userId !== userId || t.accountId !== accountId || t.amount !== amount || t.description !== description) {
          return false;
        }
        const tDate = new Date(t.date).getTime();
        return tDate >= windowStart && tDate <= windowEnd;
      });
      return found;
    }

    try {
      const windowStart = new Date(new Date(date).getTime() - 24 * 60 * 60 * 1000).toISOString();
      const windowEnd = new Date(new Date(date).getTime() + 24 * 60 * 60 * 1000).toISOString();

      const { data, error } = await supabaseClient
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
      return 'Dining Out';
    }
    if (text.includes('netflix') || text.includes('spotify') || text.includes('cinema') || text.includes('movie')) {
      return 'Entertainment';
    }
    if (text.includes('electric') || text.includes('water') || text.includes('internet') || text.includes('utility')) {
      return 'Utilities';
    }
    if (text.includes('salary') || text.includes('payroll') || text.includes('dividend')) {
      return 'Income';
    }
    return 'General';
  }

  public static async createTransaction(
    userId: string,
    data: Omit<Transaction, 'id' | 'userId' | 'createdAt' | 'updatedAt'>
  ): Promise<Transaction> {
    const isDuplicate = await this.detectDuplicate(
      userId,
      data.accountId,
      data.amount,
      data.date,
      data.description
    );

    if (isDuplicate) {
      throw new AppError('Potential duplicate transaction detected within 24-hour window', 409);
    }

    const assignedCategory = data.category || this.inferCategory(data.description);

    if (!supabaseClient) {
      const newTxn: Transaction = {
        id: `txn_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        userId,
        ...data,
        category: assignedCategory,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      inMemoryTransactions.unshift(newTxn);
      return newTxn;
    }

    const { data: record, error } = await supabaseClient
      .from('transactions')
      .insert({
        user_id: userId,
        account_id: data.accountId,
        amount: data.amount,
        type: data.type,
        category: assignedCategory,
        description: data.description,
        date: data.date,
        merchant_name: data.merchantName,
        is_recurring: data.isRecurring,
      })
      .select()
      .single();

    if (error || !record) {
      logger.error({ error }, 'Failed to insert transaction into Supabase');
      throw new AppError('Failed to record transaction', 500);
    }

    return {
      id: record.id,
      userId: record.user_id,
      accountId: record.account_id,
      amount: record.amount,
      type: record.type,
      category: record.category,
      description: record.description,
      date: record.date,
      merchantName: record.merchant_name,
      isRecurring: record.is_recurring,
      createdAt: record.created_at,
      updatedAt: record.updated_at,
    };
  }

  public static async getTransactions(
    userId: string,
    params: QueryTransactionsParams
  ): Promise<{ transactions: Transaction[]; total: number; page: number; limit: number }> {
    const page = params.page || 1;
    const limit = params.limit || 20;

    if (!supabaseClient) {
      let filtered = inMemoryTransactions.filter((t) => t.userId === userId);
      if (params.type) filtered = filtered.filter((t) => t.type === params.type);
      if (params.category) filtered = filtered.filter((t) => t.category.toLowerCase() === params.category!.toLowerCase());
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

    let query = supabaseClient
      .from('transactions')
      .select('*', { count: 'exact' })
      .eq('user_id', userId)
      .order('date', { ascending: false });

    if (params.type) query = query.eq('type', params.type);
    if (params.category) query = query.eq('category', params.category);
    if (params.startDate) query = query.gte('date', params.startDate);
    if (params.endDate) query = query.lte('date', params.endDate);
    if (params.search) query = query.ilike('description', `%${params.search}%`);

    const from = (page - 1) * limit;
    const to = from + limit - 1;
    query = query.range(from, to);

    const { data, count, error } = await query;
    if (error) {
      logger.error({ error }, 'Failed to fetch transactions');
      throw new AppError('Failed to fetch transactions', 500);
    }

    const transactions: Transaction[] = (data || []).map((record) => ({
      id: record.id,
      userId: record.user_id,
      accountId: record.account_id,
      amount: record.amount,
      type: record.type,
      category: record.category,
      description: record.description,
      date: record.date,
      merchantName: record.merchant_name,
      isRecurring: record.is_recurring,
      createdAt: record.created_at,
      updatedAt: record.updated_at,
    }));

    return {
      transactions,
      total: count || transactions.length,
      page,
      limit,
    };
  }

  public static async getTransactionById(userId: string, id: string): Promise<Transaction> {
    if (!supabaseClient) {
      const txn = inMemoryTransactions.find((t) => t.id === id && t.userId === userId);
      if (!txn) throw new AppError('Transaction not found', 404);
      return txn;
    }

    const { data, error } = await supabaseClient
      .from('transactions')
      .select('*')
      .eq('id', id)
      .eq('user_id', userId)
      .single();

    if (error || !data) throw new AppError('Transaction not found', 404);

    return {
      id: data.id,
      userId: data.user_id,
      accountId: data.account_id,
      amount: data.amount,
      type: data.type,
      category: data.category,
      description: data.description,
      date: data.date,
      merchantName: data.merchant_name,
      isRecurring: data.is_recurring,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    };
  }

  public static async updateTransaction(
    userId: string,
    id: string,
    updates: Partial<Omit<Transaction, 'id' | 'userId' | 'createdAt' | 'updatedAt'>>
  ): Promise<Transaction> {
    if (!supabaseClient) {
      const idx = inMemoryTransactions.findIndex((t) => t.id === id && t.userId === userId);
      if (idx === -1) throw new AppError('Transaction not found', 404);
      inMemoryTransactions[idx] = {
        ...inMemoryTransactions[idx],
        ...updates,
        updatedAt: new Date().toISOString(),
      };
      return inMemoryTransactions[idx];
    }

    const payload: Record<string, unknown> = {};
    if (updates.accountId) payload.account_id = updates.accountId;
    if (updates.amount !== undefined) payload.amount = updates.amount;
    if (updates.type) payload.type = updates.type;
    if (updates.category) payload.category = updates.category;
    if (updates.description) payload.description = updates.description;
    if (updates.date) payload.date = updates.date;
    if (updates.merchantName !== undefined) payload.merchant_name = updates.merchantName;
    if (updates.isRecurring !== undefined) payload.is_recurring = updates.isRecurring;

    const { data, error } = await supabaseClient
      .from('transactions')
      .update(payload)
      .eq('id', id)
      .eq('user_id', userId)
      .select()
      .single();

    if (error || !data) throw new AppError('Transaction update failed or not found', 404);

    return {
      id: data.id,
      userId: data.user_id,
      accountId: data.account_id,
      amount: data.amount,
      type: data.type,
      category: data.category,
      description: data.description,
      date: data.date,
      merchantName: data.merchant_name,
      isRecurring: data.is_recurring,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    };
  }

  public static async deleteTransaction(userId: string, id: string): Promise<void> {
    if (!supabaseClient) {
      const idx = inMemoryTransactions.findIndex((t) => t.id === id && t.userId === userId);
      if (idx === -1) throw new AppError('Transaction not found', 404);
      inMemoryTransactions.splice(idx, 1);
      return;
    }

    const { error, count } = await supabaseClient
      .from('transactions')
      .delete()
      .eq('id', id)
      .eq('user_id', userId);

    if (error) throw new AppError('Failed to delete transaction', 500);
    if (count === 0) throw new AppError('Transaction not found', 404);
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
