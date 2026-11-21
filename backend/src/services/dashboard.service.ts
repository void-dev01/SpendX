import { FinancialCalculationService } from './financial.service.js';
import { supabaseAdminClient } from '../config/supabase.js';
import { localStore } from '../db/localStore.js';
import { BudgetService } from './budget.service.js';
import { SavingsService } from './savings.service.js';
import { RecurringService } from './recurring.service.js';

export class DashboardService {
  public static async getDashboardMetrics(
    userId: string,
    period: 'this_month' | 'last_month' | 'last_3_months' | 'this_year' | 'all' = 'this_month'
  ) {
    // 1. Authoritative Financial Overview & Categories (with localStore offline fallback)
    const overview = await FinancialCalculationService.calculateFinancialOverview(userId, period);
    const categoryBreakdown = await FinancialCalculationService.calculateCategoryBreakdown(userId, period);

    // 2. Fetch User Profile
    let userDisplayName = 'Member';
    if (supabaseAdminClient) {
      const { data: profile } = await supabaseAdminClient
        .from('profiles')
        .select('full_name, currency')
        .eq('id', userId)
        .single();
      userDisplayName = profile?.full_name || 'Member';
    } else {
      const user = localStore.getUserProfile(userId);
      userDisplayName = user?.fullName || 'SpendX Member';
    }

    // 3. Budgets & Savings
    const budgets = await BudgetService.getBudgets(userId);
    const savingsGoals = await SavingsService.getGoals(userId);

    // 4. Recent Transactions (latest 6)
    let formattedRecentTxns: any[] = [];
    if (supabaseAdminClient) {
      const { data: recentTxns } = await supabaseAdminClient
        .from('transactions')
        .select('id, amount, type, category, description, merchant_name, date, status')
        .eq('user_id', userId)
        .order('date', { ascending: false })
        .limit(6);

      formattedRecentTxns = (recentTxns || []).map((t: any) => ({
        id: t.id,
        title: t.description,
        merchant: t.merchant_name || t.description,
        category: t.category,
        date: t.date,
        amount: Number(t.amount),
        type: String(t.type).toLowerCase() === 'income' ? 'income' : 'expense',
        iconName: t.category || 'Receipt',
      }));
    } else {
      const localTxns = localStore
        .getTransactions()
        .filter((t) => t.userId === userId)
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, 6);

      formattedRecentTxns = localTxns.map((t: any) => ({
        id: t.id,
        title: t.description,
        merchant: t.merchantName || t.description,
        category: t.category,
        date: t.date,
        amount: Number(t.amount),
        type: String(t.type).toLowerCase() === 'income' ? 'income' : 'expense',
        iconName: t.category || 'Receipt',
      }));
    }

    // 5. Upcoming recurring bills (next 30 days)
    const recurringAll = await RecurringService.getRecurringPayments(userId);
    const now = new Date();
    const thirtyDaysLater = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

