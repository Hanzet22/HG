import Link from "next/link";

export default function NotFound() {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#080b12] px-5 py-12 text-[#edf4ff]">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,#15364b_0%,transparent_55%)]"
      />

      <section className="relative w-full max-w-xl text-center">
        <p className="mb-5 text-xs font-bold tracking-[0.35em] text-cyan-300">
          HYPERGARUDA / SYSTEM RESPONSE
        </p>

        <div className="mb-5 text-8xl font-black tracking-tighter text-transparent bg-gradient-to-r from-cyan-300 to-violet-400 bg-clip-text sm:text-9xl">
          404
        </div>

        <h1 className="text-2xl font-extrabold sm:text-3xl">
          Destination Not Found
        </h1>

        <p className="mx-auto mt-4 max-w-md text-sm leading-7 text-slate-400">
          The requested resource could not be found.
          It may have moved, been removed, or never existed.
        </p>

        <div className="mx-auto mt-8 max-w-md rounded-xl border border-white/10 bg-white/[0.03] p-4 text-left font-mono text-xs leading-6">
          <p className="text-cyan-300">STATUS: 404 NOT_FOUND</p>
          <p className="text-slate-400">SYSTEM: HYPERGARUDA-NEXT</p>
          <p className="text-slate-400">ACTION: VERIFY REQUESTED URL</p>
        </div>

        <Link
          href="/"
          className="mt-8 inline-flex items-center justify-center rounded-xl border border-cyan-300/40 bg-cyan-300/10 px-6 py-3 text-sm font-bold text-cyan-200 transition hover:border-cyan-200 hover:bg-cyan-300/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyan-300"
        >
          ← Return to Bio Link
        </Link>

        <p className="mt-10 text-[10px] tracking-[0.2em] text-slate-600">
          HYPERGARUDA · HTTP ERROR ARCHIVE
        </p>
      </section>
    </main>
  );
}