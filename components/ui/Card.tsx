import React from "react";

export default function Card({ children }: { children: React.ReactNode }) {
  return <div className="p-4 bg-white border rounded-lg shadow-sm">{children}</div>;
}
