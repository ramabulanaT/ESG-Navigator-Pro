/**
 * IBM Integrations Hub
 *
 * @description Central export point for all IBM product integrations
 */

// WatsonX Orchestrate
export {
  WatsonXOrchestrateClient,
  createWatsonXClient,
} from './watsonx/orchestrate';

export type {
  WatsonXConfig,
  WatsonXOrchestrationRequest,
  WatsonXOrchestrationResponse,
  WatsonXSkill,
} from './watsonx/types';

// Envizi ESG Suite
export {
  EnviziClient,
  createEnviziClient,
} from './envizi/client';

export type {
  EnviziConfig,
  EnviziMetric,
  EnviziEmissionsData,
  EnviziComplianceReport,
  EnviziSyncRequest,
  EnviziSyncResponse,
} from './envizi/types';
