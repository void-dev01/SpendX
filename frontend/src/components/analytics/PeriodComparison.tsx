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
      <div className="rounded-2xl bg-surface border border-border p-6 space-y-2 shadow-card">
        <h2 className="text-base font-bold font-display text-foreground flex items-center gap-2">
          <ArrowRightLeft className="w-4 h-4 text-secondary" />
          <span>Period Comparison</span>
        </h2>
        <p className="text-xs text-secondary-text">
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
    <div className="rounded-2xl bg-surface border border-border p-6 space-y-4 shadow-card">
      <div>
        <h2 className="text-base font-bold font-display text-foreground flex items-center gap-2">
          <ArrowRightLeft className="w-4 h-4 text-secondary" />
          <span>Period-over-Period Performance</span>
        </h2>
        <p className="text-xs text-secondary-text mt-0.5">
          Direct comparative analysis against the preceding equivalent time interval
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {/* Income Change */}
        <div className="p-4 rounded-xl bg-surface-elevated border border-border space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold text-secondary-text">
            <span>Income Change</span>
            <TrendingUp className="w-4 h-4 text-income" />
          </div>
          <div className="flex items-baseline justify-between">
            <span
              className={`text-lg font-bold font-display tabular-nums ${
                incomeDelta >= 0 ? 'text-income' : 'text-destructive'
              }`}
            >
              {incomeDelta >= 0 ? '+' : ''}
              {analyticsService.formatINR(incomeDelta)}
            </span>
            <span
              className={`flex items-center text-xs font-semibold ${
                summary.incomeChangePct >= 0 ? 'text-income' : 'text-destructive'
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
          <span className="text-[10px] text-muted-foreground block tabular-nums">
            Prior: {analyticsService.formatINR(summary.prevIncome)}
          </span>
        </div>

        {/* Expense Change */}
        <div className="p-4 rounded-xl bg-surface-elevated border border-border space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold text-secondary-text">
            <span>Expense Change</span>
            <TrendingDown className="w-4 h-4 text-destructive" />
          </div>
          <div className="flex items-baseline justify-between">
            <span
              className={`text-lg font-bold font-display tabular-nums ${
                expenseDelta <= 0 ? 'text-income' : 'text-destructive'
              }`}
            >
              {expenseDelta >= 0 ? '+' : ''}
              {analyticsService.formatINR(expenseDelta)}
            </span>
            <span
              className={`flex items-center text-xs font-semibold ${
                summary.expenseChangePct <= 0 ? 'text-income' : 'text-destructive'
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
          <span className="text-[10px] text-muted-foreground block tabular-nums">
            Prior: {analyticsService.formatINR(summary.prevExpenses)}
          </span>
        </div>

        {/* Net Flow Change */}
        <div className="p-4 rounded-xl bg-surface-elevated border border-border space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold text-secondary-text">
            <span>Net Flow Shift</span>
            <Scale className="w-4 h-4 text-primary" />
          </div>
          <div className="flex items-baseline justify-between">
            <span
              className={`text-lg font-bold font-display tabular-nums ${
                netDelta >= 0
                  ? 'text-primary'
                  : 'text-destructive'
              }`}
            >
              {netDelta >= 0 ? '+' : ''}
              {analyticsService.formatINR(netDelta)}
            </span>
            <span
              className={`flex items-center text-xs font-semibold ${
                summary.cashFlowChangePct >= 0 ? 'text-income' : 'text-destructive'
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
          <span className="text-[10px] text-muted-foreground block tabular-nums">
            Prior: {analyticsService.formatINR(summary.prevNetCashFlow)}
          </span>
        </div>

        {/* Savings Rate Shift */}
        <div className="p-4 rounded-xl bg-surface-elevated border border-border space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold text-secondary-text">
            <span>Savings Rate Shift</span>
            <PiggyBank className="w-4 h-4 text-secondary" />
          </div>
          <div className="flex items-baseline justify-between">
            <span
              className={`text-lg font-bold font-display tabular-nums ${
                savingsRateDelta >= 0 ? 'text-income' : 'text-destructive'
              }`}
            >
              {savingsRateDelta >= 0 ? '+' : ''}
              {savingsRateDelta.toFixed(1)}% pts
            </span>
            <span className="text-xs font-semibold text-secondary tabular-nums">
              {summary.savingsRate}% now
            </span>
          </div>
          <span className="text-[10px] text-muted-foreground block tabular-nums">
            Prior rate: {summary.prevSavingsRate}%
          </span>
        </div>
      </div>
    </div>
  );
};
