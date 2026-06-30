import React from "react";
import Link from "next/link";

export default function MarketingLanding() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-6 bg-slate-50">
      <section className="max-w-xl text-center">
        <h1 className="text-3xl font-bold mb-3">Every Small Business Deserves an AI Business Advisor.</h1>
        <p className="text-slate-700 mb-6">
          BizDaily transforms simple daily business reports into intelligent business insights.
        </p>
        <div className="flex gap-3 justify-center">
          <Link href="/demo">
            <a className="px-5 py-3 bg-indigo-600 text-white rounded-lg">Explore Demo</a>
          </Link>
          <Link href="/demo">
            <a className="px-5 py-3 border rounded-lg">Get Started</a>
          </Link>
        </div>
      </section>

      <footer className="mt-12 text-sm text-slate-500">
        <div>About • Privacy • Contact</div>
        <div className="mt-2">© {new Date().getFullYear()} BizDaily</div>
      </footer>
    </main>
  );
}
