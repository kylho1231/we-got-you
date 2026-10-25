import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { BottomNav } from "@/components/layout/BottomNav";
import { EmergencyBanner } from "@/components/layout/EmergencyBanner";
import { AIAssistantChat } from "@/components/assistant/AIAssistantChat";

export const metadata: Metadata = {
  title: "We Got You — Local Repair, Roadside Assistance & Emergency Service Discovery",
  description:
    "The ultimate local-service discovery and booking platform connecting customers with repair technicians, mechanics, appliance specialists, and emergency roadside service providers in San Jose de Buenavista, Antique.",
  manifest: "/manifest.json",
  icons: {
    icon: "/favicon.ico",
  },
};

export const viewport: Viewport = {
  themeColor: "#2563EB",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="min-h-screen bg-slate-50 dark:bg-midnight text-slate-900 dark:text-slate-100 antialiased flex flex-col font-sans selection:bg-brand-500 selection:text-white">
        <EmergencyBanner />
        <Navbar />
        <main className="flex-1">{children}</main>
        <AIAssistantChat />
        <Footer />
        <BottomNav />
      </body>
    </html>
  );
}
