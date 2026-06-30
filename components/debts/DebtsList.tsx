"use client";
import React from "react";
import Card from "../ui/Card";

export default function DebtsList() {
  return (
    <div className="space-y-3">
      <Card>
        <div className="text-sm font-medium">Outstanding</div>
        <div className="mt-2 text-sm text-slate-700">No outstanding debts (placeholder)</div>
      </Card>

      <Card>
        <div className="text-sm font-medium">Paid</div>
        <div className="mt-2 text-sm text-slate-700">No paid debts (placeholder)</div>
      </Card>
    </div>
  );
}
