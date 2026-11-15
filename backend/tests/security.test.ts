import { describe, it, expect, vi } from 'vitest';
import request from 'supertest';
import { createApp } from '../src/app.js';
import { TransactionService } from '../src/services/transaction.service.js';

describe('Security, Authentication & Data Integrity Tests', () => {
  const app = createApp();
  const validAccountId = '11111111-2222-3333-4444-555555555555';
  const testAuthHeader = 'Bearer test-token-secure-user-1';

  describe('Authentication & Authorization', () => {
    it('rejects unauthenticated requests to POST /api/v1/transactions with 401', async () => {
      const res = await request(app)
        .post('/api/v1/transactions')
        .send({
          accountId: validAccountId,
          amount: 500,
          type: 'EXPENSE',
          category: 'Groceries',
          description: 'Weekly groceries',
          date: new Date().toISOString(),
        });

      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toContain('Authentication required');
    });

    it('rejects invalid or malformed auth tokens with 401', async () => {
      const res = await request(app)
        .post('/api/v1/transactions')
        .set('Authorization', 'Bearer invalid-expired-token-xyz')
        .send({
          accountId: validAccountId,
          amount: 500,
          type: 'EXPENSE',
          category: 'Groceries',
          description: 'Weekly groceries',
          date: new Date().toISOString(),
        });

      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toContain('Invalid or expired authentication session');
    });

    it('rejects unauthenticated requests to GET /api/v1/ai/insights with 401', async () => {
      const res = await request(app).get('/api/v1/ai/insights');
      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
    });

    it('rejects unauthenticated requests to POST /api/v1/ai/coach with 401', async () => {
      const res = await request(app)
        .post('/api/v1/ai/coach')
        .send({ query: 'How can I save more money?' });
      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
    });

    it('allows public access to GET /api/v1/ai/status without authentication', async () => {
      const res = await request(app).get('/api/v1/ai/status');
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('model');
      expect(res.body.data).toHaveProperty('isConfigured');
    });
  });

  describe('Input Validation & Data Sanitization', () => {
    it('rejects transaction creation with negative amount (400 Bad Request)', async () => {
      const res = await request(app)
        .post('/api/v1/transactions')
        .set('Authorization', testAuthHeader)
        .send({
          accountId: validAccountId,
          amount: -150.00,
          type: 'EXPENSE',
          category: 'Dining',
          description: 'Lunch',
          date: new Date().toISOString(),
        });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });

    it('rejects transaction creation with zero amount (400 Bad Request)', async () => {
      const res = await request(app)
        .post('/api/v1/transactions')
        .set('Authorization', testAuthHeader)
        .send({
          accountId: validAccountId,
          amount: 0,
          type: 'EXPENSE',
          category: 'Dining',
          description: 'Lunch',
          date: new Date().toISOString(),
        });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });

    it('rejects transaction creation with non-UUID accountId (400 Bad Request)', async () => {
      const res = await request(app)
        .post('/api/v1/transactions')
        .set('Authorization', testAuthHeader)
        .send({
          accountId: 'not-a-valid-uuid',
          amount: 250,
          type: 'EXPENSE',
          category: 'Dining',
          description: 'Lunch',
          date: new Date().toISOString(),
        });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });

    it('rejects transaction creation with missing mandatory fields (400 Bad Request)', async () => {
      const res = await request(app)
        .post('/api/v1/transactions')
        .set('Authorization', testAuthHeader)
        .send({
          accountId: validAccountId,
          // Missing amount, type, date, description
        });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });
  });

  describe('Duplicate Transaction Detection & Integrity', () => {
    it('detects and rejects duplicate transactions with 409 Conflict', async () => {
      vi.spyOn(TransactionService, 'detectDuplicate').mockResolvedValueOnce(true);

      const res = await request(app)
        .post('/api/v1/transactions')
        .set('Authorization', testAuthHeader)
        .send({
          accountId: validAccountId,
          amount: 1200,
          type: 'EXPENSE',
          category: 'Shopping',
          description: 'Electronics purchase duplicate',
          date: new Date().toISOString(),
        });

      expect(res.status).toBe(409);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toContain('duplicate transaction');

      vi.restoreAllMocks();
    });

    it('successfully creates valid non-duplicate transaction for authenticated user', async () => {
      const res = await request(app)
        .post('/api/v1/transactions')
        .set('Authorization', testAuthHeader)
        .send({
          accountId: validAccountId,
          amount: 450,
          type: 'EXPENSE',
          category: 'Groceries',
          description: 'Weekly organic produce',
          date: new Date().toISOString(),
        });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.amount).toBe(450);
      expect(res.body.data.userId).toBe('secure-user-1');
    });
  });
});
