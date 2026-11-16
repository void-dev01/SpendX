/**
 * SPENDX Recurring Payments Service
 * Handles recurring payment schedules, subscriptions, EMI tracking,
 * payment calendar calculations, mark-as-paid ledger reconciliation,
 * and automatic recurring pattern detection.
 */

import { authService } from './authService';
import { supabase } from './supabase';
import { transactionService, TransactionRecord } from './transactionService';
import { accountService } from './accountService';

export type RecurringFrequency =
  | 'DAILY'
  | 'WEEKLY'
  | 'MONTHLY'
  | 'QUARTERLY'
  | 'YEARLY';

export type RecurringCategory =
  | 'Subscriptions'
  | 'EMIs & Loans'
  | 'Rent'
  | 'Bills & Utilities'
  | 'Insurance'
  | 'Memberships'
  | 'Education'
  | 'Other';

export type RecurringStatus =
  | 'UPCOMING'
  | 'DUE_TODAY'
  | 'OVERDUE'
  | 'PAID'
  | 'PAUSED'
  | 'CANCELLED';

export interface RecurringRecord {
  id: string;
  userId: string;
  name: string;
  merchant: string;
  category: RecurringCategory;
  amount: number;
  frequency: RecurringFrequency;
  startDate: string; // ISO
  nextDueDate: string; // ISO
  linkedAccountId?: string;
  linkedAccountName?: string;
  status: RecurringStatus;
  notes?: string;
  lastPaidDate?: string;
  createdAt: string;
  updatedAt: string;
}

export interface RecurringOverviewMetrics {
  monthlyRecurringTotal: number;
  upcomingPaymentsCount: number;
  paidThisMonthAmount: number;
  activeSubscriptionsCount: number;
}

export interface DetectedRecurringItem {
  id: string;
  merchant: string;
  estimatedAmount: number;
  suggestedFrequency: RecurringFrequency;
  lastTransactionDate: string;
  predictedNextDate: string;
  confidence: 'HIGH' | 'MEDIUM';
  reason: string;
  category: RecurringCategory;
}

export const RECURRING_CATEGORIES: RecurringCategory[] = [
  'Subscriptions',
  'EMIs & Loans',
  'Rent',
  'Bills & Utilities',
  'Insurance',
  'Memberships',
  'Education',
  'Other',
];

