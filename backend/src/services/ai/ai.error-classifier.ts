import { AIErrorCategory } from './ai.types.js';

export interface ClassifiedAIError {
  category: AIErrorCategory;
  message: string;
  isRetryable: boolean;
  isFallbackEligible: boolean;
  cooldownSeconds: number;
}

export class AIErrorClassifier {
  public static classify(err: any): ClassifiedAIError {
    const msg = String(err?.message || err || '').toLowerCase();
    const status = err?.status || err?.statusCode || (msg.includes('429') ? 429 : msg.includes('402') ? 402 : 500);

    if (status === 429 || msg.includes('rate limit') || msg.includes('rate-limited') || msg.includes('too many requests')) {
      return {
        category: 'RATE_LIMIT_EXCEEDED',
        message: 'Upstream rate limit reached on current model',
        isRetryable: true,
        isFallbackEligible: true,
        cooldownSeconds: 45,
      };
    }

    if (status === 402 || msg.includes('payment required') || msg.includes('quota') || msg.includes('credits')) {
      return {
        category: 'QUOTA_EXHAUSTED',
        message: 'Free tier quota exhausted for this model identifier',
        isRetryable: false,
        isFallbackEligible: true,
        cooldownSeconds: 300,
      };
    }

    if (status === 503 || status === 502 || msg.includes('overloaded') || msg.includes('service unavailable')) {
      return {
        category: 'MODEL_OVERLOADED',
        message: 'Upstream AI model is temporarily overloaded',
        isRetryable: true,
        isFallbackEligible: true,
        cooldownSeconds: 30,
      };
    }

    if (msg.includes('timeout') || msg.includes('timed out') || msg.includes('econnreset')) {
      return {
        category: 'PROVIDER_TIMEOUT',
        message: 'Model request timed out',
        isRetryable: true,
        isFallbackEligible: true,
        cooldownSeconds: 15,
      };
    }

    if (msg.includes('context length') || msg.includes('maximum context') || msg.includes('token limit')) {
      return {
        category: 'CONTEXT_LENGTH_EXCEEDED',
        message: 'Prompt exceeds context limits',
        isRetryable: false,
        isFallbackEligible: true,
        cooldownSeconds: 0,
      };
    }

    if (status === 401 || status === 403 || msg.includes('invalid api key') || msg.includes('unauthorized')) {
      return {
        category: 'AUTHENTICATION_FAILURE',
        message: 'API Key authentication failure',
        isRetryable: false,
        isFallbackEligible: false,
        cooldownSeconds: 600,
      };
    }

    return {
      category: 'UNKNOWN_PROVIDER_ERROR',
      message: 'Unexpected upstream provider response',
      isRetryable: true,
      isFallbackEligible: true,
      cooldownSeconds: 20,
    };
  }
}
