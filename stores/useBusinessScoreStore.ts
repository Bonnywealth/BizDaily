import create from "zustand";
import { persist } from "zustand/middleware";
import { BusinessScoreFactors } from "../types/domain";

interface ScoreState {
  score: number;
  factors: BusinessScoreFactors | null;
  setScore: (score: number, factors?: BusinessScoreFactors | null) => void;
  clear: () => void;
}

export const useBusinessScoreStore = create<ScoreState>()(
  persist(
    (set) => ({
      score: 0,
      factors: null,
      setScore: (score: number, factors: BusinessScoreFactors | null = null) => set(() => ({ score, factors })),
      clear: () => set(() => ({ score: 0, factors: null })),
    }),
    {
      name: "bizdaily_score_v1",
      getStorage: () => localStorage,
    }
  )
);
