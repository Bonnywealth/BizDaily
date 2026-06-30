import React from "react";
import { LucideIcon } from "lucide-react"; // placeholder import for typing

type Props = {
  icon?: any;
  className?: string;
  label?: string;
};

export default function Icon({ icon: IconComp, className = "w-5 h-5", label }: Props) {
  if (!IconComp) return null;
  return <IconComp className={className} aria-hidden={label ? "false" : "true"} />;
}
