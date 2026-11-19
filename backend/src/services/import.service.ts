import { getDbClient } from '../config/supabase.js';
import { TransactionService } from './transaction.service.js';
import { AppError } from '../middleware/errorHandler.js';
import { Transaction } from '../types/index.js';

export interface CaptureEventRecord {
  id: string;
  userId: string;
  source: 'CSV' | 'EXCEL' | 'PDF_TEXT' | 'SMS_TEXT';
  fileName?: string;
  totalCount: number;
  importedCount: number;
  duplicateCount: number;
  createdAt: string;
}

const inMemoryCaptureEvents: CaptureEventRecord[] = [];

export class ImportService {
  public static async validateBatch(
    userId: string,
    items: Array<Omit<Transaction, 'id' | 'userId' | 'createdAt' | 'updatedAt'>>
  ): Promise<{
    total: number;
    validCount: number;
    duplicateCount: number;
    validatedItems: Array<{
      item: Omit<Transaction, 'id' | 'userId' | 'createdAt' | 'updatedAt'>;
      isDuplicate: boolean;
    }>;
  }> {
    let duplicateCount = 0;
    const validatedItems: Array<{
      item: Omit<Transaction, 'id' | 'userId' | 'createdAt' | 'updatedAt'>;
      isDuplicate: boolean;
    }> = [];

    for (const item of items) {
      const isDup = await TransactionService.detectDuplicate(
        userId,
        item.accountId,
        item.amount,
        item.date,
        item.description
      );

      if (isDup) duplicateCount++;
      validatedItems.push({ item, isDuplicate: isDup });
    }

    const validCount = items.length - duplicateCount;
    return {
      total: items.length,
      validCount,
      duplicateCount,
      validatedItems,
    };
  }

  public static async commitBatch(
    userId: string,
    source: 'CSV' | 'EXCEL' | 'PDF_TEXT' | 'SMS_TEXT',
    fileName: string | undefined,
    items: Array<Omit<Transaction, 'id' | 'userId' | 'createdAt' | 'updatedAt'>>
  ): Promise<{
    event: CaptureEventRecord;
    insertedCount: number;
    duplicateCount: number;
    transactions: Transaction[];
  }> {
    const { inserted, duplicates, items: createdTransactions } =
      await TransactionService.batchCreateTransactions(userId, items);

    const eventRecord: CaptureEventRecord = {
      id: `evt_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      userId,
      source,
      fileName,
      totalCount: items.length,
      importedCount: inserted,
      duplicateCount: duplicates,
      createdAt: new Date().toISOString(),
    };

    const db = getDbClient();
    if (process.env.NODE_ENV === 'test' || !db) {
      inMemoryCaptureEvents.unshift(eventRecord);
    } else {
      const { error } = await db.from('capture_events').insert({
        user_id: userId,
        source,
        file_name: fileName,
        total_count: items.length,
        imported_count: inserted,
        duplicate_count: duplicates,
      });
      if (error) {
        // Fallback log
        inMemoryCaptureEvents.unshift(eventRecord);
      }
    }

    return {
      event: eventRecord,
      insertedCount: inserted,
      duplicateCount: duplicates,
      transactions: createdTransactions,
    };
  }

  public static async getHistory(userId: string): Promise<CaptureEventRecord[]> {
    const db = getDbClient();
    if (process.env.NODE_ENV === 'test' || !db) {
      return inMemoryCaptureEvents.filter((e) => e.userId === userId);
    }

    const { data, error } = await db
      .from('capture_events')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw new AppError('Failed to fetch capture history', 500);

    return (data || []).map((e) => ({
      id: e.id,
      userId: e.user_id,
      source: e.source,
      fileName: e.file_name,
      totalCount: e.total_count,
      importedCount: e.imported_count,
      duplicateCount: e.duplicate_count,
      createdAt: e.created_at,
    }));
  }
}
