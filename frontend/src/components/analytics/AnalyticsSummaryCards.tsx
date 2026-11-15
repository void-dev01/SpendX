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
            {analyticsService.formatINR(summary.totalIncome)}
          </span>
        </div>

        <div className="pt-2 border-t border-slate-100/60 dark:border-white/5 flex items-center justify-between text-xs">
          {showComparison && summary.prevIncome > 0 ? (
            <span
              className={`flex items-center gap-0.5 font-semibold ${
                summary.incomeChangePct >= 0
                  ? 'text-emerald-600 dark:text-emerald-400'
                  : 'text-rose-500'
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
            <span className="text-slate-400 truncate">Eligible earnings & inflows</span>
          )}
          <span className="text-[11px] text-slate-400">
            {summary.transactionCount} transactions
          </span>
        </div>
      </div>

      {/* 2. Total Expenses */}
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
            {analyticsService.formatINR(summary.totalExpenses)}
          </span>
        </div>

        <div className="pt-2 border-t border-slate-100/60 dark:border-white/5 flex items-center justify-between text-xs">
          {showComparison && summary.prevExpenses > 0 ? (
            <span
              className={`flex items-center gap-0.5 font-semibold ${
                summary.expenseChangePct <= 0
                  ? 'text-emerald-600 dark:text-emerald-400'
                  : 'text-rose-500'
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
            <span className="text-slate-400 truncate">Discretionary & core outflows</span>
          )}
          <span className="text-[11px] text-slate-400">Excludes transfers</span>
        </div>
      </div>

      {/* 3. Net Cash Flow */}
      <div className="glass-card-interactive p-5 rounded-2xl flex flex-col justify-between group">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Net Cash Flow
          </span>
          <div
            className={`w-9 h-9 rounded-xl flex items-center justify-center ${
              isNetPositive
                ? 'bg-spendx-blue-primary/10 text-spendx-blue-primary'
                : 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
            }`}
          >
            <Scale className="w-4 h-4" />
          </div>
        </div>

        <div className="mt-3 mb-1">
          <span
            className={`text-2xl sm:text-3xl font-bold tracking-tight tabular-nums ${
              isNetPositive
                ? 'text-spendx-indigo dark:text-spendx-soft-purple'
                : 'text-amber-600 dark:text-amber-400'
            }`}
          >
            {isNetPositive ? '+' : ''}
            {analyticsService.formatINR(summary.netCashFlow)}
          </span>
        </div>

        <div className="pt-2 border-t border-slate-100/60 dark:border-white/5 flex items-center justify-between text-xs">
          {showComparison && summary.prevIncome > 0 ? (
            <span
              className={`flex items-center gap-0.5 font-semibold ${
                summary.cashFlowChangePct >= 0
                  ? 'text-emerald-600 dark:text-emerald-400'
                  : 'text-rose-500'
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
            <span className="text-slate-400 truncate">
              {isNetPositive ? 'Surplus retained' : 'Deficit incurred'}
            </span>
          )}
          <span className="text-[11px] text-slate-400">Income minus expenses</span>
        </div>
      </div>

      {/* 4. Savings Rate */}
      <div className="glass-card-interactive p-5 rounded-2xl flex flex-col justify-between group">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Savings Rate
          </span>
          <div className="w-9 h-9 rounded-xl bg-spendx-purple-primary/10 text-spendx-purple-primary flex items-center justify-center">
            <PiggyBank className="w-4 h-4" />
          </div>
        </div>

        <div className="mt-3 mb-1">
          <span className="text-2xl sm:text-3xl font-bold tracking-tight text-spendx-purple-primary tabular-nums">
            {summary.savingsRate}%
          </span>
        </div>

        <div className="pt-2 border-t border-slate-100/60 dark:border-white/5 flex items-center justify-between text-xs">
          {showComparison && summary.prevSavingsRate > 0 ? (
            <span
              className={`flex items-center gap-0.5 font-semibold ${
                summary.savingsRate >= summary.prevSavingsRate
                  ? 'text-emerald-600 dark:text-emerald-400'
                  : 'text-rose-500'
              }`}
            >
              {summary.savingsRate >= summary.prevSavingsRate ? '+' : ''}
              {(summary.savingsRate - summary.prevSavingsRate).toFixed(1)}% pts
            </span>
          ) : (
            <span className="text-slate-400 truncate">
              {summary.savingsRate >= 20 ? 'Optimal discipline' : 'Target: 20%+'}
            </span>
          )}
          <span className="text-[11px] text-slate-400">Of gross earnings</span>
        </div>
      </div>
    </div>
  );
};
