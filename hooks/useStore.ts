import { demoBusinessReports, demoDebts, demoInsights } from "../data/demo-data";
import { useReportsStore } from "../stores/useReportsStore";
import { useDebtsStore } from "../stores/useDebtsStore";
import { useInsightsStore } from "../stores/useInsightsStore";

/**
 * hooks/useStore.ts
 * Convenience exports to access all stores from components if desired.
 */

export function useAppSeed() {
  const setReports = useReportsStore((s) => s.setReports);
  const setDebts = useDebtsStore((s) => s.setDebts);
  const setInsights = useInsightsStore((s) => s.setInsights);

  function seedDemo() {
    setReports(demoBusinessReports);
    setDebts(demoDebts);
    setInsights(demoInsights);
  }

  return { seedDemo };
}
