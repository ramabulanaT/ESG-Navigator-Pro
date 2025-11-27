"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { BarChart3, BookOpen, Home, Menu, X, ClipboardCheck, Sparkles, Bot, Calendar } from "lucide-react";
import { useState } from "react";
import ConsultationModal from "../ConsultationModal";

export default function Navigation() {
  const [open, setOpen] = useState(false);
  const [showConsultation, setShowConsultation] = useState(false);
  const pathname = usePathname();
  const items = [
    { href: "/", label: "Home", icon: Home },
    { href: "/dashboard", label: "Dashboard", icon: BarChart3 },
    { href: "/training", label: "Training", icon: BookOpen },
    { href: "/assessments", label: "Assessments", icon: ClipboardCheck },
    { href: "/agents", label: "AI Agents", icon: Bot },
    { href: "/ai-insights", label: "Analytics", icon: Sparkles },
  ];
  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">EN</span>
            </div>
            <span className="font-bold text-xl">ESG Navigator</span>
          </Link>
          <div className="hidden md:flex items-center space-x-1">
            {items.map(({ href, label, icon: Icon }) => {
              const active = pathname === href;
              return (
                <Link
                  key={href}
                  href={href}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                    active ? "bg-primary-100 text-primary-700" : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  <Icon size={18} /><span>{label}</span>
                </Link>
              );
            })}
          </div>
          <button
              onClick={() => setShowConsultation(true)}
              className="hidden md:flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-lg hover:shadow-lg transition-all"
            >
              <Calendar size={18} />
              <span>Schedule Consultation</span>
            </button>
          <button className="md:hidden p-2" onClick={() => setOpen(!open)}>{open ? <X size={24} /> : <Menu size={24} />}</button>
        </div>
        {open && (
          <div className="md:hidden pb-4">
            {items.map(({ href, label, icon: Icon }) => {
              const active = pathname === href;
              return (
                <Link
                  key={href}
                  href={href}
                  className={`flex items-center space-x-2 px-4 py-3 rounded-lg transition-colors ${
                    active ? "bg-primary-100 text-primary-700" : "text-gray-600 hover:bg-gray-100"
                  }`}
                  onClick={() => setOpen(false)}
                >
                  <Icon size={18} /><span>{label}</span>
                </Link>
              );
            })}
          </div>
        )}
      </div>
      <ConsultationModal isOpen={showConsultation} onClose={() => setShowConsultation(false)} />
    </nav>
  );
}
