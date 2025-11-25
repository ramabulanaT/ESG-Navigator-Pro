# Agent System v2 - Usage Examples

> **Complete guide for using the enhanced agent system in ESG Navigator**

---

## Quick Start

### 1. Start the API Server

```bash
cd esg-navigator/apps/api
npm run dev
```

The API will start on `http://localhost:5050` with agent v2 routes available at `/api/agents/v2`.

### 2. Authenticate

All agent endpoints require authentication. Use the demo credentials:

```bash
curl -X POST http://localhost:5050/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@tisholdings.co.za",
    "password": "admin123"
  }'
```

Save the returned token for subsequent requests.

---

## API Endpoints

### List Available Agents

```bash
GET /api/agents/v2
```

**Response:**
```json
{
  "success": true,
  "data": {
    "agents": [
      {
        "name": "esg-assessment-v2",
        "version": "2.0.0",
        "description": "Comprehensive ESG assessment for suppliers...",
        "category": "assessment",
        "capabilities": [...]
      },
      {
        "name": "recommendation-agent",
        "version": "1.0.0",
        "description": "Generates actionable ESG improvement recommendations...",
        "category": "advisory",
        "capabilities": [...]
      }
    ],
    "stats": {
      "total": 2,
      "categories": {
        "assessment": 1,
        "advisory": 1,
        "operational": 0,
        "intelligence": 0
      }
    }
  }
}
```

---

## 1. ESG Assessment Agent

Performs comprehensive ESG evaluation of suppliers with detailed scoring and risk analysis.

### Endpoint

```
POST /api/agents/v2/esg-assessment
```

### Example Request

```bash
curl -X POST http://localhost:5050/api/agents/v2/esg-assessment \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "supplierId": "123e4567-e89b-12d3-a456-426614174000",
    "supplierName": "Sample Manufacturing Co",
    "industry": "Manufacturing",
    "country": "South Africa",
    "contractValue": 5000000,
    "documents": [
      {
        "type": "sustainability_report",
        "title": "2024 Sustainability Report",
        "content": "Our company is committed to reducing carbon emissions by 30% by 2030. We have implemented comprehensive waste management systems that recycle 75% of our industrial waste. Our workforce diversity stands at 45% women in leadership roles, and we maintain a zero-tolerance policy for human rights violations in our supply chain. The board comprises 40% independent directors with strong ESG expertise...",
        "year": 2024
      }
    ],
    "previousScore": 72
  }'
```

### Example Response

```json
{
  "success": true,
  "data": {
    "result": {
      "overallScore": 78,
      "scores": {
        "environmental": {
          "score": 82,
          "subcategories": {
            "carbonEmissions": 85,
            "wasteManagement": 88,
            "resourceEfficiency": 75,
            "biodiversity": 80
          },
          "evidence": [
            "30% emissions reduction target by 2030",
            "75% waste recycling rate achieved",
            "Comprehensive environmental management system in place"
          ]
        },
        "social": {
          "score": 76,
          "subcategories": {
            "laborPractices": 80,
            "humanRights": 85,
            "communityImpact": 70,
            "diversityInclusion": 70
          },
          "evidence": [
            "45% women in leadership positions",
            "Zero tolerance policy for human rights violations",
            "Strong worker safety programs implemented"
          ]
        },
        "governance": {
          "score": 76,
          "subcategories": {
            "boardStructure": 75,
            "ethics": 82,
            "transparency": 72,
            "compliance": 75
          },
          "evidence": [
            "40% independent board directors",
            "ESG expertise represented on board",
            "Regular sustainability reporting"
          ]
        }
      },
      "strengths": [
        "Strong emissions reduction commitments with clear targets",
        "Excellent waste management and recycling programs",
        "Robust human rights policies across supply chain",
        "Good gender diversity in leadership roles",
        "Independent board with ESG expertise"
      ],
      "weaknesses": [
        "Community engagement programs need expansion",
        "Transparency in reporting could be enhanced",
        "Resource efficiency below industry leaders",
        "Diversity metrics lag in some areas",
        "Limited biodiversity conservation initiatives"
      ],
      "risks": [
        {
          "category": "environmental",
          "severity": "medium",
          "description": "Carbon reduction targets may be challenging without additional investments",
          "impact": "Potential regulatory penalties and reputational damage",
          "mitigation": "Develop detailed carbon reduction roadmap with interim milestones"
        },
        {
          "category": "social",
          "severity": "low",
          "description": "Community engagement programs are underdeveloped",
          "impact": "Limited social license to operate in local communities",
          "mitigation": "Establish community advisory board and investment programs"
        }
      ],
      "trend": "improving",
      "industryComparison": {
        "percentile": 65,
        "benchmark": "Above average performer in manufacturing sector"
      },
      "recommendations": [
        {
          "priority": "high",
          "area": "environmental",
          "action": "Develop detailed carbon reduction implementation roadmap with quarterly milestones"
        },
        {
          "priority": "medium",
          "area": "social",
          "action": "Expand community engagement and local investment programs"
        },
        {
          "priority": "medium",
          "area": "governance",
          "action": "Enhance transparency through GRI-aligned sustainability reporting"
        }
      ]
    },
    "confidence": 82,
    "reasoning": "Assessment based on provided documentation and industry standards",
    "metadata": {
      "executionTime": 8450,
      "tokensUsed": {
        "input": 1250,
        "output": 850,
        "total": 2100
      },
      "model": "claude-3-5-sonnet-latest"
    },
    "suggestions": [
      "Focus on improving Social performance (current: 76/100)",
      "Positive trend - maintain momentum and document progress",
      "Above industry average - share best practices internally"
    ],
    "warnings": []
  }
}
```

