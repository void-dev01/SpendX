import React from 'react';
import { Lightbulb, RotateCcw } from 'lucide-react';

interface InsightsEmptyStateProps {
  isFiltering: boolean;
  onClearFilters?: () => void;
  onResetDismissed?: () => void;
}

export const InsightsEmptyState: React.FC<InsightsEmptyStateProps> = ({
  isFiltering,
  onClearFilters,
  onResetDismissed,
}) => {
  return (
    <div className="glass-card p-12 rounded-3xl border border-slate-200/60 dark:border-white/10 text-center flex flex-col items-center justify-center space-y-4">
      <div className="w-16 h-16 rounded-3xl bg-spendx-purple-primary/10 text-spendx-purple-primary flex items-center justify-center">
        <Lightbulb className="w-8 h-8" />
      </div>

      <div className="max-w-md space-y-1">
        <h3 className="text-lg font-bold text-spendx-text-primary dark:text-spendx-soft-purple">
          {isFiltering ? 'No insights match your active filters' : 'All clear! No pending insights'}
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          {isFiltering
            ? 'Try adjusting your search keywords, impact level, or category filter.'
            : 'Your spending pace is healthy, liabilities are up to date, and milestones are on track.'}
        </p>
      </div>

      <div className="pt-2 flex items-center gap-3">
        {isFiltering && onClearFilters && (
          <button
            type="button"
            onClick={onClearFilters}
            className="btn-spendx-primary px-4 py-2 text-xs font-semibold rounded-xl"
          >
            Clear Filters
          </button>
        )}
        {onResetDismissed && (
          <button
            type="button"
            onClick={onResetDismissed}
            className="px-4 py-2 text-xs font-semibold rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors flex items-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Restore Dismissed Insights</span>
          </button>
        )}
      </div>
    </div>
  );
};
