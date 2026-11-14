import { geminiClient } from '../config/gemini.js';
import { logger } from '../utils/logger.js';
import { FinancialInsight } from '../types/index.js';

export class AIService {
  /**
   * Generates financial insights using Google Gemini SDK or rule-based heuristics if API key is not configured.
   */
  public static async generateInsights(userId: string, spendingSummary: Record<string, number>): Promise<FinancialInsight[]> {
    if (!geminiClient) {
      logger.info('Gemini client not configured. Returning deterministic financial heuristics.');
      return [
        {
          id: `ins_${Date.now()}_1`,
          userId,
          type: 'TIP',
          title: 'Budget Allocation Target',
          description: 'Aim for the 50/30/20 budget framework: 50% needs, 30% wants, and 20% savings.',
          actionableStep: 'Review recurring subscriptions and utility contracts to optimize monthly fixed costs.',
          generatedAt: new Date().toISOString(),
        },
        {
          id: `ins_${Date.now()}_2`,
          userId,
          type: 'MILESTONE',
          title: 'Emergency Fund Foundation',
          description: 'Building a 3 to 6 month emergency buffer safeguards your financial trajectory against sudden events.',
          actionableStep: 'Automate a weekly deposit of $50 toward your primary savings goal.',
          generatedAt: new Date().toISOString(),
        },
      ];
    }

    try {
      const prompt = `You are the SPENDX AI Financial Advisor. Analyze this monthly category spending summary:
${JSON.stringify(spendingSummary, null, 2)}

Provide two concise, actionable, high-impact financial insights formatted in JSON with the fields:
- title (string)
- description (string)
- type ("WARNING" | "TIP" | "MILESTONE" | "ANOMALY")
- actionableStep (string)`;

      const response = await geminiClient.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
      });

      const text = response.text || '';
      logger.debug({ text }, 'Received response from Gemini model');

      return [
        {
          id: `ins_${Date.now()}`,
          userId,
          type: 'TIP',
          title: 'AI Spend Optimization',
          description: text.slice(0, 200),
          actionableStep: 'Check your budget breakdown in the SPENDX dashboard.',
          generatedAt: new Date().toISOString(),
        },
      ];
    } catch (err) {
      logger.error({ err }, 'Error generating AI insights with Gemini');
      throw err;
    }
  }

  /**
   * Natural language financial query processing
   */
  public static async askCoach(_userId: string, query: string): Promise<string> {
    if (!geminiClient) {
      return `[SPENDX AI Coach (Standalone Mode)]: I received your question: "${query}". To unlock real-time Gemini AI intelligence, configure GEMINI_API_KEY in backend/.env.`;
    }

    try {
      const response = await geminiClient.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: `You are the SPENDX AI Personal Finance Coach. Answer the user query helpfully, encouraging wise spending, debt reduction, and disciplined investing: ${query}`,
      });

      return response.text || 'No response generated from AI Coach.';
    } catch (err) {
      logger.error({ err }, 'AI Coach conversation query failed');
      throw err;
    }
  }
}
