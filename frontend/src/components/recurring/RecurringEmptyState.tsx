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
    <div className="bg-surface p-12 rounded-2xl border border-border shadow-card text-center flex flex-col items-center justify-center space-y-4">
      <div className="w-16 h-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
        <Repeat className="w-8 h-8" />
      </div>

      <div className="max-w-md space-y-1">
        <h3 className="text-lg font-display font-bold text-foreground">
          {isFiltering ? 'No recurring payments match your filters' : 'No recurring payments set up yet'}
        </h3>
        <p className="text-xs text-secondary-text">
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
            className="px-4 py-2 text-xs font-medium rounded-xl bg-surface-elevated border border-border text-foreground hover:bg-surface-elevated/80 transition-colors shadow-xs cursor-pointer"
          >
            Clear Filters
          </button>
        )}
        <button
          type="button"
          onClick={onAddPayment}
          className="px-4 py-2 text-xs font-bold rounded-xl bg-primary hover:bg-primary-hover text-[#111711] shadow-xs flex items-center gap-2 transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add Recurring Payment</span>
        </button>
      </div>
    </div>
  );
};
