import React from 'react';
import { Bell, CheckCircle2, AlertCircle, Info } from 'lucide-react';
import { RoutePlaceholder } from '@/components/common/RoutePlaceholder';

const notificationsList = [
  {
    id: '1',
    title: 'Salary Deposit Reconciled',
    time: '2 hours ago',
    description: 'Direct deposit of ₹45,000 from Employer reconciled with checking account.',
    icon: CheckCircle2,
    color: 'text-emerald-500 bg-emerald-500/10',
    unread: true,
  },
  {
    id: '2',
    title: 'Dining Category Warning (88%)',
    time: 'Yesterday',
    description: 'Food & Dining outlays have approached your safety threshold.',
    icon: AlertCircle,
    color: 'text-amber-500 bg-amber-500/10',
    unread: true,
  },
  {
    id: '3',
    title: 'Monthly Statement Available',
    time: '3 days ago',
    description: 'October 2026 financial report is ready for download.',
    icon: Info,
    color: 'text-primary bg-primary/10',
    unread: false,
  },
];

export const NotificationsPage: React.FC = () => {
  return (
    <RoutePlaceholder
      title="System Notifications & Alerts"
      description="Real-time financial telemetry notices, synchronization updates, and threshold warnings."
      routeId="/notifications"
      icon={Bell}
      badge="Personal"
    >
      <div className="glass-panel rounded-3xl p-5 border border-white/80 dark:border-white/15 shadow-xl space-y-3">
        <div className="flex items-center justify-between pb-3 border-b border-black/5 dark:border-white/10 text-xs text-muted-foreground font-semibold">
          <span>Unread Notices (2)</span>
          <button className="text-primary hover:underline cursor-pointer">Mark all as read</button>
        </div>

        <div className="space-y-2.5">
          {notificationsList.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.id}
                className={`rounded-2xl p-4 border transition-colors flex items-start gap-3.5 ${
                  item.unread
                    ? 'bg-white/60 dark:bg-white/10 border-primary/30'
                    : 'bg-white/30 dark:bg-white/5 border-white/60 dark:border-white/10 opacity-75'
                }`}
              >
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${item.color}`}>
                  <Icon className="w-4 h-4" />
                </div>
                <div className="flex-1 space-y-0.5">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-bold text-foreground">{item.title}</h4>
                    <span className="text-[10px] text-muted-foreground font-mono">{item.time}</span>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </RoutePlaceholder>
  );
};
