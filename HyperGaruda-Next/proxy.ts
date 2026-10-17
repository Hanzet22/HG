import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Local / single-process rate limiter.
 * Production on Netlify needs a platform-level limiter
 * or a shared external store.
 */
const WINDOW_MS = 60_000;
const MAX_REQUESTS = 60;

type RateBucket = {
  count: number;
  resetAt: number;
};

const buckets = new Map<string, RateBucket>();
let requestsSinceCleanup = 0;

function isExcluded(pathname: string): boolean {
  const path = pathname.toLowerCase();

  // Keep the custom error page and Teapot endpoint reachable.
  if (path === "/429" || path === "/api/teapot") return true;

  // Next.js assets and metadata.
  if (
    path.startsWith("/_next/static/") ||
    path.startsWith("/_next/image/") ||
    path === "/favicon.ico" ||
    path === "/icon.svg" ||
    path === "/robots.txt" ||
    path === "/sitemap.xml"
  ) {
    return true;
  }

  // Public assets: don't count normal file requests.
  if (
    /\.(?:css|js|mjs|cjs|map|png|jpe?g|gif|webp|avif|ico|svg|woff2?|ttf|otf|eot|mp4|webm|mp3|wav)$/i.test(
      path
    )
  ) {
    return true;
  }

  return false;
}

function getClientKey(request: NextRequest): string {
  // Netlify supplies this header for the connecting client IP.
  const netlifyIp = request.headers.get("x-nf-client-connection-ip");
  if (netlifyIp) return `netlify:${netlifyIp}`;

  // Local development fallback. Don't trust arbitrary forwarded
  // IP headers as a production identity source.
  return "local-development";
}

function cleanExpiredBuckets(now: number) {
  for (const [key, bucket] of buckets) {
    if (bucket.resetAt <= now) buckets.delete(key);
  }
}

function tooManyRequests(retryAfter: number, resetAt: number) {
  const html = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="robots" content="noindex">
  <title>429 — Too Many Requests | HyperGaruda</title>
  <style>
    * { box-sizing: border-box; }
    body {
      margin: 0; min-height: 100vh; display: grid; place-items: center;
      padding: 24px; background: #080b12; color: #edf4ff;
      font-family: Arial, Helvetica, sans-serif;
    }
    main {
      width: min(100%, 620px); padding: 32px;
      border: 1px solid #633b30; border-radius: 24px;
      background: #11141e; text-align: center;
    }
    .code { color: #ff9b76; font-size: 64px; font-weight: 800; }
    p { color: #aab6c9; line-height: 1.7; }
    a {
      display: inline-block; margin-top: 12px; padding: 12px 18px;
      border-radius: 12px; background: #ff9b76; color: #171018;
      text-decoration: none; font-weight: 700;
    }
  </style>
</head>
<body>
  <main>
    <div class="code">429</div>
    <h1>Too Many Requests</h1>
    <p>Pelan-pelan, bradar! Request ke HyperGaruda terlalu sering.</p>
    <p>Coba lagi dalam sekitar ${retryAfter} detik.</p>
    <a href="/429">Buka halaman 429</a>
  </main>
</body>
</html>`;

  return new Response(html, {
    status: 429,
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "no-store",
      "Retry-After": String(retryAfter),
      "X-RateLimit-Limit": String(MAX_REQUESTS),
      "X-RateLimit-Remaining": "0",
      "X-RateLimit-Reset": String(Math.ceil(resetAt / 1000)),
    },
  });
}

export function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  if (isExcluded(pathname)) {
    return NextResponse.next();
  }

  // Don't charge automatic navigation prefetches or preflight requests.
  const purpose = request.headers.get("purpose") ?? "";
  const secPurpose = request.headers.get("sec-purpose") ?? "";

  if (
    purpose.includes("prefetch") ||
    secPurpose.includes("prefetch") ||
    request.headers.has("next-router-prefetch") ||
    request.method === "OPTIONS"
  ) {
    return NextResponse.next();
  }

  const now = Date.now();
  const key = getClientKey(request);

  requestsSinceCleanup += 1;
  if (requestsSinceCleanup >= 128) {
    cleanExpiredBuckets(now);
    requestsSinceCleanup = 0;
  }

  let bucket = buckets.get(key);

  if (!bucket || bucket.resetAt <= now) {
    bucket = {
      count: 0,
      resetAt: now + WINDOW_MS,
    };
    buckets.set(key, bucket);
  }

  if (bucket.count >= MAX_REQUESTS) {
    const retryAfter = Math.max(
      1,
      Math.ceil((bucket.resetAt - now) / 1000)
    );

    return tooManyRequests(retryAfter, bucket.resetAt);
  }

  bucket.count += 1;

  const response = NextResponse.next();
  response.headers.set("X-RateLimit-Limit", String(MAX_REQUESTS));
  response.headers.set(
    "X-RateLimit-Remaining",
    String(Math.max(0, MAX_REQUESTS - bucket.count))
  );
  response.headers.set(
    "X-RateLimit-Reset",
    String(Math.ceil(bucket.resetAt / 1000))
  );

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|icon.svg|robots.txt|sitemap.xml).*)",
  ],
};