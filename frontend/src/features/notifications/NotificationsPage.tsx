import React from 'react';
import { Bell, CheckCircle2, AlertCircle, Info, CheckCheck } from 'lucide-react';
import { RoutePlaceholder } from '@/components/common/RoutePlaceholder';
import { useNotificationStore } from '@/stores/notificationStore';

export const NotificationsPage: React.FC = () => {
  const { notifications, unreadCount, markAsRead, markAllAsRead, clearAll } =
    useNotificationStore();

  return (
    <RoutePlaceholder
      title="System Notifications & Alerts"
      description="Real-time financial telemetry notices, synchronization updates, and threshold warnings."
      routeId="/notifications"
      icon={Bell}
      badge="Personal"
    >
      <div className="rounded-2xl bg-surface border border-border p-5 sm:p-6 shadow-card space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-border text-xs text-secondary-text font-semibold">
          <span className="flex items-center gap-2">
            <span>Unread Notices</span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-primary/10 text-primary border border-primary/20 tabular-nums">
              {unreadCount}
            </span>
          </span>
          <div className="flex items-center gap-4">
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="text-primary hover:underline font-bold cursor-pointer transition-colors"
              >
                Mark all as read
              </button>
            )}
            {notifications.length > 0 && (
              <button
                onClick={clearAll}
                className="text-secondary-text hover:text-foreground text-[11px] font-medium cursor-pointer transition-colors"
              >
                Clear all
              </button>
            )}
          </div>
        </div>

        <div className="space-y-3">
          {notifications.length === 0 ? (
            <div className="py-12 text-center text-muted-foreground space-y-2">
              <CheckCheck className="w-10 h-10 mx-auto text-income" />
              <p className="font-bold font-display text-foreground text-sm">All caught up!</p>
              <p className="text-xs">No active alerts or notifications.</p>
            </div>
          ) : (
            notifications.map((item) => {
              const isSuccess = item.type === 'success';
              const isWarning = item.type === 'warning';
              const Icon = isSuccess ? CheckCircle2 : isWarning ? AlertCircle : Info;
              const colorClass = isSuccess
                ? 'text-income bg-income/10'
                : isWarning
                ? 'text-amber-500 bg-amber-500/10'
                : 'text-primary bg-primary/10';

              return (
                <div
                  key={item.id}
                  onClick={() => markAsRead(item.id)}
                  className={`rounded-xl p-4 sm:p-5 border transition-all cursor-pointer flex items-start gap-4 ${
                    item.unread
                      ? 'bg-surface-elevated border-primary/40 shadow-xs'
                      : 'bg-surface border-border opacity-75 hover:opacity-100'
                  }`}
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${colorClass}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1 space-y-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <h4 className={`text-sm font-bold font-display truncate ${item.unread ? 'text-foreground' : 'text-foreground/80'}`}>
                        {item.title}
                      </h4>
                      <span className="text-[11px] text-muted-foreground font-mono shrink-0">{item.time}</span>
                    </div>
                    <p className="text-xs text-secondary-text leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </RoutePlaceholder>
  );
};
