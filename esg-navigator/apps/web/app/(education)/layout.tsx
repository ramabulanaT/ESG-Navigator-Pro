import Link from 'next/link';

export default function EducationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-white">
      {/* Education Division Header */}
      <header className="bg-gradient-to-r from-blue-600 to-indigo-600 border-b border-blue-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <Link href="/" className="text-2xl font-bold text-white">
                ESG Navigator
              </Link>
              <span className="px-3 py-1 bg-white/20 text-white text-sm font-semibold rounded-full">
                Education
              </span>
            </div>
            <nav className="flex space-x-6">
              <Link href="/education/assessments" className="text-white hover:text-blue-100">
                Assessments
              </Link>
              <Link href="/education/training" className="text-white hover:text-blue-100">
                Training
              </Link>
              <Link href="/enterprise/dashboard" className="text-blue-100 hover:text-white">
                Enterprise →
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>

      {/* Education Division Footer */}
      <footer className="bg-gray-50 border-t border-gray-200 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-gray-600 text-sm">
            <p className="mb-2">🎓 ESG Navigator Education Division</p>
            <p>Learn, Assess, and Implement ESG Best Practices</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
