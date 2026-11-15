import React from 'react';
import { FileText, Calendar, Receipt, TrendingUp } from 'lucide-react';
import { ReportsOverviewMetrics } from '@/services/reportsService';
import { transactionService } from '@/services/transactionService';

interface ReportsOverviewCardsProps {
  metrics: ReportsOverviewMetrics;
}

export const ReportsOverviewCards: React.FC<ReportsOverviewCardsProps> = ({ metrics }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* 1. Statements Available */}
      <div className="glass-card-interactive p-5 rounded-2xl flex flex-col justify-between group">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Available Statements
          </span>
          <div className="w-9 h-9 rounded-xl bg-spendx-blue-primary/10 text-spendx-blue-primary flex items-center justify-center">
            <FileText className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-3 mb-1 flex items-baseline gap-2">
          <span className="text-3xl font-extrabold tracking-tight text-spendx-indigo dark:text-spendx-soft-purple tabular-nums">
            {metrics.statementsGeneratedCount}
          </span>
          <span className="text-xs text-slate-500">monthly cycles</span>
        </div>
        <div className="text-xs text-slate-400 pt-2 border-t border-slate-100/60 dark:border-white/5 truncate">
          Archived ledger summaries
        </div>
      </div>

      {/* 2. Latest Cycle Generated */}
      <div className="glass-card-interactive p-5 rounded-2xl flex flex-col justify-between group">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Latest Statement
          </span>
          <div className="w-9 h-9 rounded-xl bg-spendx-purple-primary/10 text-spendx-purple-primary flex items-center justify-center">
            <Calendar className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-3 mb-1">
          <span className="text-xl sm:text-2xl font-bold tracking-tight text-spendx-purple-primary truncate">
            {metrics.latestStatementDate}
          </span>
        </div>
        <div className="text-xs text-slate-400 pt-2 border-t border-slate-100/60 dark:border-white/5 truncate">
          Reconciled against verified ledger
        </div>
      </div>

      {/* 3. Identified Tax Deductions */}
      <div className="glass-card-interactive p-5 rounded-2xl flex flex-col justify-between group">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Tax Deductible Expenses
          </span>
          <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
            <Receipt className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-3 mb-1">
          <span className="text-2xl sm:text-3xl font-extrabold tracking-tight text-emerald-600 dark:text-emerald-400 tabular-nums">
            {transactionService.formatINR(metrics.totalTaxDeductibleAmount)}
          </span>
        </div>
        <div className="text-xs text-slate-400 pt-2 border-t border-slate-100/60 dark:border-white/5 truncate">
          Insurance, education, and rent claims
        </div>
      </div>

      {/* 4. Average Savings Rate */}
      <div className="glass-card-interactive p-5 rounded-2xl flex flex-col justify-between group">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Average Savings Rate
          </span>
          <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center">
            <TrendingUp className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-3 mb-1 flex items-baseline gap-2">
          <span className="text-3xl font-extrabold tracking-tight text-amber-600 dark:text-amber-400 tabular-nums">
            {metrics.averageMonthlySavingsRate}%
          </span>
          <span className="text-xs text-slate-500">net compounding</span>
        </div>
        <div className="text-xs text-slate-400 pt-2 border-t border-slate-100/60 dark:border-white/5 truncate">
          Historical periodic performance
        </div>
      </div>
    </div>
  );
};
