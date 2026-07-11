export interface BusinessDay {
  date: string; // YYYY-MM-DD, local timezone
  sales: number;
  expenses: number;
  profit: number;
  recordedAt: string; // ISO timestamp
}

export type DebtStatus = "outstanding" | "paid";

export interface Debtor {
  id: string;
  name: string;
  amount: number;
  status: DebtStatus;
  createdAt: string;
  paidAt?: string;
  dueDate?: string; // YYYY-MM-DD, optional expected payment date
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  surname: string;
  username: string;
}

export interface AIInsight {
  type: "missing_report" | "profit_trend" | "expense_trend" | "debt_recovery" | "sales_trend" | "neutral";
  message: string;
  tone: "positive" | "warning" | "neutral";
}
