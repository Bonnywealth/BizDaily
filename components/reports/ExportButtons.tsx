"use client";
import React from "react";
import Button from "../ui/Button";

export default function ExportButtons() {
  return (
    <div className="flex gap-3">
      <Button>Export PDF</Button>
      <Button variant="ghost">Export Excel</Button>
    </div>
  );
}
