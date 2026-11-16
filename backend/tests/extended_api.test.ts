import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { createApp } from '../src/app.js';
import { AIService } from '../src/services/ai.service.js';

describe('SPENDX Extended REST APIs & Intelligence Verification', () => {
  const app = createApp();
  const authHeader = 'Bearer test-token-extended-architect';
  const testAccountId = '99999999-8888-7777-6666-555555555555';

  let createdTxnId: string;
  let createdBudgetId: string;
  let createdGoalId: string;

  describe('Transactions CRUD & Batch Import Endpoints', () => {
    it('creates a transaction and retrieves it via GET /api/v1/transactions', async () => {
      const createRes = await request(app)
        .post('/api/v1/transactions')
        .set('Authorization', authHeader)
        .send({
          accountId: testAccountId,
          amount: 1450,
          type: 'EXPENSE',
          category: 'Dining Out',
          description: 'Team Dinner Celebration',
          date: new Date().toISOString(),
          merchantName: 'Bistro 24',
        });

      expect(createRes.status).toBe(201);
      expect(createRes.body.success).toBe(true);
      expect(createRes.body.data.id).toBeDefined();
      createdTxnId = createRes.body.data.id;

      // GET list
      const listRes = await request(app)
        .get('/api/v1/transactions?limit=10')
        .set('Authorization', authHeader);

      expect(listRes.status).toBe(200);
      expect(listRes.body.success).toBe(true);
      expect(Array.isArray(listRes.body.data)).toBe(true);
      expect(listRes.body.data.length).toBeGreaterThan(0);
    });

    it('fetches single transaction by ID and updates it with PATCH', async () => {
      const getRes = await request(app)
        .get(`/api/v1/transactions/${createdTxnId}`)
        .set('Authorization', authHeader);

      expect(getRes.status).toBe(200);
      expect(getRes.body.data.id).toBe(createdTxnId);

      const patchRes = await request(app)
        .patch(`/api/v1/transactions/${createdTxnId}`)
        .set('Authorization', authHeader)
        .send({
          amount: 1600,
          description: 'Updated Team Dinner Bill',
        });

      expect(patchRes.status).toBe(200);
      expect(patchRes.body.data.amount).toBe(1600);
      expect(patchRes.body.data.description).toBe('Updated Team Dinner Bill');
    });

    it('successfully executes batch import via POST /api/v1/transactions/batch', async () => {
      const batchRes = await request(app)
        .post('/api/v1/transactions/batch')
        .set('Authorization', authHeader)
        .send({
          items: [
            {
              accountId: testAccountId,
              amount: 250,
              type: 'EXPENSE',
              category: 'Groceries',
              description: 'Fresh Milk & Bread',
              date: new Date(Date.now() - 3600000).toISOString(),
            },
            {
              accountId: testAccountId,
              amount: 750,
              type: 'EXPENSE',
              category: 'Transportation',
              description: 'Cab fare to office',
              date: new Date(Date.now() - 7200000).toISOString(),
            },
          ],
        });

      expect(batchRes.status).toBe(201);
      expect(batchRes.body.data.inserted).toBe(2);
    });

    it('deletes transaction via DELETE /api/v1/transactions/:id', async () => {
      const delRes = await request(app)
        .delete(`/api/v1/transactions/${createdTxnId}`)
        .set('Authorization', authHeader);

      expect(delRes.status).toBe(200);
      expect(delRes.body.success).toBe(true);
    });
  });

  describe('Budget Management & Threshold Endpoints', () => {
    it('creates a new budget cap via POST /api/v1/budgets', async () => {
      const res = await request(app)
        .post('/api/v1/budgets')
        .set('Authorization', authHeader)
        .send({
          category: 'Entertainment & Gaming',
          allocatedAmount: 12000,
          period: 'MONTHLY',
        });

      expect(res.status).toBe(201);
      expect(res.body.data.id).toBeDefined();
      expect(res.body.data.allocatedAmount).toBe(12000);
      createdBudgetId = res.body.data.id;
    });

    it('fetches budgets and calculated utilization via GET /api/v1/budgets', async () => {
      const res = await request(app)
        .get('/api/v1/budgets')
        .set('Authorization', authHeader);

      expect(res.status).toBe(200);
      expect(Array.isArray(res.body.data)).toBe(true);
      expect(res.body.data[0]).toHaveProperty('utilizationPercentage');
      expect(res.body.data[0]).toHaveProperty('status');
    });

    it('updates budget limit via PATCH /api/v1/budgets/:id', async () => {
      const res = await request(app)
        .patch(`/api/v1/budgets/${createdBudgetId}`)
        .set('Authorization', authHeader)
        .send({ allocatedAmount: 15000 });

      expect(res.status).toBe(200);
      expect(res.body.data.allocatedAmount).toBe(15000);
    });

    it('executes threshold scan via POST /api/v1/budgets/check-thresholds', async () => {
      const res = await request(app)
        .post('/api/v1/budgets/check-thresholds')
        .set('Authorization', authHeader);

      expect(res.status).toBe(200);
      expect(res.body.data).toHaveProperty('alertedCount');
    });

    it('deletes budget cap via DELETE /api/v1/budgets/:id', async () => {
      const res = await request(app)
        .delete(`/api/v1/budgets/${createdBudgetId}`)
        .set('Authorization', authHeader);

      expect(res.status).toBe(200);
    });
  });

  describe('Savings Goals & Milestone Contributions', () => {
    it('creates a savings goal via POST /api/v1/savings', async () => {
      const res = await request(app)
        .post('/api/v1/savings')
        .set('Authorization', authHeader)
        .send({
          name: 'Home Renovation Fund',
          targetAmount: 100000,
          currentAmount: 40000,
          targetDate: new Date(Date.now() + 120 * 24 * 60 * 60 * 1000).toISOString(),
          category: 'Housing',
        });

      expect(res.status).toBe(201);
      expect(res.body.data.name).toBe('Home Renovation Fund');
      expect(res.body.data.progressPercentage).toBe(40);
      createdGoalId = res.body.data.id;
    });

    it('records contribution and triggers 50% halfway milestone alert', async () => {
      const res = await request(app)
        .post(`/api/v1/savings/${createdGoalId}/contributions`)
        .set('Authorization', authHeader)
        .send({
          amount: 15000, // Brings total to 55,000 (55%)
          notes: 'Quarterly bonus savings allocation',
        });

      expect(res.status).toBe(200);
      expect(res.body.data.milestoneCelebrated).toBe(true);
      expect(res.body.data.goal.currentAmount).toBe(55000);
      expect(res.body.data.goal.progressPercentage).toBe(55);
    });

    it('deletes savings goal via DELETE /api/v1/savings/:id', async () => {
      const res = await request(app)
        .delete(`/api/v1/savings/${createdGoalId}`)
        .set('Authorization', authHeader);

      expect(res.status).toBe(200);
    });
  });

  describe('Deterministic Analytics & 4-Pillar Health Score', () => {
    it('returns verified financial summary via GET /api/v1/analytics/summary', async () => {
      const res = await request(app)
        .get('/api/v1/analytics/summary')
        .set('Authorization', authHeader);

      expect(res.status).toBe(200);
      expect(res.body.data).toHaveProperty('totalIncome');
      expect(res.body.data).toHaveProperty('totalExpenses');
      expect(res.body.data).toHaveProperty('netCashFlow');
      expect(res.body.data).toHaveProperty('savingsRate');
    });

    it('returns deterministic 4-pillar health score via GET /api/v1/analytics/health-score', async () => {
      const res = await request(app)
        .get('/api/v1/analytics/health-score')
        .set('Authorization', authHeader);

      expect(res.status).toBe(200);
      expect(res.body.data.totalScore).toBeGreaterThanOrEqual(0);
      expect(res.body.data.totalScore).toBeLessThanOrEqual(100);
      expect(res.body.data.pillars).toHaveProperty('emergencyFund');
      expect(res.body.data.pillars).toHaveProperty('burnRatio');
      expect(res.body.data.pillars).toHaveProperty('savingsRate');
      expect(res.body.data.pillars).toHaveProperty('budgetDiscipline');
    });

    it('returns projected runway and burn rate via GET /api/v1/analytics/burn-rate', async () => {
      const res = await request(app)
        .get('/api/v1/analytics/burn-rate')
        .set('Authorization', authHeader);

      expect(res.status).toBe(200);
      expect(res.body.data).toHaveProperty('monthlyIncome');
      expect(res.body.data).toHaveProperty('projectedRunwayMonths');
      expect(res.body.data).toHaveProperty('runwayStatus');
    });
  });

  describe('Statement Ingestion & Capture Events Endpoints', () => {
    it('validates batch transactions via POST /api/v1/import/validate', async () => {
      const res = await request(app)
        .post('/api/v1/import/validate')
        .set('Authorization', authHeader)
        .send({
          source: 'CSV',
          items: [
            {
              accountId: testAccountId,
              amount: 1200,
              type: 'EXPENSE',
              category: 'Shopping',
              description: 'Amazon Retail Purchase',
              date: new Date().toISOString(),
            },
          ],
        });

      expect(res.status).toBe(200);
      expect(res.body.data.total).toBe(1);
      expect(res.body.data.validCount).toBe(1);
    });

    it('commits batch and retrieves history via GET /api/v1/import/history', async () => {
      const commitRes = await request(app)
        .post('/api/v1/import/commit')
        .set('Authorization', authHeader)
        .send({
          source: 'SMS_TEXT',
          fileName: 'HDFC_SMS_Logs.txt',
          items: [
            {
              accountId: testAccountId,
              amount: 320,
              type: 'EXPENSE',
              category: 'Food & Dining',
              description: 'Cafe Coffee Day UPI',
              date: new Date().toISOString(),
            },
          ],
        });

      expect(commitRes.status).toBe(201);
      expect(commitRes.body.data.insertedCount).toBe(1);

      const histRes = await request(app)
        .get('/api/v1/import/history')
        .set('Authorization', authHeader);

      expect(histRes.status).toBe(200);
      expect(Array.isArray(histRes.body.data)).toBe(true);
      expect(histRes.body.data.length).toBeGreaterThan(0);
    });
  });

  describe('AI Intelligence Pipeline & Structured Validation', () => {
    it('hybrid categorizer classifies dining transaction with high confidence', async () => {
      const result = await AIService.categorizeTransaction('Swiggy Order #8921 Bangalore', 450);
      expect(result.category).toBe('Food & Dining');
      expect(result.confidence).toBeGreaterThanOrEqual(90);
    });

    it('hybrid categorizer classifies recurring entertainment subscription', async () => {
      const result = await AIService.categorizeTransaction('Netflix India Monthly HD Subscription', 499);
      expect(result.category).toBe('Entertainment');
      expect(result.isRecurring).toBe(true);
    });

    it('generates Zod-validated monthly summary structure', async () => {
      const summary = await AIService.generateMonthlySummary('user-1', {
        overview: {
          totalIncome: 140000,
          totalExpenses: 65000,
          netCashFlow: 75000,
          savingsRate: 53,
        },
      });

      expect(summary.totalIncome).toBe(140000);
      expect(summary.totalExpenses).toBe(65000);
      expect(summary.actionItems.length).toBeGreaterThan(0);
    });

    it('generates Zod-validated budget recommendations', async () => {
      const recs = await AIService.generateBudgetRecommendations('user-1', {
        'Dining Out': 15000,
        Groceries: 20000,
      });

      expect(recs.length).toBe(2);
      expect(recs[0]).toHaveProperty('recommendedCap');
      expect(recs[0]).toHaveProperty('reasoning');
    });
  });
});
