import { Request } from 'express';

export interface AuthenticatedUser {
  id: string;
  email: string;
  role?: string;
}

export interface AuthenticatedRequest extends Request {
  user?: AuthenticatedUser;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
    [key: string]: unknown;
  };
}

export type TransactionType = 'INCOME' | 'EXPENSE' | 'TRANSFER';

export interface Transaction {
  id: string;
  userId: string;
  accountId: string;
  amount: number;
  type: TransactionType;
  category: string;
  description: string;
  date: string;
  isRecurring: boolean;
  merchantName?: string;
  createdAt: string;
  updatedAt: string;
}

export interface FinancialInsight {
  id: string;
  userId: string;
  type: 'WARNING' | 'TIP' | 'MILESTONE' | 'ANOMALY';
  title: string;
  description: string;
  actionableStep?: string;
  generatedAt: string;
}

export type NotificationType =
  | 'BUDGET_THRESHOLD'
  | 'RECURRING_DUE'
  | 'SAVINGS_MILESTONE'
  | 'SECURITY_ALERT'
  | 'WEEKLY_DIGEST';

export interface NotificationRecord {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  actionRoute?: string;
  isRead: boolean;
  createdAt: string;
}

export type AccountType = 'BANK' | 'SAVINGS' | 'CASH' | 'CREDIT_CARD' | 'OTHER';
export type AccountStatus = 'ACTIVE' | 'ARCHIVED';

export interface AccountRecord {
  id: string;
  userId: string;
  name: string;
  institution: string;
  type: AccountType;
  balance: number;
  currency: string;
  lastFourDigits?: string;
  notes?: string;
  status: AccountStatus;
  createdAt: string;
  updatedAt: string;
}

export type RecurringFrequency = 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'QUARTERLY' | 'YEARLY';
export type RecurringCategory =
  | 'Subscriptions'
  | 'EMIs & Loans'
  | 'Rent'
  | 'Bills & Utilities'
  | 'Insurance'
  | 'Memberships'
  | 'Education'
  | 'Other';
export type RecurringStatus = 'UPCOMING' | 'DUE_TODAY' | 'OVERDUE' | 'PAID' | 'PAUSED' | 'CANCELLED';

export interface RecurringRecord {
  id: string;
  userId: string;
  name: string;
  merchant: string;
  category: RecurringCategory;
  amount: number;
  frequency: RecurringFrequency;
  startDate: string;
  nextDueDate: string;
  linkedAccountId?: string;
  linkedAccountName?: string;
  status: RecurringStatus;
  notes?: string;
  lastPaidDate?: string;
  createdAt: string;
  updatedAt: string;
}

