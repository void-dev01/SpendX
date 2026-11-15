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
    <div className="glass-panel p-6 rounded-2xl flex flex-col justify-between h-full">
      {/* Header */}
      <div className="flex items-center justify-between gap-2 mb-4">
        <div>
          <h2 className="text-lg font-bold text-spendx-indigo dark:text-spendx-soft-purple">
            Your Savings Goals
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Small steps toward bigger financial milestones.
          </p>
        </div>

        <Link
          to="/savings"
          className="inline-flex items-center gap-1 text-xs font-semibold text-spendx-blue-primary hover:text-spendx-purple-primary transition-colors cursor-pointer group"
        >
          View Savings Goals
          <ArrowUpRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </Link>
      </div>

      {/* Goals Cards List */}
      <div className="space-y-4 my-auto">
        {goals.map((goal) => (
          <div
            key={goal.id}
            className="p-4 rounded-xl glass-surface border border-white/60 dark:border-white/5 space-y-2.5 hover:border-spendx-blue-primary/30 transition-all"
          >
            {/* Top row */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-spendx-purple-primary/10 text-spendx-purple-primary flex items-center justify-center shrink-0">
                  {getIcon(goal.iconName)}
                </div>
                <div>
                  <h3 className="font-semibold text-sm text-slate-800 dark:text-slate-100">
                    {goal.name}
                  </h3>
                  <span className="text-[11px] text-slate-400">
                    Target: {dashboardService.formatINR(goal.targetAmount)}
                  </span>
                </div>
              </div>

              <div className="text-right">
                <span className="text-xs font-bold text-spendx-blue-primary tabular-nums">
                  {goal.progressPercentage}%
                </span>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="w-full h-2 rounded-full bg-slate-200/60 dark:bg-slate-700/50 overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-spendx-blue-primary to-spendx-purple-primary transition-all duration-500"
                style={{ width: `${Math.min(100, goal.progressPercentage)}%` }}
              />
            </div>

            {/* Bottom details */}
            <div className="flex items-center justify-between text-xs pt-0.5">
              <span className="text-slate-500 dark:text-slate-400">
                Saved:{' '}
                <strong className="text-emerald-600 dark:text-emerald-400 tabular-nums">
                  {dashboardService.formatINR(goal.savedAmount)}
                </strong>
              </span>
              <span className="text-slate-500 dark:text-slate-400">
                Remaining:{' '}
                <strong className="text-slate-700 dark:text-slate-300 tabular-nums">
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
