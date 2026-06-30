import create from "zustand";
import { persist } from "zustand/middleware";
import { AIInsight } from "../types/domain";

interface InsightsState {
  insights: AIInsight[];
  addInsight: (i: AIInsight) => void;
  setInsights: (is: AIInsight[]) => void;
  clear: () => void;
}

export const useInsightsStore = create<InsightsState>()(
  persist(
    (set) => ({
      insights: [],
      addInsight: (i: AIInsight) => set((s) => ({ insights: [...s.insights, i] })),
      setInsights: (is: AIInsight[]) => set(() => ({ insights: is })),
      clear: () => set(() => ({ insights: [] })),
    }),
    {
      name: "bizdaily_insights_v1",
      getStorage: () => localStorage,
    }
  )
);
