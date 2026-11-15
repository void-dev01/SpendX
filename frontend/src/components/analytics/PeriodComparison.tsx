import React from 'react';
import {
  ArrowRightLeft,
  ArrowUpRight,
  ArrowDownRight,
  TrendingUp,
  TrendingDown,
  Scale,
  PiggyBank,
} from 'lucide-react';
import {
  AnalyticsSummaryMetrics,
  analyticsService,
} from '@/services/analyticsService';

interface PeriodComparisonProps {
  summary: AnalyticsSummaryMetrics;
}

export const PeriodComparison: React.FC<PeriodComparisonProps> = ({ summary }) => {
  if (summary.prevIncome === 0 && summary.prevExpenses === 0) {
    return (
      <div className="glass-panel p-6 rounded-3xl space-y-2">
        <h2 className="text-base font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
          <ArrowRightLeft className="w-4 h-4 text-spendx-purple-primary" />
          <span>Period Comparison</span>
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Prior equivalent period records are currently empty. Historical metrics will populate as more timeline data accumulates.
        </p>
      </div>
    );
  }

  const incomeDelta = summary.totalIncome - summary.prevIncome;
  const expenseDelta = summary.totalExpenses - summary.prevExpenses;
  const netDelta = summary.netCashFlow - summary.prevNetCashFlow;
  const savingsRateDelta = summary.savingsRate - summary.prevSavingsRate;

  return (
    <div className="glass-panel p-6 rounded-3xl space-y-4">
      <div>
        <h2 className="text-base font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
          <ArrowRightLeft className="w-4 h-4 text-spendx-purple-primary" />
          <span>Period-over-Period Performance</span>
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          Direct comparative analysis against the preceding equivalent time interval
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {/* Income Change */}
        <div className="p-4 rounded-2xl glass-surface border border-white/60 dark:border-white/5 space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
            <span>Income Change</span>
            <TrendingUp className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="flex items-baseline justify-between">
            <span
              className={`text-lg font-bold tabular-nums ${
                incomeDelta >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-500'
              }`}
            >
              {incomeDelta >= 0 ? '+' : ''}
              {analyticsService.formatINR(incomeDelta)}
            </span>
            <span
              className={`flex items-center text-xs font-semibold ${
                summary.incomeChangePct >= 0 ? 'text-emerald-600' : 'text-rose-500'
              }`}
            >
              {summary.incomeChangePct >= 0 ? (
                <ArrowUpRight className="w-3.5 h-3.5" />
              ) : (
                <ArrowDownRight className="w-3.5 h-3.5" />
              )}
              {Math.abs(summary.incomeChangePct)}%
            </span>
          </div>
          <span className="text-[10px] text-slate-400 block">
            Prior: {analyticsService.formatINR(summary.prevIncome)}
          </span>
        </div>

        {/* Expense Change */}
        <div className="p-4 rounded-2xl glass-surface border border-white/60 dark:border-white/5 space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
            <span>Expense Change</span>
            <TrendingDown className="w-4 h-4 text-rose-500" />
          </div>
          <div className="flex items-baseline justify-between">
            <span
              className={`text-lg font-bold tabular-nums ${
                expenseDelta <= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-500'
              }`}
            >
              {expenseDelta >= 0 ? '+' : ''}
              {analyticsService.formatINR(expenseDelta)}
            </span>
            <span
              className={`flex items-center text-xs font-semibold ${
                summary.expenseChangePct <= 0 ? 'text-emerald-600' : 'text-rose-500'
              }`}
            >
              {summary.expenseChangePct >= 0 ? (
                <ArrowUpRight className="w-3.5 h-3.5" />
              ) : (
                <ArrowDownRight className="w-3.5 h-3.5" />
              )}
              {Math.abs(summary.expenseChangePct)}%
            </span>
          </div>
          <span className="text-[10px] text-slate-400 block">
            Prior: {analyticsService.formatINR(summary.prevExpenses)}
          </span>
        </div>

        {/* Net Flow Change */}
        <div className="p-4 rounded-2xl glass-surface border border-white/60 dark:border-white/5 space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
            <span>Net Flow Shift</span>
            <Scale className="w-4 h-4 text-spendx-blue-primary" />
          </div>
          <div className="flex items-baseline justify-between">
            <span
              className={`text-lg font-bold tabular-nums ${
                netDelta >= 0
                  ? 'text-spendx-indigo dark:text-spendx-soft-purple'
                  : 'text-rose-500'
              }`}
            >
              {netDelta >= 0 ? '+' : ''}
              {analyticsService.formatINR(netDelta)}
            </span>
            <span
              className={`flex items-center text-xs font-semibold ${
                summary.cashFlowChangePct >= 0 ? 'text-emerald-600' : 'text-rose-500'
              }`}
            >
              {summary.cashFlowChangePct >= 0 ? (
                <ArrowUpRight className="w-3.5 h-3.5" />
              ) : (
                <ArrowDownRight className="w-3.5 h-3.5" />
              )}
              {Math.abs(summary.cashFlowChangePct)}%
            </span>
          </div>
          <span className="text-[10px] text-slate-400 block">
            Prior: {analyticsService.formatINR(summary.prevNetCashFlow)}
          </span>
        </div>

        {/* Savings Rate Shift */}
        <div className="p-4 rounded-2xl glass-surface border border-white/60 dark:border-white/5 space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
            <span>Savings Rate Shift</span>
            <PiggyBank className="w-4 h-4 text-spendx-purple-primary" />
          </div>
          <div className="flex items-baseline justify-between">
            <span
              className={`text-lg font-bold tabular-nums ${
                savingsRateDelta >= 0 ? 'text-emerald-600' : 'text-rose-500'
              }`}
            >
              {savingsRateDelta >= 0 ? '+' : ''}
              {savingsRateDelta.toFixed(1)}% pts
            </span>
            <span className="text-xs font-semibold text-spendx-purple-primary">
              {summary.savingsRate}% now
            </span>
          </div>
          <span className="text-[10px] text-slate-400 block">
            Prior rate: {summary.prevSavingsRate}%
          </span>
        </div>
      </div>
    </div>
  );
};
