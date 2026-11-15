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
    <div className="glass-panel p-6 rounded-3xl space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-slate-800 dark:text-slate-100">
              Budget Performance
            </h2>
            {exceedingCount > 0 ? (
              <span className="flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-600 border border-rose-500/20">
                <AlertTriangle className="w-3 h-3" /> {exceedingCount} Exceeded
              </span>
            ) : nearLimitCount > 0 ? (
              <span className="flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-600 border border-amber-500/20">
                <AlertTriangle className="w-3 h-3" /> {nearLimitCount} Near Limit
              </span>
            ) : (
              <span className="flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
                <CheckCircle2 className="w-3 h-3" /> On Track
              </span>
            )}
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Discipline across active category allocations
          </p>
        </div>

        <button
          type="button"
          onClick={() => navigate('/budgets')}
          className="self-start sm:self-auto flex items-center gap-1 text-xs font-semibold text-spendx-blue-primary hover:text-spendx-purple-primary transition-colors cursor-pointer"
        >
          <span>Manage Budgets</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Overview Stat Badges */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-2xl glass-surface border border-white/80 dark:border-white/10">
        <div>
          <span className="text-[11px] text-slate-400 block font-medium">Allocated</span>
          <span className="text-sm font-bold text-slate-800 dark:text-slate-100 tabular-nums">
            {budgetService.formatINR(totalAllocated)}
          </span>
        </div>
        <div>
          <span className="text-[11px] text-slate-400 block font-medium">Spent</span>
          <span className="text-sm font-bold text-spendx-blue-primary tabular-nums">
            {budgetService.formatINR(totalSpent)}
          </span>
        </div>
        <div>
          <span className="text-[11px] text-slate-400 block font-medium">Remaining</span>
          <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400 tabular-nums">
            {budgetService.formatINR(remaining)}
          </span>
        </div>
        <div>
          <span className="text-[11px] text-slate-400 block font-medium">Utilization</span>
          <span
            className={`text-sm font-bold tabular-nums ${
              overallUtil >= 100
                ? 'text-rose-600'
                : overallUtil >= 80
                ? 'text-amber-600'
                : 'text-emerald-600'
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
              className="p-3.5 rounded-2xl glass-surface border border-white/60 dark:border-white/5 hover:border-spendx-blue-primary/30 transition-all cursor-pointer group"
            >
              <div className="flex items-center justify-between text-xs font-semibold mb-1">
                <span className="text-slate-800 dark:text-slate-200 line-clamp-1 group-hover:text-spendx-blue-primary transition-colors">
                  {b.name}
                </span>
                <span
                  className={
                    isExceeded
                      ? 'text-rose-600 font-bold'
                      : isNearLimit
                      ? 'text-amber-600 font-bold'
                      : 'text-slate-500'
                  }
                >
                  {b.utilizationPercentage}%
                </span>
              </div>

              <div className="w-full h-1.5 rounded-full bg-slate-200 dark:bg-white/10 overflow-hidden my-2">
                <div
                  className={`h-full rounded-full transition-all duration-300 ${
                    isExceeded
                      ? 'bg-rose-500'
                      : isNearLimit
                      ? 'bg-amber-500'
                      : 'bg-spendx-blue-primary'
                  }`}
                  style={{ width: `${Math.min(100, b.utilizationPercentage)}%` }}
                />
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
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
