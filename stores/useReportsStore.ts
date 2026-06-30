import create from "zustand";
import { persist } from "zustand/middleware";
import { BusinessReport } from "../types/domain";

interface ReportsState {
  reports: BusinessReport[];
  addReport: (r: BusinessReport) => void;
  setReports: (rs: BusinessReport[]) => void;
  getByDate: (dateIso: string) => BusinessReport | undefined;
  clear: () => void;
}

export const useReportsStore = create<ReportsState>()(
  persist(
    (set, get) => ({
      reports: [],
      addReport: (r: BusinessReport) => set((s) => ({ reports: [...s.reports, r] })),
      setReports: (rs: BusinessReport[]) => set(() => ({ reports: rs })),
      getByDate: (dateIso: string) => get().reports.find((r) => r.date === dateIso),
      clear: () => set(() => ({ reports: [] })),
    }),
    {
      name: "bizdaily_reports_v1",
      getStorage: () => localStorage,
    }
  )
);
