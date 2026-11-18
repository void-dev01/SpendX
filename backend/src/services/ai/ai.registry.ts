import { AIModelDescriptor } from './ai.types.js';
import { env, isConfigured } from '../../config/env.js';

export class AIModelRegistry {
  private static registeredModels: AIModelDescriptor[] = [
    {
      modelId: 'nvidia/nemotron-3.5-lightning:free',
      provider: 'openrouter',
      displayName: 'NVIDIA Nemotron 3.5 Lightning (Free Tier)',
      priority: 1,
      freeTierVerified: true,
      enabled: true,
      capabilities: ['text', 'structured_output', 'tool_calling'],
    },
    {
      modelId: 'liquid/lfm-3-1.7b:free',
      provider: 'openrouter',
      displayName: 'Liquid LFM 3 1.7B (Free Tier)',
      priority: 2,
      freeTierVerified: true,
      enabled: true,
      capabilities: ['text', 'structured_output'],
    },
    {
      modelId: 'particle-ai/particle-1:free',
      provider: 'openrouter',
      displayName: 'Particle AI 1 (Free Tier)',
      priority: 3,
      freeTierVerified: true,
      enabled: true,
      capabilities: ['text'],
    },
    {
      modelId: 'google/gemma-4-31b-it:free',
      provider: 'openrouter',
      displayName: 'Google Gemma 4 31B IT (Free Tier)',
      priority: 4,
      freeTierVerified: true,
      enabled: true,
      capabilities: ['text', 'structured_output'],
    },
  ];

  public static getEligibleModels(): AIModelDescriptor[] {
    const list = [...this.registeredModels];

    // If custom OPENROUTER_MODEL is set in .env and not already top priority, elevate it
    if (env.OPENROUTER_MODEL) {
      const existing = list.find((m) => m.modelId === env.OPENROUTER_MODEL);
      if (existing) {
        existing.priority = 0;
      } else {
        list.unshift({
          modelId: env.OPENROUTER_MODEL,
          provider: 'openrouter',
          displayName: env.OPENROUTER_MODEL,
          priority: 0,
          freeTierVerified: env.OPENROUTER_MODEL.includes(':free'),
          enabled: true,
          capabilities: ['text', 'structured_output', 'tool_calling'],
        });
      }
    }

    // If Gemini API Key is configured, append official Gemini model
    if (isConfigured.gemini && env.GEMINI_API_KEY) {
      list.unshift({
        modelId: 'gemini-2.5-flash',
        provider: 'gemini',
        displayName: 'Google Gemini 2.5 Flash',
        priority: 0,
        freeTierVerified: true,
        enabled: true,
        capabilities: ['text', 'structured_output', 'tool_calling'],
      });
    }

    return list.filter((m) => m.enabled).sort((a, b) => a.priority - b.priority);
  }
}
