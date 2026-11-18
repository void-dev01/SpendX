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
      <div className="bg-surface p-10 rounded-2xl text-center max-w-lg mx-auto my-8 border border-border shadow-card">
        <div className="w-14 h-14 mx-auto rounded-2xl bg-warning/10 text-warning flex items-center justify-center mb-4">
          <SearchX className="w-7 h-7" />
        </div>
        <h3 className="text-lg font-display font-bold text-foreground">
          No Matching Accounts
        </h3>
        <p className="text-xs text-secondary-text mt-1 max-w-xs mx-auto leading-relaxed">
          No accounts matched your keyword or selected type filter. Try adjusting your search.
        </p>
        <button
          type="button"
          onClick={onActionClick}
          className="mt-6 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-primary bg-surface-elevated border border-border hover:bg-surface transition-colors cursor-pointer shadow-xs"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Filters</span>
        </button>
      </div>
    );
  }

  return (
    <div className="bg-surface p-10 sm:p-14 rounded-2xl text-center max-w-xl mx-auto my-8 border border-border shadow-elevated">
      <div className="w-16 h-16 mx-auto rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-5 shadow-xs">
        <Wallet className="w-8 h-8" />
      </div>

      <h3 className="text-xl font-display font-bold text-foreground">
        Your financial space starts here.
      </h3>

      <p className="text-xs sm:text-sm text-secondary-text mt-2 max-w-sm mx-auto leading-relaxed">
        Add your first account to start tracking your bank accounts, savings vaults, credit cards, and cash wallets in one place.
      </p>

      <button
        type="button"
        onClick={onActionClick}
        className="mt-6 inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-xs text-white bg-primary hover:bg-primary-hover shadow-xs transition-colors cursor-pointer"
      >
        <Plus className="w-4 h-4" />
        <span>Add Your First Account</span>
      </button>
    </div>
  );
};
