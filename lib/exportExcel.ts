import * as XLSX from "xlsx";
import { BusinessDay, Debtor } from "./types";
import { dateLabel } from "./date";

export function exportToExcel(days: BusinessDay[], debtors: Debtor[], label: string) {
  const sorted = [...days].sort((a, b) => (a.date > b.date ? 1 : -1));

  const reportRows = sorted.map((d) => ({
    Date: dateLabel(d.date),
    Sales: d.sales,
    Expenses: d.expenses,
    Profit: d.profit,
  }));

  const debtRows = debtors.map((d) => ({
    Customer: d.name,
    Amount: d.amount,
    Status: d.status === "paid" ? "Paid" : "Outstanding",
  }));

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(reportRows), "Business Report");
  XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(debtRows), "Debts");

  XLSX.writeFile(wb, `BizDaily-${label}-Report.xlsx`);
}
