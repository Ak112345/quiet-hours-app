import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Quiet Hours - AI Content Automation",
  description: "Automatically generate, schedule, and post Instagram content with AI",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
