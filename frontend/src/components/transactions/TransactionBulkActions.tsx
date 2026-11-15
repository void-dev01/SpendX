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
      <div className="glass-panel px-4 py-3 rounded-2xl border border-white/90 dark:border-white/20 shadow-glass-elevated flex items-center gap-4 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl">
        <div className="flex items-center gap-2">
          <CheckSquare className="w-4 h-4 text-spendx-blue-primary" />
          <span className="text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-100 whitespace-nowrap">
            {selectedCount} {selectedCount === 1 ? 'transaction' : 'transactions'} selected
          </span>
        </div>

        <div className="h-4 w-px bg-slate-200 dark:bg-white/10" />

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onDeleteSelected}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-rose-600 dark:text-rose-400 bg-rose-500/10 hover:bg-rose-500/20 transition-colors cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Delete Selected</span>
          </button>

          <button
            type="button"
            onClick={onClearSelection}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors cursor-pointer"
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
