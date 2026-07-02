'use client';

import React, { useState, useEffect } from 'react';

// --- DATA MODELS ---
interface Transaction {
  id: string;
  type: 'sale' | 'expense';
  amount: number;
  description: string;
  timestamp: string;
}

interface Debt {
  id: string;
  customerName: string;
  amount: number;
  type: 'receivable' | 'payable'; // receivable = they owe us, payable = we owe them
  dueDate: string;
  status: 'pending' | 'settled';
  timestamp: string;
}

export default function HomePage() {
  // --- CORE STATE ---
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [debts, setDebts] = useState<Debt[]>([]);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'debts' | 'history'>('dashboard');
  
  // Modals
  const [isTxModalOpen, setIsTxModalOpen] = useState(false);
  const [isDebtModalOpen, setIsDebtModalOpen] = useState(false);

  // Form Inputs
  const [txType, setTxType] = useState<'sale' | 'expense'>('sale');
  const [txAmount, setTxAmount] = useState('');
  const [txDesc, setTxDesc] = useState('');

  const [debtCustomer, setDebtCustomer] = useState('');
  const [debtAmount, setDebtAmount] = useState('');
  const [debtType, setDebtType] = useState<'receivable' | 'payable'>('receivable');
  const [debtDueDate, setDebtDueDate] = useState('');

  // --- LOCAL STORAGE HYDRATION ---
  useEffect(() => {
    const savedTx = localStorage.getItem('bizdaily_tx');
    const savedDebts = localStorage.getItem('bizdaily_debts');
    if (savedTx) setTransactions(JSON.parse(savedTx));
    if (savedDebts) setDebts(JSON.parse(savedDebts));
  }, []);

  const saveTxData = (newTx: Transaction[]) => {
    setTransactions(newTx);
    localStorage.setItem('bizdaily_tx', JSON.stringify(newTx));
  };

  const saveDebtData = (newDebts: Debt[]) => {
    setDebts(newDebts);
    localStorage.setItem('bizdaily_debts', JSON.stringify(newDebts));
  };

  // --- BUSINESS SCORE ALGORITHM & METRICS ---
  const totalSales = transactions.filter(t => t.type === 'sale').reduce((sum, t) => sum + t.amount, 0);
  const totalExpenses = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
  const netRevenue = totalSales - totalExpenses;

  const activeReceivables = debts.filter(d => d.type === 'receivable' && d.status === 'pending').reduce((sum, d) => sum + d.amount, 0);
  const activePayables = debts.filter(d => d.type === 'payable' && d.status === 'pending').reduce((sum, d) => sum + d.amount, 0);

  // Growth & Health Score Algorithm (0 - 100)
  // Formula balances revenue velocity against outstanding debt risk profiles
  const calculateBusinessScore = () => {
    if (totalSales === 0) return 50; // Neutral baseline for new businesses
    const debtToSalesRatio = activeReceivables / totalSales;
    const expenseToSalesRatio = totalExpenses / totalSales;
    
    let score = 75; // Starting healthy base
    
    // Impact of high expenses
    if (expenseToSalesRatio > 0.5) score -= 15;
    else if (expenseToSalesRatio < 0.2) score += 10;

    // Impact of high pending debt collection risk
    if (debtToSalesRatio > 0.4) score -= 20;
    else if (debtToSalesRatio > 0) score += 5;

    return Math.min(Math.max(score, 10), 100);
  };

  const businessScore = calculateBusinessScore();

  // --- ACTIONS ---
  const handleAddTransaction = (e: React.FormEvent) => {
    e.preventDefault();
    const amt = parseFloat(txAmount);
    if (isNaN(amt) || amt <= 0) return;

    const newTx: Transaction = {
      id: crypto.randomUUID(),
      type: txType,
      amount: amt,
      description: txDesc.trim() || (txType === 'sale' ? 'General Sale' : 'Business Expense'),
      timestamp: new Date().toLocaleDateString([], { month: 'short', day: 'numeric' }) + ' ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    saveTxData([newTx, ...transactions]);
    setTxAmount('');
    setTxDesc('');
    setIsTxModalOpen(false);
  };

  const handleAddDebt = (e: React.FormEvent) => {
    e.preventDefault();
    const amt = parseFloat(debtAmount);
    if (isNaN(amt) || amt <= 0 || !debtCustomer) return;

    const newDebt: Debt = {
      id: crypto.randomUUID(),
      customerName: debtCustomer.trim(),
      amount: amt,
      type: debtType,
      dueDate: debtDueDate || 'No deadline',
      status: 'pending',
      timestamp: new Date().toLocaleDateString([], { month: 'short', day: 'numeric' })
    };

    saveDebtData([newDebt, ...debts]);
    setDebtCustomer('');
    setDebtAmount('');
    setDebtDueDate('');
    setIsDebtModalOpen(false);
  };

  const toggleDebtStatus = (id: string) => {
    const updated = debts.map(d => {
      if (d.id === id) {
        const nextStatus = d.status === 'pending' ? 'settled' : 'pending';
        
        // Business Rules Trigger: If a receivable debt is settled, automatically log it as a cash influx sale!
        if (nextStatus === 'settled' && d.type === 'receivable') {
          const autoSale: Transaction = {
            id: crypto.randomUUID(),
            type: 'sale',
            amount: d.amount,
            description: `Paid Debt: ${d.customerName}`,
            timestamp: new Date().toLocaleDateString([], { month: 'short', day: 'numeric' }) + ' ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          };
          saveTxData([autoSale, ...transactions]);
        }
        return { ...d, status: nextStatus };
      }
      return d;
    });
    saveDebtData(updated);
  };

  return (
    <main className="min-h-screen bg-slate-950 text-slate-50 font-sans px-4 py-6 md:px-8 pb-24 relative">
      
      {/* HEADER SECTION */}
      <header className="max-w-md mx-auto mb-6 flex justify-between items-center border-b border-slate-900 pb-4">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-indigo-400">BizDaily</h1>
          <p className="text-xs text-slate-400">SME Monitor & Debt Ledger</p>
        </div>
        
        {/* Dynamic Business Score Badge */}
        <div className="text-right">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">Growth Score</span>
          <div className={`text-xl font-extrabold ${businessScore >= 70 ? 'text-emerald-400' : businessScore >= 45 ? 'text-amber-400' : 'text-rose-400'}`}>
            {businessScore}%
          </div>
        </div>
      </header>

      <div className="max-w-md mx-auto space-y-5">
        
        {/* --- NAVIGATION TABS --- */}
        <div className="grid grid-cols-3 gap-1 p-1 bg-slate-900 rounded-xl text-xs font-semibold">
          <button 
            onClick={() => setActiveTab('dashboard')} 
            className={`py-2 px-3 rounded-lg text-center transition ${activeTab === 'dashboard' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'}`}
          >
            Monitor
          </button>
          <button 
            onClick={() => setActiveTab('debts')} 
            className={`py-2 px-3 rounded-lg text-center transition ${activeTab === 'debts' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'}`}
          >
            Debts ({debts.filter(d => d.status === 'pending').length})
          </button>
          <button 
            onClick={() => setActiveTab('history')} 
            className={`py-2 px-3 rounded-lg text-center transition ${activeTab === 'history' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'}`}
          >
            Logs
          </button>
        </div>

        {/* ================= TAB 1: MONITOR (DASHBOARD) ================= */}
        {activeTab === 'dashboard' && (
          <div className="space-y-5">
            {/* KPI Metrics Dashboard Panel */}
            <section className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl shadow-sm">
                <span className="text-xs font-medium text-slate-400 block mb-1">Net Cashflow</span>
                <span className={`text-lg font-bold ${netRevenue >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                  ₦{netRevenue.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </span>
              </div>
              <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl shadow-sm">
                <span className="text-xs font-medium text-slate-400 block mb-1">People Owe Us</span>
                <span className="text-lg font-bold text-amber-400">₦{activeReceivables.toLocaleString()}</span>
              </div>
            </section>

            {/* Quick Action Matrix */}
            <div className="grid grid-cols-2 gap-3">
              <button 
                onClick={() => setIsTxModalOpen(true)}
                className="py-3 px-4 bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white font-medium rounded-xl text-xs transition flex items-center justify-center gap-1.5 shadow-sm"
              >
                <span>💸 Record Finance</span>
              </button>
              <button 
                onClick={() => setIsDebtModalOpen(true)}
                className="py-3 px-4 bg-slate-800 hover:bg-slate-750 active:bg-slate-800 text-slate-200 font-medium rounded-xl text-xs transition flex items-center justify-center gap-1.5 border border-slate-700/50"
              >
                <span>📋 Track New Debt</span>
              </button>
            </div>

            {/* Automated AI Diagnostic Assistant Module */}
            <section className="p-4 bg-gradient-to-br from-indigo-950/40 to-slate-900 border border-indigo-900/30 rounded-2xl space-y-2">
              <div className="flex items-center gap-1.5 text-indigo-400 font-bold text-xs uppercase tracking-wider">
                <span>💡</span>
                <h3>Automated Health Insight</h3>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                {businessScore >= 75 && "Excellent operation. Your cashflow velocity safely covers operational risks. Keep collections swift."}
                {businessScore >= 50 && businessScore < 75 && "Moderate state. Minimize ongoing credit terms for buyers to prevent sudden local capital bottlenecks."}
                {businessScore < 50 && "Risk Alert: Outstanding credit or operational overhead is dampening your metrics. Focus on collecting open receivables immediately."}
              </p>
            </section>
          </div>
        )}

        {/* ================= TAB 2: DEBT MANAGEMENT ================= */}
        {activeTab === 'debts' && (
          <section className="p-5 bg-slate-900 border border-slate-800 rounded-2xl space-y-4">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h2 className="text-sm font-semibold text-slate-200 uppercase tracking-wider">Active Book Debtors</h2>
              <span className="text-xs bg-slate-800 text-amber-400 font-semibold px-2 py-0.5 rounded-full">
                ₦{activeReceivables + activePayables}
              </span>
            </div>

            {debts.length === 0 ? (
              <p className="text-xs text-slate-500 text-center py-6">No debts currently registered.</p>
            ) : (
              <div className="space-y-2">
                {debts.map((d) => (
                  <div key={d.id} className={`p-3 rounded-xl border flex justify-between items-center ${d.status === 'settled' ? 'bg-slate-950/40 border-slate-900 opacity-55' : 'bg-slate-950 border-slate-800'}`}>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-slate-200">{d.customerName}</span>
                        <span className={`text-[9px] px-1.5 py-0.2 rounded font-bold uppercase ${d.type === 'receivable' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'}`}>
                          {d.type === 'receivable' ? 'Owes Us' : 'We Owe'}
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-500 mt-0.5">Due: {d.dueDate}</p>
                    </div>

                    <div className="text-right flex items-center gap-3">
                      <span className={`text-sm font-bold ${d.type === 'receivable' ? 'text-amber-400' : 'text-rose-400'} ${d.status === 'settled' ? 'line-through text-slate-600' : ''}`}>
                        ₦{d.amount.toLocaleString()}
                      </span>
                      <button 
                        onClick={() => toggleDebtStatus(d.id)}
                        className={`text-[10px] font-bold px-2 py-1 rounded-md transition ${d.status === 'settled' ? 'bg-slate-800 text-slate-400' : 'bg-indigo-600 hover:bg-indigo-500 text-white'}`}
                      >
                        {d.status === 'settled' ? 'Settled ✓' : 'Mark Clear'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}

        {/* ================= TAB 3: BUSINESS HISTORY LOGS ================= */}
        {activeTab === 'history' && (
          <section className="p-5 bg-slate-900 border border-slate-800 rounded-2xl space-y-4">
            <h2 className="text-sm font-semibold text-slate-200 uppercase tracking-wider border-b border-slate-800 pb-3">Financial Operations Ledger</h2>
            {transactions.length === 0 ? (
              <p className="text-xs text-slate-500 text-center py-6">No cashflow updates logged yet.</p>
            ) : (
              <div className="space-y-2 max-h-[400px] overflow-y-auto">
                {transactions.map((t) => (
                  <div key={t.id} className="p-3 bg-slate-950 border border-slate-800/60 rounded-xl flex justify-between items-center">
                    <div>
                      <p className="text-sm font-medium text-slate-200">{t.description}</p>
                      <span className="text-[9px] text-slate-500">{t.timestamp}</span>
                    </div>
                    <span className={`text-sm font-bold ${t.type === 'sale' ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {t.type === 'sale' ? '+' : '-'}₦{t.amount.toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}
      </div>

      {/* ================= MODAL 1: RECORD FINANCE ================= */}
      {isTxModalOpen && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <form onSubmit={handleAddTransaction} className="bg-slate-900 border border-slate-800 w-full max-w-md rounded-2xl p-6 space-y-4 shadow-xl">
            <div className="flex justify-between items-center border-b border-slate-800 pb-2">
              <h3 className="text-base font-bold text-slate-100">Record Transaction</h3>
              <button type="button" onClick={() => setIsTxModalOpen(false)} className="text-slate-400 hover:text-slate-200">✕</button>
            </div>
            
            <div className="grid grid-cols-2 gap-2 p-1 bg-slate-950 rounded-lg">
              <button type="button" onClick={() => setTxType('sale')} className={`py-1.5 text-xs font-bold rounded-md ${txType === 'sale' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'text-slate-400'}`}>Income / Sale</button>
              <button type="button" onClick={() => setTxType('expense')} className={`py-1.5 text-xs font-bold rounded-md ${txType === 'expense' ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' : 'text-slate-400'}`}>Expense</button>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase">Amount (₦)</label>
              <input type="number" required placeholder="0.00" value={txAmount} onChange={(e) => setTxAmount(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-indigo-500"/>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase">Description / Notes</label>
              <input type="text" placeholder="e.g. Sold Inventory, Office Rent" value={txDesc} onChange={(e) => setTxDesc(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-indigo-500"/>
            </div>

            <div className="flex gap-2 pt-2">
              <button type="button" onClick={() => setIsTxModalOpen(false)} className="flex-1 py-2.5 bg-slate-800 text-slate-300 rounded-xl text-xs font-semibold">Cancel</button>
              <button type="submit" className="flex-1 py-2.5 bg-indigo-600 text-white rounded-xl text-xs font-semibold">Save Entry</button>
            </div>
          </form>
        </div>
      )}

      {/* ================= MODAL 2: TRACK NEW DEBT ================= */}
      {isDebtModalOpen && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <form onSubmit={handleAddDebt} className="bg-slate-900 border border-slate-800 w-full max-w-md rounded-2xl p-6 space-y-4 shadow-xl">
            <div className="flex justify-between items-center border-b border-slate-800 pb-2">
              <h3 className="text-base font-bold text-slate-100">Log Outstanding Debt</h3>
              <button type="button" onClick={() => setIsDebtModalOpen(false)} className="text-slate-400 hover:text-slate-200">✕</button>
            </div>

            <div className="grid grid-cols-2 gap-2 p-1 bg-slate-950 rounded-lg">
              <button type="button" onClick={() => setDebtType('receivable')} className={`py-1.5 text-xs font-bold rounded-md ${debtType === 'receivable' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' : 'text-slate-400'}`}>Customer Owes Us</button>
              <button type="button" onClick={() => setDebtType('payable')} className={`py-1.5 text-xs font-bold rounded-md ${debtType === 'payable' ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' : 'text-slate-400'}`}>We Owe Supplier</button>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase">Contact / Entity Name</label>
              <input type="text" required placeholder="e.g. John Doe" value={debtCustomer} onChange={(e) => setDebtCustomer(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-indigo-500"/>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase">Principal Debt Amount (₦)</label>
              <input type="number" required placeholder="0.00" value={debtAmount} onChange={(e) => setDebtAmount(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-indigo-500"/>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase">Expected Settling Deadline</label>
              <input type="date" value={debtDueDate} onChange={(e) => setDebtDueDate(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm focus:outline-none text-slate-400"/>
            </div>

            <div className="flex gap-2 pt-2">
              <button type="button" onClick={() => setIsDebtModalOpen(false)} className="flex-1 py-2.5 bg-slate-800 text-slate-300 rounded-xl text-xs font-semibold">Cancel</button>
              <button type="submit" className="flex-1 py-2.5 bg-indigo-600 text-white rounded-xl text-xs font-semibold">Save Debt Ledger</button>
            </div>
          </form>
        </div>
      )}
    </main>
  );
}