export const INITIAL_DEMO_RECURRING: RecurringRecord[] = [
  {
    id: 'rec-netflix',
    userId: 'demo-user-id',
    name: 'Netflix Premium 4K',
    merchant: 'Netflix Entertainment Ltd',
    category: 'Subscriptions',
    amount: 649,
    frequency: 'MONTHLY',
    startDate: new Date(Date.now() - 120 * 24 * 60 * 60 * 1000).toISOString(),
    nextDueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
    linkedAccountId: 'acc-icici-cc',
    linkedAccountName: 'ICICI Sapphiro Credit Card',
    status: 'UPCOMING',
    notes: 'Family 4K plan with 4 concurrent UHD streams',
    lastPaidDate: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date(Date.now() - 120 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'rec-broadband',
    userId: 'demo-user-id',
    name: 'Airtel Fiber Gigabit',
    merchant: 'Bharti Airtel Ltd',
    category: 'Bills & Utilities',
    amount: 1199,
    frequency: 'MONTHLY',
    startDate: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(),
    nextDueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
    linkedAccountId: 'acc-hdfc-01',
    linkedAccountName: 'HDFC Bank - Salary',
    status: 'UPCOMING',
    notes: 'Home office 300 Mbps unlimited optical connection',
    lastPaidDate: new Date(Date.now() - 28 * 24 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'rec-spotify',
    userId: 'demo-user-id',
    name: 'Spotify Family Duo',
    merchant: 'Spotify AB',
    category: 'Subscriptions',
    amount: 179,
    frequency: 'MONTHLY',
    startDate: new Date(Date.now() - 150 * 24 * 60 * 60 * 1000).toISOString(),
    nextDueDate: new Date(Date.now() + 12 * 24 * 60 * 60 * 1000).toISOString(),
    linkedAccountId: 'acc-hdfc-01',
    linkedAccountName: 'HDFC Bank - Salary',
    status: 'UPCOMING',
    notes: 'Ad-free high fidelity mobile streaming',
    lastPaidDate: new Date(Date.now() - 18 * 24 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date(Date.now() - 150 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'rec-rent',
    userId: 'demo-user-id',
    name: 'Apartment Rental',
    merchant: 'Prestige Lakeside Estates',
    category: 'Rent',
    amount: 28000,
    frequency: 'MONTHLY',
    startDate: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000).toISOString(),
    nextDueDate: new Date(Date.now() + 16 * 24 * 60 * 60 * 1000).toISOString(),
    linkedAccountId: 'acc-hdfc-01',
    linkedAccountName: 'HDFC Bank - Salary',
    status: 'UPCOMING',
    notes: 'Direct RTGS transfer to landlord account',
    lastPaidDate: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'rec-health-insurance',
    userId: 'demo-user-id',
    name: 'Star Comprehensive Health Cover',
    merchant: 'Star Health Allied Insurance',
    category: 'Insurance',
    amount: 18500,
    frequency: 'YEARLY',
    startDate: new Date(Date.now() - 300 * 24 * 60 * 60 * 1000).toISOString(),
    nextDueDate: new Date(Date.now() + 65 * 24 * 60 * 60 * 1000).toISOString(),
    linkedAccountId: 'acc-hdfc-01',
    linkedAccountName: 'HDFC Bank - Salary',
    status: 'UPCOMING',
    notes: '₹15 Lakh family floater medical protection policy',
    lastPaidDate: new Date(Date.now() - 300 * 24 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date(Date.now() - 300 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

const LOCAL_STORAGE_RECURRING_KEY = 'spendx_recurring_payments_v1';

export const recurringService = {
  getStoredPayments(): RecurringRecord[] {
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_RECURRING_KEY);
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.warn('Failed to parse cached recurring payments', e);
    }
    return [];
  },

  saveStoredPayments(records: RecurringRecord[]): void {
    try {
      localStorage.setItem(LOCAL_STORAGE_RECURRING_KEY, JSON.stringify(records));
    } catch (e) {
      console.warn('Failed to cache recurring payments', e);
    }
  },

  /**
   * Fetch all recurring payment records
   */
  async getRecurringPayments(): Promise<RecurringRecord[]> {
    const user = authService.getUser();

    if (supabase && user && user.id !== 'demo-user-id') {
      try {
        const { data, error } = await supabase
          .from('recurring_payments')
          .select('*')
          .eq('user_id', user.id)
          .order('next_due_date', { ascending: true });

        if (!error && data && data.length > 0) {
          return data.map((r) => ({
            id: r.id,
            userId: r.user_id,
            name: r.name,
            merchant: r.merchant || r.name,
            category: (r.category as RecurringCategory) || 'Other',
            amount: Number(r.amount) || 0,
            frequency: (r.frequency as RecurringFrequency) || 'MONTHLY',
            startDate: r.start_date || new Date().toISOString(),
            nextDueDate: r.next_due_date || new Date().toISOString(),
            linkedAccountId: r.linked_account_id,
            linkedAccountName: r.linked_account_name,
            status: this.evaluateStatus(r.next_due_date, r.status),
            notes: r.notes,
            lastPaidDate: r.last_paid_date,
            createdAt: r.created_at || new Date().toISOString(),
            updatedAt: r.updated_at || new Date().toISOString(),
          }));
        }
      } catch (err) {
        console.warn('Could not query Supabase recurring payments, using local store', err);
      }
    }

    const local = this.getStoredPayments();
    // Update dynamic status based on current date
    return local.map((r) => ({
      ...r,
      status: this.evaluateStatus(r.nextDueDate, r.status),
    }));
  },

  /**
   * Determine exact status relative to current timestamp
   */
  evaluateStatus(nextDueDateStr: string, currentStatus: RecurringStatus): RecurringStatus {
    if (currentStatus === 'PAUSED' || currentStatus === 'CANCELLED' || currentStatus === 'PAID') {
      return currentStatus;
    }

    const due = new Date(nextDueDateStr);
    const now = new Date();

    const isSameDay =
      due.getFullYear() === now.getFullYear() &&
      due.getMonth() === now.getMonth() &&
      due.getDate() === now.getDate();

    if (isSameDay) return 'DUE_TODAY';
    if (due.getTime() < now.getTime()) return 'OVERDUE';
    return 'UPCOMING';
  },

  /**
   * Fetch single recurring record by ID
   */
  async getRecurringById(id: string): Promise<RecurringRecord | null> {
    const all = await this.getRecurringPayments();
    return all.find((r) => r.id === id) || null;
  },

  /**
   * Computes overview summary metrics
   */
  computeOverviewMetrics(records: RecurringRecord[]): RecurringOverviewMetrics {
    let monthlyRecurringTotal = 0;
    let upcomingPaymentsCount = 0;
    let paidThisMonthAmount = 0;
    let activeSubscriptionsCount = 0;

    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    records.forEach((r) => {
      if (r.status === 'CANCELLED' || r.status === 'PAUSED') return;

      activeSubscriptionsCount++;

      // Normalize to monthly cost
      let monthlyEquivalent = r.amount;
      if (r.frequency === 'DAILY') monthlyEquivalent = r.amount * 30;
      else if (r.frequency === 'WEEKLY') monthlyEquivalent = r.amount * 4.33;
      else if (r.frequency === 'QUARTERLY') monthlyEquivalent = r.amount / 3;
      else if (r.frequency === 'YEARLY') monthlyEquivalent = r.amount / 12;

      monthlyRecurringTotal += monthlyEquivalent;

      if (r.status === 'UPCOMING' || r.status === 'DUE_TODAY' || r.status === 'OVERDUE') {
        upcomingPaymentsCount++;
      }

      if (r.lastPaidDate) {
        const paidD = new Date(r.lastPaidDate);
        if (paidD.getMonth() === currentMonth && paidD.getFullYear() === currentYear) {
          paidThisMonthAmount += r.amount;
        }
      }
    });

    return {
      monthlyRecurringTotal: Math.round(monthlyRecurringTotal),
      upcomingPaymentsCount,
      paidThisMonthAmount: Math.round(paidThisMonthAmount),
      activeSubscriptionsCount,
    };
  },

  getOverviewMetrics(records: RecurringRecord[]): RecurringOverviewMetrics {
    return this.computeOverviewMetrics(records);
  },

  /**
   * Create new recurring schedule
   */
  async createRecurringPayment(
    data: Omit<RecurringRecord, 'id' | 'userId' | 'createdAt' | 'updatedAt'>
  ): Promise<RecurringRecord> {
    const user = authService.getUser();
    const userId = user?.id || 'demo-user-id';

    const newRecord: RecurringRecord = {
      ...data,
      id: `rec_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      userId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const current = this.getStoredPayments();
    const updated = [newRecord, ...current];
    this.saveStoredPayments(updated);

    return newRecord;
  },

  /**
   * Update existing recurring payment schedule
   */
  async updateRecurringPayment(
    id: string,
    updates: Partial<Omit<RecurringRecord, 'id' | 'userId' | 'createdAt'>>
  ): Promise<RecurringRecord> {
    const current = this.getStoredPayments();
    const index = current.findIndex((r) => r.id === id);

    if (index === -1) {
      throw new Error(`Recurring payment #${id} not found.`);
    }

    const updatedRecord: RecurringRecord = {
      ...current[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    current[index] = updatedRecord;
    this.saveStoredPayments(current);

    return updatedRecord;
  },

  /**
   * Toggles pause status on a recurring schedule
   */
  async togglePause(id: string): Promise<RecurringRecord> {
    const payment = await this.getRecurringById(id);
    if (!payment) throw new Error(`Recurring payment #${id} not found.`);
    const newStatus: RecurringStatus = payment.status === 'PAUSED' ? 'UPCOMING' : 'PAUSED';
    return this.updateRecurringPayment(id, { status: newStatus });
  },

  /**
   * Mark an occurrence as paid:
   * 1. Reconciles linked account balance via accountService
   * 2. Logs an actual completed transaction via transactionService
   * 3. Calculates next due date advanced by cycle frequency
   */
  async markAsPaid(
    id: string,
    paidDate = new Date().toISOString()
  ): Promise<{ record: RecurringRecord; transactionId: string }> {
    const current = this.getStoredPayments();
    const index = current.findIndex((r) => r.id === id);

    if (index === -1) {
      throw new Error(`Recurring payment #${id} not found.`);
    }

    const item = current[index];

    // 1. Calculate next occurrence due date
    const nextDue = new Date(item.nextDueDate);
    switch (item.frequency) {
      case 'DAILY':
        nextDue.setDate(nextDue.getDate() + 1);
        break;
      case 'WEEKLY':
        nextDue.setDate(nextDue.getDate() + 7);
        break;
      case 'MONTHLY':
        nextDue.setMonth(nextDue.getMonth() + 1);
        break;
      case 'QUARTERLY':
        nextDue.setMonth(nextDue.getMonth() + 3);
        break;
      case 'YEARLY':
        nextDue.setFullYear(nextDue.getFullYear() + 1);
        break;
    }

    const updatedRecord: RecurringRecord = {
      ...item,
      status: 'UPCOMING',
      lastPaidDate: paidDate,
      nextDueDate: nextDue.toISOString(),
      updatedAt: new Date().toISOString(),
    };
    current[index] = updatedRecord;
    this.saveStoredPayments(current);

    // 2. Reconcile account balance
    if (item.linkedAccountId) {
      try {
        const acc = await accountService.getAccountById(item.linkedAccountId);
        if (acc) {
          const newBal = Math.max(0, acc.balance - item.amount);
          await accountService.updateAccount(acc.id, { balance: newBal });
        }
      } catch (e) {
        console.warn('Could not deduct recurring payment from account balance', e);
      }
    }

    // 3. Log completed transaction
    let transactionId = '';
    try {
      const txn = await transactionService.createTransaction({
        accountId: item.linkedAccountId || 'acc-hdfc-01',
        accountName: item.linkedAccountName || 'Primary Account',
        amount: item.amount,
        type: 'EXPENSE',
        category: item.category,
        description: `Recurring Payment: ${item.name}`,
        merchantName: item.merchant,
        date: paidDate,
        paymentMethod: 'Bank Transfer',
        status: 'COMPLETED',
        notes: item.notes || `Recurring direct debit for ${item.name}`,
        isRecurring: true,
      });
      transactionId = txn.id;
    } catch (e) {
      console.warn('Could not record transaction for recurring payment', e);
    }

    return { record: updatedRecord, transactionId };
  },

  /**
   * Delete recurring schedule
   */
  async deleteRecurringPayment(id: string): Promise<void> {
    const current = this.getStoredPayments();
    const filtered = current.filter((r) => r.id !== id);
    this.saveStoredPayments(filtered);
  },

  /**
   * Automatic recurring transaction detection:
   * Analyzes transactions for repeating patterns (same merchant/description, consistent amount)
   */
  detectPotentialRecurring(
    transactions: TransactionRecord[],
    existingRecurring: RecurringRecord[]
  ): DetectedRecurringItem[] {
    const existingMerchants = new Set(
      existingRecurring.map((r) => r.merchant.toLowerCase().trim())
    );

    const merchantMap: Record<
      string,
      { transactions: TransactionRecord[]; amounts: number[] }
    > = {};

    transactions.forEach((t) => {
      if (t.type !== 'EXPENSE') return;
      const key = (t.merchantName || t.description).toLowerCase().trim();
      if (!key) return;

      if (!merchantMap[key]) {
        merchantMap[key] = { transactions: [], amounts: [] };
      }
      merchantMap[key].transactions.push(t);
      merchantMap[key].amounts.push(t.amount);
    });

    const suggestions: DetectedRecurringItem[] = [];

    Object.entries(merchantMap).forEach(([name, data]) => {
      // If already scheduled, skip
      if (existingMerchants.has(name)) return;

      // Need at least 2 occurrences
      if (data.transactions.length >= 2) {
        const sorted = data.transactions.sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
        );
        const lastTx = sorted[0];
        const prevTx = sorted[1];

        // Check if amounts match within 10%
        const avgAmt = data.amounts.reduce((a, b) => a + b, 0) / data.amounts.length;
        const diffDays = Math.abs(
          (new Date(lastTx.date).getTime() - new Date(prevTx.date).getTime()) /
            (1000 * 60 * 60 * 24)
        );

        let suggestedFrequency: RecurringFrequency = 'MONTHLY';
        if (diffDays >= 25 && diffDays <= 35) {
          suggestedFrequency = 'MONTHLY';
        } else if (diffDays >= 6 && diffDays <= 8) {
          suggestedFrequency = 'WEEKLY';
        } else {
          return;
        }

        const predictedNext = new Date(lastTx.date);
        predictedNext.setDate(predictedNext.getDate() + Math.round(diffDays));

        suggestions.push({
          id: `detect_${name.replace(/\s+/g, '_')}`,
          merchant: lastTx.merchantName || lastTx.description,
          estimatedAmount: Math.round(avgAmt),
          suggestedFrequency,
          lastTransactionDate: lastTx.date,
          predictedNextDate: predictedNext.toISOString(),
          confidence: data.transactions.length >= 3 ? 'HIGH' : 'MEDIUM',
          reason: `Detected ${data.transactions.length} repeating ${suggestedFrequency.toLowerCase()} payments of ~${transactionService.formatINR(avgAmt)}.`,
          category: (lastTx.category as RecurringCategory) || 'Subscriptions',
        });
      }
    });

    return suggestions.slice(0, 3);
  },

  formatINR(amount: number): string {
    return transactionService.formatINR(amount);
  },
};
