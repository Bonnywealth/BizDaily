'use client';

import React, { useState, useEffect } from 'react';

// Define the structure of a transaction log
interface SaleLog {
  id: string;
  amount: number;
  description: string;
  timestamp: string;
}

export default function HomePage() {
  // --- STATE ---
  const [logs, setLogs] = useState<SaleLog[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Form inputs
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');

  // --- LOCAL STORAGE: Save & Load data so it doesn't disappear on refresh ---
  useEffect(() => {
    const savedLogs = localStorage.getItem('bizdaily_logs');
    if (savedLogs) {
      try {
        setLogs(JSON.parse(savedLogs));
      } catch (e) {
        console.error("Error parsing saved logs", e);
      }
    }
  }, []);

  const saveToLocalStorage = (newLugs: SaleLog[]) => {
    localStorage.setItem('bizdaily_logs', JSON.stringify(newLugs));
  };

  // --- DERIVED METRICS ---
  const todayRevenue = logs.reduce((sum, log) => sum + log.amount, 0);
  const totalTransactions = logs.length;

  // --- HANDLERS ---
  const handleLogSale = (e: React.FormEvent) => {
    e.preventDefault();
    
    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      alert("Please enter a valid amount");
      return;
    }

    const newLog: SaleLog = {
      id: crypto.randomUUID(),
      amount: parsedAmount,
      description: description.trim() || 'General Sale',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    const updatedLogs = [newLog, ...logs];
    setLogs(updatedLogs);
    saveToLocalStorage(updatedLogs);

    // Reset form and close modal
    setAmount('');
    setDescription('');
    setIsModalOpen(false);
  };

  const handleDeleteLog = (id: string) => {
    const updatedLogs = logs.filter(log => log.id !== id);
    setLogs(updatedLogs);
    saveToLocalStorage(updatedLogs);
  };

  return (
    <main className="min-h-screen bg-slate-950 text-slate-50 font-sans px-4 py-6 md:px-8 relative">
      
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
            <span className="text-xl font-bold text-emerald-400">
              ₦{todayRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          </div>
          <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl shadow-sm">
            <span className="text-xs font-medium text-slate-400 block mb-1">Transactions</span>
            <span className="text-xl font-bold text-indigo-400">{totalTransactions}</span>
          </div>
        </section>

        {/* Quick Action Button */}
        <button 
          onClick={() => setIsModalOpen(true)}
          className="w-full py-3.5 px-4 bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white font-medium rounded-2xl transition shadow-md shadow-indigo-600/10 flex items-center justify-center gap-2 text-sm"
        >
          <span>+ Log New Sale</span>
        </button>

        {/* Recent Logs & Overview Section */}
        <section className="p-5 bg-slate-900 border border-slate-800 rounded-2xl space-y-4">
          <div className="flex justify-between items-center border-b border-slate-800 pb-3">
            <h2 className="text-sm font-semibold tracking-wide text-slate-200 uppercase">Daily Feed</h2>
            <span className="text-xs bg-slate-800 text-slate-400 px-2 py-0.5 rounded-full">July 2026</span>
          </div>

          {/* Dynamic Feed Conditional Rendering */}
          {logs.length === 0 ? (
            <div className="py-8 text-center space-y-2">
              <div className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-slate-800 text-slate-500">
                📊
              </div>
              <p className="text-sm text-slate-300 font-medium">No sales recorded today</p>
              <p className="text-xs text-slate-500 max-w-[200px] mx-auto">Your metrics update live here as soon as logs are entered.</p>
            </div>
          ) : (
            <div className="space-y-3 max-h-[350px] overflow-y-auto pr-1">
              {logs.map((log) => (
                <div key={log.id} className="flex justify-between items-center p-3 bg-slate-950 border border-slate-800/60 rounded-xl group">
                  <div className="space-y-0.5">
                    <p className="text-sm font-medium text-slate-200">{log.description}</p>
                    <span className="text-[10px] text-slate-500">{log.timestamp}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-semibold text-emerald-400">+₦{log.amount.toLocaleString()}</span>
                    <button 
                      onClick={() => handleDeleteLog(log.id)}
                      className="text-slate-600 hover:text-red-400 text-xs p-1 transition"
                      title="Delete log"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>

      {/* --- POPUP MODAL COMPONENT --- */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-md rounded-2xl p-6 space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h3 className="text-lg font-bold text-slate-100">Log New Sale</h3>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-200 text-lg"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleLogSale} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Amount (₦)</label>
                <input 
                  type="number" 
                  step="any"
                  required
                  placeholder="e.g. 5000"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-slate-100 placeholder-slate-600 focus:outline-none focus:border-indigo-500 text-sm"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Description</label>
                <input 
                  type="text" 
                  placeholder="e.g. CAC Registration Deposit"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-slate-100 placeholder-slate-600 focus:outline-none focus:border-indigo-500 text-sm"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button 
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-3 bg-slate-800 hover:bg-slate-750 text-slate-300 font-medium rounded-xl text-sm transition"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="flex-1 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-medium rounded-xl text-sm transition shadow-md shadow-indigo-600/10"
                >
                  Save Log
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}