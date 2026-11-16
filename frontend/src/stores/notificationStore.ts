import { create } from 'zustand';

export interface AppNotification {
  id: string;
  title: string;
  description: string;
  time: string;
  type: 'success' | 'warning' | 'info' | 'error';
  unread: boolean;
  createdAt: number;
}

interface NotificationState {
  notifications: AppNotification[];
  unreadCount: number;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  clearAll: () => void;
  addNotification: (item: Omit<AppNotification, 'id' | 'createdAt' | 'unread'>) => void;
}

const DEFAULT_NOTIFICATIONS: AppNotification[] = [
  {
    id: 'notif-1',
    title: 'Salary Deposit Reconciled',
    time: '2h ago',
    description: 'Direct deposit of ₹45,000 from Employer reconciled with checking account.',
    type: 'success',
    unread: true,
    createdAt: Date.now() - 7200000,
  },
  {
    id: 'notif-2',
    title: 'Dining Budget Warning (88%)',
    time: 'Yesterday',
    description: 'Food & Dining outlays have approached your safety threshold.',
    type: 'warning',
    unread: true,
    createdAt: Date.now() - 86400000,
  },
  {
    id: 'notif-3',
    title: 'Monthly Statement Available',
    time: '3d ago',
    description: 'October 2026 financial report is ready for download.',
    type: 'info',
    unread: false,
    createdAt: Date.now() - 259200000,
  },
];

const STORAGE_KEY = 'spendx_notifications_v1';

const getInitialNotifications = (): AppNotification[] => {
  if (typeof window === 'undefined') return DEFAULT_NOTIFICATIONS;
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch {
    // fallback to defaults
  }
  return DEFAULT_NOTIFICATIONS;
};

const saveNotifications = (items: AppNotification[]) => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch {
    // ignore
  }
};

const initialItems = getInitialNotifications();

export const useNotificationStore = create<NotificationState>((set) => ({
  notifications: initialItems,
  unreadCount: initialItems.filter((n) => n.unread).length,

  markAsRead: (id: string) =>
    set((state) => {
      const updated = state.notifications.map((n) => (n.id === id ? { ...n, unread: false } : n));
      saveNotifications(updated);
      return {
        notifications: updated,
        unreadCount: updated.filter((n) => n.unread).length,
      };
    }),

  markAllAsRead: () =>
    set((state) => {
      const updated = state.notifications.map((n) => ({ ...n, unread: false }));
      saveNotifications(updated);
      return {
        notifications: updated,
        unreadCount: 0,
      };
    }),

  clearAll: () => {
    saveNotifications([]);
    return set({
      notifications: [],
      unreadCount: 0,
    });
  },

  addNotification: (item) =>
    set((state) => {
      const newNotif: AppNotification = {
        ...item,
        id: `notif-${Date.now()}`,
        unread: true,
        createdAt: Date.now(),
      };
      const updated = [newNotif, ...state.notifications];
      saveNotifications(updated);
      return {
        notifications: updated,
        unreadCount: updated.filter((n) => n.unread).length,
      };
    }),
}));
