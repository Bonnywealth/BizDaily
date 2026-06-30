"use client";
import React from "react";
import Card from "../ui/Card";

export default function BusinessScore() {
  return (
    <Card>
      <div className="flex items-center gap-4">
        <div className="w-20 h-20 rounded-full bg-indigo-100 flex items-center justify-center">
          <div className="text-xl font-bold">—</div>
        </div>
        <div>
          <div className="text-sm">Business Score</div>
          <div className="text-slate-600 text-sm">Calculated from trends and consistency</div>
        </div>
      </div>
    </Card>
  );
}
