"use client";
import React from "react";

export default function DebtItem() {
  return (
    <div className="p-3 border rounded">
      <div className="text-sm font-medium">Customer Name</div>
      <div className="text-sm text-slate-600">Amount: —</div>
    </div>
  );
}
