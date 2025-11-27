'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  CheckCircle,
  Clock,
  PlayCircle,
  FileCheck,
  Shield,
  Zap,
  Mountain,
} from 'lucide-react';

// --- Types for the Lambda response ---
type Assessment = {
  complianceScore: number;
  riskLevel: string;
  standards: string[];
  recommendations: string[];
};

type AssessmentResponse = {
  company: string;
  assessment: Assessment;
};

// --- Static base definitions ---
const baseAssessments = [
  {
    id: 'iso-14001',
    title: 'ISO 14001',
    subtitle: 'Environmental Management',
    description:
      'Comprehensive environmental management system assessment aligned with international standards',
    icon: '🌍',
    color: 'green',
    status: 'completed' as const,
    score: 95,
    lastUpdated: '2 days ago',
    IconComponent: FileCheck,
  },
  {
    id: 'iso-45001',
    title: 'ISO 45001',
    subtitle: 'Health & Safety',
    description:
      'Occupational health and safety management system evaluation and compliance tracking',
    icon: '🏥',
    color: 'blue',
    status: 'in-progress' as const,
    progress: 65,
    lastUpdated: '1 day ago',
    IconComponent: Shield,
  },
  {
    id: 'iso-50001',
    title: 'ISO 50001',
    subtitle: 'Energy Management',
    description:
      'Energy performance optimization and efficiency management framework assessment',
    icon: '⚡',
    color: 'yellow',
    status: 'not-started' as const,
    lastUpdated: 'Never',
    IconComponent: Zap,
  },
  {
    id: 'gistm',
    title: 'GISTM',
    subtitle: 'Tailings Storage',
    description:
      'Global Industry Standard for Tailings Management - Mining sector compliance',
    icon: '⛏️',
    color: 'purple',
    status: 'not-started' as const,
    lastUpdated: 'Never',
    IconComponent: Mountain,
  },
];

