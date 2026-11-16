/**
 * SPENDX Dashboard Service
 * Centralizes financial data retrieval, deterministic aggregations,
 * date-range filtering, and fallback mechanisms.
 */

import { authService } from './authService';
import { supabase } from './supabase';
import { transactionService } from './transactionService';
import { accountService } from './accountService';

export type DateRangePeriod = 'this_month' | 'last_month' | 'last_3_months' | 'this_year';

export interface FinancialMetric {
  value: number;
  label: string;
  description: string;
  trendPercentage?: number;
  trendIsPositive?: boolean;
}

export interface OverviewMetrics {
  totalBalance: FinancialMetric;
  totalIncome: FinancialMetric;
  totalExpenses: FinancialMetric;
  availableBalance: FinancialMetric;
}

export interface IncomeExpenseDataPoint {
  period: string;
  income: number;
  expenses: number;
}

export interface SpendingCategory {
  id: string;
  name: string;
  amount: number;
  percentage: number;
  color: string;
  iconName: string;
}

export interface BudgetProgress {
  id: string;
  category: string;
  iconName: string;
  limit: number;
  spent: number;
  remaining: number;
  percentage: number;
  status: 'normal' | 'warning' | 'danger';
}

export interface DashboardTransaction {
  id: string;
  title: string;
  merchant: string;
  category: string;
  date: string;
  amount: number;
  type: 'income' | 'expense';
  iconName: string;
}

export interface SavingsGoal {
  id: string;
  name: string;
  targetAmount: number;
  savedAmount: number;
  progressPercentage: number;
  remainingAmount: number;
  iconName: string;
  targetDate?: string;
}

export interface AIInsight {
  id: string;
  title: string;
  description: string;
  category: string;
  impact: 'positive' | 'neutral' | 'warning';
  actionLabel?: string;
  actionUrl?: string;
  isDeterministic: boolean;
}

export interface UpcomingPayment {
  id: string;
  name: string;
  amount: number;
  dueDate: string;
  dueDay: string;
  category: string;
  iconName: string;
}

export interface DashboardData {
  isDemo: boolean;
  userDisplayName: string;
  period: DateRangePeriod;
  overview: OverviewMetrics;
  incomeVsExpense: IncomeExpenseDataPoint[];
  spendingAnalytics: {
    totalSpent: number;
    categories: SpendingCategory[];
  };
  budgets: BudgetProgress[];
  recentTransactions: DashboardTransaction[];
  savingsGoals: SavingsGoal[];
  aiInsights: AIInsight[];
  upcomingPayments: UpcomingPayment[];
}

/**
 * Deterministic Demo Dataset adhering to SPENDX Fintech specifications
 */
