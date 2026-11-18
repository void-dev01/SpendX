import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import {
  SavingsGoalRecord,
  SavingsOverviewMetrics,
  savingsService,
} from '@/services/savingsService';

interface SavingsPerformanceSectionProps {
  goals: SavingsGoalRecord[];
  metrics: SavingsOverviewMetrics;
}

export const SavingsPerformanceSection: React.FC<SavingsPerformanceSectionProps> = ({
  goals,
  metrics,
}) => {
  const navigate = useNavigate();

  if (goals.length === 0) return null;

  return (
    <div className="rounded-2xl bg-surface border border-border p-6 space-y-5 shadow-card">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold font-display text-foreground">
              Savings Performance
            </h2>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-secondary/10 text-secondary border border-secondary/20">
              {metrics.completedGoalCount > 0
                ? `${metrics.completedGoalCount} Completed`
                : `${metrics.activeGoalCount} Active Milestones`}
            </span>
          </div>
          <p className="text-xs text-secondary-text mt-0.5">
            Internal capital allocation toward long-term assets
          </p>
        </div>

        <button
          type="button"
          onClick={() => navigate('/savings')}
          className="self-start sm:self-auto flex items-center gap-1 text-xs font-semibold text-primary hover:text-primary-hover transition-colors cursor-pointer"
        >
          <span>Savings Goals</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Overview Stat Badges */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-xl bg-surface-elevated border border-border">
        <div>
          <span className="text-[11px] text-muted-foreground block font-medium">Total Saved</span>
          <span className="text-sm font-bold text-primary tabular-nums">
            {savingsService.formatINR(metrics.totalSaved)}
          </span>
        </div>
        <div>
          <span className="text-[11px] text-muted-foreground block font-medium">Total Target</span>
          <span className="text-sm font-bold text-foreground tabular-nums">
            {savingsService.formatINR(metrics.totalTarget)}
          </span>
        </div>
        <div>
          <span className="text-[11px] text-muted-foreground block font-medium">Remaining</span>
          <span className="text-sm font-bold text-amber-500 tabular-nums">
            {savingsService.formatINR(metrics.remainingToSave)}
          </span>
        </div>
        <div>
          <span className="text-[11px] text-muted-foreground block font-medium">Progress</span>
          <span className="text-sm font-bold text-income tabular-nums">
            {metrics.overallProgress}%
          </span>
        </div>
      </div>

      {/* Goal Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {goals.map((goal) => {
          const prog =
            goal.targetAmount > 0
              ? Math.min(100, Math.round((goal.currentAmount / goal.targetAmount) * 100))
              : 0;
          const isDone = goal.status === 'COMPLETED' || prog >= 100;

          return (
            <div
              key={goal.id}
              onClick={() => navigate(`/savings/${goal.id}`)}
              className="p-3.5 rounded-xl bg-surface-elevated border border-border hover:border-primary/40 transition-all cursor-pointer group"
            >
              <div className="flex items-center justify-between text-xs font-semibold mb-1">
                <span className="text-foreground line-clamp-1 group-hover:text-primary transition-colors">
                  {goal.name}
                </span>
                <span
                  className={
                    isDone
                      ? 'text-income font-bold tabular-nums'
                      : 'text-primary font-bold tabular-nums'
                  }
                >
                  {prog}%
                </span>
              </div>

              <div className="w-full h-1.5 rounded-full bg-muted overflow-hidden my-2">
                <div
                  className={`h-full rounded-full transition-all duration-300 ${
                    isDone
                      ? 'bg-income'
                      : 'bg-primary'
                  }`}
                  style={{ width: `${prog}%` }}
                />
              </div>

              <div className="flex items-center justify-between text-[11px] text-secondary-text tabular-nums">
                <span>{savingsService.formatINR(goal.currentAmount)}</span>
                <span>of {savingsService.formatINR(goal.targetAmount)}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
