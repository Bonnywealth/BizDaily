"use client";
import React from "react";
import RecordForm from "../../../components/record/RecordForm";

export default function RecordPage() {
  return (
    <div className="min-h-screen p-4 max-w-md mx-auto">
      <h1 className="text-xl font-semibold mb-3">Record Today's Business</h1>
      <RecordForm />
    </div>
  );
}
