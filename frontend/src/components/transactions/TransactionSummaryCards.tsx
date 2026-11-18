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
      <div className="bg-surface p-5 sm:p-6 rounded-[20px] border border-border shadow-card flex items-center gap-4 group hover:shadow-elevated transition-all">
        <div className="w-14 h-14 rounded-full bg-primary/10 text-primary border border-primary/20 flex items-center justify-center shrink-0 shadow-xs group-hover:scale-105 transition-transform">
          <Receipt weight="duotone" className="w-7 h-7" />
        </div>
        <div className="min-w-0 flex-1">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block truncate">
            Total Transactions
          </span>
          <div className="my-0.5">
            <span className="text-2xl sm:text-3xl font-display font-extrabold tracking-tight text-foreground tabular-nums truncate block">
              {totalCount}
            </span>
          </div>
          <div className="text-xs text-secondary-text truncate">
            Recorded in active view
          </div>
        </div>
      </div>

      {/* 2. Total Income */}
      <div className="bg-surface p-5 sm:p-6 rounded-[20px] border border-border shadow-card flex items-center gap-4 group hover:shadow-elevated transition-all">
        <div className="w-14 h-14 rounded-full bg-income/10 text-income border border-income/20 flex items-center justify-center shrink-0 shadow-xs group-hover:scale-105 transition-transform">
          <TrendUp weight="duotone" className="w-7 h-7" />
        </div>
        <div className="min-w-0 flex-1">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block truncate">
            Total Income
          </span>
          <div className="my-0.5">
            <span className="text-2xl sm:text-3xl font-display font-extrabold tracking-tight text-income tabular-nums truncate block">
              {transactionService.formatINR(totalIncome)}
            </span>
          </div>
          <div className="text-xs text-secondary-text truncate">
            Credited cash inflows
          </div>
        </div>
      </div>

      {/* 3. Total Expenses */}
      <div className="bg-surface p-5 sm:p-6 rounded-[20px] border border-border shadow-card flex items-center gap-4 group hover:shadow-elevated transition-all">
        <div className="w-14 h-14 rounded-full bg-expense/10 text-expense border border-expense/20 flex items-center justify-center shrink-0 shadow-xs group-hover:scale-105 transition-transform">
          <TrendDown weight="duotone" className="w-7 h-7" />
        </div>
        <div className="min-w-0 flex-1">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block truncate">
            Total Expenses
          </span>
          <div className="my-0.5">
            <span className="text-2xl sm:text-3xl font-display font-extrabold tracking-tight text-expense tabular-nums truncate block">
              {transactionService.formatINR(totalExpenses)}
            </span>
          </div>
          <div className="text-xs text-secondary-text truncate">
            Total debited outflows
          </div>
        </div>
      </div>

      {/* 4. Net Cash Flow */}
      <div className="bg-surface p-5 sm:p-6 rounded-[20px] border border-border shadow-card flex items-center gap-4 group hover:shadow-elevated transition-all">
        <div
          className={`w-14 h-14 rounded-full flex items-center justify-center shrink-0 shadow-xs group-hover:scale-105 transition-transform border ${
            netCashFlow >= 0
              ? 'bg-income/10 text-income border-income/20'
              : 'bg-warning/10 text-warning border-warning/20'
          }`}
        >
          <Scales weight="duotone" className="w-7 h-7" />
        </div>
        <div className="min-w-0 flex-1">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block truncate">
            Net Cash Flow
          </span>
          <div className="my-0.5">
            <span
              className={`text-2xl sm:text-3xl font-display font-extrabold tracking-tight tabular-nums truncate block ${
                netCashFlow >= 0 ? 'text-income' : 'text-warning'
              }`}
            >
              {transactionService.formatINR(netCashFlow)}
            </span>
          </div>
          <div className="text-xs text-secondary-text truncate">
            {netCashFlow >= 0 ? 'Surplus retained' : 'Deficit in current period'}
          </div>
        </div>
      </div>
    </div>
  );
};
