"use client";
import React from "react";
import KPIGrid from "../../../components/dashboard/KPIGrid";
import LatestReportCard from "../../../components/dashboard/LatestReportCard";
import BusinessScore from "../../../components/dashboard/BusinessScore";
import InsightCard from "../../../components/dashboard/InsightCard";
import QuickActions from "../../../components/dashboard/QuickActions";

export default function DashboardPage() {
  return (
    <div className="min-h-screen p-4 max-w-md mx-auto">
      <header className="mb-4">
        <h1 className="text-2xl font-bold">👋 Welcome Back</h1>
        <p className="text-slate-600">Bonnywealth Enterprise — Let's review your business.</p>
      </header>

      <section className="space-y-4">
        <LatestReportCard />
        <KPIGrid />
        <BusinessScore />
        <InsightCard />
        <QuickActions />
      </section>
    </div>
  );
}
