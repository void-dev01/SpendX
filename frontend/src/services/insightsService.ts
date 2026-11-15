/**
 * SPENDX Financial Insights Service
 * Computes deterministic, AI-grade financial intelligence across
 * budgets, transactions, savings milestones, recurring obligations, and liquidity.
 */

import { transactionService } from './transactionService';
import { budgetService } from './budgetService';
import { savingsService } from './savingsService';
import { accountService } from './accountService';
import { recurringService } from './recurringService';

export type InsightType =
  | 'CRITICAL_ALERT'
  | 'SAVINGS_OPPORTUNITY'
  | 'BUDGET_ADVICE'
  | 'MILESTONE_CELEBRATION'
  | 'CASH_FLOW_INTELLIGENCE';

export type InsightImpact = 'HIGH' | 'MEDIUM' | 'LOW';

export interface FinancialInsight {
  id: string;
  type: InsightType;
  impact: InsightImpact;
  title: string;
  description: string;
  actionLabel: string;
  actionRoute?: string;
  estimatedMonthlySavings?: number;
  category?: string;
  createdAt: string;
  isBookmarked?: boolean;
  isDismissed?: boolean;
}

export interface FinancialHealthScore {
  overallScore: number; // 0 - 100
  rating: 'EXCELLENT' | 'GOOD' | 'FAIR' | 'NEEDS_ATTENTION';
  pillars: {
    budgetDiscipline: { score: number; max: 25; label: string };
    savingsVelocity: { score: number; max: 25; label: string };
    liquidityCushion: { score: number; max: 25; label: string };
    liabilityRatio: { score: number; max: 25; label: string };
  };
}

export interface InsightsOverviewSummary {
  healthScore: FinancialHealthScore;
  totalActiveInsights: number;
  actionableOpportunities: number;
  potentialMonthlySavings: number;
  criticalAlertsCount: number;
}

const STORAGE_KEY_DISMISSED = 'spendx_insights_dismissed';
const STORAGE_KEY_BOOKMARKED = 'spendx_insights_bookmarked';

