import React from 'react';
import { Trash2, X, CheckSquare } from 'lucide-react';

interface TransactionBulkActionsProps {
  selectedCount: number;
  onClearSelection: () => void;
  onDeleteSelected: () => void;
}

export const TransactionBulkActions: React.FC<TransactionBulkActionsProps> = ({
  selectedCount,
  onClearSelection,
  onDeleteSelected,
}) => {
  if (selectedCount === 0) return null;

  return (
    <div className="fixed bottom-20 md:bottom-8 left-1/2 -translate-x-1/2 z-40 animate-in fade-in slide-in-from-bottom-4 duration-200">
      <div className="bg-surface px-4 py-3 rounded-2xl border border-border shadow-elevated flex items-center gap-4">
        <div className="flex items-center gap-2">
          <CheckSquare className="w-4 h-4 text-primary" />
          <span className="text-xs sm:text-sm font-semibold text-foreground whitespace-nowrap">
            {selectedCount} {selectedCount === 1 ? 'transaction' : 'transactions'} selected
          </span>
        </div>

        <div className="h-4 w-px bg-border" />

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onDeleteSelected}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-expense bg-expense/10 hover:bg-expense/20 transition-colors cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Delete Selected</span>
          </button>

          <button
            type="button"
            onClick={onClearSelection}
            className="p-1.5 rounded-lg text-secondary-text hover:text-foreground transition-colors cursor-pointer"
            title="Clear selection"
            aria-label="Clear selection"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
