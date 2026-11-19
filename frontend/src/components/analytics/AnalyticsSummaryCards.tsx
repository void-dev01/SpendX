import React from 'react';
import {
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  ArrowDownRight,
  Scale,
  PiggyBank,
} from 'lucide-react';
import { AnalyticsSummaryMetrics, analyticsService } from '@/services/analyticsService';

interface AnalyticsSummaryCardsProps {
  summary: AnalyticsSummaryMetrics;
  showComparison: boolean;
}

export const AnalyticsSummaryCards: React.FC<AnalyticsSummaryCardsProps> = ({
  summary,
  showComparison,
}) => {
  const isNetPositive = summary.netCashFlow >= 0;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* 1. Total Income */}
      <div className="rounded-[22px] bg-card dark:bg-[#1B211B] border border-border p-6 flex flex-col justify-between shadow-xs hover:border-income/40 hover:shadow-card transition-all group">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-bold uppercase tracking-wider text-secondary-text block truncate">
            Total Income
          </span>
          <div className="w-9 h-9 rounded-xl bg-income/10 text-income flex items-center justify-center shrink-0 shadow-xs group-hover:scale-105 transition-transform">
            <TrendingUp className="w-5 h-5" />
          </div>
        </div>
        <div>
          <span className="text-2xl sm:text-3xl font-extrabold font-display tracking-tight text-income tabular-nums block truncate">
            {analyticsService.formatINR(summary.totalIncome)}
          </span>
          <div className="flex items-center justify-between text-xs text-secondary-text truncate mt-2">
            {showComparison && summary.prevIncome > 0 ? (
              <span
                className={`flex items-center gap-0.5 font-bold ${
                  summary.incomeChangePct >= 0 ? 'text-income' : 'text-expense'
                }`}
              >
                {summary.incomeChangePct >= 0 ? (
                  <ArrowUpRight className="w-3.5 h-3.5" />
                ) : (
                  <ArrowDownRight className="w-3.5 h-3.5" />
                )}
                {Math.abs(summary.incomeChangePct)}% vs prev.
              </span>
            ) : (
              <span className="truncate">Eligible inflows</span>
            )}
            <span className="text-[11px] text-secondary-text font-medium ml-1">
              {summary.transactionCount} txns
            </span>
          </div>
        </div>
      </div>

      {/* 2. Total Expenses */}
      <div className="rounded-[22px] bg-card dark:bg-[#1B211B] border border-border p-6 flex flex-col justify-between shadow-xs hover:border-expense/40 hover:shadow-card transition-all group">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-bold uppercase tracking-wider text-secondary-text block truncate">
            Total Expenses
          </span>
          <div className="w-9 h-9 rounded-xl bg-expense/10 text-expense flex items-center justify-center shrink-0 shadow-xs group-hover:scale-105 transition-transform">
            <TrendingDown className="w-5 h-5" />
          </div>
        </div>
        <div>
          <span className="text-2xl sm:text-3xl font-extrabold font-display tracking-tight text-expense tabular-nums block truncate">
            {analyticsService.formatINR(summary.totalExpenses)}
          </span>
          <div className="flex items-center justify-between text-xs text-secondary-text truncate mt-2">
            {showComparison && summary.prevExpenses > 0 ? (
              <span
                className={`flex items-center gap-0.5 font-bold ${
                  summary.expenseChangePct <= 0 ? 'text-income' : 'text-expense'
                }`}
              >
                {summary.expenseChangePct >= 0 ? (
                  <ArrowUpRight className="w-3.5 h-3.5" />
                ) : (
                  <ArrowDownRight className="w-3.5 h-3.5" />
                )}
                {Math.abs(summary.expenseChangePct)}% vs prev.
              </span>
            ) : (
              <span className="truncate">Core outflows</span>
            )}
            <span className="text-[11px] text-secondary-text font-medium ml-1">Excludes transfers</span>
          </div>
        </div>
      </div>

      {/* 3. Net Cash Flow */}
      <div className="rounded-[22px] bg-card dark:bg-[#1B211B] border border-border p-6 flex flex-col justify-between shadow-xs hover:border-primary/40 hover:shadow-card transition-all group">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-bold uppercase tracking-wider text-secondary-text block truncate">
            Net Cash Flow
          </span>
          <div
            className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 shadow-xs group-hover:scale-105 transition-transform ${
              isNetPositive ? 'bg-primary/20 text-foreground border border-primary/40' : 'bg-warning/10 text-warning'
            }`}
          >
            <Scale className="w-5 h-5 text-primary" />
          </div>
        </div>
        <div>
          <span
            className={`text-2xl sm:text-3xl font-extrabold font-display tracking-tight tabular-nums block truncate ${
              isNetPositive ? 'text-foreground' : 'text-warning'
            }`}
          >
            {isNetPositive ? '+' : ''}
            {analyticsService.formatINR(summary.netCashFlow)}
          </span>
          <div className="flex items-center justify-between text-xs text-secondary-text truncate mt-2">
            {showComparison && summary.prevIncome > 0 ? (
              <span
                className={`flex items-center gap-0.5 font-bold ${
                  summary.cashFlowChangePct >= 0 ? 'text-income' : 'text-expense'
                }`}
              >
                {summary.cashFlowChangePct >= 0 ? (
                  <ArrowUpRight className="w-3.5 h-3.5" />
                ) : (
                  <ArrowDownRight className="w-3.5 h-3.5" />
                )}
                {Math.abs(summary.cashFlowChangePct)}% shift
              </span>
            ) : (
              <span className="truncate">
                {isNetPositive ? 'Surplus retained' : 'Deficit incurred'}
              </span>
            )}
            <span className="text-[11px] text-secondary-text font-medium ml-1">Net delta</span>
          </div>
        </div>
      </div>

      {/* 4. Savings Rate */}
      <div className="rounded-[22px] bg-card dark:bg-[#1B211B] border border-border p-6 flex flex-col justify-between shadow-xs hover:border-primary/40 hover:shadow-card transition-all group">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-bold uppercase tracking-wider text-secondary-text block truncate">
            Savings Rate
          </span>
          <div className="w-9 h-9 rounded-xl bg-surface-subtle dark:bg-[#242C23] border border-border text-foreground flex items-center justify-center shrink-0 shadow-xs group-hover:scale-105 transition-transform">
            <PiggyBank className="w-5 h-5 text-primary" />
          </div>
        </div>
        <div>
          <span className="text-2xl sm:text-3xl font-extrabold font-display tracking-tight text-foreground tabular-nums block truncate">
            {summary.savingsRate}%
          </span>
          <div className="flex items-center justify-between text-xs text-secondary-text truncate mt-2">
            {showComparison && summary.prevSavingsRate > 0 ? (
              <span
                className={`flex items-center gap-0.5 font-bold ${
                  summary.savingsRate >= summary.prevSavingsRate ? 'text-income' : 'text-expense'
                }`}
              >
                {summary.savingsRate >= summary.prevSavingsRate ? '+' : ''}
                {(summary.savingsRate - summary.prevSavingsRate).toFixed(1)}% pts
              </span>
            ) : (
              <span className="truncate">
                {summary.savingsRate >= 20 ? 'Optimal discipline' : 'Target: 20%+'}
              </span>
            )}
            <span className="text-[11px] text-secondary-text font-medium ml-1">Of earnings</span>
          </div>
        </div>
      </div>
    </div>
  );
};
