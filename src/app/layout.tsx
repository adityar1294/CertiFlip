import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CertiFlip — Financial Certification Prep",
  description: "Crack your NISM certification on the first try. Practice exams, spaced repetition flashcards, and step-by-step solutions.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full">{children}</body>
    </html>
  );
}
