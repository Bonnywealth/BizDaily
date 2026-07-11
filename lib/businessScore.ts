import { BusinessDay, Debtor } from "./types";
import { daysAgo } from "./date";

function clamp(n: number, min = 0, max = 100) {
  return Math.max(min, Math.min(max, n));
}

function daysInRange(days: BusinessDay[], from: string, to: string): BusinessDay[] {
  return days.filter((d) => d.date >= from && d.date <= to).sort((a, b) => (a.date > b.date ? 1 : -1));
}

export interface ScoreBreakdown {
  total: number;
  profitTrend: number;
  salesConsistency: number;
  expenseControl: number;
  debtRecovery: number;
  reportingConsistency: number;
}

export function calculateBusinessScore(days: BusinessDay[], debtors: Debtor[]): ScoreBreakdown {
  const today = daysAgo(0);
  const last7Start = daysAgo(6);
  const prev7Start = daysAgo(13);
  const prev7End = daysAgo(7);
  const last14Start = daysAgo(13);

  const last7 = daysInRange(days, last7Start, today);
  const prev7 = daysInRange(days, prev7Start, prev7End);
  const last14 = daysInRange(days, last14Start, today);

  // 1. Profit trend: growth of average profit last7 vs prev7
  const avgProfit = (arr: BusinessDay[]) =>
    arr.length ? arr.reduce((s, d) => s + d.profit, 0) / arr.length : 0;
  const p1 = avgProfit(last7);
  const p0 = avgProfit(prev7);
  let profitTrend: number;
  if (p0 === 0 && p1 === 0) profitTrend = 50;
  else if (p0 <= 0) profitTrend = p1 > 0 ? 80 : 30;
  else profitTrend = clamp(50 + ((p1 - p0) / Math.abs(p0)) * 100);

  // 2. Sales consistency: lower coefficient of variation = higher score
  const salesVals = last14.map((d) => d.sales);
  let salesConsistency = 50;
  if (salesVals.length >= 2) {
    const mean = salesVals.reduce((a, b) => a + b, 0) / salesVals.length;
    const variance =
      salesVals.reduce((s, v) => s + Math.pow(v - mean, 2), 0) / salesVals.length;
    const cv = mean > 0 ? Math.sqrt(variance) / mean : 1;
    salesConsistency = clamp(100 - cv * 120);
  }

  // 3. Expense control: lower expense ratio = higher score
  const totalSales = last14.reduce((s, d) => s + d.sales, 0);
  const totalExpenses = last14.reduce((s, d) => s + d.expenses, 0);
  const ratio = totalSales > 0 ? totalExpenses / totalSales : 0.7;
  const expenseControl = clamp(100 - (ratio - 0.4) * 150);

  // 4. Debt recovery: paid vs total debt value
  const totalDebtValue = debtors.reduce((s, d) => s + d.amount, 0);
  const paidValue = debtors.filter((d) => d.status === "paid").reduce((s, d) => s + d.amount, 0);
  const debtRecovery = totalDebtValue > 0 ? clamp((paidValue / totalDebtValue) * 100) : 75;

  // 5. Reporting consistency: days reported out of last 14
  const reportingConsistency = clamp((last14.length / 14) * 100);

  const total =
    profitTrend * 0.2 +
    salesConsistency * 0.2 +
    expenseControl * 0.2 +
    debtRecovery * 0.2 +
    reportingConsistency * 0.2;

  return {
    total: Math.round(total),
    profitTrend: Math.round(profitTrend),
    salesConsistency: Math.round(salesConsistency),
    expenseControl: Math.round(expenseControl),
    debtRecovery: Math.round(debtRecovery),
    reportingConsistency: Math.round(reportingConsistency),
  };
}
