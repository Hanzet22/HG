import Link from "next/link";

export default function ForbiddenPage() {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#080b12] px-5 py-12 text-[#edf4ff]">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,#40202b_0%,transparent_55%)]"
      />

      <section className="relative w-full max-w-xl text-center">
        <p className="mb-5 text-xs font-bold tracking-[0.35em] text-rose-300">
          HYPERGARUDA / ACCESS CONTROL
        </p>

        <div className="mb-5 bg-gradient-to-r from-rose-300 to-orange-300 bg-clip-text text-8xl font-black tracking-tighter text-transparent sm:text-9xl">
          403
        </div>

        <h1 className="text-2xl font-extrabold sm:text-3xl">
          Access Forbidden
        </h1>

        <p className="mx-auto mt-4 max-w-md text-sm leading-7 text-slate-400">
          The server understood the request but refused to authorize it.
          This resource is not available through this route.
        </p>

        <div className="mx-auto mt-8 max-w-md rounded-xl border border-rose-300/15 bg-rose-300/[0.03] p-4 text-left font-mono text-xs leading-6">
          <p className="text-rose-300">STATUS: 403 FORBIDDEN</p>
          <p className="text-slate-400">SYSTEM: HYPERGARUDA-NEXT</p>
          <p className="text-slate-400">ACTION: CHECK ACCESS POLICY</p>
        </div>

        <Link
          href="/"
          className="mt-8 inline-flex items-center justify-center rounded-xl border border-rose-300/30 bg-rose-300/10 px-6 py-3 text-sm font-bold text-rose-200 transition hover:bg-rose-300/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-rose-300"
        >
          ← Return to Bio Link
        </Link>

        <p className="mt-10 text-[10px] tracking-[0.2em] text-slate-600">
          HYPERGARUDA · ACCESS CONTROL SYSTEM
        </p>
      </section>
    </main>
  );
}