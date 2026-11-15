import React from 'react';
import { Repeat, Calendar, CheckCircle2 } from 'lucide-react';
import { RoutePlaceholder } from '@/components/common/RoutePlaceholder';

const recurringList = [
  { name: 'Netflix Premium 4K', amount: '₹649', cycle: 'Monthly', nextDate: 'Nov 24, 2026', category: 'Entertainment' },
  { name: 'Google Cloud Platform', amount: '₹1,240', cycle: 'Monthly', nextDate: 'Nov 28, 2026', category: 'Infrastructure' },
  { name: 'Spotify Family Duo', amount: '₹179', cycle: 'Monthly', nextDate: 'Dec 02, 2026', category: 'Music' },
  { name: 'Residential Broadband', amount: '₹899', cycle: 'Monthly', nextDate: 'Dec 05, 2026', category: 'Utilities' },
];

export const RecurringPage: React.FC = () => {
  return (
    <RoutePlaceholder
      title="Recurring Subscriptions & Charges"
      description="Track monthly liabilities, scheduled direct debits, and software subscriptions."
      routeId="/recurring"
      icon={Repeat}
      badge="Money Management"
    >
      <div className="space-y-4">
        <div className="glass-panel rounded-3xl p-5 border border-white/80 dark:border-white/15 shadow-xl space-y-3">
          <div className="flex items-center justify-between pb-3 border-b border-black/5 dark:border-white/10 text-xs text-muted-foreground font-semibold">
            <span>Active Direct Debits (4 Services)</span>
            <span className="text-primary font-mono">Monthly Commitment: ₹2,967.00</span>
          </div>

          <div className="space-y-2.5">
            {recurringList.map((item) => (
              <div
                key={item.name}
                className="rounded-2xl bg-white/40 dark:bg-white/5 p-4 border border-white/60 dark:border-white/10 flex items-center justify-between"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-bold text-foreground">{item.name}</p>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-primary/10 text-primary font-medium">
                      {item.category}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Next charge: {item.nextDate} ({item.cycle})</span>
                  </div>
                </div>

                <div className="text-right">
                  <p className="text-base font-bold text-foreground tabular-nums">{item.amount}</p>
                  <span className="inline-flex items-center gap-1 text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
                    <CheckCircle2 className="w-3 h-3" /> Scheduled
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </RoutePlaceholder>
  );
};
