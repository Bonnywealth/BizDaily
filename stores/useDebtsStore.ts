import create from "zustand";
import { persist } from "zustand/middleware";
import { Debt } from "../types/domain";

interface DebtsState {
  debts: Debt[];
  addDebt: (d: Debt) => void;
  setDebts: (ds: Debt[]) => void;
  markPaid: (id: string, paidAt?: string) => void;
  outstandingTotal: () => number;
  clear: () => void;
}

export const useDebtsStore = create<DebtsState>()(
  persist(
    (set, get) => ({
      debts: [],
      addDebt: (d: Debt) => set((s) => ({ debts: [...s.debts, d] })),
      setDebts: (ds: Debt[]) => set(() => ({ debts: ds })),
      markPaid: (id: string, paidAt?: string) =>
        set((s) => ({ debts: s.debts.map((db) => (db.id === id ? { ...db, status: "Paid", paidAt: paidAt ?? new Date().toISOString() } : db)) })),
      outstandingTotal: () => get().debts.filter((d) => d.status === "Outstanding").reduce((sum, d) => sum + d.amount, 0),
      clear: () => set(() => ({ debts: [] })),
    }),
    {
      name: "bizdaily_debts_v1",
      getStorage: () => localStorage,
    }
  )
);
