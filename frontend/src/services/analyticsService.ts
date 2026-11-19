/**
 * SPENDX Analytics Service
 * Pure deterministic financial aggregation, period-over-period telemetry,
 * category distributions, spending trends, and CSV reporting.
 */

import { TransactionRecord, transactionService } from './transactionService';

export type AnalyticsDatePreset =
  | 'THIS_WEEK'
  | 'THIS_MONTH'
  | 'LAST_MONTH'
  | 'LAST_3_MONTHS'
  | 'LAST_6_MONTHS'
  | 'THIS_YEAR'
  | 'LAST_YEAR'
  | 'ALL_TIME'
  | 'CUSTOM';

export interface AnalyticsFiltersState {
  datePreset: AnalyticsDatePreset;
  customStartDate?: string;
  customEndDate?: string;
  accountId: string; // 'ALL' or specific account id
  transactionType: 'ALL' | 'EXPENSE' | 'INCOME';
  category: string; // 'ALL' or specific category
  compareWithPrevious: boolean;
}

export interface AnalyticsSummaryMetrics {
  totalIncome: number;
  totalExpenses: number;
  netCashFlow: number;
  savingsRate: number; // in percent
  transactionCount: number;
  // Previous period metrics
  prevIncome: number;
  prevExpenses: number;
  prevNetCashFlow: number;
  prevSavingsRate: number;
  incomeChangePct: number;
  expenseChangePct: number;
  cashFlowChangePct: number;
}

export interface TimelineDataPoint {
  key: string;
  label: string;
  income: number;
  expense: number;
  net: number;
}

export interface CategoryBreakdownItem {
  category: string;
  amount: number;
  percentage: number;
  transactionCount: number;
  color: string;
}

export interface AccountFinancialItem {
  accountId: string;
  accountName: string;
  type: string;
  income: number;
  expenses: number;
  netCashFlow: number;
  transactionCount: number;
}

export interface PeriodicTableRow {
  periodKey: string;
  periodLabel: string;
  income: number;
  expenses: number;
  netCashFlow: number;
  savingsRate: number;
  transactionCount: number;
}

export interface AnalyticsInsightItem {
  id: string;
  title: string;
  description: string;
  type: 'POSITIVE' | 'NEUTRAL' | 'WARNING';
}

const CATEGORY_PALETTE = [
  '#10B981', // Emerald
  '#A5F12B', // Neon Lime
  '#05CD99', // Mint
  '#D97706', // Warm Amber
  '#0D9488', // Teal
  '#166534', // Forest Green
  '#84CC16', // Olive Lime
  '#15803D', // Medium Green
  '#047857', // Pine Green
  '#DC2626', // Crimson (for alerts)
  '#F59E0B', // Amber
  '#64748B', // Slate
];

