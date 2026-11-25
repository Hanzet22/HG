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
      className="link-card hg-morph-glass"
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
            <span className="section-count">08 CATEGORIES</span>
          </div>

          <div className="category-list">
            <details className="category-card hg-morph-glass">
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

            <details className="category-card hg-morph-glass">
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

            <details className="category-card hg-morph-glass">
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

            <details className="category-card hg-morph-glass">
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

            <details className="category-card hg-morph-glass">
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

            <details className="category-card hg-morph-glass">
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

            <details className="category-card hg-morph-glass">
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

            <details className="category-card hg-morph-glass">
              <CategorySummary
                number="08"
                icon="⌘"
                title="GitHub Projects"
                description="Selected repositories from my current GitHub profile"
              />
              <div className="category-panel">
                <p className="panel-intro">
                  A curated snapshot of current projects. Visit the profile for
                  the complete repository list and the latest activity.
                </p>
                <div className="link-list">
                  <LinkCard href="https://github.com/Hanzet22/FORGE-TS" title="FORGE-TS" description="Native Android network and systems toolkit · Kotlin" icon="◇" badge="HANDOFF REFRESHED" />
                  <LinkCard href="https://github.com/Hanzet22/Security-Audit-MCP-Ver" title="Security-Audit-MCP-Ver" description="Read-only evidence-led source-code audit tools · MCP" icon="⌘" badge="v0.3.1 RELEASED" />
                  <LinkCard href="https://github.com/Hanzet22/HG-ESR-NET" title="HG-ESR-NET" description="Universal image super-resolution inference engine" icon="▧" badge="ACTIVE DEVELOPMENT" />
                  <LinkCard href="https://github.com/Hanzet22/HG-Plugin-Utils" title="HG-Plugin-Utils" description="Kotlin Aliucord plugin with custom UI and motion utilities" icon="✦" badge="v0.13.1" />
                  <LinkCard href="https://github.com/Hanzet22/FurFinder" title="FurFinder" description="Global furry community and convention discovery with protected submissions and authenticated moderation" icon="◎" badge="MODERATION CONSOLE" />
                  <LinkCard href="https://github.com/Hanzet22/hyperai-openrouter-backend" title="HyperAI Backend" description="AI chat client backend with Vercel and OpenRouter · Security 1.1 hardening tracked" icon="✧" badge="SECURITY 1.1" />
                  <LinkCard href="https://github.com/Hanzet22/Sekereper" title="HANZET-SCRAPER / Sekereper" description="Modular HTTP(S) scraping workbench with bounded jobs · Node 24 LTS and CodeQL" icon="⌁" badge="NODE 24 LTS" />
                  <LinkCard href="https://github.com/Hanzet22/hg-alpine-packages" title="hg-alpine-packages" description="Personal Alpine Linux package collection" icon="▤" />
                </div>
                <h3 className="subsection-title subsection-spaced">Complete personal repository directory · 44</h3>
                <p className="panel-intro">All personal repositories visible in the connected account snapshot. Repository presence does not imply active maintenance. Only PCAPDROID-JS-FEATURE is confirmed archived; older or experimental repositories are not automatically marked deprecated.</p>
                <div className="link-list">
                  <LinkCard href="https://github.com/YouTube-Downloader" title="YouTube-Downloader" description="Video download utility" icon="⌘" />
                  <LinkCard href="https://github.com/YouTube-Downloader-simple" title="YouTube-Downloader-simple" description="Simplified video download project" icon="⌘" />
                  <LinkCard href="https://github.com/PCAPDROID-JS-FEATURE" title="PCAPDROID-JS-FEATURE" description="PCAPdroid JavaScript feature fork" icon="⌘" badge="ARCHIVED" />
                  <LinkCard href="https://github.com/Custom-UI-HTML" title="Custom-UI-HTML" description="Custom HTML UI experiments" icon="⌘" />
                  <LinkCard href="https://github.com/GAN-Furry-Art-Photo" title="GAN-Furry-Art-Photo" description="Generative image research" icon="⌘" />
                  <LinkCard href="https://github.com/Sekereper" title="Sekereper" description="HTTP(S) scraping workbench" icon="⌘" />
                  <LinkCard href="https://github.com/LOD-Audio" title="LOD-Audio" description="Audio utility and scripting" icon="⌘" />
                  <LinkCard href="https://github.com/Ipeye-enbe" title="Ipeye-enbe" description="IP lookup experiment" icon="⌘" />
                  <LinkCard href="https://github.com/LTX-Video-Upscaler" title="LTX-Video-Upscaler" description="Video upscaling experiment" icon="⌘" />
                  <LinkCard href="https://github.com/hypergaruda-API" title="hypergaruda-API" description="HyperGaruda API project" icon="⌘" />
                  <LinkCard href="https://github.com/Gatau-ini-apaan-" title="Gatau-ini-apaan-" description="Early inference experiments" icon="⌘" />
                  <LinkCard href="https://github.com/Custom-Inference-Universal" title="Custom-Inference-Universal" description="Custom inference experiment" icon="⌘" />
                  <LinkCard href="https://github.com/Real-ESRGAN" title="Real-ESRGAN" description="Real-ESRGAN source/fork" icon="⌘" />
                  <LinkCard href="https://github.com/Hanzet22" title="Hanzet22" description="GitHub profile documentation" icon="⌘" />
                  <LinkCard href="https://github.com/Inference-Modification" title="Inference-Modification" description="Inference modification experiments" icon="⌘" />
                  <LinkCard href="https://github.com/TKJ-Dumps" title="TKJ-Dumps" description="Technical learning and Colab repository" icon="⌘" />
                  <LinkCard href="https://github.com/NETHERCAP" title="NETHERCAP" description="Network capture project" icon="⌘" />
                  <LinkCard href="https://github.com/spiderfoot" title="spiderfoot" description="SpiderFoot source/fork" icon="⌘" />
                  <LinkCard href="https://github.com/Cailin-Asistent-mod" title="Cailin-Asistent-mod" description="Modified assistant project" icon="⌘" />
                  <LinkCard href="https://github.com/HG-ESR-NET" title="HG-ESR-NET" description="Image restoration and super-resolution engine" icon="⌘" />
                  <LinkCard href="https://github.com/bnb-real-time-timeline" title="bnb-real-time-timeline" description="Real-time timeline web experiment" icon="⌘" />
                  <LinkCard href="https://github.com/gabut-web-gl-aja" title="gabut-web-gl-aja" description="WebGL experiment" icon="⌘" />
                  <LinkCard href="https://github.com/bsc-grid-next" title="bsc-grid-next" description="Grid web project" icon="⌘" />
                  <LinkCard href="https://github.com/furcon-compliance-audit" title="furcon-compliance-audit" description="FurCon compliance audit tooling" icon="⌘" />
                  <LinkCard href="https://github.com/Dumper-Metadata" title="Dumper-Metadata" description="Metadata utility" icon="⌘" />
                  <LinkCard href="https://github.com/JMoF-APK-Forensic-Investigation" title="JMoF-APK-Forensic-Investigation" description="Android APK investigation research" icon="⌘" />
                  <LinkCard href="https://github.com/JMoF-APK-Forensic-Investigation-Split" title="JMoF-APK-Forensic-Investigation-Split" description="Split APK investigation repository" icon="⌘" />
                  <LinkCard href="https://github.com/ESP8266-EvilTwin-Forked-" title="ESP8266-EvilTwin-Forked-" description="ESP8266 forked wireless-security research" icon="⌘" />
                  <LinkCard href="https://github.com/esp8266_deauther" title="esp8266_deauther" description="ESP8266 source/fork" icon="⌘" />
                  <LinkCard href="https://github.com/hyperai-openrouter-backend" title="hyperai-openrouter-backend" description="HyperAI OpenRouter backend" icon="⌘" />
                  <LinkCard href="https://github.com/smkn1mandau-replika-rtd" title="smkn1mandau-replika-rtd" description="SMKN 1 Mandau replica / RTD" icon="⌘" />
                  <LinkCard href="https://github.com/smkn1mandau-site" title="smkn1mandau-site" description="SMKN 1 Mandau website project" icon="⌘" />
                  <LinkCard href="https://github.com/JMoF-App-Rec" title="JMoF-App-Rec" description="JMoF application research" icon="⌘" />
                  <LinkCard href="https://github.com/hg-alpine-packages" title="hg-alpine-packages" description="Alpine Linux package collection" icon="⌘" />
                  <LinkCard href="https://github.com/HG" title="HG" description="HyperGaruda portfolio repository" icon="⌘" />
                  <LinkCard href="https://github.com/tg-assets" title="tg-assets" description="Project asset repository" icon="⌘" />
                  <LinkCard href="https://github.com/HG-Plugin-Utils" title="HG-Plugin-Utils" description="Kotlin Aliucord plugin utilities" icon="⌘" />
                  <LinkCard href="https://github.com/FptnClient-Android-Forked" title="FptnClient-Android-Forked" description="Android client fork" icon="⌘" />
                  <LinkCard href="https://github.com/FurFinder" title="FurFinder" description="Community and convention discovery" icon="⌘" />
                  <LinkCard href="https://github.com/Security-Audit-MCP-Ver" title="Security-Audit-MCP-Ver" description="Read-only security audit MCP toolkit" icon="⌘" />
                  <LinkCard href="https://github.com/github-stats-extended" title="github-stats-extended" description="GitHub statistics generator" icon="⌘" />
                  <LinkCard href="https://github.com/FORGE-TS" title="FORGE-TS" description="Android network and systems toolkit" icon="⌘" />
                  <LinkCard href="https://github.com/My-first-site-Anjay" title="My-first-site-Anjay" description="Early personal website experiment" icon="⌘" />
                  <LinkCard href="https://github.com/IWAG-replika-rtd" title="IWAG-replika-rtd" description="IWAG policy and replica research" icon="⌘" />
                </div>
                <h3 className="subsection-title subsection-spaced">Organization repositories · 4</h3>
                <p className="panel-intro">These repositories belong to their respective GitHub organizations and are accessible through the account; they are not presented as personally owned repositories.</p>
                <div className="link-list">
                  <LinkCard href="https://github.com/TKJ-Team-SMKN1/IL2CPP-Dumper-.NET" title="IL2CPP-Dumper-.NET" description="TKJ-Team-SMKN1 organization repository" icon="⌘" />
                  <LinkCard href="https://github.com/TKJ-Team-SMKN1/smkn1mandau-replika-rtd" title="smkn1mandau-replika-rtd" description="TKJ-Team-SMKN1 organization repository" icon="⌘" />
                  <LinkCard href="https://github.com/TKJ-Team-SMKN1/TKJ-Toolkit" title="TKJ-Toolkit" description="TKJ-Team-SMKN1 organization repository" icon="⌘" />
                  <LinkCard href="https://github.com/VRTcTeam/VRTc-SDK" title="VRTc-SDK" description="VRTcTeam organization repository" icon="⌘" />
                </div>
                <div className="link-list">
                  <LinkCard href="https://github.com/Hanzet22?tab=repositories" title="All GitHub Repositories" description="Browse the live Hanzet22 repository index" icon="↗" badge="GITHUB PROFILE" />
                </div>
              </div>
            </details>
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
