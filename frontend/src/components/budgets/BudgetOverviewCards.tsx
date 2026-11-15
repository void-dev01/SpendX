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
      <div className="glass-card-interactive p-5 rounded-2xl flex flex-col justify-between group">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Total Budget
          </span>
          <div className="w-9 h-9 rounded-xl bg-spendx-blue-primary/10 text-spendx-blue-primary flex items-center justify-center">
            <Target className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-3 mb-1">
          <span className="text-2xl sm:text-3xl font-bold tracking-tight text-spendx-indigo dark:text-spendx-soft-purple tabular-nums">
            {budgetService.formatINR(metrics.totalBudget)}
          </span>
        </div>
        <div className="text-xs text-slate-400 pt-2 border-t border-slate-100/60 dark:border-white/5 truncate">
          Active allocation across categories
        </div>
      </div>

      {/* 2. Total Spent */}
      <div className="glass-card-interactive p-5 rounded-2xl flex flex-col justify-between group">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Total Spent
          </span>
          <div className="w-9 h-9 rounded-xl bg-rose-500/10 text-rose-600 dark:text-rose-400 flex items-center justify-center">
            <TrendingDown className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-3 mb-1">
          <span className="text-2xl sm:text-3xl font-bold tracking-tight text-rose-600 dark:text-rose-400 tabular-nums">
            {budgetService.formatINR(metrics.totalSpent)}
          </span>
        </div>
        <div className="text-xs text-slate-400 pt-2 border-t border-slate-100/60 dark:border-white/5 truncate">
          Verified period expenses
        </div>
      </div>

      {/* 3. Remaining Budget */}
      <div className="glass-card-interactive p-5 rounded-2xl flex flex-col justify-between group">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Remaining Budget
          </span>
          <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
            <PiggyBank className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-3 mb-1">
          <span className="text-2xl sm:text-3xl font-bold tracking-tight text-emerald-600 dark:text-emerald-400 tabular-nums">
            {budgetService.formatINR(metrics.remainingBudget)}
          </span>
        </div>
        <div className="text-xs text-slate-400 pt-2 border-t border-slate-100/60 dark:border-white/5 truncate">
          Available unspent capital
        </div>
      </div>

      {/* 4. Budget Utilization */}
      <div className="glass-card-interactive p-5 rounded-2xl flex flex-col justify-between group">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Budget Utilization
          </span>
          <div className="w-9 h-9 rounded-xl bg-spendx-purple-primary/10 text-spendx-purple-primary flex items-center justify-center">
            <PieChart className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-3 mb-1">
          <span className="text-2xl sm:text-3xl font-bold tracking-tight text-spendx-purple-primary tabular-nums">
            {metrics.overallUtilization}%
          </span>
        </div>
        <div className="text-xs text-slate-400 pt-2 border-t border-slate-100/60 dark:border-white/5 truncate">
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
