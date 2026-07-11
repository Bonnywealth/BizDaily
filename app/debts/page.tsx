"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useStore } from "@/lib/store";
import BottomNav from "@/components/BottomNav";
import { formatMoney, dateLabel, todayLocal } from "@/lib/date";
import { buildReminderMessage, whatsappReminderLink } from "@/lib/reminder";
import { Plus, X, CheckCircle2, MessageCircle, CalendarClock } from "lucide-react";
import clsx from "clsx";

export default function DebtsPage() {
  const router = useRouter();
  const { hasEnteredApp, isDemoMode, user, debtors, addDebtor, markDebtPaid } = useStore();
  const [mounted, setMounted] = useState(false);
  const [tab, setTab] = useState<"outstanding" | "paid">("outstanding");
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [dueDate, setDueDate] = useState("");

  useEffect(() => {
    setMounted(true);
    if (!hasEnteredApp) router.replace("/");
  }, [hasEnteredApp, router]);

  if (!mounted) return null;

  const businessName = user?.username || (isDemoMode ? "our store" : "our store");
  const list = debtors.filter((d) => d.status === tab);
  const totalOutstanding = debtors
    .filter((d) => d.status === "outstanding")
    .reduce((s, d) => s + d.amount, 0);

  const handleAdd = () => {
    const amt = parseFloat(amount);
    if (!name.trim() || !amt || amt <= 0) return;
    addDebtor(name.trim(), amt, dueDate || undefined);
    setName("");
    setAmount("");
    setDueDate("");
    setShowForm(false);
    setTab("outstanding");
  };

  return (
    <>
      <main className="flex-1 px-5 pt-6 pb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-display text-xl font-semibold text-ink">Debts</h1>
            <p className="text-[13px] text-slate-muted mt-0.5">
              {formatMoney(totalOutstanding)} still outstanding
            </p>
          </div>
          <button
            onClick={() => setShowForm((v) => !v)}
            className="w-10 h-10 rounded-full bg-ink text-white flex items-center justify-center active:scale-95 transition-transform"
          >
            {showForm ? <X size={18} /> : <Plus size={20} />}
          </button>
        </div>

        {showForm && (
          <div className="mt-4 bg-card border border-slate-line rounded-xl2 p-4 flex flex-col gap-3">
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Customer name"
              className="bg-paper border border-slate-line rounded-xl px-3.5 py-3 text-[14px] outline-none focus:border-emerald"
            />
            <div className="flex items-center bg-paper border border-slate-line rounded-xl px-3.5 focus-within:border-emerald">
              <span className="text-slate-muted font-mono text-[14px] mr-1">₦</span>
              <input
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                type="number"
                inputMode="decimal"
                placeholder="Amount owed"
                className="flex-1 bg-transparent py-3 font-mono text-[14px] outline-none"
              />
            </div>
            <label className="block">
              <span className="text-[11.5px] font-semibold text-slate-muted">
                Expected payment date (optional)
              </span>
              <input
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                type="date"
                min={todayLocal()}
                className="mt-1 w-full bg-paper border border-slate-line rounded-xl px-3.5 py-3 text-[14px] outline-none focus:border-emerald"
              />
            </label>
            <button
              onClick={handleAdd}
              className="bg-ink text-white font-semibold rounded-xl py-3 text-[14px] active:scale-[0.98] transition-transform"
            >
              Add debtor
            </button>
          </div>
        )}

        <div className="mt-5 flex gap-2 bg-paper border border-slate-line rounded-full p-1 w-fit">
          <TabButton active={tab === "outstanding"} onClick={() => setTab("outstanding")}>
            Outstanding
          </TabButton>
          <TabButton active={tab === "paid"} onClick={() => setTab("paid")}>
            Paid
          </TabButton>
        </div>

        <div className="mt-4 flex flex-col gap-2.5">
          {list.length === 0 && (
            <p className="text-center text-[13px] text-slate-muted py-10">
              {tab === "outstanding" ? "No outstanding debts." : "No paid debts yet."}
            </p>
          )}
          {list.map((d) => {
            const message = buildReminderMessage(d.name, d.amount, businessName, d.dueDate);
            const overdue = d.dueDate && d.dueDate < todayLocal();
            return (
              <div
                key={d.id}
                className="bg-card border border-slate-line/60 rounded-xl2 px-4 py-3.5"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-[14.5px] text-ink">{d.name}</p>
                    <p className="font-mono text-[13px] text-slate-muted mt-0.5">
                      {formatMoney(d.amount)}
                    </p>
                    {d.dueDate && (
                      <p
                        className={clsx(
                          "text-[11px] font-medium mt-1 flex items-center gap-1",
                          overdue ? "text-rust" : "text-slate-muted"
                        )}
                      >
                        <CalendarClock size={11} />
                        {overdue ? "Was due" : "Due"} {dateLabel(d.dueDate)}
                      </p>
                    )}
                  </div>
                  {d.status === "outstanding" ? (
                    <button
                      onClick={() => markDebtPaid(d.id)}
                      className="flex items-center gap-1 text-[12px] font-semibold text-emerald bg-emerald-soft px-3 py-1.5 rounded-full active:scale-95 transition-transform shrink-0"
                    >
                      <CheckCircle2 size={14} /> Mark paid
                    </button>
                  ) : (
                    <span className="text-[11px] font-semibold text-emerald shrink-0">Paid</span>
                  )}
                </div>
                {d.status === "outstanding" && (
                  <a
                    href={whatsappReminderLink(message)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-3 flex items-center justify-center gap-1.5 text-[12px] font-semibold text-royal bg-royal-soft py-2.5 rounded-xl active:scale-[0.98] transition-transform"
                  >
                    <MessageCircle size={14} /> Send follow-up on WhatsApp
                  </a>
                )}
              </div>
            );
          })}
        </div>
      </main>
      <BottomNav />
    </>
  );
}

function TabButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={clsx(
        "px-4 py-1.5 rounded-full text-[13px] font-semibold transition-colors",
        active ? "bg-ink text-white" : "text-slate-muted"
      )}
    >
      {children}
    </button>
  );
}
