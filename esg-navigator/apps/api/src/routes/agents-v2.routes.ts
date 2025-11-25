/**
 * Agent v2 API Routes
 * Express routes for accessing enhanced agent capabilities
 */

import { Router, Request, Response } from 'express';
import {
  agentManagerV2,
  initializeAgents,
  ESGAssessmentInputSchema,
  RecommendationInputSchema,
} from '../agents/v2';
import type {
  AgentInput,
  ESGAssessmentInput,
  RecommendationInput,
} from '../agents/v2';

const router = Router();

// Initialize agents on module load
initializeAgents();

/**
 * Helper to create agent context from request
 */
function createAgentContext(req: Request) {
  return {
    tenantId: (req as any).user?.tenantId || 'default-tenant',
    userId: (req as any).user?.id || (req as any).user?.userId || 'anonymous',
    requestId: crypto.randomUUID(),
    metadata: {
      ip: req.ip,
      userAgent: req.get('user-agent'),
      timestamp: new Date().toISOString(),
    },
  };
}

/**
 * GET /api/agents/v2
 * List all available v2 agents
 */
router.get('/', (req: Request, res: Response) => {
  try {
    const agents = agentManagerV2.list();
    const stats = agentManagerV2.getStats();

    res.json({
      success: true,
      data: {
        agents,
        stats,
        version: '2.0.0',
      },
    });
  } catch (error: any) {
    console.error('[AgentV2Routes] List error:', error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

/**
 * GET /api/agents/v2/stats
 * Get agent usage statistics
 */
router.get('/stats', (req: Request, res: Response) => {
  try {
    const stats = agentManagerV2.getStats();
    res.json({
      success: true,
      data: stats,
    });
  } catch (error: any) {
    console.error('[AgentV2Routes] Stats error:', error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

/**
 * POST /api/agents/v2/esg-assessment
 * Run comprehensive ESG assessment
 *
 * Body: ESGAssessmentInput
 */
router.post('/esg-assessment', async (req: Request, res: Response) => {
  try {
    // Validate input
    const validatedData = ESGAssessmentInputSchema.parse(req.body);

    // Create agent input
    const input: AgentInput<ESGAssessmentInput> = {
      data: validatedData,
      context: createAgentContext(req),
      options: {
        model: req.body.model,
        temperature: req.body.temperature,
        maxTokens: req.body.maxTokens,
      },
    };

    console.log(
      `[AgentV2Routes] ESG Assessment requested for supplier: ${validatedData.supplierId}`
    );

    // Execute agent
    const result = await agentManagerV2.execute(
      'esg-assessment-v2',
      input
    );

    res.json({
      success: true,
      data: result,
    });
  } catch (error: any) {
    console.error('[AgentV2Routes] ESG Assessment error:', error);

    // Handle validation errors
    if (error.name === 'ZodError') {
      return res.status(400).json({
        success: false,
        error: 'Validation error',
        details: error.errors,
      });
    }

    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

/**
 * POST /api/agents/v2/recommendations
 * Generate ESG improvement recommendations
 *
 * Body: RecommendationInput
 */
router.post('/recommendations', async (req: Request, res: Response) => {
  try {
    // Validate input
    const validatedData = RecommendationInputSchema.parse(req.body);

    // Create agent input
    const input: AgentInput<RecommendationInput> = {
      data: validatedData,
      context: createAgentContext(req),
      options: {
        model: req.body.model,
        temperature: req.body.temperature,
        maxTokens: req.body.maxTokens,
      },
    };

    console.log(
      `[AgentV2Routes] Recommendations requested for supplier: ${validatedData.supplierId}`
    );

    // Execute agent
    const result = await agentManagerV2.execute(
      'recommendation-agent',
      input
    );

    res.json({
      success: true,
      data: result,
    });
  } catch (error: any) {
    console.error('[AgentV2Routes] Recommendations error:', error);

    // Handle validation errors
    if (error.name === 'ZodError') {
      return res.status(400).json({
        success: false,
        error: 'Validation error',
        details: error.errors,
      });
    }

    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

/**
 * POST /api/agents/v2/execute/:agentName
 * Generic endpoint to execute any agent by name
 *
 * Params: agentName
 * Query: version (optional, defaults to 'latest')
 * Body: agent-specific input
 */
router.post('/execute/:agentName', async (req: Request, res: Response) => {
  try {
    const { agentName } = req.params;
    const version = (req.query.version as string) || 'latest';

    // Check if agent exists
    if (!agentManagerV2.has(agentName, version !== 'latest' ? version : undefined)) {
      return res.status(404).json({
        success: false,
        error: `Agent '${agentName}' not found`,
        availableAgents: agentManagerV2.list().map((a) => a.name),
      });
    }

    // Create agent input
    const input: AgentInput<any> = {
      data: req.body.data || req.body,
      context: createAgentContext(req),
      options: req.body.options,
    };

    console.log(`[AgentV2Routes] Executing agent: ${agentName}:${version}`);

    // Execute agent
    const result = await agentManagerV2.execute(agentName, input, { version });

    res.json({
      success: true,
      data: result,
    });
  } catch (error: any) {
    console.error('[AgentV2Routes] Execute error:', error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

export default router;
