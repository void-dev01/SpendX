import { supabaseAdminClient } from '../config/supabase.js';
import { TransactionService } from './transaction.service.js';
import { AppError } from '../middleware/errorHandler.js';
import { logger } from '../utils/logger.js';

export interface ImportTransactionItem {
  date: string;
  amount: number;
  type: 'INCOME' | 'EXPENSE' | 'TRANSFER';
  category: string;
  description: string;
  merchantName?: string;
  paymentMethod?: string;
  referenceNumber?: string;
  accountId: string;
}

export class ImportService {
  public static async commitBatch(
    userId: string,
    payload: {
      source: 'CSV' | 'EXCEL' | 'PDF_TEXT' | 'SMS_TEXT' | 'MANUAL';
      fileName?: string;
      transactions: ImportTransactionItem[];
    }
  ) {
    if (!supabaseAdminClient) throw new AppError('Database service unavailable', 503);

    const { source, fileName, transactions } = payload;
    if (!transactions || transactions.length === 0) {
      throw new AppError('No transactions provided for ingestion', 400);
    }

    let importedCount = 0;
    let duplicateCount = 0;
    const insertedIds: string[] = [];

    for (const item of transactions) {
      try {
        const isDuplicate = await TransactionService.detectDuplicate(
          userId,
          item.accountId,
          item.amount,
          item.date,
          item.description
        );

        if (isDuplicate) {
          duplicateCount++;
          continue;
        }

        const created = await TransactionService.createTransaction(userId, {
          accountId: item.accountId,
          amount: item.amount,
          type: item.type,
          category: item.category || TransactionService.inferCategory(item.description),
          description: item.description,
          date: item.date,
          merchantName: item.merchantName,
          paymentMethod: item.paymentMethod as any,
          referenceNumber: item.referenceNumber,
          isRecurring: false,
        });

        insertedIds.push(created.id);
        importedCount++;
      } catch (err) {
        logger.warn({ err, item }, 'Failed to import single row in batch');
      }
    }

    // Record capture event in database
    const { data: event, error: evErr } = await supabaseAdminClient
      .from('capture_events')
      .insert({
        user_id: userId,
        source,
        file_name: fileName || null,
        total_parsed: transactions.length,
        imported_count: importedCount,
        duplicate_count: duplicateCount,
        status: importedCount === 0 && duplicateCount > 0 ? 'PARTIAL' : 'COMPLETED',
      })
      .select()
      .single();

    if (evErr) {
      logger.error({ evErr }, 'Failed logging capture event');
    }

    return {
      success: true,
      captureEventId: event?.id,
      totalParsed: transactions.length,
      importedCount,
      duplicateCount,
      insertedIds,
    };
  }

  public static async getCaptureHistory(userId: string) {
    if (!supabaseAdminClient) throw new AppError('Database service unavailable', 503);

    const { data, error } = await supabaseAdminClient
      .from('capture_events')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      throw new AppError('Unable to fetch import capture history', 500);
    }

    return data || [];
  }
}
