/**
 * Recommendation Agent
 * Generates actionable ESG improvement recommendations based on assessment results
 */

import { z } from 'zod';
import { EnhancedBaseAgent } from '../core/base-agent';
import type { AgentInput, AgentOutput } from '../core/types';

// Input schema
export const RecommendationInputSchema = z.object({
  supplierId: z.string().uuid(),
  supplierName: z.string().min(1),
  industry: z.string().min(1),
  esgAssessment: z.object({
    overallScore: z.number().min(0).max(100),
    scores: z.object({
      environmental: z.object({ score: z.number() }),
      social: z.object({ score: z.number() }),
      governance: z.object({ score: z.number() }),
    }),
    weaknesses: z.array(z.string()),
    risks: z.array(
      z.object({
        category: z.string(),
        severity: z.string(),
        description: z.string(),
      })
    ),
  }),
  budget: z.enum(['low', 'medium', 'high']).optional(),
  timeline: z.enum(['immediate', 'short_term', 'long_term']).optional(),
  constraints: z.array(z.string()).optional(),
});

export type RecommendationInput = z.infer<typeof RecommendationInputSchema>;

// Output schema
export interface Recommendation {
  id: string;
  priority: 'critical' | 'high' | 'medium' | 'low';
  category: 'environmental' | 'social' | 'governance';
  title: string;
  description: string;
  rationale: string;
  expectedImpact: {
    scoreImprovement: number;
    riskReduction: string;
    businessBenefits: string[];
  };
  implementation: {
    steps: Array<{
      order: number;
      action: string;
      duration: string;
      responsible: string;
    }>;
    estimatedCost: 'low' | 'medium' | 'high';
    timeline: string;
    resources: string[];
    dependencies: string[];
  };
  kpis: Array<{
    metric: string;
    target: string;
    measurement: string;
  }>;
  successFactors: string[];
  risks: string[];
}

export interface RecommendationOutput {
  recommendations: Recommendation[];
  quickWins: Recommendation[];
  strategicInitiatives: Recommendation[];
  estimatedOverallImprovement: number;
  implementationRoadmap: Array<{
    phase: string;
    duration: string;
    recommendations: string[];
    milestones: string[];
  }>;
  totalEstimatedCost: {
    low: number;
    high: number;
    currency: string;
  };
}

export class RecommendationAgent extends EnhancedBaseAgent<
  RecommendationInput,
  RecommendationOutput
