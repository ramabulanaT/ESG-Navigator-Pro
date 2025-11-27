import './globals.css';
import Navigation from '@/components/layout/Navigation';

export const metadata = {
  title: 'ESG Navigator - TIS-IntelliMat',
  description: 'Real-time compliance, energy intelligence, and sustainability monitoring unified.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-50">
        <Navigation />
        {children}
      </body>
    </html>
  );
}
