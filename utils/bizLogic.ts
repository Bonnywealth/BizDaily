import { BusinessReport, Debt, AIInsight } from "../types/domain";
import { todayIsoLocal, dayNameFromIso } from "./date";

export function computeProfit(sales: number, expenses: number): number {
  if (!Number.isFinite(sales) || !Number.isFinite(expenses)) return 0;
  return Math.round(sales - expenses);
}

/**
 * computeBusinessScore
 * Five equally weighted components (each 0-20):
 * - Profit Trend (last 3 days vs previous 3 days)
 * - Sales Consistency (low stddev => higher score)
 * - Expense Control (expenses decreasing -> higher score)
 * - Debt Recovery (paid proportion)
 * - Daily Reporting Consistency (reported days in last 7)
 */
export function computeBusinessScore(reports: BusinessReport[], debts: Debt[], refIso?: string): number {
  const refDate = refIso || todayIsoLocal();

  // Helper: get reports sorted by date ascending
  const sorted = reports.slice().sort((a, b) => (a.date < b.date ? -1 : 1));

  // Profit Trend
  const profits = sorted.map((r) => r.profit);
  const n = profits.length;
  let profitScore = 0;
  if (n >= 6) {
    const last3 = profits.slice(n - 3, n);
    const prev3 = profits.slice(n - 6, n - 3);
    const avgLast = average(last3);
    const avgPrev = average(prev3);
    if (avgPrev <= 0 && avgLast > 0) profitScore = 20;
    else if (avgPrev === 0 && avgLast === 0) profitScore = 10;
    else {
      const change = (avgLast - avgPrev) / (Math.abs(avgPrev) || 1);
      profitScore = clamp(Math.round((change + 1) * 10), 0, 20); // map change to 0-20 roughly
    }
  } else if (n > 0) {
    profitScore = 10; // neutral for small data
  }

  // Sales Consistency: lower coefficient of variation -> higher score
  let salesScore = 10;
  const sales = sorted.map((r) => r.sales);
  if (sales.length >= 3) {
    const cv = coeffVar(sales);
    // cv 0 -> 20, cv 1 -> 0
    salesScore = clamp(Math.round((1 - Math.min(cv, 1)) * 20), 0, 20);
  }

  // Expense Control: decreasing expenses over last 7 days
  let expenseScore = 10;
  const expenses = sorted.map((r) => r.expenses);
  if (expenses.length >= 3) {
    const last = average(expenses.slice(-3));
    const prev = average(expenses.slice(0, Math.max(0, expenses.length - 3)));
    if (prev === 0 && last === 0) expenseScore = 10;
    else {
      const change = prev === 0 ? 0 : (prev - last) / (Math.abs(prev) || 1); // positive if reduced
      expenseScore = clamp(Math.round((change + 1) * 10), 0, 20);
    }
  }

  // Debt Recovery: proportion of debts that have been marked Paid
  let debtScore = 10;
  if (debts.length > 0) {
    const paid = debts.filter((d) => d.status === "Paid").length;
    const ratio = paid / debts.length;
    debtScore = clamp(Math.round(ratio * 20), 0, 20);
  }

  // Daily Reporting Consistency: % of days reported in last 7 days
  let reportingScore = 10;
  const last7Start = subtractDays(refDate, 6);
  const reportedLast7 = sorted.filter((r) => r.date >= last7Start && r.date <= refDate).length;
  reportingScore = clamp(Math.round((reportedLast7 / 7) * 20), 0, 20);

  const total = profitScore + salesScore + expenseScore + debtScore + reportingScore;
  return clamp(Math.round(total), 0, 100);
}

// Helpers
function average(arr: number[]) {
  if (arr.length === 0) return 0;
  return arr.reduce((s, v) => s + v, 0) / arr.length;
}

function variance(arr: number[]) {
  const avg = average(arr);
  return average(arr.map((v) => (v - avg) * (v - avg)));
}

function stddev(arr: number[]) {
  return Math.sqrt(variance(arr));
}

function coeffVar(arr: number[]) {
  const avg = average(arr);
  if (avg === 0) return 0;
  return stddev(arr) / Math.abs(avg);
}

function clamp(v: number, lo: number, hi: number) {
  return Math.max(lo, Math.min(hi, v));
}

function subtractDays(iso: string, days: number) {
  const d = new Date(iso + "T00:00:00");
  d.setDate(d.getDate() - days);
  const tzoffset = d.getTimezoneOffset() * 60000;
  const local = new Date(d.getTime() - tzoffset);
  return local.toISOString().slice(0, 10);
}

/**
 * generateMissingBusinessDays
 * Returns virtual reports for dates between startIso and endIso (inclusive) that do not have a submitted report.
 */
