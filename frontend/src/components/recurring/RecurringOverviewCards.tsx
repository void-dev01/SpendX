import React from 'react';
import { ArrowsClockwise, CalendarBlank, CheckCircle, ShieldCheck } from '@phosphor-icons/react';
import { RecurringOverviewMetrics, recurringService } from '@/services/recurringService';

interface RecurringOverviewCardsProps {
  metrics: RecurringOverviewMetrics;
}

export const RecurringOverviewCards: React.FC<RecurringOverviewCardsProps> = ({ metrics }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* 1. Monthly Recurring Total */}
      <div className="bg-surface rounded-2xl border border-border p-5 shadow-card hover:shadow-elevated transition-all flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Monthly Commitment
          </span>
          <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
            <ArrowsClockwise weight="duotone" className="w-5 h-5" />
          </div>
        </div>
        <div className="mt-3 mb-1">
          <span className="text-2xl sm:text-3xl font-display font-bold tracking-tight text-foreground tabular-nums">
            {recurringService.formatINR(metrics.monthlyRecurringTotal)}
          </span>
        </div>
        <div className="text-xs text-secondary-text pt-2 border-t border-border truncate">
          Total monthly fixed liabilities
        </div>
      </div>

      {/* 2. Upcoming Payments */}
      <div className="bg-surface rounded-2xl border border-border p-5 shadow-card hover:shadow-elevated transition-all flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Upcoming Payments
          </span>
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center">
            <CalendarBlank weight="duotone" className="w-5 h-5" />
          </div>
        </div>
        <div className="mt-3 mb-1 flex items-baseline gap-2">
          <span className="text-2xl sm:text-3xl font-display font-bold tracking-tight text-amber-500 tabular-nums">
            {metrics.upcomingPaymentsCount}
          </span>
          <span className="text-xs text-secondary-text">pending debits</span>
        </div>
        <div className="text-xs text-secondary-text pt-2 border-t border-border truncate">
          Scheduled for the next 30 days
        </div>
      </div>

      {/* 3. Paid This Month */}
      <div className="bg-surface rounded-2xl border border-border p-5 shadow-card hover:shadow-elevated transition-all flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Paid This Month
          </span>
          <div className="w-10 h-10 rounded-xl bg-income/10 text-income flex items-center justify-center">
            <CheckCircle weight="duotone" className="w-5 h-5" />
          </div>
        </div>
        <div className="mt-3 mb-1">
          <span className="text-2xl sm:text-3xl font-display font-bold tracking-tight text-income tabular-nums">
            {recurringService.formatINR(metrics.paidThisMonthAmount)}
          </span>
        </div>
        <div className="text-xs text-secondary-text pt-2 border-t border-border truncate">
          Successfully processed this cycle
        </div>
      </div>

      {/* 4. Active Subscriptions */}
      <div className="bg-surface rounded-2xl border border-border p-5 shadow-card hover:shadow-elevated transition-all flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Active Schedules
          </span>
          <div className="w-10 h-10 rounded-xl bg-income/10 text-income flex items-center justify-center">
            <ShieldCheck weight="duotone" className="w-5 h-5" />
          </div>
        </div>
        <div className="mt-3 mb-1 flex items-baseline gap-2">
          <span className="text-2xl sm:text-3xl font-display font-bold tracking-tight text-income tabular-nums">
            {metrics.activeSubscriptionsCount}
          </span>
          <span className="text-xs text-secondary-text">active services</span>
        </div>
        <div className="text-xs text-secondary-text pt-2 border-t border-border truncate">
          Monitored recurring obligations
        </div>
      </div>
    </div>
  );
};
