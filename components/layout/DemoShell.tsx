"use client";
import React from "react";
import MobileHeader from "./MobileHeader";
import BottomNav from "./BottomNav";

export default function DemoShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-50">
      <MobileHeader />
      <main className="pt-4 pb-24">{children}</main>
      <BottomNav />
    </div>
  );
}
