import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "NextMedi • Medical Audio Analyzer",
  description:
    "A Gemini AI-powered interface for transforming clinical audio into actionable insights.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html className="dark" lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