### TypeScript Usage

```typescript
import { ESGAssessmentInput, ESGAssessmentOutput } from './agents/v2';

async function assessSupplier(supplierId: string): Promise<ESGAssessmentOutput> {
  const input: ESGAssessmentInput = {
    supplierId,
    supplierName: 'Sample Manufacturing Co',
    industry: 'Manufacturing',
    country: 'South Africa',
    documents: [
      {
        type: 'sustainability_report',
        content: '...',
        year: 2024,
      },
    ],
  };

  const response = await fetch('http://localhost:5050/api/agents/v2/esg-assessment', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(input),
  });

  const result = await response.json();
  return result.data.result;
}
```

---

## 2. Recommendation Agent

Generates actionable improvement recommendations based on ESG assessment results.

### Endpoint

```
POST /api/agents/v2/recommendations
```

### Example Request

```bash
curl -X POST http://localhost:5050/api/agents/v2/recommendations \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "supplierId": "123e4567-e89b-12d3-a456-426614174000",
    "supplierName": "Sample Manufacturing Co",
    "industry": "Manufacturing",
    "esgAssessment": {
      "overallScore": 72,
      "scores": {
        "environmental": { "score": 68 },
        "social": { "score": 75 },
        "governance": { "score": 73 }
      },
      "weaknesses": [
        "Carbon emissions tracking incomplete",
        "Limited community engagement",
        "Board diversity below industry average"
      ],
      "risks": [
        {
          "category": "environmental",
          "severity": "high",
          "description": "High carbon intensity without reduction plan"
        }
      ]
    },
    "budget": "medium",
    "timeline": "short_term"
  }'
```

### Example Response

