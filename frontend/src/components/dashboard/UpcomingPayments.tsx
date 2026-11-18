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
    <div className="bg-surface p-5 sm:p-6 rounded-[20px] border border-border shadow-card flex flex-col justify-between h-full">
      {/* Header */}
      <div className="flex items-center justify-between gap-2 mb-4">
        <div>
          <h2 className="text-base sm:text-lg font-display font-bold text-foreground">
            Upcoming Payments
          </h2>
          <p className="text-xs text-secondary-text mt-0.5">
            Stay prepared for your regular recurring expenses.
          </p>
        </div>

        <Link
          to="/recurring"
          className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:text-primary-hover transition-colors cursor-pointer group"
        >
          View Recurring
          <ArrowUpRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </Link>
      </div>

      {payments.length === 0 ? (
        <div className="py-8 text-center text-xs text-secondary-text">
          No upcoming scheduled payments for this period.
        </div>
      ) : (
        <div className="space-y-3 my-auto">
          {payments.map((payment) => (
            <div
              key={payment.id}
              className="p-3.5 rounded-xl bg-surface-elevated border border-border flex items-center justify-between gap-3 hover:border-primary/40 transition-all shadow-xs"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-full bg-warning/10 text-warning flex items-center justify-center shrink-0 shadow-xs">
                  {getIcon(payment.iconName)}
                </div>
                <div className="min-w-0">
                  <h3 className="font-semibold text-sm text-foreground truncate">
                    {payment.name}
                  </h3>
                  <div className="flex items-center gap-1 text-xs text-secondary-text mt-0.5">
                    <Clock className="w-3 h-3 text-muted-foreground" />
                    <span>{payment.dueDate}</span>
                    <span className="text-[11px] text-warning font-medium ml-1">
                      ({payment.dueDay})
                    </span>
                  </div>
                </div>
              </div>

              <div className="text-right shrink-0">
                <span className="font-bold text-sm text-foreground tabular-nums">
                  {dashboardService.formatINR(payment.amount)}
                </span>
                <span className="block text-[10px] text-muted-foreground">Autopay active</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
