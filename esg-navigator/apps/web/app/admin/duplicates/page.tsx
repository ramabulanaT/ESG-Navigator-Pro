'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { AlertTriangle, CheckCircle, XCircle, FileText, Database, FolderOpen, Code, GitBranch, Search, Filter, Home, ArrowLeft } from 'lucide-react';

type DuplicateStatus = 'active' | 'deprecated' | 'backup' | 'legacy' | 'review';
type DuplicateType = 'page' | 'component' | 'data' | 'api' | 'directory' | 'config';
type ActionType = 'keep' | 'merge' | 'delete' | 'review' | 'consolidate';

interface DuplicateItem {
  id: string;
  type: DuplicateType;
  category: string;
  original: string;
  duplicates: string[];
  status: DuplicateStatus;
  action: ActionType;
  lastModified: string;
  lines?: number;
  description: string;
  impact: 'high' | 'medium' | 'low';
}

const duplicatesData: DuplicateItem[] = [
  // PAGE DUPLICATES
  {
    id: 'page-home-1',
    type: 'page',
    category: 'Landing Pages',
    original: '/app/page.tsx',
    duplicates: ['/src/app/page.tsx', '/app/page.tsx.bak-20251119220537'],
    status: 'active',
    action: 'consolidate',
    lastModified: '2024-11-19',
    lines: 211,
    description: 'TIS Holdings landing page - Modern design with hero section',
    impact: 'high'
  },
  {
    id: 'page-home-2',
    type: 'page',
    category: 'Landing Pages',
    original: '/src/app/page.tsx',
    duplicates: [],
    status: 'deprecated',
    action: 'delete',
    lastModified: '2024-10-16',
    lines: 48,
    description: 'TIS-IntelliMat ESG Navigator - Simpler version, outdated',
    impact: 'medium'
  },
  {
    id: 'page-assessments-1',
    type: 'page',
    category: 'Assessment Pages',
    original: '/app/assessments/page.tsx',
    duplicates: ['/src/app/assessments/page.tsx', '/app/assessments/page.tsx.bak-20251119220537'],
    status: 'active',
    action: 'consolidate',
    lastModified: '2024-11-19',
    lines: 325,
    description: 'Interactive assessments with email integration',
    impact: 'high'
  },
  {
    id: 'page-assessments-2',
    type: 'page',
    category: 'Assessment Pages',
    original: '/src/app/assessments/page.tsx',
    duplicates: [],
    status: 'deprecated',
    action: 'delete',
    lastModified: '2024-10-17',
    lines: 367,
    description: 'AWS Lambda/Claude API integration version - outdated',
    impact: 'medium'
  },

  // DATA DUPLICATES
  {
    id: 'data-suppliers-1',
    type: 'data',
    category: 'Supplier Data',
    original: '/apps/api/src/data/suppliers.data.ts',
    duplicates: [
      '/apps/api/index.js (hardcoded)',
      '/apps/web/app/api/app-suppliers/route.ts (demo array)',
      '/apps/api/index.backup.js',
      '/apps/api/index.backup.ts'
    ],
    status: 'active',
    action: 'consolidate',
    lastModified: '2024-11-20',
    lines: 493,
    description: 'Full supplier data with compliance, audit history, and metrics (5 suppliers)',
    impact: 'high'
  },
  {
    id: 'data-suppliers-2',
    type: 'data',
    category: 'Supplier Data',
    original: '/apps/api/index.js',
    duplicates: [],
    status: 'deprecated',
    action: 'merge',
    lastModified: '2024-11-15',
    lines: 150,
    description: 'Hardcoded supplier data in API route (4 suppliers, missing Siemens)',
    impact: 'high'
  },
  {
    id: 'data-suppliers-3',
    type: 'data',
    category: 'Supplier Data',
    original: '/apps/web/app/api/app-suppliers/route.ts',
    duplicates: [],
    status: 'active',
    action: 'review',
    lastModified: '2024-11-18',
    lines: 80,
    description: 'Demo fallback supplier array (minimal data for offline mode)',
    impact: 'medium'
  },
  {
    id: 'data-assessments-1',
    type: 'data',
    category: 'Assessment Data',
    original: '/app/assessments/page.tsx',
    duplicates: [
      '/src/app/assessments/page.tsx (baseAssessments)',
      '/app/api/assessments/route.ts (frameworkPrompts)'
    ],
    status: 'active',
    action: 'consolidate',
    lastModified: '2024-11-19',
    lines: 50,
    description: 'Static initialAssessments array - ISO 14001, 45001, 50001, GISTM',
    impact: 'high'
  },

  // DIRECTORY DUPLICATES
  {
    id: 'dir-app-1',
    type: 'directory',
    category: 'App Structure',
    original: '/app/',
    duplicates: ['/src/app/'],
    status: 'active',
    action: 'consolidate',
    lastModified: '2024-11-19',
    description: 'Current App Router structure - Next.js 14',
    impact: 'high'
  },
  {
    id: 'dir-app-2',
    type: 'directory',
    category: 'App Structure',
    original: '/src/app/',
    duplicates: [],
    status: 'deprecated',
    action: 'delete',
    lastModified: '2024-10-17',
    description: 'Old duplicate app directory structure - should be removed',
    impact: 'high'
  },
  {
    id: 'dir-pages-legacy',
    type: 'directory',
    category: 'Legacy Structure',
    original: '/pages/',
    duplicates: [
      '/pages__backup_20251016_234339/',
      '/pages__backup_20251017_000954/'
    ],
    status: 'legacy',
    action: 'delete',
    lastModified: '2024-10-17',
    description: 'Old Next.js Pages Router - not in use, can be safely removed',
    impact: 'low'
  },

  // API DUPLICATES
  {
    id: 'api-backend-1',
    type: 'api',
    category: 'Backend API',
    original: '/apps/api/src/index.ts',
    duplicates: [
      '/apps/api/index.js (compiled)',
      '/apps/api/index.backup.js',
      '/apps/api/index.backup.ts'
    ],
    status: 'active',
    action: 'keep',
    lastModified: '2024-11-20',
    lines: 450,
    description: 'TypeScript source for Express API - this is the source of truth',
    impact: 'high'
  },
  {
    id: 'api-backend-2',
    type: 'api',
    category: 'Backend API',
    original: '/apps/api/index.js',
    duplicates: [],
    status: 'active',
    action: 'keep',
    lastModified: '2024-11-20',
    lines: 450,
    description: 'Compiled JavaScript (from TypeScript) - currently running',
    impact: 'high'
  },
  {
    id: 'api-backend-backup',
    type: 'api',
    category: 'Backend API',
    original: '/apps/api/index.backup.js',
    duplicates: ['/apps/api/index.backup.ts'],
    status: 'backup',
    action: 'delete',
    lastModified: '2024-10-15',
    description: 'Old backup files - can be safely removed if git history exists',
    impact: 'low'
  },

  // COMPONENT DUPLICATES
  {
    id: 'component-cards',
    type: 'component',
    category: 'Display Components',
    original: '/components/SupplierCard.tsx',
    duplicates: [
      '/app/demo/components/DemoESGCard.tsx',
    ],
    status: 'active',
    action: 'review',
    lastModified: '2024-11-18',
    description: 'Multiple card components for supplier display - consider consolidation',
    impact: 'medium'
  },

  // CONFIG DUPLICATES
  {
    id: 'config-env',
    type: 'config',
    category: 'Environment Config',
    original: '/.env',
    duplicates: ['/.env.local', '/.env.example'],
    status: 'active',
    action: 'keep',
    lastModified: '2024-11-20',
    description: 'Environment configuration files - .env.example is intentional',
    impact: 'low'
  }
];

