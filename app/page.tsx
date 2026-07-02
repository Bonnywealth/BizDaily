export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 px-6 text-center text-white">
      <div className="max-w-2xl rounded-2xl border border-white/10 bg-white/10 p-8 shadow-2xl backdrop-blur">
        <p className="mb-3 text-sm font-semibold uppercase tracking-[0.3em] text-slate-300">Next.js 15</p>
        <h1 className="text-4xl font-semibold sm:text-6xl">Your app is ready.</h1>
        <p className="mt-4 text-lg text-slate-300">
          Clean App Router structure, Tailwind CSS, and a modern starter layout are now in place.
        </p>
      </div>
    </main>
  );
}
