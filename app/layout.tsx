import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'BizDaily',
  description: 'A fresh Next.js 15 app with Tailwind CSS',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
