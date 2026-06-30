"use client";
import React from "react";
import { useReportsStore } from "../../stores/useReportsStore";
import { useDebtsStore } from "../../stores/useDebtsStore";
import { computeBusinessScore } from "../../utils/bizLogic";
import { exportReportToXLSX, exportReportToPDF } from "../../utils/export";
import Card from "../ui/Card";

export default function ReportsPage() {
  const reports = useReportsStore((s) => s.reports.slice());
  const debts = useDebtsStore((s) => s.debts.slice());

  // Simple weekly summary: last 7 days ending yesterday
  const today = new Date();
  today.setHours(0,0,0,0);
  const end = new Date(today);
  end.setDate(end.getDate() - 1);
  const start = new Date(end);
  start.setDate(start.getDate() - 6);
  const iso = (d: Date) => d.toISOString().slice(0,10);
  const startIso = iso(start);
  const endIso = iso(end);

  const daily = reports.filter((r) => r.date >= startIso && r.date <= endIso).sort((a,b) => (a.date < b.date ? -1 : 1));
  const weeklyScore = computeBusinessScore(reports, debts, endIso);

  async function handleExportExcel() {
    await exportReportToXLSX({ daily: daily, weekly: daily, monthly: [], debts });
  }

  async function handleExportPDF() {
    try {
      await exportReportToPDF('report-root');
    } catch (err) {
      console.error(err);
      alert('Failed to export PDF.');
    }
  }

  return (
    <div className="max-w-3xl mx-auto p-4">
      <header className="mb-4">
        <h2 className="text-xl font-semibold">Reports</h2>
        <p className="text-sm text-slate-600">Generate and export weekly and monthly reports.</p>
      </header>

      <section id="report-root">
        <Card>
          <div className="mb-2 font-medium">Weekly Summary ({startIso} → {endIso})</div>
          <div className="text-sm">Days included: {daily.length}</div>
          <div className="text-sm">Business Score: {weeklyScore}</div>
        </Card>

        <div className="flex gap-3 mt-4">
          <button className="px-4 py-2 bg-indigo-600 text-white rounded" onClick={handleExportPDF}>Export PDF</button>
          <button className="px-4 py-2 bg-white border rounded" onClick={handleExportExcel}>Export Excel</button>
        </div>
      </section>
    </div>
  );
}
