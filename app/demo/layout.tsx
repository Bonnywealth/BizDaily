"use client";
import React, { useEffect } from "react";
import DemoShell from "../../components/layout/DemoShell";
import { demoBusinessReports, demoDebts, demoInsights } from "../../data/demo-data";
import { useReportsStore } from "../../stores/useReportsStore";
import { useDebtsStore } from "../../stores/useDebtsStore";
import { useInsightsStore } from "../../stores/useInsightsStore";
import { useSettingsStore } from "../../stores/useSettingsStore";

export const metadata = {
  title: "BizDaily Demo",
  description: "Demo application for BizDaily",
};

export default function DemoLayout({ children }: { children: React.ReactNode }) {
  const reports = useReportsStore((s) => s.reports);
  const setReports = useReportsStore((s) => s.setReports);
  const debts = useDebtsStore((s) => s.debts);
  const setDebts = useDebtsStore((s) => s.setDebts);
  const insights = useInsightsStore((s) => s.insights);
  const setInsights = useInsightsStore((s) => s.setInsights);
  const initialized = useSettingsStore((s) => s.initialized);
  const setInitialized = useSettingsStore((s) => s.setInitialized);

  useEffect(() => {
    // Seed demo data automatically when user first enters /demo
    // If local data already exists, preserve it.
    if (!initialized) {
      // Only seed when no existing data
      if (!reports || reports.length === 0) {
        setReports(demoBusinessReports);
      }
      if (!debts || debts.length === 0) {
        setDebts(demoDebts);
      }
      if (!insights || insights.length === 0) {
        setInsights(demoInsights);
      }
      setInitialized(true);
    }
  }, [initialized, reports.length, debts.length, insights.length, setReports, setDebts, setInsights, setInitialized]);

  return (
    <html lang="en">
      <body className="bg-white text-slate-900">
        <DemoShell>{children}</DemoShell>
      </body>
    </html>
  );
}
