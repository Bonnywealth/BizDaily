import React from "react";

export function SeedDemoDataButton({ onClick }: { onClick?: () => void }) {
  return (
    <button onClick={onClick} className="px-4 py-2 bg-indigo-600 text-white rounded">
      Seed Demo Data
    </button>
  );
}

export default function EmptyState({ title, description }: { title: string; description?: string }) {
  return (
    <div className="p-6 text-center">
      <div className="text-lg font-semibold">{title}</div>
      {description && <p className="text-sm text-slate-600 mt-2">{description}</p>}
    </div>
  );
}
