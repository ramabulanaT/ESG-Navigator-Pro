"use client";
import { useState } from "react";
import { BookOpen, CheckCircle, Clock, PlayCircle } from "lucide-react";

export default function TrainingPage() {
  const [selectedModule, setSelectedModule] = useState<string | null>(null);
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">ESG Training Center</h1>
          <p className="text-gray-600">Learn best practices and maximize platform value</p>
        </div>
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <ProgressCard title="Courses Completed" value="3/9" percentage={33} icon={CheckCircle} color="success" />
          <ProgressCard title="In Progress" value="2" icon={PlayCircle} color="primary" />
          <ProgressCard title="Total Hours" value="12.5" icon={Clock} color="warning" />
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {trainingModules.map((m) => (
            <ModuleCard key={m.id} module={m} onSelect={() => setSelectedModule(m.id)} />
          ))}
        </div>
      </div>
    </div>
  );
}

function ProgressCard({ title, value, percentage, icon: Icon, color }: any) {
  const colorClasses: any = {
    success: "bg-success-100 text-success-600",
    primary: "bg-primary-100 text-primary-600",
    warning: "bg-warning-100 text-warning-600",
  };
  return (
    <div className="card">
      <div className="flex items-center justify-between mb-2">
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${colorClasses[color]}`}>
          <Icon size={20} />
        </div>
        <span className="text-2xl font-bold">{value}</span>
      </div>
      <p className="text-gray-600">{title}</p>
      {percentage !== undefined && (
        <div className="mt-2 bg-gray-200 rounded-full h-2">
          <div
            className={`h-2 rounded-full ${color === "success" ? "bg-success-500" : "bg-primary-500"}`}
            style={{ width: `${percentage}%` }}
          />
        </div>
      )}
    </div>
  );
}

function ModuleCard({ module, onSelect }: any) {
  return (
    <div className="card cursor-pointer hover:shadow-lg transition-shadow" onClick={onSelect}>
      <div className="flex items-start justify-between mb-4">
        <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${module.completed ? "bg-success-100" : "bg-gray-100"}`}>
          <BookOpen size={24} className={module.completed ? "text-success-600" : "text-gray-400"} />
        </div>
        {module.completed && (<CheckCircle className="text-success-500" size={20} />)}
      </div>
      <h3 className="text-lg font-semibold mb-2">{module.title}</h3>
      <p className="text-gray-600 text-sm mb-4">{module.description}</p>
      <div className="flex items-center justify-between text-sm">
        <span className="text-gray-500">{module.duration}</span>
        <span
          className={`px-2 py-1 rounded text-xs ${
            module.level === "Beginner" ? "bg-green-100 text-green-700"
              : module.level === "Intermediate" ? "bg-yellow-100 text-yellow-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {module.level}
        </span>
      </div>
    </div>
  );
}

const trainingModules = [
  { id: "esg-basics", title: "ESG Fundamentals", description: "Introduction to ESG principles and frameworks", duration: "2 hours", level: "Beginner", completed: true },
  { id: "emissions-101", title: "Emissions Accounting 101", description: "Learn Scope 1, 2, and 3 emissions tracking", duration: "3 hours", level: "Beginner", completed: true },
  { id: "standards-mapping", title: "Standards Mapping", description: "Master IFRS S1/S2, GRI, and SASB compliance", duration: "4 hours", level: "Intermediate", completed: true },
  { id: "agent-management", title: "Agent Management", description: "Configure and optimize AI agents", duration: "2.5 hours", level: "Intermediate", completed: false },
  { id: "data-quality", title: "Data Quality & Governance", description: "Ensure data accuracy and compliance", duration: "3 hours", level: "Intermediate", completed: false },
  { id: "assurance-prep", title: "Assurance Preparation", description: "Prepare for external audits and verification", duration: "2 hours", level: "Advanced", completed: false },
  { id: "reporting", title: "ESG Reporting", description: "Create comprehensive ESG reports", duration: "3.5 hours", level: "Advanced", completed: false },
  { id: "risk-management", title: "ESG Risk Management", description: "Identify and mitigate ESG risks", duration: "3 hours", level: "Advanced", completed: false },
  { id: "advanced-analytics", title: "Advanced Analytics", description: "Deep dive into ESG data analysis", duration: "4 hours", level: "Advanced", completed: false }
];
