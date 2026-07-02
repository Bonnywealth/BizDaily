import React from 'react';

export default function HomePage() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-50 font-sans px-4 py-6 md:px-8">
      {/* Header Container */}
      <header className="max-w-md mx-auto mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-indigo-400">BizDaily</h1>
          <p className="text-xs text-slate-400">Smart metrics for smart builders</p>
        </div>
        <div className="h-8 w-8 rounded-full bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center">
          <span className="text-xs font-semibold text-indigo-400">BD</span>
        </div>
      </header>

      {/* Main Mobile Card Container */}
      <div className="max-w-md mx-auto space-y-5">
        
        {/* Metric Cards Grid */}
        <section className="grid grid-cols-2 gap-4">
          <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl shadow-sm">
            <span className="text-xs font-medium text-slate-400 block mb-1">Today's Revenue</span>
            <span className="text-xl font-bold text-emerald-400">₦0.00</span>
          </div>
          <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl shadow-sm">
            <span className="text-xs font-medium text-slate-400 block mb-1">Transactions</span>
            <span className="text-xl font-bold text-indigo-400">0</span>
          </div>
        </section>

        {/* Quick Action Button */}
        <button className="w-full py-3.5 px-4 bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white font-medium rounded-2xl transition shadow-md shadow-indigo-600/10 flex items-center justify-center gap-2 text-sm">
          <span>+ Log New Sale</span>
        </button>

        {/* Recent Logs & Overview Section */}
        <section className="p-5 bg-slate-900 border border-slate-800 rounded-2xl space-y-4">
          <div className="flex justify-between items-center border-b border-slate-800 pb-3">
            <h2 className="text-sm font-semibold tracking-wide text-slate-200 uppercase">Daily Feed</h2>
            <span className="text-xs bg-slate-800 text-slate-400 px-2 py-0.5 rounded-full">July 2026</span>
          </div>

          {/* Empty State placeholder for data logs */}
          <div className="py-8 text-center space-y-2">
            <div className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-slate-800 text-slate-500">
              📊
            </div>
            <p className="text-sm text-slate-300 font-medium">No sales recorded today</p>
            <p className="text-xs text-slate-500 max-w-[200px] mx-auto">Your metrics update live here as soon as logs are entered.</p>
          </div>
        </section>

      </div>
    </main>
  );
}