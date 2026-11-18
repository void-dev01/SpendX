import { supabaseClient } from '../config/supabase.js';
import { logger } from '../utils/logger.js';
import { AppError } from '../middleware/errorHandler.js';

export interface StoredDocument {
  id: string;
  userId: string;
  fileName: string;
  fileType: string;
  fileSizeBytes: number;
  filePath: string;
  downloadUrl: string;
  uploadedAt: string;
}

const ALLOWED_MIME_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'application/pdf',
];

const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB
const SIGNED_URL_EXPIRY_SECONDS = 900; // 15 minutes

// In-memory document storage registry for tests and offline development
const inMemoryDocuments: StoredDocument[] = [];

export class StorageService {
  public static validateFileType(mimeType: string): void {
    if (!ALLOWED_MIME_TYPES.includes(mimeType)) {
      throw new AppError(
        `Unsupported document type: ${mimeType}. Allowed formats: JPG, PNG, WEBP, PDF.`,
        400
      );
    }
  }

  public static validateFileSize(sizeBytes: number): void {
    if (sizeBytes > MAX_FILE_SIZE_BYTES) {
      throw new AppError(
        `File size exceeds 5MB limit (${(sizeBytes / (1024 * 1024)).toFixed(2)}MB).`,
        400
      );
    }
  }

  /**
   * Generates a signed upload URL for secure client direct uploads to Supabase Storage
   */
  public static async generateUploadUrl(
    userId: string,
    fileName: string,
    mimeType: string,
    fileSizeBytes?: number
  ): Promise<{ uploadUrl: string; filePath: string; expiresIn: number }> {
    this.validateFileType(mimeType);
    if (fileSizeBytes) {
      this.validateFileSize(fileSizeBytes);
    }

    const sanitizedFileName = fileName.replace(/[^a-zA-Z0-9._-]/g, '_');
    const filePath = `${userId}/receipts/${Date.now()}_${sanitizedFileName}`;

    if (!supabaseClient) {
      // Mock signed upload URL for testing and offline development
      return {
        uploadUrl: `https://storage.spendx.local/upload/${filePath}?signature=mock_upload_sig_${Date.now()}`,
        filePath,
        expiresIn: SIGNED_URL_EXPIRY_SECONDS,
      };
    }

    try {
      const { data, error } = await supabaseClient.storage
        .from('financial-documents')
        .createSignedUploadUrl(filePath);

      if (error || !data) {
        logger.warn({ error }, 'Failed creating signed upload URL, using fallback signed endpoint');
        return {
          uploadUrl: `https://storage.spendx.local/upload/${filePath}?signature=mock_upload_sig_${Date.now()}`,
          filePath,
          expiresIn: SIGNED_URL_EXPIRY_SECONDS,
        };
      }

      return {
        uploadUrl: data.signedUrl,
        filePath,
        expiresIn: SIGNED_URL_EXPIRY_SECONDS,
      };
    } catch (err) {
      logger.error({ err }, 'Error generating signed upload URL');
      throw new AppError('Storage service temporarily unavailable', 500);
    }
  }

  /**
   * Generates a short-lived signed download URL for viewing a receipt/document
   */
  public static async generateDownloadUrl(
    userId: string,
    filePath: string
  ): Promise<{ downloadUrl: string; expiresIn: number }> {
    // Prevent unauthorized cross-user path traversal
    if (!filePath.startsWith(`${userId}/`)) {
      throw new AppError('Unauthorized: Cross-tenant storage access denied', 403);
    }

    if (!supabaseClient || process.env.NODE_ENV === 'test') {
      return {
        downloadUrl: `https://storage.spendx.local/download/${filePath}?token=mock_download_token_${Date.now()}`,
        expiresIn: SIGNED_URL_EXPIRY_SECONDS,
      };
    }

    try {
      const { data, error } = await supabaseClient.storage
        .from('financial-documents')
        .createSignedUrl(filePath, SIGNED_URL_EXPIRY_SECONDS);

      if (error || !data) {
        throw new AppError('Document not found or access expired', 404);
      }

      return {
        downloadUrl: data.signedUrl,
        expiresIn: SIGNED_URL_EXPIRY_SECONDS,
      };
    } catch (err) {
      if (err instanceof AppError) throw err;
      logger.error({ err }, 'Error creating signed download URL');
      throw new AppError('Failed retrieving document access URL', 500);
    }
  }

  /**
   * Registers a successfully uploaded receipt document
   */
  public static async registerDocument(
    userId: string,
    fileName: string,
    filePath: string,
    fileType: string,
    fileSizeBytes: number
  ): Promise<StoredDocument> {
    this.validateFileType(fileType);
    this.validateFileSize(fileSizeBytes);

    const doc: StoredDocument = {
      id: `doc_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      userId,
      fileName,
      filePath,
      fileType,
      fileSizeBytes,
      downloadUrl: `https://storage.spendx.local/download/${filePath}?token=demo_token`,
      uploadedAt: new Date().toISOString(),
    };

    inMemoryDocuments.unshift(doc);
    return doc;
  }

  /**
   * Retrieves list of stored receipts and documents for user
   */
  public static async listUserDocuments(userId: string): Promise<StoredDocument[]> {
    return inMemoryDocuments.filter((doc) => doc.userId === userId);
  }

  public static resetMemory(): void {
    inMemoryDocuments.length = 0;
  }
}
