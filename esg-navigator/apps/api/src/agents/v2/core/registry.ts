/**
 * Agent Registry v2
 * Registers and initializes all available agents
 */

import { agentManagerV2 } from './agent-manager-v2';

// Import agents
import { ESGAssessmentAgentV2 } from '../assessment/esg-assessment-agent-v2';
import { RecommendationAgent } from '../advisory/recommendation-agent';

/**
 * Initialize and register all v2 agents
 */
export function registerAgentsV2(): void {
  console.log('[AgentRegistry] Registering v2 agents...');

  // Assessment Agents
  agentManagerV2.register(new ESGAssessmentAgentV2());

  // Advisory Agents
  agentManagerV2.register(new RecommendationAgent());

  const stats = agentManagerV2.getStats();
  console.log('[AgentRegistry] Registration complete:', stats);
  console.log(`[AgentRegistry] Total agents: ${stats.total}`);
  console.log(
    `[AgentRegistry] By category:`,
    JSON.stringify(stats.categories, null, 2)
  );
}

/**
 * Get initialized agent manager
 */
export function getAgentManager() {
  return agentManagerV2;
}
