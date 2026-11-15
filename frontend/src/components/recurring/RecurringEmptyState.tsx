import React from 'react';
import { Repeat, Plus } from 'lucide-react';

interface RecurringEmptyStateProps {
  isFiltering: boolean;
  onClearFilters?: () => void;
  onAddPayment: () => void;
}

export const RecurringEmptyState: React.FC<RecurringEmptyStateProps> = ({
  isFiltering,
  onClearFilters,
  onAddPayment,
}) => {
  return (
    <div className="glass-card p-12 rounded-3xl border border-slate-200/60 dark:border-white/10 text-center flex flex-col items-center justify-center space-y-4">
      <div className="w-16 h-16 rounded-3xl bg-spendx-blue-primary/10 text-spendx-blue-primary flex items-center justify-center">
        <Repeat className="w-8 h-8" />
      </div>

      <div className="max-w-md space-y-1">
        <h3 className="text-lg font-bold text-spendx-text-primary dark:text-spendx-soft-purple">
          {isFiltering ? 'No recurring payments match your filters' : 'No recurring payments set up yet'}
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          {isFiltering
            ? 'Try adjusting your search query, status, or category filters.'
            : 'Track all your fixed liabilities, monthly Netflix & Spotify subscriptions, gym memberships, house rent, and loan EMIs.'}
        </p>
      </div>

      <div className="pt-2 flex items-center gap-3">
        {isFiltering && onClearFilters && (
          <button
            type="button"
            onClick={onClearFilters}
            className="px-4 py-2 text-xs font-semibold rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
          >
            Clear Filters
          </button>
        )}
        <button
          type="button"
          onClick={onAddPayment}
          className="btn-spendx-primary px-4 py-2 text-xs font-semibold rounded-xl flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>Add Recurring Payment</span>
        </button>
      </div>
    </div>
  );
};
