export const dynamic = "force-dynamic";

type SystemStatus = {
  application: string;
  status: string;
  runtime: string;
  bundler: string;
  companionUrl: string | null;
  generatedAt: string;
};

const ASTRO_URL =
  process.env.PORTFOLIO_BASE_URL?.replace(/\/+$/, "") ||
  "https://hypergaruda.netlify.app";
const NEXT_URL = "https://hypergaruda-next.netlify.app";

async function getSystemStatus(): Promise<SystemStatus | null> {
  try {
    const response = await fetch(`${ASTRO_URL}/api/system.json`, {
      cache: "no-store",
    });

    if (!response.ok) return null;
    return (await response.json()) as SystemStatus;
  } catch {
    return null;
  }
}

type LinkCardProps = {
  href: string;
  title: string;
  description: string;
  icon: string;
  badge?: string;
};

function LinkCard({
  href,
  title,
  description,
  icon,
  badge,
}: LinkCardProps) {
  return (
    <a
      className="link-card"
      href={href}
      target="_blank"
      rel="noopener noreferrer"
    >
      <span aria-hidden="true" className="link-icon">
        {icon}
      </span>
      <span className="link-copy">
        <span className="link-title">{title}</span>
        <span className="link-description">{description}</span>
        {badge ? <span className="link-badge">{badge}</span> : null}
      </span>
      <span aria-hidden="true" className="link-arrow">
        ↗
      </span>
    </a>
  );
}

function CategorySummary({
  number,
  icon,
  title,
  description,
}: {
  number: string;
  icon: string;
  title: string;
  description: string;
}) {
  return (
    <summary className="category-summary">
      <span aria-hidden="true" className="category-icon">
        {icon}
      </span>
      <span className="category-copy">
        <span className="category-number">{number}</span>
        <span className="category-title">{title}</span>
        <span className="category-description">{description}</span>
      </span>
      <span aria-hidden="true" className="category-chevron">
        ⌄
      </span>
    </summary>
  );
}

