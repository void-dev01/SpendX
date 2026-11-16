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
      <div className="glass-card-interactive p-5 rounded-2xl flex flex-col justify-between group">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Monthly Commitment
          </span>
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 flex items-center justify-center">
            <ArrowsClockwise weight="duotone" className="w-5 h-5" />
          </div>
        </div>
        <div className="mt-3 mb-1">
          <span className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground tabular-nums">
            {recurringService.formatINR(metrics.monthlyRecurringTotal)}
          </span>
        </div>
        <div className="text-xs text-muted-foreground pt-2 border-t border-black/5 dark:border-white/5 truncate">
          Total monthly fixed liabilities
        </div>
      </div>

      {/* 2. Upcoming Payments */}
      <div className="glass-card-interactive p-5 rounded-2xl flex flex-col justify-between group">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Upcoming Payments
          </span>
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-500 border border-amber-500/20 flex items-center justify-center">
            <CalendarBlank weight="duotone" className="w-5 h-5" />
          </div>
        </div>
        <div className="mt-3 mb-1 flex items-baseline gap-2">
          <span className="text-2xl sm:text-3xl font-bold tracking-tight text-amber-600 dark:text-amber-400 tabular-nums">
            {metrics.upcomingPaymentsCount}
          </span>
          <span className="text-xs text-muted-foreground">pending debits</span>
        </div>
        <div className="text-xs text-muted-foreground pt-2 border-t border-black/5 dark:border-white/5 truncate">
          Scheduled for the next 30 days
        </div>
      </div>

      {/* 3. Paid This Month */}
      <div className="glass-card-interactive p-5 rounded-2xl flex flex-col justify-between group">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Paid This Month
          </span>
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 flex items-center justify-center">
            <CheckCircle weight="duotone" className="w-5 h-5" />
          </div>
        </div>
        <div className="mt-3 mb-1">
          <span className="text-2xl sm:text-3xl font-bold tracking-tight text-emerald-600 dark:text-emerald-400 tabular-nums">
            {recurringService.formatINR(metrics.paidThisMonthAmount)}
          </span>
        </div>
        <div className="text-xs text-muted-foreground pt-2 border-t border-black/5 dark:border-white/5 truncate">
          Successfully processed this cycle
        </div>
      </div>

      {/* 4. Active Subscriptions */}
      <div className="glass-card-interactive p-5 rounded-2xl flex flex-col justify-between group">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Active Schedules
          </span>
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 flex items-center justify-center">
            <ShieldCheck weight="duotone" className="w-5 h-5" />
          </div>
        </div>
        <div className="mt-3 mb-1 flex items-baseline gap-2">
          <span className="text-2xl sm:text-3xl font-bold tracking-tight text-emerald-600 dark:text-emerald-400 tabular-nums">
            {metrics.activeSubscriptionsCount}
          </span>
          <span className="text-xs text-muted-foreground">active services</span>
        </div>
        <div className="text-xs text-muted-foreground pt-2 border-t border-black/5 dark:border-white/5 truncate">
          Monitored recurring obligations
        </div>
      </div>
    </div>
  );
};
