import crypto from 'crypto';
import { getDbClient } from '../config/supabase.js';
import { AppError } from '../middleware/errorHandler.js';
import { logger } from '../utils/logger.js';
import { AccountRecord } from '../types/index.js';
import { CreateAccountInput, UpdateAccountInput, TransferFundsInput } from '../validators/account.validator.js';
import { TransactionService } from './transaction.service.js';
import { localStore } from '../db/localStore.js';

export class AccountService {
  public static async getAccounts(userId: string): Promise<AccountRecord[]> {
    if (process.env.NODE_ENV === 'test') {
      const accounts = localStore.getAccounts();
      return accounts.filter((a) => a.userId === userId);
    }

    const db = getDbClient();
    if (db) {
      try {
        const { data, error } = await db
          .from('accounts')
          .select('*')
          .eq('user_id', userId)
          .eq('status', 'ACTIVE')
          .order('created_at', { ascending: false });

        if (error) {
          logger.error({ error }, 'Failed to fetch accounts from Supabase');
          if (process.env.NODE_ENV === 'test') {
            return localStore.getAccounts().filter((a) => a.userId === userId);
          }
          throw new AppError('Failed to fetch accounts', 500);
        }

        return (data || []).map((row) => ({
          id: row.id,
          userId: row.user_id,
          name: row.name,
          institution: row.institution || '',
          type: row.type,
          balance: Number(row.balance),
          currency: row.currency || 'INR',
          lastFourDigits: row.last_four_digits || undefined,
          notes: row.notes || undefined,
          status: row.status,
          createdAt: row.created_at,
          updatedAt: row.updated_at,
        }));
      } catch (err) {
        if (err instanceof AppError) throw err;
        logger.error({ err }, 'Error querying accounts');
        return [];
      }
    }

    return localStore.getAccounts().filter((a) => a.userId === userId);
  }

  public static async getAccountById(userId: string, accountId: string): Promise<AccountRecord> {
    if (process.env.NODE_ENV === 'test') {
      const accounts = localStore.getAccounts();
      const account = accounts.find((a) => a.id === accountId && a.userId === userId);
      if (!account) {
        throw new AppError('Account not found', 404);
      }
      return account;
    }

    const db = getDbClient();
    if (db) {
      const { data, error } = await db
        .from('accounts')
        .select('*')
        .eq('id', accountId)
        .eq('user_id', userId)
        .single();

      if (error || !data) {
        throw new AppError('Account not found', 404);
      }

      return {
        id: data.id,
        userId: data.user_id,
        name: data.name,
        institution: data.institution || '',
        type: data.type,
        balance: Number(data.balance),
        currency: data.currency || 'INR',
        lastFourDigits: data.last_four_digits || undefined,
        notes: data.notes || undefined,
        status: data.status,
        createdAt: data.created_at,
        updatedAt: data.updated_at,
      };
    }

    const accounts = localStore.getAccounts();
    const account = accounts.find((a) => a.id === accountId && a.userId === userId);
    if (!account) {
      throw new AppError('Account not found', 404);
    }
    return account;
  }

