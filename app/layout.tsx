"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useStore } from "@/lib/store";
import BottomNav from "@/components/BottomNav";
import ScoreGauge from "@/components/ScoreGauge";
import { todayLocal, shortWeekday, formatMoney } from "@/lib/date";
import { calculateBusinessScore } from "@/lib/businessScore";
import { getAIInsight } from "@/lib/aiInsight";
import { Bell, Wallet, Receipt, PlusCircle, BarChart3 } from "lucide-react";
import clsx from "clsx";

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
  const score = calculateBusinessScore(businessDays, debtors);
  const insight = getAIInsight(businessDays, debtors);
  const displayName = user?.username || (isDemoMode ? "Explorer" : "there");

  return (
    <>
      <main className="flex-1 px-5 pt-5 pb-24">
        <div className="flex items-center justify-between">
          <div className="font-display font-bold text-ink">BizDaily</div>
          <button className="w-9 h-9 rounded-full bg-card border border-slate-line flex items-center justify-center">
            <Bell size={16} className="text-ink/70" />
          </button>
        </div>

        <div className="mt-5 bg-royal rounded-xl2 px-5 py-5 text-white">
          <p className="text-[12.5px] font-medium text-white/80">👋 Welcome Back</p>
          <p className="font-display text-xl font-bold mt-0.5">{displayName}</p>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-2">
          <StatCard icon={Wallet} color="marigold" label="Sales" value={todayReport ? formatMoney(todayReport.sales) : "Nil"} />
          <StatCard icon={Receipt} color="royal" label="Expenses" value={todayReport ? formatMoney(todayReport.expenses) : "Nil"} />
        </div>

        <div className="mt-5 bg-card rounded-xl2 border border-slate-line/60 p-4 flex items-start gap-4">
          <div className="shrink-0"><ScoreGauge score={score.total} size={60} /></div>
          <div className="flex-1 min-w-0">
            <p className="text-[11.5px] font-semibold text-ink">Insight</p>
            <p className="text-[12.5px] text-ink/75 mt-1 truncate">{insight.message}</p>
          </div>
        </div>

        <h2 className="font-display text-[15px] font-semibold text-ink mt-6 mb-3">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <QuickAction icon={PlusCircle} label="Record Business" onClick={() => router.push("/record")} />
          <QuickAction icon={BarChart3} label="Reports" onClick={() => router.push("/reports")} />
        </div>
      </main>
      <BottomNav />
    </>
  );
}

const badgeStyles = {
  marigold: "bg-marigold-soft text-marigold",
  royal: "bg-royal-soft text-royal",
  emerald: "bg-emerald-soft text-emerald",
  rust: "bg-rust-soft text-rust",
};

function StatCard({ icon: Icon, color, label, value }: { icon: any, color: keyof typeof badgeStyles, label: string, value: string }) {
  return (
    <div className="bg-card rounded-xl2 border border-slate-line/60 p-3.5">
      <div className={clsx("w-8 h-8 rounded-full flex items-center justify-center", badgeStyles[color])}>
        <Icon size={15} />
      </div>
      <p className="text-[11px] font-medium text-slate-muted mt-2">{label}</p>
      <p className="font-mono text-[14px] font-semibold text-ink mt-0.5 truncate">{value}</p>
    </div>
  );
}

function QuickAction({ icon: Icon, label, onClick }: { icon: any, label: string, onClick: () => void }) {
  return (
    <button onClick={onClick} className="bg-card rounded-xl2 border border-slate-line/60 p-4 flex items-center gap-3 text-left">
      <div className="w-9 h-9 rounded-full bg-royal-soft flex items-center justify-center">
        <Icon size={17} className="text-royal" />
      </div>
      <span className="text-[12.5px] font-semibold text-ink">{label}</span>
    </button>
  );
}