export function generateMissingBusinessDays(reports: BusinessReport[], startIso: string, endIso: string): BusinessReport[] {
  const existing = new Set(reports.map((r) => r.date));
  const results: BusinessReport[] = [];
  const start = new Date(startIso + "T00:00:00");
  const end = new Date(endIso + "T00:00:00");
  for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
    const tzoffset = d.getTimezoneOffset() * 60000;
    const local = new Date(d.getTime() - tzoffset);
    const iso = local.toISOString().slice(0, 10);
    if (!existing.has(iso)) {
      results.push({
        id: `virtual-${iso}`,
        date: iso,
        day: dayNameFromIso(iso) as any,
        sales: 0,
        expenses: 0,
        profit: 0,
        status: "No Business Report Submitted",
        createdAt: new Date().toISOString(),
      });
    }
  }
  return results;
}

/**
 * generateInsight
 * Priority order (highest -> lowest):
 *  - Missing Business Report
 *  - Profit Trend
 *  - Expense Trend
 *  - Debt Recovery
 *  - Sales Trend
 * Returns a single AIInsight or null
 */
export function generateInsight(current: BusinessReport | null, recentReports: BusinessReport[], debts: Debt[]): AIInsight | null {
  // 1. Missing Business Report: check if yesterday (latest expected) is missing
  const today = todayIsoLocal();
  const latestExpectedDate = subtractDays(today, 1);
  const hasLatest = recentReports.some((r) => r.date === latestExpectedDate && r.status === "Submitted");
  if (!hasLatest) {
    return {
      id: `ins-missing-${latestExpectedDate}`,
      title: 'Missing Business Report',
      message: `No business report submitted for ${latestExpectedDate}. Encourage daily reporting to maintain accurate scores and insights.`,
      type: 'Warning',
      createdAt: new Date().toISOString(),
    } as AIInsight;
  }

  // Ensure we have enough data to compute trends
  const sorted = recentReports.slice().sort((a, b) => (a.date < b.date ? -1 : 1));
  const n = sorted.length;

  // 2. Profit Trend
  if (n >= 6) {
    const profits = sorted.map((r) => r.profit);
    const last3 = average(profits.slice(-3));
    const prev3 = average(profits.slice(-6, -3));
    const pct = prev3 === 0 ? 0 : ((last3 - prev3) / Math.abs(prev3)) * 100;
    if (pct >= 20) {
      return {
        id: `ins-profit-up-${Date.now()}`,
        title: 'Profit Improving',
        message: `Profit increased by ${Math.round(pct)}% compared to the previous period. Keep up the good work!`,
        type: 'Success',
        createdAt: new Date().toISOString(),
      } as AIInsight;
    } else if (pct <= -20) {
      return {
        id: `ins-profit-down-${Date.now()}`,
        title: 'Profit Decreasing',
        message: `Profit has decreased by ${Math.abs(Math.round(pct))}% compared to the previous period. Review expenses and pricing.`,
        type: 'Warning',
        createdAt: new Date().toISOString(),
      } as AIInsight;
    }
  }

  // 3. Expense Trend
  if (n >= 4) {
    const expenses = sorted.map((r) => r.expenses);
    const last = average(expenses.slice(-3));
    const prev = average(expenses.slice(-6, -3)) || 0;
    if (prev > 0) {
      const pct = ((last - prev) / prev) * 100;
      if (pct >= 15) {
        return {
          id: `ins-expense-up-${Date.now()}`,
          title: 'Expenses Rising',
          message: `Expenses have risen by ${Math.round(pct)}% compared to the earlier period. Consider cost reductions.`,
          type: 'Warning',
          createdAt: new Date().toISOString(),
        } as AIInsight;
      }
    }
  }

  // 4. Debt Recovery
  if (debts.length >= 1) {
    const outstanding = debts.filter((d) => d.status === "Outstanding").length;
    const paid = debts.filter((d) => d.status === "Paid").length;
    if (paid > 0 && outstanding === 0) {
      return {
        id: `ins-debt-recovered-${Date.now()}`,
        title: 'Debts Recovered',
        message: `All recorded debts have been recovered. Excellent collections performance.`,
        type: 'Success',
        createdAt: new Date().toISOString(),
      } as AIInsight;
    }
  }

  // 5. Sales Trend
  if (n >= 6) {
    const sales = sorted.map((r) => r.sales);
    const last3 = average(sales.slice(-3));
    const prev3 = average(sales.slice(-6, -3));
    const pct = prev3 === 0 ? 0 : ((last3 - prev3) / Math.abs(prev3)) * 100;
    if (pct >= 15) {
      return {
        id: `ins-sales-up-${Date.now()}`,
        title: 'Sales Increasing',
        message: `Sales are up ${Math.round(pct)}% compared to the previous period. Consider scaling operations.`,
        type: 'Information',
        createdAt: new Date().toISOString(),
      } as AIInsight;
    }
  }

  return null;
}
