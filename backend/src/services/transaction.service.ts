import { supabaseClient } from '../config/supabase.js';
import { AppError } from '../middleware/errorHandler.js';
import { logger } from '../utils/logger.js';
import { Transaction } from '../types/index.js';

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
      // In standalone/mock development mode
      return false;
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
      // Mock return for local development without DB connection
      return {
        id: `txn_${Date.now()}`,
        userId,
        ...data,
        category: assignedCategory,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
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
}
