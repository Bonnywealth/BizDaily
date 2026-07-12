import type { Metadata, Viewport } from "next";
import { Space_Grotesk, Inter, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import ServiceWorkerRegister from "@/components/ServiceWorkerRegister";
import AuthSync from "@/components/AuthSync";

const display = Space_Grotesk({ subsets: ["latin"], weight: ["500", "600", "700"], variable: "--font-display" });
const body = Inter({ subsets: ["latin"], weight: ["400", "500", "600"], variable: "--font-body" });
const mono = IBM_Plex_Mono({ subsets: ["latin"], weight: ["400", "500", "600"], variable: "--font-mono" });

export const metadata: Metadata = {
  title: "BizDaily — How is business today?",
  description: "Track daily sales, expenses and debts.",
  manifest: "/manifest.json",
  appleWebApp: { capable: true, statusBarStyle: "default", title: "BizDaily" },
};

export const viewport: Viewport = {
  themeColor: "#14213D",
  width: "device-width",
  initialScale: 1,
  // maximumScale: 1 removed to stop mobile browser UI fighting
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable} ${mono.variable}`}>
      <body className="font-body bg-paper text-ink">
        <ServiceWorkerRegister />
        <AuthSync />
        {/* Removed min-h-dvh here to let children handle height */}
        <div className="mx-auto max-w-md w-full min-h-dvh flex flex-col bg-paper">
          {children}
        </div>
      </body>
    </html>
  );
}
2. Update app/dashboard/page.tsx
Removed the conflicting min-h calculation and refined the flexbox to prevent overlap.

TypeScript
"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useStore } from "@/lib/store";
import BottomNav from "@/components/BottomNav";
import ScoreGauge from "@/components/ScoreGauge";
import { todayLocal, shortWeekday, formatMoney } from "@/lib/date";
import { calculateBusinessScore } from "@/lib/businessScore";
import { getAIInsight } from "@/lib/aiInsight";
import { Bell, RefreshCcw, Wallet, Receipt, TrendingUp, AlertCircle, Sparkles, PlusCircle, Users, History, BarChart3 } from "lucide-react";
import clsx from "clsx";

// ... (Keep Mark component as is)

export default function DashboardPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const { hasEnteredApp, isDemoMode, isAuthenticated, user, businessDays, debtors, resetDemoData, isDataLoading } = useStore();

  useEffect(() => {
    setMounted(true);
    if (!hasEnteredApp || (!isDemoMode && !isAuthenticated)) router.replace("/");
  }, [hasEnteredApp, isDemoMode, isAuthenticated, router]);

  if (!mounted || isDataLoading) return null;

  const today = todayLocal();
  const todayReport = businessDays.find((d) => d.date === today);
  const outstandingDebt = debtors.filter((d) => d.status === "outstanding").reduce((s, d) => s + d.amount, 0);
  const score = calculateBusinessScore(businessDays, debtors);
  const insight = getAIInsight(businessDays, debtors);
  const displayName = user?.username || (isDemoMode ? "Explorer" : "there");

  return (
    <>
      {/* Removed conflicting min-h calculation, kept pb-24 for nav space */}
      <main className="flex-1 px-5 pt-5 pb-24">
        {/* Top bar */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="font-display font-bold text-ink">BizDaily</div>
          </div>
          <button className="w-9 h-9 rounded-full bg-card border border-slate-line flex items-center justify-center">
            <Bell size={16} className="text-ink/70" />
          </button>
        </div>

        {/* Welcome banner */}
        <div className="mt-5 bg-royal rounded-xl2 px-5 py-5 text-white">
          <p className="text-[12.5px] font-medium text-white/80">👋 Welcome Back</p>
          <p className="font-display text-xl font-bold mt-0.5">{displayName}</p>
        </div>

        {/* Stat Cards */}
        <div className="mt-5 grid grid-cols-2 gap-2">
          <StatCard icon={Wallet} color="marigold" label="Sales" value={todayReport ? formatMoney(todayReport.sales) : "Nil"} />
          <StatCard icon={Receipt} color="royal" label="Expenses" value={todayReport ? formatMoney(todayReport.expenses) : "Nil"} />
        </div>

        {/* Score + Insight */}
        <div className="mt-5 bg-card rounded-xl2 border border-slate-line/60 p-4 flex items-start gap-4">
          <div className="shrink-0"><ScoreGauge score={score.total} size={60} /></div>
          <div className="flex-1 min-w-0">
            <p className="text-[11.5px] font-semibold text-ink">Insight</p>
            <p className="text-[12.5px] text-ink/75 mt-1 truncate">{insight.message}</p>
          </div>
        </div>

        {/* Quick actions */}
        <h2 className="font-display text-[15px] font-semibold text-ink mt-6 mb-3">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <QuickAction icon={PlusCircle} label="Record Today's Business" onClick={() => router.push("/record")} />
          <QuickAction icon={BarChart3} label="Generate Reports" onClick={() => router.push("/reports")} />
        </div>
      </main>
      <BottomNav />
    </>
  );
}

// ... (Keep your existing StatCard and QuickAction components at the bottom)
