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
        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-expense bg-expense/10 px-2 py-0.5 rounded-md">
          <AlertTriangle className="w-3 h-3" /> Over Budget
        </span>
      );
    }
    if (b.percentage >= 80) {
      return (
        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-warning bg-warning/10 px-2 py-0.5 rounded-md">
          Near Limit ({Math.round(b.percentage)}%)
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-primary bg-primary/10 px-2 py-0.5 rounded-md">
        On Track ({Math.round(b.percentage)}%)
      </span>
    );
  };

  const getProgressBarColor = (b: BudgetProgress) => {
    if (b.percentage >= 100) return 'bg-expense';
    if (b.percentage >= 80) return 'bg-warning';
    return 'bg-primary';
  };

  return (
    <div className="bg-surface p-5 sm:p-6 rounded-[20px] border border-border shadow-card flex flex-col justify-between h-full">
      {/* Header */}
      <div className="flex items-center justify-between gap-2 mb-4">
        <div>
          <h2 className="text-base sm:text-lg font-display font-bold text-foreground">
            Budget Overview
          </h2>
          <p className="text-xs text-secondary-text mt-0.5">
            Keep track of your monthly spending limits.
          </p>
        </div>

        <Link
          to="/budgets"
          className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:text-primary-hover transition-colors cursor-pointer group"
        >
          View All Budgets
          <ArrowUpRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </Link>
      </div>

      {/* Budgets List */}
      <div className="space-y-3.5 my-auto">
        {budgets.map((b) => (
          <div
            key={b.id}
            className="p-3.5 rounded-xl bg-surface-elevated border border-border space-y-2 hover:border-primary/40 transition-all shadow-xs"
          >
            {/* Top row: Name & Status */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0 shadow-xs">
                  {getIcon(b.iconName)}
                </span>
                <span className="font-semibold text-sm text-foreground">
                  {b.category}
                </span>
              </div>
              {getStatusBadge(b)}
            </div>

            {/* Progress Bar */}
            <div className="w-full h-2 rounded-full bg-surface border border-border-subtle overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${getProgressBarColor(b)}`}
                style={{ width: `${Math.min(100, b.percentage)}%` }}
              />
            </div>

            {/* Spent vs Remaining numbers */}
            <div className="flex items-center justify-between text-xs pt-0.5">
              <span className="text-secondary-text">
                Spent:{' '}
                <strong className="text-foreground tabular-nums">
                  {dashboardService.formatINR(b.spent)}
                </strong>{' '}
                of {dashboardService.formatINR(b.limit)}
              </span>
              <span className="text-secondary-text">
                Remaining:{' '}
                <strong
                  className={`tabular-nums ${
                    b.remaining < 0 ? 'text-expense' : 'text-income'
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
