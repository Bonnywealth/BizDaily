"use client";
import React from "react";
import { useSettingsStore } from "../../stores/useSettingsStore";

export default function SettingsPage() {
  const resetDemoData = useSettingsStore((s) => s.resetDemoData);
  const businessName = useSettingsStore((s) => s.businessName);

  return (
    <div className="min-h-screen p-4 max-w-md mx-auto">
      <h1 className="text-xl font-semibold mb-3">Settings</h1>
      <section className="space-y-4">
        <div className="p-4 border rounded">
          <div className="text-sm font-medium">Business Information</div>
          <div className="text-sm text-slate-700 mt-2">{businessName}</div>
        </div>

        <div className="p-4 border rounded">
          <div className="text-sm font-medium mb-2">Demo Data</div>
          <p className="text-sm text-slate-600 mb-3">Reset demo data to the original Bonnywealth demo state. This will overwrite local data.</p>
          <button
            onClick={() => {
              if (confirm("Reset demo data to original demo state? This will overwrite your local data.")) {
                resetDemoData();
                alert("Demo data reset successfully.");
              }
            }}
            className="px-4 py-2 bg-red-600 text-white rounded"
          >
            Reset Demo Data
          </button>
        </div>

        <div className="p-4 border rounded">Help & About (placeholder)</div>
      </section>
    </div>
  );
}
