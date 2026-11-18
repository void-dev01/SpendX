import { env, isConfigured } from './env.js';
import { logger } from '../utils/logger.js';

export interface OpenRouterMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export class OpenRouterClient {
  private apiKey: string;
  public defaultModel: string;

  constructor(apiKey: string, defaultModel = 'nvidia/nemotron-3.5-lightning:free') {
    this.apiKey = apiKey;
    this.defaultModel = defaultModel;
  }

  async generateChatCompletion(messages: OpenRouterMessage[], model?: string): Promise<string> {
    const selectedModel = model || this.defaultModel;
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': env.FRONTEND_URL || 'http://localhost:5173',
        'X-Title': 'SPENDX Personal Finance',
      },
      body: JSON.stringify({
        model: selectedModel,
        messages,
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      logger.error({ status: response.status, errText }, 'OpenRouter API request failed');
      throw new Error(`OpenRouter error (${response.status}): ${errText}`);
    }

    const data = (await response.json()) as any;
    const content = data.choices?.[0]?.message?.content || '';
    return content;
  }
}

let openRouterClient: OpenRouterClient | null = null;

if (isConfigured.openrouter && env.OPENROUTER_API_KEY) {
  openRouterClient = new OpenRouterClient(env.OPENROUTER_API_KEY, env.OPENROUTER_MODEL);
  logger.info(`OpenRouter AI client initialized with model: ${env.OPENROUTER_MODEL}`);
} else {
  logger.warn('OpenRouter API key not provided.');
}

export { openRouterClient };
