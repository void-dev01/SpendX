import { logger } from '../../utils/logger.js';

export type CircuitBreakerState = 'CLOSED' | 'OPEN' | 'HALF_OPEN';

interface CircuitState {
  state: CircuitBreakerState;
  failureCount: number;
  lastFailureAt: number;
  cooldownUntil: number;
  successCount: number;
}

export class AICircuitBreaker {
  private static circuits: Map<string, CircuitState> = new Map();
  private static readonly FAILURE_THRESHOLD = 2;

  public static isModelAvailable(modelId: string): boolean {
    const circuit = this.circuits.get(modelId);
    if (!circuit) return true;

    const now = Date.now();

    if (circuit.state === 'OPEN') {
      if (now >= circuit.cooldownUntil) {
        circuit.state = 'HALF_OPEN';
        logger.info({ modelId }, 'Circuit breaker transitioning from OPEN to HALF_OPEN');
        return true;
      }
      return false; // Still in cooldown
    }

    return true;
  }

  public static recordSuccess(modelId: string) {
    const circuit = this.circuits.get(modelId);
    if (circuit) {
      circuit.state = 'CLOSED';
      circuit.failureCount = 0;
      circuit.successCount += 1;
      logger.debug({ modelId }, 'Circuit breaker reset to CLOSED after successful inference');
    }
  }

  public static recordFailure(modelId: string, cooldownSeconds = 60) {
    let circuit = this.circuits.get(modelId);
    if (!circuit) {
      circuit = {
        state: 'CLOSED',
        failureCount: 0,
        lastFailureAt: Date.now(),
        cooldownUntil: 0,
        successCount: 0,
      };
      this.circuits.set(modelId, circuit);
    }

    circuit.failureCount += 1;
    circuit.lastFailureAt = Date.now();

    if (circuit.failureCount >= this.FAILURE_THRESHOLD || circuit.state === 'HALF_OPEN') {
      circuit.state = 'OPEN';
      circuit.cooldownUntil = Date.now() + cooldownSeconds * 1000;
      logger.warn(
        { modelId, cooldownSeconds },
        `Circuit breaker tripped to OPEN for model ${modelId}. Cooling down for ${cooldownSeconds}s.`
      );
    }
  }

  public static getAllStates(): Record<string, { state: CircuitBreakerState; failureCount: number; cooldownRemainingMs: number }> {
    const now = Date.now();
    const result: Record<string, any> = {};
    this.circuits.forEach((val, key) => {
      result[key] = {
        state: val.state,
        failureCount: val.failureCount,
        cooldownRemainingMs: Math.max(0, val.cooldownUntil - now),
      };
    });
    return result;
  }
}
