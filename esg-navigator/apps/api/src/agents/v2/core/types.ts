/**
 * Core types for Agent System v2
 * Enhanced agent architecture with full context, metadata, and monitoring
 */

export interface AgentContext {
  tenantId: string;
  userId: string;
  requestId: string;
  metadata?: Record<string, any>;
}

export interface AgentInput<T = any> {
  data: T;
  context: AgentContext;
  options?: AgentOptions;
}

export interface AgentOptions {
  model?: string;
  temperature?: number;
  maxTokens?: number;
  streaming?: boolean;
  timeout?: number;
}

export interface AgentOutput<T = any> {
  result: T;
  confidence: number;
  reasoning?: string;
  metadata: {
    executionTime: number;
    tokensUsed: {
      input: number;
      output: number;
      total: number;
    };
    model: string;
    cached?: boolean;
  };
  suggestions?: string[];
  warnings?: string[];
}

export interface AgentMetadata {
  name: string;
  version: string;
  description: string;
  category: 'assessment' | 'advisory' | 'operational' | 'intelligence';
  capabilities: string[];
}

export interface AgentExecutionLog {
  agentName: string;
  agentVersion: string;
  tenantId: string;
  userId: string;
  requestId: string;
  executionTime: number;
  tokensUsed: number;
  success: boolean;
  error?: string;
  timestamp: Date;
}
