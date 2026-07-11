"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useStore } from "@/lib/store";
import { supabase } from "@/lib/supabaseClient";
import BottomNav from "@/components/BottomNav";
import { RefreshCcw, LogOut, Info } from "lucide-react";

export default function SettingsPage() {
  const router = useRouter();
  const { hasEnteredApp, isDemoMode, isAuthenticated, user, resetDemoData } = useStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (!hasEnteredApp) router.replace("/");
  }, [hasEnteredApp, router]);

  if (!mounted) return null;

  const handleLogOut = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  const handleExitDemo = () => {
    useStore.setState({ hasEnteredApp: false, isDemoMode: false, businessDays: [], debtors: [] });
    router.push("/");
  };

  return (
    <>
      <main className="flex-1 px-5 pt-6 pb-6">
        <h1 className="font-display text-xl font-semibold text-ink">Settings</h1>

        {isAuthenticated && user && (
          <div className="mt-5 bg-card border border-slate-line/60 rounded-xl2 px-4 py-3.5">
            <p className="text-[11px] font-medium text-slate-muted">Signed in as</p>
            <p className="text-[14.5px] font-semibold text-ink mt-0.5">{user.username}</p>
            <p className="text-[12px] text-slate-muted mt-0.5">{user.email}</p>
          </div>
        )}

        <div className="mt-5 flex flex-col gap-2.5">
          {isDemoMode && (
            <SettingRow
              icon={RefreshCcw}
              label="Reset demo data"
              description="Restore the original demo sales, expenses and debts"
              onClick={resetDemoData}
            />
          )}
          {isDemoMode && (
            <SettingRow
              icon={LogOut}
              label="Exit demo"
              description="Return to the landing page"
              onClick={handleExitDemo}
            />
          )}
          {isAuthenticated && (
            <SettingRow
              icon={LogOut}
              label="Log out"
              description="Your records stay safely backed up in your account"
              onClick={handleLogOut}
            />
          )}
        </div>

        <div className="mt-6 flex items-start gap-2.5 text-[12px] text-slate-muted">
          <Info size={15} className="mt-0.5 shrink-0" />
          <p>
            Your account and business records are backed up securely with Supabase — safe even
            if you switch devices or clear this browser.{" "}
            <a href="/privacy" className="underline">
              Privacy Policy
            </a>{" "}
            ·{" "}
            <a href="/terms" className="underline">
              Terms
            </a>
          </p>
        </div>
      </main>
      <BottomNav />
    </>
  );
}

function SettingRow({
  icon: Icon,
  label,
  description,
  onClick,
  danger,
}: {
  icon: typeof RefreshCcw;
  label: string;
  description: string;
  onClick: () => void;
  danger?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-3 bg-card border border-slate-line/60 rounded-xl2 px-4 py-3.5 text-left active:scale-[0.99] transition-transform"
    >
      <div
        className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${
          danger ? "bg-rust-soft text-rust" : "bg-paper text-ink"
        }`}
      >
        <Icon size={16} />
      </div>
      <div>
        <p className={`text-[14px] font-semibold ${danger ? "text-rust" : "text-ink"}`}>{label}</p>
        <p className="text-[12px] text-slate-muted mt-0.5">{description}</p>
      </div>
    </button>
  );
}
