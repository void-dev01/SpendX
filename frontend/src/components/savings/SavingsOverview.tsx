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
      <div className="bg-card dark:bg-[#1B211B] rounded-[22px] border border-border p-6 shadow-xs hover:border-primary/40 hover:shadow-card transition-all flex flex-col justify-between group">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-bold uppercase tracking-wider text-secondary-text truncate block">
            Total Savings
          </span>
          <div className="w-9 h-9 rounded-xl bg-surface-subtle dark:bg-[#242C23] border border-border flex items-center justify-center shrink-0 shadow-xs text-foreground group-hover:scale-105 transition-transform">
            <PiggyBank className="w-5 h-5 text-primary" />
          </div>
        </div>
        <div>
          <span className="text-2xl sm:text-3xl font-display font-extrabold tracking-tight text-foreground tabular-nums truncate block">
            {savingsService.formatINR(metrics.totalSaved)}
          </span>
          <div className="text-xs text-secondary-text truncate mt-1">
            Accumulated across active goals
          </div>
        </div>
      </div>

      {/* 2. Total Target */}
      <div className="bg-card dark:bg-[#1B211B] rounded-[22px] border border-border p-6 shadow-xs hover:border-primary/40 hover:shadow-card transition-all flex flex-col justify-between group">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-bold uppercase tracking-wider text-secondary-text truncate block">
            Total Target
          </span>
          <div className="w-9 h-9 rounded-xl bg-surface-subtle dark:bg-[#242C23] border border-border flex items-center justify-center shrink-0 shadow-xs text-foreground group-hover:scale-105 transition-transform">
            <Target className="w-5 h-5 text-primary" />
          </div>
        </div>
        <div>
          <span className="text-2xl sm:text-3xl font-display font-extrabold tracking-tight text-foreground tabular-nums truncate block">
            {savingsService.formatINR(metrics.totalTarget)}
          </span>
          <div className="text-xs text-secondary-text truncate mt-1">
            Combined milestone targets
          </div>
        </div>
      </div>

      {/* 3. Remaining to Save */}
      <div className="bg-card dark:bg-[#1B211B] rounded-[22px] border border-border p-6 shadow-xs hover:border-warning/40 hover:shadow-card transition-all flex flex-col justify-between group">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-bold uppercase tracking-wider text-secondary-text truncate block">
            Remaining to Save
          </span>
          <div className="w-9 h-9 rounded-xl bg-warning/10 text-warning flex items-center justify-center shrink-0 shadow-xs group-hover:scale-105 transition-transform">
            <ShieldCheck className="w-5 h-5" />
          </div>
        </div>
        <div>
          <span className="text-2xl sm:text-3xl font-display font-extrabold tracking-tight text-warning tabular-nums truncate block">
            {savingsService.formatINR(metrics.remainingToSave)}
          </span>
          <div className="text-xs text-secondary-text truncate mt-1">
            Outstanding to reach targets
          </div>
        </div>
      </div>

      {/* 4. Overall Progress */}
      <div className="bg-card dark:bg-[#1B211B] rounded-[22px] border border-border p-6 shadow-xs hover:border-income/40 hover:shadow-card transition-all flex flex-col justify-between group">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-bold uppercase tracking-wider text-secondary-text truncate block">
            Overall Progress
          </span>
          <div className="w-9 h-9 rounded-xl bg-income/10 text-income flex items-center justify-center shrink-0 shadow-xs group-hover:scale-105 transition-transform">
            <Sparkles className="w-5 h-5" />
          </div>
        </div>
        <div>
          <span className="text-2xl sm:text-3xl font-display font-extrabold tracking-tight text-income tabular-nums truncate block">
            {metrics.overallProgress}%
          </span>
          <div className="text-xs text-secondary-text truncate mt-1">
            {metrics.completedGoalCount > 0
              ? `${metrics.completedGoalCount} goals completed!`
              : `${metrics.activeGoalCount} active milestones`}
          </div>
        </div>
      </div>
    </div>
  );
};
