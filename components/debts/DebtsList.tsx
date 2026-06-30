"use client";
import React, { useState } from "react";
import Card from "../ui/Card";
import { useDebtsStore } from "../../stores/useDebtsStore";

export default function DebtsList() {
  const debts = useDebtsStore((s) => s.debts);
  const markPaid = useDebtsStore((s) => s.markPaid);
  const [tab, setTab] = useState<"Outstanding" | "Paid">("Outstanding");

  const outstanding = debts.filter((d) => d.status === "Outstanding");
  const paid = debts.filter((d) => d.status === "Paid");

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <button className={`px-3 py-2 rounded ${tab === "Outstanding" ? "bg-indigo-600 text-white" : "bg-white border"}`} onClick={() => setTab("Outstanding")}>Outstanding</button>
        <button className={`px-3 py-2 rounded ${tab === "Paid" ? "bg-indigo-600 text-white" : "bg-white border"}`} onClick={() => setTab("Paid")}>Paid</button>
      </div>

      {tab === "Outstanding" && (
        <Card>
          {outstanding.length === 0 ? (
            <div className="text-sm text-slate-600">You currently have no outstanding debts.</div>
          ) : (
            <div className="space-y-3">
              {outstanding.map((d) => (
                <div key={d.id} className="p-3 border rounded flex justify-between items-center">
                  <div>
                    <div className="font-medium">{d.customerName}</div>
                    <div className="text-sm text-slate-600">Amount: ₦{d.amount.toLocaleString()}</div>
                    <div className="text-xs text-slate-500">Recorded: {d.dateRecorded}</div>
                  </div>
                  <div>
                    <button className="px-3 py-1 bg-green-600 text-white rounded" onClick={() => { if (confirm('Record payment for this debt?')) markPaid(d.id); }}>Record Payment</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      )}

      {tab === "Paid" && (
        <Card>
          {paid.length === 0 ? (
            <div className="text-sm text-slate-600">No paid debts yet.</div>
          ) : (
            <div className="space-y-3">
              {paid.map((d) => (
                <div key={d.id} className="p-3 border rounded">
                  <div className="font-medium">{d.customerName}</div>
                  <div className="text-sm text-slate-600">Amount Paid: ₦{d.amount.toLocaleString()}</div>
                  <div className="text-xs text-slate-500">Paid At: {d.paidAt}</div>
                </div>
              ))}
            </div>
          )}
        </Card>
      )}
    </div>
  );
}
