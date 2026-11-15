import React from 'react';
import { Wallet, SearchX, Plus, RotateCcw } from 'lucide-react';

interface AccountEmptyStateProps {
  type: 'NO_DATA' | 'NO_RESULTS';
  onActionClick: () => void;
}

export const AccountEmptyState: React.FC<AccountEmptyStateProps> = ({
  type,
  onActionClick,
}) => {
  if (type === 'NO_RESULTS') {
    return (
      <div className="glass-panel p-10 rounded-3xl text-center max-w-lg mx-auto my-8 border border-white/80 dark:border-white/10 shadow-glass">
        <div className="w-14 h-14 mx-auto rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center mb-4">
          <SearchX className="w-7 h-7" />
        </div>
        <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">
          No Matching Accounts
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-xs mx-auto leading-relaxed">
          No accounts matched your keyword or selected type filter. Try adjusting your search.
        </p>
        <button
          type="button"
          onClick={onActionClick}
          className="mt-6 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-spendx-blue-primary glass-surface border border-spendx-blue-primary/30 hover:bg-spendx-blue-primary/10 transition-colors cursor-pointer shadow-sm"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Filters</span>
        </button>
      </div>
    );
  }

  return (
    <div className="glass-panel p-10 sm:p-14 rounded-3xl text-center max-w-xl mx-auto my-8 border border-white/80 dark:border-white/10 shadow-glass-elevated">
      <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-tr from-spendx-blue-primary/20 to-spendx-purple-primary/20 text-spendx-blue-primary flex items-center justify-center mb-5 shadow-sm">
        <Wallet className="w-8 h-8" />
      </div>

      <h3 className="text-xl font-bold text-spendx-indigo dark:text-spendx-soft-purple">
        Your financial space starts here.
      </h3>

      <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-2 max-w-sm mx-auto leading-relaxed">
        Add your first account to start tracking your bank accounts, savings vaults, credit cards, and cash wallets in one place.
      </p>

      <button
        type="button"
        onClick={onActionClick}
        className="mt-6 inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-xs text-white bg-gradient-to-r from-spendx-blue-primary to-spendx-purple-primary hover:opacity-95 shadow-md transition-all cursor-pointer"
      >
        <Plus className="w-4 h-4" />
        <span>Add Your First Account</span>
      </button>
    </div>
  );
};
