export type AIErrorCategory =
  | 'RATE_LIMIT_EXCEEDED'
  | 'QUOTA_EXHAUSTED'
  | 'CONTEXT_LENGTH_EXCEEDED'
  | 'OUTPUT_TOKEN_LIMIT'
  | 'MODEL_OVERLOADED'
  | 'PROVIDER_TIMEOUT'
  | 'AUTHENTICATION_FAILURE'
  | 'PERMISSION_OR_MODEL_ACCESS_ERROR'
  | 'INVALID_REQUEST'
  | 'CONTENT_OR_SAFETY_BLOCK'
  | 'UNKNOWN_PROVIDER_ERROR';

export interface AIModelDescriptor {
  modelId: string;
  provider: 'openrouter' | 'gemini';
  displayName: string;
  priority: number;
  freeTierVerified: boolean;
  enabled: boolean;
  capabilities: Array<'text' | 'structured_output' | 'tool_calling'>;
}

export interface AIRouteRequest {
  systemPrompt: string;
  userPrompt: string;
  history?: Array<{ role: 'user' | 'assistant'; content: string }>;
  taskType: 'ASSISTANT_QUERY' | 'COMPLEX_ANALYSIS' | 'INSIGHTS_GENERATION' | 'TOOL_CALLING';
  userId: string;
}

export interface AIRouteResponse {
  content: string;
  modelUsed: string;
  providerUsed: string;
  fallbackUsed: boolean;
  attemptsCount: number;
  toolCallsExecuted?: Array<{ tool: string; result: any }>;
  card?: {
    type: 'SPENDING' | 'BUDGET' | 'SAVINGS' | 'CATEGORY';
    title: string;
    data: Record<string, any>;
  };
}
