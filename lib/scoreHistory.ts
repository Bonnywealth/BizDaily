import { BusinessDay, Debtor } from "./types";
import { calculateBusinessScore } from "./businessScore";

// Recomputes the Business Score as of each date in `dates`, using only
// data available up to (and including) that date — for the trend chart.
export function buildScoreHistory(
  dates: string[],
  days: BusinessDay[],
  debtors: Debtor[]
): { date: string; score: number | null }[] {
  return dates.map((date) => {
    const daysUpTo = days.filter((d) => d.date <= date);
    if (daysUpTo.length === 0) return { date, score: null };
    const debtorsUpTo = debtors.filter((d) => d.createdAt.slice(0, 10) <= date);
    const { total } = calculateBusinessScoreAsOf(daysUpTo, debtorsUpTo, date);
    return { date, score: total };
  });
}

function calculateBusinessScoreAsOf(days: BusinessDay[], debtors: Debtor[], _asOf: string) {
  return calculateBusinessScore(days, debtors);
}
