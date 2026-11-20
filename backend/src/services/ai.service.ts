import { AIRouter } from './ai/ai.router.js';
import { AIModelRegistry } from './ai/ai.registry.js';
import { AICircuitBreaker } from './ai/ai.circuit-breaker.js';
import { FinancialToolsService } from './ai/ai.tools.js';
import { AIInsightsEngine } from './ai/ai.insights-engine.js';
import { supabaseAdminClient } from '../config/supabase.js';
import { logger } from '../utils/logger.js';
import { FinancialInsight } from '../types/index.js';

export interface FinancialContextPayload {
  overview?: {
    totalIncome: number;
    totalExpenses: number;
    netCashFlow: number;
    savingsRate: number;
  };
  budgets?: Array<{
    name: string;
    category: string;
    allocatedAmount: number;
    spent: number;
    remaining: number;
    utilizationPercentage: number;
    status: string;
  }>;
  savingsGoals?: Array<{
    name: string;
    category: string;
    targetAmount: number;
    currentAmount: number;
    targetDate: string;
    status: string;
  }>;
  topSpendingCategories?: Array<{
    category: string;
    amount: number;
    percentage: number;
  }>;
  recentTransactions?: Array<{
    description: string;
    amount: number;
    type: string;
    category: string;
    date: string;
  }>;
  currency?: string;
}

export interface AskCoachResponse {
  answer: string;
  sessionId?: string;
  card?: {
    type: 'SPENDING' | 'BUDGET' | 'SAVINGS' | 'CATEGORY';
    title: string;
    data: Record<string, any>;
  };
  modelUsed: string;
  providerUsed?: string;
  fallbackUsed?: boolean;
  isAiGrounded: boolean;
}

export class AIService {
  /**
   * Health and model telemetry for the AI Orchestration Engine
   */
  public static getStatus() {
    const eligibleModels = AIModelRegistry.getEligibleModels();
    const primary = eligibleModels[0];
    const circuitStates = AICircuitBreaker.getAllStates();

    return {
      isConfigured: eligibleModels.length > 0,
      model: primary?.modelId || 'nvidia/nemotron-3.5-lightning:free',
      provider: primary?.provider || 'openrouter',
      totalEligibleModels: eligibleModels.length,
      models: eligibleModels,
      circuitBreaker: circuitStates,
    };
  }

  /**
   * Generates evidence-backed financial insights persisted into Supabase DB
   */
  public static async generateInsights(
    userId: string,
    _spendingSummary?: Record<string, number>
  ): Promise<FinancialInsight[]> {
    const findings = await AIInsightsEngine.generateEvidenceBasedInsights(userId);

    return findings.map((f, idx) => ({
      id: `ins_${Date.now()}_${idx}`,
      userId,
      type: f.type === 'CRITICAL_ALERT' ? 'WARNING' : f.type === 'SAVINGS_OPPORTUNITY' ? 'TIP' : 'MILESTONE',
      title: f.title,
      description: f.description,
      actionableStep: f.actionLabel || 'Review financial metrics in SPENDX.',
      generatedAt: new Date().toISOString(),
    }));
  }

