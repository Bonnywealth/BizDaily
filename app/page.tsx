"use client";

import { useRouter } from "next/navigation";
import { TrendingUp, ShieldCheck, Sparkles } from "lucide-react";

function Mark() {
  return (
    <svg width="34" height="34" viewBox="0 0 34 34" fill="none">
      <circle cx="17" cy="17" r="14.5" stroke="#E8A33D" strokeWidth="2.4" />
      <path
        d="M5.2 10.8A14.48 14.48 0 0 1 17 2.5c4.6 0 8.7 2.2 11.2 5.7"
        stroke="#1F9D6B"
        strokeWidth="2.4"
        strokeLinecap="round"
      />
      <text x="17" y="22" textAnchor="middle" fontSize="15" fontWeight="700" fill="white">
        B
      </text>
    </svg>
  );
}

export default function LandingPage() {
  const router = useRouter();

  return (
    <main className="flex-1 flex flex-col">
      {/* Dark fintech header band */}
      <div className="bg-ink px-6 pt-8 pb-10">
        <div className="flex items-center gap-2.5">
          <Mark />
          <span className="font-display text-xl font-bold text-white tracking-tight">
            BizDaily
          </span>
        </div>
        <span className="inline-block w-fit text-[11px] font-semibold tracking-wide uppercase text-emerald bg-white/10 px-2.5 py-1 rounded-full mt-4">
          Built for African businesses
        </span>
      </div>

      {/* Bordered content card, overlapping the header */}
      <div className="flex-1 flex flex-col -mt-4 rounded-t-[1.75rem] border border-slate-line bg-paper px-6 pt-8 pb-8">
        <div className="flex-1 flex flex-col justify-center">
          <h1 className="font-display text-[1.9rem] leading-[1.15] font-semibold text-ink">
            How is business
            <br />
            today?
          </h1>
          <p className="mt-4 text-[13.5px] text-slate-muted leading-relaxed max-w-[30ch]">
            Log your sales and expenses in ten seconds — even by voice. BizDaily
            handles the profit math, the debt tracking, and the insights.
          </p>

          <div className="mt-8 grid grid-cols-1 gap-3">
            <Feature icon={TrendingUp} text="See your profit and Business Score every day" />
            <Feature icon={ShieldCheck} text="Track exactly who owes you money" />
            <Feature icon={Sparkles} text="Get one clear insight, not a spreadsheet" />
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-3">
          <button
            onClick={() => router.push("/auth?mode=signup")}
            className="w-full bg-ink text-white font-semibold rounded-xl2 py-3.5 text-[14px] active:scale-[0.98] transition-transform"
          >
            Create my account
          </button>
          <button
            onClick={() => router.push("/auth?mode=login")}
            className="w-full bg-transparent text-ink font-semibold rounded-xl2 py-3.5 text-[14px] border border-slate-line active:scale-[0.98] transition-transform"
          >
            I already have an account
          </button>
          <p className="text-center text-[12px] text-slate-muted mt-1">
            Your account and records are securely backed up.
          </p>
          <p className="text-center text-[11.5px] text-slate-muted mt-0.5">
            By continuing, you agree to our{" "}
            <a href="/terms" className="underline text-ink/70">
              Terms
            </a>{" "}
            and{" "}
            <a href="/privacy" className="underline text-ink/70">
              Privacy Policy
            </a>
            .
          </p>
        </div>
      </div>
    </main>
  );
}

function Feature({ icon: Icon, text }: { icon: typeof TrendingUp; text: string }) {
  return (
    <div className="flex items-center gap-3">
      <div className="shrink-0 w-9 h-9 rounded-full bg-card border border-slate-line flex items-center justify-center">
        <Icon size={16} className="text-emerald" strokeWidth={2.2} />
      </div>
      <span className="text-[12.5px] text-ink/80 font-medium">{text}</span>
    </div>
  );
}
