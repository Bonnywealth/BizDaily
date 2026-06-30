"use client";
import React from "react";
import HistoryList from "../../../components/history/HistoryList";

export default function HistoryPage() {
  return (
    <div className="max-w-3xl mx-auto p-4">
      <header className="mb-4">
        <h2 className="text-xl font-semibold">Business History</h2>
        <p className="text-sm text-slate-600">View past daily reports and virtual entries for missing days.</p>
      </header>

      <section>
        <HistoryList days={14} />
      </section>
    </div>
  );
}
