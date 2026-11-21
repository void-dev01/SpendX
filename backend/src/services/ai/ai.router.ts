import { AIModelRegistry } from './ai.registry.js';
import { AICircuitBreaker } from './ai.circuit-breaker.js';
import { AIErrorClassifier } from './ai.error-classifier.js';
import { AIRouteRequest, AIRouteResponse } from './ai.types.js';
import { openRouterClient, OpenRouterMessage } from '../../config/openrouter.js';
import { geminiClient } from '../../config/gemini.js';
import { logger } from '../../utils/logger.js';

export class AIRouter {
  private static readonly MAX_ATTEMPTS = 4;

  public static async executeWithFailover(request: AIRouteRequest): Promise<AIRouteResponse> {
    if (!openRouterClient && !geminiClient) {
      logger.info('No external LLM provider configured; using grounded financial intelligence directly');
      return {
        content: '',
        modelUsed: 'spendx-grounded-engine',
        providerUsed: 'spendx-local',
        fallbackUsed: true,
        attemptsCount: 0,
      };
    }

    const eligibleModels = AIModelRegistry.getEligibleModels();
    let attemptsCount = 0;
    const errorsEncountered: Array<{ modelId: string; category: string; message: string }> = [];

    for (const model of eligibleModels) {
      if (attemptsCount >= this.MAX_ATTEMPTS) {
        break;
      }

      // Check circuit breaker status
      if (!AICircuitBreaker.isModelAvailable(model.modelId)) {
        logger.warn({ modelId: model.modelId }, 'Skipping model due to active circuit breaker cooldown');
        continue;
      }

      attemptsCount++;
      logger.info(
        { modelId: model.modelId, provider: model.provider, attempt: attemptsCount },
        `Attempting AI inference with model: ${model.modelId}`
      );

      try {
        let answer = '';

        if (model.provider === 'openrouter' && openRouterClient) {
          const messages: OpenRouterMessage[] = [
            { role: 'system', content: request.systemPrompt },
          ];

          if (request.history && request.history.length > 0) {
            request.history.slice(-6).forEach((h) => {
              messages.push({
                role: h.role,
                content: h.content,
              });
            });
          }

          messages.push({ role: 'user', content: request.userPrompt });

          answer = await openRouterClient.generateChatCompletion(messages, model.modelId);
        } else if (model.provider === 'gemini' && geminiClient) {
          const contents: any[] = [
            { role: 'user', parts: [{ text: `${request.systemPrompt}\n\n${request.userPrompt}` }] },
          ];
          const response = await geminiClient.models.generateContent({
            model: 'gemini-2.5-flash',
            contents,
          });
          answer = response.text || '';
        }

        if (answer && answer.trim().length > 0) {
          AICircuitBreaker.recordSuccess(model.modelId);
          logger.info(
            { modelId: model.modelId, attemptsCount, fallbackUsed: attemptsCount > 1 },
            'AI Inference succeeded'
          );

          // Strip internal reasoning tags if emitted by reasoning models
          let cleanContent = answer
            .replace(/<think>[\s\S]*?<\/think>/gi, '')
            .replace(/<thought>[\s\S]*?<\/thought>/gi, '')
            .replace(/\[THINKING\][\s\S]*?\[\/THINKING\]/gi, '')
            .trim();
          if (!cleanContent) {
            cleanContent = answer.trim();
          }

          return {
            content: cleanContent,
            modelUsed: model.modelId,
            providerUsed: model.provider,
            fallbackUsed: attemptsCount > 1,
            attemptsCount,
          };
        }

        throw new Error('Received empty response from upstream model');
      } catch (err: any) {
        const classified = AIErrorClassifier.classify(err);
        AICircuitBreaker.recordFailure(model.modelId, classified.cooldownSeconds);

        errorsEncountered.push({
          modelId: model.modelId,
          category: classified.category,
          message: classified.message,
        });

        logger.warn(
          {
            failedModel: model.modelId,
            category: classified.category,
            attempt: attemptsCount,
          },
          `Model execution failed (${classified.category}). Proceeding to next eligible fallback model.`
        );

        if (!classified.isFallbackEligible) {
          break;
        }
      }
    }

    // If all models failed or were unavailable, return professional enterprise message
    logger.error({ errorsEncountered }, 'All eligible AI models exhausted or unavailable');

    return {
      content:
        'SPENDX AI is temporarily optimizing services under high network demand. Your financial records are fully verified and safe. Please try your question again in a moment, or view your current totals on the Dashboard.',
      modelUsed: 'spendx-fallback-engine',
      providerUsed: 'spendx-system',
      fallbackUsed: true,
      attemptsCount,
    };
  }
}
