import create from "zustand";
import { persist } from "zustand/middleware";
import { demoBusinessReports, demoDebts, demoInsights } from "../data/demo-data";
import { useReportsStore } from "./useReportsStore";
import { useDebtsStore } from "./useDebtsStore";
import { useInsightsStore } from "./useInsightsStore";

interface SettingsState {
  businessName: string;
  initialized: boolean; // whether demo seeding has been applied
  setBusinessName: (name: string) => void;
  setInitialized: (v: boolean) => void;
  resetDemoData: () => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      businessName: "Bonnywealth Enterprise",
      initialized: false,
      setBusinessName: (name: string) => set(() => ({ businessName: name })),
      setInitialized: (v: boolean) => set(() => ({ initialized: v })),
      resetDemoData: () => {
        // Overwrite all stores with demo data
        const setReports = useReportsStore.getState().setReports;
        const setDebts = useDebtsStore.getState().setDebts;
        const setInsights = useInsightsStore.getState().setInsights;

        setReports(demoBusinessReports);
        setDebts(demoDebts);
        setInsights(demoInsights);

        set(() => ({ initialized: true, businessName: "Bonnywealth Enterprise" }));
      },
    }),
    {
      name: "bizdaily_settings_v1",
      getStorage: () => localStorage,
    }
  )
);
