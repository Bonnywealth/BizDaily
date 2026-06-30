"use client";
import React from "react";
import DebtsList from "../../../components/debts/DebtsList";

export default function DebtsPage() {
  return (
    <div className="min-h-screen p-4 max-w-md mx-auto">
      <h1 className="text-xl font-semibold mb-3">Debt Management</h1>
      <DebtsList />
    </div>
  );
}
