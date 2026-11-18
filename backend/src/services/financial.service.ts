import { supabaseAdminClient } from '../config/supabase.js';
import { logger } from '../utils/logger.js';

export interface FinancialOverview {
  totalAssets: number;
  totalLiabilities: number;
  netWorth: number;
  totalIncome: number;
  totalExpenses: number;
  netCashFlow: number;
  savingsRate: number;
  periodStart: string;
  periodEnd: string;
}

export interface CategorySpendingSummary {
  category: string;
  amount: number;
  percentage: number;
  transactionCount: number;
}

export class FinancialCalculationService {
  /**
   * Determine exact ISO date boundary for a given period
   */
  public static getDateRange(period: 'this_month' | 'last_month' | 'last_3_months' | 'this_year' | 'all'): {
    start: Date;
    end: Date;
  } {
    const now = new Date();
    const end = new Date(now);

    let start: Date;
    switch (period) {
      case 'last_month': {
        start = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        const lastDay = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59, 999);
        return { start, end: lastDay };
      }
      case 'last_3_months': {
        start = new Date(now.getFullYear(), now.getMonth() - 3, 1);
        break;
      }
      case 'this_year': {
        start = new Date(now.getFullYear(), 0, 1);
        break;
      }
      case 'all': {
        start = new Date(2000, 0, 1);
        break;
      }
      case 'this_month':
      default: {
        start = new Date(now.getFullYear(), now.getMonth(), 1);
        break;
      }
    }

    return { start, end };
  }

  /**
   * Calculate Authoritative Financial Overview directly from Supabase DB
   */
  public static async calculateFinancialOverview(
    userId: string,
    period: 'this_month' | 'last_month' | 'last_3_months' | 'this_year' | 'all' = 'this_month'
  ): Promise<FinancialOverview> {
    if (!supabaseAdminClient) {
      return {
        totalAssets: 0,
        totalLiabilities: 0,
        netWorth: 0,
        totalIncome: 0,
        totalExpenses: 0,
        netCashFlow: 0,
        savingsRate: 0,
        periodStart: new Date().toISOString(),
        periodEnd: new Date().toISOString(),
      };
    }

    const { start, end } = this.getDateRange(period);

    // 1. Fetch live Accounts to determine Total Assets & Liabilities
    const { data: accounts, error: accError } = await supabaseAdminClient
      .from('accounts')
      .select('type, balance, status')
      .eq('user_id', userId)
      .eq('status', 'ACTIVE');

    if (accError) {
      logger.error({ accError }, 'Failed fetching accounts for financial calculation');
    }

    let totalAssets = 0;
    let totalLiabilities = 0;

    (accounts || []).forEach((acc) => {
      const bal = Number(acc.balance) || 0;
      if (acc.type === 'CREDIT_CARD' || acc.type === 'LOAN') {
        totalLiabilities += Math.abs(bal);
      } else {
        totalAssets += bal;
      }
    });

    const netWorth = totalAssets - totalLiabilities;

    // 2. Fetch Transactions in period
    const { data: txns, error: txnError } = await supabaseAdminClient
      .from('transactions')
      .select('amount, type, category, date, status')
      .eq('user_id', userId)
      .gte('date', start.toISOString())
      .lte('date', end.toISOString());

    if (txnError) {
      logger.error({ txnError }, 'Failed fetching transactions for financial calculation');
    }

    let totalIncome = 0;
    let totalExpenses = 0;

    (txns || []).forEach((t) => {
      if (t.status === 'FAILED') return;
      const amt = Number(t.amount) || 0;
      const tType = String(t.type).toUpperCase();

      if (tType === 'INCOME') {
        totalIncome += amt;
      } else if (tType === 'EXPENSE') {
        totalExpenses += amt;
      }
      // Note: TRANSFER transactions do NOT increase income or expense
    });

    const netCashFlow = totalIncome - totalExpenses;
    const savingsRate = totalIncome > 0 ? Math.max(0, Math.round(((totalIncome - totalExpenses) / totalIncome) * 100)) : 0;

    return {
      totalAssets,
      totalLiabilities,
      netWorth,
      totalIncome,
      totalExpenses,
      netCashFlow,
      savingsRate,
      periodStart: start.toISOString(),
      periodEnd: end.toISOString(),
    };
  }

  /**
   * Deterministic category spending breakdown with exact percentages
   */
  public static async calculateCategoryBreakdown(
    userId: string,
    period: 'this_month' | 'last_month' | 'last_3_months' | 'this_year' | 'all' = 'this_month'
  ): Promise<CategorySpendingSummary[]> {
    if (!supabaseAdminClient) return [];

    const { start, end } = this.getDateRange(period);

    const { data: txns, error } = await supabaseAdminClient
      .from('transactions')
      .select('amount, category, type, status')
      .eq('user_id', userId)
      .eq('type', 'EXPENSE')
      .gte('date', start.toISOString())
      .lte('date', end.toISOString());

    if (error || !txns) return [];

    const categoryMap: Record<string, { amount: number; count: number }> = {};
    let totalSpent = 0;

    txns.forEach((t) => {
      if (t.status === 'FAILED') return;
      const amt = Number(t.amount) || 0;
      const cat = t.category || 'Uncategorized';

      if (!categoryMap[cat]) {
        categoryMap[cat] = { amount: 0, count: 0 };
      }
      categoryMap[cat].amount += amt;
      categoryMap[cat].count += 1;
      totalSpent += amt;
    });

    return Object.entries(categoryMap)
      .map(([category, info]) => ({
        category,
        amount: Math.round(info.amount * 100) / 100,
        percentage: totalSpent > 0 ? Math.round((info.amount / totalSpent) * 1000) / 10 : 0,
        transactionCount: info.count,
      }))
      .sort((a, b) => b.amount - a.amount);
  }
}
