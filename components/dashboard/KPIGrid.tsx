"use client";
import React from "react";
import Card from "../ui/Card";

export default function KPIGrid() {
  return (
    <div className="grid grid-cols-2 gap-3">
      <Card>Sales<br/><span className="font-bold">—</span></Card>
      <Card>Expenses<br/><span className="font-bold">—</span></Card>
      <Card>Profit<br/><span className="font-bold">—</span></Card>
      <Card>Outstanding Debt<br/><span className="font-bold">—</span></Card>
    </div>
  );
}
