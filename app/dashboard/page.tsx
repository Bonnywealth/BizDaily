"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useStore } from "@/lib/store";
import BottomNav from "@/components/BottomNav";
import ScoreGauge from "@/components/ScoreGauge";
import { todayLocal, shortWeekday, formatMoney } from "@/lib/date";
import { calculateBusinessScore } from "@/lib/businessScore";
import { getAIInsight } from "@/lib/aiInsight";
import {
  Bell,
  RefreshCcw,
  Wallet,
  Receipt,
  TrendingUp,
  AlertCircle,
  Sparkles,
  PlusCircle,
  Users,
  History,
  BarChart3,
} from "lucide-react";
import clsx from "clsx";

function Mark() {
  return (
    <svg width="30" height="30" viewBox="0 0 34 34" fill="none">
      <circle cx="17" cy="17" r="14.5" fill="#14213D" />
      <path
        d="M5.2 10.8A14.48 14.48 0 0 1 17 2.5c4.6 0 8.7 2.2 11.2 5.7"
        stroke="#1F9D6B"
        strokeWidth="2.4"
        strokeLinecap="round"
      />
      <text x="17" y="22" textAnchor="middle" fontSize="15" fontWeight="700" fill="white">
        B
      </text>
    </svg>
  );
}

export default function DashboardPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const { hasEnteredApp, isDemoMode, isAuthenticated, user, businessDays, debtors, resetDemoData, isDataLoading } =
    useStore();

  useEffect(() => {
    setMounted(true);
    if (!hasEnteredApp || (!isDemoMode && !isAuthenticated)) router.replace("/");
  }, [hasEnteredApp, isDemoMode, isAuthenticated, router]);

  if (!mounted) return null;

  if (isDataLoading) {
    return (
      <main className="flex-1 flex items-center justify-center">
        <p className="text-[13px] text-slate-muted font-medium">Loading your business records…</p>
      </main>
    );
  }

  const today = todayLocal();
  const todayReport = businessDays.find((d) => d.date === today);
  const outstandingDebt = debtors
    .filter((d) => d.status === "outstanding")
    .reduce((s, d) => s + d.amount, 0);
  const score = calculateBusinessScore(businessDays, debtors);
  const insight = getAIInsight(businessDays, debtors);
  const displayName = user?.username || (isDemoMode ? "Explorer" : "there");

  return (
    <>
      <main className="flex-1 px-5 pt-5 pb-6">
        {/* Top bar */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Mark />
            <div>
              <p className="font-display text-[15px] font-bold text-ink leading-none">BizDaily</p>
              <p className="text-[10.5px] text-slate-muted mt-0.5">Track your growth</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {isDemoMode && (
              <button
                onClick={resetDemoData}
                className="shrink-0 flex items-center gap-1 text-[11px] font-semibold text-slate-muted border border-slate-line rounded-full px-2.5 py-1.5"
              >
                <RefreshCcw size={12} /> Reset
              </button>
            )}
            <button className="w-9 h-9 rounded-full bg-card border border-slate-line flex items-center justify-center">
              <Bell size={16} className="text-ink/70" />
            </button>
          </div>
        </div>

        {/* Welcome banner */}
        <div className="mt-5 bg-royal rounded-xl2 px-5 py-5 text-white">
          <p className="text-[12.5px] font-medium text-white/80">👋 Welcome Back</p>
          <p className="font-display text-xl font-bold mt-0.5">{displayName}</p>
          <p className="text-[13px] text-white/75 mt-1">Let's review your business.</p>
        </div>

        {/* Latest report */}
        <div className="mt-5 flex items-center justify-between">
          <div>
            <h2 className="font-display text-[15px] font-semibold text-ink">Latest Business Report</h2>
            <p className="text-[12px] text-slate-muted mt-0.5">{shortWeekday(today)} Report</p>
          </div>
          <span
            className={clsx(
              "text-[11px] font-semibold px-2.5 py-1 rounded-full",
              todayReport ? "bg-emerald-soft text-emerald" : "bg-rust-soft text-rust"
            )}
          >
            {todayReport ? "Submitted" : "Not submitted"}
          </span>
        </div>

        <div className="mt-3 grid grid-cols-2 gap-3">
          <StatCard
            icon={Wallet}
            color="marigold"
            label="Sales"
            value={todayReport ? formatMoney(todayReport.sales) : "Nil"}
          />
          <StatCard
            icon={Receipt}
            color="royal"
            label="Expenses"
            value={todayReport ? formatMoney(todayReport.expenses) : "Nil"}
          />
          <StatCard
            icon={TrendingUp}
            color="emerald"
            label="Profit"
            value={todayReport ? formatMoney(todayReport.profit) : "Nil"}
          />
          <StatCard
            icon={AlertCircle}
            color="rust"
            label="Outstanding Debt"
            value={formatMoney(outstandingDebt)}
          />
        </div>

        {/* Score + Insight, side by side */}
        <div className="mt-5 bg-card rounded-xl2 shadow-card border border-slate-line/60 p-4 flex items-center gap-4">
          <ScoreGauge score={score.total} size={104} />
          <div className="flex-1 min-w-0">
            <p className="text-[11.5px] font-semibold text-ink flex items-center gap-1">
              <Sparkles size={13} className="text-marigold" /> BizDaily Insight
            </p>
            <p className="text-[12.5px] text-ink/75 mt-1.5 leading-snug">{insight.message}</p>
          </div>
        </div>

        {/* Quick actions */}
        <h2 className="font-display text-[15px] font-semibold text-ink mt-6 mb-3">Quick Actions</h2>
        <div className="grid grid-cols-2 gap-3">
          <QuickAction
            icon={PlusCircle}
            label="Record Today's Business"
            onClick={() => router.push("/record")}
          />
          <QuickAction icon={Users} label="Debt Management" onClick={() => router.push("/debts")} />
          <QuickAction icon={History} label="Business History" onClick={() => router.push("/history")} />
          <QuickAction icon={BarChart3} label="Generate Reports" onClick={() => router.push("/reports")} />
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

function StatCard({
  icon: Icon,
  color,
  label,
  value,
}: {
  icon: typeof Wallet;
  color: keyof typeof badgeStyles;
  label: string;
  value: string;
}) {
  return (
    <div className="bg-card rounded-xl2 border border-slate-line/60 p-3.5">
      <div className={clsx("w-8 h-8 rounded-full flex items-center justify-center", badgeStyles[color])}>
        <Icon size={15} strokeWidth={2.2} />
      </div>
      <p className="text-[11px] font-medium text-slate-muted mt-2">{label}</p>
      <p className="font-mono text-[14px] font-semibold text-ink tabular-nums mt-0.5">{value}</p>
    </div>
  );
}

function QuickAction({
  icon: Icon,
  label,
  onClick,
}: {
  icon: typeof Users;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="bg-card rounded-xl2 border border-slate-line/60 p-4 flex flex-col items-start gap-2.5 text-left active:scale-[0.98] transition-transform"
    >
      <div className="w-9 h-9 rounded-full bg-royal-soft flex items-center justify-center">
        <Icon size={17} className="text-royal" strokeWidth={2.1} />
      </div>
      <span className="text-[12.5px] font-semibold text-ink leading-snug">{label}</span>
    </button>
  );
}
