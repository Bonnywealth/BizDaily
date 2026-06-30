"use client";
import React from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { BusinessReport } from "../../types/domain";

export default function SalesLineChart({ reports }: { reports: BusinessReport[] }) {
  // prepare series: group by date, ensure all days in range exist
  const data = reports
    .slice()
    .sort((a, b) => (a.date > b.date ? 1 : -1))
    .map((r) => ({ date: r.date, sales: r.sales, expenses: r.expenses, profit: r.profit }));

  return (
    <div className="h-48">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="sales" stroke="#2563EB" dot={false} />
          <Line type="monotone" dataKey="expenses" stroke="#EF4444" dot={false} />
          <Line type="monotone" dataKey="profit" stroke="#10B981" dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
