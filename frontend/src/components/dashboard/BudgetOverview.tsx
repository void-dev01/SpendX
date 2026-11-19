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
        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-expense bg-expense/10 px-2 py-0.5 rounded-full">
          <AlertTriangle className="w-3 h-3" /> Over Budget
        </span>
      );
    }
    if (b.percentage >= 80) {
      return (
        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-warning bg-warning/10 px-2 py-0.5 rounded-full">
          Near Limit ({Math.round(b.percentage)}%)
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-primary-foreground bg-primary px-2 py-0.5 rounded-full">
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
    <div className="bg-card dark:bg-[#1B211B] p-6 rounded-[22px] border border-border shadow-xs hover:shadow-card transition-all duration-200 flex flex-col justify-between h-full">
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
          className="inline-flex items-center gap-1 text-xs font-semibold text-foreground hover:text-primary transition-colors cursor-pointer group"
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
            className="p-4 rounded-xl bg-surface-subtle dark:bg-[#242C23] border border-border/80 space-y-2.5 hover:border-primary/40 transition-all shadow-xs"
          >
            {/* Top row: Name & Status */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <span className="w-8 h-8 rounded-lg bg-card dark:bg-[#1B211B] border border-border text-foreground flex items-center justify-center shrink-0 shadow-xs">
                  {getIcon(b.iconName)}
                </span>
                <span className="font-bold text-sm text-foreground">
                  {b.category}
                </span>
              </div>
              {getStatusBadge(b)}
            </div>

            {/* Progress Bar */}
            <div className="w-full h-2 rounded-full bg-border/40 dark:bg-[#121612] overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${getProgressBarColor(b)}`}
                style={{ width: `${Math.min(100, b.percentage)}%` }}
              />
            </div>

            {/* Bottom details */}
            <div className="flex items-center justify-between text-xs pt-0.5">
              <span className="text-secondary-text font-medium">
                Spent:{' '}
                <strong className="text-foreground tabular-nums font-bold">
                  {dashboardService.formatINR(b.spent)}
                </strong>
              </span>
              <span className="text-secondary-text font-medium">
                Limit:{' '}
                <strong className="text-foreground tabular-nums font-bold">
                  {dashboardService.formatINR(b.limit)}
                </strong>
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
