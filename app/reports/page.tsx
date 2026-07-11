"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useStore } from "@/lib/store";
import BottomNav from "@/components/BottomNav";
import { daysAgo, dateLabel, formatMoney } from "@/lib/date";
import { buildScoreHistory } from "@/lib/scoreHistory";
import { exportToPdf } from "@/lib/exportPdf";
import { exportToExcel } from "@/lib/exportExcel";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import { FileDown, FileSpreadsheet } from "lucide-react";
import clsx from "clsx";

export default function ReportsPage() {
  const router = useRouter();
  const { hasEnteredApp, businessDays, debtors } = useStore();
  const [mounted, setMounted] = useState(false);
  const [range, setRange] = useState<"weekly" | "monthly">("weekly");

  useEffect(() => {
    setMounted(true);
    if (!hasEnteredApp) router.replace("/");
  }, [hasEnteredApp, router]);

  const dates = useMemo(() => {
    const span = range === "weekly" ? 7 : 30;
    const arr = [];
    for (let i = span - 1; i >= 0; i--) arr.push(daysAgo(i));
    return arr;
  }, [range]);

  const chartData = useMemo(() => {
    const map = new Map(businessDays.map((d) => [d.date, d]));
    const scoreHistory = buildScoreHistory(dates, businessDays, debtors);
    const scoreMap = new Map(scoreHistory.map((s) => [s.date, s.score]));
    return dates.map((date) => {
      const r = map.get(date);
      return {
        date,
        label: dateLabel(date).split(",")[0].slice(0, 6),
        sales: r ? r.sales : null,
        expenses: r ? r.expenses : null,
        profit: r ? r.profit : null,
        score: scoreMap.get(date) ?? null,
      };
    });
  }, [dates, businessDays, debtors]);

  const rangeDays = useMemo(
    () => businessDays.filter((d) => dates.includes(d.date)),
    [businessDays, dates]
  );

  if (!mounted) return null;

  const label = range === "weekly" ? "Weekly" : "Monthly";

  return (
    <>
      <main className="flex-1 px-5 pt-6 pb-6">
        <h1 className="font-display text-xl font-semibold text-ink">Reports</h1>

        <div className="mt-4 flex gap-2 bg-paper border border-slate-line rounded-full p-1 w-fit">
          <TabButton active={range === "weekly"} onClick={() => setRange("weekly")}>
            Weekly
          </TabButton>
          <TabButton active={range === "monthly"} onClick={() => setRange("monthly")}>
            Monthly
          </TabButton>
        </div>

        <ChartCard title="Sales Trend" data={chartData} dataKey="sales" color="#E8A33D" />
        <ChartCard title="Expense Trend" data={chartData} dataKey="expenses" color="#D65F4C" />
        <ChartCard title="Profit Trend" data={chartData} dataKey="profit" color="#1F9D6B" />
        <ChartCard title="Business Score Trend" data={chartData} dataKey="score" color="#14213D" domain={[0, 100]} />

        <div className="mt-5 grid grid-cols-2 gap-3">
          <button
            onClick={() => exportToPdf(rangeDays, debtors, label)}
            className="flex items-center justify-center gap-2 bg-card border border-slate-line rounded-xl2 py-3 text-[13.5px] font-semibold text-ink active:scale-[0.98] transition-transform"
          >
            <FileDown size={16} /> Export PDF
          </button>
          <button
            onClick={() => exportToExcel(rangeDays, debtors, label)}
            className="flex items-center justify-center gap-2 bg-card border border-slate-line rounded-xl2 py-3 text-[13.5px] font-semibold text-ink active:scale-[0.98] transition-transform"
          >
            <FileSpreadsheet size={16} /> Export Excel
          </button>
        </div>
      </main>
      <BottomNav />
    </>
  );
}

function ChartCard({
  title,
  data,
  dataKey,
  color,
  domain,
}: {
  title: string;
  data: any[];
  dataKey: string;
  color: string;
  domain?: [number, number];
}) {
  return (
    <div className="mt-4 bg-card border border-slate-line/60 rounded-xl2 p-4">
      <h2 className="text-[13px] font-semibold text-ink">{title}</h2>
      <div className="h-[140px] mt-2 -ml-2">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E7E4DF" vertical={false} />
            <XAxis
              dataKey="label"
              tick={{ fontSize: 10, fill: "#6B7280" }}
              axisLine={false}
              tickLine={false}
              interval="preserveStartEnd"
            />
            <YAxis
              tick={{ fontSize: 10, fill: "#6B7280" }}
              axisLine={false}
              tickLine={false}
              width={36}
              domain={domain}
            />
            <Tooltip
              formatter={(v: any) => (v === null ? "No report" : v)}
              contentStyle={{ fontSize: 12, borderRadius: 10, borderColor: "#E7E4DF" }}
            />
            <Line
              type="monotone"
              dataKey={dataKey}
              stroke={color}
              strokeWidth={2.4}
              dot={false}
              connectNulls={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
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
