import React from 'react';
import { ShieldCheck, AlertTriangle } from 'lucide-react';
import { OverallBudgetMetrics, budgetService } from '@/services/budgetService';

interface OverallBudgetCardProps {
  metrics: OverallBudgetMetrics;
}

export const OverallBudgetCard: React.FC<OverallBudgetCardProps> = ({ metrics }) => {
  const getStatusBadge = () => {
    switch (metrics.status) {
      case 'EXCEEDED':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20">
            <AlertTriangle className="w-3.5 h-3.5" /> Exceeded Limit
          </span>
        );
      case 'NEAR_LIMIT':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
            <AlertTriangle className="w-3.5 h-3.5" /> Near Limit (90%+)
          </span>
        );
      case 'APPROACHING':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
            Approaching (70%+)
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
            <ShieldCheck className="w-3.5 h-3.5" /> On Track
          </span>
        );
    }
  };

  const getBarColor = () => {
    if (metrics.status === 'EXCEEDED') return 'bg-rose-500';
    if (metrics.status === 'NEAR_LIMIT' || metrics.status === 'APPROACHING')
      return 'bg-amber-500';
    return 'bg-gradient-to-r from-spendx-blue-primary to-spendx-purple-primary';
  };

  return (
    <div className="glass-panel p-6 rounded-3xl border border-white/80 dark:border-white/10 shadow-glass space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100/60 dark:border-white/10">
        <div>
          <h2 className="text-lg font-bold text-spendx-indigo dark:text-spendx-soft-purple">
            Overall Budget Utilization
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Consolidated discipline across all active category allocations.
          </p>
        </div>
        <div>{getStatusBadge()}</div>
      </div>

      {/* Progress Bar Container */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs font-semibold">
          <span className="text-slate-600 dark:text-slate-300">
            {metrics.overallUtilization}% Consumed
          </span>
          <span className="text-slate-500 dark:text-slate-400">
            {budgetService.formatINR(metrics.totalSpent)} of {budgetService.formatINR(metrics.totalBudget)}
          </span>
        </div>

        <div className="w-full h-3 rounded-full bg-slate-200/60 dark:bg-slate-700/50 overflow-hidden p-0.5">
          <div
            className={`h-full rounded-full transition-all duration-500 ${getBarColor()}`}
            style={{ width: `${Math.min(100, metrics.overallUtilization)}%` }}
          />
        </div>
      </div>

      {/* Details Row */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2 text-xs">
        <div className="p-3 rounded-xl glass-surface border border-white/60 dark:border-white/5">
          <span className="text-slate-400 block text-[11px]">Allocated Pool</span>
          <span className="font-bold text-slate-800 dark:text-slate-100 tabular-nums text-sm">
            {budgetService.formatINR(metrics.totalBudget)}
          </span>
        </div>
        <div className="p-3 rounded-xl glass-surface border border-white/60 dark:border-white/5">
          <span className="text-slate-400 block text-[11px]">Recorded Outflow</span>
          <span className="font-bold text-rose-600 dark:text-rose-400 tabular-nums text-sm">
            {budgetService.formatINR(metrics.totalSpent)}
          </span>
        </div>
        <div className="col-span-2 sm:col-span-1 p-3 rounded-xl glass-surface border border-white/60 dark:border-white/5">
          <span className="text-slate-400 block text-[11px]">Net Reserve Left</span>
          <span className="font-bold text-emerald-600 dark:text-emerald-400 tabular-nums text-sm">
            {budgetService.formatINR(metrics.remainingBudget)}
          </span>
        </div>
      </div>
    </div>
  );
};
