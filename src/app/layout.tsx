import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { AuthProvider } from "@/providers/AuthProvider";

import { Toaster } from "react-hot-toast";

import "./globals.css";
import { Suspense } from "react";

const geistSans = Geist({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Bill Reminder - Never Miss a Bill Payment Again",
  description:
    "Smart bill reminders and payment tracking for individuals and businesses worldwide",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthProvider>
          <Suspense fallback={null}>
            {children}
            <Toaster position="top-right" reverseOrder={false} />
          </Suspense>
        </AuthProvider>
      </body>
    </html>
  );
}
