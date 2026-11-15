import React from 'react';
import { ListFilter, TrendingUp, TrendingDown, Scale } from 'lucide-react';
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
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Total Transactions
          </span>
          <div className="w-9 h-9 rounded-xl bg-spendx-blue-primary/10 text-spendx-blue-primary flex items-center justify-center">
            <ListFilter className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-3 mb-1">
          <span className="text-2xl sm:text-3xl font-bold tracking-tight text-spendx-indigo dark:text-spendx-soft-purple tabular-nums">
            {totalCount}
          </span>
        </div>
        <div className="text-xs text-slate-400 pt-2 border-t border-slate-100/60 dark:border-white/5 truncate">
          Recorded in active filter view
        </div>
      </div>

      {/* 2. Total Income */}
      <div className="glass-card-interactive p-5 rounded-2xl flex flex-col justify-between group">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Total Income
          </span>
          <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
            <TrendingUp className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-3 mb-1">
          <span className="text-2xl sm:text-3xl font-bold tracking-tight text-emerald-600 dark:text-emerald-400 tabular-nums">
            {transactionService.formatINR(totalIncome)}
          </span>
        </div>
        <div className="text-xs text-slate-400 pt-2 border-t border-slate-100/60 dark:border-white/5 truncate">
          Credited cash inflows
        </div>
      </div>

      {/* 3. Total Expenses */}
      <div className="glass-card-interactive p-5 rounded-2xl flex flex-col justify-between group">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Total Expenses
          </span>
          <div className="w-9 h-9 rounded-xl bg-rose-500/10 text-rose-600 dark:text-rose-400 flex items-center justify-center">
            <TrendingDown className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-3 mb-1">
          <span className="text-2xl sm:text-3xl font-bold tracking-tight text-rose-600 dark:text-rose-400 tabular-nums">
            {transactionService.formatINR(totalExpenses)}
          </span>
        </div>
        <div className="text-xs text-slate-400 pt-2 border-t border-slate-100/60 dark:border-white/5 truncate">
          Total debited outflows
        </div>
      </div>

      {/* 4. Net Cash Flow */}
      <div className="glass-card-interactive p-5 rounded-2xl flex flex-col justify-between group">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Net Cash Flow
          </span>
          <div
            className={`w-9 h-9 rounded-xl flex items-center justify-center ${
              netCashFlow >= 0
                ? 'bg-spendx-purple-primary/10 text-spendx-purple-primary'
                : 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
            }`}
          >
            <Scale className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-3 mb-1">
          <span
            className={`text-2xl sm:text-3xl font-bold tracking-tight tabular-nums ${
              netCashFlow >= 0
                ? 'text-spendx-indigo dark:text-spendx-soft-purple'
                : 'text-rose-600 dark:text-rose-400'
            }`}
          >
            {transactionService.formatINR(netCashFlow)}
          </span>
        </div>
        <div className="text-xs text-slate-400 pt-2 border-t border-slate-100/60 dark:border-white/5 truncate">
          {netCashFlow >= 0 ? 'Surplus retained' : 'Deficit in current period'}
        </div>
      </div>
    </div>
  );
};
