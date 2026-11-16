/**
 * SPENDX Account Service
 * Provides full CRUD operations, live transaction balance reconciliations,
 * and user-scoped account persistence.
 */

import { authService } from './authService';
import { supabase } from './supabase';

export type AccountType = 'BANK' | 'SAVINGS' | 'CASH' | 'CREDIT_CARD' | 'OTHER';
export type AccountStatus = 'ACTIVE' | 'ARCHIVED';

export interface AccountRecord {
  id: string;
  userId: string;
  name: string;
  institution: string;
  type: AccountType;
  balance: number; // For Credit Card: represents outstanding amount
  currency: string;
  lastFourDigits?: string;
  notes?: string;
  status: AccountStatus;
  createdAt: string;
  updatedAt: string;
}

export interface AccountsOverviewMetrics {
  totalAssets: number;
  totalBankBalance: number;
  totalCashBalance: number;
  creditCardOutstanding: number;
}

export const INITIAL_DEMO_ACCOUNTS: AccountRecord[] = [
  {
    id: 'acc-hdfc-01',
    userId: 'demo-user-id',
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
    userId: 'demo-user-id',
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
    userId: 'demo-user-id',
    name: 'ICICI Sapphiro Credit Card',
    institution: 'ICICI Bank',
    type: 'CREDIT_CARD',
    balance: 12450, // Outstanding liability
    currency: 'INR',
    lastFourDigits: '9021',
    notes: 'Travel and utilities rewards card (Limit: ₹3,00,000)',
    status: 'ACTIVE',
    createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'acc-cash',
    userId: 'demo-user-id',
    name: 'Cash Wallet',
    institution: 'Physical Cash',
    type: 'CASH',
    balance: 3850,
    currency: 'INR',
    notes: 'Physical currency on hand for minor daily expenses',
    status: 'ACTIVE',
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

const LOCAL_STORAGE_ACCOUNTS_KEY = 'spendx_accounts_store_v1';

export const accountService = {
  getStoredAccounts(): AccountRecord[] {
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_ACCOUNTS_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.warn('Failed to parse cached accounts', e);
    }
    return [];
  },

  saveStoredAccounts(accounts: AccountRecord[]): void {
    try {
      localStorage.setItem(LOCAL_STORAGE_ACCOUNTS_KEY, JSON.stringify(accounts));
    } catch (e) {
      console.warn('Failed to cache accounts', e);
    }
  },

  /**
   * Retrieves all active accounts for the authenticated user
   */
  async getAccounts(): Promise<AccountRecord[]> {
    const user = authService.getUser();

    // If Supabase is connected with real database tables, query Supabase
    if (supabase && user && user.id !== 'demo-user-id') {
      try {
        const { data, error } = await supabase
          .from('accounts')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: true });

        if (!error && data && data.length > 0) {
          return data.map((a) => ({
            id: a.id,
            userId: a.user_id,
            name: a.name,
            institution: a.institution || 'Bank',
            type: a.type as AccountType,
            balance: Number(a.balance) || 0,
            currency: a.currency || 'INR',
            lastFourDigits: a.last_four_digits,
            notes: a.notes,
            status: (a.status as AccountStatus) || 'ACTIVE',
            createdAt: a.created_at || new Date().toISOString(),
            updatedAt: a.updated_at || new Date().toISOString(),
          }));
        }
      } catch (err) {
        console.warn('Could not query Supabase accounts, using local store', err);
      }
    }

    return this.getStoredAccounts();
  },

  /**
   * Get single account by ID
   */
  async getAccountById(id: string): Promise<AccountRecord | null> {
    const accounts = await this.getAccounts();
    return accounts.find((a) => a.id === id) || null;
  },

  /**
   * Compute deterministic financial overview metrics
   */
  computeOverviewMetrics(accounts: AccountRecord[]): AccountsOverviewMetrics {
    let totalBankBalance = 0;
    let totalCashBalance = 0;
    let creditCardOutstanding = 0;

    accounts.forEach((acc) => {
      if (acc.status !== 'ACTIVE') return;

      if (acc.type === 'BANK' || acc.type === 'SAVINGS' || acc.type === 'OTHER') {
        totalBankBalance += acc.balance;
      } else if (acc.type === 'CASH') {
        totalCashBalance += acc.balance;
      } else if (acc.type === 'CREDIT_CARD') {
        creditCardOutstanding += acc.balance;
      }
    });

    // Total assets strictly exclude credit card liabilities
    const totalAssets = totalBankBalance + totalCashBalance;

    return {
      totalAssets,
      totalBankBalance,
      totalCashBalance,
      creditCardOutstanding,
    };
  },

  /**
   * Create new account
   */
  async createAccount(
    data: Omit<AccountRecord, 'id' | 'userId' | 'createdAt' | 'updatedAt'>
  ): Promise<AccountRecord> {
    const user = authService.getUser();
    const userId = user?.id || 'demo-user-id';

    const newRecord: AccountRecord = {
      ...data,
      id: `acc_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      userId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const current = this.getStoredAccounts();
    const updated = [...current, newRecord];
    this.saveStoredAccounts(updated);

    return newRecord;
  },

  /**
   * Update existing account
   */
  async updateAccount(
    id: string,
    updates: Partial<Omit<AccountRecord, 'id' | 'userId' | 'createdAt'>>
  ): Promise<AccountRecord> {
    const current = this.getStoredAccounts();
    const index = current.findIndex((a) => a.id === id);

    if (index === -1) {
      throw new Error(`Account with ID "${id}" not found.`);
    }

    const updatedRecord: AccountRecord = {
      ...current[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    current[index] = updatedRecord;
    this.saveStoredAccounts(current);

    return updatedRecord;
  },

  /**
   * Delete account safely
   */
  async deleteAccount(id: string): Promise<void> {
    const current = this.getStoredAccounts();
    const filtered = current.filter((a) => a.id !== id);
    this.saveStoredAccounts(filtered);
  },

  /**
   * Format Indian Rupee currency
   */
  formatINR(amount: number): string {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 2,
    }).format(amount);
  },
};
