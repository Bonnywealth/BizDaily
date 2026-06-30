"use client";
import React from "react";
import DebtsList from "../../../components/debts/DebtsList";

export default function DebtsPage() {
  return (
    <div className="max-w-3xl mx-auto p-4">
      <header className="mb-4">
        <h2 className="text-xl font-semibold">Debt Management</h2>
        <p className="text-sm text-slate-600">Track outstanding debts and record payments when received.</p>
      </header>

      <section>
        <DebtsList />
      </section>
    </div>
  );
}
