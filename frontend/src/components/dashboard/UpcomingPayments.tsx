import React from 'react';
import { Wifi, Tv, Zap, Calendar, ArrowUpRight, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { UpcomingPayment, dashboardService } from '@/services/dashboardService';

interface UpcomingPaymentsProps {
  payments: UpcomingPayment[];
}

export const UpcomingPayments: React.FC<UpcomingPaymentsProps> = ({ payments }) => {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Wifi':
        return <Wifi className="w-4 h-4" />;
      case 'Tv':
        return <Tv className="w-4 h-4" />;
      case 'Zap':
        return <Zap className="w-4 h-4" />;
      default:
        return <Calendar className="w-4 h-4" />;
    }
  };

  return (
    <div className="glass-panel p-6 rounded-2xl flex flex-col justify-between h-full">
      {/* Header */}
      <div className="flex items-center justify-between gap-2 mb-4">
        <div>
          <h2 className="text-lg font-bold text-spendx-indigo dark:text-spendx-soft-purple">
            Upcoming Payments
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Stay prepared for your regular recurring expenses.
          </p>
        </div>

        <Link
          to="/recurring"
          className="inline-flex items-center gap-1 text-xs font-semibold text-spendx-blue-primary hover:text-spendx-purple-primary transition-colors cursor-pointer group"
        >
          View Recurring
          <ArrowUpRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </Link>
      </div>

      {payments.length === 0 ? (
        <div className="py-8 text-center text-xs text-slate-400">
          No upcoming scheduled payments for this period.
        </div>
      ) : (
        <div className="space-y-3 my-auto">
          {payments.map((payment) => (
            <div
              key={payment.id}
              className="p-3.5 rounded-xl glass-surface border border-white/60 dark:border-white/5 flex items-center justify-between gap-3 hover:border-spendx-blue-primary/30 transition-all"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
                  {getIcon(payment.iconName)}
                </div>
                <div className="min-w-0">
                  <h3 className="font-semibold text-sm text-slate-800 dark:text-slate-100 truncate">
                    {payment.name}
                  </h3>
                  <div className="flex items-center gap-1 text-xs text-slate-400 mt-0.5">
                    <Clock className="w-3 h-3 text-slate-400" />
                    <span>{payment.dueDate}</span>
                    <span className="text-[11px] text-amber-600 dark:text-amber-400 font-medium ml-1">
                      ({payment.dueDay})
                    </span>
                  </div>
                </div>
              </div>

              <div className="text-right shrink-0">
                <span className="font-bold text-sm text-slate-800 dark:text-slate-100 tabular-nums">
                  {dashboardService.formatINR(payment.amount)}
                </span>
                <span className="block text-[10px] text-slate-400">Autopay active</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