export const insightsService = {
  getDismissedIds(): string[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEY_DISMISSED);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  },

  dismissInsight(id: string): void {
    const list = this.getDismissedIds();
    if (!list.includes(id)) {
      list.push(id);
      localStorage.setItem(STORAGE_KEY_DISMISSED, JSON.stringify(list));
    }
  },

  getBookmarkedIds(): string[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEY_BOOKMARKED);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  },

  toggleBookmark(id: string): boolean {
    const list = this.getBookmarkedIds();
    const index = list.indexOf(id);
    let bookmarked = false;
    if (index >= 0) {
      list.splice(index, 1);
      bookmarked = false;
    } else {
      list.push(id);
      bookmarked = true;
    }
    localStorage.setItem(STORAGE_KEY_BOOKMARKED, JSON.stringify(list));
    return bookmarked;
  },

  resetDismissed(): void {
    localStorage.removeItem(STORAGE_KEY_DISMISSED);
  },

  /**
   * Deterministically synthesizes insights across all financial domains
   */
  async generateInsights(): Promise<FinancialInsight[]> {
    const [transactions, budgets, savingsGoals, accounts, recurring] = await Promise.all([
      transactionService.getTransactions(),
      budgetService.getBudgetsWithMetrics(),
      savingsService.getGoals(),
      accountService.getAccounts(),
      recurringService.getRecurringPayments(),
    ]);

    const dismissed = this.getDismissedIds();
    const bookmarked = this.getBookmarkedIds();
    const insights: FinancialInsight[] = [];

    const now = new Date();
    const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
    const currentDay = now.getDate();
    const daysRemaining = daysInMonth - currentDay;

    // 1. Budget Pace & Velocity Insights
    budgets.forEach((b) => {
      if (b.status === 'EXCEEDED') {
        insights.push({
          id: `ins-budget-exceeded-${b.id}`,
          type: 'CRITICAL_ALERT',
          impact: 'HIGH',
          title: `Budget Limit Exceeded: ${b.name}`,
          description: `You have spent ${transactionService.formatINR(b.spent)} against an allocated ${transactionService.formatINR(b.allocatedAmount)} (${b.utilizationPercentage}%). Further expenses will widen your deficit.`,
          actionLabel: 'Review Budget',
          actionRoute: `/budgets/${b.id}`,
          category: b.category,
          createdAt: now.toISOString(),
        });
      } else if (b.utilizationPercentage >= 80 && daysRemaining > 10) {
        insights.push({
          id: `ins-budget-velocity-${b.id}`,
          type: 'BUDGET_ADVICE',
          impact: 'HIGH',
          title: `Rapid Spending Velocity: ${b.name}`,
          description: `You have consumed ${b.utilizationPercentage}% of this budget with ${daysRemaining} days remaining in the cycle. Slow down discretionary spending to avoid exceeding your limit.`,
          actionLabel: 'Adjust Allocation',
          actionRoute: `/budgets/${b.id}`,
          category: b.category,
          estimatedMonthlySavings: Math.round(b.allocatedAmount * 0.15),
          createdAt: now.toISOString(),
        });
      } else if (b.utilizationPercentage < 30 && daysRemaining < 7) {
        insights.push({
          id: `ins-budget-surplus-${b.id}`,
          type: 'SAVINGS_OPPORTUNITY',
          impact: 'LOW',
          title: `Unused Surplus: ${b.name}`,
          description: `You have ${transactionService.formatINR(b.remaining)} remaining with only ${daysRemaining} days left. Consider transferring this surplus into your savings goals.`,
          actionLabel: 'Transfer to Savings',
          actionRoute: '/savings',
          category: b.category,
          estimatedMonthlySavings: Math.round(b.remaining * 0.8),
          createdAt: now.toISOString(),
        });
      }
    });

    // 2. Liquid Account Cushion & Idle Cash
    const totalLiquidBalance = accounts.reduce((sum, a) => sum + (a.type !== 'CREDIT_CARD' ? a.balance : 0), 0);
    const checkingAccounts = accounts.filter((a) => a.type === 'BANK' || a.type === 'CASH');
    const checkingBalance = checkingAccounts.reduce((sum, a) => sum + a.balance, 0);

    if (checkingBalance > 50000) {
      insights.push({
        id: 'ins-idle-cash',
        type: 'SAVINGS_OPPORTUNITY',
        impact: 'MEDIUM',
        title: 'Idle Cash Optimization',
        description: `You have ${transactionService.formatINR(checkingBalance)} in checking/cash accounts earning minimal return. Moving ₹30,000 into a liquid high-yield savings vault could generate additional yield.`,
        actionLabel: 'Explore Vaults',
        actionRoute: '/savings',
        estimatedMonthlySavings: 250,
        createdAt: now.toISOString(),
      });
    }

    if (totalLiquidBalance < 15000) {
      insights.push({
        id: 'ins-liquidity-floor',
        type: 'CRITICAL_ALERT',
        impact: 'HIGH',
        title: 'Low Liquidity Cushion Detected',
        description: `Your combined liquid bank balances stand at ${transactionService.formatINR(totalLiquidBalance)}, which is below your recommended 1-month safety reserve floor.`,
        actionLabel: 'View Accounts',
        actionRoute: '/accounts',
        createdAt: now.toISOString(),
      });
    }

    // 3. Recurring Payments & Subscription Insights
    const overdueRecurring = recurring.filter((r) => r.status === 'OVERDUE');
    if (overdueRecurring.length > 0) {
      insights.push({
        id: 'ins-overdue-recurring',
        type: 'CRITICAL_ALERT',
        impact: 'HIGH',
        title: `${overdueRecurring.length} Overdue Payment${overdueRecurring.length > 1 ? 's' : ''}`,
        description: `You have overdue recurring charges (${overdueRecurring.map((r) => r.name).join(', ')}). Settle them promptly to avoid late penalties and service interruptions.`,
        actionLabel: 'Pay Now',
        actionRoute: '/recurring',
        createdAt: now.toISOString(),
      });
    }

    const subscriptions = recurring.filter((r) => r.category === 'Subscriptions' && r.status !== 'CANCELLED');
    const monthlySubTotal = subscriptions.reduce((sum, r) => sum + r.amount, 0);
    if (subscriptions.length >= 3) {
      insights.push({
        id: 'ins-subscription-audit',
        type: 'SAVINGS_OPPORTUNITY',
        impact: 'MEDIUM',
        title: `Subscription Audit: ${subscriptions.length} Active Services`,
        description: `You are spending ${transactionService.formatINR(monthlySubTotal)}/month across digital entertainment and software. Auditing unused plans could free up ~15-20% immediately.`,
        actionLabel: 'Manage Subscriptions',
        actionRoute: '/recurring',
        estimatedMonthlySavings: Math.round(monthlySubTotal * 0.2),
        createdAt: now.toISOString(),
      });
    }

    // 4. Savings Milestones Velocity
    savingsGoals.forEach((goal) => {
      const pct = goal.targetAmount > 0 ? Math.round((goal.currentAmount / goal.targetAmount) * 100) : 0;
      if (pct >= 80 && pct < 100) {
        insights.push({
          id: `ins-goal-near-${goal.id}`,
          type: 'MILESTONE_CELEBRATION',
          impact: 'MEDIUM',
          title: `Milestone in Reach: ${goal.name}`,
          description: `You've achieved ${pct}% of your target! Only ${transactionService.formatINR(goal.targetAmount - goal.currentAmount)} needed to celebrate crossing the finish line.`,
          actionLabel: 'Top Up Goal',
          actionRoute: `/savings/${goal.id}`,
          category: goal.category,
          createdAt: now.toISOString(),
        });
      }
    });

    // 5. Cash Flow & Savings Rate
    const monthlyIncome = transactions
      .filter((t) => t.type === 'INCOME')
      .reduce((sum, t) => sum + t.amount, 0);
    const monthlyExpenses = transactions
      .filter((t) => t.type === 'EXPENSE')
      .reduce((sum, t) => sum + t.amount, 0);

    if (monthlyIncome > 0) {
      const net = monthlyIncome - monthlyExpenses;
      const rate = Math.round((net / monthlyIncome) * 100);

      if (rate >= 30) {
        insights.push({
          id: 'ins-healthy-savings-rate',
          type: 'CASH_FLOW_INTELLIGENCE',
          impact: 'LOW',
          title: `Strong Net Savings Rate: ${rate}%`,
          description: `Your net cash flow is positive at ${transactionService.formatINR(net)}. You are saving above the benchmark 20% rule recommended for wealth compounding.`,
          actionLabel: 'View Analytics',
          actionRoute: '/analytics',
          createdAt: now.toISOString(),
        });
      } else if (rate < 10 && rate >= 0) {
        insights.push({
          id: 'ins-slim-savings-rate',
          type: 'BUDGET_ADVICE',
          impact: 'MEDIUM',
          title: `Thin Savings Margin: ${rate}%`,
          description: `Only ${rate}% of your income remains after expenses this period. Trimming non-essential shopping or dining out will restore financial breathing room.`,
          actionLabel: 'Optimize Spending',
          actionRoute: '/analytics',
          estimatedMonthlySavings: Math.round(monthlyExpenses * 0.1),
          createdAt: now.toISOString(),
        });
      }
    }

    // Attach bookmark and dismissed status
    return insights
      .map((item) => ({
        ...item,
        isBookmarked: bookmarked.includes(item.id),
        isDismissed: dismissed.includes(item.id),
      }))
      .filter((item) => !item.isDismissed);
  },

  /**
   * Deterministic SPENDX Financial Health Score Calculation (0-100)
   */
  async computeHealthScore(): Promise<FinancialHealthScore> {
    const [budgets, savingsGoals, accounts, recurring] = await Promise.all([
      budgetService.getBudgetsWithMetrics(),
      savingsService.getGoals(),
      accountService.getAccounts(),
      recurringService.getRecurringPayments(),
    ]);

    // Pillar 1: Budget Discipline (max 25)
    // 25 - penalty for exceeded or over 90%
    let budgetScore = 25;
    const exceededCount = budgets.filter((b) => b.status === 'EXCEEDED').length;
    const warningCount = budgets.filter((b) => b.status === 'NEAR_LIMIT').length;
    budgetScore = Math.max(0, budgetScore - exceededCount * 10 - warningCount * 4);

    // Pillar 2: Savings Velocity (max 25)
    // Ratio of net savings or active goal funding
    let savingsScore = 15;
    const activeGoals = savingsGoals.filter((g) => g.status === 'ACTIVE');
    if (activeGoals.length >= 2) savingsScore += 5;
    const fundedGoal = savingsGoals.some((g) => g.currentAmount >= g.targetAmount * 0.5);
    if (fundedGoal) savingsScore += 5;
    savingsScore = Math.min(25, savingsScore);

    // Pillar 3: Liquidity Cushion (max 25)
    const liquidTotal = accounts.reduce((sum, a) => sum + (a.type !== 'CREDIT_CARD' ? a.balance : 0), 0);
    let liquidityScore = 10;
    if (liquidTotal >= 100000) liquidityScore = 25;
    else if (liquidTotal >= 50000) liquidityScore = 20;
    else if (liquidTotal >= 20000) liquidityScore = 15;
    else liquidityScore = 5;

    // Pillar 4: Liability & Recurring Ratio (max 25)
    const overdueCount = recurring.filter((r) => r.status === 'OVERDUE').length;
    let liabilityScore = 25;
    if (overdueCount > 0) liabilityScore -= overdueCount * 12;
    liabilityScore = Math.max(0, liabilityScore);

    const overallScore = Math.min(100, Math.max(0, budgetScore + savingsScore + liquidityScore + liabilityScore));

    let rating: FinancialHealthScore['rating'] = 'FAIR';
    if (overallScore >= 80) rating = 'EXCELLENT';
    else if (overallScore >= 65) rating = 'GOOD';
    else if (overallScore >= 45) rating = 'FAIR';
    else rating = 'NEEDS_ATTENTION';

    return {
      overallScore,
      rating,
      pillars: {
        budgetDiscipline: {
          score: budgetScore,
          max: 25,
          label: budgetScore >= 20 ? 'Optimal Control' : 'Moderate Overspending',
        },
        savingsVelocity: {
          score: savingsScore,
          max: 25,
          label: savingsScore >= 20 ? 'Strong Compounding' : 'Steady Progress',
        },
        liquidityCushion: {
          score: liquidityScore,
          max: 25,
          label: liquidityScore >= 20 ? 'Well Buffered' : 'Adequate Reserves',
        },
        liabilityRatio: {
          score: liabilityScore,
          max: 25,
          label: liabilityScore >= 20 ? 'Zero Overdue' : 'Action Required',
        },
      },
    };
  },

  async getOverviewSummary(): Promise<InsightsOverviewSummary> {
    const [insights, healthScore] = await Promise.all([
      this.generateInsights(),
      this.computeHealthScore(),
    ]);

    const actionableOpportunities = insights.filter(
      (i) => i.type === 'SAVINGS_OPPORTUNITY' || i.type === 'BUDGET_ADVICE'
    ).length;

    const potentialMonthlySavings = insights.reduce(
      (sum, i) => sum + (i.estimatedMonthlySavings || 0),
      0
    );

    const criticalAlertsCount = insights.filter((i) => i.type === 'CRITICAL_ALERT').length;

    return {
      healthScore,
      totalActiveInsights: insights.length,
      actionableOpportunities,
      potentialMonthlySavings,
      criticalAlertsCount,
    };
  },
};
