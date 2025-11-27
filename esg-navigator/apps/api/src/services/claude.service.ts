import Anthropic from '@anthropic-ai/sdk';
import dotenv from 'dotenv';
import { supplierService } from './supplier.service';

dotenv.config();

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export interface ClaudeMessage {
  role: 'user' | 'assistant';
  content: string;
}

export class ClaudeService {
  private getSystemPrompt(): string {
    const portfolio = supplierService.getPortfolio();
    const suppliers = supplierService.getAllSuppliers();
    const stats = supplierService.getComplianceStats();

    let supplierDetails = '';
    if (suppliers.length > 0) {
      supplierDetails = suppliers.map((s, i) =>
        `${i + 1}. ${s.name} - ${s.contractValue} - ESG Score: ${s.esgScore}/100 - ${s.riskLevel} RISK`
      ).join('\n');
    } else {
      supplierDetails = 'No suppliers configured. Users can add suppliers through the platform.';
    }

    return `You are an ESG analyst for the ESG Navigator platform.

CURRENT PORTFOLIO DATA:
- Total Supply Chain Value: ${portfolio.totalValue}
- Overall ESG Compliance: ${portfolio.overallCompliance}
- Active Suppliers: ${portfolio.activeSuppliers}

SUPPLIER DETAILS:
${supplierDetails}

Provide professional, actionable ESG analysis with specific recommendations.
If no supplier data is available, guide users on how to get started with the platform.`;
  }

  async chat(message: string, conversationHistory: ClaudeMessage[] = []): Promise<string> {
    try {
      const systemPrompt = this.getSystemPrompt();

      const messages = [
        ...conversationHistory,
        { role: 'user' as const, content: message }
      ];

      const response = await anthropic.messages.create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 2500,
        system: systemPrompt,
        messages: messages
      });

      return response.content[0].type === 'text' ? response.content[0].text : '';
    } catch (error: any) {
      console.error('Claude API error:', error);
      throw new Error(`Claude AI Error: ${error.message}`);
    }
  }

  async analyzeSupplier(supplierData: any): Promise<any> {
    const prompt = `Analyze this supplier's ESG performance:

Supplier: ${supplierData.name}
Contract Value: ${supplierData.contractValue}
ESG Score: ${supplierData.esgScore}/100
Risk Level: ${supplierData.riskLevel}
Compliance Issues: ${supplierData.complianceIssues}

Provide detailed analysis in JSON format with:
{
  "riskScore": 0-100,
  "riskFactors": ["factor1", "factor2", "factor3"],
  "recommendations": [
    {
      "action": "specific action",
      "timeline": "timeframe",
      "priority": "high/medium/low"
    }
  ],
  "financialImpact": "estimated cost/savings"
}`;

    const response = await this.chat(prompt);

    try {
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      return { analysis: response };
    } catch {
      return { analysis: response };
    }
  }

  async generateReport(reportType: string = 'executive'): Promise<string> {
    const portfolio = supplierService.getPortfolio();
    const stats = supplierService.getComplianceStats();
    const highRisk = supplierService.getHighRiskSuppliers();

    const prompt = `Generate a ${reportType} ESG report for the current portfolio.

Portfolio Summary:
- Total Value: ${portfolio.totalValue}
- Overall Compliance: ${portfolio.overallCompliance}
- Total Suppliers: ${portfolio.activeSuppliers}
- High Risk Suppliers: ${highRisk.length}

Compliance Stats:
- Suppliers with Issues: ${stats.suppliersWithIssues}
- Total Issues: ${stats.totalIssues}
- Compliance Rate: ${stats.complianceRate}

Create a professional report with:
1. Executive Summary (2 paragraphs)
2. Portfolio Overview
3. Risk Analysis
4. Key Recommendations (top 3 priorities)
5. 90-Day Action Plan

Format for board presentation.`;

    return await this.chat(prompt);
  }
}

export const claudeService = new ClaudeService();
