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
      <div className="glass-panel rounded-3xl p-5 sm:p-6 border border-white/80 dark:border-white/15 shadow-xl space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-black/5 dark:border-white/10 text-xs text-muted-foreground font-semibold">
          <span className="flex items-center gap-2">
            <span>Unread Notices</span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-primary/10 text-primary">
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
                className="text-muted-foreground hover:text-foreground text-[11px] font-medium cursor-pointer transition-colors"
              >
                Clear all
              </button>
            )}
          </div>
        </div>

        <div className="space-y-3">
          {notifications.length === 0 ? (
            <div className="py-12 text-center text-muted-foreground space-y-2">
              <CheckCheck className="w-10 h-10 mx-auto text-emerald-500/70" />
              <p className="font-bold text-foreground text-sm">All caught up!</p>
              <p className="text-xs">No active alerts or notifications.</p>
            </div>
          ) : (
            notifications.map((item) => {
              const isSuccess = item.type === 'success';
              const isWarning = item.type === 'warning';
              const Icon = isSuccess ? CheckCircle2 : isWarning ? AlertCircle : Info;
              const colorClass = isSuccess
                ? 'text-emerald-500 bg-emerald-500/10'
                : isWarning
                ? 'text-amber-500 bg-amber-500/10'
                : 'text-primary bg-primary/10';

              return (
                <div
                  key={item.id}
                  onClick={() => markAsRead(item.id)}
                  className={`rounded-2xl p-4 sm:p-5 border transition-all cursor-pointer flex items-start gap-4 ${
                    item.unread
                      ? 'bg-white/80 dark:bg-white/10 border-primary/40 shadow-sm'
                      : 'bg-white/40 dark:bg-white/5 border-white/60 dark:border-white/10 opacity-75 hover:opacity-100'
                  }`}
                >
                  <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 ${colorClass}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1 space-y-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <h4 className={`text-sm font-bold truncate ${item.unread ? 'text-foreground' : 'text-foreground/80'}`}>
                        {item.title}
                      </h4>
                      <span className="text-[11px] text-muted-foreground font-mono shrink-0">{item.time}</span>
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed">
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
