"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { Loader2 } from "lucide-react";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const handleSubmit = async () => {
    setError(null);
    if (password.length < 6) {
      setError("Password needs at least 6 characters.");
      return;
    }
    if (password !== confirm) {
      setError("Passwords don't match.");
      return;
    }
    setLoading(true);
    const { error: updateError } = await supabase.auth.updateUser({ password });
    setLoading(false);
    if (updateError) {
      setError(updateError.message);
      return;
    }
    setDone(true);
    setTimeout(() => router.push("/dashboard"), 1200);
  };

  return (
    <main className="flex-1 px-6 pt-12 pb-10 flex flex-col">
      <h1 className="font-display text-2xl font-semibold text-ink">Set a new password</h1>
      <p className="text-[13px] text-slate-muted mt-1">
        Choose a new password for your BizDaily account.
      </p>

      <div className="mt-6 flex flex-col gap-4">
        <label className="block">
          <span className="text-[13px] font-semibold text-ink">New password</span>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="At least 6 characters"
            className="mt-1.5 w-full bg-card border border-slate-line rounded-xl2 px-4 py-3.5 text-[15px] outline-none focus:border-emerald"
          />
        </label>
        <label className="block">
          <span className="text-[13px] font-semibold text-ink">Confirm password</span>
          <input
            type="password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            placeholder="Repeat password"
            className="mt-1.5 w-full bg-card border border-slate-line rounded-xl2 px-4 py-3.5 text-[15px] outline-none focus:border-emerald"
          />
        </label>
      </div>

      {error && (
        <p className="mt-3 text-[13px] font-medium text-rust bg-rust-soft rounded-xl px-3.5 py-2.5">
          {error}
        </p>
      )}
      {done && (
        <p className="mt-3 text-[13px] font-medium text-emerald bg-emerald-soft rounded-xl px-3.5 py-2.5">
          Password updated. Taking you to your dashboard…
        </p>
      )}

      <button
        onClick={handleSubmit}
        disabled={loading || done}
        className="mt-6 w-full flex items-center justify-center gap-2 bg-ink text-white font-semibold rounded-xl2 py-3.5 text-[15px] active:scale-[0.98] transition-transform disabled:opacity-60"
      >
        {loading && <Loader2 size={16} className="animate-spin" />}
        Update password
      </button>
    </main>
  );
}