> {
  constructor() {
    super({
      name: 'recommendation-agent',
      version: '1.0.0',
      description:
        'Generates actionable, prioritized ESG improvement recommendations with implementation plans',
      category: 'advisory',
      capabilities: [
        'Prioritized recommendation generation',
        'Quick wins identification',
        'Strategic initiatives planning',
        'Implementation roadmaps',
        'Cost estimation',
        'KPI definition',
        'Risk and success factor analysis',
      ],
    });
  }

  protected validateInput(data: RecommendationInput): boolean {
    try {
      RecommendationInputSchema.parse(data);
      return true;
    } catch (error: any) {
      console.error(
        `[${this.metadata.name}] Validation error:`,
        error.errors || error.message
      );
      return false;
    }
  }

  protected buildSystemPrompt(): string {
    return `You are an ESG strategy consultant specializing in practical, actionable recommendations for supplier improvement.

**Your Expertise:**
- ESG improvement strategies tailored to specific industries
- Cost-effective implementation approaches
- Quick wins vs. long-term strategic initiatives
- Resource allocation and prioritization
- Change management and stakeholder engagement
- Measurable KPIs and impact assessment
- Budget-conscious planning
- Risk mitigation strategies

**Your Approach:**
1. **Prioritize by Impact & Feasibility**: Consider both ESG score improvement and ease of implementation
2. **Be Specific**: Provide concrete, actionable steps, not vague suggestions
3. **Consider Constraints**: Work within budget and timeline limitations
4. **Balance Short & Long Term**: Include both quick wins and strategic initiatives
5. **Make it Measurable**: Define clear KPIs for each recommendation
6. **Be Realistic**: Consider real-world implementation challenges
7. **Tailor to Industry**: Ensure recommendations are industry-appropriate

**Recommendation Categories:**
- **Quick Wins**: Can be implemented in 1-3 months, low cost, immediate impact
- **Strategic Initiatives**: 6-18 months, medium-high cost, transformational impact

**Priority Levels:**
- **Critical**: Addresses severe risks, regulatory issues, or major score gaps
- **High**: Significant impact on ESG score, manageable implementation
- **Medium**: Important improvements, lower urgency
- **Low**: Nice-to-have enhancements, long-term value

**CRITICAL: Output ONLY valid JSON with NO additional text or markdown code blocks. Start with { and end with }.**`;
  }

  protected buildUserPrompt(data: RecommendationInput): string {
    const riskSummary = data.esgAssessment.risks
      .map((r) => `- [${r.severity.toUpperCase()}] ${r.description}`)
      .join('\n');

    const weaknessesSummary = data.esgAssessment.weaknesses
      .map((w, i) => `${i + 1}. ${w}`)
      .join('\n');

    return `Generate comprehensive ESG improvement recommendations for the following supplier:

**Supplier Context:**
- Name: ${data.supplierName}
- ID: ${data.supplierId}
- Industry: ${data.industry}
${data.budget ? `- Budget Constraint: ${data.budget}` : ''}
${data.timeline ? `- Timeline Constraint: ${data.timeline}` : ''}
${data.constraints && data.constraints.length > 0 ? `- Additional Constraints:\n  ${data.constraints.map((c) => `• ${c}`).join('\n  ')}` : ''}

**Current ESG Performance:**
- Overall Score: ${data.esgAssessment.overallScore}/100
- Environmental: ${data.esgAssessment.scores.environmental.score}/100
- Social: ${data.esgAssessment.scores.social.score}/100
- Governance: ${data.esgAssessment.scores.governance.score}/100

**Key Weaknesses:**
${weaknessesSummary}

**Identified Risks:**
${riskSummary}

**Task:**
Provide comprehensive, actionable recommendations to improve ESG performance. Consider:
1. Address critical risks and weaknesses first
2. Identify quick wins (fast implementation, low cost, visible impact)
3. Propose strategic initiatives (longer-term, transformational)
4. Respect budget and timeline constraints
5. Provide specific implementation steps
6. Define measurable KPIs

**Output the following exact JSON structure (NO markdown, NO code blocks):**

{
  "recommendations": [
    {
      "id": "rec-1",
      "priority": "critical|high|medium|low",
      "category": "environmental|social|governance",
      "title": "brief, clear title",
      "description": "detailed description of the recommendation",
      "rationale": "why this is important and how it addresses current gaps",
      "expectedImpact": {
        "scoreImprovement": <estimated points improvement 0-20>,
        "riskReduction": "description of risk mitigation",
        "businessBenefits": ["benefit 1", "benefit 2", "..."]
      },
      "implementation": {
        "steps": [
          {
            "order": 1,
            "action": "specific action to take",
            "duration": "time estimate",
            "responsible": "role/department"
          }
        ],
        "estimatedCost": "low|medium|high",
        "timeline": "timeframe estimate",
        "resources": ["resource 1", "resource 2"],
        "dependencies": ["dependency 1", "dependency 2"]
      },
      "kpis": [
        {
          "metric": "what to measure",
          "target": "target value/goal",
          "measurement": "how to measure"
        }
      ],
      "successFactors": ["factor 1", "factor 2"],
      "risks": ["implementation risk 1", "risk 2"]
    }
  ],
  "quickWins": [<subset of recommendations that are quick wins>],
  "strategicInitiatives": [<subset of recommendations that are strategic>],
  "estimatedOverallImprovement": <total expected score improvement 0-40>,
  "implementationRoadmap": [
    {
      "phase": "Phase name (e.g., 'Immediate Actions', 'Quarter 1', etc.)",
      "duration": "timeframe",
      "recommendations": ["rec-1", "rec-2"],
      "milestones": ["milestone 1", "milestone 2"]
    }
  ],
  "totalEstimatedCost": {
    "low": <minimum estimated cost in local currency>,
    "high": <maximum estimated cost in local currency>,
    "currency": "ZAR|USD|EUR"
  }
}

Provide at least 5-8 diverse recommendations covering different categories and priorities.`;
  }

  protected parseResponse(response: string): RecommendationOutput {
    try {
      let jsonStr = response.trim();

      // Remove markdown code blocks
      const jsonMatch =
        response.match(/```json\n([\s\S]*?)\n```/) ||
        response.match(/```\n([\s\S]*?)\n```/);

      if (jsonMatch) {
        jsonStr = jsonMatch[1].trim();
      }

      // Find JSON object
      const startIdx = jsonStr.indexOf('{');
      const endIdx = jsonStr.lastIndexOf('}');

      if (startIdx === -1 || endIdx === -1) {
        throw new Error('No JSON object found in response');
      }

      jsonStr = jsonStr.substring(startIdx, endIdx + 1);

      const parsed = JSON.parse(jsonStr);

      // Validate structure
      if (
        !Array.isArray(parsed.recommendations) ||
        parsed.recommendations.length === 0
      ) {
        throw new Error('Invalid recommendations structure');
      }

      return parsed as RecommendationOutput;
    } catch (error: any) {
      console.error(
        `[${this.metadata.name}] Failed to parse response:`,
        error.message
      );
      console.error('Raw response:', response.substring(0, 500));
      throw new Error(`Failed to parse Claude response: ${error.message}`);
    }
  }

  protected calculateConfidence(
    input: RecommendationInput,
    output: RecommendationOutput
  ): number {
    let confidence = 70; // Base confidence for recommendations

    // More recommendations = higher confidence (shows thorough analysis)
    if (output.recommendations.length >= 8) {
      confidence += 10;
    } else if (output.recommendations.length >= 5) {
      confidence += 5;
    }

    // Has implementation roadmap
    if (
      output.implementationRoadmap &&
      output.implementationRoadmap.length > 0
    ) {
      confidence += 5;
    }

    // Has both quick wins and strategic initiatives
    if (output.quickWins.length > 0 && output.strategicInitiatives.length > 0) {
      confidence += 5;
    }

    // All recommendations have KPIs defined
    const hasKPIs = output.recommendations.every(
      (r) => r.kpis && r.kpis.length > 0
    );
    if (hasKPIs) {
      confidence += 5;
    }

    // Cost estimate provided
    if (output.totalEstimatedCost) {
      confidence += 5;
    }

    return Math.min(confidence, 100);
  }

  protected generateSuggestions(
    output: RecommendationOutput
  ): string[] | undefined {
    const suggestions: string[] = [];

    // Prioritization suggestions
    const criticalRecs = output.recommendations.filter(
      (r) => r.priority === 'critical'
    );
    if (criticalRecs.length > 0) {
      suggestions.push(
        `Start with ${criticalRecs.length} critical recommendation(s) first`
      );
    }

    // Quick wins
    if (output.quickWins.length > 0) {
      suggestions.push(
        `Implement ${output.quickWins.length} quick win(s) in first 90 days for early momentum`
      );
    }

    // Cost consideration
    if (output.totalEstimatedCost) {
      const avgCost =
        (output.totalEstimatedCost.low + output.totalEstimatedCost.high) / 2;
      suggestions.push(
        `Budget planning: Estimated ${output.totalEstimatedCost.currency} ${avgCost.toLocaleString()} for all initiatives`
      );
    }

    // Expected improvement
    if (output.estimatedOverallImprovement >= 20) {
      suggestions.push(
        `High impact opportunity: ${output.estimatedOverallImprovement} point improvement potential`
      );
    }

    // Phased approach
    if (output.implementationRoadmap && output.implementationRoadmap.length > 1) {
      suggestions.push(
        `Follow ${output.implementationRoadmap.length}-phase implementation roadmap for structured approach`
      );
    }

    return suggestions.length > 0 ? suggestions : undefined;
  }

  protected generateWarnings(
    output: RecommendationOutput
  ): string[] | undefined {
    const warnings: string[] = [];

    // High cost warning
    if (
      output.totalEstimatedCost &&
      output.totalEstimatedCost.high > 1000000
    ) {
      warnings.push(
        `High investment required (${output.totalEstimatedCost.currency} ${output.totalEstimatedCost.high.toLocaleString()}) - ensure budget approval`
      );
    }

    // Complex dependencies
    const complexRecs = output.recommendations.filter(
      (r) => r.implementation.dependencies && r.implementation.dependencies.length > 2
    );
    if (complexRecs.length > 0) {
      warnings.push(
        `${complexRecs.length} recommendation(s) have complex dependencies - careful sequencing required`
      );
    }

    // Implementation risks
    const riskyRecs = output.recommendations.filter(
      (r) => r.risks && r.risks.length > 2
    );
    if (riskyRecs.length > 0) {
      warnings.push(
        `${riskyRecs.length} recommendation(s) have significant implementation risks - mitigation plans needed`
      );
    }

    return warnings.length > 0 ? warnings : undefined;
  }
}
