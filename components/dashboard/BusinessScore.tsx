"use client";
import React, { useEffect } from "react";
import Card from "../ui/Card";
import { useReportsStore } from "../../stores/useReportsStore";
import { useDebtsStore } from "../../stores/useDebtsStore";
import { computeBusinessScore } from "../../utils/bizLogic";
import { useBusinessScoreStore } from "../../stores/useBusinessScoreStore";

export default function BusinessScore() {
  const reports = useReportsStore((s) => s.reports);
  const debts = useDebtsStore((s) => s.debts);
  const setScore = useBusinessScoreStore((s) => s.setScore);
  const score = useBusinessScoreStore((s) => s.score);

  useEffect(() => {
    const newScore = computeBusinessScore(reports, debts);
    setScore(newScore, null);
  }, [reports.length, debts.length]);

  return (
    <Card>
      <div className="flex items-center gap-4">
        <div className="w-20 h-20 rounded-full bg-indigo-100 flex items-center justify-center">
          <div className="text-xl font-bold">{score ?? "—"}</div>
        </div>
        <div>
          <div className="text-sm">Business Score</div>
          <div className="text-slate-600 text-sm">Calculated from trends and consistency</div>
        </div>
      </div>
    </Card>
  );
}
