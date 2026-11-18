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
      <div className="bg-surface p-5 rounded-2xl border border-border shadow-card flex flex-col justify-between group hover:shadow-elevated transition-all">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Total Transactions
          </span>
          <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary border border-primary/20 flex items-center justify-center">
            <Receipt weight="duotone" className="w-5 h-5" />
          </div>
        </div>
        <div className="mt-3 mb-1">
          <span className="text-2xl sm:text-3xl font-display font-extrabold tracking-tight text-foreground tabular-nums">
            {totalCount}
          </span>
        </div>
        <div className="text-xs text-secondary-text pt-2 border-t border-border truncate">
          Recorded in active filter view
        </div>
      </div>

      {/* 2. Total Income */}
      <div className="bg-surface p-5 rounded-2xl border border-border shadow-card flex flex-col justify-between group hover:shadow-elevated transition-all">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Total Income
          </span>
          <div className="w-10 h-10 rounded-xl bg-income/10 text-income border border-income/20 flex items-center justify-center">
            <TrendUp weight="duotone" className="w-5 h-5" />
          </div>
        </div>
        <div className="mt-3 mb-1">
          <span className="text-2xl sm:text-3xl font-display font-extrabold tracking-tight text-income tabular-nums">
            {transactionService.formatINR(totalIncome)}
          </span>
        </div>
        <div className="text-xs text-secondary-text pt-2 border-t border-border truncate">
          Credited cash inflows
        </div>
      </div>

      {/* 3. Total Expenses */}
      <div className="bg-surface p-5 rounded-2xl border border-border shadow-card flex flex-col justify-between group hover:shadow-elevated transition-all">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Total Expenses
          </span>
          <div className="w-10 h-10 rounded-xl bg-expense/10 text-expense border border-expense/20 flex items-center justify-center">
            <TrendDown weight="duotone" className="w-5 h-5" />
          </div>
        </div>
        <div className="mt-3 mb-1">
          <span className="text-2xl sm:text-3xl font-display font-extrabold tracking-tight text-expense tabular-nums">
            {transactionService.formatINR(totalExpenses)}
          </span>
        </div>
        <div className="text-xs text-secondary-text pt-2 border-t border-border truncate">
          Total debited outflows
        </div>
      </div>

      {/* 4. Net Cash Flow */}
      <div className="bg-surface p-5 rounded-2xl border border-border shadow-card flex flex-col justify-between group hover:shadow-elevated transition-all">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Net Cash Flow
          </span>
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center border ${
              netCashFlow >= 0
                ? 'bg-income/10 text-income border-income/20'
                : 'bg-warning/10 text-warning border-warning/20'
            }`}
          >
            <Scales weight="duotone" className="w-5 h-5" />
          </div>
        </div>
        <div className="mt-3 mb-1">
          <span
            className={`text-2xl sm:text-3xl font-display font-extrabold tracking-tight tabular-nums ${
              netCashFlow >= 0
                ? 'text-income'
                : 'text-warning'
            }`}
          >
            {transactionService.formatINR(netCashFlow)}
          </span>
        </div>
        <div className="text-xs text-secondary-text pt-2 border-t border-border truncate">
          {netCashFlow >= 0 ? 'Surplus retained' : 'Deficit in current period'}
        </div>
      </div>
    </div>
  );
};
