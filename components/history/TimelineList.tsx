"use client";
import React, { useState, useMemo } from "react";
import { useReportsStore } from "../../stores/useReportsStore";
import { generateMissingBusinessDays } from "../../utils/bizLogic";
import Card from "../ui/Card";

export default function TimelineList() {
  const reports = useReportsStore((s) => s.reports);
  const [filter, setFilter] = useState<"weekly" | "monthly">("weekly");

  const todayIso = new Date().toISOString().slice(0, 10);
  const startIso = filter === "weekly" ? (() => { const d = new Date(); d.setDate(d.getDate() - 6); const tzoffset = d.getTimezoneOffset() * 60000; const local = new Date(d.getTime() - tzoffset); return local.toISOString().slice(0,10); })() : (() => { const d = new Date(); d.setDate(1); const tzoffset = d.getTimezoneOffset() * 60000; const local = new Date(d.getTime() - tzoffset); return local.toISOString().slice(0,10); })();

  // Submitted reports in range
  const submitted = useMemo(() => reports.filter((r) => r.date >= startIso && r.date <= todayIso && r.status === "Submitted"), [reports, startIso, todayIso]);
  const missing = useMemo(() => generateMissingBusinessDays(reports, startIso, todayIso), [reports, startIso, todayIso]);

  // Combine submitted and missing into a timeline sorted by date desc
  const timeline = useMemo(() => {
    const combined = [...submitted, ...missing];
    combined.sort((a,b) => (a.date < b.date ? 1 : -1));
    return combined;
  }, [submitted, missing]);

  return (
    <div>
      <div className="flex gap-2 mb-3">
        <button className={`px-3 py-1 rounded ${filter === "weekly" ? "bg-indigo-600 text-white" : "bg-white border"}`} onClick={() => setFilter("weekly")}>Weekly</button>
        <button className={`px-3 py-1 rounded ${filter === "monthly" ? "bg-indigo-600 text-white" : "bg-white border"}`} onClick={() => setFilter("monthly")}>Monthly</button>
      </div>

      {timeline.length === 0 ? (
        <Card>
          <div className="text-sm text-slate-600">No business reports available yet.</div>
        </Card>
      ) : (
        <div className="space-y-3">
          {timeline.map((t) => (
            <Card key={t.id}>
              <div className="flex justify-between">
                <div>
                  <div className="font-medium">{t.day} — {t.date}</div>
                  <div className="text-sm">Status: {t.status}</div>
                </div>
                <div className="text-right">
                  <div className="text-sm">Sales: {t.status === "No Business Report Submitted" ? "Nil" : `₦${t.sales.toLocaleString()}`}</div>
                  <div className="text-sm">Expenses: {t.status === "No Business Report Submitted" ? "Nil" : `₦${t.expenses.toLocaleString()}`}</div>
                  <div className="text-sm">Profit: {t.status === "No Business Report Submitted" ? "Nil" : `₦${t.profit.toLocaleString()}`}</div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