  /**
   * Natural language financial query processing with verified personal context and multi-model failover
   */
  public static async askCoach(
    userId: string,
    query: string,
    context?: FinancialContextPayload,
    history?: Array<{ role: 'user' | 'assistant' | 'model'; content: string }>,
    clientSessionId?: string
  ): Promise<AskCoachResponse> {
    // 1. Resolve or initialize persistent chat session in Supabase
    let sessionId = clientSessionId;
    if (supabaseAdminClient && userId) {
      try {
        if (!sessionId) {
          const { data: session } = await supabaseAdminClient
            .from('chat_sessions')
            .insert({
              user_id: userId,
              title: query.slice(0, 35) + '...',
            })
            .select()
            .single();
          sessionId = session?.id;
        }

        // Persist User message
        if (sessionId) {
          await supabaseAdminClient.from('chat_messages').insert({
            session_id: sessionId,
            user_id: userId,
            role: 'USER',
            content: query,
          });
        }
      } catch (sessErr) {
        logger.warn({ sessErr }, 'Failed persisting user message to Supabase chat');
      }
    }

    // 2. Identify and execute relevant financial tools
    const detectedTools = FinancialToolsService.detectRequiredTools(query);
    const toolResults: Record<string, any> = {};

    for (const tName of detectedTools) {
      const res = await FinancialToolsService.executeTool(tName, userId);
      if (res) {
        toolResults[tName] = res;
      }
    }

    // 3. Prepare grounded system prompt with authoritative database context
    const todayDate = new Date().toLocaleDateString('en-IN', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

    const systemPrompt = `You are SPENDX AI, a world-class AI assistant and personal financial intelligence coach (like ChatGPT).
Today is ${todayDate}. You are versatile, highly intelligent, friendly, and practical.

CORE CAPABILITIES & INSTRUCTIONS:
1. UNIVERSAL GENERAL AI ASSISTANCE (ANSWER ANY QUESTION):
   - You can answer ANY question the user asks, whether it is about finances, technology, coding, science, mathematics, general knowledge, daily life, writing, or casual conversation.
   - If the user asks a question outside personal finance (e.g., general knowledge, tech, code, ideas, explanation): Answer directly, accurately, and brilliantly like ChatGPT. NEVER refuse general questions and DO NOT force financial data into non-financial topics.

2. GROUNDED FINANCIAL SUPERPOWERS (WHEN ASKED ABOUT MONEY):
   - When the user asks about their finances, spending, budget, savings, accounts, or transactions: Carefully consult their verified personal financial data provided below as of today (${todayDate}).
   - Cite accurate numbers with currency symbols (e.g. ₹42,500). Never invent or hallucinate accounts or transactions.
   - If they have no recorded financial data yet, helpfully guide them to add their first account and transaction in SPENDX.

3. CONCISE, BEST-QUALITY RESPONSES (NOT OVERLY LONG):
   - Deliver high-impact, crisp, well-structured responses. Do not ramble or produce excessive fluff ("jayda bada nahi, bas best aur complete").
   - Use clean Markdown: bold essential terms, bullet points for clarity, and short paragraphs.

4. NATURAL MULTI-LINGUAL FLUENCY (HINDI / ENGLISH / HINGLISH):
   - If the user asks in Hindi or Hinglish (e.g., "kya haal hai", "aaj ka kharcha", "python me loop kaise chalaye", "kuch tip do"), respond fluently and naturally in Hinglish/Hindi!
   - If the user asks in English, respond in clear, articulate English.
   - Always match the user's conversational vibe and language naturally.

USER'S VERIFIED FINANCIAL DATA (AS OF TODAY):
${JSON.stringify({ clientContext: context || {}, toolResults }, null, 2)}
`;

    const mappedHistory: Array<{ role: 'user' | 'assistant'; content: string }> = (history || [])
      .map((h) => ({
        role: h.role === 'model' || h.role === 'assistant' ? 'assistant' : 'user',
        content: h.content,
      }));

    // 4. Route request through Multi-Model Orchestration Router with Automatic Failover
    const routeRes = await AIRouter.executeWithFailover({
      systemPrompt,
      userPrompt: query,
      history: mappedHistory,
      taskType: 'ASSISTANT_QUERY',
      userId,
    });

    const card = this.detectAnswerCard(query, context, toolResults);

    // 5. Persist Assistant message to Supabase
    if (supabaseAdminClient && sessionId && userId) {
      try {
        await supabaseAdminClient.from('chat_messages').insert({
          session_id: sessionId,
          user_id: userId,
          role: 'ASSISTANT',
          content: routeRes.content,
        });
      } catch (sessErr) {
        logger.warn({ sessErr }, 'Failed persisting assistant response to Supabase chat');
      }
    }

    return {
      answer: routeRes.content,
      sessionId,
      card,
      modelUsed: routeRes.modelUsed,
      providerUsed: routeRes.providerUsed,
      fallbackUsed: routeRes.fallbackUsed,
      isAiGrounded: true,
    };
  }

  /**
   * Retrieve all chat sessions for the user
   */
  public static async getChatSessions(userId: string) {
    if (!supabaseAdminClient) return [];
    const { data, error } = await supabaseAdminClient
      .from('chat_sessions')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      logger.error({ error, userId }, 'Failed fetching chat sessions');
      return [];
    }
    return data || [];
  }