```json
{
  "success": true,
  "data": {
    "result": {
      "recommendations": [
        {
          "id": "rec-1",
          "priority": "critical",
          "category": "environmental",
          "title": "Implement Comprehensive Carbon Management System",
          "description": "Deploy an integrated carbon tracking and management system to measure, report, and reduce GHG emissions across all operations.",
          "rationale": "Current carbon emissions tracking is incomplete, creating regulatory risk and preventing effective reduction strategies. This is critical given industry trends and increasing regulatory requirements.",
          "expectedImpact": {
            "scoreImprovement": 12,
            "riskReduction": "Eliminates high-severity carbon management risk",
            "businessBenefits": [
              "Regulatory compliance assurance",
              "Cost savings through efficiency gains",
              "Enhanced investor confidence",
              "Competitive advantage in sustainability"
            ]
          },
          "implementation": {
            "steps": [
              {
                "order": 1,
                "action": "Conduct comprehensive GHG emissions inventory (Scope 1, 2, 3)",
                "duration": "4 weeks",
                "responsible": "Environmental Manager"
              },
              {
                "order": 2,
                "action": "Select and deploy carbon management software platform",
                "duration": "6 weeks",
                "responsible": "IT Department"
              },
              {
                "order": 3,
                "action": "Train operations team on carbon data collection",
                "duration": "2 weeks",
                "responsible": "HR & Environmental Teams"
              },
              {
                "order": 4,
                "action": "Establish monthly reporting and review process",
                "duration": "2 weeks",
                "responsible": "Sustainability Committee"
              }
            ],
            "estimatedCost": "medium",
            "timeline": "3-4 months",
            "resources": [
              "Carbon management software (R150K-300K annual)",
              "External consultant for initial inventory (R80K)",
              "Internal staff time (200 hours)"
            ],
            "dependencies": [
              "Management approval and budget allocation",
              "IT infrastructure readiness",
              "Stakeholder buy-in across operations"
            ]
          },
          "kpis": [
            {
              "metric": "GHG Emissions Inventory Completeness",
              "target": "100% of Scope 1, 2, and major Scope 3 sources tracked",
              "measurement": "Quarterly inventory audits"
            },
            {
              "metric": "Carbon Intensity Reduction",
              "target": "10% reduction in first year",
              "measurement": "Monthly carbon intensity (tCO2e per unit of production)"
            },
            {
              "metric": "Data Quality Score",
              "target": ">95% accuracy in carbon data",
              "measurement": "Regular data validation checks"
            }
          ],
          "successFactors": [
            "Strong executive sponsorship and commitment",
            "Cross-functional team engagement",
            "Integration with existing ERP/management systems",
            "Regular communication and training"
          ],
          "risks": [
            "Initial data quality issues requiring iterative improvement",
            "Resistance to change from operations teams",
            "Software integration challenges with legacy systems"
          ]
        },
        {
          "id": "rec-2",
          "priority": "high",
          "category": "social",
          "title": "Launch Community Investment Program",
          "description": "Establish a structured community engagement and investment initiative focused on local economic development, education, and environmental stewardship.",
          "rationale": "Current community engagement is limited, creating potential social license risks and missing opportunities for positive impact and stakeholder relations.",
          "expectedImpact": {
            "scoreImprovement": 8,
            "riskReduction": "Addresses social license concerns and builds community support",
            "businessBenefits": [
              "Enhanced social license to operate",
              "Improved community relations",
              "Positive brand reputation",
              "Potential workforce pipeline development"
            ]
          },
          "implementation": {
            "steps": [
              {
                "order": 1,
                "action": "Conduct community needs assessment and stakeholder mapping",
                "duration": "3 weeks",
                "responsible": "CSR Manager"
              },
              {
                "order": 2,
                "action": "Develop 3-year community investment strategy and budget",
                "duration": "4 weeks",
                "responsible": "Sustainability Committee"
              },
              {
                "order": 3,
                "action": "Establish community advisory board with local representatives",
                "duration": "3 weeks",
                "responsible": "Executive Team"
              },
              {
                "order": 4,
                "action": "Launch initial pilot programs (education, skills training)",
                "duration": "8 weeks",
                "responsible": "CSR Team"
              }
            ],
            "estimatedCost": "medium",
            "timeline": "4-5 months for initial launch",
            "resources": [
              "Community investment budget (R500K-1M annually)",
              "CSR coordinator position (if not existing)",
              "Partnership management resources"
            ],
            "dependencies": [
              "Board approval for investment budget",
              "Community stakeholder availability",
              "Identification of credible local partners"
            ]
          },
          "kpis": [
            {
              "metric": "Community Investment Value",
              "target": "1% of local revenue invested in community programs",
              "measurement": "Annual financial tracking"
            },
            {
              "metric": "Beneficiaries Reached",
              "target": "500+ community members engaged in first year",
              "measurement": "Program participation tracking"
            },
            {
              "metric": "Community Satisfaction",
              "target": ">75% positive feedback from community surveys",
              "measurement": "Annual community perception surveys"
            }
          ],
          "successFactors": [
            "Authentic engagement with community needs",
            "Long-term commitment beyond quick wins",
            "Transparent communication and reporting",
            "Partnership with established community organizations"
          ],
          "risks": [
            "Misalignment between company priorities and community needs",
            "Insufficient budget allocation affecting program quality",
            "Perception of tokenism if not implemented authentically"
          ]
        }
      ],
      "quickWins": [
        {
          "id": "rec-3",
          "priority": "medium",
          "category": "governance",
          "title": "Enhance ESG Reporting Transparency",
          "description": "Adopt GRI Standards framework for sustainability reporting to improve transparency and stakeholder communication.",
          "rationale": "Current reporting lacks structure and comparability. GRI adoption is a quick win that significantly improves governance scores.",
          "expectedImpact": {
            "scoreImprovement": 5,
            "riskReduction": "Reduces transparency concerns",
            "businessBenefits": ["Better investor communication", "Industry recognition", "Stakeholder trust"]
          },
          "implementation": {
            "steps": [
              {
                "order": 1,
                "action": "GRI Standards training for sustainability team",
                "duration": "1 week",
                "responsible": "Sustainability Manager"
              },
              {
                "order": 2,
                "action": "Gap analysis against GRI requirements",
                "duration": "2 weeks",
                "responsible": "Internal Team"
              },
              {
                "order": 3,
                "action": "Restructure annual sustainability report to GRI format",
                "duration": "4 weeks",
                "responsible": "Communications Team"
              }
            ],
            "estimatedCost": "low",
            "timeline": "6-8 weeks",
            "resources": ["GRI training (R20K)", "Internal staff time (80 hours)"],
            "dependencies": ["Access to existing sustainability data", "Management approval"]
          },
          "kpis": [
            {
              "metric": "GRI Compliance Level",
              "target": "GRI 'Core' level in first year",
              "measurement": "GRI Content Index completeness"
            },
            {
              "metric": "Report Download/Views",
              "target": "50% increase in stakeholder engagement",
              "measurement": "Website analytics"
            }
          ],
          "successFactors": ["Clear data ownership", "Executive review process", "Proactive stakeholder communication"],
          "risks": ["Data gaps requiring time to fill", "Initial learning curve for team"]
        }
      ],
      "strategicInitiatives": [
        {
          "id": "rec-1",
          "priority": "critical",
          "category": "environmental",
          "title": "Implement Comprehensive Carbon Management System",
          "description": "...",
          "rationale": "...",
          "expectedImpact": { "...": "..." },
          "implementation": { "...": "..." },
          "kpis": [ "..." ],
          "successFactors": [ "..." ],
          "risks": [ "..." ]
        }
      ],
      "estimatedOverallImprovement": 25,
      "implementationRoadmap": [
        {
          "phase": "Immediate Actions (Month 1-2)",
          "duration": "2 months",
          "recommendations": ["rec-3"],
          "milestones": [
            "GRI training completed",
            "Gap analysis finalized",
            "First GRI-aligned report section drafted"
          ]
        },
        {
          "phase": "Short-term Initiatives (Month 3-6)",
          "duration": "4 months",
          "recommendations": ["rec-1", "rec-2"],
          "milestones": [
            "Carbon management system deployed",
            "Community advisory board established",
            "First community pilot programs launched"
          ]
        },
        {
          "phase": "Medium-term Consolidation (Month 7-12)",
          "duration": "6 months",
          "recommendations": ["all"],
          "milestones": [
            "Full carbon tracking operational",
            "Community programs scaled",
            "Second GRI report published",
            "Measurable ESG score improvements documented"
          ]
        }
      ],
      "totalEstimatedCost": {
        "low": 750000,
        "high": 1800000,
        "currency": "ZAR"
      }
    },
    "confidence": 88,
    "metadata": {
      "executionTime": 9200,
      "tokensUsed": {
        "input": 980,
        "output": 1850,
        "total": 2830
      },
      "model": "claude-3-5-sonnet-latest"
    },
    "suggestions": [
      "Start with 1 critical recommendation(s) first",
      "Implement 1 quick win(s) in first 90 days for early momentum",
      "Budget planning: Estimated ZAR 1,275,000 for all initiatives",
      "High impact opportunity: 25 point improvement potential",
      "Follow 3-phase implementation roadmap for structured approach"
    ]
  }
}
```