export default async function Home() {
  const system = await getSystemStatus();

  return (
    <main className="linkhub-page">
      <div aria-hidden="true" className="ambient ambient-blue" />
      <div aria-hidden="true" className="ambient ambient-red" />

      <div className="linkhub-container">
        <header className="profile-header">
          <div aria-label="HyperGaruda monogram" className="profile-avatar">
            HG<span>.</span>
          </div>
          <p className="eyebrow">PERSONAL LINK HUB</p>
          <h1>
            Hyper<span>Garuda</span>
          </h1>
          <p className="profile-bio">
            TKJ student exploring networking, Linux, AI, open source, and
            motorsport technology.
          </p>
          <div aria-label="Interests" className="profile-tags">
            <span>NETWORKING</span>
            <span>LINUX</span>
            <span>AI</span>
            <span>MOTORSPORT</span>
          </div>
        </header>

        <section aria-labelledby="links-heading" className="links-section">
          <div className="section-heading">
            <div>
              <p className="eyebrow">EXPLORE MY CORNER OF THE INTERNET</p>
              <h2 id="links-heading">Find your way.</h2>
            </div>
            <span className="section-count">07 CATEGORIES</span>
          </div>

          <div className="category-list">
            <details className="category-card">
              <CategorySummary
                number="01"
                icon="🌐"
                title="Main Portfolio"
                description="Choose the portfolio experience"
              />
              <div className="category-panel">
                <p className="panel-intro">
                  Choose between the main Astro portfolio and its Next.js
                  companion.
                </p>
                <div className="link-list">
                  <LinkCard
                    href={ASTRO_URL}
                    title="Astro Portfolio"
                    description="Main HyperGaruda portfolio"
                    icon="✦"
                    badge="MAIN SITE"
                  />
                  <LinkCard
                    href={NEXT_URL}
                    title="Next.js Portfolio"
                    description="Interactive companion link hub"
                    icon="◈"
                    badge="NEXT.JS"
                  />
                </div>
              </div>
            </details>

            <details className="category-card">
              <CategorySummary
                number="02"
                icon="◎"
                title="Social Media"
                description="Find and follow my profiles"
              />
              <div className="category-panel">
                <div className="link-list">
                  <LinkCard
                    href="https://www.instagram.com/muhamad_farhannn_?vrfl=MTl0YTFjbHJrcmM5MA=="
                    title="Instagram"
                    description="@muhamad_farhannn_"
                    icon="📸"
                  />
                  <LinkCard
                    href="https://www.threads.com/@muhamad_farhannn_"
                    title="Threads"
                    description="@muhamad_farhannn_"
                    icon="＠"
                  />
                  <LinkCard
                    href="https://www.linkedin.com/in/muhammad-farhan-a08897439?utm_source=share_via&utm_content=profile&utm_medium=member_android"
                    title="LinkedIn"
                    description="Professional profile"
                    icon="in"
                  />
                  <LinkCard
                    href="https://www.behance.net/farhanzet_22"
                    title="Behance"
                    description="Creative work and portfolio"
                    icon="Bē"
                  />
                  <LinkCard
                    href="https://github.com/Hanzet22"
                    title="GitHub"
                    description="Repositories and open-source work"
                    icon="⌘"
                  />
                  <LinkCard
                    href="https://v.douyin.com/ECQLLZK3pbY/"
                    title="Douyin"
                    description="Short-video profile"
                    icon="♪"
                  />
                </div>
              </div>
            </details>

            <details className="category-card">
              <CategorySummary
                number="03"
                icon="🎓"
                title="Education"
                description="Education journey, in chronological order"
              />
              <div className="category-panel">
                <p className="panel-intro">
                  Four stages of my education. Use each map link to open the
                  location in Google Maps.
                </p>
                <div className="education-timeline">
                  <article className="education-item">
                    <span className="timeline-marker">01</span>
                    <div className="education-copy">
                      <span className="timeline-kicker">EARLY EDUCATION</span>
                      <h3>Taman Kanak-Kanak (TK)</h3>
                      <p>First stage of the education journey.</p>
                      <a
                        className="map-link"
                        href="https://maps.app.goo.gl/UF8CYjSwcHdPBXep9"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Open Google Maps <span aria-hidden="true">↗</span>
                      </a>
                    </div>
                  </article>
                  <article className="education-item">
                    <span className="timeline-marker">02</span>
                    <div className="education-copy">
                      <span className="timeline-kicker">PRIMARY EDUCATION</span>
                      <h3>MI / SD</h3>
                      <p>Madrasah Ibtidaiyah / Sekolah Dasar.</p>
                      <a
                        className="map-link"
                        href="https://maps.app.goo.gl/jiyFBYEPTYzvWwkX8"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Open Google Maps <span aria-hidden="true">↗</span>
                      </a>
                    </div>
                  </article>
                  <article className="education-item">
                    <span className="timeline-marker">03</span>
                    <div className="education-copy">
                      <span className="timeline-kicker">JUNIOR SECONDARY</span>
                      <h3>MTs / SMP</h3>
                      <p>Madrasah Tsanawiyah / Sekolah Menengah Pertama.</p>
                      <a
                        className="map-link"
                        href="https://maps.app.goo.gl/tGZvGEoRBpZmkDsu5"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Open Google Maps <span aria-hidden="true">↗</span>
                      </a>
                    </div>
                  </article>
                  <article className="education-item">
                    <span className="timeline-marker">04</span>
                    <div className="education-copy">
                      <span className="timeline-kicker">VOCATIONAL EDUCATION</span>
                      <h3>SMK</h3>
                      <p>Vocational high school · TKJ / TJKT.</p>
                      <a
                        className="map-link"
                        href="https://maps.app.goo.gl/QsokiWBKapWCMrjA9"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Open Google Maps <span aria-hidden="true">↗</span>
                      </a>
                    </div>
                  </article>
                </div>
              </div>
            </details>

            <details className="category-card">
              <CategorySummary
                number="04"
                icon="✉️"
                title="Contact"
                description="Choose a channel to get in touch"
              />
              <div className="category-panel">
                <p className="panel-intro">
                  Response labels are estimates, not guaranteed response times.
                </p>
                <div className="link-list">
                  <LinkCard
                    href="mailto:farhanzet4@gmail.com"
                    title="Personal Email"
                    description="farhanzet4@gmail.com"
                    icon="✉"
                    badge="SLOW RESPONSE"
                  />
                  <LinkCard
                    href="mailto:hypergarudatkj@gmail.com"
                    title="HyperGaruda TKJ Email"
                    description="hypergarudatkj@gmail.com"
                    icon="✉"
                    badge="FAST RESPONSE"
                  />
                  <LinkCard
                    href="https://t.me/Hypergaruda"
                    title="Telegram"
                    description="@Hypergaruda"
                    icon="➤"
                    badge="SLOW RESPONSE"
                  />
                  <LinkCard
                    href="https://discord.com/app"
                    title="Discord Personal"
                    description="Username: hgi.id · Opens Discord"
                    icon="☷"
                    badge="SUPER SLOW RESPONSE"
                  />
                  <LinkCard
                    href="https://discord.com/app"
                    title="Discord Official"
                    description="Username: hgi_official · Opens Discord"
                    icon="☷"
                    badge="SLOW RESPONSE"
                  />
                  <LinkCard
                    href="https://wa.me/6285272995674"
                    title="WhatsApp"
                    description="Direct message"
                    icon="☏"
                    badge="SUPER FAST RESPONSE"
                  />
                </div>
                <p className="privacy-note">
                  Privacy matters. Share sensitive information only when
                  necessary and with people you trust.
                </p>
              </div>
            </details>

            <details className="category-card">
              <CategorySummary
                number="05"
                icon="⌘"
                title="Organization"
                description="Projects and community collaboration"
              />
              <div className="category-panel">
                <div className="link-list">
                  <LinkCard
                    href="https://github.com/TKJ-Team-SMKN1"
                    title="TKJ Team SMKN 1"
                    description="Organization GitHub profile"
                    icon="🛠️"
                    badge="ORGANIZATION"
                  />
                </div>
              </div>
            </details>

            <details className="category-card">
              <CategorySummary
                number="06"
                icon="▧"
                title="Website"
                description="Web experiments and replica projects"
              />
              <div className="category-panel">
                <h3 className="subsection-title">Personal & Experimental</h3>
                <div className="link-list">
                  <LinkCard
                    href="https://hanzet22.github.io/hypergaruda-API/"
                    title="HyperGaruda API"
                    description="GitHub Pages website"
                    icon="⌘"
                  />
                  <LinkCard
                    href="https://bnb-real-time-timeline.vercel.app/"
                    title="BNB Real-Time Timeline"
                    description="Real-time timeline project"
                    icon="◷"
                  />
                  <LinkCard
                    href="https://gabut-web-gl-aja.vercel.app/"
                    title="Gabut Web GL Aja"
                    description="WebGL experiment"
                    icon="◇"
                  />
                  <LinkCard
                    href="https://bsc-grid-next.vercel.app/"
                    title="BSC Grid Next"
                    description="Web project"
                    icon="▦"
                  />
                  <LinkCard
                    href="https://verus-miner-telemetry.vercel.app/"
                    title="Verus Miner Telemetry"
                    description="Mining telemetry website"
                    icon="⌁"
                  />
                </div>
                <h3 className="subsection-title subsection-spaced">
                  SMKN 1 Mandau · Website Replica
                </h3>
                <div className="link-list">
                  <LinkCard
                    href="https://smkn-1-mandau-replicas.vercel.app/"
                    title="Replica Website V1"
                    description="First version"
                    icon="01"
                    badge="V1"
                  />
                  <LinkCard
                    href="https://smkn1mandau-replika-rtd.vercel.app/"
                    title="Replica Website V2"
                    description="Second version"
                    icon="02"
                    badge="V2"
                  />
                </div>
              </div>
            </details>

            <details className="category-card">
              <CategorySummary
                number="07"
                icon="⑂"
                title="Roadmap Project"
                description="HG-ESR-NET development timeline"
              />
              <div className="category-panel">
                <p className="panel-intro">
                  Follow the repositories across the development stages, from
                  early experiments to the release repository.
                </p>
                <div className="roadmap-timeline">
                  <article className="roadmap-item">
                    <span className="roadmap-marker">01</span>
                    <div className="roadmap-copy">
                      <span className="timeline-kicker">FIRST DEVELOPMENT</span>
                      <h3>Initial Experiments</h3>
                      <a
                        href="https://github.com/Hanzet22/Gatau-ini-apaan-"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="repository-link"
                      >
                        Gatau-ini-apaan- <span aria-hidden="true">↗</span>
                      </a>
                    </div>
                  </article>
                  <article className="roadmap-item">
                    <span className="roadmap-marker">02</span>
                    <div className="roadmap-copy">
                      <span className="timeline-kicker">SECOND DEVELOPMENT</span>
                      <h3>Custom Inference Universal</h3>
                      <a
                        href="https://github.com/Hanzet22/Custom-Inference-Universal"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="repository-link"
                      >
                        Open repository <span aria-hidden="true">↗</span>
                      </a>
                    </div>
                  </article>
                  <article className="roadmap-item">
                    <span className="roadmap-marker">03</span>
                    <div className="roadmap-copy">
                      <span className="timeline-kicker">THIRD DEVELOPMENT</span>
                      <h3>Inference Modification</h3>
                      <a
                        href="https://github.com/Hanzet22/Inference-Modification"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="repository-link"
                      >
                        Open repository <span aria-hidden="true">↗</span>
                      </a>
                    </div>
                  </article>
                  <article className="roadmap-item roadmap-release">
                    <span className="roadmap-marker">✓</span>
                    <div className="roadmap-copy">
                      <span className="timeline-kicker">RELEASE REPOSITORY</span>
                      <h3>HG-ESR-NET</h3>
                      <a
                        href="https://github.com/Hanzet22/HG-ESR-NET"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="repository-link"
                      >
                        Open release repository <span aria-hidden="true">↗</span>
                      </a>
                    </div>
                  </article>
                </div>
              </div>
            </details>
          </div>
        </section>

        <section aria-labelledby="system-heading" className="system-card">
          <div className="system-card-heading">
            <div>
              <p className="eyebrow">INTEGRATED SYSTEM</p>
              <h2 id="system-heading">Astro Core</h2>
            </div>
            <span className={`system-status ${system ? "is-online" : "is-unknown"}`}>
              <span aria-hidden="true" className="status-dot" />
              {system ? "Connected" : "Unavailable"}
            </span>
          </div>
          {system ? (
            <div className="system-details">
              <p>
                <span>Application</span>
                <strong>{system.application}</strong>
              </p>
              <p>
                <span>Status</span>
                <strong>{system.status}</strong>
              </p>
              <p>
                <span>Runtime</span>
                <strong>{system.runtime}</strong>
              </p>
              <p>
                <span>Bundler</span>
                <strong>{system.bundler}</strong>
              </p>
              <p className="system-timestamp">
                <span>Last response</span>
                <strong>{system.generatedAt}</strong>
              </p>
            </div>
          ) : (
            <p className="system-fallback">
              Astro Core status could not be loaded. The portfolio and project
              links above remain available.
            </p>
          )}
          <a className="system-link" href={ASTRO_URL} target="_blank" rel="noopener noreferrer">
            Visit main portfolio <span aria-hidden="true">↗</span>
          </a>
        </section>

        <footer className="site-footer">
          <p className="footer-motto">PRIVACY IS NOT OPTIONAL</p>
          <p>HyperGaruda · Built with Next.js</p>
          <a href="#links-heading">Back to top ↑</a>
        </footer>
      </div>
    </main>
  );
}
