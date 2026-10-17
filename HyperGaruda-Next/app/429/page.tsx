import Link from "next/link";

const videoUrl = "https://files.catbox.moe/vz0vsb.mp4";

export default function TooManyRequestsPage() {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#080b12] px-4 py-10 text-[#edf4ff]">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,#42202b_0%,transparent_60%)]"
      />

      <section className="relative w-full max-w-xl">
        <header className="mb-8 text-center">
          <p className="mb-4 text-xs font-bold tracking-[0.3em] text-rose-300">
            HYPERGARUDA / RATE LIMIT CONTROL
          </p>

          <h1 className="bg-gradient-to-r from-rose-300 via-orange-300 to-amber-200 bg-clip-text text-8xl font-black tracking-tighter text-transparent sm:text-9xl">
            429
          </h1>

          <h2 className="mt-3 text-2xl font-extrabold">
            TOO MANY REQUESTS 💀
          </h2>

          <p className="mt-4 text-sm leading-7 text-slate-400">
            Bro, the server needs a break.
            Time to touch grass—or watch some furry dance. 🪲
          </p>
        </header>

        <section className="overflow-hidden rounded-2xl border border-rose-300/20 bg-white/[0.03] shadow-[0_0_50px_rgba(251,113,133,0.07)]">
          <div className="flex items-center justify-between gap-3 border-b border-white/10 px-4 py-3">
            <span className="text-xs font-extrabold tracking-widest text-rose-200">
              REQUEST INTERCEPTION
            </span>

            <span className="rounded-full border border-amber-300/20 bg-amber-300/10 px-2 py-1 text-[9px] font-bold text-amber-200">
              CHILL MODE
            </span>
          </div>

          <div className="space-y-3 px-4 py-5 sm:px-5">
            <p className="text-base font-black leading-7 text-rose-200 sm:text-lg">
              BLUD NGAPAIN DODOS WEB GW AJG AWOKAWOKAWOK 💀
            </p>

            <p className="text-sm leading-7 text-slate-300">
              Nah daripada ngedodos web gw mending nonton nih
              Dancer Furries dari Production TAIIKUKAN bersama
              Bro Gintan AWOKAWOKAWOK 🪲🪲🪲🪲🪲🪲🪲
            </p>
          </div>

          <video
            className="aspect-video w-full bg-black object-contain"
            controls
            playsInline
            preload="metadata"
            src={videoUrl}
          >
            Browser kamu tidak mendukung pemutar video HTML.
          </video>

          <div className="space-y-2 px-4 py-4">
            <p className="text-sm font-extrabold text-amber-200">
              🪲 OPERATION: GO WATCH THE DANCER
            </p>

            <p className="text-xs leading-6 text-slate-400">
              Server bukan samsak, bradar. Jangan membanjiri
              layanan dengan request berlebihan.
              Santai dulu, nikmati videonya! 😭
            </p>
          </div>
        </section>

        <div className="mt-6 rounded-xl border border-white/10 bg-white/[0.025] p-4 font-mono text-xs leading-6">
          <p className="text-rose-300">
            STATUS: 429 TOO MANY REQUESTS
          </p>
          <p className="text-slate-400">
            SYSTEM: HYPERGARUDA-NEXT
          </p>
          <p className="text-slate-400">
            PROTOCOL: RATE_LIMIT.exe
          </p>
          <p className="text-slate-400">
            COUNTERMEASURE: FURRY DANCE 🪲
          </p>
        </div>

        <div className="mt-7 text-center">
          <Link
            href="/"
            className="inline-flex rounded-xl border border-rose-300/30 bg-rose-300/10 px-6 py-3 text-sm font-bold text-rose-200 transition hover:bg-rose-300/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-rose-300"
          >
            ← Balik ke Bio Link
          </Link>
        </div>

        <p className="mt-8 text-center text-[10px] tracking-[0.2em] text-slate-600">
          HYPERGARUDA · RATE LIMIT ARCHIVE
        </p>
      </section>
    </main>
  );
}