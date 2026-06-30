export async function exportReportToPDF(payload: { weekly: any[]; monthly: any[]; debts: any[] }) {
  // Simple HTML-print based PDF export (minimal dependency). For demo MVP, open a new window and call print.
  const { weekly, monthly, debts } = payload;
  const html = `
    <html>
      <head>
        <title>BizDaily Report</title>
        <style>body{font-family: Arial, Helvetica, sans-serif; padding:20px;} h1{font-size:18px;} table{width:100%;border-collapse:collapse;} td,th{border:1px solid #ddd;padding:8px;text-align:left;} </style>
      </head>
      <body>
        <h1>BizDaily Report</h1>
        <h2>Weekly Summary</h2>
        <table>
          <tr><th>Metric</th><th>Value</th></tr>
          <tr><td>Total Days</td><td>${weekly.length}</td></tr>
          <tr><td>Sales</td><td>₦${weekly.reduce((s,a:any)=>s+(a.sales||0),0).toLocaleString()}</td></tr>
          <tr><td>Expenses</td><td>₦${weekly.reduce((s,a:any)=>s+(a.expenses||0),0).toLocaleString()}</td></tr>
          <tr><td>Profit</td><td>₦${weekly.reduce((s,a:any)=>s+(a.profit||0),0).toLocaleString()}</td></tr>
        </table>
        <h2>Monthly Summary</h2>
        <table>
          <tr><th>Metric</th><th>Value</th></tr>
          <tr><td>Total Days</td><td>${monthly.length}</td></tr>
          <tr><td>Sales</td><td>₦${monthly.reduce((s,a:any)=>s+(a.sales||0),0).toLocaleString()}</td></tr>
          <tr><td>Expenses</td><td>₦${monthly.reduce((s,a:any)=>s+(a.expenses||0),0).toLocaleString()}</td></tr>
          <tr><td>Profit</td><td>₦${monthly.reduce((s,a:any)=>s+(a.profit||0),0).toLocaleString()}</td></tr>
        </table>
        <h2>Outstanding Debts</h2>
        <table>
          <tr><th>Customer</th><th>Amount</th></tr>
          ${debts.map(d=>`<tr><td>${d.customerName}</td><td>₦${Number(d.amount).toLocaleString()}</td></tr>`).join("")}
        </table>
      </body>
    </html>
  `;

  const w = window.open("")!;
  w.document.write(html);
  w.document.close();
  w.focus();
  w.print();
  w.close();
}

export async function exportReportToXLSX(payload: { weekly: any[]; monthly: any[]; debts: any[] }) {
  // Minimal Excel-compatible CSV export for MVP
  const rows: string[] = [];
  rows.push("Section,Field,Value");
  rows.push(`Weekly,Total Days,${payload.weekly.length}`);
  rows.push(`Weekly,Sales,${payload.weekly.reduce((s,a:any)=>s+(a.sales||0),0)}`);
  rows.push(`Weekly,Expenses,${payload.weekly.reduce((s,a:any)=>s+(a.expenses||0),0)}`);
  rows.push(`Weekly,Profit,${payload.weekly.reduce((s,a:any)=>s+(a.profit||0),0)}`);
  rows.push(`Monthly,Total Days,${payload.monthly.length}`);
  rows.push(`Monthly,Sales,${payload.monthly.reduce((s,a:any)=>s+(a.sales||0),0)}`);
  rows.push(`Monthly,Expenses,${payload.monthly.reduce((s,a:any)=>s+(a.expenses||0),0)}`);
  rows.push(`Monthly,Profit,${payload.monthly.reduce((s,a:any)=>s+(a.profit||0),0)}`);
  rows.push("Debts,Customer,Amount");
  payload.debts.forEach((d:any) => rows.push(`Debts,${d.customerName},${d.amount}`));

  const csv = rows.join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `bizdaily-report-${new Date().toISOString().slice(0,10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}
