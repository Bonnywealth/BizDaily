"use client";
import React from "react";
import RecordForm from "../../../components/record/RecordForm";

export default function RecordPage() {
  return (
    <div className="max-w-3xl mx-auto p-4">
      <header className="mb-4">
        <h2 className="text-xl font-semibold">Record Today's Business</h2>
        <p className="text-sm text-slate-600">Enter today's sales and expenses. Optionally record a debtor.</p>
      </header>

      <section>
        <RecordForm />
      </section>
    </div>
  );
}
