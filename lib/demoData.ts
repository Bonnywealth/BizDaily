import { BusinessDay, Debtor } from "./types";
import { daysAgo } from "./date";

// Deterministic pseudo-random so demo data looks the same across resets
function seeded(seed: number) {
  let s = seed;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

export function generateDemoBusinessDays(): BusinessDay[] {
  const rand = seeded(42);
  const days: BusinessDay[] = [];
  const totalDays = 35;

  for (let i = totalDays; i >= 0; i--) {
    const date = daysAgo(i);
    const dow = new Date(date + "T00:00:00").getDay();

    // Skip some days entirely to simulate missed reports (gaps)
    // More likely to miss on Sundays, and a few random misses
    const missSunday = dow === 0 && rand() < 0.6;
    const randomMiss = rand() < 0.08;
    if (missSunday || randomMiss) continue;

    // Gentle upward trend over the period + weekday seasonality
    const trendBoost = ((totalDays - i) / totalDays) * 4000;
    const weekendBoost = dow === 5 || dow === 6 ? 6000 : 0;
    const baseSales = 18000 + trendBoost + weekendBoost + rand() * 8000;
    const expenseRatio = 0.55 + rand() * 0.2;

    const sales = Math.round(baseSales);
    const expenses = Math.round(baseSales * expenseRatio);
    const profit = sales - expenses;

    days.push({
      date,
      sales,
      expenses,
      profit,
      recordedAt: new Date(date + "T18:30:00").toISOString(),
    });
  }

  return days;
}

export function generateDemoDebtors(): Debtor[] {
  return [
    {
      id: "d1",
      name: "Chinedu Okafor",
      amount: 15500,
      status: "outstanding",
      createdAt: daysAgo(12) + "T10:00:00.000Z",
    },
    {
      id: "d2",
      name: "Amina Bello",
      amount: 8000,
      status: "outstanding",
      createdAt: daysAgo(7) + "T10:00:00.000Z",
    },
    {
      id: "d3",
      name: "Tunde Adeyemi",
      amount: 22000,
      status: "outstanding",
      createdAt: daysAgo(20) + "T10:00:00.000Z",
    },
    {
      id: "d4",
      name: "Grace Umeh",
      amount: 5000,
      status: "paid",
      createdAt: daysAgo(25) + "T10:00:00.000Z",
      paidAt: daysAgo(18) + "T10:00:00.000Z",
    },
    {
      id: "d5",
      name: "Ibrahim Sule",
      amount: 12000,
      status: "paid",
      createdAt: daysAgo(30) + "T10:00:00.000Z",
      paidAt: daysAgo(22) + "T10:00:00.000Z",
    },
  ];
}
