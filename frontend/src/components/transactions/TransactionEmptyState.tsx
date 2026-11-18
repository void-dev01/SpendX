import React from 'react';
import { ArrowLeftRight, SearchX, Plus, RotateCcw } from 'lucide-react';

interface TransactionEmptyStateProps {
  type: 'NO_DATA' | 'NO_RESULTS';
  onActionClick: () => void;
}

export const TransactionEmptyState: React.FC<TransactionEmptyStateProps> = ({
  type,
  onActionClick,
}) => {
  if (type === 'NO_RESULTS') {
    return (
      <div className="bg-surface p-10 rounded-2xl text-center max-w-lg mx-auto my-8 border border-border shadow-card">
        <div className="w-14 h-14 mx-auto rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center mb-4">
          <SearchX className="w-7 h-7" />
        </div>
        <h3 className="text-lg font-display font-bold text-foreground">
          No Matching Transactions
        </h3>
        <p className="text-xs text-secondary-text mt-1 max-w-xs mx-auto leading-relaxed">
          No records matched your current search keywords or filter criteria. Try adjusting or clearing your filters.
        </p>
        <button
          type="button"
          onClick={onActionClick}
          className="mt-6 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-medium text-foreground bg-surface-elevated border border-border hover:bg-surface-elevated/80 transition-colors cursor-pointer shadow-xs"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Clear Filters</span>
        </button>
      </div>
    );
  }

  return (
    <div className="bg-surface p-10 sm:p-14 rounded-2xl text-center max-w-xl mx-auto my-8 border border-border shadow-elevated">
      <div className="w-16 h-16 mx-auto rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-5">
        <ArrowLeftRight className="w-8 h-8" />
      </div>

      <h3 className="text-xl font-display font-bold text-foreground">
        No Transactions Yet
      </h3>

      <p className="text-xs sm:text-sm text-secondary-text mt-2 max-w-sm mx-auto leading-relaxed">
        Your complete financial activity will appear here once you record your first income, expense, or account transfer.
      </p>

      <button
        type="button"
        onClick={onActionClick}
        className="mt-6 inline-flex items-center gap-2 px-6 py-3 rounded-xl font-medium text-xs text-white bg-primary hover:bg-primary/90 shadow-xs transition-all cursor-pointer"
      >
        <Plus className="w-4 h-4" />
        <span>Add Your First Transaction</span>
      </button>
    </div>
  );
};
