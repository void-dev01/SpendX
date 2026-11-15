import React from 'react';
import { Utensils, ShoppingBag, Car, ArrowUpRight, AlertTriangle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { BudgetProgress, dashboardService } from '@/services/dashboardService';

interface BudgetOverviewProps {
  budgets: BudgetProgress[];
}

export const BudgetOverview: React.FC<BudgetOverviewProps> = ({ budgets }) => {
  const getIcon = (name: string) => {
    switch (name) {
      case 'Utensils':
        return <Utensils className="w-3.5 h-3.5" />;
      case 'ShoppingBag':
        return <ShoppingBag className="w-3.5 h-3.5" />;
      case 'Car':
        return <Car className="w-3.5 h-3.5" />;
      default:
        return <ShoppingBag className="w-3.5 h-3.5" />;
    }
  };

  const getStatusBadge = (b: BudgetProgress) => {
    if (b.percentage >= 100) {
      return (
        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-rose-600 dark:text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded-md">
          <AlertTriangle className="w-3 h-3" /> Over Budget
        </span>
      );
    }
    if (b.percentage >= 80) {
      return (
        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-600 dark:text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-md">
          Near Limit ({Math.round(b.percentage)}%)
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-spendx-blue-primary bg-spendx-blue-primary/10 px-2 py-0.5 rounded-md">
        On Track ({Math.round(b.percentage)}%)
      </span>
    );
  };

  const getProgressBarColor = (b: BudgetProgress) => {
    if (b.percentage >= 100) return 'bg-rose-500';
    if (b.percentage >= 80) return 'bg-amber-500';
    return 'bg-gradient-to-r from-spendx-blue-primary to-spendx-purple-primary';
  };

  return (
    <div className="glass-panel p-6 rounded-2xl flex flex-col justify-between h-full">
      {/* Header */}
      <div className="flex items-center justify-between gap-2 mb-4">
        <div>
          <h2 className="text-lg font-bold text-spendx-indigo dark:text-spendx-soft-purple">
            Budget Overview
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Keep track of your monthly spending limits.
          </p>
        </div>

        <Link
          to="/budgets"
          className="inline-flex items-center gap-1 text-xs font-semibold text-spendx-blue-primary hover:text-spendx-purple-primary transition-colors cursor-pointer group"
        >
          View All Budgets
          <ArrowUpRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </Link>
      </div>

      {/* Budgets List */}
      <div className="space-y-4 my-auto">
        {budgets.map((b) => (
          <div
            key={b.id}
            className="p-3.5 rounded-xl glass-surface border border-white/60 dark:border-white/5 space-y-2 hover:border-spendx-blue-primary/30 transition-all"
          >
            {/* Top row: Name & Status */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-7 h-7 rounded-lg bg-spendx-blue-primary/10 text-spendx-blue-primary flex items-center justify-center shrink-0">
                  {getIcon(b.iconName)}
                </span>
                <span className="font-semibold text-sm text-slate-800 dark:text-slate-100">
                  {b.category}
                </span>
              </div>
              {getStatusBadge(b)}
            </div>

            {/* Progress Bar */}
            <div className="w-full h-2 rounded-full bg-slate-200/60 dark:bg-slate-700/50 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${getProgressBarColor(b)}`}
                style={{ width: `${Math.min(100, b.percentage)}%` }}
              />
            </div>

            {/* Spent vs Remaining numbers */}
            <div className="flex items-center justify-between text-xs pt-0.5">
              <span className="text-slate-500 dark:text-slate-400">
                Spent:{' '}
                <strong className="text-slate-700 dark:text-slate-200 tabular-nums">
                  {dashboardService.formatINR(b.spent)}
                </strong>{' '}
                of {dashboardService.formatINR(b.limit)}
              </span>
              <span className="text-slate-500 dark:text-slate-400">
                Remaining:{' '}
                <strong
                  className={`tabular-nums ${
                    b.remaining < 0 ? 'text-rose-600' : 'text-emerald-600 dark:text-emerald-400'
                  }`}
                >
                  {dashboardService.formatINR(b.remaining)}
                </strong>
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
