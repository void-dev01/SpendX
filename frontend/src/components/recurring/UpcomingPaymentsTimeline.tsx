import React from 'react';
import { Clock, AlertTriangle, CalendarCheck, CheckCircle2 } from 'lucide-react';
import { RecurringRecord, recurringService } from '@/services/recurringService';

interface UpcomingPaymentsTimelineProps {
  payments: RecurringRecord[];
  onSelectPayment: (payment: RecurringRecord) => void;
  onMarkAsPaid: (id: string) => void;
}

export const UpcomingPaymentsTimeline: React.FC<UpcomingPaymentsTimelineProps> = ({
  payments,
  onSelectPayment,
  onMarkAsPaid,
}) => {
  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  const endOfToday = startOfToday + 24 * 60 * 60 * 1000 - 1;
  const in7Days = startOfToday + 7 * 24 * 60 * 60 * 1000;

  const overdueList: RecurringRecord[] = [];
  const todayList: RecurringRecord[] = [];
  const thisWeekList: RecurringRecord[] = [];
  const laterList: RecurringRecord[] = [];

  payments.forEach((p) => {
    if (p.status === 'PAID' || p.status === 'PAUSED') return;
    const dueTime = new Date(p.nextDueDate).getTime();

    if (p.status === 'OVERDUE' || dueTime < startOfToday) {
      overdueList.push(p);
    } else if (p.status === 'DUE_TODAY' || (dueTime >= startOfToday && dueTime <= endOfToday)) {
      todayList.push(p);
    } else if (dueTime > endOfToday && dueTime <= in7Days) {
      thisWeekList.push(p);
    } else {
      laterList.push(p);
    }
  });

  const renderSection = (
    title: string,
    items: RecurringRecord[],
    badgeColor: string,
    icon: React.ReactNode
  ) => {
    if (items.length === 0) return null;

    return (
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          {icon}
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300">
            {title} ({items.length})
          </h4>
        </div>

        <div className="space-y-2">
          {items.map((item) => (
            <div
              key={item.id}
              onClick={() => onSelectPayment(item)}
              className="p-3.5 rounded-2xl bg-white/50 dark:bg-slate-900/40 border border-slate-200/80 dark:border-white/10 hover:border-spendx-blue-primary/40 transition-all flex items-center justify-between cursor-pointer group"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div
                  className={`w-2 h-10 rounded-full shrink-0 ${badgeColor}`}
                />
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-bold text-spendx-text-primary dark:text-spendx-soft-purple group-hover:text-spendx-blue-primary transition-colors truncate">
                      {item.name}
                    </p>
                    <span className="text-[10px] px-2 py-0.5 rounded-md bg-slate-100 dark:bg-white/10 text-slate-500 font-medium shrink-0">
                      {item.category}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 truncate mt-0.5">
                    {item.merchant} • Due:{' '}
                    {new Date(item.nextDueDate).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'short',
                    })}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <div className="text-right">
                  <p className="text-sm font-bold text-spendx-indigo dark:text-spendx-soft-purple tabular-nums">
                    {recurringService.formatINR(item.amount)}
                  </p>
                  <p className="text-[10px] text-slate-400 capitalize">
                    {item.frequency.toLowerCase()}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onMarkAsPaid(item.id);
                  }}
                  aria-label={`Mark ${item.name} as paid`}
                  className="p-1.5 rounded-xl text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 transition-all"
                  title="Mark as Paid"
                >
                  <CheckCircle2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const hasAnyUpcoming =
    overdueList.length > 0 ||
    todayList.length > 0 ||
    thisWeekList.length > 0 ||
    laterList.length > 0;

  if (!hasAnyUpcoming) {
    return (
      <div className="glass-card p-6 rounded-3xl border border-slate-200/60 dark:border-white/10 text-center py-8">
        <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
        <h4 className="text-sm font-bold text-spendx-text-primary dark:text-spendx-soft-purple">
          All caught up!
        </h4>
        <p className="text-xs text-slate-400 mt-1">
          No pending recurring payments due in the current billing cycle.
        </p>
      </div>
    );
  }

  return (
    <div className="glass-card p-6 rounded-3xl border border-slate-200/60 dark:border-white/10 space-y-5">
      <div>
        <h3 className="text-base font-bold text-spendx-text-primary dark:text-spendx-soft-purple">
          Upcoming Schedule Timeline
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Prioritized sequence of upcoming liability debits
        </p>
      </div>

      <div className="space-y-5">
        {renderSection(
          'Overdue Bills',
          overdueList,
          'bg-rose-500',
          <AlertTriangle className="w-4 h-4 text-rose-500" />
        )}
        {renderSection(
          'Due Today',
          todayList,
          'bg-amber-500',
          <Clock className="w-4 h-4 text-amber-500 animate-pulse" />
        )}
        {renderSection(
          'Next 7 Days',
          thisWeekList,
          'bg-spendx-blue-primary',
          <CalendarCheck className="w-4 h-4 text-spendx-blue-primary" />
        )}
        {renderSection(
          'Later This Month',
          laterList,
          'bg-slate-400',
          <Clock className="w-4 h-4 text-slate-400" />
        )}
      </div>
    </div>
  );
};