// ADDITIONS DATA
interface AdditionItem {
  id: string;
  type: 'feature' | 'component' | 'api' | 'data' | 'integration';
  name: string;
  path: string;
  dateAdded: string;
  description: string;
  status: 'implemented' | 'in-progress' | 'planned';
}

const additionsData: AdditionItem[] = [
  {
    id: 'add-1',
    type: 'feature',
    name: 'Consultation Form Modal',
    path: '/app/components/ConsultationModal.tsx',
    dateAdded: '2024-11-19',
    description: 'Schedule consultation button with email integration',
    status: 'implemented'
  },
  {
    id: 'add-2',
    type: 'feature',
    name: 'Interactive Assessments',
    path: '/app/assessments/page.tsx',
    dateAdded: '2024-11-19',
    description: 'ISO standards assessment with email scheduling',
    status: 'implemented'
  },
  {
    id: 'add-3',
    type: 'api',
    name: 'Supplier Data API',
    path: '/apps/api/src/data/suppliers.data.ts',
    dateAdded: '2024-11-15',
    description: 'Comprehensive supplier data with compliance tracking',
    status: 'implemented'
  },
  {
    id: 'add-4',
    type: 'integration',
    name: 'Anthropic Claude API',
    path: '/apps/api/src/index.ts',
    dateAdded: '2024-11-10',
    description: 'AI-powered ESG insights and analysis',
    status: 'implemented'
  },
  {
    id: 'add-5',
    type: 'component',
    name: 'Emissions Chart',
    path: '/components/EmissionsChart.tsx',
    dateAdded: '2024-11-12',
    description: 'Carbon emissions visualization with Chart.js',
    status: 'implemented'
  },
  {
    id: 'add-6',
    type: 'data',
    name: 'ISO Standards Framework',
    path: '/app/assessments/page.tsx',
    dateAdded: '2024-11-15',
    description: 'ISO 14001, 45001, 50001, GISTM assessment frameworks',
    status: 'implemented'
  },
  {
    id: 'add-7',
    type: 'feature',
    name: 'Real-time Dashboard',
    path: '/src/app/dashboard/page.tsx',
    dateAdded: '2024-11-08',
    description: 'Supplier monitoring dashboard with AI chat',
    status: 'implemented'
  },
  {
    id: 'add-8',
    type: 'api',
    name: 'Email Notification System',
    path: '/app/api/send-email/route.ts',
    dateAdded: '2024-11-18',
    description: 'Nodemailer integration for consultation requests',
    status: 'implemented'
  }
];

