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
      <div className="bg-surface p-10 rounded-2xl border border-border shadow-card flex flex-col items-center justify-center text-center">
        <div className="w-12 h-12 rounded-xl bg-surface-elevated border border-border flex items-center justify-center mb-3 text-muted-foreground">
          <SearchX className="w-6 h-6" />
        </div>
        <h3 className="text-base font-display font-bold text-foreground">
          No matching savings goals
        </h3>
        <p className="text-xs text-secondary-text max-w-sm mt-1">
          We couldn't find any savings goals matching your current search or category filters.
        </p>
        {onResetFilters && (
          <button
            type="button"
            onClick={onResetFilters}
            className="mt-4 flex items-center gap-1.5 px-4 py-2 text-xs font-medium rounded-xl bg-surface-elevated border border-border hover:bg-surface-elevated/80 text-foreground transition-colors cursor-pointer shadow-xs"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Clear Filters</span>
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="bg-surface p-12 rounded-2xl border border-border shadow-elevated flex flex-col items-center justify-center text-center">
      <div className="w-14 h-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-4">
        <Target className="w-7 h-7" />
      </div>
      <h3 className="text-lg font-display font-bold text-foreground">
        No savings goals yet
      </h3>
      <p className="text-xs text-secondary-text max-w-md mt-1 leading-relaxed">
        Turn your financial dreams into structured milestones. Set targets for an Emergency Fund, next vacation, or high-yield investments.
      </p>
      <button
        type="button"
        onClick={onCreateGoal}
        className="mt-5 flex items-center gap-1.5 px-5 py-2.5 text-xs font-medium rounded-xl bg-primary hover:bg-primary/90 text-white shadow-xs transition-all cursor-pointer"
      >
        <Plus className="w-4 h-4" />
        <span>Create Your First Goal</span>
      </button>
    </div>
  );
};
