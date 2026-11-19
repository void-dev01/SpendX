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
      <div className="bg-card dark:bg-[#1B211B] p-6 rounded-[22px] border border-border shadow-xs hover:border-primary/40 hover:shadow-card flex flex-col justify-between group transition-all">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-bold uppercase tracking-wider text-secondary-text truncate block">
            Total Transactions
          </span>
          <div className="w-9 h-9 rounded-xl bg-surface-subtle dark:bg-[#242C23] border border-border flex items-center justify-center shrink-0 shadow-xs text-foreground group-hover:scale-105 transition-transform">
            <Receipt weight="duotone" className="w-5 h-5 text-primary" />
          </div>
        </div>
        <div>
          <span className="text-2xl sm:text-3xl font-display font-extrabold tracking-tight text-foreground tabular-nums truncate block">
            {totalCount}
          </span>
          <div className="text-xs text-secondary-text truncate mt-1">
            Recorded in active view
          </div>
        </div>
      </div>

      {/* 2. Total Income */}
      <div className="bg-card dark:bg-[#1B211B] p-6 rounded-[22px] border border-border shadow-xs hover:border-income/40 hover:shadow-card flex flex-col justify-between group transition-all">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-bold uppercase tracking-wider text-secondary-text truncate block">
            Total Income
          </span>
          <div className="w-9 h-9 rounded-xl bg-income/10 text-income flex items-center justify-center shrink-0 shadow-xs group-hover:scale-105 transition-transform">
            <TrendUp weight="duotone" className="w-5 h-5" />
          </div>
        </div>
        <div>
          <span className="text-2xl sm:text-3xl font-display font-extrabold tracking-tight text-income tabular-nums truncate block">
            {transactionService.formatINR(totalIncome)}
          </span>
          <div className="text-xs text-secondary-text truncate mt-1">
            Credited cash inflows
          </div>
        </div>
      </div>

      {/* 3. Total Expenses */}
      <div className="bg-card dark:bg-[#1B211B] p-6 rounded-[22px] border border-border shadow-xs hover:border-expense/40 hover:shadow-card flex flex-col justify-between group transition-all">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-bold uppercase tracking-wider text-secondary-text truncate block">
            Total Expenses
          </span>
          <div className="w-9 h-9 rounded-xl bg-expense/10 text-expense flex items-center justify-center shrink-0 shadow-xs group-hover:scale-105 transition-transform">
            <TrendDown weight="duotone" className="w-5 h-5" />
          </div>
        </div>
        <div>
          <span className="text-2xl sm:text-3xl font-display font-extrabold tracking-tight text-expense tabular-nums truncate block">
            {transactionService.formatINR(totalExpenses)}
          </span>
          <div className="text-xs text-secondary-text truncate mt-1">
            Total debited outflows
          </div>
        </div>
      </div>

      {/* 4. Net Cash Flow */}
      <div className="bg-card dark:bg-[#1B211B] p-6 rounded-[22px] border border-border shadow-xs hover:border-primary/40 hover:shadow-card flex flex-col justify-between group transition-all">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-bold uppercase tracking-wider text-secondary-text truncate block">
            Net Cash Flow
          </span>
          <div
            className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 shadow-xs group-hover:scale-105 transition-transform ${
              netCashFlow >= 0
                ? 'bg-primary/20 text-foreground border border-primary/40'
                : 'bg-warning/10 text-warning'
            }`}
          >
            <Scales weight="duotone" className="w-5 h-5 text-primary" />
          </div>
        </div>
        <div>
          <span
            className={`text-2xl sm:text-3xl font-display font-extrabold tracking-tight tabular-nums truncate block ${
              netCashFlow >= 0 ? 'text-foreground' : 'text-warning'
            }`}
          >
            {transactionService.formatINR(netCashFlow)}
          </span>
          <div className="text-xs text-secondary-text truncate mt-1">
            {netCashFlow >= 0 ? 'Surplus retained' : 'Deficit in current period'}
          </div>
        </div>
      </div>
    </div>
  );
};
