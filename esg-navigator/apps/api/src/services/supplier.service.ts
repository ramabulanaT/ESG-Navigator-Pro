import { Supplier, Portfolio } from '../models/supplier.model';

// Suppliers are loaded dynamically from database/API - no hardcoded data
let suppliers: Supplier[] = [];

// Default empty portfolio - will be populated from database
const defaultPortfolio: Portfolio = {
  totalValue: 'R0',
  totalValueNumeric: 0,
  overallCompliance: '0%',
  activeSuppliers: 0,
  assessmentDate: new Date().toISOString().split('T')[0],
  riskDistribution: {
    low: 0,
    medium: 0,
    high: 0,
    critical: 0
  },
  byIndustry: {},
  topRisks: []
};

export class SupplierService {
  // Add suppliers dynamically (for future database integration)
  setSuppliers(newSuppliers: Supplier[]): void {
    suppliers = newSuppliers;
  }

  getAllSuppliers(): Supplier[] {
    return suppliers;
  }

  getSupplierById(id: string): Supplier | null {
    return suppliers.find(s => s.id === id) || null;
  }

  getSupplierByName(name: string): Supplier | null {
    return suppliers.find(
      s => s.name.toLowerCase().includes(name.toLowerCase())
    ) || null;
  }

  getPortfolio(): Portfolio {
    if (suppliers.length === 0) {
      return defaultPortfolio;
    }

    // Calculate portfolio from current suppliers
    const totalValue = suppliers.reduce((sum, s) => sum + s.contractValueNumeric, 0);
    const totalIssues = suppliers.reduce((sum, s) => sum + s.complianceIssues, 0);
    const suppliersWithIssues = suppliers.filter(s => s.complianceIssues > 0).length;
    const complianceRate = ((suppliers.length - suppliersWithIssues) / suppliers.length * 100).toFixed(1);

    return {
      totalValue: `R${(totalValue / 1000000).toFixed(0)}M`,
      totalValueNumeric: totalValue,
      overallCompliance: `${complianceRate}%`,
      activeSuppliers: suppliers.length,
      assessmentDate: new Date().toISOString().split('T')[0],
      riskDistribution: {
        low: suppliers.filter(s => s.riskLevel === 'LOW').length,
        medium: suppliers.filter(s => s.riskLevel === 'MEDIUM').length,
        high: suppliers.filter(s => s.riskLevel === 'HIGH').length,
        critical: suppliers.filter(s => s.riskLevel === 'CRITICAL').length
      },
      byIndustry: {},
      topRisks: []
    };
  }

  getSuppliersByRiskLevel(riskLevel: string): Supplier[] {
    return suppliers.filter(
      s => s.riskLevel === riskLevel.toUpperCase()
    );
  }

  getSuppliersByScoreRange(min: number, max: number): Supplier[] {
    return suppliers.filter(
      s => s.esgScore >= min && s.esgScore <= max
    );
  }

  getTopPerformers(limit: number = 3): Supplier[] {
    return [...suppliers]
      .sort((a, b) => b.esgScore - a.esgScore)
      .slice(0, limit);
  }

  getHighRiskSuppliers(): Supplier[] {
    return suppliers.filter(
      s => s.riskLevel === 'HIGH' || s.riskLevel === 'CRITICAL'
    );
  }

  getTotalContractValue(): number {
    return suppliers.reduce(
      (sum, s) => sum + s.contractValueNumeric,
      0
    );
  }

  getComplianceStats() {
    const total = suppliers.length;
    if (total === 0) {
      return {
        totalSuppliers: 0,
        suppliersWithIssues: 0,
        suppliersCompliant: 0,
        totalIssues: 0,
        complianceRate: '0%'
      };
    }

    const withIssues = suppliers.filter(s => s.complianceIssues > 0).length;
    const totalIssues = suppliers.reduce((sum, s) => sum + s.complianceIssues, 0);

    return {
      totalSuppliers: total,
      suppliersWithIssues: withIssues,
      suppliersCompliant: total - withIssues,
      totalIssues,
      complianceRate: ((total - withIssues) / total * 100).toFixed(1) + '%'
    };
  }

  getESGDistribution() {
    return {
      excellent: suppliers.filter(s => s.esgScore >= 80).length,
      good: suppliers.filter(s => s.esgScore >= 70 && s.esgScore < 80).length,
      fair: suppliers.filter(s => s.esgScore >= 60 && s.esgScore < 70).length,
      poor: suppliers.filter(s => s.esgScore < 60).length
    };
  }
}

export const supplierService = new SupplierService();