export default function AssessmentsPage() {
  const [iso14001Data, setIso14001Data] = useState<AssessmentResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch live assessment from API route that calls Lambda
  useEffect(() => {
    const run = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch('/api/esg-assessment', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            companyName: 'Test Mining Corp',
            documentText:
              'Our company implements ISO 14001 environmental management. We have comprehensive water management and waste reduction programs. Current compliance level is estimated at 85%.',
            assessmentType: 'quick-assessment',
            standards: ['ISO14001', 'ISO45001'],
          }),
        });

        if (!res.ok) {
          throw new Error(`API error ${res.status}`);
        }

        const json: AssessmentResponse = await res.json();
        setIso14001Data(json);
      } catch (err: any) {
        console.error('Failed to fetch ESG assessment', err);
        setError(err.message ?? 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    run();
  }, []);

  // Compute dynamic ISO 14001 score (falls back to static 95)
  const isoScore = iso14001Data?.assessment?.complianceScore ?? 95;

  // Derive values for the stats cards (you can expand later)
  const totalAssessments = baseAssessments.length;
  const completedCount = baseAssessments.filter((a) => a.status === 'completed').length;
  const inProgressCount = baseAssessments.filter((a) => a.status === 'in-progress').length;
  const avgScore = isoScore; // for now, just mirror ISO 14001; later you can average across more

  const assessments = baseAssessments;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900">ESG Assessments</h1>
              <p className="text-gray-600 mt-2 text-lg">
                Evaluate your compliance across multiple frameworks and standards
              </p>
              <div className="mt-2 text-xs text-gray-500">
                {loading && <span>Running live ISO 14001 assessment…</span>}
                {!loading && iso14001Data && (
                  <span>
                    Live score loaded from AWS Lambda + Claude for{' '}
                    <span className="font-semibold">{iso14001Data.company}</span>.
                  </span>
                )}
                {!loading && error && (
                  <span className="text-red-500">
                    Failed to load live assessment: {error}
                  </span>
                )}
              </div>
            </div>
            <Link
              href="/dashboard"
              className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors"
            >
              ← Back to Dashboard
            </Link>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium">Total Assessments</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">
                  {totalAssessments}
                </p>
              </div>
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
                <FileCheck className="w-6 h-6 text-indigo-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium">Completed</p>
                <p className="text-3xl font-bold text-green-600 mt-1">
                  {completedCount}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium">In Progress</p>
                <p className="text-3xl font-bold text-blue-600 mt-1">
                  {inProgressCount}
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Clock className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium">Avg. Score</p>
                <p className="text-3xl font-bold text-indigo-600 mt-1">
                  {avgScore}%
                </p>
              </div>
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
                <span className="text-2xl">📊</span>
              </div>
            </div>
          </div>
        </div>

        {/* Assessment Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {assessments.map((assessment) => {
            const Icon = assessment.IconComponent;

            // If this is ISO 14001 and we have live data, override score/status/lastUpdated
            const isIso14001 = assessment.id === 'iso-14001';
            const liveScore = isIso14001
              ? iso14001Data?.assessment?.complianceScore ?? assessment.score
              : assessment.score;
            const liveStatus =
              isIso14001 && iso14001Data ? ('completed' as const) : assessment.status;
            const liveLastUpdated =
              isIso14001 && iso14001Data ? 'Just now' : assessment.lastUpdated;

            return (
              <div
                key={assessment.id}
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 hover:shadow-lg transition-all duration-300"
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center text-3xl shadow-lg">
                      {assessment.icon}
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900">
                        {assessment.title}
                      </h3>
                      <p className="text-gray-600 font-medium">
                        {assessment.subtitle}
                      </p>
                      {isIso14001 && iso14001Data && (
                        <p className="mt-1 text-xs text-gray-500">
                          Live assessment for {iso14001Data.company}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Status Badge */}
                  {liveStatus === 'completed' && (
                    <div className="flex items-center gap-2 px-4 py-2 bg-green-100 text-green-700 rounded-full font-semibold">
                      <CheckCircle className="w-5 h-5" />
                      <span>{liveScore}%</span>
                    </div>
                  )}
                  {liveStatus === 'in-progress' && (
                    <div className="flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-full font-semibold">
                      <Clock className="w-5 h-5" />
                      <span>{assessment.progress}%</span>
                    </div>
                  )}
                  {liveStatus === 'not-started' && (
                    <div className="px-4 py-2 bg-gray-100 text-gray-600 rounded-full font-semibold">
                      Not Started
                    </div>
                  )}
                </div>

                {/* Description */}
                <p className="text-gray-700 text-lg mb-6 leading-relaxed">
                  {assessment.description}
                </p>

                {/* Progress Bar (for in-progress assessments) */}
                {liveStatus === 'in-progress' && assessment.progress !== undefined && (
                  <div className="mb-6">
                    <div className="flex justify-between text-sm text-gray-600 mb-2">
                      <span>Progress</span>
                      <span className="font-semibold">{assessment.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className="bg-gradient-to-r from-blue-500 to-indigo-600 h-3 rounded-full transition-all duration-500"
                        style={{ width: `${assessment.progress}%` }}
                      />
                    </div>
                  </div>
                )}

                {/* Footer */}
                <div className="flex items-center justify-between pt-6 border-t border-gray-200">
                  <div className="text-sm text-gray-600">
                    <span className="font-medium">Last updated:</span>{' '}
                    {liveLastUpdated}
                  </div>

                  <button
                    className={`
                      inline-flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all
                      ${
                        liveStatus === 'completed'
                          ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          : 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:shadow-lg transform hover:-translate-y-0.5'
                      }
                    `}
                  >
                    <Icon className="w-5 h-5" />
                    <span>
                      {liveStatus === 'completed'
                        ? 'View Results'
                        : liveStatus === 'in-progress'
                        ? 'Continue Assessment'
                        : 'Start Assessment'}
                    </span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Call to Action */}
        <div className="mt-12 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl shadow-lg p-10 text-white">
          <div className="max-w-3xl">
            <h3 className="text-3xl font-bold mb-4">Need Help With Assessments?</h3>
            <p className="text-indigo-100 text-lg mb-6 leading-relaxed">
              Our AI-powered insights can help you identify compliance gaps, prioritize
              improvements, and generate actionable recommendations based on industry best
              practices.
            </p>
            <Link
              href="/ai-insights"
              className="inline-flex items-center gap-2 px-8 py-4 bg-white text-indigo-600 rounded-lg font-bold hover:bg-indigo-50 transition-colors"
            >
              <span>✨</span>
              Get AI Insights
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
