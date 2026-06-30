import React from "react";

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "ghost" | "danger";
};

export default function Button({ children, variant = "primary", ...rest }: Props) {
  const base = "px-4 py-2 rounded-md text-sm font-medium";
  const variantClass =
    variant === "primary"
      ? "bg-indigo-600 text-white"
      : variant === "danger"
      ? "bg-red-600 text-white"
      : "bg-transparent border";

  return (
    <button className={`${base} ${variantClass}`} {...rest}>
      {children}
    </button>
  );
}
