"use client";
import React from "react";
import Input from "../ui/Input";
import Button from "../ui/Button";
import { useReportsStore } from "../../stores/useReportsStore";
import { useDebtsStore } from "../../stores/useDebtsStore";
import { useInsightsStore } from "../../stores/useInsightsStore";
import { computeProfit, generateInsight } from "../../utils/bizLogic";
import { useRouter } from "next/navigation";
import { todayIsoLocal, dayNameFromIso } from "../../utils/date";

export default function RecordForm() {
  const addReport = useReportsStore((s) => s.addReport);
  const addDebt = useDebtsStore((s) => s.addDebt);
  const addInsight = useInsightsStore((s) => s.addInsight);
  const reports = useReportsStore((s) => s.reports);
  const debts = useDebtsStore((s) => s.debts);

  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const fd = new FormData(form);
    const salesRaw = fd.get("sales") as string | null;
    const expensesRaw = fd.get("expenses") as string | null;
    const customerName = (fd.get("customerName") as string) || "";
    const amountOwedRaw = fd.get("amountOwed") as string | null;
    const dueDate = (fd.get("dueDate") as string) || null;

    const sales = salesRaw ? Number(salesRaw) : NaN;
    const expenses = expensesRaw ? Number(expensesRaw) : NaN;

    // Basic validation per PRD
    if (isNaN(sales) || sales < 0) {
      alert("Invalid Sales\nPlease enter a valid sales amount.");
      return;
    }
    if (isNaN(expenses) || expenses < 0) {
      alert("Invalid Expenses\nPlease enter a valid expense amount.");
      return;
    }

    // If debtor provided, require customerName and amount
    let debtorToAdd = null;
    if (amountOwedRaw && amountOwedRaw.trim() !== "") {
      const amountOwed = Number(amountOwedRaw);
      if (!customerName || customerName.trim() === "") {
        alert("Customer Name Missing\nCustomer name is required.");
        return;
      }
      if (isNaN(amountOwed) || amountOwed <= 0) {
        alert("Amount Missing\nPlease enter the debt amount.");
        return;
      }
      debtorToAdd = {
        id: `d-${Date.now()}`,
        customerName: customerName,
        amount: amountOwed,
        dateRecorded: todayIsoLocal(),
        dueDate: dueDate || null,
        status: "Outstanding" as const,
        paidAt: null,
        notes: "",
      };
    }

    const profit = computeProfit(sales, expenses);
    const dateIso = todayIsoLocal();
    const day = dayNameFromIso(dateIso) as any;

    const report = {
      id: `r-${dateIso}`,
      date: dateIso,
      day,
      sales,
      expenses,
      profit,
      status: "Submitted" as const,
      businessScore: undefined,
      insightIds: [],
      createdAt: new Date().toISOString(),
    };

    addReport(report);
    if (debtorToAdd) addDebt(debtorToAdd);

    // Generate insight (pass recent reports including this new one)
    const recentReports = [...reports, report];
    const insight = generateInsight(report, recentReports, [...debts, ...(debtorToAdd ? [debtorToAdd] : [])]);
    if (insight) addInsight(insight);

    // Navigate back to dashboard and rely on stores to update UI
    router.push("/demo/dashboard");
    alert("✅ Today's business has been recorded successfully.");
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <Input label="Total Sales" name="sales" type="number" placeholder="0.00" />
      <Input label="Total Expenses" name="expenses" type="number" placeholder="0.00" />
      <div className="border rounded p-3">
        <div className="text-sm font-medium mb-2">Optional: Record Debtor</div>
        <Input label="Customer Name" name="customerName" />
        <Input label="Amount Owed" name="amountOwed" type="number" />
        <Input label="Due Date (optional)" name="dueDate" type="date" />
      </div>

      <div className="flex gap-3">
        <Button type="submit">Save Today's Business</Button>
        <Button variant="ghost" type="button" onClick={() => window.history.back()}>Cancel</Button>
      </div>
    </form>
  );
}
