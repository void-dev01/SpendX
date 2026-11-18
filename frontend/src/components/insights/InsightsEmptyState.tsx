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
    <div className="rounded-2xl bg-surface border border-border p-12 text-center flex flex-col items-center justify-center space-y-4 shadow-card">
      <div className="w-14 h-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
        <Lightbulb className="w-7 h-7" />
      </div>

      <div className="max-w-md space-y-1">
        <h3 className="text-lg font-bold font-display text-foreground">
          {isFiltering ? 'No insights match your active filters' : 'All clear! No pending insights'}
        </h3>
        <p className="text-xs text-secondary-text">
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
            className="px-4 py-2 text-xs font-semibold rounded-xl bg-primary text-primary-foreground hover:bg-primary-hover shadow-xs transition-colors min-h-[38px]"
          >
            Clear Filters
          </button>
        )}
        {onResetDismissed && (
          <button
            type="button"
            onClick={onResetDismissed}
            className="px-4 py-2 text-xs font-semibold rounded-xl bg-surface-elevated border border-border text-foreground hover:bg-surface transition-colors flex items-center gap-1.5 min-h-[38px] shadow-xs"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Restore Dismissed Insights</span>
          </button>
        )}
      </div>
    </div>
  );
};
