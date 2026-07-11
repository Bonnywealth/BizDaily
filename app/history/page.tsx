"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useStore } from "@/lib/store";
import BottomNav from "@/components/BottomNav";
import { daysAgo, dateLabel, formatMoney, todayLocal } from "@/lib/date";
import clsx from "clsx";

export default function HistoryPage() {
  const router = useRouter();
  const { hasEnteredApp, businessDays } = useStore();
  const [mounted, setMounted] = useState(false);
  const [range, setRange] = useState<"weekly" | "monthly">("weekly");

  useEffect(() => {
    setMounted(true);
    if (!hasEnteredApp) router.replace("/");
  }, [hasEnteredApp, router]);

  const rows = useMemo(() => {
    const span = range === "weekly" ? 7 : 30;
    const today = todayLocal();
    const map = new Map(businessDays.map((d) => [d.date, d]));
    const out = [];
    for (let i = 0; i < span; i++) {
      const date = daysAgo(i);
      out.push({ date, report: map.get(date) ?? null, isToday: date === today });
    }
    return out;
  }, [businessDays, range]);

  if (!mounted) return null;

  return (
    <>
      <main className="flex-1 px-5 pt-6 pb-6">
        <h1 className="font-display text-xl font-semibold text-ink">Business History</h1>

        <div className="mt-4 flex gap-2 bg-paper border border-slate-line rounded-full p-1 w-fit">
          <TabButton active={range === "weekly"} onClick={() => setRange("weekly")}>
            Weekly
          </TabButton>
          <TabButton active={range === "monthly"} onClick={() => setRange("monthly")}>
            Monthly
          </TabButton>
        </div>

        <div className="mt-4 flex flex-col gap-2">
          {rows.map(({ date, report, isToday }) => (
            <div
              key={date}
              className="bg-card border border-slate-line/60 rounded-xl2 px-4 py-3 flex items-center justify-between"
            >
              <div>
                <p className="text-[13.5px] font-semibold text-ink">
                  {dateLabel(date)} {isToday && <span className="text-emerald">· Today</span>}
                </p>
                {report ? (
                  <p className="text-[12px] font-mono text-slate-muted mt-0.5">
                    Sales {formatMoney(report.sales)} · Profit{" "}
                    <span className={report.profit >= 0 ? "text-emerald" : "text-rust"}>
                      {formatMoney(report.profit)}
                    </span>
                  </p>
                ) : (
                  <p className="text-[12px] text-rust font-medium mt-0.5">
                    No Business Report Submitted
                  </p>
                )}
              </div>
              {!report && (
                <span className="text-[10.5px] font-semibold text-slate-muted bg-paper border border-slate-line px-2 py-1 rounded-full shrink-0">
                  Nil
                </span>
              )}
            </div>
          ))}
        </div>
      </main>
      <BottomNav />
    </>
  );
}

function TabButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={clsx(
        "px-4 py-1.5 rounded-full text-[13px] font-semibold transition-colors",
        active ? "bg-ink text-white" : "text-slate-muted"
      )}
    >
      {children}
    </button>
  );
}
