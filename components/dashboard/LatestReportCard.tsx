"use client";
import React from "react";
import Card from "../ui/Card";
import { useReportsStore } from "../../stores/useReportsStore";
import { useDebtsStore } from "../../stores/useDebtsStore";
import { getLatestExpectedReport } from "../../utils/bizLogic";

export default function LatestReportCard() {
  const reports = useReportsStore((s) => s.reports);
  const debts = useDebtsStore((s) => s.debts);

  const latest = getLatestExpectedReport(reports);
  const outstanding = debts.filter((d) => d.status === "Outstanding").reduce((s, d) => s + d.amount, 0);

  // If latest is virtual (No Business Report Submitted), show Nil values and current outstanding balance per PRD
  const isVirtual = latest?.status === "No Business Report Submitted";

  return (
    <Card>
      <div className="text-sm text-slate-600">Latest Business Report</div>
      <div className="mt-2">
        <div className="text-sm">{latest ? `${latest.day} — ${latest.date}` : "—"}</div>
        <div className="text-sm">Sales: {isVirtual ? "Nil" : `₦${latest?.sales.toLocaleString() ?? "—"}`}</div>
        <div className="text-sm">Expenses: {isVirtual ? "Nil" : `₦${latest?.expenses.toLocaleString() ?? "—"}`}</div>
        <div className="text-sm">Profit: {isVirtual ? "Nil" : `₦${latest?.profit.toLocaleString() ?? "—"}`}</div>
        <div className="text-sm">Outstanding Debt: ₦{outstanding.toLocaleString()}</div>
        <div className="text-sm">Status: {latest?.status}</div>
      </div>
    </Card>
  );
}
