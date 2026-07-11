"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { ArrowLeft, Loader2 } from "lucide-react";
import clsx from "clsx";

function AuthForm() {
  const router = useRouter();
  const params = useSearchParams();

  const [mode, setMode] = useState<"signup" | "login">(
    params.get("mode") === "login" ? "login" : "signup"
  );

  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [surname, setSurname] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [resetSent, setResetSent] = useState(false);

  const handleForgotPassword = async () => {
    if (!email.trim()) {
      setError("Enter your email above first, then tap 'Forgot password'.");
      return;
    }
    setLoading(true);
    setError(null);
    const { error: resetError } = await supabase.auth.resetPasswordForEmail(email.trim(), {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    setLoading(false);
    if (resetError) {
      setError(resetError.message);
      return;
    }
    setResetSent(true);
    setInfo("Password reset link sent — check your email.");
  };

  useEffect(() => {
    setError(null);
    setInfo(null);
  }, [mode]);

  const handleSubmit = async () => {
    setError(null);
    setInfo(null);

    if (mode === "signup") {
      if (!email.trim() || !firstName.trim() || !surname.trim() || !username.trim() || password.length < 6) {
        setError("Fill in every field. Password needs at least 6 characters.");
        return;
      }
      setLoading(true);
      const { data, error: signUpError } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: { data: { firstName: firstName.trim(), surname: surname.trim(), username: username.trim() } },
      });
      setLoading(false);

      if (signUpError) {
        setError(signUpError.message);
        return;
      }
      if (data.session) {
        router.push("/dashboard");
      } else {
        // Email confirmation is required on this Supabase project.
        setInfo("Account created. Check your email to confirm it, then log in.");
        setMode("login");
      }
    } else {
      if (!email.trim() || !password) {
        setError("Enter your email and password.");
        return;
      }
      setLoading(true);
      const { error: loginError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });
      setLoading(false);

      if (loginError) {
        setError(loginError.message);
        return;
      }
      router.push("/dashboard");
    }
  };

  return (
    <main className="flex-1 px-6 pt-8 pb-10 flex flex-col">
      <button
        onClick={() => router.push("/")}
        className="flex items-center gap-1 text-slate-muted text-[13px] font-medium w-fit"
      >
        <ArrowLeft size={16} /> Back
      </button>

      <h1 className="font-display text-2xl font-semibold text-ink mt-5">
        {mode === "signup" ? "Create your account" : "Welcome back"}
      </h1>
      <p className="text-[13px] text-slate-muted mt-1">
        {mode === "signup"
          ? "Real account, secured by Supabase Auth."
          : "Log in to your BizDaily account."}
      </p>

      <div className="mt-6 flex gap-2 bg-paper border border-slate-line rounded-full p-1 w-fit">
        <ModeButton active={mode === "signup"} onClick={() => setMode("signup")}>
          Sign up
        </ModeButton>
        <ModeButton active={mode === "login"} onClick={() => setMode("login")}>
          Log in
        </ModeButton>
      </div>

      <div className="mt-6 flex flex-col gap-4">
        <Field label="Email" value={email} onChange={setEmail} type="email" placeholder="you@business.com" />
        {mode === "signup" && (
          <>
            <Field label="First name" value={firstName} onChange={setFirstName} placeholder="Chidi" />
            <Field label="Surname" value={surname} onChange={setSurname} placeholder="Okafor" />
            <Field label="Username" value={username} onChange={setUsername} placeholder="chidi_stores" />
          </>
        )}
        <Field
          label="Password"
          value={password}
          onChange={setPassword}
          type="password"
          placeholder={mode === "signup" ? "At least 6 characters" : "••••••"}
        />
        {mode === "login" && (
          <button
            type="button"
            onClick={handleForgotPassword}
            disabled={resetSent}
            className="text-[12.5px] font-semibold text-emerald text-left -mt-2 disabled:opacity-50"
          >
            {resetSent ? "Reset link sent" : "Forgot password?"}
          </button>
        )}
      </div>

      {error && (
        <p className="mt-3 text-[13px] font-medium text-rust bg-rust-soft rounded-xl px-3.5 py-2.5">
          {error}
        </p>
      )}
      {info && (
        <p className="mt-3 text-[13px] font-medium text-emerald bg-emerald-soft rounded-xl px-3.5 py-2.5">
          {info}
        </p>
      )}

      <button
        onClick={handleSubmit}
        disabled={loading}
        className="mt-6 w-full flex items-center justify-center gap-2 bg-ink text-white font-semibold rounded-xl2 py-3.5 text-[15px] active:scale-[0.98] transition-transform disabled:opacity-60"
      >
        {loading && <Loader2 size={16} className="animate-spin" />}
        {mode === "signup" ? "Create account" : "Log in"}
      </button>

      {mode === "signup" && (
        <p className="text-center text-[11.5px] text-slate-muted mt-3">
          By creating an account, you agree to our{" "}
          <a href="/terms" className="underline text-ink/70">
            Terms
          </a>{" "}
          and{" "}
          <a href="/privacy" className="underline text-ink/70">
            Privacy Policy
          </a>
          .
        </p>
      )}
    </main>
  );
}

export default function AuthPage() {
  return (
    <Suspense fallback={null}>
      <AuthForm />
    </Suspense>
  );
}

function ModeButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={clsx(
        "px-4 py-1.5 rounded-full text-[13px] font-semibold transition-colors",
        active ? "bg-ink text-white" : "text-slate-muted"
      )}
    >
      {children}
    </button>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  type?: string;
}) {
  return (
    <label className="block">
      <span className="text-[13px] font-semibold text-ink">{label}</span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="mt-1.5 w-full bg-card border border-slate-line rounded-xl2 px-4 py-3.5 text-[15px] outline-none focus:border-emerald placeholder:text-slate-muted/50"
      />
    </label>
  );
}
