"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useStore } from "@/lib/store";
import BottomNav from "@/components/BottomNav";
import VoiceRecordButton from "@/components/VoiceRecordButton";
import { todayLocal, dateLabel, formatMoney } from "@/lib/date";
import { ArrowLeft, Check } from "lucide-react";

export default function RecordPage() {
  const router = useRouter();
  const { hasEnteredApp, businessDays, recordToday } = useStore();
  const [mounted, setMounted] = useState(false);
  const [sales, setSales] = useState("");
  const [expenses, setExpenses] = useState("");
  const [saved, setSaved] = useState(false);

  const today = todayLocal();
  const existing = businessDays.find((d) => d.date === today);

  useEffect(() => {
    setMounted(true);
    if (!hasEnteredApp) router.replace("/");
    if (existing) {
      setSales(String(existing.sales));
      setExpenses(String(existing.expenses));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasEnteredApp]);

  if (!mounted) return null;

  const salesNum = parseFloat(sales) || 0;
  const expensesNum = parseFloat(expenses) || 0;
  const profit = salesNum - expensesNum;

  const handleSave = () => {
    recordToday(salesNum, expensesNum);
    setSaved(true);
    setTimeout(() => router.push("/dashboard"), 700);
  };

  return (
    <>
      <main className="flex-1 px-5 pt-6 pb-6">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-1 text-slate-muted text-[13px] font-medium"
        >
          <ArrowLeft size={16} /> Back
        </button>

        <h1 className="font-display text-xl font-semibold text-ink mt-3">
          Record today's business
        </h1>
        <p className="text-[13px] text-slate-muted mt-1">{dateLabel(today)}</p>

        <div className="mt-6 bg-card border border-slate-line rounded-xl2 py-5">
          <VoiceRecordButton
            onResult={(sales, expenses) => {
              if (sales !== null) setSales(String(sales));
              if (expenses !== null) setExpenses(String(expenses));
            }}
          />
        </div>

        <div className="mt-5 flex items-center gap-3">
          <div className="h-px flex-1 bg-slate-line" />
          <span className="text-[11px] font-semibold text-slate-muted uppercase">or type it</span>
          <div className="h-px flex-1 bg-slate-line" />
        </div>

        <div className="mt-5 flex flex-col gap-4">
          <Field
            label="Total Sales"
            value={sales}
            onChange={setSales}
            placeholder="0"
            autoFocus
          />
          <Field label="Total Expenses" value={expenses} onChange={setExpenses} placeholder="0" />
        </div>

        <div className="mt-5 bg-card rounded-xl2 border border-slate-line/60 px-4 py-4 flex items-center justify-between">
          <span className="text-[13px] font-medium text-slate-muted">Profit (auto-calculated)</span>
          <span
            className={`font-mono text-lg font-semibold tabular-nums ${
              profit >= 0 ? "text-emerald" : "text-rust"
            }`}
          >
            {formatMoney(profit)}
          </span>
        </div>

        <button
          onClick={handleSave}
          disabled={!sales && !expenses}
          className="mt-6 w-full flex items-center justify-center gap-2 bg-ink text-white font-semibold rounded-xl2 py-3.5 text-[15px] active:scale-[0.98] transition-transform disabled:opacity-40"
        >
          {saved ? (
            <>
              <Check size={18} /> Saved
            </>
          ) : (
            "Save today's report"
          )}
        </button>
        <p className="text-center text-[12px] text-slate-muted mt-3">
          Saved automatically to {dateLabel(today)} — your device's local time.
        </p>
      </main>
      <BottomNav />
    </>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  autoFocus,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  autoFocus?: boolean;
}) {
  return (
    <label className="block">
      <span className="text-[13px] font-semibold text-ink">{label}</span>
      <div className="mt-1.5 flex items-center bg-card border border-slate-line rounded-xl2 px-4 focus-within:border-emerald">
        <span className="text-slate-muted font-mono text-[15px] mr-1">₦</span>
        <input
          type="number"
          inputMode="decimal"
          min={0}
          autoFocus={autoFocus}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="flex-1 bg-transparent py-3.5 font-mono text-[16px] outline-none placeholder:text-slate-muted/50"
        />
      </div>
    </label>
  );
}
