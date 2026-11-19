import React from 'react';
import { PlusCircle, Wallet, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

interface DashboardEmptyStateProps {
  onAddTransactionClick?: () => void;
  onLoadSampleData?: () => void;
}

export const DashboardEmptyState: React.FC<DashboardEmptyStateProps> = ({
  onAddTransactionClick,
  onLoadSampleData,
}) => {
  return (
    <div className="bg-card dark:bg-[#1B211B] p-8 sm:p-12 rounded-[22px] text-center max-w-2xl mx-auto my-12 border border-border shadow-xs">
      <div className="w-16 h-16 mx-auto rounded-2xl bg-primary/20 flex items-center justify-center text-foreground mb-6 shadow-xs border border-primary/40">
        <Wallet className="w-8 h-8" />
      </div>

      <h2 className="text-2xl font-display font-bold tracking-tight text-foreground">
        Your Financial Overview Starts Here
      </h2>

      <p className="text-sm text-secondary-text mt-2 max-w-md mx-auto leading-relaxed">
        Add your first income or expense transaction to unlock real-time financial tracking, budget analytics, and automated AI insights.
      </p>

      <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
        {onAddTransactionClick ? (
          <button
            type="button"
            onClick={onAddTransactionClick}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold text-sm text-primary-foreground bg-primary hover:bg-primary-hover shadow-xs transition-colors cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            Add First Transaction
          </button>
        ) : (
          <Link
            to="/transactions"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold text-sm text-primary-foreground bg-primary hover:bg-primary-hover shadow-xs transition-colors cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            Record Transaction
          </Link>
        )}

        <Link
          to="/accounts"
          className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-6 py-3 rounded-xl font-semibold text-sm text-foreground bg-surface-subtle dark:bg-[#242C23] border border-border hover:bg-card transition-colors cursor-pointer shadow-xs"
        >
          <span>Connect Bank Account</span>
          <ArrowRight className="w-4 h-4 text-secondary-text" />
        </Link>
      </div>

      {onLoadSampleData && (
        <div className="mt-6 pt-4 border-t border-border">
          <button
            type="button"
            onClick={onLoadSampleData}
            className="text-xs font-bold text-foreground hover:text-primary cursor-pointer transition-colors"
          >
            ← Load Benchmark Sample Data (Interactive Preview)
          </button>
        </div>
      )}
    </div>
  );
};
