import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { createApp } from '../src/app.js';

describe('SPENDX Domain Services & Runtime Auth Tests', () => {
  const app = createApp();
  const authHeader = 'Bearer test-token-domain-tester';

  let accountAId: string;
  let accountBId: string;
  let recurringId: string;

  describe('Accounts API (/api/v1/accounts)', () => {
    it('creates account A and account B', async () => {
      const resA = await request(app)
        .post('/api/v1/accounts')
        .set('Authorization', authHeader)
        .send({
          name: 'Axis Primary Savings',
          institution: 'Axis Bank',
          type: 'SAVINGS',
          balance: 50000,
          currency: 'INR',
          lastFourDigits: '1234',
        });

      expect(resA.status).toBe(201);
      expect(resA.body.success).toBe(true);
      expect(resA.body.data.id).toBeDefined();
      accountAId = resA.body.data.id;

      const resB = await request(app)
        .post('/api/v1/accounts')
        .set('Authorization', authHeader)
        .send({
          name: 'HDFC Checking',
          institution: 'HDFC Bank',
          type: 'BANK',
          balance: 10000,
          currency: 'INR',
          lastFourDigits: '5678',
        });

      expect(resB.status).toBe(201);
      accountBId = resB.body.data.id;
    });

    it('lists all accounts via GET /api/v1/accounts', async () => {
      const res = await request(app)
        .get('/api/v1/accounts')
        .set('Authorization', authHeader);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
      expect(res.body.data.length).toBeGreaterThanOrEqual(2);
    });

    it('retrieves single account by ID', async () => {
      const res = await request(app)
        .get(`/api/v1/accounts/${accountAId}`)
        .set('Authorization', authHeader);

      expect(res.status).toBe(200);
      expect(res.body.data.name).toBe('Axis Primary Savings');
    });

    it('updates account balance and notes with PATCH', async () => {
      const res = await request(app)
        .patch(`/api/v1/accounts/${accountAId}`)
        .set('Authorization', authHeader)
        .send({
          balance: 55000,
          notes: 'Emergency reserve updated',
        });

      expect(res.status).toBe(200);
      expect(res.body.data.balance).toBe(55000);
      expect(res.body.data.notes).toBe('Emergency reserve updated');
    });

    it('executes transfer between accounts with POST /transfer', async () => {
      const res = await request(app)
        .post('/api/v1/accounts/transfer')
        .set('Authorization', authHeader)
        .send({
          fromAccountId: accountAId,
          toAccountId: accountBId,
          amount: 5000,
          description: 'Monthly savings allocation',
        });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.fromAccount.balance).toBe(50000); // 55000 - 5000
      expect(res.body.data.toAccount.balance).toBe(15000); // 10000 + 5000
    });

    it('deletes an account via DELETE /api/v1/accounts/:id', async () => {
      const res = await request(app)
        .delete(`/api/v1/accounts/${accountBId}`)
        .set('Authorization', authHeader);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });
  });

  describe('Recurring Payments API (/api/v1/recurring)', () => {
    it('creates a recurring payment schedule', async () => {
      const res = await request(app)
        .post('/api/v1/recurring')
        .set('Authorization', authHeader)
        .send({
          name: 'Spotify Premium Family',
          merchant: 'Spotify AB',
          category: 'Subscriptions',
          amount: 199,
          frequency: 'MONTHLY',
          startDate: '2026-01-01T00:00:00.000Z',
          nextDueDate: '2026-12-01T00:00:00.000Z',
          linkedAccountId: accountAId,
        });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.id).toBeDefined();
      recurringId = res.body.data.id;
    });

    it('lists recurring payments and retrieves by ID', async () => {
      const listRes = await request(app)
        .get('/api/v1/recurring')
        .set('Authorization', authHeader);

      expect(listRes.status).toBe(200);
      expect(listRes.body.data.length).toBeGreaterThan(0);

      const getRes = await request(app)
        .get(`/api/v1/recurring/${recurringId}`)
        .set('Authorization', authHeader);

      expect(getRes.status).toBe(200);
      expect(getRes.body.data.name).toBe('Spotify Premium Family');
    });

    it('updates recurring status and details with PATCH', async () => {
      const res = await request(app)
        .patch(`/api/v1/recurring/${recurringId}`)
        .set('Authorization', authHeader)
        .send({
          amount: 219,
          status: 'PAUSED',
        });

      expect(res.status).toBe(200);
      expect(res.body.data.amount).toBe(219);
      expect(res.body.data.status).toBe('PAUSED');
    });

    it('detects recurring patterns via POST /detect-patterns', async () => {
      const res = await request(app)
        .post('/api/v1/recurring/detect-patterns')
        .set('Authorization', authHeader)
        .send({ lookbackDays: 90 });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
    });

    it('deletes recurring payment schedule', async () => {
      const res = await request(app)
        .delete(`/api/v1/recurring/${recurringId}`)
        .set('Authorization', authHeader);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });
  });

  describe('Reports API (/api/v1/reports)', () => {
    it('generates monthly statement via GET /monthly-statement', async () => {
      const res = await request(app)
        .get('/api/v1/reports/monthly-statement?year=2026&month=11')
        .set('Authorization', authHeader);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.monthKey).toBe('2026-11');
      expect(typeof res.body.data.totalIncome).toBe('number');
      expect(typeof res.body.data.totalExpenses).toBe('number');
    });

    it('computes Indian Income Tax deductible categories via GET /tax-summary', async () => {
      const res = await request(app)
        .get('/api/v1/reports/tax-summary?taxYear=2025-2026')
        .set('Authorization', authHeader);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.taxYear).toBe('2025-2026');
      expect(Array.isArray(res.body.data.buckets)).toBe(true);
      expect(res.body.data.buckets.length).toBe(4); // 80C, 80D, 80E, 80GG
    });

    it('exports CSV of transactions via GET /export-csv', async () => {
      const res = await request(app)
        .get('/api/v1/reports/export-csv')
        .set('Authorization', authHeader);

      expect(res.status).toBe(200);
      expect(res.headers['content-type']).toContain('text/csv');
      expect(res.text).toContain('Date,Type,Category,Description,Merchant,Amount,Account ID');
    });
  });
});
