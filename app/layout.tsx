import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import { ToastProvider } from "@/app/components/ui/Toast";

const geist = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  title: {
    default: "Starbucks SNS",
    template: "%s | Starbucks SNS",
  },
  description: "スターバックスのカスタムドリンクをシェアするSNS",
  metadataBase: new URL(siteUrl),
  openGraph: {
    type: "website",
    siteName: "Starbucks SNS",
    title: "Starbucks SNS",
    description: "スターバックスのカスタムドリンクをシェアするSNS",
  },
  twitter: {
    card: "summary_large_image",
    title: "Starbucks SNS",
    description: "スターバックスのカスタムドリンクをシェアするSNS",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja" className={`${geist.variable} h-full antialiased`}>
      <body className="min-h-full">
        <ToastProvider>{children}</ToastProvider>
      </body>
    </html>
  );
}
