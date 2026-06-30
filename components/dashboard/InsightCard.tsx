"use client";
import React from "react";
import Card from "../ui/Card";

export default function InsightCard() {
  return (
    <Card>
      <div className="text-sm font-medium">AI Insight</div>
      <div className="mt-2 text-sm text-slate-700">No insight yet. Submit today's business to receive AI-powered insights.</div>
    </Card>
  );
}
