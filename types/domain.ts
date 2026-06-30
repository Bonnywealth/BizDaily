export type DayName =
  | "Sunday"
  | "Monday"
  | "Tuesday"
  | "Wednesday"
  | "Thursday"
  | "Friday"
  | "Saturday";

export interface BusinessReport {
  id: string;
  date: string; // ISO yyyy-mm-dd (local)
  day: DayName;
  sales: number;
  expenses: number;
  profit: number; // derived
  status: "Submitted" | "No Business Report Submitted";
  businessScore?: number;
  insightIds?: string[];
  createdAt: string;
}

export interface Debt {
  id: string;
  customerName: string;
  amount: number;
  dateRecorded: string; // ISO date string
  dueDate?: string | null;
  status: "Outstanding" | "Paid";
  paidAt?: string | null;
  notes?: string;
}

export interface AIInsight {
  id: string;
  title: string;
  message: string;
  type: "Success" | "Warning" | "Information";
  generatedAt: string;
}

export interface BusinessScoreFactors {
  profitTrend: number;
  salesConsistency: number;
  expenseControl: number;
  debtRecovery: number;
  reportingConsistency: number;
}
