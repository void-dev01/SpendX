import { supabaseAdminClient, supabaseClient } from '../config/supabase.js';
import { AppError } from '../middleware/errorHandler.js';
import { logger } from '../utils/logger.js';
import { Transaction } from '../types/index.js';

export interface TransactionFilterOptions {
  page?: number;
  limit?: number;
  search?: string;
  type?: 'ALL' | 'INCOME' | 'EXPENSE' | 'TRANSFER';
  category?: string;
  accountId?: string;
  startDate?: string;
  endDate?: string;
  sortBy?: 'date' | 'amount' | 'created_at';
  sortOrder?: 'asc' | 'desc';
}

export class TransactionService {
  private static getClient() {
    return supabaseAdminClient || supabaseClient;
  }

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
    const client = this.getClient();
    if (!client || process.env.NODE_ENV === 'test') {
      return false;
    }

    try {
      const windowStart = new Date(new Date(date).getTime() - 24 * 60 * 60 * 1000).toISOString();
      const windowEnd = new Date(new Date(date).getTime() + 24 * 60 * 60 * 1000).toISOString();

      const { data, error } = await client
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

      return Boolean(data && data.length > 0);
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
    if (text.includes('grocery') || text.includes('supermarket') || text.includes('mart') || text.includes('food') || text.includes('swiggy') || text.includes('zomato')) {
      return 'Food & Dining';
    }
    if (text.includes('uber') || text.includes('ola') || text.includes('fuel') || text.includes('petrol') || text.includes('metro')) {
      return 'Transport';
    }
    if (text.includes('amazon') || text.includes('flipkart') || text.includes('myntra') || text.includes('shoes') || text.includes('clothing')) {
      return 'Shopping';
    }
    if (text.includes('netflix') || text.includes('spotify') || text.includes('cinema') || text.includes('pvr') || text.includes('hotstar')) {
      return 'Entertainment';
    }
    if (text.includes('electric') || text.includes('water') || text.includes('wifi') || text.includes('airtel') || text.includes('jio') || text.includes('bill')) {
      return 'Bills & Utilities';
    }
    if (text.includes('salary') || text.includes('payroll') || text.includes('stipend')) {
      return 'Salary';
    }
    if (text.includes('freelance') || text.includes('consulting')) {
      return 'Freelance';
    }
    if (text.includes('hospital') || text.includes('pharmacy') || text.includes('doctor') || text.includes('apollo')) {
      return 'Healthcare';
    }
    if (text.includes('rent') || text.includes('maintenance')) {
      return 'Housing & Rent';
    }
    return 'Other';
  }

  /**
   * Fetch paginated and filtered transactions
   */
  public static async getTransactions(userId: string, options: TransactionFilterOptions = {}) {
    const client = this.getClient();
    if (!client) throw new AppError('Database service unavailable', 503);

    const page = Math.max(1, options.page || 1);
    const limit = Math.min(100, Math.max(1, options.limit || 20));
    const offset = (page - 1) * limit;

    let query = client
      .from('transactions')
      .select('*, accounts(id, name, type)', { count: 'exact' })
      .eq('user_id', userId);

    if (options.type && options.type !== 'ALL') {
      query = query.eq('type', options.type);
    }
    if (options.category && options.category !== 'ALL') {
      query = query.eq('category', options.category);
    }
    if (options.accountId && options.accountId !== 'ALL') {
      query = query.eq('account_id', options.accountId);
    }
    if (options.startDate) {
      query = query.gte('date', options.startDate);
    }
    if (options.endDate) {
      query = query.lte('date', options.endDate);
    }
    if (options.search) {
      query = query.or(`description.ilike.%${options.search}%,merchant_name.ilike.%${options.search}%`);
    }

    const sortField = options.sortBy || 'date';
    const sortOrder = options.sortOrder === 'asc' ? true : false;
    query = query.order(sortField, { ascending: sortOrder }).range(offset, offset + limit - 1);

    const { data, count, error } = await query;

    if (error) {
      logger.error({ error, userId }, 'Failed fetching transactions');
      throw new AppError('Unable to fetch transactions', 500);
    }

    const items = (data || []).map((t: any) => ({
      id: t.id,
      userId: t.user_id,
      accountId: t.account_id,
      accountName: t.accounts?.name || 'Primary Account',
      amount: Number(t.amount),
      type: t.type,
      category: t.category,
      description: t.description,
      merchantName: t.merchant_name,
      date: t.date,
      paymentMethod: t.payment_method || 'UPI',
      status: t.status || 'COMPLETED',
      notes: t.notes,
      isRecurring: Boolean(t.is_recurring),
      referenceNumber: t.reference_number,
      createdAt: t.created_at,
      updatedAt: t.updated_at,
    }));

    return {
      items,
      total: count || 0,
      page,
      limit,
      totalPages: Math.ceil((count || 0) / limit),
    };
  }

