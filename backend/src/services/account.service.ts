import { supabaseClient } from '../config/supabase.js';
import { AppError } from '../middleware/errorHandler.js';
import { logger } from '../utils/logger.js';
import { AccountRecord } from '../types/index.js';
import { CreateAccountInput, UpdateAccountInput, TransferFundsInput } from '../validators/account.validator.js';
import { TransactionService } from './transaction.service.js';

const inMemoryAccounts: AccountRecord[] = [
  {
    id: 'acc-hdfc-01',
    userId: 'usr_dev_local_spendx',
    name: 'HDFC Bank - Salary',
    institution: 'HDFC Bank Ltd',
    type: 'BANK',
    balance: 84200,
    currency: 'INR',
    lastFourDigits: '4092',
    notes: 'Primary salary credit and day-to-day checking account',
    status: 'ACTIVE',
    createdAt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'acc-sbi-02',
    userId: 'usr_dev_local_spendx',
    name: 'SBI Savings Vault',
    institution: 'State Bank of India',
    type: 'SAVINGS',
    balance: 27930,
    currency: 'INR',
    lastFourDigits: '8114',
    notes: 'High-yield emergency savings reserve',
    status: 'ACTIVE',
    createdAt: new Date(Date.now() - 120 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'acc-icici-cc',
    userId: 'usr_dev_local_spendx',
    name: 'ICICI Sapphiro Credit Card',
    institution: 'ICICI Bank',
    type: 'CREDIT_CARD',
    balance: 12450,
    currency: 'INR',
    lastFourDigits: '9012',
    notes: 'Primary cashback card for online transactions and travel',
    status: 'ACTIVE',
    createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export class AccountService {
  public static async getAccounts(userId: string): Promise<AccountRecord[]> {
    if (!supabaseClient) {
      return inMemoryAccounts.filter((a) => a.userId === userId || userId.startsWith('test-token-') || userId === 'usr_dev_local_spendx');
    }

    try {
      const { data, error } = await supabaseClient
        .from('accounts')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) {
        logger.error({ error }, 'Failed to fetch accounts from Supabase');
        return inMemoryAccounts.filter((a) => a.userId === userId || userId.startsWith('test-token-') || userId === 'usr_dev_local_spendx');
      }

      return (data || []).map((row) => ({
        id: row.id,
        userId: row.user_id,
        name: row.name,
        institution: row.institution,
        type: row.type,
        balance: Number(row.balance),
        currency: row.currency,
        lastFourDigits: row.last_four_digits,
        notes: row.notes,
        status: row.status,
        createdAt: row.created_at,
        updatedAt: row.updated_at,
      }));
    } catch {
      return inMemoryAccounts.filter((a) => a.userId === userId || userId.startsWith('test-token-') || userId === 'usr_dev_local_spendx');
    }
  }

  public static async getAccountById(userId: string, accountId: string): Promise<AccountRecord> {
    const accounts = await this.getAccounts(userId);
    const account = accounts.find((a) => a.id === accountId);
    if (!account) {
      throw new AppError('Account not found', 404);
    }
    return account;
  }

  public static async createAccount(userId: string, data: CreateAccountInput): Promise<AccountRecord> {
    const newAccount: AccountRecord = {
      id: `acc_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      userId,
      name: data.name,
      institution: data.institution,
      type: data.type,
      balance: data.balance,
      currency: data.currency || 'INR',
      lastFourDigits: data.lastFourDigits,
      notes: data.notes,
      status: data.status || 'ACTIVE',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    if (!supabaseClient) {
      inMemoryAccounts.unshift(newAccount);
      return newAccount;
    }

    try {
      const { data: inserted, error } = await supabaseClient
        .from('accounts')
        .insert({
          id: newAccount.id,
          user_id: userId,
          name: newAccount.name,
          institution: newAccount.institution,
          type: newAccount.type,
          balance: newAccount.balance,
          currency: newAccount.currency,
          last_four_digits: newAccount.lastFourDigits,
          notes: newAccount.notes,
          status: newAccount.status,
          created_at: newAccount.createdAt,
          updated_at: newAccount.updatedAt,
        })
        .select()
        .single();

      if (error) {
        logger.warn({ error }, 'Supabase insert account failed, falling back to in-memory');
        inMemoryAccounts.unshift(newAccount);
        return newAccount;
      }

      return {
        id: inserted.id,
        userId: inserted.user_id,
        name: inserted.name,
        institution: inserted.institution,
        type: inserted.type,
        balance: Number(inserted.balance),
        currency: inserted.currency,
        lastFourDigits: inserted.last_four_digits,
        notes: inserted.notes,
        status: inserted.status,
        createdAt: inserted.created_at,
        updatedAt: inserted.updated_at,
      };
    } catch {
      inMemoryAccounts.unshift(newAccount);
      return newAccount;
    }
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
      updatedAt: new Date().toISOString(),
    };

    const inMemIdx = inMemoryAccounts.findIndex((a) => a.id === accountId);
    if (inMemIdx !== -1) {
      inMemoryAccounts[inMemIdx] = updated;
    }

    if (supabaseClient) {
      try {
        await supabaseClient
          .from('accounts')
          .update({
            name: updated.name,
            institution: updated.institution,
            type: updated.type,
            balance: updated.balance,
            currency: updated.currency,
            last_four_digits: updated.lastFourDigits,
            notes: updated.notes,
            status: updated.status,
            updated_at: updated.updatedAt,
          })
          .eq('id', accountId)
          .eq('user_id', userId);
      } catch (err) {
        logger.warn({ err }, 'Supabase update account failed');
      }
    }

    return updated;
  }

  public static async deleteAccount(userId: string, accountId: string): Promise<boolean> {
    await this.getAccountById(userId, accountId);

    const inMemIdx = inMemoryAccounts.findIndex((a) => a.id === accountId);
    if (inMemIdx !== -1) {
      inMemoryAccounts.splice(inMemIdx, 1);
    }

    if (supabaseClient) {
      try {
        await supabaseClient.from('accounts').delete().eq('id', accountId).eq('user_id', userId);
      } catch (err) {
        logger.warn({ err }, 'Supabase delete account failed');
      }
    }

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

    const newFromBalance = fromAcc.type === 'CREDIT_CARD' 
      ? fromAcc.balance + input.amount 
      : fromAcc.balance - input.amount;

    const newToBalance = toAcc.type === 'CREDIT_CARD'
      ? toAcc.balance - input.amount
      : toAcc.balance + input.amount;

    const updatedFrom = await this.updateAccount(userId, fromAcc.id, { balance: newFromBalance });
    const updatedTo = await this.updateAccount(userId, toAcc.id, { balance: newToBalance });

    const date = input.date || new Date().toISOString();
    await TransactionService.createTransaction(userId, {
      accountId: fromAcc.id,
      amount: input.amount,
      type: 'TRANSFER',
      category: 'Transfer',
      description: input.description || `Transfer to ${toAcc.name}`,
      date,
      isRecurring: false,
    });

    return { fromAccount: updatedFrom, toAccount: updatedTo };
  }
}
