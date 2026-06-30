"use client";
import React from "react";
import Link from "next/link";
import { useSettingsStore } from "../../stores/useSettingsStore";
import { demoBusinessReports, demoDebts, demoInsights } from "../../data/demo-data";

export default function DemoEntry() {
  const initialized = useSettingsStore((s) => s.initialized);

  return (
    <div className="min-h-screen p-4 max-w-md mx-auto">
      <header className="mb-6">
        <h2 className="text-xl font-semibold">Bonnywealth Enterprise — Demo</h2>
        <p className="text-slate-600 mt-1">Explore BizDaily with preloaded demo data.</p>
      </header>

      <main className="space-y-4">
        <Link href="/demo/dashboard">
          <a className="block w-full text-center py-3 bg-indigo-600 text-white rounded-lg">Enter Demo</a>
        </Link>

        <div className="text-sm text-slate-600">{initialized ? "Demo previously initialized." : "Initializing demo data on first entry..."}</div>

        <div className="pt-4 text-xs text-slate-500">This demo uses local data only; no authentication required.</div>
      </main>
    </div>
  );
}
