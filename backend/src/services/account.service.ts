import { supabaseAdminClient } from '../config/supabase.js';
import { AppError } from '../middleware/errorHandler.js';
import { logger } from '../utils/logger.js';

export interface AccountPayload {
  name: string;
  institution?: string;
  type: 'BANK' | 'SAVINGS' | 'CREDIT_CARD' | 'CASH' | 'INVESTMENT' | 'OTHER';
  balance: number;
  currency?: string;
  lastFourDigits?: string;
  notes?: string;
}

export class AccountService {
  public static async getAccounts(userId: string) {
    if (!supabaseAdminClient) {
      throw new AppError('Database service unavailable', 503);
    }

    const { data, error } = await supabaseAdminClient
      .from('accounts')
      .select('*')
      .eq('user_id', userId)
      .eq('status', 'ACTIVE')
      .order('created_at', { ascending: true });

    if (error) {
      logger.error({ error, userId }, 'Failed to fetch user accounts');
      throw new AppError('Unable to fetch accounts', 500);
    }

    return data || [];
  }

  public static async getAccountById(userId: string, id: string) {
    if (!supabaseAdminClient) throw new AppError('Database service unavailable', 503);

    const { data, error } = await supabaseAdminClient
      .from('accounts')
      .select('*')
      .eq('id', id)
      .eq('user_id', userId)
      .single();

    if (error || !data) {
      throw new AppError('Account not found', 404);
    }

    return data;
  }

  public static async createAccount(userId: string, payload: AccountPayload) {
    if (!supabaseAdminClient) throw new AppError('Database service unavailable', 503);

    const { data, error } = await supabaseAdminClient
      .from('accounts')
      .insert({
        user_id: userId,
        name: payload.name,
        institution: payload.institution || 'Direct',
        type: payload.type,
        balance: payload.balance,
        currency: payload.currency || 'INR',
        last_four_digits: payload.lastFourDigits || null,
        notes: payload.notes || null,
        status: 'ACTIVE',
      })
      .select()
      .single();

    if (error) {
      logger.error({ error, userId }, 'Failed creating account');
      throw new AppError('Unable to create account: ' + error.message, 400);
    }

    return data;
  }

  public static async updateAccount(userId: string, id: string, payload: Partial<AccountPayload>) {
    if (!supabaseAdminClient) throw new AppError('Database service unavailable', 503);

    // Verify ownership
    await this.getAccountById(userId, id);

    const updateObj: Record<string, any> = { updated_at: new Date().toISOString() };
    if (payload.name !== undefined) updateObj.name = payload.name;
    if (payload.institution !== undefined) updateObj.institution = payload.institution;
    if (payload.type !== undefined) updateObj.type = payload.type;
    if (payload.balance !== undefined) updateObj.balance = payload.balance;
    if (payload.currency !== undefined) updateObj.currency = payload.currency;
    if (payload.lastFourDigits !== undefined) updateObj.last_four_digits = payload.lastFourDigits;
    if (payload.notes !== undefined) updateObj.notes = payload.notes;

    const { data, error } = await supabaseAdminClient
      .from('accounts')
      .update(updateObj)
      .eq('id', id)
      .eq('user_id', userId)
      .select()
      .single();

    if (error) {
      logger.error({ error, userId, id }, 'Failed updating account');
      throw new AppError('Unable to update account', 400);
    }

    return data;
  }

  public static async deleteAccount(userId: string, id: string) {
    if (!supabaseAdminClient) throw new AppError('Database service unavailable', 503);

    // Verify ownership
    await this.getAccountById(userId, id);

    // Soft delete by archiving to preserve foreign key transaction ledger history
    const { error } = await supabaseAdminClient
      .from('accounts')
      .update({ status: 'ARCHIVED', updated_at: new Date().toISOString() })
      .eq('id', id)
      .eq('user_id', userId);

    if (error) {
      logger.error({ error, userId, id }, 'Failed archiving account');
      throw new AppError('Unable to archive account', 400);
    }

    return { id, archived: true };
  }

  /**
   * Atomic Account-to-Account Transfer
   */
  public static async transferFunds(
    userId: string,
    params: {
      fromAccountId: string;
      toAccountId: string;
      amount: number;
      notes?: string;
      date?: string;
    }
  ) {
    if (!supabaseAdminClient) throw new AppError('Database service unavailable', 503);

    if (params.fromAccountId === params.toAccountId) {
      throw new AppError('Source and destination accounts must be distinct', 400);
    }
    if (params.amount <= 0) {
      throw new AppError('Transfer amount must be greater than zero', 400);
    }

    const fromAcc = await this.getAccountById(userId, params.fromAccountId);
    const toAcc = await this.getAccountById(userId, params.toAccountId);

    const transferDate = params.date || new Date().toISOString();
    const notes = params.notes || `Transfer from ${fromAcc.name} to ${toAcc.name}`;

    // Update balances
    const newFromBal = Number(fromAcc.balance) - params.amount;
    const newToBal = Number(toAcc.balance) + params.amount;

    await supabaseAdminClient
      .from('accounts')
      .update({ balance: newFromBal, updated_at: new Date().toISOString() })
      .eq('id', fromAcc.id);

    await supabaseAdminClient
      .from('accounts')
      .update({ balance: newToBal, updated_at: new Date().toISOString() })
      .eq('id', toAcc.id);

    // Record transfer transaction on source account
    const { data: txn, error: txnErr } = await supabaseAdminClient
      .from('transactions')
      .insert({
        user_id: userId,
        account_id: fromAcc.id,
        amount: params.amount,
        type: 'TRANSFER',
        category: 'Transfer',
        description: `Transfer to ${toAcc.name}`,
        merchant_name: toAcc.name,
        date: transferDate,
        payment_method: 'Bank Transfer',
        status: 'COMPLETED',
        notes,
      })
      .select()
      .single();

    if (txnErr) {
      logger.error({ txnErr }, 'Failed recording transfer transaction');
    }

    return {
      success: true,
      transactionId: txn?.id,
      fromAccount: { id: fromAcc.id, name: fromAcc.name, balance: newFromBal },
      toAccount: { id: toAcc.id, name: toAcc.name, balance: newToBal },
    };
  }
}
