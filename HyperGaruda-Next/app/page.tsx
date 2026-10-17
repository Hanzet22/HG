
export const dynamic = "force-dynamic";

type SystemStatus = {
  application: string;
  status: string;
  runtime: string;
  bundler: string;
  companionUrl: string | null;
  generatedAt: string;
};

async function getSystemStatus(): Promise<SystemStatus | null> {
  const baseUrl = process.env.PORTFOLIO_BASE_URL?.replace(/\/+$/, "");

  if (!baseUrl) return null;

  try {
    const response = await fetch(`${baseUrl}/api/system.json`, {
      cache: "no-store",
    });

    if (!response.ok) return null;

    return (await response.json()) as SystemStatus;
  } catch {
    return null;
  }
}

export default async function Home() {
  const system = await getSystemStatus();
  const portfolioUrl = process.env.PORTFOLIO_BASE_URL?.replace(/\/+$/, "");

  return (
    <main>
      <p>HYPERGARUDA / INTEGRATED SYSTEM</p>
      <h1>Dynamic Hub</h1>
      <p>Next.js + TypeScript</p>

      <section>
        <h2>Astro Core Connection</h2>

        {system ? (
          <>
            <p>Application: {system.application}</p>
            <p>Status: {system.status}</p>
            <p>Runtime: {system.runtime}</p>
            <p>Bundler: {system.bundler}</p>
            <p>Last response: {system.generatedAt}</p>
          </>
        ) : (
          <p>
            Astro endpoint belum dikonfigurasi atau belum tersedia.
            Atur PORTFOLIO_BASE_URL ke URL deployment Astro.
          </p>
        )}

        {portfolioUrl && (
          <p>
            <a href={portfolioUrl}>
              ← Back to HyperGaruda Portfolio
            </a>
          </p>
        )}
      </section>
    </main>
  );
}
