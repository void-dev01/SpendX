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
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-destructive/10 text-destructive border border-destructive/20">
            <AlertTriangle className="w-3.5 h-3.5" /> Exceeded Limit
          </span>
        );
      case 'NEAR_LIMIT':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-500/10 text-amber-500 border border-amber-500/20">
            <AlertTriangle className="w-3.5 h-3.5" /> Near Limit (90%+)
          </span>
        );
      case 'APPROACHING':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-500/10 text-amber-500 border border-amber-500/20">
            Approaching (70%+)
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-income/10 text-income border border-income/20">
            <ShieldCheck className="w-3.5 h-3.5" /> On Track
          </span>
        );
    }
  };

  const getBarColor = () => {
    if (metrics.status === 'EXCEEDED') return 'bg-destructive';
    if (metrics.status === 'NEAR_LIMIT' || metrics.status === 'APPROACHING')
      return 'bg-amber-500';
    return 'bg-primary';
  };

  return (
    <div className="bg-surface p-6 rounded-2xl border border-border shadow-card space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-border">
        <div>
          <h2 className="text-lg font-display font-bold text-foreground">
            Overall Budget Utilization
          </h2>
          <p className="text-xs text-secondary-text mt-0.5">
            Consolidated discipline across all active category allocations.
          </p>
        </div>
        <div>{getStatusBadge()}</div>
      </div>

      {/* Progress Bar Container */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs font-medium">
          <span className="text-foreground">
            {metrics.overallUtilization}% Consumed
          </span>
          <span className="text-secondary-text">
            {budgetService.formatINR(metrics.totalSpent)} of {budgetService.formatINR(metrics.totalBudget)}
          </span>
        </div>

        <div className="w-full h-2.5 rounded-full bg-surface-elevated border border-border overflow-hidden p-0.5">
          <div
            className={`h-full rounded-full transition-all duration-500 ${getBarColor()}`}
            style={{ width: `${Math.min(100, metrics.overallUtilization)}%` }}
          />
        </div>
      </div>

      {/* Details Row */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2 text-xs">
        <div className="p-3 rounded-xl bg-surface-elevated border border-border">
          <span className="text-secondary-text block text-[11px]">Allocated Pool</span>
          <span className="font-display font-bold text-foreground tabular-nums text-sm">
            {budgetService.formatINR(metrics.totalBudget)}
          </span>
        </div>
        <div className="p-3 rounded-xl bg-surface-elevated border border-border">
          <span className="text-secondary-text block text-[11px]">Recorded Outflow</span>
          <span className="font-display font-bold text-expense tabular-nums text-sm">
            {budgetService.formatINR(metrics.totalSpent)}
          </span>
        </div>
        <div className="col-span-2 sm:col-span-1 p-3 rounded-xl bg-surface-elevated border border-border">
          <span className="text-secondary-text block text-[11px]">Net Reserve Left</span>
          <span className="font-display font-bold text-income tabular-nums text-sm">
            {budgetService.formatINR(metrics.remainingBudget)}
          </span>
        </div>
      </div>
    </div>
  );
};
