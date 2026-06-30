"use client";
import React from "react";
import Card from "../ui/Card";
import ExportButtons from "./ExportButtons";
import dynamic from "next/dynamic";

const SalesLineChart = dynamic(() => import("./charts/SalesLineChart"), { ssr: false });

export default function ReportPage() {
  return (
    <div className="space-y-4">
      <Card>
        <div className="text-sm font-medium">Generate Reports</div>
        <div className="mt-2 text-sm text-slate-600">Select weekly or monthly reports and export.</div>
      </Card>

      <Card>
        <SalesLineChart />
      </Card>

      <ExportButtons />
    </div>
  );
}
