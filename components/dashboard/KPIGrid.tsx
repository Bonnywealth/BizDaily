"use client";
import React from "react";
import Card from "../ui/Card";
import { useReportsStore } from "../../stores/useReportsStore";
import { useDebtsStore } from "../../stores/useDebtsStore";
import { getLatestExpectedReport } from "../../utils/bizLogic";

export default function KPIGrid() {
  const reports = useReportsStore((s) => s.reports);
  const debts = useDebtsStore((s) => s.debts);

  const latest = getLatestExpectedReport(reports);
  const outstanding = debts.filter((d) => d.status === "Outstanding").reduce((s, d) => s + d.amount, 0);
  const isVirtual = latest?.status === "No Business Report Submitted";

  const salesDisplay = isVirtual ? "Nil" : `₦${latest?.sales.toLocaleString() ?? "—"}`;
  const expensesDisplay = isVirtual ? "Nil" : `₦${latest?.expenses.toLocaleString() ?? "—"}`;
  const profitDisplay = isVirtual ? "Nil" : `₦${latest?.profit.toLocaleString() ?? "—"}`;

  return (
    <div className="grid grid-cols-2 gap-3">
      <Card>
        <div className="text-sm">Sales</div>
        <div className="text-lg font-bold mt-1">{salesDisplay}</div>
      </Card>
      <Card>
        <div className="text-sm">Expenses</div>
        <div className="text-lg font-bold mt-1">{expensesDisplay}</div>
      </Card>
      <Card>
        <div className="text-sm">Profit</div>
        <div className="text-lg font-bold mt-1">{profitDisplay}</div>
      </Card>
      <Card>
        <div className="text-sm">Outstanding Debt</div>
        <div className="text-lg font-bold mt-1">₦{outstanding.toLocaleString()}</div>
      </Card>
    </div>
  );
}
