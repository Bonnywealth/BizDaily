"use client";
import React from "react";
import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-sky-50 to-white">
      <div className="max-w-2xl p-8 bg-white rounded shadow text-center">
        <h1 className="text-2xl font-bold">BizDaily — Small Business Financials</h1>
        <p className="text-slate-600 mt-2">Simple daily reporting, debt tracking, and AI insights for micro &amp; small businesses.</p>
        <div className="mt-6 flex justify-center gap-3">
          <Link href="/demo">
            <a className="px-5 py-3 bg-indigo-600 text-white rounded">Try the Demo</a>
          </Link>
          <Link href="/demo/settings">
            <a className="px-5 py-3 bg-white border rounded text-slate-700">Settings</a>
          </Link>
        </div>
        <div className="text-xs text-slate-500 mt-4">This demo runs entirely in your browser using local storage.</div>
      </div>
    </div>
  );
}
