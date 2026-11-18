import React from 'react';
import { Target, ShieldCheck, PiggyBank, Sparkles } from 'lucide-react';
import { SavingsOverviewMetrics, savingsService } from '@/services/savingsService';

interface SavingsOverviewProps {
  metrics: SavingsOverviewMetrics;
}

export const SavingsOverview: React.FC<SavingsOverviewProps> = ({ metrics }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* 1. Total Savings */}
      <div className="bg-surface rounded-2xl border border-border p-5 shadow-card hover:shadow-elevated transition-all flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Total Savings
          </span>
          <div className="w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
            <PiggyBank className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-3 mb-1">
          <span className="text-2xl sm:text-3xl font-display font-bold tracking-tight text-foreground tabular-nums">
            {savingsService.formatINR(metrics.totalSaved)}
          </span>
        </div>
        <div className="text-xs text-secondary-text pt-2 border-t border-border truncate">
          Accumulated across active goals
        </div>
      </div>

      {/* 2. Total Target */}
      <div className="bg-surface rounded-2xl border border-border p-5 shadow-card hover:shadow-elevated transition-all flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Total Target
          </span>
          <div className="w-9 h-9 rounded-xl bg-secondary/10 text-secondary flex items-center justify-center">
            <Target className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-3 mb-1">
          <span className="text-2xl sm:text-3xl font-display font-bold tracking-tight text-secondary tabular-nums">
            {savingsService.formatINR(metrics.totalTarget)}
          </span>
        </div>
        <div className="text-xs text-secondary-text pt-2 border-t border-border truncate">
          Combined financial milestone goals
        </div>
      </div>

      {/* 3. Remaining to Save */}
      <div className="bg-surface rounded-2xl border border-border p-5 shadow-card hover:shadow-elevated transition-all flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Remaining to Save
          </span>
          <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center">
            <ShieldCheck className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-3 mb-1">
          <span className="text-2xl sm:text-3xl font-display font-bold tracking-tight text-amber-500 tabular-nums">
            {savingsService.formatINR(metrics.remainingToSave)}
          </span>
        </div>
        <div className="text-xs text-secondary-text pt-2 border-t border-border truncate">
          Outstanding to reach targets
        </div>
      </div>

      {/* 4. Overall Progress */}
      <div className="bg-surface rounded-2xl border border-border p-5 shadow-card hover:shadow-elevated transition-all flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Overall Progress
          </span>
          <div className="w-9 h-9 rounded-xl bg-income/10 text-income flex items-center justify-center">
            <Sparkles className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-3 mb-1">
          <span className="text-2xl sm:text-3xl font-display font-bold tracking-tight text-income tabular-nums">
            {metrics.overallProgress}%
          </span>
        </div>
        <div className="text-xs text-secondary-text pt-2 border-t border-border truncate">
          {metrics.completedGoalCount > 0
            ? `${metrics.completedGoalCount} goals completed!`
            : `${metrics.activeGoalCount} active milestones in progress`}
        </div>
      </div>
    </div>
  );
};
