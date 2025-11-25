/**
 * Agent System v2 - Main Export
 * Enhanced agent architecture with comprehensive capabilities
 */

// Core exports
export { EnhancedBaseAgent } from './core/base-agent';
export { AgentManagerV2, agentManagerV2 } from './core/agent-manager-v2';
export { registerAgentsV2, getAgentManager } from './core/registry';

// Type exports
export type {
  AgentContext,
  AgentInput,
  AgentOptions,
  AgentOutput,
  AgentMetadata,
  AgentExecutionLog,
} from './core/types';

// Assessment agents
export {
  ESGAssessmentAgentV2,
  ESGAssessmentInputSchema,
  type ESGAssessmentInput,
  type ESGAssessmentOutput,
  type ESGScoreBreakdown,
  type ESGRisk,
} from './assessment/esg-assessment-agent-v2';

// Advisory agents
export {
  RecommendationAgent,
  RecommendationInputSchema,
  type RecommendationInput,
  type RecommendationOutput,
  type Recommendation,
} from './advisory/recommendation-agent';

/**
 * Initialize all agents on import
 * Call this once when the application starts
 */
export function initializeAgents(): void {
  registerAgentsV2();
  console.log('[AgentSystem] v2 initialized successfully');
}
