import { AIInsight } from "@/lib/types";
import { Sparkles } from "lucide-react";
import clsx from "clsx";

const toneStyles: Record<AIInsight["tone"], string> = {
  positive: "bg-emerald-soft text-emerald border-emerald/20",
  warning: "bg-rust-soft text-rust border-rust/20",
  neutral: "bg-marigold-soft text-ink border-marigold/20",
};

export default function InsightCard({ insight }: { insight: AIInsight }) {
  return (
    <div
      className={clsx(
        "rounded-xl2 border px-4 py-3.5 flex items-start gap-3",
        toneStyles[insight.tone]
      )}
    >
      <Sparkles size={18} className="mt-0.5 shrink-0" strokeWidth={2} />
      <p className="text-sm leading-snug font-medium">{insight.message}</p>
    </div>
  );
}
