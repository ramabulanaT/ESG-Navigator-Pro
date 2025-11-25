/**
 * IBM Envizi ESG Suite Integration Types
 *
 * @description Type definitions for Envizi ESG data management platform
 * @see https://www.ibm.com/products/envizi
 */

export interface EnviziConfig {
  apiKey: string;
  baseUrl: string;
  organizationId: string;
}

export interface EnviziMetric {
  id: string;
  name: string;
  category: 'environmental' | 'social' | 'governance';
  value: number;
  unit: string;
  timestamp: string;
  source: string;
}

export interface EnviziEmissionsData {
  scope1: number;
  scope2: number;
  scope3: number;
  totalEmissions: number;
  unit: 'tCO2e';
  period: {
    start: string;
    end: string;
  };
  breakdown?: {
    category: string;
    emissions: number;
  }[];
}

export interface EnviziComplianceReport {
  id: string;
  framework: string; // e.g., 'GRI', 'SASB', 'TCFD', 'IFRS S1/S2'
  status: 'draft' | 'in-progress' | 'completed' | 'submitted';
  completeness: number; // 0-100
  lastUpdated: string;
  dueDate?: string;
}

export interface EnviziSyncRequest {
  dataType: 'emissions' | 'metrics' | 'compliance' | 'all';
  startDate?: string;
  endDate?: string;
}

export interface EnviziSyncResponse {
  success: boolean;
  recordsSynced: number;
  errors?: string[];
  lastSyncTimestamp: string;
}
