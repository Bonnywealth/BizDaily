export async function exportReportToXLSX(payload: { daily?: any[]; weekly?: any[]; monthly?: any[]; debts?: any[] }) {
  // Generate an .xlsx workbook using SheetJS (xlsx)
  if (typeof window === 'undefined') throw new Error('exportReportToXLSX must be called in the browser');
  const XLSX = await import('xlsx');

  const wb = XLSX.utils.book_new();

  // Daily sheet
  const daily = payload.daily || [];
  if (daily.length > 0) {
    const rows = daily.map((r) => ({ Date: r.date, Day: r.day, Sales: r.sales, Expenses: r.expenses, Profit: r.profit, Status: r.status }));
    const ws = XLSX.utils.json_to_sheet(rows);
    XLSX.utils.book_append_sheet(wb, ws, 'Daily');
  }

  // Weekly summary
  const weekly = payload.weekly || [];
  const wsWeekly = XLSX.utils.json_to_sheet([
    { Metric: 'Total Days', Value: weekly.length },
    { Metric: 'Total Sales', Value: weekly.reduce((s: number, r: any) => s + (r.sales || 0), 0) },
    { Metric: 'Total Expenses', Value: weekly.reduce((s: number, r: any) => s + (r.expenses || 0), 0) },
    { Metric: 'Total Profit', Value: weekly.reduce((s: number, r: any) => s + (r.profit || 0), 0) },
  ]);
  XLSX.utils.book_append_sheet(wb, wsWeekly, 'Weekly Summary');

  // Monthly summary
  const monthly = payload.monthly || [];
  const wsMonthly = XLSX.utils.json_to_sheet([
    { Metric: 'Total Days', Value: monthly.length },
    { Metric: 'Total Sales', Value: monthly.reduce((s: number, r: any) => s + (r.sales || 0), 0) },
    { Metric: 'Total Expenses', Value: monthly.reduce((s: number, r: any) => s + (r.expenses || 0), 0) },
    { Metric: 'Total Profit', Value: monthly.reduce((s: number, r: any) => s + (r.profit || 0), 0) },
  ]);
  XLSX.utils.book_append_sheet(wb, wsMonthly, 'Monthly Summary');

  // Debts sheet
  const debts = payload.debts || [];
  if (debts.length > 0) {
    const wsDebts = XLSX.utils.json_to_sheet(debts.map((d) => ({ Customer: d.customerName, Amount: d.amount, Status: d.status, Recorded: d.dateRecorded, PaidAt: d.paidAt || '' })));
    XLSX.utils.book_append_sheet(wb, wsDebts, 'Debts');
  }

  const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
  const blob = new Blob([wbout], { type: 'application/octet-stream' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `bizdaily-report-${new Date().toISOString().slice(0, 10)}.xlsx`;
  a.click();
  URL.revokeObjectURL(url);
}

export async function exportReportToPDF(containerId = 'report-root') {
  if (typeof window === 'undefined') throw new Error('exportReportToPDF must be called in the browser');
  const { jsPDF } = await import('jspdf');
  const html2canvas = (await import('html2canvas')).default;

  const node = document.getElementById(containerId);
  if (!node) throw new Error(`Container with id ${containerId} not found`);

  const canvas = await html2canvas(node as HTMLElement, { scale: 2 });
  const imgData = canvas.toDataURL('image/png');
  const pdf = new jsPDF({ orientation: 'portrait', unit: 'pt', format: 'a4' });

  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();

  // Fit image to page width while preserving aspect ratio
  const imgProps = (pdf as any).getImageProperties(imgData);
  const imgWidth = pageWidth - 40; // margins
  const imgHeight = (imgProps.height * imgWidth) / imgProps.width;

  pdf.addImage(imgData, 'PNG', 20, 20, imgWidth, imgHeight);
  pdf.save(`bizdaily-report-${new Date().toISOString().slice(0, 10)}.pdf`);
}
