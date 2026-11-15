import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import { createApp } from '../src/app.js';
import { StorageService } from '../src/services/storage.service.js';

describe('Secure Financial Document & Receipt Storage', () => {
  const app = createApp();
  const testUserId = 'test-storage-user-01';
  const otherUserId = 'test-storage-user-02';
  const authHeader = `Bearer test-token-${testUserId}`;

  beforeEach(() => {
    StorageService.resetMemory();
  });

  describe('Authentication & Access Control', () => {
    it('rejects unauthenticated requests to /api/v1/storage/upload-url with 401', async () => {
      const res = await request(app)
        .post('/api/v1/storage/upload-url')
        .send({
          fileName: 'receipt.pdf',
          mimeType: 'application/pdf',
        });

      expect(res.status).toBe(401);
    });

    it('rejects cross-tenant download URL generation with 403 Forbidden', async () => {
      const res = await request(app)
        .post('/api/v1/storage/download-url')
        .set('Authorization', authHeader)
        .send({
          filePath: `${otherUserId}/receipts/secret_invoice.pdf`,
        });

      expect(res.status).toBe(403);
      expect(res.body.message).toContain('Cross-tenant');
    });
  });

  describe('File Validation & Constraints', () => {
    it('rejects disallowed file types with 400 Bad Request', async () => {
      const res = await request(app)
        .post('/api/v1/storage/upload-url')
        .set('Authorization', authHeader)
        .send({
          fileName: 'malicious.exe',
          mimeType: 'application/x-msdownload',
        });

      expect(res.status).toBe(400);
      expect(res.body.message).toContain('Unsupported document type');
    });

    it('rejects files exceeding 5MB size limit with 400 Bad Request', async () => {
      const res = await request(app)
        .post('/api/v1/storage/upload-url')
        .set('Authorization', authHeader)
        .send({
          fileName: 'large_statement.pdf',
          mimeType: 'application/pdf',
          fileSizeBytes: 8 * 1024 * 1024, // 8MB
        });

      expect(res.status).toBe(400);
      expect(res.body.message).toContain('exceeds 5MB limit');
    });

    it('generates signed upload URL for valid image/jpeg receipt', async () => {
      const res = await request(app)
        .post('/api/v1/storage/upload-url')
        .set('Authorization', authHeader)
        .send({
          fileName: 'coffee_receipt.jpg',
          mimeType: 'image/jpeg',
          fileSizeBytes: 250 * 1024,
        });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.uploadUrl).toBeDefined();
      expect(res.body.data.filePath).toContain(`${testUserId}/receipts/`);
      expect(res.body.data.expiresIn).toBe(900);
    });
  });

  describe('Document Registry & Download Endpoints', () => {
    it('registers uploaded receipt and retrieves in user document list', async () => {
      const filePath = `${testUserId}/receipts/hotal_bill.pdf`;

      const regRes = await request(app)
        .post('/api/v1/storage/register')
        .set('Authorization', authHeader)
        .send({
          fileName: 'hotal_bill.pdf',
          filePath,
          fileType: 'application/pdf',
          fileSizeBytes: 102400,
        });

      expect(regRes.status).toBe(201);
      expect(regRes.body.data.fileName).toBe('hotal_bill.pdf');

      const listRes = await request(app)
        .get('/api/v1/storage/documents')
        .set('Authorization', authHeader);

      expect(listRes.status).toBe(200);
      expect(listRes.body.data.length).toBe(1);
      expect(listRes.body.data[0].filePath).toBe(filePath);
    });

    it('generates valid download URL for owned document', async () => {
      const filePath = `${testUserId}/receipts/my_tax_report.pdf`;

      const res = await request(app)
        .post('/api/v1/storage/download-url')
        .set('Authorization', authHeader)
        .send({ filePath });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.downloadUrl).toBeDefined();
    });
  });
});
