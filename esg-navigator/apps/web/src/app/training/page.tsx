"use client";
import { useState } from "react";
import Link from "next/link";
import {
  BookOpen,
  CheckCircle,
  Clock,
  PlayCircle,
  Award,
  Users,
  Calendar,
  ArrowRight,
  Lock,
  Download,
  Star,
  TrendingUp,
  GraduationCap,
  FileText,
  Video,
  MessageCircle,
  X,
} from "lucide-react";

// Training Modules Data
const trainingModules = [
  {
    id: "esg-basics",
    title: "ESG Fundamentals",
    description: "Introduction to Environmental, Social, and Governance principles, frameworks, and best practices.",
    duration: "2 hours",
    level: "Beginner",
    completed: true,
    lessons: 8,
    enrolled: 1247,
    rating: 4.8,
    instructor: "Dr. Sarah Mitchell",
    topics: ["What is ESG?", "E, S, G Components", "Why ESG Matters", "Key Frameworks", "Getting Started"],
    certificate: true,
  },
  {
    id: "emissions-101",
    title: "Emissions Accounting 101",
    description: "Learn Scope 1, 2, and 3 emissions tracking, GHG Protocol, and carbon footprint calculation.",
    duration: "3 hours",
    level: "Beginner",
    completed: true,
    lessons: 12,
    enrolled: 983,
    rating: 4.9,
    instructor: "Prof. James Chen",
    topics: ["GHG Protocol", "Scope 1 Emissions", "Scope 2 Emissions", "Scope 3 Emissions", "Calculation Methods"],
    certificate: true,
  },
  {
    id: "standards-mapping",
    title: "Standards Mapping",
    description: "Master IFRS S1/S2, GRI, SASB, TCFD, and CDP reporting standards and compliance requirements.",
    duration: "4 hours",
    level: "Intermediate",
    completed: true,
    lessons: 16,
    enrolled: 756,
    rating: 4.7,
    instructor: "Maria Rodriguez",
    topics: ["GRI Standards", "SASB Framework", "TCFD Recommendations", "CDP Disclosure", "IFRS S1/S2"],
    certificate: true,
  },
  {
    id: "agent-management",
    title: "AI Agent Management",
    description: "Configure and optimize the 9 ESG AI agents for automated compliance monitoring and reporting.",
    duration: "2.5 hours",
    level: "Intermediate",
    completed: false,
    progress: 45,
    lessons: 10,
    enrolled: 542,
    rating: 4.6,
    instructor: "David Thompson",
    topics: ["Agent Overview", "Configuration", "Workflow Setup", "Automation Rules", "Best Practices"],
    certificate: true,
  },
  {
    id: "data-quality",
    title: "Data Quality & Governance",
    description: "Ensure data accuracy, integrity, and compliance through effective governance frameworks.",
    duration: "3 hours",
    level: "Intermediate",
    completed: false,
    progress: 20,
    lessons: 14,
    enrolled: 428,
    rating: 4.5,
    instructor: "Lisa Park",
    topics: ["Data Quality Dimensions", "Governance Framework", "Validation Rules", "Audit Trails", "DAMA Principles"],
    certificate: true,
  },
  {
    id: "assurance-prep",
    title: "Assurance Preparation",
    description: "Prepare for external ESG audits and third-party verification with comprehensive documentation.",
    duration: "2 hours",
    level: "Advanced",
    completed: false,
    lessons: 8,
    enrolled: 312,
    rating: 4.8,
    instructor: "Michael Brooks",
    topics: ["Audit Types", "Evidence Collection", "Gap Analysis", "Pre-audit Checklist", "Working with Auditors"],
    certificate: true,
  },
  {
    id: "reporting",
    title: "ESG Reporting Excellence",
    description: "Create comprehensive, stakeholder-ready ESG reports that meet global disclosure requirements.",
    duration: "3.5 hours",
    level: "Advanced",
    completed: false,
    lessons: 15,
    enrolled: 287,
    rating: 4.7,
    instructor: "Emma Watson",
    topics: ["Report Structure", "Materiality Assessment", "Stakeholder Mapping", "Visual Design", "Digital Reports"],
    certificate: true,
  },
  {
    id: "risk-management",
    title: "ESG Risk Management",
    description: "Identify, assess, and mitigate ESG-related risks across your organization and supply chain.",
    duration: "3 hours",
    level: "Advanced",
    completed: false,
    lessons: 12,
    enrolled: 245,
    rating: 4.6,
    instructor: "Robert Kim",
    topics: ["Risk Identification", "Assessment Methods", "Mitigation Strategies", "Monitoring", "Reporting Risks"],
    certificate: true,
  },
  {
    id: "advanced-analytics",
    title: "Advanced ESG Analytics",
    description: "Deep dive into ESG data analysis using AI/ML, predictive modeling, and benchmarking.",
    duration: "4 hours",
    level: "Advanced",
    completed: false,
    lessons: 18,
    enrolled: 198,
    rating: 4.9,
    instructor: "Dr. Alex Turner",
    topics: ["Data Visualization", "Predictive Analytics", "Benchmarking", "AI/ML in ESG", "Insights Generation"],
    certificate: true,
  },
];

