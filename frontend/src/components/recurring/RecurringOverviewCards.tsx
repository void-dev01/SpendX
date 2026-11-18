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
      <div className="bg-surface rounded-[20px] border border-border p-5 sm:p-6 shadow-card hover:shadow-elevated transition-all flex items-center gap-4 group">
        <div className="w-14 h-14 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0 shadow-xs group-hover:scale-105 transition-transform">
          <ArrowsClockwise weight="duotone" className="w-7 h-7" />
        </div>
        <div className="min-w-0 flex-1">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block truncate">
            Monthly Commitment
          </span>
          <div className="my-0.5">
            <span className="text-2xl sm:text-3xl font-display font-bold tracking-tight text-foreground tabular-nums truncate block">
              {recurringService.formatINR(metrics.monthlyRecurringTotal)}
            </span>
          </div>
          <div className="text-xs text-secondary-text truncate">
            Total monthly fixed liabilities
          </div>
        </div>
      </div>

      {/* 2. Upcoming Payments */}
      <div className="bg-surface rounded-[20px] border border-border p-5 sm:p-6 shadow-card hover:shadow-elevated transition-all flex items-center gap-4 group">
        <div className="w-14 h-14 rounded-full bg-warning/10 text-warning flex items-center justify-center shrink-0 shadow-xs group-hover:scale-105 transition-transform">
          <CalendarBlank weight="duotone" className="w-7 h-7" />
        </div>
        <div className="min-w-0 flex-1">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block truncate">
            Upcoming Payments
          </span>
          <div className="my-0.5 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-display font-bold tracking-tight text-warning tabular-nums">
              {metrics.upcomingPaymentsCount}
            </span>
            <span className="text-xs text-secondary-text">pending debits</span>
          </div>
          <div className="text-xs text-secondary-text truncate">
            Scheduled for next 30 days
          </div>
        </div>
      </div>

      {/* 3. Paid This Month */}
      <div className="bg-surface rounded-[20px] border border-border p-5 sm:p-6 shadow-card hover:shadow-elevated transition-all flex items-center gap-4 group">
        <div className="w-14 h-14 rounded-full bg-income/10 text-income flex items-center justify-center shrink-0 shadow-xs group-hover:scale-105 transition-transform">
          <CheckCircle weight="duotone" className="w-7 h-7" />
        </div>
        <div className="min-w-0 flex-1">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block truncate">
            Paid This Month
          </span>
          <div className="my-0.5">
            <span className="text-2xl sm:text-3xl font-display font-bold tracking-tight text-income tabular-nums truncate block">
              {recurringService.formatINR(metrics.paidThisMonthAmount)}
            </span>
          </div>
          <div className="text-xs text-secondary-text truncate">
            Successfully processed this cycle
          </div>
        </div>
      </div>

      {/* 4. Active Subscriptions */}
      <div className="bg-surface rounded-[20px] border border-border p-5 sm:p-6 shadow-card hover:shadow-elevated transition-all flex items-center gap-4 group">
        <div className="w-14 h-14 rounded-full bg-secondary/10 text-secondary flex items-center justify-center shrink-0 shadow-xs group-hover:scale-105 transition-transform">
          <ShieldCheck weight="duotone" className="w-7 h-7" />
        </div>
        <div className="min-w-0 flex-1">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block truncate">
            Active Schedules
          </span>
          <div className="my-0.5 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-display font-bold tracking-tight text-secondary tabular-nums">
              {metrics.activeSubscriptionsCount}
            </span>
            <span className="text-xs text-secondary-text">active services</span>
          </div>
          <div className="text-xs text-secondary-text truncate">
            Monitored obligations
          </div>
        </div>
      </div>
    </div>
  );
};
