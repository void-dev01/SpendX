export type TransactionType = 'INCOME' | 'EXPENSE' | 'TRANSFER';

export interface UserProfile {
  id: string;
  email: string;
  fullName: string;
  avatarUrl?: string;
  currency: string;
  monthlyIncomeTarget?: number;
  phone?: string;
  bio?: string;
  country?: string;
  goalHorizon?: string;
}

export interface Transaction {
  id: string;
  accountId: string;
  amount: number;
  type: TransactionType;
  category: string;
  description: string;
  date: string;
  isRecurring: boolean;
  merchantName?: string;
}

export interface Budget {
  id: string;
  category: string;
  allocatedAmount: number;
  spentAmount: number;
  period: 'MONTHLY' | 'YEARLY';
}

export interface SavingsGoal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  targetDate: string;
}

export interface FinancialInsight {
  id: string;
  type: 'WARNING' | 'TIP' | 'MILESTONE' | 'ANOMALY';
  title: string;
  description: string;
  actionableStep?: string;
  generatedAt: string;
}
