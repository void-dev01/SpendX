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
      <div className="bg-surface rounded-[20px] border border-border p-5 sm:p-6 shadow-card hover:shadow-elevated transition-all flex items-center gap-4 group">
        <div className="w-14 h-14 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0 shadow-xs group-hover:scale-105 transition-transform">
          <PiggyBank className="w-7 h-7" />
        </div>
        <div className="min-w-0 flex-1">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block truncate">
            Total Savings
          </span>
          <div className="my-0.5">
            <span className="text-2xl sm:text-3xl font-display font-bold tracking-tight text-foreground tabular-nums truncate block">
              {savingsService.formatINR(metrics.totalSaved)}
            </span>
          </div>
          <div className="text-xs text-secondary-text truncate">
            Accumulated across active goals
          </div>
        </div>
      </div>

      {/* 2. Total Target */}
      <div className="bg-surface rounded-[20px] border border-border p-5 sm:p-6 shadow-card hover:shadow-elevated transition-all flex items-center gap-4 group">
        <div className="w-14 h-14 rounded-full bg-secondary/10 text-secondary flex items-center justify-center shrink-0 shadow-xs group-hover:scale-105 transition-transform">
          <Target className="w-7 h-7" />
        </div>
        <div className="min-w-0 flex-1">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block truncate">
            Total Target
          </span>
          <div className="my-0.5">
            <span className="text-2xl sm:text-3xl font-display font-bold tracking-tight text-secondary tabular-nums truncate block">
              {savingsService.formatINR(metrics.totalTarget)}
            </span>
          </div>
          <div className="text-xs text-secondary-text truncate">
            Combined milestone targets
          </div>
        </div>
      </div>

      {/* 3. Remaining to Save */}
      <div className="bg-surface rounded-[20px] border border-border p-5 sm:p-6 shadow-card hover:shadow-elevated transition-all flex items-center gap-4 group">
        <div className="w-14 h-14 rounded-full bg-warning/10 text-warning flex items-center justify-center shrink-0 shadow-xs group-hover:scale-105 transition-transform">
          <ShieldCheck className="w-7 h-7" />
        </div>
        <div className="min-w-0 flex-1">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block truncate">
            Remaining to Save
          </span>
          <div className="my-0.5">
            <span className="text-2xl sm:text-3xl font-display font-bold tracking-tight text-warning tabular-nums truncate block">
              {savingsService.formatINR(metrics.remainingToSave)}
            </span>
          </div>
          <div className="text-xs text-secondary-text truncate">
            Outstanding to reach targets
          </div>
        </div>
      </div>

      {/* 4. Overall Progress */}
      <div className="bg-surface rounded-[20px] border border-border p-5 sm:p-6 shadow-card hover:shadow-elevated transition-all flex items-center gap-4 group">
        <div className="w-14 h-14 rounded-full bg-income/10 text-income flex items-center justify-center shrink-0 shadow-xs group-hover:scale-105 transition-transform">
          <Sparkles className="w-7 h-7" />
        </div>
        <div className="min-w-0 flex-1">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block truncate">
            Overall Progress
          </span>
          <div className="my-0.5">
            <span className="text-2xl sm:text-3xl font-display font-bold tracking-tight text-income tabular-nums truncate block">
              {metrics.overallProgress}%
            </span>
          </div>
          <div className="text-xs text-secondary-text truncate">
            {metrics.completedGoalCount > 0
              ? `${metrics.completedGoalCount} goals completed!`
              : `${metrics.activeGoalCount} active milestones`}
          </div>
        </div>
      </div>
    </div>
  );
};
