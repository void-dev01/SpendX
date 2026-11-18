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
      <div className="rounded-2xl bg-surface border border-border p-5 flex flex-col justify-between shadow-card hover:border-primary/40 transition-colors">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-secondary-text">
            Total Income
          </span>
          <div className="w-9 h-9 rounded-xl bg-income/10 text-income flex items-center justify-center">
            <TrendingUp className="w-4 h-4" />
          </div>
        </div>

        <div className="mt-3 mb-1">
          <span className="text-2xl sm:text-3xl font-bold font-display tracking-tight text-income tabular-nums">
            {analyticsService.formatINR(summary.totalIncome)}
          </span>
        </div>

        <div className="pt-2 border-t border-border flex items-center justify-between text-xs">
          {showComparison && summary.prevIncome > 0 ? (
            <span
              className={`flex items-center gap-0.5 font-semibold ${
                summary.incomeChangePct >= 0
                  ? 'text-income'
                  : 'text-destructive'
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
            <span className="text-secondary-text truncate">Eligible earnings & inflows</span>
          )}
          <span className="text-[11px] text-muted-foreground">
            {summary.transactionCount} transactions
          </span>
        </div>
      </div>

      {/* 2. Total Expenses */}
      <div className="rounded-2xl bg-surface border border-border p-5 flex flex-col justify-between shadow-card hover:border-primary/40 transition-colors">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-secondary-text">
            Total Expenses
          </span>
          <div className="w-9 h-9 rounded-xl bg-destructive/10 text-destructive flex items-center justify-center">
            <TrendingDown className="w-4 h-4" />
          </div>
        </div>

        <div className="mt-3 mb-1">
          <span className="text-2xl sm:text-3xl font-bold font-display tracking-tight text-destructive tabular-nums">
            {analyticsService.formatINR(summary.totalExpenses)}
          </span>
        </div>

        <div className="pt-2 border-t border-border flex items-center justify-between text-xs">
          {showComparison && summary.prevExpenses > 0 ? (
            <span
              className={`flex items-center gap-0.5 font-semibold ${
                summary.expenseChangePct <= 0
                  ? 'text-income'
                  : 'text-destructive'
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
            <span className="text-secondary-text truncate">Discretionary & core outflows</span>
          )}
          <span className="text-[11px] text-muted-foreground">Excludes transfers</span>
        </div>
      </div>

      {/* 3. Net Cash Flow */}
      <div className="rounded-2xl bg-surface border border-border p-5 flex flex-col justify-between shadow-card hover:border-primary/40 transition-colors">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-secondary-text">
            Net Cash Flow
          </span>
          <div
            className={`w-9 h-9 rounded-xl flex items-center justify-center ${
              isNetPositive
                ? 'bg-primary/10 text-primary'
                : 'bg-amber-500/10 text-amber-500'
            }`}
          >
            <Scale className="w-4 h-4" />
          </div>
        </div>

        <div className="mt-3 mb-1">
          <span
            className={`text-2xl sm:text-3xl font-bold font-display tracking-tight tabular-nums ${
              isNetPositive
                ? 'text-primary'
                : 'text-amber-500'
            }`}
          >
            {isNetPositive ? '+' : ''}
            {analyticsService.formatINR(summary.netCashFlow)}
          </span>
        </div>

        <div className="pt-2 border-t border-border flex items-center justify-between text-xs">
          {showComparison && summary.prevIncome > 0 ? (
            <span
              className={`flex items-center gap-0.5 font-semibold ${
                summary.cashFlowChangePct >= 0
                  ? 'text-income'
                  : 'text-destructive'
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
            <span className="text-secondary-text truncate">
              {isNetPositive ? 'Surplus retained' : 'Deficit incurred'}
            </span>
          )}
          <span className="text-[11px] text-muted-foreground">Income minus expenses</span>
        </div>
      </div>

      {/* 4. Savings Rate */}
      <div className="rounded-2xl bg-surface border border-border p-5 flex flex-col justify-between shadow-card hover:border-primary/40 transition-colors">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-secondary-text">
            Savings Rate
          </span>
          <div className="w-9 h-9 rounded-xl bg-secondary/10 text-secondary flex items-center justify-center">
            <PiggyBank className="w-4 h-4" />
          </div>
        </div>

        <div className="mt-3 mb-1">
          <span className="text-2xl sm:text-3xl font-bold font-display tracking-tight text-secondary tabular-nums">
            {summary.savingsRate}%
          </span>
        </div>

        <div className="pt-2 border-t border-border flex items-center justify-between text-xs">
          {showComparison && summary.prevSavingsRate > 0 ? (
            <span
              className={`flex items-center gap-0.5 font-semibold ${
                summary.savingsRate >= summary.prevSavingsRate
                  ? 'text-income'
                  : 'text-destructive'
              }`}
            >
              {summary.savingsRate >= summary.prevSavingsRate ? '+' : ''}
              {(summary.savingsRate - summary.prevSavingsRate).toFixed(1)}% pts
            </span>
          ) : (
            <span className="text-secondary-text truncate">
              {summary.savingsRate >= 20 ? 'Optimal discipline' : 'Target: 20%+'}
            </span>
          )}
          <span className="text-[11px] text-muted-foreground">Of gross earnings</span>
        </div>
      </div>
    </div>
  );
};
