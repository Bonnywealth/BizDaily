import { BusinessReport, Debt, BusinessScoreFactors, AIInsight } from "../types/domain";
import { todayIsoLocal, dayNameFromIso } from "./date";

export function computeProfit(sales: number, expenses: number): number {
  return Number(Number(sales - expenses) || 0);
}

// Helper: get reports within range (inclusive)
function reportsInRange(reports: BusinessReport[], startIso: string, endIso: string) {
  const start = new Date(startIso + "T00:00:00");
  const end = new Date(endIso + "T23:59:59");
  return reports.filter((r) => {
    const d = new Date(r.date + "T00:00:00");
    return d >= start && d <= end && r.status === "Submitted";
  });
}

function isoDaysAgo(days: number, refIso?: string) {
  const base = refIso ? new Date(refIso + "T00:00:00") : new Date();
  const d = new Date(base);
  d.setDate(d.getDate() - days);
  const tzoffset = d.getTimezoneOffset() * 60000;
  const local = new Date(d.getTime() - tzoffset);
  return local.toISOString().slice(0, 10);
}

// Compute simple statistical helpers
function mean(values: number[]) {
  if (values.length === 0) return 0;
  return values.reduce((a, b) => a + b, 0) / values.length;
}

function stddev(values: number[]) {
  if (values.length === 0) return 0;
  const m = mean(values);
  const variance = mean(values.map((v) => (v - m) * (v - m)));
  return Math.sqrt(variance);
}

/**
 * computeBusinessScore
 *  - Five equally weighted factors (0..20 each):
 *    - Profit Trend (20%): based on percent change between last 7 days and prior 7 days
 *    - Sales Consistency (20%): based on stddev/mean of sales over last 14 days (more consistent -> higher)
 *    - Expense Control (20%): based on average expense ratio (lower expense ratio -> higher)
 *    - Debt Recovery (20%): based on percentage reduction in outstanding debt over window
 *    - Reporting Consistency (20%): percent of days reported over last 7 days
 */
export function computeBusinessScore(reports: BusinessReport[], debts: Debt[], refIso?: string): number {
  const todayIso = refIso || todayIsoLocal();
  const end = todayIso;
  const startRecent = isoDaysAgo(6, end); // last 7 days
  const startPrev = isoDaysAgo(13, end); // previous 7 days (days 8-14 ago)
  const start14 = isoDaysAgo(13, end); // last 14 days range start

  const recent = reportsInRange(reports, startRecent, end);
  const prev = reportsInRange(reports, startPrev, isoDaysAgo(7, end));
  const last14 = reportsInRange(reports, start14, end);

  // Profit Trend (0..20)
  const recentProfit = mean(recent.map((r) => r.profit));
  const prevProfit = mean(prev.map((r) => r.profit));
  let profitTrendScore = 10; // baseline
  if (prevProfit === 0) {
    profitTrendScore = recentProfit > 0 ? 20 : recentProfit === 0 ? 10 : 0;
  } else {
    const pct = (recentProfit - prevProfit) / Math.abs(prevProfit); // -inf..inf
    // map -100%..+100% to 0..20, cap
    const capped = Math.max(-1, Math.min(1, pct));
    profitTrendScore = Math.round(((capped + 1) / 2) * 20); // -1->0, 0->10, 1->20
  }

  // Sales Consistency (0..20) - lower volatility relative to mean is better
  const salesVals = last14.map((r) => r.sales);
  const salesStd = stddev(salesVals);
  const salesMean = mean(salesVals);
  let salesConsistencyScore = 10;
  if (salesMean === 0) {
    salesConsistencyScore = salesVals.length > 0 ? 10 : 0;
  } else {
    const ratio = salesStd / salesMean; // 0..inf, lower is better
    // map ratio 0 -> 20, ratio 1 -> 0, cap at ratio 1
    const capped = Math.max(0, Math.min(1, ratio));
    salesConsistencyScore = Math.round((1 - capped) * 20);
  }

  // Expense Control (0..20) - lower expense-to-sales ratio is better
  const expenseRatios = last14
    .map((r) => (r.sales === 0 ? 0 : r.expenses / r.sales))
    .filter((v) => Number.isFinite(v));
  const avgExpenseRatio = mean(expenseRatios);
  // map ratio 0 -> 20, ratio 1 -> 0, cap at 1
  const expenseControlScore = Math.round(Math.max(0, Math.min(1, 1 - avgExpenseRatio)) * 20);

  // Debt Recovery (0..20) - based on reduction in outstanding debt comparing start and end of window (14 days)
  const windowStartIso = isoDaysAgo(13, end);
  const windowEndIso = end;
  // compute outstanding at window start and end
  const debtsAtStart = debts.filter((d) => new Date(d.dateRecorded + "T00:00:00") <= new Date(windowStartIso + "T23:59:59"));
  const totalStart = debtsAtStart.filter((d) => d.status === "Outstanding").reduce((s, d) => s + d.amount, 0);
  const totalEnd = debts.filter((d) => d.status === "Outstanding").reduce((s, d) => s + d.amount, 0);
  let debtRecoveryScore = 10;
  if (totalStart === 0) {
    debtRecoveryScore = totalEnd === 0 ? 20 : 10; // if no debt at start and none now -> 20, else baseline 10
  } else {
    const reduction = Math.max(-1, Math.min(1, (totalStart - totalEnd) / totalStart)); // -1..1
    debtRecoveryScore = Math.round(((reduction + 1) / 2) * 20); // reduction 1 -> 20, 0 ->10, -1->0
  }

  // Reporting Consistency (0..20) - percent of days reported in last 7 days
  const daysReported = new Set(recent.map((r) => r.date)).size;
  const reportingConsistencyScore = Math.round((daysReported / 7) * 20);

  const factors: BusinessScoreFactors = {
    profitTrend: profitTrendScore,
    salesConsistency: salesConsistencyScore,
    expenseControl: expenseControlScore,
    debtRecovery: debtRecoveryScore,
    reportingConsistency: reportingConsistencyScore,
  };

  const total = Math.round(
    (factors.profitTrend + factors.salesConsistency + factors.expenseControl + factors.debtRecovery + factors.reportingConsistency) / 5
  );

  // total is 0..20 average; scale to 0..100
  const score = Math.round((total / 20) * 100);
  return score;
}

