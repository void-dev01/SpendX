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
      <div className="rounded-[20px] bg-surface border border-border p-5 sm:p-6 flex items-center gap-4 shadow-card hover:shadow-elevated transition-all group">
        <div className="w-14 h-14 rounded-full bg-income/10 text-income flex items-center justify-center shrink-0 shadow-xs group-hover:scale-105 transition-transform">
          <TrendingUp className="w-7 h-7" />
        </div>
        <div className="min-w-0 flex-1">
          <span className="text-xs font-semibold uppercase tracking-wider text-secondary-text block truncate">
            Total Income
          </span>
          <div className="my-0.5">
            <span className="text-2xl sm:text-3xl font-bold font-display tracking-tight text-income tabular-nums block truncate">
              {analyticsService.formatINR(summary.totalIncome)}
            </span>
          </div>
          <div className="flex items-center justify-between text-xs text-secondary-text truncate">
            {showComparison && summary.prevIncome > 0 ? (
              <span
                className={`flex items-center gap-0.5 font-semibold ${
                  summary.incomeChangePct >= 0 ? 'text-income' : 'text-destructive'
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
            <span className="text-[11px] text-muted-foreground ml-1">
              {summary.transactionCount} txns
            </span>
          </div>
        </div>
      </div>

      {/* 2. Total Expenses */}
      <div className="rounded-[20px] bg-surface border border-border p-5 sm:p-6 flex items-center gap-4 shadow-card hover:shadow-elevated transition-all group">
        <div className="w-14 h-14 rounded-full bg-destructive/10 text-destructive flex items-center justify-center shrink-0 shadow-xs group-hover:scale-105 transition-transform">
          <TrendingDown className="w-7 h-7" />
        </div>
        <div className="min-w-0 flex-1">
          <span className="text-xs font-semibold uppercase tracking-wider text-secondary-text block truncate">
            Total Expenses
          </span>
          <div className="my-0.5">
            <span className="text-2xl sm:text-3xl font-bold font-display tracking-tight text-destructive tabular-nums block truncate">
              {analyticsService.formatINR(summary.totalExpenses)}
            </span>
          </div>
          <div className="flex items-center justify-between text-xs text-secondary-text truncate">
            {showComparison && summary.prevExpenses > 0 ? (
              <span
                className={`flex items-center gap-0.5 font-semibold ${
                  summary.expenseChangePct <= 0 ? 'text-income' : 'text-destructive'
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
            <span className="text-[11px] text-muted-foreground ml-1">Excludes transfers</span>
          </div>
        </div>
      </div>

      {/* 3. Net Cash Flow */}
      <div className="rounded-[20px] bg-surface border border-border p-5 sm:p-6 flex items-center gap-4 shadow-card hover:shadow-elevated transition-all group">
        <div
          className={`w-14 h-14 rounded-full flex items-center justify-center shrink-0 shadow-xs group-hover:scale-105 transition-transform ${
            isNetPositive ? 'bg-primary/10 text-primary' : 'bg-warning/10 text-warning'
          }`}
        >
          <Scale className="w-7 h-7" />
        </div>
        <div className="min-w-0 flex-1">
          <span className="text-xs font-semibold uppercase tracking-wider text-secondary-text block truncate">
            Net Cash Flow
          </span>
          <div className="my-0.5">
            <span
              className={`text-2xl sm:text-3xl font-bold font-display tracking-tight tabular-nums block truncate ${
                isNetPositive ? 'text-primary' : 'text-warning'
              }`}
            >
              {isNetPositive ? '+' : ''}
              {analyticsService.formatINR(summary.netCashFlow)}
            </span>
          </div>
          <div className="flex items-center justify-between text-xs text-secondary-text truncate">
            {showComparison && summary.prevIncome > 0 ? (
              <span
                className={`flex items-center gap-0.5 font-semibold ${
                  summary.cashFlowChangePct >= 0 ? 'text-income' : 'text-destructive'
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
            <span className="text-[11px] text-muted-foreground ml-1">Net delta</span>
          </div>
        </div>
      </div>

      {/* 4. Savings Rate */}
      <div className="rounded-[20px] bg-surface border border-border p-5 sm:p-6 flex items-center gap-4 shadow-card hover:shadow-elevated transition-all group">
        <div className="w-14 h-14 rounded-full bg-secondary/10 text-secondary flex items-center justify-center shrink-0 shadow-xs group-hover:scale-105 transition-transform">
          <PiggyBank className="w-7 h-7" />
        </div>
        <div className="min-w-0 flex-1">
          <span className="text-xs font-semibold uppercase tracking-wider text-secondary-text block truncate">
            Savings Rate
          </span>
          <div className="my-0.5">
            <span className="text-2xl sm:text-3xl font-bold font-display tracking-tight text-secondary tabular-nums block truncate">
              {summary.savingsRate}%
            </span>
          </div>
          <div className="flex items-center justify-between text-xs text-secondary-text truncate">
            {showComparison && summary.prevSavingsRate > 0 ? (
              <span
                className={`flex items-center gap-0.5 font-semibold ${
                  summary.savingsRate >= summary.prevSavingsRate ? 'text-income' : 'text-destructive'
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
            <span className="text-[11px] text-muted-foreground ml-1">Of earnings</span>
          </div>
        </div>
      </div>
    </div>
  );
};
