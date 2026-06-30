"use client";
import React from "react";
import LatestReportCard from "../../../components/dashboard/LatestReportCard";
import KPIGrid from "../../../components/dashboard/KPIGrid";
import BusinessScore from "../../../components/dashboard/BusinessScore";
import InsightCard from "../../../components/dashboard/InsightCard";
import Link from "next/link";

export default function DashboardPage() {
  return (
    <div className="max-w-3xl mx-auto p-4">
      <header className="mb-4">
        <h2 className="text-xl font-semibold">Dashboard</h2>
        <p className="text-sm text-slate-600">Overview of your latest business report, KPIs, score and insights.</p>
      </header>

      <section className="space-y-4">
        <LatestReportCard />
        <KPIGrid />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <BusinessScore />
          <InsightCard />
        </div>

        <div className="flex gap-3 mt-4">
          <Link href="/demo/record">
            <a className="px-4 py-2 bg-indigo-600 text-white rounded">Record Today's Business</a>
          </Link>
          <Link href="/demo/debts">
            <a className="px-4 py-2 bg-white border rounded">Debt Management</a>
          </Link>
          <Link href="/demo/history">
            <a className="px-4 py-2 bg-white border rounded">Business History</a>
          </Link>
          <Link href="/demo/reports">
            <a className="px-4 py-2 bg-white border rounded">Reports</a>
          </Link>
        </div>
      </section>
    </div>
  );
}
