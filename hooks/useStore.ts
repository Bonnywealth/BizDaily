/**
 * Placeholder hook for application store.
 * We'll use Zustand (recommended) with persist in the next phase.
 *
 * For now, export an object with the function shapes expected by components.
 */

import { BusinessReport, Debt, AIInsight } from "../types/domain";

export function useAppStore() {
  // placeholder API surface
  return {
    reports: [] as BusinessReport[],
    debts: [] as Debt[],
    insights: [] as AIInsight[],
    addReport: (r: BusinessReport) => {},
    addDebt: (d: Debt) => {},
    markDebtPaid: (id: string, paidAt?: string) => {},
    seedDemoData: (data: { reports: BusinessReport[]; debts: Debt[]; insights: AIInsight[] }) => {},
  };
}
