"use client";
import React from "react";
import TimelineList from "../../../components/history/TimelineList";

export default function HistoryPage() {
  return (
    <div className="min-h-screen p-4 max-w-md mx-auto">
      <h1 className="text-xl font-semibold mb-3">Business History</h1>
      <TimelineList />
    </div>
  );
}