export default function TrainingPage() {
  const [selectedModule, setSelectedModule] = useState<string | null>(null);
  const [showRegistration, setShowRegistration] = useState(false);
  const [registrationModule, setRegistrationModule] = useState<string | null>(null);
  const [showCertificate, setShowCertificate] = useState(false);
  const [certificateModule, setCertificateModule] = useState<any>(null);

  const completedModules = trainingModules.filter(m => m.completed);
  const inProgressModules = trainingModules.filter(m => !m.completed && m.progress);
  const totalHours = trainingModules.reduce((acc, m) => acc + parseFloat(m.duration), 0);
  const completedHours = completedModules.reduce((acc, m) => acc + parseFloat(m.duration), 0);

  const handleRegister = (moduleId: string) => {
    setRegistrationModule(moduleId);
    setShowRegistration(true);
  };

  const handleViewCertificate = (module: any) => {
    setCertificateModule(module);
    setShowCertificate(true);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 via-teal-600 to-cyan-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <GraduationCap className="w-12 h-12" />
                <h1 className="text-5xl font-bold">ESG Training Center</h1>
              </div>
              <p className="text-green-100 text-xl max-w-2xl">
                Master ESG compliance with expert-led courses, earn certificates,
                and advance your sustainability career.
              </p>
            </div>
            <Link
              href="/dashboard"
              className="px-6 py-3 bg-white/20 backdrop-blur-sm text-white rounded-lg font-medium hover:bg-white/30 transition-colors"
            >
              ← Dashboard
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Progress Stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium">Courses Completed</p>
                <p className="text-3xl font-bold text-green-600 mt-1">{completedModules.length}/{trainingModules.length}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
            </div>
            <div className="mt-3 bg-gray-200 rounded-full h-2">
              <div
                className="h-2 rounded-full bg-green-500"
                style={{ width: `${(completedModules.length / trainingModules.length) * 100}%` }}
              />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium">In Progress</p>
                <p className="text-3xl font-bold text-blue-600 mt-1">{inProgressModules.length}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <PlayCircle className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium">Hours Completed</p>
                <p className="text-3xl font-bold text-purple-600 mt-1">{completedHours}</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Clock className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium">Certificates Earned</p>
                <p className="text-3xl font-bold text-amber-600 mt-1">{completedModules.length}</p>
              </div>
              <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center">
                <Award className="w-6 h-6 text-amber-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Course Grid */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Available Courses</h2>
          <p className="text-gray-600">Select a course to view details or register</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {trainingModules.map((module) => (
            <div
              key={module.id}
              className={`bg-white rounded-xl shadow-sm border-2 transition-all duration-300 hover:shadow-lg cursor-pointer ${
                selectedModule === module.id ? 'border-green-500 ring-2 ring-green-200' : 'border-gray-200'
              }`}
              onClick={() => setSelectedModule(selectedModule === module.id ? null : module.id)}
            >
              <div className="p-6">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                    module.completed ? 'bg-green-100' : module.progress ? 'bg-blue-100' : 'bg-gray-100'
                  }`}>
                    <BookOpen className={`w-6 h-6 ${
                      module.completed ? 'text-green-600' : module.progress ? 'text-blue-600' : 'text-gray-400'
                    }`} />
                  </div>
                  <div className="flex items-center gap-2">
                    {module.completed && (
                      <span className="flex items-center gap-1 bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-medium">
                        <CheckCircle className="w-3 h-3" />
                        Completed
                      </span>
                    )}
                    {!module.completed && module.progress && (
                      <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs font-medium">
                        {module.progress}% done
                      </span>
                    )}
                    {!module.completed && !module.progress && (
                      <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs font-medium">
                        Not Started
                      </span>
                    )}
                  </div>
                </div>

                {/* Title & Description */}
                <h3 className="text-lg font-bold text-gray-900 mb-2">{module.title}</h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">{module.description}</p>

                {/* Meta Info */}
                <div className="flex flex-wrap gap-3 mb-4 text-sm">
                  <span className="flex items-center gap-1 text-gray-500">
                    <Clock className="w-4 h-4" />
                    {module.duration}
                  </span>
                  <span className="flex items-center gap-1 text-gray-500">
                    <FileText className="w-4 h-4" />
                    {module.lessons} lessons
                  </span>
                  <span className="flex items-center gap-1 text-gray-500">
                    <Users className="w-4 h-4" />
                    {module.enrolled}
                  </span>
                </div>

                {/* Level & Rating */}
                <div className="flex items-center justify-between">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    module.level === 'Beginner' ? 'bg-green-100 text-green-700' :
                    module.level === 'Intermediate' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-red-100 text-red-700'
                  }`}>
                    {module.level}
                  </span>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                    <span className="text-sm font-medium text-gray-700">{module.rating}</span>
                  </div>
                </div>
              </div>

              {/* Expanded View */}
              {selectedModule === module.id && (
                <div className="border-t border-gray-200 p-6 bg-gray-50 rounded-b-xl">
                  <div className="mb-4">
                    <p className="text-sm font-medium text-gray-700 mb-2">Instructor</p>
                    <p className="text-gray-900 font-medium">{module.instructor}</p>
                  </div>

                  <div className="mb-4">
                    <p className="text-sm font-medium text-gray-700 mb-2">Topics Covered</p>
                    <div className="flex flex-wrap gap-2">
                      {module.topics.map((topic, idx) => (
                        <span key={idx} className="text-xs bg-white border border-gray-200 px-2 py-1 rounded">
                          {topic}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    {module.completed ? (
                      <>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleViewCertificate(module);
                          }}
                          className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-lg font-medium hover:shadow-lg transition"
                        >
                          <Award className="w-5 h-5" />
                          View Certificate
                        </button>
                        <button className="flex items-center justify-center gap-2 px-4 py-3 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition">
                          <PlayCircle className="w-5 h-5" />
                          Review
                        </button>
                      </>
                    ) : module.progress ? (
                      <button className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-medium hover:shadow-lg transition">
                        <PlayCircle className="w-5 h-5" />
                        Continue Learning
                      </button>
                    ) : (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRegister(module.id);
                        }}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-green-600 to-teal-600 text-white rounded-lg font-medium hover:shadow-lg transition"
                      >
                        <ArrowRight className="w-5 h-5" />
                        Register Now
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Learning Path */}
        <div className="mt-12 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl shadow-xl p-8 text-white">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center">
              <TrendingUp className="w-8 h-8" />
            </div>
            <div>
              <h2 className="text-3xl font-bold">Recommended Learning Path</h2>
              <p className="text-indigo-200">Complete courses in order for the best learning experience</p>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white/10 rounded-xl p-6 backdrop-blur-sm">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white font-bold">1</div>
                <h3 className="font-bold">Foundation</h3>
              </div>
              <p className="text-indigo-200 text-sm mb-3">Start with ESG basics and emissions accounting</p>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  <span>ESG Fundamentals</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  <span>Emissions Accounting 101</span>
                </div>
              </div>
            </div>

            <div className="bg-white/10 rounded-xl p-6 backdrop-blur-sm">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">2</div>
                <h3 className="font-bold">Intermediate</h3>
              </div>
              <p className="text-indigo-200 text-sm mb-3">Build on foundations with compliance and data</p>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  <span>Standards Mapping</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="w-4 h-4 text-blue-400" />
                  <span>AI Agent Management</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="w-4 h-4 text-blue-400" />
                  <span>Data Quality</span>
                </div>
              </div>
            </div>

            <div className="bg-white/10 rounded-xl p-6 backdrop-blur-sm">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center text-white font-bold">3</div>
                <h3 className="font-bold">Advanced</h3>
              </div>
              <p className="text-indigo-200 text-sm mb-3">Master ESG leadership and analytics</p>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm opacity-60">
                  <Lock className="w-4 h-4" />
                  <span>Assurance Preparation</span>
                </div>
                <div className="flex items-center gap-2 text-sm opacity-60">
                  <Lock className="w-4 h-4" />
                  <span>ESG Reporting</span>
                </div>
                <div className="flex items-center gap-2 text-sm opacity-60">
                  <Lock className="w-4 h-4" />
                  <span>Advanced Analytics</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Registration Modal */}
      {showRegistration && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowRegistration(false)} />
          <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
            <button
              onClick={() => setShowRegistration(false)}
              className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <GraduationCap className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900">Course Registration</h3>
              <p className="text-gray-600">
                {trainingModules.find(m => m.id === registrationModule)?.title}
              </p>
            </div>

            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input
                  type="text"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none"
                  placeholder="John Doe"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                <input
                  type="email"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none"
                  placeholder="john@company.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Company</label>
                <input
                  type="text"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none"
                  placeholder="Your Company"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Job Title</label>
                <input
                  type="text"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none"
                  placeholder="ESG Manager"
                />
              </div>

              <button
                type="button"
                onClick={() => {
                  setShowRegistration(false);
                  alert('Registration successful! You can now access the course.');
                }}
                className="w-full py-3 bg-gradient-to-r from-green-600 to-teal-600 text-white rounded-lg font-bold hover:shadow-lg transition"
              >
                Complete Registration
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Certificate Modal */}
      {showCertificate && certificateModule && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowCertificate(false)} />
          <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-2xl p-8">
            <button
              onClick={() => setShowCertificate(false)}
              className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Certificate Design */}
            <div className="border-4 border-amber-500 rounded-xl p-8 bg-gradient-to-br from-amber-50 to-orange-50">
              <div className="text-center">
                <div className="flex justify-center mb-4">
                  <Award className="w-16 h-16 text-amber-500" />
                </div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Certificate of Completion</h2>
                <p className="text-gray-600 mb-6">This is to certify that</p>
                <p className="text-2xl font-bold text-indigo-600 mb-4">Demo User</p>
                <p className="text-gray-600 mb-2">has successfully completed the course</p>
                <p className="text-xl font-bold text-gray-900 mb-6">{certificateModule.title}</p>
                <div className="flex justify-center gap-8 mb-6">
                  <div>
                    <p className="text-sm text-gray-500">Duration</p>
                    <p className="font-bold">{certificateModule.duration}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Level</p>
                    <p className="font-bold">{certificateModule.level}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Date</p>
                    <p className="font-bold">{new Date().toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="flex items-center justify-center gap-2 text-amber-600">
                  <span className="text-sm">TIS-IntelliMat ESG Navigator</span>
                </div>
              </div>
            </div>

            <div className="flex gap-4 mt-6">
              <button className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-lg font-medium hover:shadow-lg transition">
                <Download className="w-5 h-5" />
                Download PDF
              </button>
              <button className="flex items-center justify-center gap-2 px-4 py-3 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition">
                Share
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
