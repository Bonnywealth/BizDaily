"use client";
import React from "react";
import { useReportsStore } from "../../stores/useReportsStore";
import { generateMissingBusinessDays } from "../../utils/bizLogic";
import Card from "../ui/Card";

export default function HistoryList({ days = 14 }: { days?: number }) {
  const reports = useReportsStore((s) => s.reports.slice());

  // Determine date range: last `days` days ending yesterday
  const today = new Date();
  today.setHours(0,0,0,0);
  const end = new Date(today);
  end.setDate(end.getDate() - 1);
  const start = new Date(end);
  start.setDate(start.getDate() - (days - 1));

  const iso = (d: Date) => d.toISOString().slice(0,10);
  const startIso = iso(start);
  const endIso = iso(end);

  // Reports that fall within the range
  const inRange = reports.filter((r) => r.date >= startIso && r.date <= endIso);
  const missing = generateMissingBusinessDays(inRange, startIso, endIso);

  // Merge and sort by date ascending
  const merged = [...inRange, ...missing].sort((a,b) => (a.date < b.date ? -1 : 1));

  return (
    <div className="space-y-3">
      {merged.map((r) => (
        <Card key={r.id}>
          <div className="flex justify-between items-start">
            <div>
              <div className="font-medium">{r.date} — {r.day}</div>
              <div className="text-sm text-slate-600">{r.status ?? (r.id.startsWith('virtual') ? 'No Business Report Submitted' : 'Submitted')}</div>
            </div>
            <div className="text-right">
              <div className="font-semibold">Sales: {r.sales === 0 && r.id.startsWith('virtual') ? 'Nil' : `₦${r.sales.toLocaleString()}`}</div>
              <div className="text-sm">Expenses: {r.expenses === 0 && r.id.startsWith('virtual') ? 'Nil' : `₦${r.expenses.toLocaleString()}`}</div>
              <div className="text-sm">Profit: {r.profit === 0 && r.id.startsWith('virtual') ? 'Nil' : `₦${r.profit.toLocaleString()}`}</div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
