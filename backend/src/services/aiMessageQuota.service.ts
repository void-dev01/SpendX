import { supabaseAdminClient } from '../config/supabase.js';
import { localStore } from '../db/localStore.js';
import { logger } from '../utils/logger.js';

export const DAILY_MESSAGE_LIMIT = 200;

export interface QueuedMessageRecord {
  id: string;
  userId: string;
  query: string;
  sessionId?: string;
  scheduledFor: string;
  status: 'QUEUED' | 'PROCESSED' | 'CANCELLED';
  response?: string;
  createdAt: string;
  updatedAt: string;
}

export class AIMessageQuotaService {
  /**
   * Returns current day format YYYY-MM-DD
   */
  private static getTodayDateString(): string {
    return new Date().toISOString().slice(0, 10);
  }

  /**
   * Returns next midnight ISO timestamp
   */
  public static getNextMidnightISO(): string {
    const nextMidnight = new Date();
    nextMidnight.setUTCHours(24, 0, 0, 0);
    return nextMidnight.toISOString();
  }

  /**
   * Checks current daily AI message quota for user
   */
  public static async getQuota(userId: string): Promise<{
    limit: number;
    used: number;
    remaining: number;
    resetAt: string;
    isLimitReached: boolean;
  }> {
    const today = this.getTodayDateString();
    const resetAt = this.getNextMidnightISO();

    if (supabaseAdminClient) {
      try {
        const { data, error } = await supabaseAdminClient
          .from('ai_message_usage')
          .select('message_count')
          .eq('user_id', userId)
          .eq('usage_date', today)
          .maybeSingle();

        if (!error && data) {
          const used = data.message_count || 0;
          const remaining = Math.max(0, DAILY_MESSAGE_LIMIT - used);
          return {
            limit: DAILY_MESSAGE_LIMIT,
            used,
            remaining,
            resetAt,
            isLimitReached: remaining <= 0,
          };
        }
      } catch (err) {
        logger.warn({ err, userId }, 'Supabase AI quota fetch failed, falling back to localStore');
      }
    }

    // LocalStore fallback
    const db = localStore.read();
    const usageMap = (db as any).aiMessageUsage || {};
    const key = `${userId}_${today}`;
    const used = usageMap[key] || 0;
    const remaining = Math.max(0, DAILY_MESSAGE_LIMIT - used);

    return {
      limit: DAILY_MESSAGE_LIMIT,
      used,
      remaining,
      resetAt,
      isLimitReached: remaining <= 0,
    };
  }

  /**
   * Increments message count by 1 for user today
   */
  public static async incrementUsage(userId: string): Promise<number> {
    const today = this.getTodayDateString();

    if (supabaseAdminClient) {
      try {
        // Upsert record
        const { data, error } = await supabaseAdminClient
          .from('ai_message_usage')
          .select('message_count')
          .eq('user_id', userId)
          .eq('usage_date', today)
          .maybeSingle();

        if (!error && data) {
          const newCount = (data.message_count || 0) + 1;
          await supabaseAdminClient
            .from('ai_message_usage')
            .update({ message_count: newCount, updated_at: new Date().toISOString() })
            .eq('user_id', userId)
            .eq('usage_date', today);
          return newCount;
        } else {
          await supabaseAdminClient.from('ai_message_usage').insert({
            user_id: userId,
            usage_date: today,
            message_count: 1,
          });
          return 1;
        }
      } catch (err) {
        logger.warn({ err, userId }, 'Supabase AI usage increment failed, updating localStore');
      }
    }

    // LocalStore fallback
    const db = localStore.read();
    const usageMap = (db as any).aiMessageUsage || {};
    const key = `${userId}_${today}`;
    const newCount = (usageMap[key] || 0) + 1;
    usageMap[key] = newCount;
    (db as any).aiMessageUsage = usageMap;
    localStore.write(db);

    return newCount;
  }

