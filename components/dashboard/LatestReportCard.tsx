"use client";
import React from "react";
import Card from "../ui/Card";

export default function LatestReportCard() {
  return (
    <Card>
      <div className="text-sm text-slate-600">Latest Business Report</div>
      <div className="mt-2">
        <div className="text-sm">Date: —</div>
        <div className="text-sm">Sales: —</div>
        <div className="text-sm">Expenses: —</div>
        <div className="text-sm">Profit: —</div>
      </div>
    </Card>
  );
}