/**
 * generateInsight - simple rule-based insight generation per PRD.
 * Priority order (single insight):
 *  1. Missed reports
 *  2. Large expense increase
 *  3. Profit increase
 *  4. Debt reduced
 */
export function generateInsight(
  todayReport: BusinessReport | null,
  recentReports: BusinessReport[],
  debts: Debt[]
): AIInsight | null {
  // Check missed reports in last 7 days
  const todayIso = todayIsoLocal();
  const last7Start = isoDaysAgo(6, todayIso);
  const expectedDays = 7;
  const reportedDays = new Set(recentReports.map((r) => r.date)).size;
  if (reportedDays < expectedDays) {
    const missing = expectedDays - reportedDays;
    return {
      id: `insight-missed-${Date.now()}`,
      title: missing === 1 ? "You missed one business report this week" : `You missed ${missing} business reports this week`,
      message: "Consistent daily reporting helps maintain accurate insights. Please submit missing days.",
      type: "Warning",
      generatedAt: new Date().toISOString(),
    };
  }

  // Expenses increased: compare average expenses of last 7 days vs previous 7
  const recent = reportsInRange(recentReports, last7Start, todayIso);
  // For expense comparison we need previous week data as well - caller should provide
  // Here we'll do a simple heuristic: if latest report expenses > average previous (if exists)
  if (recent.length > 1) {
    const latest = recent[recent.length - 1];
    const prevAvg = mean(recent.slice(0, -1).map((r) => r.expenses));
    if (prevAvg > 0 && latest.expenses > prevAvg * 1.1) {
      return {
        id: `insight-expense-${Date.now()}`,
        title: "Expenses increased compared to last week",
        message: "Your recent expenses are higher than the average of the previous days. Monitor spending carefully.",
        type: "Warning",
        generatedAt: new Date().toISOString(),
      };
    }
  }

  // Profit increased
  if (recentReports.length >= 2) {
    const last = recentReports[recentReports.length - 1];
    const prev = recentReports[recentReports.length - 2];
    if (last.profit > prev.profit) {
      return {
        id: `insight-profit-${Date.now()}`,
        title: "Profit increased",
        message: "Your profit increased compared to the previous day/week.",
        type: "Success",
        generatedAt: new Date().toISOString(),
      };
    }
  }

  // Debt reduced
  const outstanding = debts.filter((d) => d.status === "Outstanding").reduce((s, d) => s + d.amount, 0);
  // A simple heuristic: if any recent debt was paid (has paidAt), show debt reduced
  const anyPaid = debts.some((d) => d.paidAt);
  if (anyPaid) {
    return {
      id: `insight-debt-${Date.now()}`,
      title: "Outstanding debts reduced",
      message: "Good job — outstanding debt has reduced this week.",
      type: "Success",
      generatedAt: new Date().toISOString(),
    };
  }

  return null;
}

/**
 * generateMissingBusinessDays
 * Given a start and end ISO date and existing reports, returns virtual reports for missing days
 * with status "No Business Report Submitted" and sales/expenses/profit set to 0.
 */
export function generateMissingBusinessDays(reports: BusinessReport[], startIso: string, endIso: string): BusinessReport[] {
  const out: BusinessReport[] = [];
  const start = new Date(startIso + "T00:00:00");
  const end = new Date(endIso + "T00:00:00");
  for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
    const tzoffset = d.getTimezoneOffset() * 60000;
    const local = new Date(d.getTime() - tzoffset);
    const iso = local.toISOString().slice(0, 10);
    const exists = reports.find((r) => r.date === iso && r.status === "Submitted");
    if (!exists) {
      out.push({
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
  return out;
}
