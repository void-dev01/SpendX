import React from 'react';
import { Target, SearchX, Plus, RefreshCw } from 'lucide-react';

interface SavingsEmptyStateProps {
  isFiltered: boolean;
  onResetFilters?: () => void;
  onCreateGoal: () => void;
}

export const SavingsEmptyState: React.FC<SavingsEmptyStateProps> = ({
  isFiltered,
  onResetFilters,
  onCreateGoal,
}) => {
  if (isFiltered) {
    return (
      <div className="glass-panel p-10 rounded-2xl flex flex-col items-center justify-center text-center">
        <div className="w-12 h-12 rounded-2xl glass-surface border border-white/80 dark:border-white/10 flex items-center justify-center mb-3 text-slate-400">
          <SearchX className="w-6 h-6" />
        </div>
        <h3 className="text-base font-semibold text-slate-800 dark:text-slate-100">
          No matching savings goals
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mt-1">
          We couldn't find any savings goals matching your current search or category filters.
        </p>
        {onResetFilters && (
          <button
            type="button"
            onClick={onResetFilters}
            className="mt-4 flex items-center gap-1.5 px-4 py-2 text-xs font-medium rounded-xl glass-surface border border-white/80 dark:border-white/10 hover:bg-white/40 dark:hover:bg-white/10 text-slate-700 dark:text-slate-200 transition-colors cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Clear Filters</span>
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="glass-panel p-12 rounded-3xl flex flex-col items-center justify-center text-center">
      <div className="w-14 h-14 rounded-3xl bg-gradient-to-tr from-spendx-blue-primary/20 to-spendx-purple-primary/20 text-spendx-blue-primary flex items-center justify-center mb-4 shadow-inner">
        <Target className="w-7 h-7" />
      </div>
      <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">
        No savings goals yet
      </h3>
      <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mt-1 leading-relaxed">
        Turn your financial dreams into structured milestones. Set targets for an Emergency Fund, next vacation, or high-yield investments.
      </p>
      <button
        type="button"
        onClick={onCreateGoal}
        className="mt-5 flex items-center gap-1.5 px-5 py-2.5 text-xs font-semibold rounded-xl bg-gradient-to-r from-spendx-blue-primary to-spendx-purple-primary text-white shadow-md hover:shadow-lg hover:opacity-95 transition-all cursor-pointer"
      >
        <Plus className="w-4 h-4" />
        <span>Create Your First Goal</span>
      </button>
    </div>
  );
};