const DEMO_DASHBOARD_DATA: Record<DateRangePeriod, Omit<DashboardData, 'isDemo' | 'userDisplayName' | 'period'>> = {
  this_month: {
    overview: {
      totalBalance: {
        value: 124580,
        label: 'Total Balance',
        description: 'Across your tracked accounts',
        trendPercentage: 8.4,
        trendIsPositive: true,
      },
      totalIncome: {
        value: 45000,
        label: 'Total Income',
        description: 'Income this month',
        trendPercentage: 7.1,
        trendIsPositive: true,
      },
      totalExpenses: {
        value: 18450,
        label: 'Total Expenses',
        description: 'Expenses this month',
        trendPercentage: -4.2,
        trendIsPositive: true, // Lower expenses is positive
      },
      availableBalance: {
        value: 26550,
        label: 'Available Balance',
        description: 'Remaining monthly income',
        trendPercentage: 15.6,
        trendIsPositive: true,
      },
    },
    incomeVsExpense: [
      { period: 'Jan', income: 35000, expenses: 18000 },
      { period: 'Feb', income: 40000, expenses: 21000 },
      { period: 'Mar', income: 38000, expenses: 19000 },
      { period: 'Apr', income: 45000, expenses: 24000 },
      { period: 'May', income: 42000, expenses: 20000 },
      { period: 'Jun', income: 48000, expenses: 22000 },
    ],
    spendingAnalytics: {
      totalSpent: 18450,
      categories: [
        { id: '1', name: 'Food & Dining', amount: 6200, percentage: 33.6, color: '#718FE8', iconName: 'Utensils' },
        { id: '2', name: 'Shopping', amount: 4500, percentage: 24.4, color: '#8B72D6', iconName: 'ShoppingBag' },
        { id: '3', name: 'Transport', amount: 3000, percentage: 16.3, color: '#4779C9', iconName: 'Car' },
        { id: '4', name: 'Bills & Utilities', amount: 2750, percentage: 14.9, color: '#C48620', iconName: 'Zap' },
        { id: '5', name: 'Entertainment', amount: 2000, percentage: 10.8, color: '#8066CC', iconName: 'Film' },
      ],
    },
    budgets: [
      {
        id: 'b1',
        category: 'Food & Dining',
        iconName: 'Utensils',
        limit: 8000,
        spent: 6200,
        remaining: 1800,
        percentage: 77.5,
        status: 'normal',
      },
      {
        id: 'b2',
        category: 'Shopping',
        iconName: 'ShoppingBag',
        limit: 6000,
        spent: 4500,
        remaining: 1500,
        percentage: 75.0,
        status: 'normal',
      },
      {
        id: 'b3',
        category: 'Transport',
        iconName: 'Car',
        limit: 4000,
        spent: 3000,
        remaining: 1000,
        percentage: 75.0,
        status: 'normal',
      },
    ],
    recentTransactions: [
      {
        id: 'txn-1',
        title: 'Grocery Shopping',
        merchant: 'Nature Basket Mart',
        category: 'Food & Dining',
        date: 'Today, 11:20 AM',
        amount: 850,
        type: 'expense',
        iconName: 'ShoppingBag',
      },
      {
        id: 'txn-2',
        title: 'Monthly Salary',
        merchant: 'Acme Corp Tech Pvt Ltd',
        category: 'Income',
        date: 'Yesterday, 09:00 AM',
        amount: 45000,
        type: 'income',
        iconName: 'Briefcase',
      },
      {
        id: 'txn-3',
        title: 'Electricity Bill',
        merchant: 'State Power Utility',
        category: 'Utilities',
        date: '12 Nov 2026',
        amount: 1250,
        type: 'expense',
        iconName: 'Zap',
      },
      {
        id: 'txn-4',
        title: 'Fuel Station',
        merchant: 'Shell Petrol Pump',
        category: 'Transport',
        date: '10 Nov 2026',
        amount: 1500,
        type: 'expense',
        iconName: 'Fuel',
      },
      {
        id: 'txn-5',
        title: 'Online Subscription',
        merchant: 'Netflix India',
        category: 'Entertainment',
        date: '08 Nov 2026',
        amount: 499,
        type: 'expense',
        iconName: 'Tv',
      },
    ],
    savingsGoals: [
      {
        id: 'sg-1',
        name: 'Emergency Fund',
        targetAmount: 50000,
        savedAmount: 32000,
        progressPercentage: 64,
        remainingAmount: 18000,
        iconName: 'ShieldCheck',
      },
      {
        id: 'sg-2',
        name: 'New Laptop',
        targetAmount: 80000,
        savedAmount: 24000,
        progressPercentage: 30,
        remainingAmount: 56000,
        iconName: 'Laptop',
      },
    ],
    aiInsights: [
      {
        id: 'ai-1',
        title: 'Dining expenses increased 12%',
        description: 'Dining spend reached ₹6,200 this cycle, up 12% compared to last month’s baseline.',
        category: 'Food & Dining',
        impact: 'warning',
        actionLabel: 'View Breakdown',
        actionUrl: '/analytics',
        isDeterministic: true,
      },
      {
        id: 'ai-2',
        title: 'Recurring subscriptions total ₹1,499/mo',
        description: '3 active auto-debits found. Reviewing unused services could save ₹5,988 annually.',
        category: 'Subscriptions',
        impact: 'neutral',
        actionLabel: 'Audit Subscriptions',
        actionUrl: '/recurring',
        isDeterministic: true,
      },
      {
        id: 'ai-3',
        title: '72% of Shopping budget utilized',
        description: 'You have ₹1,500 remaining with 15 days left in the billing period. Keep daily average under ₹100.',
        category: 'Shopping',
        impact: 'positive',
        actionLabel: 'Adjust Limits',
        actionUrl: '/budgets',
        isDeterministic: true,
      },
    ],
    upcomingPayments: [
      {
        id: 'up-1',
        name: 'Internet Fiber Bill',
        amount: 999,
        dueDate: '18 Nov 2026',
        dueDay: 'in 3 days',
        category: 'Utilities',
        iconName: 'Wifi',
      },
      {
        id: 'up-2',
        name: 'Netflix Subscription',
        amount: 499,
        dueDate: '20 Nov 2026',
        dueDay: 'in 5 days',
        category: 'Entertainment',
        iconName: 'Tv',
      },
      {
        id: 'up-3',
        name: 'Electricity Bill',
        amount: 1250,
        dueDate: '25 Nov 2026',
        dueDay: 'in 10 days',
        category: 'Utilities',
        iconName: 'Zap',
      },
    ],
  },
  last_month: {
    overview: {
      totalBalance: {
        value: 114800,
        label: 'Total Balance',
        description: 'End of last month',
        trendPercentage: 6.2,
        trendIsPositive: true,
      },
      totalIncome: {
        value: 42000,
        label: 'Total Income',
        description: 'Income in previous month',
        trendPercentage: 4.5,
        trendIsPositive: true,
      },
      totalExpenses: {
        value: 19800,
        label: 'Total Expenses',
        description: 'Expenses in previous month',
        trendPercentage: 2.1,
        trendIsPositive: false,
      },
      availableBalance: {
        value: 22200,
        label: 'Available Balance',
        description: 'Net saved previous month',
        trendPercentage: 11.0,
        trendIsPositive: true,
      },
    },
    incomeVsExpense: [
      { period: 'Week 1', income: 10500, expenses: 4800 },
      { period: 'Week 2', income: 10500, expenses: 5100 },
      { period: 'Week 3', income: 10500, expenses: 4900 },
      { period: 'Week 4', income: 10500, expenses: 5000 },
    ],
    spendingAnalytics: {
      totalSpent: 19800,
      categories: [
        { id: '1', name: 'Food & Dining', amount: 6800, percentage: 34.3, color: '#718FE8', iconName: 'Utensils' },
        { id: '2', name: 'Shopping', amount: 5200, percentage: 26.3, color: '#8B72D6', iconName: 'ShoppingBag' },
        { id: '3', name: 'Transport', amount: 3100, percentage: 15.7, color: '#4779C9', iconName: 'Car' },
        { id: '4', name: 'Bills & Utilities', amount: 2800, percentage: 14.1, color: '#C48620', iconName: 'Zap' },
        { id: '5', name: 'Entertainment', amount: 1900, percentage: 9.6, color: '#8066CC', iconName: 'Film' },
      ],
    },
    budgets: [
      {
        id: 'b1',
        category: 'Food & Dining',
        iconName: 'Utensils',
        limit: 8000,
        spent: 6800,
        remaining: 1200,
        percentage: 85.0,
        status: 'warning',
      },
      {
        id: 'b2',
        category: 'Shopping',
        iconName: 'ShoppingBag',
        limit: 6000,
        spent: 5200,
        remaining: 800,
        percentage: 86.6,
        status: 'warning',
      },
      {
        id: 'b3',
        category: 'Transport',
        iconName: 'Car',
        limit: 4000,
        spent: 3100,
        remaining: 900,
        percentage: 77.5,
        status: 'normal',
      },
    ],
    recentTransactions: [
      {
        id: 'txn-lm-1',
        title: 'Monthly Rent',
        merchant: 'Apartment Owner',
        category: 'Housing',
        date: '31 Oct 2026',
        amount: 14000,
        type: 'expense',
        iconName: 'Home',
      },
      {
        id: 'txn-lm-2',
        title: 'Tech Festival Pass',
        merchant: 'DevFest 2026',
        category: 'Entertainment',
        date: '28 Oct 2026',
        amount: 1500,
        type: 'expense',
        iconName: 'Ticket',
      },
    ],
    savingsGoals: [
      {
        id: 'sg-1',
        name: 'Emergency Fund',
        targetAmount: 50000,
        savedAmount: 28000,
        progressPercentage: 56,
        remainingAmount: 22000,
        iconName: 'ShieldCheck',
      },
      {
        id: 'sg-2',
        name: 'New Laptop',
        targetAmount: 80000,
        savedAmount: 20000,
        progressPercentage: 25,
        remainingAmount: 60000,
        iconName: 'Laptop',
      },
    ],
    aiInsights: [
      {
        id: 'ai-lm-1',
        title: 'Completed cycle under budget overall',
        description: 'Overall monthly outgoings remained 9.8% below the total planned ceiling.',
        category: 'Budgeting',
        impact: 'positive',
        actionLabel: 'View Summary',
        actionUrl: '/reports',
        isDeterministic: true,
      },
    ],
    upcomingPayments: [],
  },
  last_3_months: {
    overview: {
      totalBalance: {
        value: 124580,
        label: 'Total Balance',
        description: 'Quarterly financial snapshot',
        trendPercentage: 14.2,
        trendIsPositive: true,
      },
      totalIncome: {
        value: 132000,
        label: 'Total Income',
        description: 'Cumulative 3-month earnings',
        trendPercentage: 9.8,
        trendIsPositive: true,
      },
      totalExpenses: {
        value: 58250,
        label: 'Total Expenses',
        description: 'Cumulative 3-month expenses',
        trendPercentage: -3.5,
        trendIsPositive: true,
      },
      availableBalance: {
        value: 73750,
        label: 'Available Balance',
        description: 'Net surplus saved in 90 days',
        trendPercentage: 22.4,
        trendIsPositive: true,
      },
    },
    incomeVsExpense: [
      { period: 'Sep', income: 42000, expenses: 19800 },
      { period: 'Oct', income: 45000, expenses: 20000 },
      { period: 'Nov', income: 45000, expenses: 18450 },
    ],
    spendingAnalytics: {
      totalSpent: 58250,
      categories: [
        { id: '1', name: 'Food & Dining', amount: 19200, percentage: 33.0, color: '#718FE8', iconName: 'Utensils' },
        { id: '2', name: 'Shopping', amount: 14700, percentage: 25.2, color: '#8B72D6', iconName: 'ShoppingBag' },
        { id: '3', name: 'Transport', amount: 9600, percentage: 16.5, color: '#4779C9', iconName: 'Car' },
        { id: '4', name: 'Bills & Utilities', amount: 8750, percentage: 15.0, color: '#C48620', iconName: 'Zap' },
        { id: '5', name: 'Entertainment', amount: 6000, percentage: 10.3, color: '#8066CC', iconName: 'Film' },
      ],
    },
    budgets: [
      {
        id: 'b1',
        category: 'Food & Dining',
        iconName: 'Utensils',
        limit: 24000,
        spent: 19200,
        remaining: 4800,
        percentage: 80.0,
        status: 'warning',
      },
      {
        id: 'b2',
        category: 'Shopping',
        iconName: 'ShoppingBag',
        limit: 18000,
        spent: 14700,
        remaining: 3300,
        percentage: 81.6,
        status: 'warning',
      },
      {
        id: 'b3',
        category: 'Transport',
        iconName: 'Car',
        limit: 12000,
        spent: 9600,
        remaining: 2400,
        percentage: 80.0,
        status: 'warning',
      },
    ],
    recentTransactions: [
      {
        id: 'txn-3m-1',
        title: 'Quarterly Insurance Premium',
        merchant: 'HDFC Ergo Health',
        category: 'Insurance',
        date: '15 Oct 2026',
        amount: 7500,
        type: 'expense',
        iconName: 'Shield',
      },
    ],
    savingsGoals: [
      {
        id: 'sg-1',
        name: 'Emergency Fund',
        targetAmount: 50000,
        savedAmount: 32000,
        progressPercentage: 64,
        remainingAmount: 18000,
        iconName: 'ShieldCheck',
      },
      {
        id: 'sg-2',
        name: 'New Laptop',
        targetAmount: 80000,
        savedAmount: 24000,
        progressPercentage: 30,
        remainingAmount: 56000,
        iconName: 'Laptop',
      },
    ],
    aiInsights: [
      {
        id: 'ai-3m-1',
        title: 'Quarterly savings rate is 55.8%',
        description: 'You retained ₹73,750 from ₹132,000 earnings, performing better than 88% of users.',
        category: 'Savings',
        impact: 'positive',
        actionLabel: 'View Report',
        actionUrl: '/reports',
        isDeterministic: true,
      },
    ],
    upcomingPayments: [],
  },
  this_year: {
    overview: {
      totalBalance: {
        value: 124580,
        label: 'Total Balance',
        description: 'Year-to-date position',
        trendPercentage: 28.5,
        trendIsPositive: true,
      },
      totalIncome: {
        value: 520000,
        label: 'Total Income',
        description: 'Total annual earnings in 2026',
        trendPercentage: 18.2,
        trendIsPositive: true,
      },
      totalExpenses: {
        value: 234000,
        label: 'Total Expenses',
        description: 'Total annual outgoings in 2026',
        trendPercentage: -6.4,
        trendIsPositive: true,
      },
      availableBalance: {
        value: 286000,
        label: 'Available Balance',
        description: 'Cumulative annual capital retained',
        trendPercentage: 36.8,
        trendIsPositive: true,
      },
    },
    incomeVsExpense: [
      { period: 'Q1', income: 120000, expenses: 58000 },
      { period: 'Q2', income: 135000, expenses: 62000 },
      { period: 'Q3', income: 130000, expenses: 56000 },
      { period: 'Q4', income: 135000, expenses: 58000 },
    ],
    spendingAnalytics: {
      totalSpent: 234000,
      categories: [
        { id: '1', name: 'Food & Dining', amount: 78000, percentage: 33.3, color: '#718FE8', iconName: 'Utensils' },
        { id: '2', name: 'Shopping', amount: 58000, percentage: 24.8, color: '#8B72D6', iconName: 'ShoppingBag' },
        { id: '3', name: 'Transport', amount: 38000, percentage: 16.2, color: '#4779C9', iconName: 'Car' },
        { id: '4', name: 'Bills & Utilities', amount: 36000, percentage: 15.4, color: '#C48620', iconName: 'Zap' },
        { id: '5', name: 'Entertainment', amount: 24000, percentage: 10.3, color: '#8066CC', iconName: 'Film' },
      ],
    },
    budgets: [
      {
        id: 'b1',
        category: 'Food & Dining',
        iconName: 'Utensils',
        limit: 96000,
        spent: 78000,
        remaining: 18000,
        percentage: 81.25,
        status: 'warning',
      },
      {
        id: 'b2',
        category: 'Shopping',
        iconName: 'ShoppingBag',
        limit: 72000,
        spent: 58000,
        remaining: 14000,
        percentage: 80.55,
        status: 'warning',
      },
      {
        id: 'b3',
        category: 'Transport',
        iconName: 'Car',
        limit: 48000,
        spent: 38000,
        remaining: 10000,
        percentage: 79.16,
        status: 'normal',
      },
    ],
    recentTransactions: [],
    savingsGoals: [
      {
        id: 'sg-1',
        name: 'Emergency Fund',
        targetAmount: 50000,
        savedAmount: 32000,
        progressPercentage: 64,
        remainingAmount: 18000,
        iconName: 'ShieldCheck',
      },
      {
        id: 'sg-2',
        name: 'New Laptop',
        targetAmount: 80000,
        savedAmount: 24000,
        progressPercentage: 30,
        remainingAmount: 56000,
        iconName: 'Laptop',
      },
    ],
    aiInsights: [
      {
        id: 'ai-y-1',
        title: 'Annual financial discipline on track',
        description: 'You are saving 55% of overall earnings, exceeding your initial 40% goal for 2026.',
        category: 'Year In Review',
        impact: 'positive',
        actionLabel: 'Export Annual Report',
        actionUrl: '/reports',
        isDeterministic: true,
      },
    ],
    upcomingPayments: [],
  },
};