  public static async getTransactionById(userId: string, id: string) {
    const client = this.getClient();
    if (!client) throw new AppError('Database service unavailable', 503);

    const { data, error } = await client
      .from('transactions')
      .select('*, accounts(id, name, type)')
      .eq('id', id)
      .eq('user_id', userId)
      .single();

    if (error || !data) {
      throw new AppError('Transaction not found', 404);
    }

    return {
      id: data.id,
      userId: data.user_id,
      accountId: data.account_id,
      accountName: data.accounts?.name || 'Primary Account',
      amount: Number(data.amount),
      type: data.type,
      category: data.category,
      description: data.description,
      merchantName: data.merchant_name,
      date: data.date,
      paymentMethod: data.payment_method || 'UPI',
      status: data.status || 'COMPLETED',
      notes: data.notes,
      isRecurring: Boolean(data.is_recurring),
      referenceNumber: data.reference_number,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    };
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
    const client = this.getClient();

    if (!client || process.env.NODE_ENV === 'test') {
      // Return deterministic fixture for mock/isolated test run
      return {
        id: `txn_${Date.now()}`,
        userId,
        ...data,
        category: assignedCategory,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
    }

    const { data: record, error } = await client
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
        payment_method: data.paymentMethod || 'UPI',
        status: data.status || 'COMPLETED',
        notes: data.notes || null,
        is_recurring: Boolean(data.isRecurring),
        reference_number: data.referenceNumber || null,
      })
      .select()
      .single();

    if (error || !record) {
      logger.error({ error, userId }, 'Failed to insert transaction into Supabase');
      throw new AppError('Failed to record transaction: ' + (error?.message || ''), 500);
    }

    // Adjust linked account balance
    try {
      const { data: account } = await client
        .from('accounts')
        .select('balance, type')
        .eq('id', data.accountId)
        .single();

      if (account) {
        let newBalance = Number(account.balance);
        if (data.type === 'INCOME') {
          newBalance += data.amount;
        } else if (data.type === 'EXPENSE') {
          if (account.type === 'CREDIT_CARD') {
            newBalance += data.amount; // increases credit card debt
          } else {
            newBalance -= data.amount;
          }
        }
        await client
          .from('accounts')
          .update({ balance: newBalance, updated_at: new Date().toISOString() })
          .eq('id', data.accountId);
      }
    } catch (balErr) {
      logger.warn({ balErr }, 'Failed updating account balance following transaction insertion');
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
      merchantName: record.merchant_name,
      isRecurring: record.is_recurring,
      paymentMethod: record.payment_method,
      status: record.status,
      notes: record.notes,
      referenceNumber: record.reference_number,
      createdAt: record.created_at,
      updatedAt: record.updated_at,
    };
  }

  public static async updateTransaction(
    userId: string,
    id: string,
    data: Partial<Transaction>
  ) {
    const client = this.getClient();
    if (!client) throw new AppError('Database service unavailable', 503);

    // Verify ownership
    const existing = await this.getTransactionById(userId, id);

    const updateObj: Record<string, any> = { updated_at: new Date().toISOString() };
    if (data.amount !== undefined) updateObj.amount = data.amount;
    if (data.type !== undefined) updateObj.type = data.type;
    if (data.category !== undefined) updateObj.category = data.category;
    if (data.description !== undefined) updateObj.description = data.description;
    if (data.merchantName !== undefined) updateObj.merchant_name = data.merchantName;
    if (data.date !== undefined) updateObj.date = data.date;
    if (data.paymentMethod !== undefined) updateObj.payment_method = data.paymentMethod;
    if (data.status !== undefined) updateObj.status = data.status;
    if (data.notes !== undefined) updateObj.notes = data.notes;
    if (data.isRecurring !== undefined) updateObj.is_recurring = data.isRecurring;

    const { data: record, error } = await client
      .from('transactions')
      .update(updateObj)
      .eq('id', id)
      .eq('user_id', userId)
      .select()
      .single();

    if (error || !record) {
      logger.error({ error, userId, id }, 'Failed updating transaction');
      throw new AppError('Unable to update transaction', 400);
    }

    // Reconcile balance difference if amount or type changed
    if (data.amount !== undefined && data.amount !== existing.amount) {
      try {
        const diff = data.amount - existing.amount;
        const { data: account } = await client
          .from('accounts')
          .select('balance, type')
          .eq('id', existing.accountId)
          .single();

        if (account) {
          let newBalance = Number(account.balance);
          if (existing.type === 'INCOME') {
            newBalance += diff;
          } else if (existing.type === 'EXPENSE') {
            if (account.type === 'CREDIT_CARD') {
              newBalance += diff;
            } else {
              newBalance -= diff;
            }
          }
          await client
            .from('accounts')
            .update({ balance: newBalance, updated_at: new Date().toISOString() })
            .eq('id', existing.accountId);
        }
      } catch (balErr) {
        logger.warn({ balErr }, 'Failed updating balance diff on transaction update');
      }
    }

    return record;
  }

  public static async deleteTransaction(userId: string, id: string) {
    const client = this.getClient();
    if (!client) throw new AppError('Database service unavailable', 503);

    // Verify ownership
    const existing = await this.getTransactionById(userId, id);

    const { error } = await client
      .from('transactions')
      .delete()
      .eq('id', id)
      .eq('user_id', userId);

    if (error) {
      logger.error({ error, userId, id }, 'Failed deleting transaction');
      throw new AppError('Unable to delete transaction', 400);
    }

    // Reverse balance effect on account
    try {
      const { data: account } = await client
        .from('accounts')
        .select('balance, type')
        .eq('id', existing.accountId)
        .single();

      if (account) {
        let newBalance = Number(account.balance);
        if (existing.type === 'INCOME') {
          newBalance -= existing.amount;
        } else if (existing.type === 'EXPENSE') {
          if (account.type === 'CREDIT_CARD') {
            newBalance -= existing.amount;
          } else {
            newBalance += existing.amount;
          }
        }
        await client
          .from('accounts')
          .update({ balance: newBalance, updated_at: new Date().toISOString() })
          .eq('id', existing.accountId);
      }
    } catch (balErr) {
      logger.warn({ balErr }, 'Failed reversing balance on transaction deletion');
    }

    return { id, deleted: true };
  }
}
