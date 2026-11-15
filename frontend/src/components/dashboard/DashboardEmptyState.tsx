import React from 'react';
import { PlusCircle, Wallet, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

interface DashboardEmptyStateProps {
  onAddTransactionClick?: () => void;
}

export const DashboardEmptyState: React.FC<DashboardEmptyStateProps> = ({
  onAddTransactionClick,
}) => {
  return (
    <div className="glass-panel p-8 sm:p-12 rounded-3xl text-center max-w-2xl mx-auto my-12 border border-white/80 dark:border-white/10 shadow-glass-elevated">
      <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-tr from-spendx-blue-primary/20 to-spendx-purple-primary/20 flex items-center justify-center text-spendx-blue-primary mb-6 shadow-sm">
        <Wallet className="w-8 h-8" />
      </div>

      <h2 className="text-2xl font-bold tracking-tight text-spendx-indigo dark:text-spendx-soft-purple">
        Your Financial Overview Starts Here
      </h2>

      <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 max-w-md mx-auto leading-relaxed">
        Add your first income or expense transaction to unlock real-time financial tracking, budget analytics, and automated AI insights.
      </p>

      <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
        {onAddTransactionClick ? (
          <button
            type="button"
            onClick={onAddTransactionClick}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm text-white bg-gradient-to-r from-spendx-blue-primary to-spendx-purple-primary hover:opacity-95 shadow-md transition-all cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            Add First Transaction
          </button>
        ) : (
          <Link
            to="/transactions"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm text-white bg-gradient-to-r from-spendx-blue-primary to-spendx-purple-primary hover:opacity-95 shadow-md transition-all cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            Record Transaction
          </Link>
        )}

        <Link
          to="/accounts"
          className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-6 py-3 rounded-xl font-medium text-sm text-slate-700 dark:text-slate-200 glass-surface border border-white/80 dark:border-white/10 hover:bg-white/60 dark:hover:bg-white/10 transition-all cursor-pointer"
        >
          <span>Connect Bank Account</span>
          <ArrowRight className="w-4 h-4 text-slate-400" />
        </Link>
      </div>
    </div>
  );
};
