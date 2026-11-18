import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AlertTriangle,
  CheckCircle2,
  ArrowUpRight,
} from 'lucide-react';
import { BudgetWithMetrics, budgetService } from '@/services/budgetService';

interface BudgetPerformanceSectionProps {
  budgets: BudgetWithMetrics[];
}

export const BudgetPerformanceSection: React.FC<BudgetPerformanceSectionProps> = ({
  budgets,
}) => {
  const navigate = useNavigate();

  if (budgets.length === 0) return null;

  const totalAllocated = budgets.reduce((sum, b) => sum + b.allocatedAmount, 0);
  const totalSpent = budgets.reduce((sum, b) => sum + b.spent, 0);
  const remaining = Math.max(0, totalAllocated - totalSpent);
  const overallUtil =
    totalAllocated > 0 ? Math.round((totalSpent / totalAllocated) * 100) : 0;

  const exceedingCount = budgets.filter((b) => b.status === 'EXCEEDED').length;
  const nearLimitCount = budgets.filter(
    (b) => b.status === 'NEAR_LIMIT' || b.status === 'APPROACHING'
  ).length;

  return (
    <div className="rounded-2xl bg-surface border border-border p-6 space-y-5 shadow-card">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold font-display text-foreground">
              Budget Performance
            </h2>
            {exceedingCount > 0 ? (
              <span className="flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-destructive/10 text-destructive border border-destructive/20">
                <AlertTriangle className="w-3 h-3" /> {exceedingCount} Exceeded
              </span>
            ) : nearLimitCount > 0 ? (
              <span className="flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-500 border border-amber-500/20">
                <AlertTriangle className="w-3 h-3" /> {nearLimitCount} Near Limit
              </span>
            ) : (
              <span className="flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-income/10 text-income border border-income/20">
                <CheckCircle2 className="w-3 h-3" /> On Track
              </span>
            )}
          </div>
          <p className="text-xs text-secondary-text mt-0.5">
            Discipline across active category allocations
          </p>
        </div>

        <button
          type="button"
          onClick={() => navigate('/budgets')}
          className="self-start sm:self-auto flex items-center gap-1 text-xs font-semibold text-primary hover:text-primary-hover transition-colors cursor-pointer"
        >
          <span>Manage Budgets</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Overview Stat Badges */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-xl bg-surface-elevated border border-border">
        <div>
          <span className="text-[11px] text-muted-foreground block font-medium">Allocated</span>
          <span className="text-sm font-bold text-foreground tabular-nums">
            {budgetService.formatINR(totalAllocated)}
          </span>
        </div>
        <div>
          <span className="text-[11px] text-muted-foreground block font-medium">Spent</span>
          <span className="text-sm font-bold text-primary tabular-nums">
            {budgetService.formatINR(totalSpent)}
          </span>
        </div>
        <div>
          <span className="text-[11px] text-muted-foreground block font-medium">Remaining</span>
          <span className="text-sm font-bold text-income tabular-nums">
            {budgetService.formatINR(remaining)}
          </span>
        </div>
        <div>
          <span className="text-[11px] text-muted-foreground block font-medium">Utilization</span>
          <span
            className={`text-sm font-bold tabular-nums ${
              overallUtil >= 100
                ? 'text-destructive'
                : overallUtil >= 80
                ? 'text-amber-500'
                : 'text-income'
            }`}
          >
            {overallUtil}%
          </span>
        </div>
      </div>

      {/* Category Progress Bars */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {budgets.map((b) => {
          const isExceeded = b.status === 'EXCEEDED';
          const isNearLimit = b.status === 'NEAR_LIMIT' || b.status === 'APPROACHING';

          return (
            <div
              key={b.id}
              onClick={() => navigate(`/budgets/${b.id}`)}
              className="p-3.5 rounded-xl bg-surface-elevated border border-border hover:border-primary/40 transition-all cursor-pointer group"
            >
              <div className="flex items-center justify-between text-xs font-semibold mb-1">
                <span className="text-foreground line-clamp-1 group-hover:text-primary transition-colors">
                  {b.name}
                </span>
                <span
                  className={
                    isExceeded
                      ? 'text-destructive font-bold'
                      : isNearLimit
                      ? 'text-amber-500 font-bold'
                      : 'text-secondary-text'
                  }
                >
                  {b.utilizationPercentage}%
                </span>
              </div>

              <div className="w-full h-1.5 rounded-full bg-muted overflow-hidden my-2">
                <div
                  className={`h-full rounded-full transition-all duration-300 ${
                    isExceeded
                      ? 'bg-destructive'
                      : isNearLimit
                      ? 'bg-amber-500'
                      : 'bg-primary'
                  }`}
                  style={{ width: `${Math.min(100, b.utilizationPercentage)}%` }}
                />
              </div>

              <div className="flex items-center justify-between text-[11px] text-secondary-text tabular-nums">
                <span>{budgetService.formatINR(b.spent)}</span>
                <span>of {budgetService.formatINR(b.allocatedAmount)}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
