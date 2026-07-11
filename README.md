# BizDaily

Mobile-first business tracker for small business owners. Log daily sales and
expenses, track customer debts, and get one clear AI insight — no accounting
knowledge required. Built as an installable PWA with real authentication.

## 1. Set up Supabase (real auth — takes ~3 minutes)

1. Go to https://supabase.com → sign up (free) → **New Project**
2. Give it any name, set a database password (you won't need it again), pick
   the region closest to you, click **Create new project**. Wait ~1 minute
   while it provisions.
3. In the left sidebar go to **Project Settings → API**. You'll see:
   - **Project URL**
   - **anon public** key
4. **For your demo/testing only:** go to **Authentication → Providers →
   Email**, and temporarily turn **OFF** "Confirm email" so accounts work
   instantly without needing to click a link, while you're testing.
   **Before sending this to real business owners, turn it back ON** —
   real users should confirm a real email address. The app already handles
   both cases: with confirmation on, sign-up shows "check your email" and
   switches to the login tab; with it off, sign-up logs you straight in.
   ⚠️ Supabase's free tier sends confirmation emails via a shared,
   rate-limited service (roughly a handful of emails per hour) — fine for a
   small pilot group, but before a bigger public launch, set up a custom SMTP
   provider under Authentication → Settings → SMTP so emails are reliable.
5. In this project folder, copy `.env.local.example` to a new file named
   `.env.local`, and paste in your Project URL and anon key:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
   ```
6. **Create the data tables.** In Supabase go to **SQL Editor → New query**,
   paste the block below, and click **Run**. This creates the tables that
   hold real sales/expenses/debt records, and locks each row to its owner
   (Row Level Security) so one user can never see another user's data:

   ```sql
   create table business_days (
     id uuid primary key default gen_random_uuid(),
     user_id uuid references auth.users not null,
     date date not null,
     sales numeric not null,
     expenses numeric not null,
     profit numeric not null,
     recorded_at timestamptz not null default now(),
     unique (user_id, date)
   );

   create table debtors (
     id uuid primary key default gen_random_uuid(),
     user_id uuid references auth.users not null,
     name text not null,
     amount numeric not null,
     status text not null default 'outstanding',
     created_at timestamptz not null default now(),
     paid_at timestamptz,
     due_date date
   );

   alter table business_days enable row level security;
   alter table debtors enable row level security;

   create policy "Users manage their own business days"
     on business_days for all
     using (auth.uid() = user_id)
     with check (auth.uid() = user_id);

   create policy "Users manage their own debtors"
     on debtors for all
     using (auth.uid() = user_id)
     with check (auth.uid() = user_id);
   ```

## New feature: debt due dates + WhatsApp reminders

If you already created your `debtors` table earlier, it doesn't have the new
`due_date` column yet. Run this once in Supabase → **SQL Editor**:

```sql
alter table debtors add column due_date date;
```

(If you're setting up Supabase for the first time, skip this — the main
schema block above already includes `due_date`.)

## 2. Run locally

```bash
npm install
npm run dev
```

Open http://localhost:3000 — tap **Create my account**, sign up with a real
email/password, and you'll land straight on the dashboard, greeted by your
username. Log out and log back in to confirm it's real — refreshing the page
also keeps you logged in (Supabase manages the session).

## 3. Deploy (GitHub + Vercel)

1. Push this folder to a new GitHub repo:
   ```bash
   git init
   git add .
   git commit -m "BizDaily MVP with real auth"
   git branch -M main
   git remote add origin https://github.com/<you>/bizdaily.git
   git push -u origin main
   ```
2. Go to vercel.com → **Add New Project** → import the repo.
3. **Before deploying**, add your two environment variables in the Vercel
   project settings (Settings → Environment Variables):
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Deploy. Once live, open the Vercel URL on a phone and use **Add to Home
   Screen** — that's the PWA "install" for your demo video.

## What to show in the demo video

1. Landing page → **Create my account** → sign up with real credentials
2. Dashboard greets you by username → Business Score gauge, AI insight
3. Record today's business → tap the mic, speak sales/expenses → auto-fills
4. Debts tab → add a debtor, mark one paid
5. History and Reports tabs → trend charts, export PDF/Excel
6. Settings → **Log out** → back on landing page → **Log in** with the same
   credentials → proves it's a real account, not just local storage
7. Add to Home Screen to show it installs like a native app

## Notes

- **Auth is real**: Supabase handles password hashing, sessions, and
  verification server-side. Nothing about login is faked or client-only.
- **Business data is real too**: sales, expenses, and debts are stored in
  Supabase Postgres, scoped to each user with Row Level Security — not just
  browser storage. Data survives a cleared cache, a new device, a reinstall.
- **Demo Mode stays local-only by design** (per the original brief) — it's
  meant for quick exploration with no account, so it never touches Supabase.
- Forgot-password is wired up (email link → set new password).
- Currency is formatted as ₦ (Naira) — change in `lib/date.ts` `formatMoney`
  if you need a different currency for your pitch.
- Business Score = 20% each of profit trend, sales consistency, expense
  control, debt recovery, and reporting consistency (`lib/businessScore.ts`).
- Voice input uses the browser's built-in speech recognition — works in
  Chrome, Edge, and Android; not supported in Safari/iOS yet.

## Before you send this to a real business owner

This covers the core loop solidly and now includes real auth, real data
persistence, a Privacy Policy, and Terms of Service. A few remaining things
worth doing:
- Turn "Confirm email" **ON** in Supabase before real launch (see step 4
  above) and set up custom SMTP if you expect more than a handful of signups.
- Have a lawyer review the Terms/Privacy pages (`app/terms`, `app/privacy`)
  for your specific situation — they're a solid starting template, not a
  substitute for legal advice, especially given you're handling real
  financial data.
- Account deletion is currently a manual process (user emails you, you
  delete their Supabase auth user and rows) — a nice next step is a proper
  self-service "delete my account" flow.
- Keep your own Supabase login secured (strong password + 2FA) — as the
  project owner you have admin access to the database, so protecting that
  account matters.
- The free Supabase tier has usage limits and may auto-pause an inactive
  project — check supabase.com/pricing before wider rollout.

