import { BusinessDay, Debtor, AIInsight } from "./types";
import { daysAgo, dateLabel } from "./date";

export function getAIInsight(days: BusinessDay[], debtors: Debtor[]): AIInsight {
  const today = daysAgo(0);
  const yesterday = daysAgo(1);
  const sorted = [...days].sort((a, b) => (a.date > b.date ? 1 : -1));
  const map = new Map(sorted.map((d) => [d.date, d]));

  // Priority 1: Missing report (yesterday not recorded, and business has history)
  if (sorted.length > 0 && !map.has(yesterday)) {
    return {
      type: "missing_report",
      message: `You missed ${dateLabel(yesterday)}'s report. Log it to keep your Business Score accurate.`,
      tone: "warning",
    };
  }

  const last7Start = daysAgo(6);
  const prev7Start = daysAgo(13);
  const prev7End = daysAgo(7);
  const last7 = sorted.filter((d) => d.date >= last7Start && d.date <= today);
  const prev7 = sorted.filter((d) => d.date >= prev7Start && d.date <= prev7End);

  const sum = (arr: BusinessDay[], key: "profit" | "sales" | "expenses") =>
    arr.reduce((s, d) => s + d[key], 0);

  // Priority 2: Profit trend
  if (last7.length >= 3 && prev7.length >= 3) {
    const p1 = sum(last7, "profit");
    const p0 = sum(prev7, "profit");
    if (p0 !== 0) {
      const change = ((p1 - p0) / Math.abs(p0)) * 100;
      if (change >= 10) {
        return {
          type: "profit_trend",
          message: `Great job! Profit improved by ${Math.round(change)}% this week.`,
          tone: "positive",
        };
      }
      if (change <= -10) {
        return {
          type: "profit_trend",
          message: `Profit dropped ${Math.abs(Math.round(change))}% this week. Worth a closer look.`,
          tone: "warning",
        };
      }
    }
  }

  // Priority 3: Expense trend
  if (last7.length >= 3 && prev7.length >= 3) {
    const e1 = sum(last7, "expenses");
    const e0 = sum(prev7, "expenses");
    if (e0 > 0) {
      const change = ((e1 - e0) / e0) * 100;
      if (change >= 15) {
        return {
          type: "expense_trend",
          message: `Expenses increased by ${Math.round(change)}% this week.`,
          tone: "warning",
        };
      }
    }
  }

  // Priority 4: Debt recovery
  const outstanding = debtors.filter((d) => d.status === "outstanding");
  if (outstanding.length > 0) {
    const totalOutstanding = outstanding.reduce((s, d) => s + d.amount, 0);
    if (outstanding.length >= 3 || totalOutstanding > 20000) {
      return {
        type: "debt_recovery",
        message: `You have ${outstanding.length} customers owing money. Follow up to recover it.`,
        tone: "warning",
      };
    }
  }

  // Priority 5: Sales trend
  if (last7.length >= 3 && prev7.length >= 3) {
    const s1 = sum(last7, "sales");
    const s0 = sum(prev7, "sales");
    if (s0 > 0) {
      const change = ((s1 - s0) / s0) * 100;
      if (change >= 8) {
        return {
          type: "sales_trend",
          message: `Sales are up ${Math.round(change)}% compared to last week.`,
          tone: "positive",
        };
      }
    }
  }

  return {
    type: "neutral",
    message: "Business looks steady. Keep recording daily for sharper insights.",
    tone: "neutral",
  };
}
