import type { APIRoute } from "astro";

export const prerender = false;

export const GET: APIRoute = () => {
  return new Response(
    JSON.stringify({
      application: "HyperGaruda Portfolio",
      status: "online",
      runtime: "Astro SSR",
      bundler: "Vite",
      companionUrl: process.env.COMPANION_URL ?? null,
      generatedAt: new Date().toISOString(),
    }),
    {
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        "Cache-Control": "no-store",
      },
    },
  );
};