  public static async createAccount(userId: string, data: CreateAccountInput): Promise<AccountRecord> {
    const accountId = crypto.randomUUID();
    const newAccount: AccountRecord = {
      id: accountId,
      userId,
      name: data.name,
      institution: data.institution || '',
      type: data.type,
      balance: Number(data.balance) || 0,
      currency: data.currency || 'INR',
      lastFourDigits: data.lastFourDigits,
      notes: data.notes,
      status: data.status || 'ACTIVE',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const db = getDbClient();

    if (process.env.NODE_ENV === 'test') {
      const accounts = localStore.getAccounts();
      accounts.unshift(newAccount);
      localStore.saveAccounts(accounts);
      return newAccount;
    }

    if (db) {
      try {
        const { data: inserted, error } = await db
          .from('accounts')
          .insert({
            id: newAccount.id,
            user_id: userId,
            name: newAccount.name,
            institution: newAccount.institution || null,
            type: newAccount.type,
            balance: newAccount.balance,
            currency: newAccount.currency,
            last_four_digits: newAccount.lastFourDigits || null,
            notes: newAccount.notes || null,
            status: newAccount.status,
            created_at: newAccount.createdAt,
            updated_at: newAccount.updatedAt,
          })
          .select()
          .single();

        if (error || !inserted) {
          logger.error({ error }, 'Supabase insert account failed');
          throw new AppError('Failed to create account in database', 500);
        }

        return {
          id: inserted.id,
          userId: inserted.user_id,
          name: inserted.name,
          institution: inserted.institution || '',
          type: inserted.type,
          balance: Number(inserted.balance),
          currency: inserted.currency || 'INR',
          lastFourDigits: inserted.last_four_digits || undefined,
          notes: inserted.notes || undefined,
          status: inserted.status,
          createdAt: inserted.created_at,
          updatedAt: inserted.updated_at,
        };
      } catch (err) {
        if (err instanceof AppError) throw err;
        logger.error({ err }, 'Exception creating account');
        throw new AppError('Failed to create account', 500);
      }
    }

    const accounts = localStore.getAccounts();
    accounts.unshift(newAccount);
    localStore.saveAccounts(accounts);
    return newAccount;
  }

  public static async updateAccount(
    userId: string,
    accountId: string,
    data: UpdateAccountInput
  ): Promise<AccountRecord> {
    const existing = await this.getAccountById(userId, accountId);

    const updated: AccountRecord = {
      ...existing,
      ...data,
      balance: data.balance !== undefined ? Number(data.balance) : existing.balance,
      updatedAt: new Date().toISOString(),
    };

    const db = getDbClient();

    if (process.env.NODE_ENV === 'test') {
      const accounts = localStore.getAccounts();
      const inMemIdx = accounts.findIndex((a) => a.id === accountId);
      if (inMemIdx !== -1) {
        accounts[inMemIdx] = updated;
        localStore.saveAccounts(accounts);
      }
      return updated;
    }

    if (db) {
      try {
        const updatePayload: Record<string, any> = { updated_at: updated.updatedAt };
        if (data.name !== undefined) updatePayload.name = data.name;
        if (data.institution !== undefined) updatePayload.institution = data.institution;
        if (data.type !== undefined) updatePayload.type = data.type;
        if (data.balance !== undefined) updatePayload.balance = Number(data.balance);
        if (data.currency !== undefined) updatePayload.currency = data.currency;
        if (data.lastFourDigits !== undefined) updatePayload.last_four_digits = data.lastFourDigits;
        if (data.notes !== undefined) updatePayload.notes = data.notes;
        if (data.status !== undefined) updatePayload.status = data.status;

        const { data: result, error } = await db
          .from('accounts')
          .update(updatePayload)
          .eq('id', accountId)
          .eq('user_id', userId)
          .select()
          .single();

        if (error || !result) {
          logger.error({ error }, 'Supabase update account failed');
          throw new AppError('Failed to update account in database', 500);
        }

        return {
          id: result.id,
          userId: result.user_id,
          name: result.name,
          institution: result.institution || '',
          type: result.type,
          balance: Number(result.balance),
          currency: result.currency || 'INR',
          lastFourDigits: result.last_four_digits || undefined,
          notes: result.notes || undefined,
          status: result.status,
          createdAt: result.created_at,
          updatedAt: result.updated_at,
        };
      } catch (err) {
        if (err instanceof AppError) throw err;
        logger.error({ err }, 'Exception updating account');
        throw new AppError('Failed to update account', 500);
      }
    }

    const accounts = localStore.getAccounts();
    const inMemIdx = accounts.findIndex((a) => a.id === accountId);
    if (inMemIdx !== -1) {
      accounts[inMemIdx] = updated;
      localStore.saveAccounts(accounts);
    }
    return updated;
  }

  public static async deleteAccount(userId: string, accountId: string): Promise<boolean> {
    await this.getAccountById(userId, accountId);

    const db = getDbClient();

    if (process.env.NODE_ENV === 'test') {
      const accounts = localStore.getAccounts();
      const filtered = accounts.filter((a) => a.id !== accountId);
      localStore.saveAccounts(filtered);
      const txns = localStore.getTransactions();
      localStore.saveTransactions(txns.filter((t) => t.accountId !== accountId));
      return true;
    }

    if (db) {
      try {
        // 1. Delete associated transactions to prevent foreign-key constraints
        await db
          .from('transactions')
          .delete()
          .eq('account_id', accountId)
          .eq('user_id', userId);

        await db
          .from('transactions')
          .delete()
          .eq('destination_account_id', accountId)
          .eq('user_id', userId);

        // 2. Unlink or delete recurring payments associated with this account
        await db
          .from('recurring_payments')
          .delete()
          .eq('linked_account_id', accountId)
          .eq('user_id', userId);

        // 3. Delete savings contributions referencing this account
        await db
          .from('savings_contributions')
          .delete()
          .eq('account_id', accountId)
          .eq('user_id', userId);

        // 4. Delete account record from database
        const { error } = await db
          .from('accounts')
          .delete()
          .eq('id', accountId)
          .eq('user_id', userId);

        if (error) {
          logger.error({ error }, 'Supabase delete account failed');
          throw new AppError('Failed to delete account: ' + error.message, 500);
        }
        return true;
      } catch (err) {
        if (err instanceof AppError) throw err;
        logger.error({ err }, 'Exception deleting account');
        throw new AppError('Failed to delete account', 500);
      }
    }

    const accounts = localStore.getAccounts();
    const filtered = accounts.filter((a) => a.id !== accountId);
    localStore.saveAccounts(filtered);
    const txns = localStore.getTransactions();
    localStore.saveTransactions(txns.filter((t) => t.accountId !== accountId));
    return true;
  }

  public static async transferFunds(
    userId: string,
    input: TransferFundsInput
  ): Promise<{ fromAccount: AccountRecord; toAccount: AccountRecord }> {
    const fromAcc = await this.getAccountById(userId, input.fromAccountId);
    const toAcc = await this.getAccountById(userId, input.toAccountId);

    if (fromAcc.id === toAcc.id) {
      throw new AppError('Source and destination accounts must be different', 400);
    }

    const transferAmount = Math.abs(Number(input.amount));
    if (transferAmount <= 0) {
      throw new AppError('Transfer amount must be positive', 400);
    }

    const newFromBalance = fromAcc.type === 'CREDIT_CARD' 
      ? fromAcc.balance + transferAmount 
      : fromAcc.balance - transferAmount;

    const newToBalance = toAcc.type === 'CREDIT_CARD'
      ? toAcc.balance - transferAmount
      : toAcc.balance + transferAmount;

    const updatedFrom = await this.updateAccount(userId, fromAcc.id, { balance: newFromBalance });
    const updatedTo = await this.updateAccount(userId, toAcc.id, { balance: newToBalance });

    const date = input.date || new Date().toISOString();
    await TransactionService.createTransaction(userId, {
      accountId: fromAcc.id,
      amount: transferAmount,
      type: 'TRANSFER',
      category: 'Account Transfer',
      description: input.description || `Transfer to ${toAcc.name}`,
      date,
      paymentMethod: 'Net Banking',
      isRecurring: false,
    });

    return { fromAccount: updatedFrom, toAccount: updatedTo };
  }
}
