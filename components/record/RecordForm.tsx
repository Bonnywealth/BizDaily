"use client";
import React from "react";
import Input from "../ui/Input";
import Button from "../ui/Button";

export default function RecordForm() {
  return (
    <form className="space-y-4">
      <Input label="Total Sales" name="sales" type="number" placeholder="0.00" />
      <Input label="Total Expenses" name="expenses" type="number" placeholder="0.00" />
      <div className="border rounded p-3">
        <div className="text-sm font-medium mb-2">Optional: Record Debtor</div>
        <Input label="Customer Name" name="customerName" />
        <Input label="Amount Owed" name="amountOwed" type="number" />
        <Input label="Due Date (optional)" name="dueDate" type="date" />
        <input className="w-full mt-3 hidden" />
      </div>

      <div className="flex gap-3">
        <Button type="submit">Save Today's Business</Button>
        <Button variant="ghost" type="button">Cancel</Button>
      </div>
    </form>
  );
}
