import { BusinessReport, Debt, AIInsight } from "../types/domain";

/**
 * Pure function stubs for core business logic.
 *
 * Implementations are intentionally left as placeholders for the next phase.
 */

export function computeProfit(sales: number, expenses: number): number {
  return Number((sales - expenses) || 0);
}

export function computeBusinessScore(reports: BusinessReport[], debts: Debt[]): number {
  // PRD: five equally weighted factors.
  // Return placeholder 0..100
  return 0;
}

export function generateInsight(
  todayReport: BusinessReport | null,
  recentReports: BusinessReport[],
  debts: Debt[]
): AIInsight | null {
  // Return a single AIInsight according to MVP rules (stub)
  return null;
}

export function getLatestExpectedReport(reports: BusinessReport[], todayIso?: string): BusinessReport | null {
  // Decide what "latest expected report" means and return it (stub)
  return null;
}
