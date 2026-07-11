import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { BusinessDay, Debtor } from "./types";
import { dateLabel, formatMoney } from "./date";

export function exportToPdf(days: BusinessDay[], debtors: Debtor[], label: string) {
  const sorted = [...days].sort((a, b) => (a.date > b.date ? 1 : -1));
  const doc = new jsPDF();

  doc.setFontSize(16);
  doc.text("BizDaily Business Report", 14, 18);
  doc.setFontSize(10);
  doc.setTextColor(100);
  doc.text(`${label} · Generated ${new Date().toLocaleDateString()}`, 14, 25);

  const totalSales = sorted.reduce((s, d) => s + d.sales, 0);
  const totalExpenses = sorted.reduce((s, d) => s + d.expenses, 0);
  const totalProfit = totalSales - totalExpenses;
  const outstanding = debtors
    .filter((d) => d.status === "outstanding")
    .reduce((s, d) => s + d.amount, 0);

  doc.setTextColor(20, 33, 61);
  doc.setFontSize(11);
  doc.text(
    `Total Sales: ${formatMoney(totalSales)}   Total Expenses: ${formatMoney(
      totalExpenses
    )}   Profit: ${formatMoney(totalProfit)}   Outstanding Debt: ${formatMoney(outstanding)}`,
    14,
    34
  );

  autoTable(doc, {
    startY: 42,
    head: [["Date", "Sales", "Expenses", "Profit"]],
    body: sorted.map((d) => [
      dateLabel(d.date),
      formatMoney(d.sales),
      formatMoney(d.expenses),
      formatMoney(d.profit),
    ]),
    headStyles: { fillColor: [20, 33, 61] },
    styles: { fontSize: 9 },
  });

  const finalY = (doc as any).lastAutoTable.finalY || 42;
  doc.setFontSize(12);
  doc.text("Debts", 14, finalY + 12);
  autoTable(doc, {
    startY: finalY + 16,
    head: [["Customer", "Amount", "Status"]],
    body: debtors.map((d) => [d.name, formatMoney(d.amount), d.status === "paid" ? "Paid" : "Outstanding"]),
    headStyles: { fillColor: [20, 33, 61] },
    styles: { fontSize: 9 },
  });

  doc.save(`BizDaily-${label}-Report.pdf`);
}
