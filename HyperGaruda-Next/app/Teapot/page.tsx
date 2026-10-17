import Link from "next/link";

const videoUrl = "https://files.catbox.moe/xjm054.mp4";

export default function TeapotPage() {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#080b12] px-4 py-10 text-[#edf4ff]">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,#302044_0%,transparent_60%)]"
      />

      <section className="relative w-full max-w-xl">
        <header className="mb-8 text-center">
          <p className="mb-4 text-xs font-bold tracking-[0.3em] text-cyan-300">
            HYPERGARUDA / WARKOP DIGITAL
          </p>

          <h1 className="bg-gradient-to-r from-cyan-300 to-violet-400 bg-clip-text text-8xl font-black tracking-tighter text-transparent sm:text-9xl">
            418
          </h1>

          <h2 className="mt-3 text-2xl font-extrabold">
            I&apos;m a Teapot 🫖
          </h2>

          <div className="mt-5 space-y-2 text-sm leading-7 text-slate-300">
            <p>Aku adalah Teh. 🍵</p>
            <p>Kau adalah Peminum Teh.</p>
            <p className="font-bold text-cyan-200">
              Selagi ngeteh, nah, nonton penari Furries Gintan,
              bradar! 🦊💃
            </p>
          </div>
        </header>

        <section className="overflow-hidden rounded-2xl border border-cyan-300/20 bg-white/[0.03] shadow-[0_0_50px_rgba(125,227,255,0.06)]">
          <div className="flex items-center justify-between gap-3 border-b border-white/10 px-4 py-3">
            <span className="text-xs font-extrabold tracking-widest text-cyan-200">
              GINTAN DANCE PROTOCOL
            </span>

            <span className="rounded-full border border-violet-300/20 bg-violet-300/10 px-2 py-1 text-[9px] font-bold text-violet-200">
              EASTER EGG
            </span>
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
            <p className="text-sm font-bold text-violet-200">
              🍵 WAKTUNYA NGETEH, BRADAR!
            </p>

            <p className="text-xs leading-6 text-slate-400">
              Seruput tehmu santai-santai. Sambil ngeteh,
              nikmati aksi penari Furries Gintan, bradar! 🦊
              <br />
              Server ini nggak bikin kopi. Di sini adanya teh
              dan furry dance. AWOKAWOKAWOK! 😭
            </p>
          </div>
        </section>

        <div className="mt-6 rounded-xl border border-white/10 bg-white/[0.025] p-4 font-mono text-xs leading-6">
          <p className="text-cyan-300">
            STATUS: 418 I&apos;M A TEAPOT
          </p>
          <p className="text-slate-400">
            SYSTEM: HYPERGARUDA-NEXT
          </p>
          <p className="text-slate-400">
            PROTOCOL: GINTAN_DANCE.exe
          </p>
          <p className="text-slate-400">
            BEVERAGE: TEH HANGAT 🍵
          </p>
        </div>

        <div className="mt-7 text-center">
          <Link
            href="/"
            className="inline-flex rounded-xl border border-cyan-300/30 bg-cyan-300/10 px-6 py-3 text-sm font-bold text-cyan-200 transition hover:bg-cyan-300/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyan-300"
          >
            ← Balik ke Bio Link
          </Link>
        </div>

        <p className="mt-8 text-center text-[10px] tracking-[0.2em] text-slate-600">
          HYPERGARUDA · WARKOP ERROR ARCHIVE
        </p>
      </section>
    </main>
  );
}