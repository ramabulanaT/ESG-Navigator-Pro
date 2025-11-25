/**
 * ESG Assessment Agent v2
 * Comprehensive supplier ESG evaluation with detailed scoring and risk analysis
 */

import { z } from 'zod';
import { EnhancedBaseAgent } from '../core/base-agent';
import type { AgentInput, AgentOutput } from '../core/types';

// Input schema with Zod validation
export const ESGAssessmentInputSchema = z.object({
  supplierId: z.string().uuid(),
  supplierName: z.string().min(1),
  industry: z.string().min(1),
  country: z.string().min(1),
  documents: z
    .array(
      z.object({
        type: z.enum([
          'sustainability_report',
          'policy',
          'certificate',
          'audit',
          'other',
        ]),
        content: z.string().min(10),
        year: z.number().int().min(2000).max(2030).optional(),
        title: z.string().optional(),
      })
    )
    .min(1, 'At least one document is required'),
  previousScore: z.number().min(0).max(100).optional(),
  contractValue: z.number().positive().optional(),
});

export type ESGAssessmentInput = z.infer<typeof ESGAssessmentInputSchema>;

// Output schema
export interface ESGScoreBreakdown {
  score: number;
  subcategories: {
    [key: string]: number;
  };
  evidence: string[];
}

export interface ESGRisk {
  category: 'environmental' | 'social' | 'governance';
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  impact: string;
  mitigation: string;
}

export interface ESGAssessmentOutput {
  overallScore: number;
  scores: {
    environmental: ESGScoreBreakdown;
    social: ESGScoreBreakdown;
    governance: ESGScoreBreakdown;
  };
  strengths: string[];
  weaknesses: string[];
  risks: ESGRisk[];
  trend: 'improving' | 'stable' | 'declining' | 'insufficient_data';
  industryComparison: {
    percentile: number;
    benchmark: string;
  };
  recommendations: {
    priority: 'critical' | 'high' | 'medium' | 'low';
    area: string;
    action: string;
  }[];
}

export class ESGAssessmentAgentV2 extends EnhancedBaseAgent<
  ESGAssessmentInput,
  ESGAssessmentOutput