export const analyticsService = {
  /**
   * Computes the Date range [start, end] for a given preset
   */
  getDateRange(
    preset: AnalyticsDatePreset,
    customStart?: string,
    customEnd?: string
  ): { start: Date; end: Date } {
    const now = new Date();

    switch (preset) {
      case 'THIS_WEEK': {
        const start = new Date(now);
        const day = start.getDay();
        const diff = start.getDate() - day + (day === 0 ? -6 : 1); // Monday
        start.setDate(diff);
        start.setHours(0, 0, 0, 0);
        const end = new Date(now);
        end.setHours(23, 59, 59, 999);
        return { start, end };
      }
      case 'THIS_MONTH': {
        const start = new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0, 0);
        const end = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
        return { start, end };
      }
      case 'LAST_MONTH': {
        const start = new Date(now.getFullYear(), now.getMonth() - 1, 1, 0, 0, 0, 0);
        const end = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59, 999);
        return { start, end };
      }
      case 'LAST_3_MONTHS': {
        const start = new Date(now.getFullYear(), now.getMonth() - 2, 1, 0, 0, 0, 0);
        const end = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
        return { start, end };
      }
      case 'LAST_6_MONTHS': {
        const start = new Date(now.getFullYear(), now.getMonth() - 5, 1, 0, 0, 0, 0);
        const end = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
        return { start, end };
      }
      case 'THIS_YEAR': {
        const start = new Date(now.getFullYear(), 0, 1, 0, 0, 0, 0);
        const end = new Date(now.getFullYear(), 11, 31, 23, 59, 59, 999);
        return { start, end };
      }
      case 'LAST_YEAR': {
        const start = new Date(now.getFullYear() - 1, 0, 1, 0, 0, 0, 0);
        const end = new Date(now.getFullYear() - 1, 11, 31, 23, 59, 59, 999);
        return { start, end };
      }
      case 'ALL_TIME': {
        const start = new Date(2020, 0, 1, 0, 0, 0, 0);
        const end = new Date(now.getFullYear() + 1, 11, 31, 23, 59, 59, 999);
        return { start, end };
      }
      case 'CUSTOM': {
        const start = customStart ? new Date(customStart) : new Date(now.getFullYear(), now.getMonth(), 1);
        start.setHours(0, 0, 0, 0);
        const end = customEnd ? new Date(customEnd) : new Date(now);
        end.setHours(23, 59, 59, 999);
        return { start, end };
      }
      default:
        return {
          start: new Date(now.getFullYear(), now.getMonth(), 1),
          end: new Date(now.getFullYear(), now.getMonth() + 1, 0),
        };
    }
  },

  /**
   * Computes the immediate preceding equivalent period
   */
  getPreviousPeriodRange(start: Date, end: Date): { start: Date; end: Date } {
    const duration = end.getTime() - start.getTime();
    const prevEnd = new Date(start.getTime() - 1);
    const prevStart = new Date(prevEnd.getTime() - duration);
    return { start: prevStart, end: prevEnd };
  },

  /**
   * Filter raw transactions based on analytics filters and date window
   */
  filterTransactions(
    transactions: TransactionRecord[],
    start: Date,
    end: Date,
    accountId: string,
    transactionType: 'ALL' | 'EXPENSE' | 'INCOME',
    category: string
  ): TransactionRecord[] {
    const startTime = start.getTime();
    const endTime = end.getTime();

    return transactions.filter((t) => {
      // Internal transfers are excluded from general income/expense analytics
      if (t.type === 'TRANSFER') return false;

      // Status check: only COMPLETED transactions participate in analytics
      if (t.status !== 'COMPLETED') return false;

      // Date check
      const tTime = new Date(t.date).getTime();
      if (tTime < startTime || tTime > endTime) return false;

      // Account filter
      if (accountId !== 'ALL' && t.accountId !== accountId) return false;

      // Type filter
      if (transactionType !== 'ALL' && t.type !== transactionType) return false;

      // Category filter
      if (category !== 'ALL' && t.category !== category) return false;

      return true;
    });
  },

  /**
   * Compute comprehensive 4 primary summary cards & period-over-period changes
   */
  computeSummaryMetrics(
    currentTxns: TransactionRecord[],
    previousTxns: TransactionRecord[]
  ): AnalyticsSummaryMetrics {
    let totalIncome = 0;
    let totalExpenses = 0;

    currentTxns.forEach((t) => {
      if (t.type === 'INCOME') totalIncome += t.amount;
      if (t.type === 'EXPENSE') totalExpenses += t.amount;
    });

    const netCashFlow = totalIncome - totalExpenses;
    const savingsRate =
      totalIncome > 0
        ? Number((Math.max(0, netCashFlow / totalIncome) * 100).toFixed(1))
        : 0;

    let prevIncome = 0;
    let prevExpenses = 0;

    previousTxns.forEach((t) => {
      if (t.type === 'INCOME') prevIncome += t.amount;
      if (t.type === 'EXPENSE') prevExpenses += t.amount;
    });

    const prevNetCashFlow = prevIncome - prevExpenses;
    const prevSavingsRate =
      prevIncome > 0
        ? Number((Math.max(0, prevNetCashFlow / prevIncome) * 100).toFixed(1))
        : 0;

    const calcPctChange = (curr: number, prev: number) => {
      if (prev === 0) return curr > 0 ? 100 : 0;
      return Number((((curr - prev) / Math.abs(prev)) * 100).toFixed(1));
    };

    return {
      totalIncome,
      totalExpenses,
      netCashFlow,
      savingsRate,
      transactionCount: currentTxns.length,
      prevIncome,
      prevExpenses,
      prevNetCashFlow,
      prevSavingsRate,
      incomeChangePct: calcPctChange(totalIncome, prevIncome),
      expenseChangePct: calcPctChange(totalExpenses, prevExpenses),
      cashFlowChangePct: calcPctChange(netCashFlow, prevNetCashFlow),
    };
  },

  /**
   * Generate chronological timeline aggregations for Income vs Expenses chart
   */
  generateTimelineData(
    transactions: TransactionRecord[],
    start: Date,
    end: Date
  ): TimelineDataPoint[] {
    const diffDays = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    const isDaily = diffDays <= 45;

    const map: { [key: string]: { label: string; income: number; expense: number } } = {};

    transactions.forEach((t) => {
      const d = new Date(t.date);
      let key: string;
      let label: string;

      if (isDaily) {
        key = d.toISOString().split('T')[0];
        label = d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
      } else {
        key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
        label = d.toLocaleDateString('en-IN', { month: 'short', year: '2-digit' });
      }

      if (!map[key]) {
        map[key] = { label, income: 0, expense: 0 };
      }

      if (t.type === 'INCOME') map[key].income += t.amount;
      if (t.type === 'EXPENSE') map[key].expense += t.amount;
    });

    const keys = Object.keys(map).sort();
    return keys.map((key) => ({
      key,
      label: map[key].label,
      income: map[key].income,
      expense: map[key].expense,
      net: map[key].income - map[key].expense,
    }));
  },

  /**
   * Generate expense breakdown by category with colors and percentages
   */
  generateExpenseCategoryBreakdown(transactions: TransactionRecord[]): CategoryBreakdownItem[] {
    const expenses = transactions.filter((t) => t.type === 'EXPENSE');
    const totalExpense = expenses.reduce((sum, t) => sum + t.amount, 0);

    const map: { [cat: string]: { amount: number; count: number } } = {};
    expenses.forEach((t) => {
      if (!map[t.category]) {
        map[t.category] = { amount: 0, count: 0 };
      }
      map[t.category].amount += t.amount;
      map[t.category].count += 1;
    });

    return Object.entries(map)
      .map(([category, data], idx) => ({
        category,
        amount: data.amount,
        percentage:
          totalExpense > 0 ? Number(((data.amount / totalExpense) * 100).toFixed(1)) : 0,
        transactionCount: data.count,
        color: CATEGORY_PALETTE[idx % CATEGORY_PALETTE.length],
      }))
      .sort((a, b) => b.amount - a.amount);
  },

  /**
   * Generate income source breakdown
   */
  generateIncomeCategoryBreakdown(transactions: TransactionRecord[]): CategoryBreakdownItem[] {
    const incomes = transactions.filter((t) => t.type === 'INCOME');
    const totalIncome = incomes.reduce((sum, t) => sum + t.amount, 0);

    const map: { [cat: string]: { amount: number; count: number } } = {};
    incomes.forEach((t) => {
      if (!map[t.category]) {
        map[t.category] = { amount: 0, count: 0 };
      }
      map[t.category].amount += t.amount;
      map[t.category].count += 1;
    });

    return Object.entries(map)
      .map(([category, data], idx) => ({
        category,
        amount: data.amount,
        percentage:
          totalIncome > 0 ? Number(((data.amount / totalIncome) * 100).toFixed(1)) : 0,
        transactionCount: data.count,
        color: CATEGORY_PALETTE[idx % CATEGORY_PALETTE.length],
      }))
      .sort((a, b) => b.amount - a.amount);
  },

  /**
   * Generate account financial activity distribution
   */
  generateAccountAnalysis(transactions: TransactionRecord[]): AccountFinancialItem[] {
    const map: {
      [id: string]: {
        name: string;
        income: number;
        expenses: number;
        count: number;
      };
    } = {};

    transactions.forEach((t) => {
      if (!map[t.accountId]) {
        map[t.accountId] = {
          name: t.accountName,
          income: 0,
          expenses: 0,
          count: 0,
        };
      }
      if (t.type === 'INCOME') map[t.accountId].income += t.amount;
      if (t.type === 'EXPENSE') map[t.accountId].expenses += t.amount;
      map[t.accountId].count += 1;
    });

    return Object.entries(map).map(([accountId, data]) => ({
      accountId,
      accountName: data.name,
      type: 'Account',
      income: data.income,
      expenses: data.expenses,
      netCashFlow: data.income - data.expenses,
      transactionCount: data.count,
    }));
  },

  /**
   * Generate top spending categories list
   */
  generateTopSpendingCategories(
    breakdown: CategoryBreakdownItem[]
  ): Array<CategoryBreakdownItem & { rank: number }> {
    return breakdown.slice(0, 5).map((item, index) => ({
      ...item,
      rank: index + 1,
    }));
  },

  /**
   * Get largest transactions by type
   */
  getLargestTransactions(
    transactions: TransactionRecord[],
    type: 'EXPENSE' | 'INCOME',
    limit = 5
  ): TransactionRecord[] {
    return transactions
      .filter((t) => t.type === type)
      .sort((a, b) => b.amount - a.amount)
      .slice(0, limit);
  },

  /**
   * Generate data-driven financial insights
   */
  generateInsights(
    summary: AnalyticsSummaryMetrics,
    expenseBreakdown: CategoryBreakdownItem[],
    transactions: TransactionRecord[]
  ): AnalyticsInsightItem[] {
    const insights: AnalyticsInsightItem[] = [];

    // 1. Highest Expense Category
    if (expenseBreakdown.length > 0) {
      const top = expenseBreakdown[0];
      insights.push({
        id: 'insight-top-expense',
        title: `Primary Expense: ${top.category}`,
        description: `${top.category} accounts for ${top.percentage}% (${transactionService.formatINR(top.amount)}) of total period expenditures across ${top.transactionCount} transactions.`,
        type: 'NEUTRAL',
      });
    }

    // 2. Spending Trend Comparison
    if (summary.prevExpenses > 0) {
      const isHigher = summary.totalExpenses > summary.prevExpenses;
      insights.push({
        id: 'insight-expense-trend',
        title: isHigher ? 'Expenditure Increase' : 'Discipline Recognized',
        description: isHigher
          ? `Outflows are up ${Math.abs(summary.expenseChangePct)}% compared to the prior equivalent timeframe (+${transactionService.formatINR(summary.totalExpenses - summary.prevExpenses)}).`
          : `Discretionary and core spending dropped by ${Math.abs(summary.expenseChangePct)}% compared to the preceding period (-${transactionService.formatINR(summary.prevExpenses - summary.totalExpenses)}).`,
        type: isHigher ? 'WARNING' : 'POSITIVE',
      });
    }

    // 3. Savings Rate Metric
    if (summary.totalIncome > 0) {
      const isHealthy = summary.savingsRate >= 20;
      insights.push({
        id: 'insight-savings-rate',
        title: `Net Savings Rate: ${summary.savingsRate}%`,
        description: isHealthy
          ? `Excellent financial pacing: Retaining ${summary.savingsRate}% of gross inflows above living expenses.`
          : `Savings rate stands at ${summary.savingsRate}%. Target a baseline of 20% to accelerate emergency buffers and wealth goals.`,
        type: isHealthy ? 'POSITIVE' : 'NEUTRAL',
      });
    }

    // 4. Single Largest Expense
    const largestExpense = [...transactions]
      .filter((t) => t.type === 'EXPENSE')
      .sort((a, b) => b.amount - a.amount)[0];

    if (largestExpense) {
      insights.push({
        id: 'insight-largest-tx',
        title: `Peak Outflow: ${largestExpense.description || largestExpense.merchantName || 'Expense'}`,
        description: `Single largest charge was ${transactionService.formatINR(largestExpense.amount)} in ${largestExpense.category} on ${new Date(largestExpense.date).toLocaleDateString('en-IN')}.`,
        type: 'NEUTRAL',
      });
    }

    return insights;
  },

  /**
   * Generate periodic data table rows (e.g. Month by Month breakdown)
   */
  generatePeriodicTableRows(transactions: TransactionRecord[]): PeriodicTableRow[] {
    const map: {
      [key: string]: {
        label: string;
        income: number;
        expenses: number;
        count: number;
      };
    } = {};

    transactions.forEach((t) => {
      const d = new Date(t.date);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      const label = d.toLocaleDateString('en-IN', { month: 'long', year: 'numeric' });

      if (!map[key]) {
        map[key] = { label, income: 0, expenses: 0, count: 0 };
      }

      if (t.type === 'INCOME') map[key].income += t.amount;
      if (t.type === 'EXPENSE') map[key].expenses += t.amount;
      map[key].count += 1;
    });

    const sortedKeys = Object.keys(map).sort().reverse();
    return sortedKeys.map((k) => {
      const row = map[k];
      const net = row.income - row.expenses;
      const rate = row.income > 0 ? Number(((Math.max(0, net) / row.income) * 100).toFixed(1)) : 0;
      return {
        periodKey: k,
        periodLabel: row.label,
        income: row.income,
        expenses: row.expenses,
        netCashFlow: net,
        savingsRate: rate,
        transactionCount: row.count,
      };
    });
  },

  /**
   * Export Analytics Data Table to RFC 4180 CSV
   */
  exportAnalyticsCSV(rows: PeriodicTableRow[], filename = 'spendx-analytics.csv'): void {
    const headers = [
      'Period',
      'Total Income (INR)',
      'Total Expenses (INR)',
      'Net Cash Flow (INR)',
      'Savings Rate (%)',
      'Transaction Count',
    ];

    const dataRows = rows.map((r) => [
      `"${r.periodLabel}"`,
      r.income.toFixed(2),
      r.expenses.toFixed(2),
      r.netCashFlow.toFixed(2),
      `${r.savingsRate}%`,
      r.transactionCount.toString(),
    ]);

    const csvContent = [headers.join(','), ...dataRows.map((r) => r.join(','))].join('\r\n');
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

  formatINR(amount: number): string {
    return transactionService.formatINR(amount);
  },
};
