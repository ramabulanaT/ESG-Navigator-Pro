/**
 * IBM WatsonX Orchestrate Integration Types
 *
 * @description Type definitions for WatsonX Orchestrate API integration
 * @see https://www.ibm.com/products/watsonx-orchestrate
 */

export interface WatsonXConfig {
  apiKey: string;
  serviceUrl: string;
  projectId: string;
  version?: string;
}

export interface WatsonXOrchestrationRequest {
  input: string;
  context?: Record<string, any>;
  parameters?: {
    temperature?: number;
    max_tokens?: number;
    model?: string;
  };
}

export interface WatsonXOrchestrationResponse {
  output: string;
  metadata: {
    model: string;
    tokens_used: number;
    timestamp: string;
  };
}

export interface WatsonXSkill {
  id: string;
  name: string;
  description: string;
  category: 'esg' | 'compliance' | 'reporting' | 'analytics';
  enabled: boolean;
}
