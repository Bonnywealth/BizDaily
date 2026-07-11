"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, PlusCircle, Users, History, BarChart3, Settings } from "lucide-react";
import clsx from "clsx";

const items = [
  { href: "/dashboard", label: "Home", icon: Home },
  { href: "/record", label: "Record", icon: PlusCircle },
  { href: "/debts", label: "Debts", icon: Users },
  { href: "/history", label: "History", icon: History },
  { href: "/reports", label: "Reports", icon: BarChart3 },
  { href: "/settings", label: "Settings", icon: Settings },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="sticky bottom-0 left-0 right-0 bg-card border-t border-slate-line pb-[env(safe-area-inset-bottom)]">
      <div className="grid grid-cols-6">
        {items.map(({ href, label, icon: Icon }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className="flex flex-col items-center justify-center gap-1 py-2.5"
            >
              <Icon
                size={22}
                strokeWidth={active ? 2.4 : 1.8}
                className={active ? "text-emerald" : "text-slate-muted"}
              />
              <span
                className={clsx(
                  "text-[11px] font-medium",
                  active ? "text-emerald" : "text-slate-muted"
                )}
              >
                {label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
