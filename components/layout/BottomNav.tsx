"use client";
import React from "react";
import Link from "next/link";

export default function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white shadow-inner border-t sm:hidden">
      <div className="max-w-md mx-auto flex justify-between px-6 py-2">
        <Link href="/demo/dashboard"><a className="text-center">Home</a></Link>
        <Link href="/demo/record"><a className="text-center">Record</a></Link>
        <Link href="/demo/debts"><a className="text-center">Debts</a></Link>
        <Link href="/demo/reports"><a className="text-center">Reports</a></Link>
      </div>
    </nav>
  );
}
