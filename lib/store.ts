"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { BusinessDay, Debtor, User } from "./types";
import { generateDemoBusinessDays, generateDemoDebtors } from "./demoData";
import { todayLocal } from "./date";
import {
  fetchBusinessDays,
  fetchDebtors,
  saveBusinessDay,
  insertDebtor as insertDebtorRow,
  updateDebtorStatus,
  deleteDebtorRow,
} from "./supabaseData";

interface BizDailyState {
  hasEnteredApp: boolean;
  isDemoMode: boolean;
  businessDays: BusinessDay[];
  debtors: Debtor[];

  user: User | null;
  isAuthenticated: boolean;

  isDataLoading: boolean;

  enterDemoMode: () => void;
  resetDemoData: () => void;
  loadUserData: (userId: string) => Promise<void>;
  clearUserData: () => void;

  recordToday: (sales: number, expenses: number) => void;
  addDebtor: (name: string, amount: number, dueDate?: string) => void;
  markDebtPaid: (id: string) => void;
  deleteDebtor: (id: string) => void;
}

export const useStore = create<BizDailyState>()(
  persist(
    (set, get) => ({
      hasEnteredApp: false,
      isDemoMode: false,
      businessDays: [],
      debtors: [],

      user: null,
      isAuthenticated: false,
      isDataLoading: false,

      enterDemoMode: () =>
        set({
          hasEnteredApp: true,
          isDemoMode: true,
          businessDays: generateDemoBusinessDays(),
          debtors: generateDemoDebtors(),
        }),

      resetDemoData: () =>
        set({
          businessDays: generateDemoBusinessDays(),
          debtors: generateDemoDebtors(),
        }),

      loadUserData: async (userId: string) => {
        set({ isDataLoading: true });
        const [businessDays, debtors] = await Promise.all([
          fetchBusinessDays(userId),
          fetchDebtors(userId),
        ]);
        set({ businessDays, debtors, isDataLoading: false });
      },

      clearUserData: () => set({ businessDays: [], debtors: [] }),

      recordToday: (sales, expenses) => {
        const date = todayLocal();
        const profit = sales - expenses;
        const day: BusinessDay = { date, sales, expenses, profit, recordedAt: new Date().toISOString() };
        const existing = get().businessDays.filter((d) => d.date !== date);
        set({ businessDays: [...existing, day] });

        const userId = get().user?.id;
        if (userId) saveBusinessDay(userId, day);
      },

      addDebtor: (name, amount, dueDate) => {
        const debtor: Debtor = {
          id: crypto.randomUUID(),
          name,
          amount,
          status: "outstanding",
          createdAt: new Date().toISOString(),
          dueDate: dueDate || undefined,
        };
        set({ debtors: [debtor, ...get().debtors] });

        const userId = get().user?.id;
        if (userId) insertDebtorRow(userId, debtor);
      },

      markDebtPaid: (id) => {
        const paidAt = new Date().toISOString();
        set({
          debtors: get().debtors.map((d) =>
            d.id === id ? { ...d, status: "paid", paidAt } : d
          ),
        });

        if (get().user?.id) updateDebtorStatus(id, "paid", paidAt);
      },

      deleteDebtor: (id) => {
        set({ debtors: get().debtors.filter((d) => d.id !== id) });
        if (get().user?.id) deleteDebtorRow(id);
      },
    }),
    { name: "bizdaily-storage" }
  )
);
