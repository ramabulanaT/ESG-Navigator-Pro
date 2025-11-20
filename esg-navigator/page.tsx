import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "ESG Navigator – TIS Holdings",
  description:
    "Enterprise AI-powered ESG-GRC platform by TIS Holdings – Anthropic Claude, AWS, IBM, DRATA.",
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
