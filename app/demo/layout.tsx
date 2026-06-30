"use client";
import React from "react";
import DemoShell from "../../components/layout/DemoShell";
import { SeedDemoDataButton } from "../../components/shared/EmptyState";

export const metadata = {
  title: "BizDaily Demo",
  description: "Demo application for BizDaily",
};

export default function DemoLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-white text-slate-900">
        <DemoShell>{children}</DemoShell>
      </body>
    </html>
  );
}
