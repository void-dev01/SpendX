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
      <div className="bg-card dark:bg-[#1B211B] rounded-[22px] border border-border p-6 shadow-xs hover:border-primary/40 hover:shadow-card transition-all flex flex-col justify-between group">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-bold uppercase tracking-wider text-secondary-text truncate block">
            Monthly Commitment
          </span>
          <div className="w-9 h-9 rounded-xl bg-surface-subtle dark:bg-[#242C23] border border-border flex items-center justify-center shrink-0 shadow-xs text-foreground group-hover:scale-105 transition-transform">
            <ArrowsClockwise weight="duotone" className="w-5 h-5 text-primary" />
          </div>
        </div>
        <div>
          <span className="text-2xl sm:text-3xl font-display font-extrabold tracking-tight text-foreground tabular-nums truncate block">
            {recurringService.formatINR(metrics.monthlyRecurringTotal)}
          </span>
          <div className="text-xs text-secondary-text truncate mt-1">
            Total monthly fixed liabilities
          </div>
        </div>
      </div>

      {/* 2. Upcoming Payments */}
      <div className="bg-card dark:bg-[#1B211B] rounded-[22px] border border-border p-6 shadow-xs hover:border-warning/40 hover:shadow-card transition-all flex flex-col justify-between group">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-bold uppercase tracking-wider text-secondary-text truncate block">
            Upcoming Payments
          </span>
          <div className="w-9 h-9 rounded-xl bg-warning/10 text-warning flex items-center justify-center shrink-0 shadow-xs group-hover:scale-105 transition-transform">
            <CalendarBlank weight="duotone" className="w-5 h-5" />
          </div>
        </div>
        <div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-display font-extrabold tracking-tight text-warning tabular-nums">
              {metrics.upcomingPaymentsCount}
            </span>
            <span className="text-xs text-secondary-text font-medium">pending debits</span>
          </div>
          <div className="text-xs text-secondary-text truncate mt-1">
            Scheduled for next 30 days
          </div>
        </div>
      </div>

      {/* 3. Paid This Month */}
      <div className="bg-card dark:bg-[#1B211B] rounded-[22px] border border-border p-6 shadow-xs hover:border-income/40 hover:shadow-card transition-all flex flex-col justify-between group">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-bold uppercase tracking-wider text-secondary-text truncate block">
            Paid This Month
          </span>
          <div className="w-9 h-9 rounded-xl bg-income/10 text-income flex items-center justify-center shrink-0 shadow-xs group-hover:scale-105 transition-transform">
            <CheckCircle weight="duotone" className="w-5 h-5" />
          </div>
        </div>
        <div>
          <span className="text-2xl sm:text-3xl font-display font-extrabold tracking-tight text-income tabular-nums truncate block">
            {recurringService.formatINR(metrics.paidThisMonthAmount)}
          </span>
          <div className="text-xs text-secondary-text truncate mt-1">
            Successfully processed this cycle
          </div>
        </div>
      </div>

      {/* 4. Active Subscriptions */}
      <div className="bg-card dark:bg-[#1B211B] rounded-[22px] border border-border p-6 shadow-xs hover:border-primary/40 hover:shadow-card transition-all flex flex-col justify-between group">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-bold uppercase tracking-wider text-secondary-text truncate block">
            Active Schedules
          </span>
          <div className="w-9 h-9 rounded-xl bg-surface-subtle dark:bg-[#242C23] border border-border text-foreground flex items-center justify-center shrink-0 shadow-xs group-hover:scale-105 transition-transform">
            <ShieldCheck weight="duotone" className="w-5 h-5 text-primary" />
          </div>
        </div>
        <div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-display font-extrabold tracking-tight text-foreground tabular-nums">
              {metrics.activeSubscriptionsCount}
            </span>
            <span className="text-xs text-secondary-text font-medium">active services</span>
          </div>
          <div className="text-xs text-secondary-text truncate mt-1">
            Monitored obligations
          </div>
        </div>
      </div>
    </div>
  );
};
