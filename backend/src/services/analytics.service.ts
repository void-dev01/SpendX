import { FinancialCalculationService } from './financial.service.js';
import { supabaseAdminClient } from '../config/supabase.js';
import { AppError } from '../middleware/errorHandler.js';

export class AnalyticsService {
  public static async getAnalyticsOverview(
    userId: string,
    period: 'this_month' | 'last_month' | 'last_3_months' | 'this_year' | 'all' = 'this_month'
  ) {
    if (!supabaseAdminClient) throw new AppError('Database service unavailable', 503);

    const overview = await FinancialCalculationService.calculateFinancialOverview(userId, period);
    const categoryBreakdown = await FinancialCalculationService.calculateCategoryBreakdown(userId, period);

    const { start, end } = FinancialCalculationService.getDateRange(period);

    // Fetch transactions in period for monthly burn rates
    const { data: txns } = await supabaseAdminClient
      .from('transactions')
      .select('amount, type, category, date, payment_method, status')
      .eq('user_id', userId)
      .gte('date', start.toISOString())
      .lte('date', end.toISOString())
      .order('date', { ascending: true });

    // Group burn rate by month or week
    const monthlyTrends: Record<string, { income: number; expenses: number; net: number }> = {};
    const paymentMethodStats: Record<string, number> = {};

    (txns || []).forEach((t: any) => {
      if (t.status === 'FAILED') return;
      const dateObj = new Date(t.date);
      const mKey = dateObj.toLocaleDateString('en-IN', { month: 'short', year: '2-digit' });
      const amt = Number(t.amount);

      if (!monthlyTrends[mKey]) {
        monthlyTrends[mKey] = { income: 0, expenses: 0, net: 0 };
      }

      if (t.type === 'INCOME') {
        monthlyTrends[mKey].income += amt;
        monthlyTrends[mKey].net += amt;
      } else if (t.type === 'EXPENSE') {
        monthlyTrends[mKey].expenses += amt;
        monthlyTrends[mKey].net -= amt;

        const pm = t.payment_method || 'Other';
        paymentMethodStats[pm] = (paymentMethodStats[pm] || 0) + amt;
      }
    });

    const monthlyTrendsArray = Object.entries(monthlyTrends).map(([month, stats]) => ({
      month,
      income: stats.income,
      expenses: stats.expenses,
      net: stats.net,
    }));

    return {
      period,
      summary: overview,
      categoryBreakdown,
      monthlyTrends: monthlyTrendsArray,
      paymentMethodDistribution: Object.entries(paymentMethodStats).map(([method, amount]) => ({
        method,
        amount,
        percentage: overview.totalExpenses > 0 ? Math.round((amount / overview.totalExpenses) * 1000) / 10 : 0,
      })),
    };
  }
}
