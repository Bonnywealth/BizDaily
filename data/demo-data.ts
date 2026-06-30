import { BusinessReport, Debt, AIInsight } from "../types/domain";

export const demoBusinessReports: BusinessReport[] = [
  {
    id: "r-2026-06-21",
    date: "2026-06-21",
    day: "Monday",
    sales: 126500,
    expenses: 38200,
    profit: 88300,
    status: "Submitted",
    businessScore: 91,
    insightIds: ["insight-1"],
    createdAt: new Date("2026-06-21T12:00:00").toISOString(),
  },
  // additional demo entries can be added here
];

export const demoDebts: Debt[] = [
  {
    id: "d-001",
    customerName: "Ibrahim",
    amount: 35000,
    dateRecorded: "2026-06-21",
    dueDate: null,
    status: "Outstanding",
    paidAt: null,
    notes: "From Monday",
  },
  {
    id: "d-002",
    customerName: "Grace Ventures",
    amount: 22500,
    dateRecorded: "2026-06-19",
    dueDate: null,
    status: "Outstanding",
    paidAt: null,
    notes: "",
  },
];

export const demoInsights: AIInsight[] = [
  {
    id: "insight-1",
    title: "Profit increased by 18% this week",
    message: "Your profit increased compared to last week.",
    type: "Success",
    generatedAt: new Date().toISOString(),
  },
];