  /**
   * Retrieve messages for a specific session
   */
  public static async getSessionMessages(userId: string, sessionId: string) {
    if (!supabaseAdminClient) return [];
    const { data, error } = await supabaseAdminClient
      .from('chat_messages')
      .select('*')
      .eq('session_id', sessionId)
      .eq('user_id', userId)
      .order('created_at', { ascending: true });

    if (error) {
      logger.error({ error, sessionId }, 'Failed fetching session messages');
      return [];
    }
    return data || [];
  }

  /**
   * Delete chat session
   */
  public static async deleteChatSession(userId: string, sessionId: string) {
    if (!supabaseAdminClient) return { success: false };
    const { error } = await supabaseAdminClient
      .from('chat_sessions')
      .delete()
      .eq('id', sessionId)
      .eq('user_id', userId);

    return { success: !error };
  }

  /**
   * Structured UI card detection
   */
  private static detectAnswerCard(
    query: string,
    context?: FinancialContextPayload,
    toolResults?: Record<string, any>
  ): AskCoachResponse['card'] | undefined {
    const q = query.toLowerCase();

    if (q.includes('spend') || q.includes('expense') || q.includes('burn')) {
      const ov = toolResults?.get_financial_overview || context?.overview;
      return {
        type: 'SPENDING',
        title: 'Spending Breakdown',
        data: {
          income: ov?.totalIncome || 0,
          expenses: ov?.totalExpenses || 0,
          net: ov?.netCashFlow || 0,
        },
      };
    }

    if (q.includes('budget') || q.includes('limit')) {
      const bg = toolResults?.get_budget_status || context?.budgets;
      if (bg && bg.length > 0) {
        return {
          type: 'BUDGET',
          title: 'Active Budgets Status',
          data: { budgets: bg },
        };
      }
    }

    if (q.includes('saving') || q.includes('goal')) {
      const sv = toolResults?.get_savings_progress || context?.savingsGoals;
      if (sv && sv.length > 0) {
        return {
          type: 'SAVINGS',
          title: 'Savings Milestones',
          data: { goals: sv },
        };
      }
    }

    if (q.includes('category') || q.includes('kaha')) {
      const cats = toolResults?.get_category_spending || context?.topSpendingCategories;
      if (cats && cats.length > 0) {
        return {
          type: 'CATEGORY',
          title: 'Top Categories',
          data: { categories: cats },
        };
      }
    }

    return undefined;
  }

  public static async categorizeTransaction(
    description: string,
    _amount?: number
  ): Promise<{ category: string; confidence: number; isRecurring?: boolean }> {
    const text = description.toLowerCase();
    if (text.includes('swiggy') || text.includes('zomato') || text.includes('dining') || text.includes('food') || text.includes('order')) {
      return { category: 'Food & Dining', confidence: 95, isRecurring: false };
    }
    if (text.includes('netflix') || text.includes('spotify') || text.includes('entertainment')) {
      return { category: 'Entertainment', confidence: 98, isRecurring: true };
    }
    if (text.includes('uber') || text.includes('ola') || text.includes('transport') || text.includes('fuel')) {
      return { category: 'Transportation', confidence: 92, isRecurring: false };
    }
    return { category: 'General', confidence: 80, isRecurring: false };
  }

  public static async generateMonthlySummary(
    _userId: string,
    data: any
  ): Promise<{ totalIncome: number; totalExpenses: number; actionItems: string[] }> {
    const totalIncome = data?.overview?.totalIncome ?? 0;
    const totalExpenses = data?.overview?.totalExpenses ?? 0;
    return {
      totalIncome,
      totalExpenses,
      actionItems: [
        'Maintain your current savings velocity',
        'Review discretionary entertainment subscriptions',
      ],
    };
  }

  public static async generateBudgetRecommendations(
    _userId: string,
    spendingMap: Record<string, number>
  ): Promise<Array<{ category: string; recommendedCap: number; reasoning: string }>> {
    return Object.entries(spendingMap).map(([category, amount]) => ({
      category,
      recommendedCap: Math.round(amount * 0.9),
      reasoning: `Based on your recent spend of ₹${amount}, optimizing by 10% increases your monthly savings buffer.`,
    }));
  }
}
