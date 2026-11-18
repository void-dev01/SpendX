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
      <div className="rounded-[20px] bg-surface border border-border p-5 sm:p-6 flex items-center gap-4 shadow-card hover:shadow-elevated transition-all group">
        <div className="w-14 h-14 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0 shadow-xs group-hover:scale-105 transition-transform">
          <FileText className="w-7 h-7" />
        </div>
        <div className="min-w-0 flex-1">
          <span className="text-xs font-semibold uppercase tracking-wider text-secondary-text block truncate">
            Available Statements
          </span>
          <div className="my-0.5 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-bold font-display tracking-tight text-foreground tabular-nums">
              {metrics.statementsGeneratedCount}
            </span>
            <span className="text-xs text-muted-foreground">monthly cycles</span>
          </div>
          <div className="text-xs text-muted-foreground truncate">
            Archived ledger summaries
          </div>
        </div>
      </div>

      {/* 2. Latest Cycle Generated */}
      <div className="rounded-[20px] bg-surface border border-border p-5 sm:p-6 flex items-center gap-4 shadow-card hover:shadow-elevated transition-all group">
        <div className="w-14 h-14 rounded-full bg-secondary/10 text-secondary flex items-center justify-center shrink-0 shadow-xs group-hover:scale-105 transition-transform">
          <Calendar className="w-7 h-7" />
        </div>
        <div className="min-w-0 flex-1">
          <span className="text-xs font-semibold uppercase tracking-wider text-secondary-text block truncate">
            Latest Statement
          </span>
          <div className="my-0.5">
            <span className="text-xl sm:text-2xl font-bold font-display tracking-tight text-secondary truncate block">
              {metrics.latestStatementDate}
            </span>
          </div>
          <div className="text-xs text-muted-foreground truncate">
            Reconciled against ledger
          </div>
        </div>
      </div>

      {/* 3. Identified Tax Deductions */}
      <div className="rounded-[20px] bg-surface border border-border p-5 sm:p-6 flex items-center gap-4 shadow-card hover:shadow-elevated transition-all group">
        <div className="w-14 h-14 rounded-full bg-income/10 text-income flex items-center justify-center shrink-0 shadow-xs group-hover:scale-105 transition-transform">
          <Receipt className="w-7 h-7" />
        </div>
        <div className="min-w-0 flex-1">
          <span className="text-xs font-semibold uppercase tracking-wider text-secondary-text block truncate">
            Tax Deductible Expenses
          </span>
          <div className="my-0.5">
            <span className="text-2xl sm:text-3xl font-bold font-display tracking-tight text-income tabular-nums block truncate">
              {transactionService.formatINR(metrics.totalTaxDeductibleAmount)}
            </span>
          </div>
          <div className="text-xs text-muted-foreground truncate">
            Insurance & rent claims
          </div>
        </div>
      </div>

      {/* 4. Average Savings Rate */}
      <div className="rounded-[20px] bg-surface border border-border p-5 sm:p-6 flex items-center gap-4 shadow-card hover:shadow-elevated transition-all group">
        <div className="w-14 h-14 rounded-full bg-warning/10 text-warning flex items-center justify-center shrink-0 shadow-xs group-hover:scale-105 transition-transform">
          <TrendingUp className="w-7 h-7" />
        </div>
        <div className="min-w-0 flex-1">
          <span className="text-xs font-semibold uppercase tracking-wider text-secondary-text block truncate">
            Average Savings Rate
          </span>
          <div className="my-0.5 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-bold font-display tracking-tight text-warning tabular-nums">
              {metrics.averageMonthlySavingsRate}%
            </span>
            <span className="text-xs text-muted-foreground">net compounding</span>
          </div>
          <div className="text-xs text-muted-foreground truncate">
            Of annualized income
          </div>
        </div>
      </div>
    </div>
  );
};
