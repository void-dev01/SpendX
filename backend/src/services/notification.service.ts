import { supabaseClient } from '../config/supabase.js';
import { logger } from '../utils/logger.js';
import { NotificationRecord, NotificationType } from '../types/index.js';

// In-memory fallback repository for notifications (supports local dev and testing)
const inMemoryNotifications: NotificationRecord[] = [];

export class NotificationService {
  /**
   * Create and record a new user notification
   */
  public static async createNotification(
    userId: string,
    type: NotificationType,
    title: string,
    message: string,
    actionRoute?: string
  ): Promise<NotificationRecord> {
    const notification: NotificationRecord = {
      id: `notif_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      userId,
      type,
      title,
      message,
      actionRoute,
      isRead: false,
      createdAt: new Date().toISOString(),
    };

    if (!supabaseClient) {
      inMemoryNotifications.unshift(notification);
      return notification;
    }

    try {
      const { data, error } = await supabaseClient
        .from('notifications')
        .insert({
          user_id: userId,
          type,
          title,
          message,
          action_route: actionRoute,
          is_read: false,
        })
        .select()
        .single();

      if (error || !data) {
        logger.warn({ error }, 'Failed saving notification to database, falling back to local memory');
        inMemoryNotifications.unshift(notification);
        return notification;
      }

      return {
        id: data.id,
        userId: data.user_id,
        type: data.type,
        title: data.title,
        message: data.message,
        actionRoute: data.action_route,
        isRead: data.is_read,
        createdAt: data.created_at,
      };
    } catch (err) {
      logger.error({ err }, 'Error creating notification');
      inMemoryNotifications.unshift(notification);
      return notification;
    }
  }

  /**
   * Retrieve notifications for a specific user
   */
  public static async getUserNotifications(
    userId: string,
    limit: number = 30
  ): Promise<NotificationRecord[]> {
    if (!supabaseClient) {
      return inMemoryNotifications
        .filter((n) => n.userId === userId)
        .slice(0, limit);
    }

    try {
      const { data, error } = await supabaseClient
        .from('notifications')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error || !data) {
        return inMemoryNotifications.filter((n) => n.userId === userId).slice(0, limit);
      }

      return data.map((item) => ({
        id: item.id,
        userId: item.user_id,
        type: item.type,
        title: item.title,
        message: item.message,
        actionRoute: item.action_route,
        isRead: item.is_read,
        createdAt: item.created_at,
      }));
    } catch {
      return inMemoryNotifications.filter((n) => n.userId === userId).slice(0, limit);
    }
  }

  /**
   * Mark a notification as read
   */
  public static async markAsRead(userId: string, notificationId: string): Promise<boolean> {
    const memoryItem = inMemoryNotifications.find((n) => n.id === notificationId && n.userId === userId);
    if (memoryItem) {
      memoryItem.isRead = true;
    }

    if (!supabaseClient) {
      return Boolean(memoryItem);
    }

    try {
      const { error } = await supabaseClient
        .from('notifications')
        .update({ is_read: true })
        .eq('id', notificationId)
        .eq('user_id', userId);

      return !error;
    } catch {
      return Boolean(memoryItem);
    }
  }

  /**
   * Get total unread notifications count for a user
   */
  public static async getUnreadCount(userId: string): Promise<number> {
    if (!supabaseClient) {
      return inMemoryNotifications.filter((n) => n.userId === userId && !n.isRead).length;
    }

    try {
      const { count, error } = await supabaseClient
        .from('notifications')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId)
        .eq('is_read', false);

      if (error || count === null) {
        return inMemoryNotifications.filter((n) => n.userId === userId && !n.isRead).length;
      }

      return count;
    } catch {
      return inMemoryNotifications.filter((n) => n.userId === userId && !n.isRead).length;
    }
  }

  /**
   * Clear in-memory notifications (used for testing resets)
   */
  public static resetMemory(): void {
    inMemoryNotifications.length = 0;
  }
}
