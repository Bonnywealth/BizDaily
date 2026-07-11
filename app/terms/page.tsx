"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

export default function TermsPage() {
  const router = useRouter();
  return (
    <main className="flex-1 px-6 pt-8 pb-12">
      <button
        onClick={() => router.back()}
        className="flex items-center gap-1 text-slate-muted text-[13px] font-medium"
      >
        <ArrowLeft size={16} /> Back
      </button>

      <h1 className="font-display text-2xl font-semibold text-ink mt-5">Terms of Service</h1>
      <p className="text-[12px] text-slate-muted mt-1">Last updated: July 2026</p>

      <div className="mt-6 flex flex-col gap-5 text-[13.5px] text-ink/85 leading-relaxed">
        <Notice />

        <Section title="1. What BizDaily is">
          BizDaily is a tool for recording your own business's daily sales, expenses, and
          customer debts, and for viewing simple reports and insights based on what you enter.
          It does not process payments, extend credit, or provide accounting, tax, or financial
          advice.
        </Section>

        <Section title="2. Your account">
          You're responsible for the accuracy of the email you sign up with and for keeping your
          password confidential. You're responsible for all activity that happens under your
          account. If you believe your account has been accessed without your permission,
          contact us immediately.
        </Section>

        <Section title="3. Your data">
          Everything you enter — sales figures, expenses, customer names, and debt amounts — is
          yours. We store it so the app can work, and so you can view your history and reports.
          We do not sell your business data. See our Privacy Policy for details on how it's
          stored and protected.
        </Section>

        <Section title="4. Accuracy of insights">
          Business Score and AI Insight are automated summaries calculated from what you enter.
          They are for guidance only and are not financial, tax, or legal advice. You're
          responsible for decisions you make based on them.
        </Section>

        <Section title="5. Acceptable use">
          Don't use BizDaily to store data on people or businesses without a legitimate reason
          to (e.g. don't add debtors who aren't real customers), don't attempt to access another
          user's account or data, and don't use the app in a way that disrupts it for others.
        </Section>

        <Section title="6. Availability">
          We aim to keep BizDaily available and your data intact, but as with any online service,
          we can't guarantee uninterrupted access. We recommend exporting your reports (PDF/Excel)
          periodically for your own records.
        </Section>

        <Section title="7. Changes">
          We may update these terms as the app grows. If we make material changes, we'll aim to
          let you know inside the app.
        </Section>

        <Section title="8. Contact">
          Questions about these terms? Reach out through the contact details provided wherever
          you downloaded or were given access to BizDaily.
        </Section>
      </div>
    </main>
  );
}

function Notice() {
  return (
    <div className="bg-marigold-soft border border-marigold/25 rounded-xl2 px-4 py-3.5 text-[12.5px] text-ink/80">
      This is a starting template, not legal advice. Before wide public launch, have a lawyer
      familiar with Nigerian/local law review these terms for your specific business.
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 className="font-display text-[15px] font-semibold text-ink mb-1.5">{title}</h2>
      <p>{children}</p>
    </div>
  );
}
