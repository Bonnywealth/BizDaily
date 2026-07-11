import { supabase } from "./supabaseClient";
import { BusinessDay, Debtor, DebtStatus } from "./types";

interface BusinessDayRow {
  date: string;
  sales: number;
  expenses: number;
  profit: number;
  recorded_at: string;
}

interface DebtorRow {
  id: string;
  name: string;
  amount: number;
  status: DebtStatus;
  created_at: string;
  paid_at: string | null;
  due_date: string | null;
}

function rowToBusinessDay(r: BusinessDayRow): BusinessDay {
  return { date: r.date, sales: r.sales, expenses: r.expenses, profit: r.profit, recordedAt: r.recorded_at };
}

function rowToDebtor(r: DebtorRow): Debtor {
  return {
    id: r.id,
    name: r.name,
    amount: r.amount,
    status: r.status,
    createdAt: r.created_at,
    paidAt: r.paid_at ?? undefined,
    dueDate: r.due_date ?? undefined,
  };
}

export async function fetchBusinessDays(userId: string): Promise<BusinessDay[]> {
  const { data, error } = await supabase
    .from("business_days")
    .select("date, sales, expenses, profit, recorded_at")
    .eq("user_id", userId)
    .order("date", { ascending: true });
  if (error) {
    console.error("fetchBusinessDays failed:", error.message);
    return [];
  }
  return (data as BusinessDayRow[]).map(rowToBusinessDay);
}

export async function fetchDebtors(userId: string): Promise<Debtor[]> {
  const { data, error } = await supabase
    .from("debtors")
    .select("id, name, amount, status, created_at, paid_at, due_date")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });
  if (error) {
    console.error("fetchDebtors failed:", error.message);
    return [];
  }
  return (data as DebtorRow[]).map(rowToDebtor);
}

export async function saveBusinessDay(userId: string, day: BusinessDay): Promise<void> {
  const { error } = await supabase.from("business_days").upsert(
    {
      user_id: userId,
      date: day.date,
      sales: day.sales,
      expenses: day.expenses,
      profit: day.profit,
      recorded_at: day.recordedAt,
    },
    { onConflict: "user_id,date" }
  );
  if (error) console.error("saveBusinessDay failed:", error.message);
}

export async function insertDebtor(userId: string, debtor: Debtor): Promise<void> {
  const { error } = await supabase.from("debtors").insert({
    id: debtor.id,
    user_id: userId,
    name: debtor.name,
    amount: debtor.amount,
    status: debtor.status,
    created_at: debtor.createdAt,
    due_date: debtor.dueDate ?? null,
  });
  if (error) console.error("insertDebtor failed:", error.message);
}

export async function updateDebtorStatus(
  debtorId: string,
  status: DebtStatus,
  paidAt?: string
): Promise<void> {
  const { error } = await supabase
    .from("debtors")
    .update({ status, paid_at: paidAt ?? null })
    .eq("id", debtorId);
  if (error) console.error("updateDebtorStatus failed:", error.message);
}

export async function deleteDebtorRow(debtorId: string): Promise<void> {
  const { error } = await supabase.from("debtors").delete().eq("id", debtorId);
  if (error) console.error("deleteDebtorRow failed:", error.message);
}
