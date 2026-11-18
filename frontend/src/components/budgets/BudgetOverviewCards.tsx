import React from 'react';
import { Target, TrendingDown, PiggyBank, PieChart } from 'lucide-react';
import { OverallBudgetMetrics, budgetService } from '@/services/budgetService';

interface BudgetOverviewCardsProps {
  metrics: OverallBudgetMetrics;
}

export const BudgetOverviewCards: React.FC<BudgetOverviewCardsProps> = ({ metrics }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* 1. Total Budget */}
      <div className="bg-surface rounded-2xl border border-border p-5 shadow-card hover:shadow-elevated transition-all flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Total Budget
          </span>
          <div className="w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
            <Target className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-3 mb-1">
          <span className="text-2xl sm:text-3xl font-display font-bold tracking-tight text-foreground tabular-nums">
            {budgetService.formatINR(metrics.totalBudget)}
          </span>
        </div>
        <div className="text-xs text-secondary-text pt-2 border-t border-border truncate">
          Active allocation across categories
        </div>
      </div>

      {/* 2. Total Spent */}
      <div className="bg-surface rounded-2xl border border-border p-5 shadow-card hover:shadow-elevated transition-all flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Total Spent
          </span>
          <div className="w-9 h-9 rounded-xl bg-destructive/10 text-destructive flex items-center justify-center">
            <TrendingDown className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-3 mb-1">
          <span className="text-2xl sm:text-3xl font-display font-bold tracking-tight text-expense tabular-nums">
            {budgetService.formatINR(metrics.totalSpent)}
          </span>
        </div>
        <div className="text-xs text-secondary-text pt-2 border-t border-border truncate">
          Verified period expenses
        </div>
      </div>

      {/* 3. Remaining Budget */}
      <div className="bg-surface rounded-2xl border border-border p-5 shadow-card hover:shadow-elevated transition-all flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Remaining Budget
          </span>
          <div className="w-9 h-9 rounded-xl bg-income/10 text-income flex items-center justify-center">
            <PiggyBank className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-3 mb-1">
          <span className="text-2xl sm:text-3xl font-display font-bold tracking-tight text-income tabular-nums">
            {budgetService.formatINR(metrics.remainingBudget)}
          </span>
        </div>
        <div className="text-xs text-secondary-text pt-2 border-t border-border truncate">
          Available unspent capital
        </div>
      </div>

      {/* 4. Budget Utilization */}
      <div className="bg-surface rounded-2xl border border-border p-5 shadow-card hover:shadow-elevated transition-all flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Budget Utilization
          </span>
          <div className="w-9 h-9 rounded-xl bg-secondary/10 text-secondary flex items-center justify-center">
            <PieChart className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-3 mb-1">
          <span className="text-2xl sm:text-3xl font-display font-bold tracking-tight text-secondary tabular-nums">
            {metrics.overallUtilization}%
          </span>
        </div>
        <div className="text-xs text-secondary-text pt-2 border-t border-border truncate">
          {metrics.overallUtilization >= 100
            ? 'Budget ceiling exceeded'
            : metrics.overallUtilization >= 80
            ? 'Approaching limits'
            : 'Spending discipline on track'}
        </div>
      </div>
    </div>
  );
};
