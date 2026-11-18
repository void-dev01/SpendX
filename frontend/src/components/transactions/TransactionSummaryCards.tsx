import React from 'react';
import { Receipt, TrendUp, TrendDown, Scales } from '@phosphor-icons/react';
import { TransactionRecord, transactionService } from '@/services/transactionService';

interface TransactionSummaryCardsProps {
  transactions: TransactionRecord[];
}

export const TransactionSummaryCards: React.FC<TransactionSummaryCardsProps> = ({ transactions }) => {
  // Deterministic financial totals
  let totalIncome = 0;
  let totalExpenses = 0;

  transactions.forEach((t) => {
    if (t.type === 'INCOME') {
      totalIncome += t.amount;
    } else if (t.type === 'EXPENSE') {
      totalExpenses += t.amount;
    }
  });

  const netCashFlow = totalIncome - totalExpenses;
  const totalCount = transactions.length;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* 1. Total Transactions */}
      <div className="glass-card-interactive p-5 rounded-2xl flex flex-col justify-between group">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Total Transactions
          </span>
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 flex items-center justify-center">
            <Receipt weight="duotone" className="w-5 h-5" />
          </div>
        </div>
        <div className="mt-3 mb-1">
          <span className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground tabular-nums">
            {totalCount}
          </span>
        </div>
        <div className="text-xs text-muted-foreground pt-2 border-t border-black/5 dark:border-white/5 truncate">
          Recorded in active filter view
        </div>
      </div>

      {/* 2. Total Income */}
      <div className="glass-card-interactive p-5 rounded-2xl flex flex-col justify-between group">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Total Income
          </span>
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 flex items-center justify-center">
            <TrendUp weight="duotone" className="w-5 h-5" />
          </div>
        </div>
        <div className="mt-3 mb-1">
          <span className="text-2xl sm:text-3xl font-bold tracking-tight text-emerald-600 dark:text-emerald-400 tabular-nums">
            {transactionService.formatINR(totalIncome)}
          </span>
        </div>
        <div className="text-xs text-muted-foreground pt-2 border-t border-black/5 dark:border-white/5 truncate">
          Credited cash inflows
        </div>
      </div>

      {/* 3. Total Expenses */}
      <div className="glass-card-interactive p-5 rounded-2xl flex flex-col justify-between group">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Total Expenses
          </span>
          <div className="w-10 h-10 rounded-xl bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20 flex items-center justify-center">
            <TrendDown weight="duotone" className="w-5 h-5" />
          </div>
        </div>
        <div className="mt-3 mb-1">
          <span className="text-2xl sm:text-3xl font-bold tracking-tight text-rose-600 dark:text-rose-400 tabular-nums">
            {transactionService.formatINR(totalExpenses)}
          </span>
        </div>
        <div className="text-xs text-muted-foreground pt-2 border-t border-black/5 dark:border-white/5 truncate">
          Total debited outflows
        </div>
      </div>

      {/* 4. Net Cash Flow */}
      <div className="glass-card-interactive p-5 rounded-2xl flex flex-col justify-between group">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Net Cash Flow
          </span>
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center border ${
              netCashFlow >= 0
                ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'
                : 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20'
            }`}
          >
            <Scales weight="duotone" className="w-5 h-5" />
          </div>
        </div>
        <div className="mt-3 mb-1">
          <span
            className={`text-2xl sm:text-3xl font-bold tracking-tight tabular-nums ${
              netCashFlow >= 0
                ? 'text-emerald-600 dark:text-emerald-400'
                : 'text-amber-600 dark:text-amber-400'
            }`}
          >
            {transactionService.formatINR(netCashFlow)}
          </span>
        </div>
        <div className="text-xs text-muted-foreground pt-2 border-t border-black/5 dark:border-white/5 truncate">
          {netCashFlow >= 0 ? 'Surplus retained' : 'Deficit in current period'}
        </div>
      </div>
    </div>
  );
};
