import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";

const geist = Geist({ subsets: ["latin"], variable: "--font-geist" });

export const metadata: Metadata = {
  title: "Smartapp — We build focused software.",
  description: "Smartapp is an indie studio that ships SaaS products people actually pay for. Focused, fast, long-term.",
  openGraph: {
    title: "Smartapp",
    description: "An indie studio building SaaS products that earn their place.",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${geist.variable} h-full`} style={{ fontFamily: "var(--font-geist), -apple-system, sans-serif" }}>
      <body className="min-h-full flex flex-col bg-white text-neutral-900">{children}</body>
    </html>
  );
}
