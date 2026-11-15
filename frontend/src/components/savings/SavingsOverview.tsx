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
      <div className="glass-card-interactive p-5 rounded-2xl flex flex-col justify-between group">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Total Savings
          </span>
          <div className="w-9 h-9 rounded-xl bg-spendx-blue-primary/10 text-spendx-blue-primary flex items-center justify-center">
            <PiggyBank className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-3 mb-1">
          <span className="text-2xl sm:text-3xl font-bold tracking-tight text-spendx-indigo dark:text-spendx-soft-purple tabular-nums">
            {savingsService.formatINR(metrics.totalSaved)}
          </span>
        </div>
        <div className="text-xs text-slate-400 pt-2 border-t border-slate-100/60 dark:border-white/5 truncate">
          Accumulated across active goals
        </div>
      </div>

      {/* 2. Total Target */}
      <div className="glass-card-interactive p-5 rounded-2xl flex flex-col justify-between group">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Total Target
          </span>
          <div className="w-9 h-9 rounded-xl bg-spendx-purple-primary/10 text-spendx-purple-primary flex items-center justify-center">
            <Target className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-3 mb-1">
          <span className="text-2xl sm:text-3xl font-bold tracking-tight text-spendx-purple-primary tabular-nums">
            {savingsService.formatINR(metrics.totalTarget)}
          </span>
        </div>
        <div className="text-xs text-slate-400 pt-2 border-t border-slate-100/60 dark:border-white/5 truncate">
          Combined financial milestone goals
        </div>
      </div>

      {/* 3. Remaining to Save */}
      <div className="glass-card-interactive p-5 rounded-2xl flex flex-col justify-between group">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Remaining to Save
          </span>
          <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center">
            <ShieldCheck className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-3 mb-1">
          <span className="text-2xl sm:text-3xl font-bold tracking-tight text-amber-600 dark:text-amber-400 tabular-nums">
            {savingsService.formatINR(metrics.remainingToSave)}
          </span>
        </div>
        <div className="text-xs text-slate-400 pt-2 border-t border-slate-100/60 dark:border-white/5 truncate">
          Outstanding to reach targets
        </div>
      </div>

      {/* 4. Overall Progress */}
      <div className="glass-card-interactive p-5 rounded-2xl flex flex-col justify-between group">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Overall Progress
          </span>
          <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
            <Sparkles className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-3 mb-1">
          <span className="text-2xl sm:text-3xl font-bold tracking-tight text-emerald-600 dark:text-emerald-400 tabular-nums">
            {metrics.overallProgress}%
          </span>
        </div>
        <div className="text-xs text-slate-400 pt-2 border-t border-slate-100/60 dark:border-white/5 truncate">
          {metrics.completedGoalCount > 0
            ? `${metrics.completedGoalCount} goals completed!`
            : `${metrics.activeGoalCount} active milestones in progress`}
        </div>
      </div>
    </div>
  );
};
