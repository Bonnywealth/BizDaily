"use client";
import React from "react";
import Link from "next/link";

export default function QuickActions() {
  const actions = [
    { label: "Record Today's Business", href: "/demo/record" },
    { label: "Debt Management", href: "/demo/debts" },
    { label: "Business History", href: "/demo/history" },
    { label: "Generate Reports", href: "/demo/reports" },
    { label: "Settings", href: "/demo/settings" },
    { label: "Help", href: "/demo/settings" },
  ];

  return (
    <div className="grid grid-cols-2 gap-3">
      {actions.map((a) => (
        <Link href={a.href} key={a.label}>
          <a className="block p-4 bg-white border rounded-lg text-center">{a.label}</a>
        </Link>
      ))}
    </div>
  );
}
