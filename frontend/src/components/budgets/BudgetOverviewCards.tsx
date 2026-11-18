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
      <div className="bg-surface rounded-[20px] border border-border p-5 sm:p-6 shadow-card hover:shadow-elevated transition-all flex items-center gap-4 group">
        <div className="w-14 h-14 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0 shadow-xs group-hover:scale-105 transition-transform">
          <Target className="w-7 h-7" />
        </div>
        <div className="min-w-0 flex-1">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block truncate">
            Total Budget
          </span>
          <div className="my-0.5">
            <span className="text-2xl sm:text-3xl font-display font-bold tracking-tight text-foreground tabular-nums truncate block">
              {budgetService.formatINR(metrics.totalBudget)}
            </span>
          </div>
          <div className="text-xs text-secondary-text truncate">
            Active category allocation
          </div>
        </div>
      </div>

      {/* 2. Total Spent */}
      <div className="bg-surface rounded-[20px] border border-border p-5 sm:p-6 shadow-card hover:shadow-elevated transition-all flex items-center gap-4 group">
        <div className="w-14 h-14 rounded-full bg-destructive/10 text-destructive flex items-center justify-center shrink-0 shadow-xs group-hover:scale-105 transition-transform">
          <TrendingDown className="w-7 h-7" />
        </div>
        <div className="min-w-0 flex-1">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block truncate">
            Total Spent
          </span>
          <div className="my-0.5">
            <span className="text-2xl sm:text-3xl font-display font-bold tracking-tight text-expense tabular-nums truncate block">
              {budgetService.formatINR(metrics.totalSpent)}
            </span>
          </div>
          <div className="text-xs text-secondary-text truncate">
            Verified period expenses
          </div>
        </div>
      </div>

      {/* 3. Remaining Budget */}
      <div className="bg-surface rounded-[20px] border border-border p-5 sm:p-6 shadow-card hover:shadow-elevated transition-all flex items-center gap-4 group">
        <div className="w-14 h-14 rounded-full bg-income/10 text-income flex items-center justify-center shrink-0 shadow-xs group-hover:scale-105 transition-transform">
          <PiggyBank className="w-7 h-7" />
        </div>
        <div className="min-w-0 flex-1">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block truncate">
            Remaining Budget
          </span>
          <div className="my-0.5">
            <span className="text-2xl sm:text-3xl font-display font-bold tracking-tight text-income tabular-nums truncate block">
              {budgetService.formatINR(metrics.remainingBudget)}
            </span>
          </div>
          <div className="text-xs text-secondary-text truncate">
            Available unspent capital
          </div>
        </div>
      </div>

      {/* 4. Budget Utilization */}
      <div className="bg-surface rounded-[20px] border border-border p-5 sm:p-6 shadow-card hover:shadow-elevated transition-all flex items-center gap-4 group">
        <div className="w-14 h-14 rounded-full bg-secondary/10 text-secondary flex items-center justify-center shrink-0 shadow-xs group-hover:scale-105 transition-transform">
          <PieChart className="w-7 h-7" />
        </div>
        <div className="min-w-0 flex-1">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block truncate">
            Budget Utilization
          </span>
          <div className="my-0.5">
            <span className="text-2xl sm:text-3xl font-display font-bold tracking-tight text-secondary tabular-nums truncate block">
              {metrics.overallUtilization}%
            </span>
          </div>
          <div className="text-xs text-secondary-text truncate">
            {metrics.overallUtilization >= 100
              ? 'Budget ceiling exceeded'
              : metrics.overallUtilization >= 80
              ? 'Approaching limits'
              : 'Spending discipline on track'}
          </div>
        </div>
      </div>
    </div>
  );
};