> {
  constructor() {
    super({
      name: 'esg-assessment-v2',
      version: '2.0.0',
      description:
        'Comprehensive ESG assessment for suppliers with detailed scoring, risk analysis, and recommendations',
      category: 'assessment',
      capabilities: [
        'Detailed ESG scoring across E/S/G pillars',
        'Subcategory analysis (carbon, labor, ethics, etc.)',
        'Risk identification and severity assessment',
        'Industry benchmarking',
        'Trend analysis',
        'Actionable recommendations',
        'Evidence-based assessment',
      ],
    });
  }

  protected validateInput(data: ESGAssessmentInput): boolean {
    try {
      ESGAssessmentInputSchema.parse(data);
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
    return `You are an expert ESG (Environmental, Social, Governance) analyst with deep knowledge of:
- International ESG standards (GRI, SASB, TCFD, CDP, ISO 26000)
- Industry-specific ESG criteria and benchmarks
- Regulatory requirements across different jurisdictions
- Supply chain sustainability best practices
- Risk assessment methodologies

Your role is to analyze supplier documentation and provide:
1. Comprehensive ESG scores across all dimensions (0-100 scale)
2. Detailed subcategory assessments with evidence
3. Identification of strengths and weaknesses
4. Risk assessment with severity levels and mitigation strategies
5. Trend analysis when historical data is available
6. Industry benchmarking
7. Prioritized recommendations

**Scoring Guidelines:**
- 0-25: Poor - Major concerns, immediate action required, significant ESG risks
- 26-50: Below Average - Significant improvements needed, notable gaps
- 51-75: Average - Meets basic standards, room for improvement
- 76-90: Good - Strong performance, minor enhancements possible
- 91-100: Excellent - Industry leader, best practices demonstrated

**Environmental Subcategories:**
- Carbon Emissions: GHG emissions, carbon footprint, climate strategy
- Waste Management: Waste reduction, recycling, circular economy
- Resource Efficiency: Water, energy, materials usage
- Biodiversity: Impact on ecosystems, conservation efforts

**Social Subcategories:**
- Labor Practices: Working conditions, wages, worker safety
- Human Rights: Supply chain ethics, child labor, forced labor
- Community Impact: Local communities, social investment
- Diversity & Inclusion: Workforce diversity, equal opportunities

**Governance Subcategories:**
- Board Structure: Independence, diversity, expertise
- Ethics: Anti-corruption, whistleblower protection
- Transparency: Reporting quality, disclosure practices
- Compliance: Regulatory adherence, certifications

Always provide:
- Evidence-based assessments with specific examples from documents
- Context-aware analysis based on industry and region
- Actionable insights with clear priorities
- Balanced view of strengths and areas for improvement

**CRITICAL: Output ONLY valid JSON with NO additional text or markdown code blocks. Start your response with { and end with }.**`;
  }

  protected buildUserPrompt(data: ESGAssessmentInput): string {
    const documentsText = data.documents
      .map((doc, idx) => {
        const title = doc.title || `Document ${idx + 1}`;
        const year = doc.year ? ` (${doc.year})` : '';
        const content = doc.content.substring(0, 3000); // Limit to 3000 chars per doc
        return `**${title}** [${doc.type}]${year}:\n${content}`;
      })
      .join('\n\n---\n\n');

    return `Analyze the following supplier for comprehensive ESG performance:

**Supplier Information:**
- Name: ${data.supplierName}
- ID: ${data.supplierId}
- Industry: ${data.industry}
- Country: ${data.country}
${data.contractValue ? `- Contract Value: $${data.contractValue.toLocaleString()}` : ''}
${data.previousScore ? `- Previous ESG Score: ${data.previousScore}/100` : ''}

**Documents Provided (${data.documents.length}):**

${documentsText}

Provide a comprehensive ESG assessment with the following exact JSON structure (NO markdown, NO code blocks):

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
      },
      "evidence": ["specific finding 1", "specific finding 2", "..."]
    },
    "social": {
      "score": <number 0-100>,
      "subcategories": {
        "laborPractices": <number 0-100>,
        "humanRights": <number 0-100>,
        "communityImpact": <number 0-100>,
        "diversityInclusion": <number 0-100>
      },
      "evidence": ["specific finding 1", "specific finding 2", "..."]
    },
    "governance": {
      "score": <number 0-100>,
      "subcategories": {
        "boardStructure": <number 0-100>,
        "ethics": <number 0-100>,
        "transparency": <number 0-100>,
        "compliance": <number 0-100>
      },
      "evidence": ["specific finding 1", "specific finding 2", "..."]
    }
  },
  "strengths": ["specific strength 1", "specific strength 2", "at least 3-5"],
  "weaknesses": ["specific weakness 1", "specific weakness 2", "at least 3-5"],
  "risks": [
    {
      "category": "environmental|social|governance",
      "severity": "low|medium|high|critical",
      "description": "detailed risk description",
      "impact": "potential business impact",
      "mitigation": "recommended mitigation strategy"
    }
  ],
  "trend": "improving|stable|declining|insufficient_data",
  "industryComparison": {
    "percentile": <number 0-100>,
    "benchmark": "description of industry performance"
  },
  "recommendations": [
    {
      "priority": "critical|high|medium|low",
      "area": "environmental|social|governance",
      "action": "specific actionable recommendation"
    }
  ]
}`;
  }

  protected parseResponse(response: string): ESGAssessmentOutput {
    try {
      // Try to extract JSON from response
      let jsonStr = response.trim();

      // Remove markdown code blocks if present
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
        typeof parsed.overallScore !== 'number' ||
        !parsed.scores ||
        !parsed.scores.environmental ||
        !parsed.scores.social ||
        !parsed.scores.governance
      ) {
        throw new Error('Invalid response structure from Claude');
      }

      return parsed as ESGAssessmentOutput;
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
    input: ESGAssessmentInput,
    output: ESGAssessmentOutput
  ): number {
    let confidence = 50; // Base confidence

    // More documents = higher confidence
    confidence += Math.min(input.documents.length * 8, 25);

    // Recent documents boost confidence
    const currentYear = new Date().getFullYear();
    const recentDocs = input.documents.filter(
      (doc) => doc.year && doc.year >= currentYear - 2
    );
    confidence += Math.min(recentDocs.length * 5, 15);

    // Historical data available
    if (input.previousScore !== undefined) {
      confidence += 5;
    }

    // Sufficient evidence provided
    const totalEvidence =
      (output.scores.environmental.evidence?.length || 0) +
      (output.scores.social.evidence?.length || 0) +
      (output.scores.governance.evidence?.length || 0);

    if (totalEvidence >= 10) {
      confidence += 5;
    }

    return Math.min(confidence, 100);
  }

  protected generateSuggestions(
    output: ESGAssessmentOutput
  ): string[] | undefined {
    const suggestions: string[] = [];

    // Suggest focus areas based on low scores
    const pillarScores = [
      { name: 'Environmental', score: output.scores.environmental.score },
      { name: 'Social', score: output.scores.social.score },
      { name: 'Governance', score: output.scores.governance.score },
    ];

    const lowestPillar = pillarScores.sort((a, b) => a.score - b.score)[0];
    if (lowestPillar.score < 60) {
      suggestions.push(
        `Priority: Improve ${lowestPillar.name} performance (current: ${lowestPillar.score}/100)`
      );
    }

    // Critical risks
    const criticalRisks = output.risks.filter((r) => r.severity === 'critical');
    if (criticalRisks.length > 0) {
      suggestions.push(
        `URGENT: Address ${criticalRisks.length} critical risk(s) immediately`
      );
    }

    // High-priority recommendations
    const criticalRecs = output.recommendations.filter(
      (r) => r.priority === 'critical' || r.priority === 'high'
    );
    if (criticalRecs.length > 0) {
      suggestions.push(
        `Focus on ${criticalRecs.length} high-priority recommendations first`
      );
    }

    // Trend-based suggestions
    if (output.trend === 'declining') {
      suggestions.push('ESG performance declining - conduct urgent gap analysis');
    } else if (output.trend === 'improving') {
      suggestions.push('Positive trend - maintain momentum and document progress');
    }

    // Industry comparison
    if (output.industryComparison.percentile < 25) {
      suggestions.push(
        'Below industry average - benchmark against top performers'
      );
    } else if (output.industryComparison.percentile > 75) {
      suggestions.push('Above industry average - share best practices internally');
    }

    return suggestions.length > 0 ? suggestions : undefined;
  }

  protected generateWarnings(
    output: ESGAssessmentOutput
  ): string[] | undefined {
    const warnings: string[] = [];

    // Overall score warnings
    if (output.overallScore < 50) {
      warnings.push(
        'CRITICAL: Overall ESG score below acceptable threshold - immediate action required'
      );
    }

    // Critical and high risks
    const severeRisks = output.risks.filter(
      (r) => r.severity === 'critical' || r.severity === 'high'
    );
    if (severeRisks.length > 0) {
      warnings.push(
        `${severeRisks.length} severe ESG risk(s) identified - review risk mitigation strategies`
      );
    }

    // Declining trend
    if (output.trend === 'declining') {
      warnings.push('ESG performance declining - intervention needed');
    }

    // Low pillar scores
    Object.entries(output.scores).forEach(([pillar, data]) => {
      if (data.score < 40) {
        warnings.push(
          `${pillar.charAt(0).toUpperCase() + pillar.slice(1)} score critically low (${data.score}/100)`
        );
      }
    });

    return warnings.length > 0 ? warnings : undefined;
  }
}