export default function DuplicatesPage() {
  const [activeTab, setActiveTab] = useState<'duplicates' | 'additions'>('duplicates');
  const [filterType, setFilterType] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterImpact, setFilterImpact] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Filter duplicates
  const filteredDuplicates = useMemo(() => {
    return duplicatesData.filter(item => {
      const matchesType = filterType === 'all' || item.type === filterType;
      const matchesStatus = filterStatus === 'all' || item.status === filterStatus;
      const matchesImpact = filterImpact === 'all' || item.impact === filterImpact;
      const matchesSearch = searchQuery === '' ||
        item.original.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.duplicates.some(d => d.toLowerCase().includes(searchQuery.toLowerCase()));

      return matchesType && matchesStatus && matchesImpact && matchesSearch;
    });
  }, [filterType, filterStatus, filterImpact, searchQuery]);

  // Filter additions
  const filteredAdditions = useMemo(() => {
    return additionsData.filter(item => {
      const matchesSearch = searchQuery === '' ||
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.path.toLowerCase().includes(searchQuery.toLowerCase()));

      return matchesSearch;
    });
  }, [searchQuery]);

  // Statistics
  const stats = {
    totalDuplicates: duplicatesData.length,
    highImpact: duplicatesData.filter(d => d.impact === 'high').length,
    needsAction: duplicatesData.filter(d => d.action !== 'keep').length,
    totalAdditions: additionsData.length,
    implemented: additionsData.filter(a => a.status === 'implemented').length,
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'page': return <FileText className="w-4 h-4" />;
      case 'data': return <Database className="w-4 h-4" />;
      case 'directory': return <FolderOpen className="w-4 h-4" />;
      case 'api': return <Code className="w-4 h-4" />;
      case 'component': return <Code className="w-4 h-4" />;
      case 'config': return <FileText className="w-4 h-4" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };

  const getStatusBadge = (status: DuplicateStatus) => {
    const styles = {
      active: 'bg-green-100 text-green-800 border-green-200',
      deprecated: 'bg-orange-100 text-orange-800 border-orange-200',
      backup: 'bg-gray-100 text-gray-800 border-gray-200',
      legacy: 'bg-red-100 text-red-800 border-red-200',
      review: 'bg-blue-100 text-blue-800 border-blue-200'
    };
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium border ${styles[status]}`}>
        {status.toUpperCase()}
      </span>
    );
  };

  const getActionBadge = (action: ActionType) => {
    const styles = {
      keep: 'bg-green-100 text-green-800 border-green-200',
      merge: 'bg-blue-100 text-blue-800 border-blue-200',
      delete: 'bg-red-100 text-red-800 border-red-200',
      review: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      consolidate: 'bg-purple-100 text-purple-800 border-purple-200'
    };
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium border ${styles[action]}`}>
        {action.toUpperCase()}
      </span>
    );
  };

  const getImpactBadge = (impact: 'high' | 'medium' | 'low') => {
    const styles = {
      high: 'bg-red-100 text-red-800 border-red-200',
      medium: 'bg-orange-100 text-orange-800 border-orange-200',
      low: 'bg-green-100 text-green-800 border-green-200'
    };
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium border ${styles[impact]}`}>
        {impact.toUpperCase()}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-3">
              <GitBranch className="w-8 h-8 text-indigo-600" />
              <h1 className="text-4xl font-bold text-gray-900">Code Duplicates & Additions</h1>
            </div>
            <div className="flex items-center gap-3">
              <Link
                href="/assessments"
                className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Assessments
              </Link>
              <Link
                href="/"
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors flex items-center gap-2"
              >
                <Home className="w-4 h-4" />
                Home
              </Link>
            </div>
          </div>
          <p className="text-gray-600 text-lg">
            Track duplicate files, data sources, and new additions to ensure comprehensive, maintainable codebase
          </p>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex items-center gap-2 mb-1">
              <AlertTriangle className="w-5 h-5 text-orange-600" />
              <p className="text-sm text-gray-600">Total Duplicates</p>
            </div>
            <p className="text-3xl font-bold text-gray-900">{stats.totalDuplicates}</p>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex items-center gap-2 mb-1">
              <XCircle className="w-5 h-5 text-red-600" />
              <p className="text-sm text-gray-600">High Impact</p>
            </div>
            <p className="text-3xl font-bold text-red-600">{stats.highImpact}</p>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex items-center gap-2 mb-1">
              <Filter className="w-5 h-5 text-blue-600" />
              <p className="text-sm text-gray-600">Needs Action</p>
            </div>
            <p className="text-3xl font-bold text-blue-600">{stats.needsAction}</p>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex items-center gap-2 mb-1">
              <FileText className="w-5 h-5 text-green-600" />
              <p className="text-sm text-gray-600">Total Additions</p>
            </div>
            <p className="text-3xl font-bold text-green-600">{stats.totalAdditions}</p>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex items-center gap-2 mb-1">
              <CheckCircle className="w-5 h-5 text-emerald-600" />
              <p className="text-sm text-gray-600">Implemented</p>
            </div>
            <p className="text-3xl font-bold text-emerald-600">{stats.implemented}</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setActiveTab('duplicates')}
              className={`flex-1 px-6 py-4 text-sm font-medium transition-colors ${
                activeTab === 'duplicates'
                  ? 'text-indigo-600 border-b-2 border-indigo-600 bg-indigo-50'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <AlertTriangle className="w-4 h-4" />
                <span>Duplicates ({duplicatesData.length})</span>
              </div>
            </button>
            <button
              onClick={() => setActiveTab('additions')}
              className={`flex-1 px-6 py-4 text-sm font-medium transition-colors ${
                activeTab === 'additions'
                  ? 'text-indigo-600 border-b-2 border-indigo-600 bg-indigo-50'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <CheckCircle className="w-4 h-4" />
                <span>Additions ({additionsData.length})</span>
              </div>
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Search className="w-4 h-4 inline mr-1" />
                Search
              </label>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search files, paths, descriptions..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            {activeTab === 'duplicates' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
                  <select
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="all">All Types</option>
                    <option value="page">Pages</option>
                    <option value="data">Data</option>
                    <option value="api">API</option>
                    <option value="directory">Directories</option>
                    <option value="component">Components</option>
                    <option value="config">Config</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="all">All Status</option>
                    <option value="active">Active</option>
                    <option value="deprecated">Deprecated</option>
                    <option value="backup">Backup</option>
                    <option value="legacy">Legacy</option>
                    <option value="review">Review</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Impact</label>
                  <select
                    value={filterImpact}
                    onChange={(e) => setFilterImpact(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="all">All Impact</option>
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                  </select>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Content */}
        {activeTab === 'duplicates' ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Type</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Category</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Original File</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Duplicate Files</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Status</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Impact</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Action</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Description</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredDuplicates.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2 text-gray-700">
                          {getTypeIcon(item.type)}
                          <span className="text-sm font-medium capitalize">{item.type}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-sm text-gray-900 font-medium">{item.category}</span>
                      </td>
                      <td className="px-4 py-3">
                        <code className="text-xs bg-gray-100 px-2 py-1 rounded text-gray-800 font-mono">
                          {item.original}
                        </code>
                        {item.lines && (
                          <span className="ml-2 text-xs text-gray-500">({item.lines} lines)</span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <div className="space-y-1">
                          {item.duplicates.length > 0 ? (
                            item.duplicates.map((dup, idx) => (
                              <code key={idx} className="block text-xs bg-orange-50 px-2 py-1 rounded text-orange-800 font-mono">
                                {dup}
                              </code>
                            ))
                          ) : (
                            <span className="text-xs text-gray-400 italic">No duplicates</span>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        {getStatusBadge(item.status)}
                      </td>
                      <td className="px-4 py-3">
                        {getImpactBadge(item.impact)}
                      </td>
                      <td className="px-4 py-3">
                        {getActionBadge(item.action)}
                      </td>
                      <td className="px-4 py-3">
                        <p className="text-sm text-gray-600 max-w-xs">{item.description}</p>
                        <p className="text-xs text-gray-400 mt-1">Modified: {item.lastModified}</p>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {filteredDuplicates.length === 0 && (
              <div className="text-center py-12">
                <Filter className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-600">No duplicates match your filters</p>
              </div>
            )}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Type</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Name</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Path</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Date Added</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Status</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Description</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredAdditions.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2 text-gray-700">
                          {getTypeIcon(item.type)}
                          <span className="text-sm font-medium capitalize">{item.type}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-sm font-semibold text-gray-900">{item.name}</span>
                      </td>
                      <td className="px-4 py-3">
                        <code className="text-xs bg-gray-100 px-2 py-1 rounded text-gray-800 font-mono">
                          {item.path}
                        </code>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-sm text-gray-600">{item.dateAdded}</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium border ${
                          item.status === 'implemented' ? 'bg-green-100 text-green-800 border-green-200' :
                          item.status === 'in-progress' ? 'bg-blue-100 text-blue-800 border-blue-200' :
                          'bg-gray-100 text-gray-800 border-gray-200'
                        }`}>
                          {item.status.toUpperCase()}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <p className="text-sm text-gray-600 max-w-md">{item.description}</p>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {filteredAdditions.length === 0 && (
              <div className="text-center py-12">
                <Search className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-600">No additions match your search</p>
              </div>
            )}
          </div>
        )}

        {/* Summary Panel */}
        <div className="mt-8 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Recommendations Summary</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                <XCircle className="w-4 h-4 text-red-600" />
                High Priority Actions
              </h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-start gap-2">
                  <span className="text-red-600 font-bold">•</span>
                  <span><strong>Consolidate supplier data</strong> - Unify 4 duplicate data sources into single source of truth</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-600 font-bold">•</span>
                  <span><strong>Remove /src/app/ directory</strong> - Deprecated duplicate of main /app/ structure</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-600 font-bold">•</span>
                  <span><strong>Consolidate assessment data</strong> - Merge 3 assessment definition locations</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-600 font-bold">•</span>
                  <span><strong>Clean up page duplicates</strong> - Remove deprecated versions of home and assessments pages</span>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                Safe to Remove
              </h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-start gap-2">
                  <span className="text-green-600 font-bold">•</span>
                  <span>Legacy /pages/ directory and backups - Not in use</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 font-bold">•</span>
                  <span>API backup files - Git history exists</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 font-bold">•</span>
                  <span>Backup page files (.bak-*) - Safely stored in git</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 font-bold">•</span>
                  <span>Old assessment page in /src/app/ - Replaced by newer version</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
