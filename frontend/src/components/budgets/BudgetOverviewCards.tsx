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
      <div className="bg-card dark:bg-[#1B211B] rounded-[22px] border border-border p-6 shadow-xs hover:border-primary/40 hover:shadow-card transition-all flex flex-col justify-between group">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-bold uppercase tracking-wider text-secondary-text truncate block">
            Total Budget
          </span>
          <div className="w-9 h-9 rounded-xl bg-surface-subtle dark:bg-[#242C23] border border-border flex items-center justify-center shrink-0 shadow-xs text-foreground group-hover:scale-105 transition-transform">
            <Target className="w-5 h-5 text-primary" />
          </div>
        </div>
        <div>
          <span className="text-2xl sm:text-3xl font-display font-extrabold tracking-tight text-foreground tabular-nums truncate block">
            {budgetService.formatINR(metrics.totalBudget)}
          </span>
          <div className="text-xs text-secondary-text truncate mt-1">
            Active category allocation
          </div>
        </div>
      </div>

      {/* 2. Total Spent */}
      <div className="bg-card dark:bg-[#1B211B] rounded-[22px] border border-border p-6 shadow-xs hover:border-expense/40 hover:shadow-card transition-all flex flex-col justify-between group">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-bold uppercase tracking-wider text-secondary-text truncate block">
            Total Spent
          </span>
          <div className="w-9 h-9 rounded-xl bg-expense/10 text-expense flex items-center justify-center shrink-0 shadow-xs group-hover:scale-105 transition-transform">
            <TrendingDown className="w-5 h-5" />
          </div>
        </div>
        <div>
          <span className="text-2xl sm:text-3xl font-display font-extrabold tracking-tight text-expense tabular-nums truncate block">
            {budgetService.formatINR(metrics.totalSpent)}
          </span>
          <div className="text-xs text-secondary-text truncate mt-1">
            Verified period expenses
          </div>
        </div>
      </div>

      {/* 3. Remaining Budget */}
      <div className="bg-card dark:bg-[#1B211B] rounded-[22px] border border-border p-6 shadow-xs hover:border-income/40 hover:shadow-card transition-all flex flex-col justify-between group">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-bold uppercase tracking-wider text-secondary-text truncate block">
            Remaining Budget
          </span>
          <div className="w-9 h-9 rounded-xl bg-income/10 text-income flex items-center justify-center shrink-0 shadow-xs group-hover:scale-105 transition-transform">
            <PiggyBank className="w-5 h-5" />
          </div>
        </div>
        <div>
          <span className="text-2xl sm:text-3xl font-display font-extrabold tracking-tight text-income tabular-nums truncate block">
            {budgetService.formatINR(metrics.remainingBudget)}
          </span>
          <div className="text-xs text-secondary-text truncate mt-1">
            Available unspent capital
          </div>
        </div>
      </div>

      {/* 4. Budget Utilization */}
      <div className="bg-card dark:bg-[#1B211B] rounded-[22px] border border-border p-6 shadow-xs hover:border-primary/40 hover:shadow-card transition-all flex flex-col justify-between group">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-bold uppercase tracking-wider text-secondary-text truncate block">
            Budget Utilization
          </span>
          <div className="w-9 h-9 rounded-xl bg-primary/20 text-foreground border border-primary/40 flex items-center justify-center shrink-0 shadow-xs group-hover:scale-105 transition-transform">
            <PieChart className="w-5 h-5 text-primary" />
          </div>
        </div>
        <div>
          <span className="text-2xl sm:text-3xl font-display font-extrabold tracking-tight text-foreground tabular-nums truncate block">
            {metrics.overallUtilization}%
          </span>
          <div className="text-xs text-secondary-text truncate mt-1">
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
