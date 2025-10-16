import "../styles/globals.css";
import type { ReactNode } from "react";
export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en"><body><main className="container-narrow py-8">{children}</main></body></html>
  );
}