export const dashboardService = {
  /**
   * Retrieves dashboard financial payload
   */
  async getDashboardData(period: DateRangePeriod = 'this_month'): Promise<DashboardData> {
    const user = authService.getUser();
    const userDisplayName = user?.fullName || (user?.email ? user.email.split('@')[0] : 'Client');

    // Check if user has explicitly cleared demo data to start fresh with real finances
    const isDemoCleared = typeof window !== 'undefined' && localStorage.getItem('spendx_demo_mode') === 'cleared';
    if (isDemoCleared) {
      const localTx = transactionService.getStoredTransactions();
      const localAccounts = accountService.getStoredAccounts();

      let income = 0;
      let expenses = 0;
      localTx.forEach((t) => {
        if (t.type === 'INCOME') {
          income += t.amount;
        } else if (t.type === 'EXPENSE') {
          expenses += t.amount;
        }
      });

      const totalBalance = localAccounts.length > 0
        ? localAccounts.reduce((acc, a) => acc + (a.balance || 0), 0)
        : income - expenses;

      return {
        isDemo: false,
        userDisplayName,
        period,
        overview: {
          totalBalance: {
            value: totalBalance,
            label: 'Total Balance',
            description: localAccounts.length > 0 ? `${localAccounts.length} accounts connected` : 'Net balance recorded',
            trendPercentage: 0,
            trendIsPositive: true,
          },
          totalIncome: {
            value: income,
            label: 'Total Income',
            description: income > 0 ? 'Total credited inflows' : 'Zero income recorded this period',
          },
          totalExpenses: {
            value: expenses,
            label: 'Total Expenses',
            description: expenses > 0 ? 'Total debited outflows' : 'Zero expenses recorded this period',
          },
          availableBalance: {
            value: Math.max(0, totalBalance),
            label: 'Available Balance',
            description: 'Ready for allocation',
          },
        },
        incomeVsExpense: income > 0 || expenses > 0 ? [{ period: 'Current', income, expenses }] : [],
        spendingAnalytics: {
          totalSpent: expenses,
          categories: [],
        },
        budgets: [],
        recentTransactions: localTx.slice(0, 6).map((t) => ({
          id: t.id,
          title: t.description || 'Transaction',
          merchant: t.merchantName || t.description || 'Merchant',
          category: t.category || 'General',
          date: t.date || new Date().toISOString().split('T')[0],
          amount: t.amount,
          type: (t.type === 'INCOME' ? 'income' : 'expense') as 'income' | 'expense',
          iconName: 'Receipt',
        })),
        savingsGoals: [],
        aiInsights: [],
        upcomingPayments: [],
      };
    }

    // If Supabase is connected and user is logged in with real data, query tables:
    if (supabase && user && user.id !== 'demo-user-id') {
      try {
        const { data: transactions, error } = await supabase
          .from('transactions')
          .select('*')
          .eq('user_id', user.id)
          .order('date', { ascending: false })
          .limit(10);

        if (!error && transactions && transactions.length > 0) {
          // Compute live deterministic totals
          let income = 0;
          let expenses = 0;
          transactions.forEach((t) => {
            if (t.type === 'income' || t.amount > 0) {
              income += Math.abs(t.amount);
            } else {
              expenses += Math.abs(t.amount);
            }
          });

          return {
            isDemo: false,
            userDisplayName,
            period,
            overview: {
              totalBalance: {
                value: income - expenses,
                label: 'Total Balance',
                description: 'Across your linked accounts',
                trendPercentage: 0,
                trendIsPositive: true,
              },
              totalIncome: {
                value: income,
                label: 'Total Income',
                description: 'Income recorded this period',
              },
              totalExpenses: {
                value: expenses,
                label: 'Total Expenses',
                description: 'Expenses recorded this period',
              },
              availableBalance: {
                value: Math.max(0, income - expenses),
                label: 'Available Balance',
                description: 'Net balance remaining',
              },
            },
            incomeVsExpense: [
              { period: 'Current', income, expenses },
            ],
            spendingAnalytics: {
              totalSpent: expenses,
              categories: [
                { id: '1', name: 'General', amount: expenses, percentage: 100, color: '#718FE8', iconName: 'ShoppingBag' }
              ],
            },
            budgets: [],
            recentTransactions: transactions.map((t) => ({
              id: t.id,
              title: t.description || 'Transaction',
              merchant: t.merchantName || t.description || 'Merchant',
              category: t.category || 'General',
              date: new Date(t.date).toLocaleDateString(),
              amount: Math.abs(t.amount),
              type: t.amount >= 0 ? 'income' : 'expense',
              iconName: 'Receipt',
            })),
            savingsGoals: [],
            aiInsights: [
              {
                id: 'ai-live-1',
                title: 'Live Transactions Active',
                description: `Synchronized ${transactions.length} verified transactions from your linked accounts.`,
                category: 'Account Sync',
                impact: 'positive',
                actionLabel: 'View All',
                actionUrl: '/transactions',
                isDeterministic: true,
              }
            ],
            upcomingPayments: [],
          };
        }
      } catch (e) {
        console.warn('Could not load remote Supabase dashboard data; falling back to deterministic dataset', e);
      }
    }

    // Return deterministic demo data with clear identification
    const periodData = DEMO_DASHBOARD_DATA[period];
    return {
      isDemo: true,
      userDisplayName,
      period,
      ...periodData,
    };
  },

  /**
   * Currency formatter in Indian Rupee format (INR ₹)
   */
  formatINR(value: number): string {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 2,
    }).format(value);
  },

  /**
   * Clears sample benchmark demo data and switches to real-use zero state
   */
  clearDemoData(): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem('spendx_demo_mode', 'cleared');
    }
  },

  /**
   * Restores sample benchmark demo data for previewing features
   */
  loadDemoData(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('spendx_demo_mode');
    }
  },

  /**
   * Checks whether demo data has been cleared
   */
  isDemoCleared(): boolean {
    return typeof window !== 'undefined' && localStorage.getItem('spendx_demo_mode') === 'cleared';
  },
};
