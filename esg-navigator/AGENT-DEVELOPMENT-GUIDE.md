# ESG Navigator - Agent Development Guide

> **Strategic Initiative**: Building AI-powered agents for autonomous ESG assessment, advisory, and operational tasks

---

## Table of Contents

1. [Overview](#overview)
2. [Agent Architecture](#agent-architecture)
3. [Core Components](#core-components)
4. [Agent Types](#agent-types)
5. [Implementation Guide](#implementation-guide)
6. [Best Practices](#best-practices)
7. [Testing & Quality](#testing--quality)
8. [Deployment](#deployment)
9. [Monitoring & Optimization](#monitoring--optimization)
10. [Roadmap](#roadmap)

---

## Overview

### What are Agents?

Agents are autonomous AI-powered services that can:
- **Perceive**: Understand context from data and user input
- **Reason**: Make decisions based on domain knowledge
- **Act**: Execute tasks and provide recommendations
- **Learn**: Improve over time through feedback

### Why Agents for ESG Navigator?

Traditional rule-based systems struggle with:
- ❌ Complex, nuanced ESG scenarios
- ❌ Evolving regulatory landscapes
- ❌ Subjective assessment criteria
- ❌ Large volumes of unstructured data

**Agent-based systems excel at:**
- ✅ Natural language understanding
- ✅ Contextual decision-making
- ✅ Handling ambiguity and edge cases
- ✅ Scaling personalized insights
- ✅ Continuous improvement

### Business Value

| Traditional Approach | Agent-Based Approach |
|---------------------|---------------------|
| Manual ESG assessments (2-5 days) | Automated assessments (minutes) |
| Fixed assessment templates | Dynamic, context-aware evaluation |
| Generic recommendations | Personalized action plans |
| Reactive compliance | Proactive risk identification |
| Limited scalability | Unlimited concurrent assessments |

---

## Agent Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────┐
│                     ESG Navigator                        │
│                    (Web Application)                     │
└───────────────────────┬─────────────────────────────────┘
                        │
                        │ REST API / GraphQL
                        │
┌───────────────────────▼─────────────────────────────────┐
│                  Agent Manager                           │
│  - Route requests to appropriate agents                  │
│  - Orchestrate multi-agent workflows                     │
│  - Manage agent lifecycle and versioning                 │
└───────────────────────┬─────────────────────────────────┘
                        │
        ┌───────────────┼───────────────┐
        │               │               │
        ▼               ▼               ▼
┌─────────────┐ ┌─────────────┐ ┌─────────────┐
│ Assessment  │ │   Advisory  │ │ Operational │
│   Agents    │ │   Agents    │ │   Agents    │
├─────────────┤ ├─────────────┤ ├─────────────┤
│ - ESG Score │ │ - Recommend │ │ - Data Coll │
│ - Compliance│ │ - Remediate │ │ - Report    │
│ - Risk Eval │ │ - Strategy  │ │ - Notify    │
└─────────────┘ └─────────────┘ └─────────────┘
        │               │               │
        └───────────────┼───────────────┘
                        │
        ┌───────────────┼───────────────┐
        │               │               │
        ▼               ▼               ▼
┌─────────────┐ ┌─────────────┐ ┌─────────────┐
│  Claude API │ │   Database  │ │   Queue     │
│  (Anthropic)│ │ (PostgreSQL)│ │   (Redis)   │
└─────────────┘ └─────────────┘ └─────────────┘
```

### Technology Stack

```typescript
// Core Technologies
{
  "framework": "Next.js 14+ (App Router)",
  "language": "TypeScript 5+",
  "ai": "Anthropic Claude API",
  "database": "PostgreSQL with Prisma",
  "queue": "Redis / BullMQ",
  "cache": "Redis",
  "validation": "Zod",
  "testing": "Jest + Playwright"
}
```

---

## Core Components

### 1. Agent Base Class

```typescript
// /apps/api/src/agents/core/agent-base.ts

import Anthropic from '@anthropic-ai/sdk';
import { z } from 'zod';

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
}

export interface AgentOutput<T = any> {
  result: T;
  confidence: number;
  reasoning?: string;
  metadata: {
    executionTime: number;
    tokensUsed: number;
    model: string;
  };
  suggestions?: string[];
}

export abstract class BaseAgent<TInput = any, TOutput = any> {
  protected anthropic: Anthropic;
  protected readonly name: string;
  protected readonly version: string;
  protected readonly description: string;

  constructor(config: {
    name: string;
    version: string;
    description: string;
  }) {
    this.name = config.name;
    this.version = config.version;
    this.description = config.description;
    this.anthropic = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
    });
  }

  /**
   * Main execution method - must be implemented by each agent
   */
  abstract execute(
    input: AgentInput<TInput>
  ): Promise<AgentOutput<TOutput>>;

  /**
   * Validate input data
   */
  protected abstract validateInput(data: TInput): boolean;

  /**
   * Build the system prompt for Claude
   */
  protected abstract buildSystemPrompt(): string;

  /**
   * Build the user prompt from input data
   */
  protected abstract buildUserPrompt(data: TInput): string;

  /**
   * Parse Claude's response into structured output
   */
  protected abstract parseResponse(response: string): TOutput;

  /**
   * Call Claude API with retry logic
   */
  protected async callClaude(
    systemPrompt: string,
    userPrompt: string,
    options?: AgentOptions
  ): Promise<{ content: string; usage: { input_tokens: number; output_tokens: number } }> {
    const startTime = Date.now();

    try {
      const response = await this.anthropic.messages.create({
        model: options?.model || 'claude-3-5-sonnet-20241022',
        max_tokens: options?.maxTokens || 4096,
        temperature: options?.temperature || 0.7,
        system: systemPrompt,
        messages: [
          {
            role: 'user',
            content: userPrompt,
          },
        ],
      });

      const content = response.content[0];
      if (content.type !== 'text') {
        throw new Error('Unexpected response type from Claude');
      }

      return {
        content: content.text,
        usage: {
          input_tokens: response.usage.input_tokens,
          output_tokens: response.usage.output_tokens,
        },
      };
    } catch (error) {
      console.error(`[${this.name}] Claude API error:`, error);
      throw error;
    }
  }

  /**
   * Log agent execution for monitoring
   */
  protected async logExecution(
    context: AgentContext,
    input: TInput,
    output: AgentOutput<TOutput>,
    error?: Error
  ): Promise<void> {
    // TODO: Implement logging to database or monitoring service
    console.log({
      agent: this.name,
      version: this.version,
      tenantId: context.tenantId,
      userId: context.userId,
      requestId: context.requestId,
      executionTime: output.metadata.executionTime,
      tokensUsed: output.metadata.tokensUsed,
      success: !error,
      error: error?.message,
      timestamp: new Date().toISOString(),
    });
  }
}
```

### 2. Agent Manager

```typescript
// /apps/api/src/agents/core/agent-manager.ts

import { BaseAgent } from './agent-base';

export class AgentManager {
  private agents: Map<string, BaseAgent> = new Map();

  /**
   * Register an agent
   */
  register(agent: BaseAgent): void {
    const key = `${agent.name}:${agent.version}`;
    this.agents.set(key, agent);
    console.log(`[AgentManager] Registered agent: ${key}`);
  }

  /**
   * Get an agent by name and version
   */
  get(name: string, version: string = 'latest'): BaseAgent {
    const key = version === 'latest'
      ? this.getLatestVersion(name)
      : `${name}:${version}`;

    const agent = this.agents.get(key);
    if (!agent) {
      throw new Error(`Agent not found: ${key}`);
    }
    return agent;
  }

  /**
   * Execute an agent by name
   */
  async execute<TInput, TOutput>(
    name: string,
    input: any,
    options?: { version?: string }
  ): Promise<TOutput> {
    const agent = this.get(name, options?.version);
    const result = await agent.execute(input);
    return result.result;
  }

  /**
   * List all registered agents
   */
  list(): Array<{ name: string; version: string; description: string }> {
    return Array.from(this.agents.values()).map(agent => ({
      name: agent.name,
      version: agent.version,
      description: agent.description,
    }));
  }

  /**
   * Get the latest version of an agent
   */
  private getLatestVersion(name: string): string {
    const versions = Array.from(this.agents.keys())
      .filter(key => key.startsWith(`${name}:`))
      .sort()
      .reverse();

    if (versions.length === 0) {
      throw new Error(`No versions found for agent: ${name}`);
    }

    return versions[0];
  }
}

// Singleton instance
export const agentManager = new AgentManager();
```

### 3. Agent Registry

```typescript
// /apps/api/src/agents/core/agent-registry.ts

import { agentManager } from './agent-manager';

// Assessment Agents
import { ESGAssessmentAgent } from '../assessment/esg-assessment-agent';
import { ComplianceAgent } from '../assessment/compliance-agent';
import { RiskAssessmentAgent } from '../assessment/risk-assessment-agent';

// Advisory Agents
import { RecommendationAgent } from '../advisory/recommendation-agent';
import { RemediationAgent } from '../advisory/remediation-agent';

// Operational Agents
import { DataCollectionAgent } from '../operational/data-collection-agent';
import { ReportGenerationAgent } from '../operational/report-generation-agent';

/**
 * Initialize and register all agents
 */
export function registerAgents(): void {
  // Assessment Agents
  agentManager.register(new ESGAssessmentAgent());
  agentManager.register(new ComplianceAgent());
  agentManager.register(new RiskAssessmentAgent());

  // Advisory Agents
  agentManager.register(new RecommendationAgent());
  agentManager.register(new RemediationAgent());

  // Operational Agents
  agentManager.register(new DataCollectionAgent());
  agentManager.register(new ReportGenerationAgent());

  console.log('[AgentRegistry] All agents registered');
}
```

---

## Agent Types

### 1. ESG Assessment Agent

**Purpose**: Evaluate suppliers on Environmental, Social, and Governance criteria

```typescript
// /apps/api/src/agents/assessment/esg-assessment-agent.ts

import { BaseAgent, AgentInput, AgentOutput } from '../core/agent-base';
import { z } from 'zod';

// Input schema
const ESGAssessmentInputSchema = z.object({
  supplierId: z.string().uuid(),
  supplierName: z.string(),
  industry: z.string(),
  country: z.string(),
  documents: z.array(z.object({
    type: z.enum(['sustainability_report', 'policy', 'certificate', 'other']),
    content: z.string(),
    year: z.number().optional(),
  })),
  previousScore: z.number().min(0).max(100).optional(),
});

type ESGAssessmentInput = z.infer<typeof ESGAssessmentInputSchema>;

// Output schema
interface ESGAssessmentOutput {
  overallScore: number;
  scores: {
    environmental: {
      score: number;
      subcategories: {
        carbonEmissions: number;
        wasteManagement: number;
        resourceEfficiency: number;
        biodiversity: number;
      };
    };
    social: {
      score: number;
      subcategories: {
        laborPractices: number;
        humanRights: number;
        communityImpact: number;
        diversityInclusion: number;
      };
    };
    governance: {
      score: number;
      subcategories: {
        boardStructure: number;
        ethics: number;
        transparency: number;
        compliance: number;
      };
    };
  };
  strengths: string[];
  weaknesses: string[];
  risks: Array<{
    category: string;
    severity: 'low' | 'medium' | 'high' | 'critical';
    description: string;
  }>;
  trend: 'improving' | 'stable' | 'declining' | 'insufficient_data';
}

export class ESGAssessmentAgent extends BaseAgent<
  ESGAssessmentInput,
  ESGAssessmentOutput
> {
  constructor() {
    super({
      name: 'esg-assessment',
      version: '1.0.0',
      description: 'Comprehensive ESG assessment for suppliers',
    });
  }

  async execute(
    input: AgentInput<ESGAssessmentInput>
  ): Promise<AgentOutput<ESGAssessmentOutput>> {
    const startTime = Date.now();

    // Validate input
    if (!this.validateInput(input.data)) {
      throw new Error('Invalid input data');
    }

    // Build prompts
    const systemPrompt = this.buildSystemPrompt();
    const userPrompt = this.buildUserPrompt(input.data);

    // Call Claude
    const response = await this.callClaude(
      systemPrompt,
      userPrompt,
      input.options
    );

    // Parse response
    const result = this.parseResponse(response.content);

    // Calculate confidence based on data completeness
    const confidence = this.calculateConfidence(input.data);

    const output: AgentOutput<ESGAssessmentOutput> = {
      result,
      confidence,
      reasoning: this.extractReasoning(response.content),
      metadata: {
        executionTime: Date.now() - startTime,
        tokensUsed: response.usage.input_tokens + response.usage.output_tokens,
        model: input.options?.model || 'claude-3-5-sonnet-20241022',
      },
      suggestions: this.generateSuggestions(result),
    };

    // Log execution
    await this.logExecution(input.context, input.data, output);

    return output;
  }

  protected validateInput(data: ESGAssessmentInput): boolean {
    try {
      ESGAssessmentInputSchema.parse(data);
      return true;
    } catch (error) {
      console.error('[ESGAssessmentAgent] Validation error:', error);
      return false;
    }
  }

  protected buildSystemPrompt(): string {
    return `You are an expert ESG (Environmental, Social, Governance) analyst with deep knowledge of:
- International ESG standards (GRI, SASB, TCFD, CDP)
- Industry-specific ESG criteria and benchmarks
- Regulatory requirements across different jurisdictions
- Supply chain sustainability best practices

Your role is to analyze supplier documentation and data to provide:
1. Comprehensive ESG scores across all dimensions
2. Detailed subcategory assessments
3. Identification of strengths and weaknesses
4. Risk assessment with severity levels
5. Trend analysis when historical data is available

Scoring Guidelines:
- 0-25: Poor - Major concerns, immediate action required
- 26-50: Below Average - Significant improvements needed
- 51-75: Average - Meets basic standards, room for improvement
- 76-90: Good - Strong performance, minor enhancements possible
- 91-100: Excellent - Industry leader, best practices demonstrated

Always provide:
- Evidence-based assessments
- Specific examples from documents
- Actionable insights
- Context-aware analysis based on industry and region

Output your analysis as a JSON object with the exact structure specified in the user prompt.`;
  }

  protected buildUserPrompt(data: ESGAssessmentInput): string {
    const documentsText = data.documents
      .map(
        (doc, idx) =>
          `Document ${idx + 1} [${doc.type}]${doc.year ? ` (${doc.year})` : ''}:\n${doc.content.substring(0, 2000)}`
      )
      .join('\n\n');

    return `Analyze the following supplier for ESG performance:

**Supplier Information:**
- Name: ${data.supplierName}
- ID: ${data.supplierId}
- Industry: ${data.industry}
- Country: ${data.country}
${data.previousScore ? `- Previous ESG Score: ${data.previousScore}/100` : ''}

**Documents Provided:**
${documentsText}

Please provide a comprehensive ESG assessment with the following JSON structure:

\`\`\`json
{
  "overallScore": <number 0-100>,
  "scores": {
    "environmental": {
      "score": <number 0-100>,
      "subcategories": {
        "carbonEmissions": <number 0-100>,
        "wasteManagement": <number 0-100>,
        "resourceEfficiency": <number 0-100>,
        "biodiversity": <number 0-100>
      }
    },
    "social": {
      "score": <number 0-100>,
      "subcategories": {
        "laborPractices": <number 0-100>,
        "humanRights": <number 0-100>,
        "communityImpact": <number 0-100>,
        "diversityInclusion": <number 0-100>
      }
    },
    "governance": {
      "score": <number 0-100>,
      "subcategories": {
        "boardStructure": <number 0-100>,
        "ethics": <number 0-100>,
        "transparency": <number 0-100>,
        "compliance": <number 0-100>
      }
    }
  },
  "strengths": ["strength 1", "strength 2", "..."],
  "weaknesses": ["weakness 1", "weakness 2", "..."],
  "risks": [
    {
      "category": "environmental|social|governance",
      "severity": "low|medium|high|critical",
      "description": "detailed risk description"
    }
  ],
  "trend": "improving|stable|declining|insufficient_data"
}
\`\`\`

Provide your response as valid JSON only, with no additional commentary.`;
  }

  protected parseResponse(response: string): ESGAssessmentOutput {
    try {
      // Extract JSON from response (handles markdown code blocks)
      const jsonMatch = response.match(/```json\n([\s\S]*?)\n```/) ||
                        response.match(/```\n([\s\S]*?)\n```/) ||
                        [null, response];

      const jsonStr = jsonMatch[1] || response;
      const parsed = JSON.parse(jsonStr.trim());

      // Validate structure
      if (!parsed.overallScore || !parsed.scores) {
        throw new Error('Invalid response structure');
      }

      return parsed as ESGAssessmentOutput;
    } catch (error) {
      console.error('[ESGAssessmentAgent] Failed to parse response:', error);
      throw new Error('Failed to parse Claude response');
    }
  }

  private calculateConfidence(data: ESGAssessmentInput): number {
    let confidence = 50; // Base confidence

    // More documents = higher confidence
    confidence += Math.min(data.documents.length * 10, 30);

    // Recent documents boost confidence
    const recentDocs = data.documents.filter(
      doc => doc.year && doc.year >= new Date().getFullYear() - 2
    );
    confidence += Math.min(recentDocs.length * 5, 15);

    // Historical data available
    if (data.previousScore !== undefined) {
      confidence += 5;
    }

    return Math.min(confidence, 100);
  }

  private extractReasoning(response: string): string {
    // In future, we could ask Claude to provide reasoning separately
    return 'Assessment based on provided documentation and industry standards.';
  }

  private generateSuggestions(result: ESGAssessmentOutput): string[] {
    const suggestions: string[] = [];

    // Suggest focus areas based on low scores
    const allScores = [
      { name: 'Environmental', score: result.scores.environmental.score },
      { name: 'Social', score: result.scores.social.score },
      { name: 'Governance', score: result.scores.governance.score },
    ];

    const lowestScore = allScores.sort((a, b) => a.score - b.score)[0];
    if (lowestScore.score < 60) {
      suggestions.push(
        `Focus on improving ${lowestScore.name} performance (current score: ${lowestScore.score}/100)`
      );
    }

    // Suggest action on critical risks
    const criticalRisks = result.risks.filter(r => r.severity === 'critical');
    if (criticalRisks.length > 0) {
      suggestions.push(
        `Address ${criticalRisks.length} critical risk(s) immediately`
      );
    }

    // Trend-based suggestions
    if (result.trend === 'declining') {
      suggestions.push('ESG performance is declining - conduct gap analysis');
    }

    return suggestions;
  }
}
```

### 2. Recommendation Agent

**Purpose**: Provide actionable recommendations based on assessment results

```typescript
// /apps/api/src/agents/advisory/recommendation-agent.ts

import { BaseAgent, AgentInput, AgentOutput } from '../core/agent-base';
import { z } from 'zod';

const RecommendationInputSchema = z.object({
  supplierId: z.string().uuid(),
  esgAssessment: z.object({
    overallScore: z.number(),
    scores: z.any(),
    weaknesses: z.array(z.string()),
    risks: z.array(z.any()),
  }),
  industry: z.string(),
  budget: z.enum(['low', 'medium', 'high']).optional(),
  timeline: z.enum(['immediate', 'short_term', 'long_term']).optional(),
});

type RecommendationInput = z.infer<typeof RecommendationInputSchema>;

interface Recommendation {
  id: string;
  priority: 'critical' | 'high' | 'medium' | 'low';
  category: 'environmental' | 'social' | 'governance';
  title: string;
  description: string;
  expectedImpact: {
    scoreImprovement: number;
    riskReduction: string;
  };
  implementation: {
    steps: string[];
    estimatedCost: 'low' | 'medium' | 'high';
    timeline: string;
    resources: string[];
  };
  kpis: string[];
}

interface RecommendationOutput {
  recommendations: Recommendation[];
  quickWins: Recommendation[];
  strategicInitiatives: Recommendation[];
  estimatedOverallImprovement: number;
}

export class RecommendationAgent extends BaseAgent<
  RecommendationInput,
  RecommendationOutput
> {
  constructor() {
    super({
      name: 'recommendation',
      version: '1.0.0',
      description: 'Generate actionable ESG improvement recommendations',
    });
  }

  async execute(
    input: AgentInput<RecommendationInput>
  ): Promise<AgentOutput<RecommendationOutput>> {
    const startTime = Date.now();

    if (!this.validateInput(input.data)) {
      throw new Error('Invalid input data');
    }

    const systemPrompt = this.buildSystemPrompt();
    const userPrompt = this.buildUserPrompt(input.data);

    const response = await this.callClaude(
      systemPrompt,
      userPrompt,
      input.options
    );

    const result = this.parseResponse(response.content);

    const output: AgentOutput<RecommendationOutput> = {
      result,
      confidence: 85, // Recommendations are generally high confidence
      metadata: {
        executionTime: Date.now() - startTime,
        tokensUsed: response.usage.input_tokens + response.usage.output_tokens,
        model: input.options?.model || 'claude-3-5-sonnet-20241022',
      },
    };

    await this.logExecution(input.context, input.data, output);

    return output;
  }

  protected validateInput(data: RecommendationInput): boolean {
    try {
      RecommendationInputSchema.parse(data);
      return true;
    } catch (error) {
      console.error('[RecommendationAgent] Validation error:', error);
      return false;
    }
  }

  protected buildSystemPrompt(): string {
    return `You are an ESG strategy consultant specializing in practical, actionable recommendations for supplier improvement.

Your expertise includes:
- ESG improvement strategies tailored to specific industries
- Cost-effective implementation approaches
- Quick wins vs. long-term strategic initiatives
- Resource allocation and prioritization
- Change management and stakeholder engagement
- Measurable KPIs and impact assessment

Guidelines:
- Prioritize recommendations by impact and feasibility
- Provide specific, actionable steps
- Consider budget and timeline constraints
- Balance quick wins with strategic improvements
- Ensure recommendations are measurable
- Tailor advice to industry context

Output format: JSON with detailed recommendation objects.`;
  }

  protected buildUserPrompt(data: RecommendationInput): string {
    return `Generate ESG improvement recommendations for the following supplier:

**Supplier Context:**
- ID: ${data.supplierId}
- Industry: ${data.industry}
${data.budget ? `- Budget: ${data.budget}` : ''}
${data.timeline ? `- Timeline: ${data.timeline}` : ''}

**Current ESG Assessment:**
- Overall Score: ${data.esgAssessment.overallScore}/100
- Weaknesses: ${data.esgAssessment.weaknesses.join(', ')}
- Risks: ${data.esgAssessment.risks.length} identified

Provide comprehensive recommendations in the following JSON structure:

\`\`\`json
{
  "recommendations": [...],
  "quickWins": [...],
  "strategicInitiatives": [...],
  "estimatedOverallImprovement": <number>
}
\`\`\`

Each recommendation should include:
- id, priority, category, title, description
- expectedImpact: { scoreImprovement, riskReduction }
- implementation: { steps[], estimatedCost, timeline, resources[] }
- kpis: [...]`;
  }

  protected parseResponse(response: string): RecommendationOutput {
    try {
      const jsonMatch = response.match(/```json\n([\s\S]*?)\n```/) ||
                        [null, response];
      const jsonStr = jsonMatch[1] || response;
      return JSON.parse(jsonStr.trim()) as RecommendationOutput;
    } catch (error) {
      console.error('[RecommendationAgent] Parse error:', error);
      throw new Error('Failed to parse recommendations');
    }
  }
}
```

---

## Implementation Guide

### Step 1: Setup Agent Infrastructure

```bash
# Create directory structure
cd esg-navigator/apps/api/src
mkdir -p agents/{core,assessment,advisory,operational,intelligence}

# Install dependencies
npm install @anthropic-ai/sdk zod bullmq ioredis
npm install -D @types/node
```

### Step 2: Configure Environment

```bash
# .env.local
ANTHROPIC_API_KEY=sk-ant-xxxxx
REDIS_URL=redis://localhost:6379
DATABASE_URL=postgresql://...

# Agent Configuration
AGENT_DEFAULT_MODEL=claude-3-5-sonnet-20241022
AGENT_MAX_RETRIES=3
AGENT_TIMEOUT_MS=30000
```

### Step 3: Initialize Agents in API

```typescript
// /apps/api/src/app.ts or equivalent entry point

import { registerAgents } from './agents/core/agent-registry';

// On application startup
registerAgents();

console.log('[App] Agents initialized and ready');
```

### Step 4: Create API Endpoints

```typescript
// /apps/api/src/app/api/agents/assess/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { agentManager } from '@/agents/core/agent-manager';
import { getServerSession } from 'next-auth';

export async function POST(request: NextRequest) {
  try {
    // Authenticate
    const session = await getServerSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Parse request
    const body = await request.json();
    const { supplierId, ...otherData } = body;

    // Execute agent
    const result = await agentManager.execute('esg-assessment', {
      data: {
        supplierId,
        ...otherData,
      },
      context: {
        tenantId: session.user.tenantId,
        userId: session.user.id,
        requestId: crypto.randomUUID(),
      },
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error('[API /agents/assess] Error:', error);
    return NextResponse.json(
      { error: 'Assessment failed' },
      { status: 500 }
    );
  }
}
```

### Step 5: Use Agents in Frontend

```typescript
// /apps/web/app/suppliers/[id]/assess/page.tsx

'use client';

import { useState } from 'react';

export default function SupplierAssessmentPage({ params }: { params: { id: string } }) {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const runAssessment = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/agents/assess', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          supplierId: params.id,
          // ... other data
        }),
      });

      const data = await response.json();
      setResult(data.result);
    } catch (error) {
      console.error('Assessment failed:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>ESG Assessment</h1>
      <button onClick={runAssessment} disabled={loading}>
        {loading ? 'Assessing...' : 'Run Assessment'}
      </button>

      {result && (
        <div>
          <h2>Overall Score: {result.overallScore}/100</h2>
          {/* Display detailed results */}
        </div>
      )}
    </div>
  );
}
```

---

## Best Practices

### 1. Prompt Engineering

```typescript
// ✅ Good: Structured, clear prompts
const prompt = `Analyze the supplier ESG performance:

**Context:**
- Industry: ${industry}
- Region: ${region}

**Data:**
${formattedData}

**Output Format:**
Provide JSON with scores, risks, and recommendations.`;

// ❌ Bad: Vague, unstructured
const prompt = `Tell me about this company's ESG`;
```

### 2. Error Handling

```typescript
// ✅ Good: Comprehensive error handling
try {
  const result = await agent.execute(input);
  return result;
} catch (error) {
  if (error instanceof AnthropicAPIError) {
    // Handle API-specific errors
    if (error.status === 429) {
      // Rate limit - retry with backoff
    }
  }
  // Log, report, return graceful error
  logger.error('Agent execution failed', { error, input });
  throw new AgentExecutionError('Assessment unavailable');
}

// ❌ Bad: Silent failures
try {
  await agent.execute(input);
} catch (e) {
  // Nothing
}
```

### 3. Cost Management

```typescript
// ✅ Good: Track and limit token usage
interface TokenUsageTracker {
  async recordUsage(tenantId: string, tokens: number, cost: number): Promise<void>;
  async checkLimit(tenantId: string): Promise<boolean>;
}

// ❌ Bad: Unlimited API calls
```

### 4. Caching

```typescript
// ✅ Good: Cache similar assessments
const cacheKey = `assessment:${supplierId}:${hash(documents)}`;
const cached = await redis.get(cacheKey);
if (cached) return JSON.parse(cached);

const result = await agent.execute(input);
await redis.setex(cacheKey, 3600, JSON.stringify(result)); // 1 hour cache

// ❌ Bad: Reassess identical data every time
```

### 5. Testing

```typescript
// ✅ Good: Comprehensive testing
describe('ESGAssessmentAgent', () => {
  it('should return valid assessment structure', async () => {
    const agent = new ESGAssessmentAgent();
    const result = await agent.execute(mockInput);

    expect(result.result.overallScore).toBeGreaterThanOrEqual(0);
    expect(result.result.overallScore).toBeLessThanOrEqual(100);
    expect(result.result.scores).toHaveProperty('environmental');
    expect(result.metadata.executionTime).toBeGreaterThan(0);
  });

  it('should handle missing data gracefully', async () => {
    const agent = new ESGAssessmentAgent();
    const input = { ...mockInput, documents: [] };

    await expect(agent.execute(input)).rejects.toThrow();
  });
});
```

---

## Testing & Quality

### Unit Tests

```typescript
// /apps/api/src/agents/__tests__/esg-assessment-agent.test.ts

import { ESGAssessmentAgent } from '../assessment/esg-assessment-agent';

describe('ESGAssessmentAgent', () => {
  let agent: ESGAssessmentAgent;

  beforeEach(() => {
    agent = new ESGAssessmentAgent();
  });

  describe('validateInput', () => {
    it('should accept valid input', () => {
      const validInput = {
        supplierId: '123e4567-e89b-12d3-a456-426614174000',
        supplierName: 'Test Supplier',
        industry: 'Manufacturing',
        country: 'South Africa',
        documents: [
          {
            type: 'sustainability_report' as const,
            content: 'Sample content',
            year: 2024,
          },
        ],
      };

      expect(agent['validateInput'](validInput)).toBe(true);
    });

    it('should reject invalid supplier ID', () => {
      const invalidInput = {
        supplierId: 'invalid-uuid',
        supplierName: 'Test',
        industry: 'Tech',
        country: 'ZA',
        documents: [],
      };

      expect(agent['validateInput'](invalidInput)).toBe(false);
    });
  });
});
```

### Integration Tests

```typescript
// Test with real Claude API (use test API key)
describe('ESGAssessmentAgent Integration', () => {
  it('should complete full assessment flow', async () => {
    const agent = new ESGAssessmentAgent();
    const input = {
      data: {
        supplierId: '123e4567-e89b-12d3-a456-426614174000',
        supplierName: 'Sample Corp',
        industry: 'Technology',
        country: 'South Africa',
        documents: [
          {
            type: 'sustainability_report' as const,
            content: fs.readFileSync('./test-data/sample-report.txt', 'utf-8'),
            year: 2024,
          },
        ],
      },
      context: {
        tenantId: 'test-tenant',
        userId: 'test-user',
        requestId: 'test-request',
      },
    };

    const result = await agent.execute(input);

    expect(result.result.overallScore).toBeGreaterThan(0);
    expect(result.confidence).toBeGreaterThan(50);
    expect(result.metadata.tokensUsed).toBeGreaterThan(0);
  }, 30000); // 30s timeout for API call
});
```

---

## Deployment

### Production Checklist

- [ ] Set `ANTHROPIC_API_KEY` in production environment
- [ ] Configure rate limiting (per tenant)
- [ ] Set up monitoring and alerting
- [ ] Enable request logging
- [ ] Configure retry logic with exponential backoff
- [ ] Set up caching layer (Redis)
- [ ] Implement cost tracking per tenant
- [ ] Set token usage limits
- [ ] Configure timeout values
- [ ] Set up error reporting (Sentry)
- [ ] Enable agent versioning
- [ ] Document all agents in agent registry

---

## Monitoring & Optimization

### Key Metrics

```typescript
interface AgentMetrics {
  // Performance
  executionTime: number;
  tokensUsed: number;
  cacheHitRate: number;

  // Quality
  confidence: number;
  userFeedback: number; // 1-5 rating
  errorRate: number;

  // Cost
  costPerExecution: number;
  totalCostPerTenant: number;
}
```

### Monitoring Dashboard

Track:
1. **Agent Usage**: Calls per hour/day
2. **Performance**: P50, P95, P99 execution times
3. **Quality**: Confidence scores, user ratings
4. **Costs**: Token usage, API costs per tenant
5. **Errors**: Failure rates, error types
6. **Cache**: Hit rate, memory usage

---

## Roadmap

### Phase 1: Foundation (Current)
- [x] Agent architecture design
- [x] Base agent class
- [x] Agent manager
- [ ] ESG assessment agent
- [ ] Recommendation agent
- [ ] API endpoints
- [ ] Basic monitoring

### Phase 2: Enhancement (Q1 2025)
- [ ] Additional agent types (compliance, risk, operational)
- [ ] Multi-agent workflows
- [ ] Agent versioning system
- [ ] Advanced caching strategies
- [ ] Quality scoring system
- [ ] User feedback loop

### Phase 3: Intelligence (Q2 2025)
- [ ] Agent learning from feedback
- [ ] Custom agent training per tenant
- [ ] Market intelligence agents
- [ ] Predictive analytics agents
- [ ] Agent collaboration protocols

### Phase 4: Scale (Q3-Q4 2025)
- [ ] Agent marketplace
- [ ] Custom agent builder UI
- [ ] Agent performance optimization
- [ ] Multi-region deployment
- [ ] Enterprise agent features

---

## Resources

### Documentation
- [Anthropic Claude API Docs](https://docs.anthropic.com/)
- [ESG Standards (GRI)](https://www.globalreporting.org/)
- [SASB Standards](https://www.sasb.org/)

### Internal Links
- Business Domains: `/BUSINESS-DOMAINS.md`
- Infrastructure: `/DOMAIN-INFRASTRUCTURE.md`
- ESG Navigator Deployment: `/esg-navigator/DEPLOYMENT.md`

---

*Last Updated: 2025-11-24*
*Version: 1.0*
*Owner: ESG Navigator Product Team*
