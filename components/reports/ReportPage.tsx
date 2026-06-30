"use client";
import React, { useMemo } from "react";
import Card from "../ui/Card";
import dynamic from "next/dynamic";
import { useReportsStore } from "../../stores/useReportsStore";
import { useDebtsStore } from "../../stores/useDebtsStore";
import { exportReportToPDF, exportReportToXLSX } from "../../utils/export";

const SalesLineChart = dynamic(() => import("./charts/SalesLineChart"), { ssr: false });

export default function ReportPage() {
  const reports = useReportsStore((s) => s.reports);
  const debts = useDebtsStore((s) => s.debts);

  // prepare weekly and monthly summaries
  const todayIso = new Date().toISOString().slice(0,10);
  const weekStart = (() => { const d = new Date(); d.setDate(d.getDate() - 6); const tzoffset = d.getTimezoneOffset() * 60000; const local = new Date(d.getTime() - tzoffset); return local.toISOString().slice(0,10); })();
  const monthStart = (() => { const d = new Date(); d.setDate(1); const tzoffset = d.getTimezoneOffset() * 60000; const local = new Date(d.getTime() - tzoffset); return local.toISOString().slice(0,10); })();

  const weekly = useMemo(() => reports.filter((r) => r.date >= weekStart && r.date <= todayIso), [reports, weekStart, todayIso]);
  const monthly = useMemo(() => reports.filter((r) => r.date >= monthStart && r.date <= todayIso), [reports, monthStart, todayIso]);

  const weeklyTotals = useMemo(() => ({
    sales: weekly.reduce((s, r) => s + r.sales, 0),
    expenses: weekly.reduce((s, r) => s + r.expenses, 0),
    profit: weekly.reduce((s, r) => s + r.profit, 0),
  }), [weekly]);

  const monthlyTotals = useMemo(() => ({
    sales: monthly.reduce((s, r) => s + r.sales, 0),
    expenses: monthly.reduce((s, r) => s + r.expenses, 0),
    profit: monthly.reduce((s, r) => s + r.profit, 0),
  }), [monthly]);

  return (
    <div className="space-y-4">
      <Card>
        <div className="text-sm font-medium">Weekly Summary</div>
        <div className="mt-2 text-sm">Sales: ₦{weeklyTotals.sales.toLocaleString()}</div>
        <div className="text-sm">Expenses: ₦{weeklyTotals.expenses.toLocaleString()}</div>
        <div className="text-sm">Profit: ₦{weeklyTotals.profit.toLocaleString()}</div>
      </Card>

      <Card>
        <div className="text-sm font-medium">Monthly Summary</div>
        <div className="mt-2 text-sm">Sales: ₦{monthlyTotals.sales.toLocaleString()}</div>
        <div className="text-sm">Expenses: ₦{monthlyTotals.expenses.toLocaleString()}</div>
        <div className="text-sm">Profit: ₦{monthlyTotals.profit.toLocaleString()}</div>
      </Card>

      <Card>
        <SalesLineChart reports={reports} />
      </Card>

      <div className="flex gap-3">
        <button className="px-4 py-2 bg-indigo-600 text-white rounded" onClick={() => exportReportToPDF({ weekly, monthly, debts })}>Export PDF</button>
        <button className="px-4 py-2 bg-white border rounded" onClick={() => exportReportToXLSX({ weekly, monthly, debts })}>Export Excel</button>
      </div>
    </div>
  );
}
