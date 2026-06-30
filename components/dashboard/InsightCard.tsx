"use client";
import React from "react";
import Card from "../ui/Card";
import { useInsightsStore } from "../../stores/useInsightsStore";

export default function InsightCard() {
  const insights = useInsightsStore((s) => s.insights);
  const latest = insights && insights.length > 0 ? insights[insights.length - 1] : null;

  return (
    <Card>
      <div className="text-sm font-medium">AI Insight</div>
      <div className="mt-2 text-sm text-slate-700">{latest ? latest.title : "No insight yet. Submit today's business to receive AI-powered insights."}</div>
      {latest && <div className="mt-1 text-xs text-slate-500">{latest.message}</div>}
    </Card>
  );
}
