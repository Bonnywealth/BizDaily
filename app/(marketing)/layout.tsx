import React from "react";

export const metadata = {
  title: "BizDaily — Know Your Numbers",
  description: "Demo landing for BizDaily — AI-assisted daily business reporting",
};

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="antialiased">
        <div className="min-h-screen bg-white text-slate-900">{children}</div>
      </body>
    </html>
  );
}
