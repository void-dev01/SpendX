import { describe, it, expect, vi, beforeEach } from 'vitest';
import { AIErrorClassifier } from '../src/services/ai/ai.error-classifier.js';
import { AICircuitBreaker } from '../src/services/ai/ai.circuit-breaker.js';
import { AIModelRegistry } from '../src/services/ai/ai.registry.js';
import { FinancialToolsService } from '../src/services/ai/ai.tools.js';

describe('SPENDX Enterprise AI Orchestration & Failover Engine', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  describe('Error Classification & Normalization', () => {
    it('classifies HTTP 429 as RATE_LIMIT_EXCEEDED with fallback eligibility', () => {
      const error = new Error('HTTP 429: Too many requests on model');
      (error as any).status = 429;

      const classified = AIErrorClassifier.classify(error);
      expect(classified.category).toBe('RATE_LIMIT_EXCEEDED');
      expect(classified.isRetryable).toBe(true);
      expect(classified.isFallbackEligible).toBe(true);
      expect(classified.cooldownSeconds).toBe(45);
    });

    it('classifies HTTP 402 as QUOTA_EXHAUSTED with model cooldown', () => {
      const error = new Error('402 Payment Required: Free credits exhausted');
      (error as any).status = 402;

      const classified = AIErrorClassifier.classify(error);
      expect(classified.category).toBe('QUOTA_EXHAUSTED');
      expect(classified.isRetryable).toBe(false);
      expect(classified.isFallbackEligible).toBe(true);
      expect(classified.cooldownSeconds).toBe(300);
    });

    it('classifies HTTP 503 as MODEL_OVERLOADED with retry eligibility', () => {
      const error = new Error('503 Service Unavailable: Model is temporarily overloaded');
      (error as any).status = 503;

      const classified = AIErrorClassifier.classify(error);
      expect(classified.category).toBe('MODEL_OVERLOADED');
      expect(classified.isRetryable).toBe(true);
      expect(classified.isFallbackEligible).toBe(true);
    });

    it('classifies authentication errors as non-fallback eligible', () => {
      const error = new Error('401 Unauthorized: Invalid API Key');
      (error as any).status = 401;

      const classified = AIErrorClassifier.classify(error);
      expect(classified.category).toBe('AUTHENTICATION_FAILURE');
      expect(classified.isFallbackEligible).toBe(false);
    });
  });

  describe('Circuit Breaker Health Tracking', () => {
    it('allows requests when circuit is CLOSED and transitions to OPEN on repeated failures', () => {
      const testModel = 'test-model-alpha';
      expect(AICircuitBreaker.isModelAvailable(testModel)).toBe(true);

      // Record first failure
      AICircuitBreaker.recordFailure(testModel, 60);
      expect(AICircuitBreaker.isModelAvailable(testModel)).toBe(true);

      // Record second failure (hits threshold)
      AICircuitBreaker.recordFailure(testModel, 60);
      expect(AICircuitBreaker.isModelAvailable(testModel)).toBe(false);

      // Record success resets circuit
      AICircuitBreaker.recordSuccess(testModel);
      expect(AICircuitBreaker.isModelAvailable(testModel)).toBe(true);
    });
  });

  describe('Model Registry & Free Tier Priority', () => {
    it('returns prioritized eligible models sorted by priority', () => {
      const models = AIModelRegistry.getEligibleModels();
      expect(models.length).toBeGreaterThan(0);
      expect(models[0].freeTierVerified).toBe(true);

      for (let i = 0; i < models.length - 1; i++) {
        expect(models[i].priority).toBeLessThanOrEqual(models[i + 1].priority);
      }
    });
  });

  describe('Controlled Financial Tools Execution', () => {
    it('accurately detects required tools based on natural language query', () => {
      expect(FinancialToolsService.detectRequiredTools('How much did I spend on food?')).toContain('get_category_spending');
      expect(FinancialToolsService.detectRequiredTools('What is my bank account balance?')).toContain('get_account_balances');
      expect(FinancialToolsService.detectRequiredTools('Why is my budget almost full?')).toContain('get_budget_status');
      expect(FinancialToolsService.detectRequiredTools('Compare this month with last month')).toContain('compare_financial_periods');
      expect(FinancialToolsService.detectRequiredTools('How much have I saved toward emergency fund?')).toContain('get_savings_progress');
      expect(FinancialToolsService.detectRequiredTools('What bills are upcoming?')).toContain('get_recurring_payments');
    });

    it('gracefully executes tools with fallback when database is in test mock mode', async () => {
      const res = await FinancialToolsService.executeTool('get_financial_overview', 'test-user-id');
      expect(res).toBeDefined();
      expect(res.totalIncome).toBeDefined();
      expect(res.totalExpenses).toBeDefined();
    });
  });
});
