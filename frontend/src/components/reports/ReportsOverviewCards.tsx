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
      <div className="rounded-2xl bg-surface border border-border p-5 flex flex-col justify-between shadow-card hover:border-primary/40 transition-colors">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-secondary-text">
            Available Statements
          </span>
          <div className="w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
            <FileText className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-3 mb-1 flex items-baseline gap-2">
          <span className="text-3xl font-bold font-display tracking-tight text-foreground tabular-nums">
            {metrics.statementsGeneratedCount}
          </span>
          <span className="text-xs text-muted-foreground">monthly cycles</span>
        </div>
        <div className="text-xs text-muted-foreground pt-2 border-t border-border truncate">
          Archived ledger summaries
        </div>
      </div>

      {/* 2. Latest Cycle Generated */}
      <div className="rounded-2xl bg-surface border border-border p-5 flex flex-col justify-between shadow-card hover:border-primary/40 transition-colors">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-secondary-text">
            Latest Statement
          </span>
          <div className="w-9 h-9 rounded-xl bg-secondary/10 text-secondary flex items-center justify-center">
            <Calendar className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-3 mb-1">
          <span className="text-xl sm:text-2xl font-bold font-display tracking-tight text-secondary truncate">
            {metrics.latestStatementDate}
          </span>
        </div>
        <div className="text-xs text-muted-foreground pt-2 border-t border-border truncate">
          Reconciled against verified ledger
        </div>
      </div>

      {/* 3. Identified Tax Deductions */}
      <div className="rounded-2xl bg-surface border border-border p-5 flex flex-col justify-between shadow-card hover:border-primary/40 transition-colors">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-secondary-text">
            Tax Deductible Expenses
          </span>
          <div className="w-9 h-9 rounded-xl bg-income/10 text-income flex items-center justify-center">
            <Receipt className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-3 mb-1">
          <span className="text-2xl sm:text-3xl font-bold font-display tracking-tight text-income tabular-nums">
            {transactionService.formatINR(metrics.totalTaxDeductibleAmount)}
          </span>
        </div>
        <div className="text-xs text-muted-foreground pt-2 border-t border-border truncate">
          Insurance, education, and rent claims
        </div>
      </div>

      {/* 4. Average Savings Rate */}
      <div className="rounded-2xl bg-surface border border-border p-5 flex flex-col justify-between shadow-card hover:border-primary/40 transition-colors">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-secondary-text">
            Average Savings Rate
          </span>
          <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center">
            <TrendingUp className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-3 mb-1 flex items-baseline gap-2">
          <span className="text-3xl font-bold font-display tracking-tight text-amber-500 tabular-nums">
            {metrics.averageMonthlySavingsRate}%
          </span>
          <span className="text-xs text-muted-foreground">net compounding</span>
        </div>
        <div className="text-xs text-muted-foreground pt-2 border-t border-border truncate">
          Historical periodic performance
        </div>
      </div>
    </div>
  );
};
