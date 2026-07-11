"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

export default function PrivacyPage() {
  const router = useRouter();
  return (
    <main className="flex-1 px-6 pt-8 pb-12">
      <button
        onClick={() => router.back()}
        className="flex items-center gap-1 text-slate-muted text-[13px] font-medium"
      >
        <ArrowLeft size={16} /> Back
      </button>

      <h1 className="font-display text-2xl font-semibold text-ink mt-5">Privacy Policy</h1>
      <p className="text-[12px] text-slate-muted mt-1">Last updated: July 2026</p>

      <div className="mt-6 flex flex-col gap-5 text-[13.5px] text-ink/85 leading-relaxed">
        <Notice />

        <Section title="1. What we collect">
          <List
            items={[
              "Account details: your email, surname, username, and a securely hashed password (we never store your actual password).",
              "Business records you choose to enter: daily sales and expense totals, and customer debt entries (name and amount owed).",
              "Basic technical data needed to keep you logged in (session tokens), handled by our authentication provider.",
            ]}
          />
        </Section>

        <Section title="2. How we store it">
          Your account and business records are stored with Supabase, a database and
          authentication provider, in an encrypted database. Data is encrypted in transit
          (HTTPS) and at rest. Each user's business records are restricted at the database level
          so that only your own account can read or write them — this is enforced by the
          database itself, not just by the app's design.
        </Section>

        <Section title="3. Who can access your data">
          <List
            items={[
              "You — through your own logged-in account.",
              "The BizDaily team, as the operator of the underlying database, in the same way any app's operators can technically access their own backend. We access user data only to fix problems, respond to support requests, or when legally required — never to sell it.",
              "We do not sell, rent, or share your business data with third parties for marketing purposes.",
            ]}
          />
        </Section>

        <Section title="4. Voice input">
          If you use the voice recording feature, your device's browser processes your speech
          locally to convert it to text (via your browser's built-in speech recognition) before
          it's shown to you for confirmation. We do not separately record or store audio.
        </Section>

        <Section title="5. Your rights">
          You can request a copy of your data, ask us to correct it, or ask us to delete your
          account and associated records, by contacting us. Account deletion is currently
          handled manually on request while we build a fully self-service option — we aim to
          process deletion requests promptly.
        </Section>

        <Section title="6. Data retention">
          We keep your data for as long as your account is active, so your history and reports
          stay available to you. If you ask us to delete your account, we'll remove your
          personal data and business records within a reasonable time, except where we're
          required to retain something by law.
        </Section>

        <Section title="7. Children">
          BizDaily is intended for business owners and is not directed at children.
        </Section>

        <Section title="8. Changes to this policy">
          If this policy changes in a material way, we'll aim to let you know inside the app.
        </Section>

        <Section title="9. Contact">
          Questions about your data or this policy? Reach out through the contact details
          provided wherever you downloaded or were given access to BizDaily.
        </Section>
      </div>
    </main>
  );
}

function Notice() {
  return (
    <div className="bg-marigold-soft border border-marigold/25 rounded-xl2 px-4 py-3.5 text-[12.5px] text-ink/80">
      This is a starting template, not legal advice. Nigeria's Data Protection Act (NDPA, 2023)
      and similar regulations elsewhere may impose specific obligations on your business — have
      this reviewed by a lawyer before wide public launch, especially once you're handling real
      users' financial data at scale.
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 className="font-display text-[15px] font-semibold text-ink mb-1.5">{title}</h2>
      <div>{children}</div>
    </div>
  );
}

function List({ items }: { items: string[] }) {
  return (
    <ul className="list-disc pl-5 flex flex-col gap-1.5">
      {items.map((item, i) => (
        <li key={i}>{item}</li>
      ))}
    </ul>
  );
}
