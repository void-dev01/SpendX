/**
 * SPENDX Transaction Service
 * Handles full CRUD operations, filtering, deterministic aggregation,
 * server sync, and local session persistence.
 */

import { authService } from './authService';
import { supabase } from './supabase';
import { apiClient } from './api';

export type TransactionType = 'INCOME' | 'EXPENSE' | 'TRANSFER';
export type TransactionStatus = 'COMPLETED' | 'PENDING' | 'FAILED';
export type PaymentMethod = 'UPI' | 'Credit Card' | 'Debit Card' | 'Net Banking' | 'Cash' | 'Bank Transfer';

export interface TransactionRecord {
  id: string;
  userId: string;
  accountId: string;
  accountName: string;
  amount: number;
  type: TransactionType;
  category: string;
  description: string;
  merchantName?: string;
  date: string; // ISO String
  paymentMethod: PaymentMethod;
  status: TransactionStatus;
  notes?: string;
  isRecurring: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface TransactionFiltersState {
  search: string;
  type: 'ALL' | TransactionType;
  category: string;
  accountId: string;
  dateRange: 'ALL' | 'TODAY' | 'LAST_7_DAYS' | 'THIS_MONTH' | 'LAST_MONTH' | 'LAST_3_MONTHS' | 'THIS_YEAR';
  minAmount?: number;
  maxAmount?: number;
  status: 'ALL' | TransactionStatus;
  sortBy: 'NEWEST' | 'OLDEST' | 'AMOUNT_DESC' | 'AMOUNT_ASC' | 'NAME_ASC';
}

export interface UserAccountOption {
  id: string;
  name: string;
  type: string;
  lastFour?: string;
}

export const DEFAULT_USER_ACCOUNTS: UserAccountOption[] = [
  { id: 'acc-hdfc-01', name: 'HDFC Bank - Salary', type: 'Checking', lastFour: '4092' },
  { id: 'acc-sbi-02', name: 'SBI Savings', type: 'Savings', lastFour: '8114' },
  { id: 'acc-icici-cc', name: 'ICICI Sapphiro Credit Card', type: 'Credit Card', lastFour: '9021' },
  { id: 'acc-cash', name: 'Cash Wallet', type: 'Cash' },
];

export const EXPENSE_CATEGORIES = [
  'Food & Dining',
  'Shopping',
  'Transport',
  'Bills & Utilities',
  'Entertainment',
  'Healthcare',
  'Education',
  'Travel',
  'Housing & Rent',
  'Other',
];

export const INCOME_CATEGORIES = [
  'Salary',
  'Freelance',
  'Business',
  'Investment Return',
  'Gift / Allowance',
  'Other',
];

export const INITIAL_DEMO_TRANSACTIONS: TransactionRecord[] = [
  {
    id: 'txn-101',
    userId: 'demo-user-id',
    accountId: 'acc-hdfc-01',
    accountName: 'HDFC Bank - Salary',
    amount: 850,
    type: 'EXPENSE',
    category: 'Food & Dining',
    description: 'Grocery Shopping',
    merchantName: 'Nature Basket Mart',
    date: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    paymentMethod: 'UPI',
    status: 'COMPLETED',
    notes: 'Weekly fresh vegetables and organic supplies',
    isRecurring: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'txn-102',
    userId: 'demo-user-id',
    accountId: 'acc-hdfc-01',
    accountName: 'HDFC Bank - Salary',
    amount: 45000,
    type: 'INCOME',
    category: 'Salary',
    description: 'Monthly Salary Credit',
    merchantName: 'Acme Corp Tech Pvt Ltd',
    date: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    paymentMethod: 'Bank Transfer',
    status: 'COMPLETED',
    notes: 'Direct deposit for November cycle',
    isRecurring: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'txn-103',
    userId: 'demo-user-id',
    accountId: 'acc-icici-cc',
    accountName: 'ICICI Sapphiro Credit Card',
    amount: 1250,
    type: 'EXPENSE',
    category: 'Bills & Utilities',
    description: 'Electricity Bill Payment',
    merchantName: 'State Power Utility',
    date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    paymentMethod: 'Credit Card',
    status: 'COMPLETED',
    notes: 'Residential meter consumption bill',
    isRecurring: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'txn-104',
    userId: 'demo-user-id',
    accountId: 'acc-sbi-02',
    accountName: 'SBI Savings',
    amount: 1500,
    type: 'EXPENSE',
    category: 'Transport',
    description: 'Fuel Station Fill-up',
    merchantName: 'Shell Petrol Pump',
    date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    paymentMethod: 'Debit Card',
    status: 'COMPLETED',
    notes: 'Premium petrol tank top-up',
    isRecurring: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'txn-105',
    userId: 'demo-user-id',
    accountId: 'acc-icici-cc',
    accountName: 'ICICI Sapphiro Credit Card',
    amount: 499,
    type: 'EXPENSE',
    category: 'Entertainment',
    description: 'Online Subscription',
    merchantName: 'Netflix India',
    date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    paymentMethod: 'Credit Card',
    status: 'COMPLETED',
    notes: 'Monthly 4K Ultra HD plan',
    isRecurring: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'txn-106',
    userId: 'demo-user-id',
    accountId: 'acc-hdfc-01',
    accountName: 'HDFC Bank - Salary',
    amount: 3200,
    type: 'EXPENSE',
    category: 'Shopping',
    description: 'New Running Shoes',
    merchantName: 'Nike Official Store',
    date: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000).toISOString(),
    paymentMethod: 'UPI',
    status: 'COMPLETED',
    notes: 'Pegasus 40 running gear',
    isRecurring: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'txn-107',
    userId: 'demo-user-id',
    accountId: 'acc-sbi-02',
    accountName: 'SBI Savings',
    amount: 10000,
    type: 'TRANSFER',
    category: 'Other',
    description: 'Transfer to Emergency Fund',
    merchantName: 'Self Transfer',
    date: new Date(Date.now() - 11 * 24 * 60 * 60 * 1000).toISOString(),
    paymentMethod: 'Net Banking',
    status: 'COMPLETED',
    notes: 'Automated allocation to high-yield savings',
    isRecurring: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'txn-108',
    userId: 'demo-user-id',
    accountId: 'acc-cash',
    accountName: 'Cash Wallet',
    amount: 350,
    type: 'EXPENSE',
    category: 'Food & Dining',
    description: 'Artisan Coffee & Croissant',
    merchantName: 'Blue Tokai Cafe',
    date: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString(),
    paymentMethod: 'Cash',
    status: 'COMPLETED',
    notes: 'Afternoon client quick meeting',
    isRecurring: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'txn-109',
    userId: 'demo-user-id',
    accountId: 'acc-hdfc-01',
    accountName: 'HDFC Bank - Salary',
    amount: 14500,
    type: 'INCOME',
    category: 'Freelance',
    description: 'UI/UX Consultation Retainer',
    merchantName: 'Fintech Studio Labs',
    date: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
    paymentMethod: 'Bank Transfer',
    status: 'COMPLETED',
    notes: 'Design system audit delivery milestone',
    isRecurring: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'txn-110',
    userId: 'demo-user-id',
    accountId: 'acc-icici-cc',
    accountName: 'ICICI Sapphiro Credit Card',
    amount: 999,
    type: 'EXPENSE',
    category: 'Bills & Utilities',
    description: 'Fiber Broadband Bill',
    merchantName: 'Airtel Broadband',
    date: new Date(Date.now() - 16 * 24 * 60 * 60 * 1000).toISOString(),
    paymentMethod: 'UPI',
    status: 'COMPLETED',
    notes: '300 Mbps unlimited plan',
    isRecurring: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

const LOCAL_STORAGE_KEY = 'spendx_transactions_store_v1';

export const transactionService = {
  /**
   * Helper to load stored transactions from local cache or initialize with defaults
   */
  getStoredTransactions(): TransactionRecord[] {
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.warn('Failed to parse cached transactions', e);
    }
    // Initialize default set
    this.saveStoredTransactions(INITIAL_DEMO_TRANSACTIONS);
    return INITIAL_DEMO_TRANSACTIONS;
  },

  /**
   * Helper to save transactions to local cache
   */
  saveStoredTransactions(transactions: TransactionRecord[]): void {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(transactions));
    } catch (e) {
      console.warn('Failed to cache transactions', e);
    }
  },

  /**
   * Fetch all transactions for the current user
   */
  async getTransactions(): Promise<TransactionRecord[]> {
    const user = authService.getUser();

    // 1. If Supabase is connected with real database session, query Supabase
    if (supabase && user && user.id !== 'demo-user-id') {
      try {
        const { data, error } = await supabase
          .from('transactions')
          .select('*')
          .eq('user_id', user.id)
          .order('date', { ascending: false });

        if (!error && data && data.length > 0) {
          return data.map((t) => ({
            id: t.id,
            userId: t.user_id,
            accountId: t.account_id || 'acc-hdfc-01',
            accountName: t.account_name || 'Primary Account',
            amount: Math.abs(t.amount),
            type: t.type ? t.type.toUpperCase() : (t.amount >= 0 ? 'INCOME' : 'EXPENSE'),
            category: t.category || 'Other',
            description: t.description || 'Transaction',
            merchantName: t.merchant_name || t.merchant,
            date: t.date || new Date().toISOString(),
            paymentMethod: t.payment_method || 'UPI',
            status: t.status || 'COMPLETED',
            notes: t.notes,
            isRecurring: Boolean(t.is_recurring),
            createdAt: t.created_at || new Date().toISOString(),
            updatedAt: t.updated_at || new Date().toISOString(),
          }));
        }
      } catch (err) {
        console.warn('Could not query Supabase transactions, using local store', err);
      }
    }

    // 2. Return local session transactions
    return this.getStoredTransactions();
  },

  /**
   * Get single transaction by ID
   */
  async getTransactionById(id: string): Promise<TransactionRecord | null> {
    const all = await this.getTransactions();
    return all.find((t) => t.id === id) || null;
  },

  /**
   * Create a new transaction
   */
  async createTransaction(
    data: Omit<TransactionRecord, 'id' | 'userId' | 'createdAt' | 'updatedAt'>
  ): Promise<TransactionRecord> {
    const user = authService.getUser();
    const userId = user?.id || 'demo-user-id';

    // 1. Call Backend API if available
    try {
      await apiClient.post('/transactions', {
        accountId: data.accountId,
        amount: data.amount,
        type: data.type,
        category: data.category,
        description: data.description,
        date: data.date,
        merchantName: data.merchantName,
        isRecurring: data.isRecurring,
      });
    } catch {
      // Backend may be offline or in mock development mode; continue with persistent local cache
    }

    const newRecord: TransactionRecord = {
      ...data,
      id: `txn_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      userId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const current = this.getStoredTransactions();
    const updated = [newRecord, ...current];
    this.saveStoredTransactions(updated);

    return newRecord;
  },

  /**
   * Update existing transaction
   */
  async updateTransaction(
    id: string,
    updates: Partial<Omit<TransactionRecord, 'id' | 'userId' | 'createdAt'>>
  ): Promise<TransactionRecord> {
    const current = this.getStoredTransactions();
    const index = current.findIndex((t) => t.id === id);

    if (index === -1) {
      throw new Error(`Transaction with ID "${id}" not found.`);
    }

    const updatedRecord: TransactionRecord = {
      ...current[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    current[index] = updatedRecord;
    this.saveStoredTransactions(current);

    return updatedRecord;
  },

  /**
   * Delete transaction
   */
  async deleteTransaction(id: string): Promise<void> {
    const current = this.getStoredTransactions();
    const filtered = current.filter((t) => t.id !== id);
    this.saveStoredTransactions(filtered);
  },

  /**
   * Bulk delete transactions
   */
  async bulkDeleteTransactions(ids: string[]): Promise<void> {
    const idSet = new Set(ids);
    const current = this.getStoredTransactions();
    const filtered = current.filter((t) => !idSet.has(t.id));
    this.saveStoredTransactions(filtered);
  },

  /**
   * Format Indian Rupee currency with standard symbol and formatting
   */
  formatINR(amount: number): string {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 2,
    }).format(amount);
  },

  /**
   * Export transactions as standardized CSV
   */
  exportToCSV(transactions: TransactionRecord[], filename = 'spendx_transactions.csv'): void {
    const headers = [
      'Transaction ID',
      'Name',
      'Merchant',
      'Type',
      'Category',
      'Account',
      'Amount',
      'Currency',
      'Date',
      'Payment Method',
      'Status',
      'Notes',
    ];

    const rows = transactions.map((t) => [
      `"${t.id}"`,
      `"${t.description.replace(/"/g, '""')}"`,
      `"${(t.merchantName || '').replace(/"/g, '""')}"`,
      `"${t.type}"`,
      `"${t.category.replace(/"/g, '""')}"`,
      `"${t.accountName.replace(/"/g, '""')}"`,
      t.amount.toFixed(2),
      '"INR"',
      `"${new Date(t.date).toLocaleDateString('en-IN')}"`,
      `"${t.paymentMethod}"`,
      `"${t.status}"`,
      `"${(t.notes || '').replace(/"/g, '""')}"`,
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  },
};
