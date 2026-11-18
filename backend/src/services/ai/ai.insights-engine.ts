import { FinancialCalculationService } from '../financial.service.js';
import { BudgetService } from '../budget.service.js';
import { RecurringService } from '../recurring.service.js';
import { supabaseAdminClient } from '../../config/supabase.js';
import { logger } from '../../utils/logger.js';

export interface InsightFinding {
  type: 'CRITICAL_ALERT' | 'SAVINGS_OPPORTUNITY' | 'BUDGET_ADVICE' | 'MILESTONE_CELEBRATION' | 'CASH_FLOW_INTELLIGENCE';
  impact: 'HIGH' | 'MEDIUM' | 'LOW';
  title: string;
  description: string;
  category?: string;
  actionLabel?: string;
  actionRoute?: string;
  estimatedMonthlySavings?: number;
}

export class AIInsightsEngine {
  public static async generateEvidenceBasedInsights(userId: string): Promise<InsightFinding[]> {
    if (!supabaseAdminClient) return [];

    const findings: InsightFinding[] = [];

    // 1. Gather deterministic financial metrics
    const overview = await FinancialCalculationService.calculateFinancialOverview(userId, 'this_month');
    const categories = await FinancialCalculationService.calculateCategoryBreakdown(userId, 'this_month');
    const budgets = await BudgetService.getBudgets(userId);
    const recurring = await RecurringService.getRecurringPayments(userId);

    // Finding A: Budget Overrun Warnings
    budgets.forEach((b) => {
      if (b.status === 'danger') {
        findings.push({
          type: 'CRITICAL_ALERT',
          impact: 'HIGH',
          title: `Budget Limit Exceeded in ${b.category}`,
          description: `You have spent ₹${b.spent.toLocaleString('en-IN')} out of your ₹${b.allocatedAmount.toLocaleString('en-IN')} budget (${b.utilizationPercentage}%). Consider pausing discretionary purchases in this category.`,
          category: b.category,
          actionLabel: 'Adjust Budget',
          actionRoute: '/budgets',
        });
      } else if (b.status === 'warning') {
        findings.push({
          type: 'BUDGET_ADVICE',
          impact: 'MEDIUM',
          title: `Budget Utilization Alert for ${b.category}`,
          description: `You have used ${b.utilizationPercentage}% of your ${b.category} budget with ₹${b.remaining.toLocaleString('en-IN')} remaining for the month.`,
          category: b.category,
          actionLabel: 'Review Spending',
          actionRoute: '/transactions',
        });
      }
    });

    // Finding B: Dominant Category Spending
    if (categories.length > 0 && categories[0].percentage >= 35) {
      const top = categories[0];
      findings.push({
        type: 'SAVINGS_OPPORTUNITY',
        impact: 'HIGH',
        title: `High Outflow Concentration in ${top.category}`,
        description: `${top.category} accounts for ${top.percentage}% of your total monthly expenditures (₹${top.amount.toLocaleString('en-IN')}). A 15% reduction could yield ₹${Math.round(top.amount * 0.15).toLocaleString('en-IN')} in monthly savings.`,
        category: top.category,
        actionLabel: 'View Category Ledger',
        actionRoute: '/transactions',
        estimatedMonthlySavings: Math.round(top.amount * 0.15),
      });
    }

    // Finding C: Healthy Cash Flow Surplus
    if (overview.netCashFlow > 5000 && overview.savingsRate >= 25) {
      findings.push({
        type: 'MILESTONE_CELEBRATION',
        impact: 'LOW',
        title: `Positive Cash Flow Momentum (${overview.savingsRate}% Savings Rate)`,
        description: `You have retained a net surplus of ₹${overview.netCashFlow.toLocaleString('en-IN')} this month. Transferring a portion to your savings vault will accelerate your milestones.`,
        category: 'Cash Flow',
        actionLabel: 'Contribute to Goal',
        actionRoute: '/savings',
      });
    }

    // Finding D: Upcoming Recurring Bill Reminders
    const now = new Date();
    const upcomingBills = recurring.filter((r) => {
      const due = new Date(r.nextDueDate);
      const diffDays = Math.ceil((due.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
      return diffDays >= 0 && diffDays <= 5 && r.status !== 'PAID' && r.status !== 'CANCELLED';
    });

    upcomingBills.slice(0, 1).forEach((b) => {
      findings.push({
        type: 'CASH_FLOW_INTELLIGENCE',
        impact: 'MEDIUM',
        title: `Upcoming Commitment: ${b.name}`,
        description: `A recurring payment of ₹${b.amount.toLocaleString('en-IN')} for ${b.name} (${b.merchant}) is due on ${new Date(b.nextDueDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}.`,
        category: b.category,
        actionLabel: 'View Commitments',
        actionRoute: '/recurring',
      });
    });

    // If findings are empty, provide baseline financial framework
    if (findings.length === 0) {
      findings.push({
        type: 'SAVINGS_OPPORTUNITY',
        impact: 'MEDIUM',
        title: '50/30/20 Financial Framework',
        description:
          'Aim to allocate 50% of your net income to essential needs, 30% to discretionary wants, and 20% to emergency reserves or investments.',
        category: 'Budgeting',
        actionLabel: 'Set Up Budgets',
        actionRoute: '/budgets',
      });
    }

    // 2. Persist findings to Supabase DB, avoiding duplicate active titles
    for (const f of findings) {
      try {
        const { data: existing } = await supabaseAdminClient
          .from('financial_insights')
          .select('id')
          .eq('user_id', userId)
          .eq('title', f.title)
          .eq('is_dismissed', false)
          .limit(1);

        if (!existing || existing.length === 0) {
          await supabaseAdminClient.from('financial_insights').insert({
            user_id: userId,
            type: f.type,
            impact: f.impact,
            title: f.title,
            description: f.description,
            action_label: f.actionLabel || null,
            action_route: f.actionRoute || null,
            estimated_monthly_savings: f.estimatedMonthlySavings || null,
            category: f.category || null,
            is_bookmarked: false,
            is_dismissed: false,
          });
        }
      } catch (insErr) {
        logger.warn({ insErr }, 'Failed persisting insight to Supabase');
      }
    }

    return findings;
  }
}