    const upcomingPayments = recurringAll
      .filter((r: any) => {
        const dueDate = new Date(r.nextDueDate);
        return dueDate >= now && dueDate <= thirtyDaysLater && r.status !== 'CANCELLED' && r.status !== 'PAUSED';
      })
      .map((r: any) => ({
        id: r.id,
        name: r.name,
        amount: r.amount,
        dueDate: r.nextDueDate,
        dueDay: new Date(r.nextDueDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }),
        category: r.category,
        iconName: r.category,
      }));

    // 6. Active Financial Insights from Database
    let aiInsights: any[] = [];
    if (supabaseAdminClient) {
      const { data: dbInsights } = await supabaseAdminClient
        .from('financial_insights')
        .select('*')
        .eq('user_id', userId)
        .eq('is_dismissed', false)
        .order('generated_at', { ascending: false })
        .limit(3);

      aiInsights = (dbInsights || []).map((ins: any) => ({
        id: ins.id,
        title: ins.title,
        description: ins.description,
        category: ins.category || 'Financial Alert',
        impact: ins.impact ? ins.impact.toLowerCase() : 'neutral',
        actionLabel: ins.action_label || 'View Details',
        actionUrl: ins.action_route || '/insights',
        isDeterministic: true,
      }));
    }

    // 7. Income vs Expense Trend datapoints
    const { start, end } = FinancialCalculationService.getDateRange(period);
    let periodTxns: any[] = [];
    if (supabaseAdminClient) {
      const { data } = await supabaseAdminClient
        .from('transactions')
        .select('amount, type, date, status')
        .eq('user_id', userId)
        .gte('date', start.toISOString())
        .lte('date', end.toISOString());
      periodTxns = data || [];
    } else {
      periodTxns = localStore
        .getTransactions()
        .filter((t) => {
          if (t.userId !== userId) return false;
          const d = new Date(t.date);
          return d >= start && d <= end;
        })
        .map((t) => ({
          amount: t.amount,
          type: t.type,
          date: t.date,
          status: t.status,
        }));
    }

    // Group into 4 weekly or monthly buckets
    const incomeVsExpense: Array<{ period: string; income: number; expenses: number }> = [];
    if (period === 'last_3_months' || period === 'this_year') {
      // Group by month
      const monthMap: Record<string, { income: number; expenses: number }> = {};
      (periodTxns || []).forEach((t: any) => {
        if (t.status === 'FAILED') return;
        const mKey = new Date(t.date).toLocaleDateString('en-IN', { month: 'short' });
        if (!monthMap[mKey]) monthMap[mKey] = { income: 0, expenses: 0 };
        if (t.type === 'INCOME') monthMap[mKey].income += Number(t.amount);
        else if (t.type === 'EXPENSE') monthMap[mKey].expenses += Number(t.amount);
      });
      Object.entries(monthMap).forEach(([pName, vals]) => {
        incomeVsExpense.push({ period: pName, income: vals.income, expenses: vals.expenses });
      });
    } else {
      // Group into 4 weeks
      for (let i = 1; i <= 4; i++) {
        incomeVsExpense.push({ period: `Week ${i}`, income: 0, expenses: 0 });
      }
      (periodTxns || []).forEach((t: any) => {
        if (t.status === 'FAILED') return;
        const day = new Date(t.date).getDate();
        const weekIdx = Math.min(3, Math.floor((day - 1) / 7));
        if (t.type === 'INCOME') incomeVsExpense[weekIdx].income += Number(t.amount);
        else if (t.type === 'EXPENSE') incomeVsExpense[weekIdx].expenses += Number(t.amount);
      });
    }

    return {
      isDemo: false,
      userDisplayName,
      period,
      overview: {
        totalBalance: {
          value: overview.netWorth,
          label: 'Net Worth',
          description: 'Across your linked accounts',
          trendPercentage: 0,
          trendIsPositive: true,
        },
        totalIncome: {
          value: overview.totalIncome,
          label: 'Total Income',
          description: `Income for selected period`,
          trendPercentage: 0,
          trendIsPositive: true,
        },
        totalExpenses: {
          value: overview.totalExpenses,
          label: 'Total Expenses',
          description: `Outflows for selected period`,
          trendPercentage: 0,
          trendIsPositive: false,
        },
        availableBalance: {
          value: overview.netCashFlow,
          label: 'Net Surplus',
          description: 'Retained net cash flow',
          trendPercentage: 0,
          trendIsPositive: overview.netCashFlow >= 0,
        },
      },
      incomeVsExpense,
      spendingAnalytics: {
        totalSpent: overview.totalExpenses,
        categories: categoryBreakdown.map((c, i) => {
          const colors = ['#718FE8', '#8B72D6', '#4779C9', '#C48620', '#8066CC', '#3BB979', '#D94863'];
          return {
            id: String(i + 1),
            name: c.category,
            amount: c.amount,
            percentage: c.percentage,
            color: colors[i % colors.length],
            iconName: c.category,
          };
        }),
      },
      budgets: budgets.slice(0, 4).map((b) => ({
        id: b.id,
        category: b.category,
        iconName: b.category,
        limit: b.allocatedAmount,
        spent: b.spentAmount ?? b.spent ?? 0,
        remaining: b.remainingAmount ?? b.remaining ?? b.allocatedAmount,
        percentage: b.utilizationPercentage,
        status: b.status === 'CRITICAL' ? 'danger' : b.status === 'WARNING' ? 'warning' : 'normal',
      })),
      recentTransactions: formattedRecentTxns,
      savingsGoals: savingsGoals.slice(0, 3).map((g) => ({
        id: g.id,
        name: g.name,
        targetAmount: g.targetAmount,
        savedAmount: g.currentAmount,
        progressPercentage: g.progressPercentage,
        remainingAmount: g.remainingAmount,
        iconName: g.category || 'ShieldCheck',
        targetDate: g.targetDate,
      })),
      aiInsights,
      upcomingPayments,
    };
  }
}