### TypeScript Usage

```typescript
import { RecommendationInput, RecommendationOutput } from './agents/v2';

async function getRecommendations(
  supplierId: string,
  assessment: any
): Promise<RecommendationOutput> {
  const input: RecommendationInput = {
    supplierId,
    supplierName: 'Sample Manufacturing Co',
    industry: 'Manufacturing',
    esgAssessment: assessment,
    budget: 'medium',
    timeline: 'short_term',
  };

  const response = await fetch('http://localhost:5050/api/agents/v2/recommendations', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(input),
  };

  const result = await response.json();
  return result.data.result;
}
```

---

## 3. Generic Agent Execution

Execute any registered agent by name using the generic endpoint.

### Endpoint

```
POST /api/agents/v2/execute/:agentName?version=latest
```

### Example Request

```bash
curl -X POST "http://localhost:5050/api/agents/v2/execute/esg-assessment-v2?version=2.0.0" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "data": {
      "supplierId": "...",
      "supplierName": "...",
      "...": "..."
    },
    "options": {
      "temperature": 0.7,
      "maxTokens": 4096
    }
  }'
```

---

## Error Handling

All endpoints return consistent error responses:

```json
{
  "success": false,
  "error": "Error message here",
  "details": {
    "...": "Additional error details if available"
  }
}
```

