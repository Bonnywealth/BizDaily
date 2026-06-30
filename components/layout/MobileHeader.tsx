"use client";
import React from "react";
import Link from "next/link";

export default function MobileHeader() {
  return (
    <header className="bg-white shadow-sm sticky top-0 z-10">
      <div className="max-w-md mx-auto px-4 py-3 flex items-center justify-between">
        <div className="text-lg font-medium">BizDaily</div>
        <nav className="text-sm text-slate-600">
          <Link href="/demo/settings">
            <a>Settings</a>
          </Link>
        </nav>
      </div>
    </header>
  );
}
