import React from 'react';
import { ShieldCheck, Laptop, Target, ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { SavingsGoal, dashboardService } from '@/services/dashboardService';

interface SavingsGoalsWidgetProps {
  goals: SavingsGoal[];
}

export const SavingsGoalsWidget: React.FC<SavingsGoalsWidgetProps> = ({ goals }) => {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'ShieldCheck':
        return <ShieldCheck className="w-4 h-4" />;
      case 'Laptop':
        return <Laptop className="w-4 h-4" />;
      default:
        return <Target className="w-4 h-4" />;
    }
  };

  return (
    <div className="bg-surface p-5 sm:p-6 rounded-2xl border border-border shadow-card flex flex-col justify-between h-full">
      {/* Header */}
      <div className="flex items-center justify-between gap-2 mb-4">
        <div>
          <h2 className="text-base sm:text-lg font-display font-bold text-foreground">
            Your Savings Goals
          </h2>
          <p className="text-xs text-secondary-text mt-0.5">
            Small steps toward bigger financial milestones.
          </p>
        </div>

        <Link
          to="/savings"
          className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:text-primary-hover transition-colors cursor-pointer group"
        >
          View Savings Goals
          <ArrowUpRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </Link>
      </div>

      {/* Goals Cards List */}
      <div className="space-y-3.5 my-auto">
        {goals.map((goal) => (
          <div
            key={goal.id}
            className="p-3.5 rounded-xl bg-surface-elevated border border-border space-y-2.5 hover:border-primary/40 transition-all shadow-xs"
          >
            {/* Top row */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-secondary/10 text-secondary flex items-center justify-center shrink-0">
                  {getIcon(goal.iconName)}
                </div>
                <div>
                  <h3 className="font-semibold text-sm text-foreground">
                    {goal.name}
                  </h3>
                  <span className="text-[11px] text-muted-foreground">
                    Target: {dashboardService.formatINR(goal.targetAmount)}
                  </span>
                </div>
              </div>

              <div className="text-right">
                <span className="text-xs font-bold text-primary tabular-nums">
                  {goal.progressPercentage}%
                </span>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="w-full h-2 rounded-full bg-surface border border-border-subtle overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-[#496BDB] to-[#7256D9] transition-all duration-500"
                style={{ width: `${Math.min(100, goal.progressPercentage)}%` }}
              />
            </div>

            {/* Bottom details */}
            <div className="flex items-center justify-between text-xs pt-0.5">
              <span className="text-secondary-text">
                Saved:{' '}
                <strong className="text-income tabular-nums">
                  {dashboardService.formatINR(goal.savedAmount)}
                </strong>
              </span>
              <span className="text-secondary-text">
                Remaining:{' '}
                <strong className="text-foreground tabular-nums">
                  {dashboardService.formatINR(goal.remainingAmount)}
                </strong>
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