### Common Errors

| Status Code | Error | Cause |
|------------|-------|-------|
| 400 | Validation error | Invalid input data (check `details` for specific fields) |
| 401 | Unauthorized | Missing or invalid authentication token |
| 404 | Agent not found | Specified agent name/version doesn't exist |
| 500 | Internal server error | Agent execution failed or Claude API error |

---

## Best Practices

### 1. Document Preparation

- Provide multiple recent documents (2-5) for best assessment quality
- Include sustainability reports, policies, certifications, audit results
- Ensure documents are from recent years (last 2-3 years preferred)
- Longer, more detailed documents improve confidence scores

### 2. Request Optimization

- Use caching: identical requests return cached results quickly
- Be specific with context (industry, country, constraints)
- Set realistic options (don't use `maxTokens: 100` for complex tasks)
- Provide previous scores for trend analysis

### 3. Result Interpretation

- **Confidence score**: >80 = high reliability, 60-80 = moderate, <60 = limited data
- **Warnings**: Always review and address warnings before making decisions
- **Suggestions**: Follow suggestions for optimal implementation
- **Trends**: Track over time to measure progress

### 4. Cost Management

- Cache frequently assessed suppliers
- Batch assessments when possible
- Monitor token usage in metadata
- Use appropriate model sizes (default is usually sufficient)

---

## Frontend Integration Example

### React Component

```typescript
import { useState } from 'react';
import type { ESGAssessmentOutput } from '@/types/agents';

export function SupplierAssessment({ supplierId }: { supplierId: string }) {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ESGAssessmentOutput | null>(null);

  const runAssessment = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/agents/v2/esg-assessment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          supplierId,
          // ... other required fields
        }),
      });

      const data = await response.json();
      if (data.success) {
        setResult(data.data.result);
      } else {
        console.error('Assessment failed:', data.error);
      }
    } catch (error) {
      console.error('Request failed:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button onClick={runAssessment} disabled={loading}>
        {loading ? 'Assessing...' : 'Run ESG Assessment'}
      </button>

      {result && (
        <div>
          <h2>Overall Score: {result.overallScore}/100</h2>

          <h3>Scores by Pillar:</h3>
          <ul>
            <li>Environmental: {result.scores.environmental.score}/100</li>
            <li>Social: {result.scores.social.score}/100</li>
            <li>Governance: {result.scores.governance.score}/100</li>
          </ul>

          <h3>Strengths:</h3>
          <ul>
            {result.strengths.map((s, i) => (
              <li key={i}>{s}</li>
            ))}
          </ul>

          <h3>Areas for Improvement:</h3>
          <ul>
            {result.weaknesses.map((w, i) => (
              <li key={i}>{w}</li>
            ))}
          </ul>

          <h3>Risks ({result.risks.length}):</h3>
          {result.risks.map((risk, i) => (
            <div key={i} className={`risk-${risk.severity}`}>
              <strong>[{risk.severity.toUpperCase()}]</strong> {risk.description}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
```

---

## Testing

### Manual Testing

Use the provided curl examples or tools like Postman/Insomnia.

### Automated Testing

```typescript
import { describe, it, expect } from '@jest/globals';

describe('ESG Assessment Agent', () => {
  it('should assess supplier successfully', async () => {
    const response = await fetch('http://localhost:5050/api/agents/v2/esg-assessment', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${testToken}`,
      },
      body: JSON.stringify(mockAssessmentInput),
    });

    const data = await response.json();
    expect(data.success).toBe(true);
    expect(data.data.result.overallScore).toBeGreaterThanOrEqual(0);
    expect(data.data.result.overallScore).toBeLessThanOrEqual(100);
  });
});
```

---

## Support

For issues or questions:
1. Check the [AGENT-DEVELOPMENT-GUIDE.md](./AGENT-DEVELOPMENT-GUIDE.md)
2. Review the [BUSINESS-DOMAINS.md](../BUSINESS-DOMAINS.md) for strategy
3. Consult the API logs for detailed error messages

---

*Last Updated: 2025-11-25*
*Agent System v2.0*
