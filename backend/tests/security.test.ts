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

    it('rejects login with unregistered email with 401', async () => {
      const res = await request(app)
        .post('/api/v1/auth/login')
        .send({
          email: 'nonexistent-user-123@spendx.local',
          password: 'Password123!',
        });
      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toContain('No account found');
    });

    it('registers a new user and allows login with exact credentials', async () => {
      const uniqueEmail = `testuser_${Date.now()}@spendx.local`;
      const regRes = await request(app)
        .post('/api/v1/auth/register')
        .send({
          fullName: 'Test User',
          email: uniqueEmail,
          password: 'StrongPassword123!',
        });
      expect(regRes.status).toBe(201);
      expect(regRes.body.success).toBe(true);
      expect(regRes.body.user.email).toBe(uniqueEmail);

      // Rejects duplicate registration with 409
      const dupRes = await request(app)
        .post('/api/v1/auth/register')
        .send({
          fullName: 'Duplicate User',
          email: uniqueEmail,
          password: 'StrongPassword123!',
        });
      expect(dupRes.status).toBe(409);

      // Rejects login with wrong password
      const wrongPassRes = await request(app)
        .post('/api/v1/auth/login')
        .send({
          email: uniqueEmail,
          password: 'WrongPassword999!',
        });
      expect(wrongPassRes.status).toBe(401);
      expect(wrongPassRes.body.message).toContain('Invalid password');

      // Succeeds login with correct password
      const loginRes = await request(app)
        .post('/api/v1/auth/login')
        .send({
          email: uniqueEmail,
          password: 'StrongPassword123!',
        });
      expect(loginRes.status).toBe(200);
      expect(loginRes.body.success).toBe(true);
      expect(loginRes.body.token).toBeDefined();
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

  describe('Enterprise FinTech Security Hardening & Defenses', () => {
    it('does not leak server technology header (x-powered-by is disabled)', async () => {
      const res = await request(app).get('/health');
      expect(res.headers['x-powered-by']).toBeUndefined();
    });

    it('sets strict HTTP Security Headers (Helmet, HSTS, CSP, Frameguard)', async () => {
      const res = await request(app).get('/health');

      // Clickjacking defense
      expect(res.headers['x-frame-options']).toBe('DENY');
      // MIME-sniffing prevention
      expect(res.headers['x-content-type-options']).toBe('nosniff');
      // Content Security Policy
      expect(res.headers['content-security-policy']).toBeDefined();
      expect(res.headers['content-security-policy']).toContain("default-src 'self'");
      // Device Permissions Policy
      expect(res.headers['permissions-policy']).toContain('camera=()');
      // Cross-domain policies
      expect(res.headers['x-permitted-cross-domain-policies']).toBe('none');
    });

    it('automatically sanitizes XSS scripts from request payload', async () => {
      const res = await request(app)
        .post('/api/v1/transactions')
        .set('Authorization', testAuthHeader)
        .send({
          accountId: validAccountId,
          amount: 99.99,
          type: 'EXPENSE',
          category: 'Dining',
          description: '<script>alert("xss")</script>Coffee & Snack',
          date: new Date().toISOString(),
        });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      // Description should have script tag stripped
      expect(res.body.data.description).toBe('Coffee & Snack');
      expect(res.body.data.description).not.toContain('<script>');
    });

    it('blocks malicious SQL injection signatures in query parameters', async () => {
      const res = await request(app)
        .get('/api/v1/transactions?search=UNION SELECT * FROM users')
        .set('Authorization', testAuthHeader);

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toContain('Malicious input pattern detected');
    });
  });
});
