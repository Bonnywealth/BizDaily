import React from "react";

type Props = React.InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
};

export default function Input({ label, ...rest }: Props) {
  return (
    <label className="block">
      {label && <span className="text-sm text-slate-700 mb-1 block">{label}</span>}
      <input
        {...rest}
        className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-200"
      />
    </label>
  );
}
