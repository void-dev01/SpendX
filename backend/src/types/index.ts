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
