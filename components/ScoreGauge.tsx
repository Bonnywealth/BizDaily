"use client";

const STROKE_RATIO = 0.083; // stroke width as a fraction of size
// three-quarter arc: from 135deg to 405deg (270deg sweep)
const SWEEP = 0.75;

function scoreColor(score: number) {
  if (score >= 75) return "#1F9D6B"; // emerald
  if (score >= 50) return "#E8A33D"; // marigold
  return "#D65F4C"; // rust
}

function scoreLabel(score: number) {
  if (score >= 80) return "Thriving";
  if (score >= 60) return "Healthy";
  if (score >= 40) return "Needs attention";
  return "At risk";
}

export default function ScoreGauge({ score, size = 168 }: { score: number; size?: number }) {
  const stroke = size * STROKE_RATIO;
  const radius = (size - stroke) / 2;
  const circ = 2 * Math.PI * radius;

  const clamped = Math.max(0, Math.min(100, score));
  const offset = circ * SWEEP * (1 - clamped / 100);
  const color = scoreColor(clamped);

  const numberSize = size >= 140 ? "text-4xl" : size >= 100 ? "text-2xl" : "text-lg";
  const labelSize = size >= 140 ? "text-[11px]" : "text-[9px]";

  return (
    <div className="relative flex items-center justify-center shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-[225deg]">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#E7E4DF"
          strokeWidth={stroke}
          strokeDasharray={`${circ * SWEEP} ${circ}`}
          strokeLinecap="round"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={stroke}
          strokeDasharray={`${circ * SWEEP} ${circ}`}
          strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ transition: "stroke-dashoffset 700ms ease, stroke 400ms ease" }}
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className={`font-display ${numberSize} font-semibold text-ink tabular-nums`}>
          {clamped}
        </span>
        <span className={`${labelSize} font-medium text-slate-muted mt-0.5 text-center px-1`}>
          {scoreLabel(clamped)}
        </span>
      </div>
    </div>
  );
}
