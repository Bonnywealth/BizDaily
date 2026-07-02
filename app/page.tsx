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
  type: 'receivable' | 'payable';
  dueDate: string;
  status: 'pending' | 'settled';
  timestamp: string;
}

export default function HomePage() {
  // --- AUTHENTICATION STATE ---
  const [user, setUser] = useState<{ email: string; businessName: string } | null>(null);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [emailInput, setEmailInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [businessNameInput, setBusinessNameInput] = useState('');

  // --- CORE APPLICATION STATE ---
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
    const activeSession = localStorage.getItem('bizdaily_session');
    if (activeSession) {
      const loggedInUser = JSON.parse(activeSession);
      setUser(loggedInUser);
      loadUserData(loggedInUser.email);
    }
  }, []);

  const loadUserData = (userEmail: string) => {
    const savedTx = localStorage.getItem(`bizdaily_tx_${userEmail}`);
    const savedDebts = localStorage.getItem(`bizdaily_debts_${userEmail}`);
    setTransactions(savedTx ? JSON.parse(savedTx) : []);
    setDebts(savedDebts ? JSON.parse(savedDebts) : []);
  };

  const saveTxData = (newTx: Transaction[]) => {
    if (!user) return;
    setTransactions(newTx);
    localStorage.setItem(`bizdaily_tx_${user.email}`, JSON.stringify(newTx));
  };

  const saveDebtData = (newDebts: Debt[]) => {
    if (!user) return;
    setDebts(newDebts);
    localStorage.setItem(`bizdaily_debts_${user.email}`, JSON.stringify(newDebts));
  };

  // --- AUTH HANDLERS ---
  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput || !passwordInput) return;

    if (authMode === 'signup') {
      if (!businessNameInput) return;
      const newUser = { email: emailInput.toLowerCase(), businessName: businessNameInput };
      localStorage.setItem(`user_cred_${newUser.email}`, JSON.stringify({ password: passwordInput, businessName: newUser.businessName }));
      localStorage.setItem('bizdaily_session', JSON.stringify(newUser));
      setUser(newUser);
      loadUserData(newUser.email);
    } else {
      const storedCreds = localStorage.getItem(`user_cred_${emailInput.toLowerCase()}`);
      if (!storedCreds) {
        alert("Account not found. Please sign up!");
        return;
      }
      const creds = JSON.parse(storedCreds);
      if (creds.password !== passwordInput) {
        alert("Incorrect password!");
        return;
      }
      const existingUser = { email: emailInput.toLowerCase(), businessName: creds.businessName };
      localStorage.setItem('bizdaily_session', JSON.stringify(existingUser));
      setUser(existingUser);
      loadUserData(existingUser.email);
    }
    setEmailInput('');
    setPasswordInput('');
    setBusinessNameInput('');
  };

  const handleLogout = () => {
    localStorage.removeItem('bizdaily_session');
    setUser(null);
    setTransactions([]);
    setDebts([]);
  };

  // --- NATIVE EXPORT ENGINE ---
  const exportToCSV = () => {
    if (transactions.length === 0) {
      alert("No logs available.");
      return;
    }
    let csvContent = "data:text/csv;charset=utf-8,Description,Type,Amount (NGN),Timestamp\n";
    transactions.forEach(t => {
      csvContent += `"${t.description.replace(/"/g, '""')}",${t.type},${t.amount},"${t.timestamp}"\n`;
    });
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `${user?.businessName || 'Business'}_Financial_Ledger.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const downloadPrintableReport = () => {
    window.print();
  };

  // --- METRICS & ADVANCED AI LOGIC ---
  const totalSales = transactions.filter(t => t.type === 'sale').reduce((sum, t) => sum + t.amount, 0);
  const totalExpenses = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
  const netRevenue = totalSales - totalExpenses;

  const activeReceivables = debts.filter(d => d.type === 'receivable' && d.status === 'pending').reduce((sum, d) => sum + d.amount, 0);
  const activePayables = debts.filter(d => d.type === 'payable' && d.status === 'pending').reduce((sum, d) => sum + d.amount, 0);

  const calculateBusinessScore = () => {
    if (totalSales === 0) return 50; 
    const debtToSalesRatio = activeReceivables / totalSales;
    const expenseToSalesRatio = totalExpenses / totalSales;
    
    let score = 75; 
    if (expenseToSalesRatio > 0.5) score -= 15;
    else if (expenseToSalesRatio < 0.2) score += 10;

    if (debtToSalesRatio > 0.4) score -= 20;
    else if (debtToSalesRatio > 0) score += 5;

    return Math.min(Math.max(score, 10), 100);
  };

  const businessScore = calculateBusinessScore();

  // Graph Layout Scaling Values
  const maxMetricValue = Math.max(totalSales, totalExpenses, activeReceivables, 1000);
  const getBarWidth = (value: number) => {
    return `${Math.max((value / maxMetricValue) * 100, 3)}%`;
  };

  const getAIDiagnosticInsights = () => {
    const insights = [];
    const expenseRatio = totalSales > 0 ? (totalExpenses / totalSales) : 0;
    const debtRatio = totalSales > 0 ? (activeReceivables / totalSales) : 0;

    if (totalSales === 0) {
      return ["System Ready: Log your first sale to activate your live Growth monitoring matrix."];
    }
    if (expenseRatio > 0.4) {
      insights.push("⚠️ High Overhead Warning: Your expenses consume over 40% of standard inflows.");
    } else {
      insights.push("⚡ Cash Efficiency: Overhead allocation is securely minimized.");
    }
    if (debtRatio > 0.3) {
      insights.push(`🚨 Credit Risk High: Outstanding debt equals ${(debtRatio * 100).toFixed(0)}% of sales.`);
    } else if (debtRatio > 0) {
      insights.push("✓ Safe Credit Margin: Open debtor risk profile falls within standard limits.");
    }
    if (netRevenue < 0) {
      insights.push("📉 Run Rate Crisis: You are trading on negative cash flow limits.");
    }
    return insights;
  };

  const aiInsights = getAIDiagnosticInsights();

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

  if (!user) {
    return (
      <main className="min-h-screen bg-slate-950 text-slate-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6 shadow-xl">
          <div className="text-center space-y-1">
            <h1 className="text-3xl font-black tracking-tight text-indigo-400">BizDaily</h1>
            <p className="text-xs text-slate-400">SME Growth Monitor & Debt Management</p>
          </div>
          <div className="grid grid-cols-2 gap-2 p-1 bg-slate-950 rounded-lg text-xs font-semibold">
            <button onClick={() => setAuthMode('login')} className={`py-2 px-3 rounded-md text-center transition ${authMode === 'login' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400'}`}>Sign In</button>
            <button onClick={() => setAuthMode('signup')} className={`py-2 px-3 rounded-md text-center transition ${authMode === 'signup' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400'}`}>Register Business</button>
          </div>
          <form onSubmit={handleAuth} className="space-y-4">
            {authMode === 'signup' && (
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase">Business Name</label>
                <input type="text" required placeholder="e.g. Bonafide Consulting" value={businessNameInput} onChange={(e) => setBusinessNameInput(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm focus:outline-none text-white focus:border-indigo-500" />
              </div>
            )}
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase">Email Address</label>
              <input type="email" required placeholder="name@business.com" value={emailInput} onChange={(e) => setEmailInput(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm focus:outline-none text-white focus:border-indigo-500" />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase">Password</label>
              <input type="password" required placeholder="••••••••" value={passwordInput} onChange={(e) => setPasswordInput(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm focus:outline-none text-white focus:border-indigo-500" />
            </div>
            <button type="submit" className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl text-xs transition uppercase tracking-wider mt-2">
              {authMode === 'login' ? 'Access Dashboard' : 'Create Secure Ledger'}
            </button>
          </form>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-950 text-slate-50 font-sans px-4 py-6 md:px-8 pb-24 relative print:bg-white print:text-black print:p-0">
      
      {/* HEADER SECTION */}
      <header className="max-w-md mx-auto mb-6 flex justify-between items-center border-b border-slate-900 pb-4 print:border-black">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-indigo-400 print:text-black">{user.businessName}</h1>
          <p className="text-[10px] text-slate-400 truncate max-w-[180px] print:text-gray-600">Active Session: {user.email}</p>
        </div>
        <div className="text-right flex items-center gap-3 print:hidden">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">Growth Score</span>
            <div className={`text-xl font-extrabold ${businessScore >= 70 ? 'text-emerald-400' : businessScore >= 45 ? 'text-amber-400' : 'text-rose-400'}`}>
              {businessScore}%
            </div>
          </div>
          <button onClick={handleLogout} className="text-xs bg-slate-900 hover:bg-slate-850 border border-slate-800 px-2 py-1 rounded-md text-slate-400">
            Logout
          </button>
        </div>
      </header>

      <div className="max-w-md mx-auto space-y-5">
        
        {/* NAVIGATION TABS */}
        <div className="grid grid-cols-3 gap-1 p-1 bg-slate-900 rounded-xl text-xs font-semibold print:hidden">
          <button onClick={() => setActiveTab('dashboard')} className={`py-2 px-3 rounded-lg text-center transition ${activeTab === 'dashboard' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'}`}>Monitor</button>
          <button onClick={() => setActiveTab('debts')} className={`py-2 px-3 rounded-lg text-center transition ${activeTab === 'debts' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'}`}>Debts ({debts.filter(d => d.status === 'pending').length})</button>
          <button onClick={() => setActiveTab('history')} className={`py-2 px-3 rounded-lg text-center transition ${activeTab === 'history' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'}`}>Logs</button>
        </div>

        {/* TAB 1: MONITOR, ANALYTICS GRAPH & DIAGNOSTICS */}
        {activeTab === 'dashboard' && (
          <div className="space-y-5">
            <section className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl shadow-sm">
                <span className="text-xs font-medium text-slate-400 block mb-1">Net Cashflow</span>
                <span className={`text-lg font-bold ${netRevenue >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                  ₦{netRevenue.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </span>
              </div>
              <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl shadow-sm">
                <span className="text-xs font-medium text-slate-400 block mb-1">Book Receivables</span>
                <span className="text-lg font-bold text-amber-400">₦{activeReceivables.toLocaleString()}</span>
              </div>
            </section>

            {/* NEW VISUAL ANALYTICS GRAPH CONTAINER */}
            <section className="p-5 bg-slate-900 border border-slate-800 rounded-2xl space-y-4">
              <h3 className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Live Volume Analytics</h3>
              <div className="space-y-3.5">
                {/* Bar 1: Total Inflow */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-medium">
                    <span className="text-slate-300">Total Inflow (Sales)</span>
                    <span className="text-emerald-400 font-bold">₦{totalSales.toLocaleString()}</span>
                  </div>
                  <div className="w-full bg-slate-950 h-3 rounded-full overflow-hidden">
                    <div className="bg-emerald-500 h-full rounded-full transition-all duration-500" style={{ width: getBarWidth(totalSales) }}></div>
                  </div>
                </div>

                {/* Bar 2: Outflow */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-medium">
                    <span className="text-slate-300">Total Outflow (Expenses)</span>
                    <span className="text-rose-400 font-bold">₦{totalExpenses.toLocaleString()}</span>
                  </div>
                  <div className="w-full bg-slate-950 h-3 rounded-full overflow-hidden">
                    <div className="bg-rose-500 h-full rounded-full transition-all duration-500" style={{ width: getBarWidth(totalExpenses) }}></div>
                  </div>
                </div>

                {/* Bar 3: Credit Risk Exposure */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-medium">
                    <span className="text-slate-300">Credit Risk (Receivables)</span>
                    <span className="text-amber-400 font-bold">₦{activeReceivables.toLocaleString()}</span>
                  </div>
                  <div className="w-full bg-slate-950 h-3 rounded-full overflow-hidden">
                    <div className="bg-amber-500 h-full rounded-full transition-all duration-500" style={{ width: getBarWidth(activeReceivables) }}></div>
                  </div>
                </div>
              </div>
            </section>

            <div className="grid grid-cols-2 gap-3 print:hidden">
              <button onClick={() => setIsTxModalOpen(true)} className="py-3 px-4 bg-indigo-600 hover:bg-indigo-500 text-white font-medium rounded-xl text-xs transition shadow-sm">
                <span>💸 Record Finance</span>
              </button>
              <button onClick={() => setIsDebtModalOpen(true)} className="py-3 px-4 bg-slate-800 hover:bg-slate-750 text-slate-200 font-medium rounded-xl text-xs transition border border-slate-700/50">
                <span>📋 Track New Debt</span>
              </button>
            </div>

            <section className="p-4 bg-gradient-to-br from-indigo-950/40 to-slate-900 border border-indigo-900/30 rounded-2xl space-y-3">
              <div className="flex items-center gap-1.5 text-indigo-400 font-bold text-xs uppercase tracking-wider">
                <span>⚡</span>
                <h3>BizDaily AI Diagnostic Insight Matrix</h3>
              </div>
              <div className="space-y-2">
                {aiInsights.map((insight, index) => (
                  <p key={index} className="text-xs text-slate-300 leading-relaxed border-l-2 border-indigo-500/40 pl-2">
                    {insight}
                  </p>
                ))}
              </div>
            </section>
          </div>
        )}

        {/* TAB 2: DEBT LEDGER */}
        {activeTab === 'debts' && (
          <section className="p-5 bg-slate-900 border border-slate-800 rounded-2xl space-y-4">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h2 className="text-sm font-semibold text-slate-200 uppercase tracking-wider">Active Book Debtors</h2>
              <button onClick={downloadPrintableReport} className="text-[11px] bg-slate-800 hover:bg-slate-700 px-2.5 py-1 rounded-md text-indigo-400 font-medium print:hidden">
                🖨️ Print Statement (PDF)
              </button>
            </div>
            {debts.length === 0 ? (
              <p className="text-xs text-slate-500 text-center py-6">No debts currently registered.</p>
            ) : (
              <div className="space-y-2">
                {debts.map((d) => (
                  <div key={d.id} className={`p-3 rounded-xl border flex justify-between items-center bg-slate-950 border-slate-800`}>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-slate-200">{d.customerName}</span>
                        <span className="text-[9px] px-1.5 py-0.2 rounded font-bold uppercase bg-slate-800 text-slate-400">
                          {d.type === 'receivable' ? 'Owes Us' : 'We Owe'}
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-500 mt-0.5">Due: {d.dueDate}</p>
                    </div>
                    <div className="text-right flex items-center gap-3">
                      <span className="text-sm font-bold text-amber-400">₦{d.amount.toLocaleString()}</span>
                      <button onClick={() => toggleDebtStatus(d.id)} className="text-[10px] font-bold px-2 py-1 rounded-md bg-indigo-600 text-white print:hidden">
                        {d.status === 'settled' ? 'Settled ✓' : 'Clear'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}

        {/* TAB 3: LEDGER HISTORIES */}
        {activeTab === 'history' && (
          <section className="p-5 bg-slate-900 border border-slate-800 rounded-2xl space-y-4">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h2 className="text-sm font-semibold text-slate-200 uppercase tracking-wider">Financial Ledger</h2>
              <div className="flex gap-2 print:hidden">
                <button onClick={exportToCSV} className="text-[11px] bg-indigo-900/40 text-indigo-300 hover:bg-indigo-900/60 px-2.5 py-1 rounded-md font-medium border border-indigo-500/20">
                  📊 Excel (.CSV)
                </button>
                <button onClick={downloadPrintableReport} className="text-[11px] bg-slate-800 text-slate-300 hover:bg-slate-700 px-2.5 py-1 rounded-md font-medium">
                  🖨️ PDF
                </button>
              </div>
            </div>
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

      {/* MODAL 1: FINANCES */}
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
              <input type="number" required placeholder="0.00" value={txAmount} onChange={(e) => setTxAmount(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm focus:outline-none text-white"/>
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase">Description / Notes</label>
              <input type="text" placeholder="e.g. Inventory, Rent" value={txDesc} onChange={(e) => setTxDesc(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm focus:outline-none text-white"/>
            </div>
            <div className="flex gap-2 pt-2">
              <button type="button" onClick={() => setIsTxModalOpen(false)} className="flex-1 py-2.5 bg-slate-800 text-slate-300 rounded-xl text-xs font-semibold">Cancel</button>
              <button type="submit" className="flex-1 py-2.5 bg-indigo-600 text-white rounded-xl text-xs font-semibold">Save Entry</button>
            </div>
          </form>
        </div>
      )}

      {/* MODAL 2: DEBTS */}
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
              <label className="text-[10px] font-bold text-slate-400 uppercase">Contact Name</label>
              <input type="text" required placeholder="e.g. John Doe" value={debtCustomer} onChange={(e) => setDebtCustomer(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm focus:outline-none text-white"/>
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase">Principal Debt Amount (₦)</label>
              <input type="number" required placeholder="0.00" value={debtAmount} onChange={(e) => setDebtAmount(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm focus:outline-none text-white"/>
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