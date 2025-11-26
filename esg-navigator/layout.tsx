import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "ESG Navigator – AI-Powered ESG-GRC Automation",
  description:
    "Enterprise AI-powered ESG-GRC platform for mining, manufacturing, and energy sectors.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
