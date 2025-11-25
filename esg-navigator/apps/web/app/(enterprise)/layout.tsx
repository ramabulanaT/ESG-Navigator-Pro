import Link from 'next/link';

export default function EnterpriseLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black">
      {/* Enterprise Division Header */}
      <header className="bg-gray-900/50 backdrop-blur-sm border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <Link href="/" className="text-2xl font-bold text-white">
                ESG Navigator
              </Link>
              <span className="px-3 py-1 bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-sm font-semibold rounded-full">
                Enterprise
              </span>
              <span className="px-2 py-0.5 bg-gray-800 text-gray-400 text-xs rounded">
                TIS-Intellimat
              </span>
            </div>
            <nav className="flex space-x-6">
              <Link href="/enterprise/dashboard" className="text-gray-300 hover:text-white">
                Dashboard
              </Link>
              <Link href="/enterprise/suppliers" className="text-gray-300 hover:text-white">
                Suppliers
              </Link>
              <Link href="/enterprise/clients" className="text-gray-300 hover:text-white">
                Clients
              </Link>
              <Link href="/enterprise/sales" className="text-gray-300 hover:text-white">
                Sales
              </Link>
              <Link href="/enterprise/analytics" className="text-gray-300 hover:text-white">
                Analytics
              </Link>
              <Link href="/enterprise/ai-insights" className="text-gray-300 hover:text-white">
                AI Insights
              </Link>
              <Link href="/education/assessments" className="text-indigo-400 hover:text-indigo-300">
                Education →
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main>
        {children}
      </main>

      {/* Enterprise Division Footer */}
      <footer className="bg-gray-900/80 backdrop-blur-sm border-t border-gray-800 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div>
              <h4 className="text-white font-semibold mb-3">Enterprise Intelligence</h4>
              <p className="text-gray-400 text-sm">
                AI-powered ESG automation, supplier risk management, and business intelligence.
              </p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-3">IBM Integrations</h4>
              <p className="text-gray-400 text-sm">
                Powered by WatsonX Orchestrate and Envizi ESG Suite for enterprise-grade capabilities.
              </p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-3">TIS-Intellimat</h4>
              <p className="text-gray-400 text-sm">
                Comprehensive business management platform with CRM, sales, and analytics.
              </p>
            </div>
          </div>
          <div className="text-center text-gray-500 text-sm border-t border-gray-800 pt-6">
            <p>🏢 ESG Navigator Enterprise Division • Powered by TIS-Intellimat & IBM</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