  /**
   * Queues/Schedules a message to be processed tomorrow
   */
  public static async queueMessage(
    userId: string,
    query: string,
    sessionId?: string
  ): Promise<QueuedMessageRecord> {
    const scheduledFor = this.getNextMidnightISO();
    const id = `queue_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;

    const newRecord: QueuedMessageRecord = {
      id,
      userId,
      query: query.trim(),
      sessionId,
      scheduledFor,
      status: 'QUEUED',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    if (supabaseAdminClient) {
      try {
        const { data, error } = await supabaseAdminClient
          .from('ai_message_queue')
          .insert({
            id: newRecord.id,
            user_id: userId,
            query: newRecord.query,
            session_id: sessionId || null,
            scheduled_for: scheduledFor,
            status: 'QUEUED',
          })
          .select()
          .single();

        if (!error && data) {
          return {
            id: data.id,
            userId: data.user_id,
            query: data.query,
            sessionId: data.session_id,
            scheduledFor: data.scheduled_for,
            status: data.status,
            createdAt: data.created_at,
            updatedAt: data.updated_at,
          };
        }
      } catch (err) {
        logger.warn({ err, userId }, 'Supabase AI message queueing failed, saving to localStore');
      }
    }

    // LocalStore fallback
    const db = localStore.read();
    const list: QueuedMessageRecord[] = (db as any).queuedMessages || [];
    list.push(newRecord);
    (db as any).queuedMessages = list;
    localStore.write(db);

    return newRecord;
  }

  /**
   * Retrieves active queued messages for user
   */
  public static async getQueuedMessages(userId: string): Promise<QueuedMessageRecord[]> {
    if (supabaseAdminClient) {
      try {
        const { data, error } = await supabaseAdminClient
          .from('ai_message_queue')
          .select('*')
          .eq('user_id', userId)
          .eq('status', 'QUEUED')
          .order('scheduled_for', { ascending: true });

        if (!error && data) {
          return data.map((d: any) => ({
            id: d.id,
            userId: d.user_id,
            query: d.query,
            sessionId: d.session_id,
            scheduledFor: d.scheduled_for,
            status: d.status,
            response: d.response,
            createdAt: d.created_at,
            updatedAt: d.updated_at,
          }));
        }
      } catch (err) {
        logger.warn({ err, userId }, 'Supabase queued messages fetch failed');
      }
    }

    const db = localStore.read();
    const list: QueuedMessageRecord[] = (db as any).queuedMessages || [];
    return list.filter((m) => m.userId === userId && m.status === 'QUEUED');
  }

  /**
   * Updates/Edits query text of a queued message
   */
  public static async updateQueuedMessage(
    userId: string,
    id: string,
    newQuery: string
  ): Promise<QueuedMessageRecord | null> {
    if (supabaseAdminClient) {
      try {
        const { data, error } = await supabaseAdminClient
          .from('ai_message_queue')
          .update({ query: newQuery.trim(), updated_at: new Date().toISOString() })
          .eq('id', id)
          .eq('user_id', userId)
          .select()
          .single();

        if (!error && data) {
          return {
            id: data.id,
            userId: data.user_id,
            query: data.query,
            sessionId: data.session_id,
            scheduledFor: data.scheduled_for,
            status: data.status,
            createdAt: data.created_at,
            updatedAt: data.updated_at,
          };
        }
      } catch (err) {
        logger.warn({ err, id }, 'Supabase queued message update failed');
      }
    }

    const db = localStore.read();
    const list: QueuedMessageRecord[] = (db as any).queuedMessages || [];
    const index = list.findIndex((m) => m.id === id && m.userId === userId);
    if (index === -1) return null;

    list[index].query = newQuery.trim();
    list[index].updatedAt = new Date().toISOString();
    (db as any).queuedMessages = list;
    localStore.write(db);

    return list[index];
  }

  /**
   * Cancels a queued message
   */
  public static async cancelQueuedMessage(userId: string, id: string): Promise<boolean> {
    if (supabaseAdminClient) {
      try {
        const { error } = await supabaseAdminClient
          .from('ai_message_queue')
          .update({ status: 'CANCELLED', updated_at: new Date().toISOString() })
          .eq('id', id)
          .eq('user_id', userId);

        if (!error) return true;
      } catch (err) {
        logger.warn({ err, id }, 'Supabase queued message cancel failed');
      }
    }

    const db = localStore.read();
    const list: QueuedMessageRecord[] = (db as any).queuedMessages || [];
    const item = list.find((m) => m.id === id && m.userId === userId);
    if (!item) return false;

    item.status = 'CANCELLED';
    item.updatedAt = new Date().toISOString();
    (db as any).queuedMessages = list;
    localStore.write(db);

    return true;
  }
}
