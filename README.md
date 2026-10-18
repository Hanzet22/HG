# HyperGaruda Portfolio

The HyperGaruda portfolio is a small ecosystem of connected websites and projects maintained under the **HyperGaruda** identity. This workspace covers the main Astro portfolio and its companion Next.js Link Hub; the documentation and third-party-media policy apply across both sites, not only one application.

> **Privacy is not optional.**

## Live Projects

| Project | Description | Website |
| --- | --- | --- |
| Main Portfolio | Primary portfolio website built with Astro | https://hypergaruda.netlify.app/ |
| HyperGaruda Link Hub | Companion directory for portfolio pages, profiles, communities, projects, and selected resources; built with Next.js | https://hypergaruda-next.netlify.app/ |
| GitHub Profile | Source-code projects and development activity | https://github.com/Hanzet22 |
| HG-ESR-NET | Image-upscaling and restoration project | https://github.com/Hanzet22/HG-ESR-NET |

These links are provided for convenience. Deployment availability and features may change over time.

## Scope of This Workspace

This documentation is intended for the **whole portfolio workspace**. It covers both live websites, shared project information, and third-party works that may be linked, embedded, displayed, or hosted by either site.

A simplified guide to the intended layout is:

```text
Portfolio-work/
├── README.md                  # Portfolio-wide overview and development notes
├── ATTRIBUTIONS.md             # Third-party credits, rights status, and takedown process
├── [Astro portfolio files]     # Main portfolio application and its assets/configuration
└── HyperGaruda-Next/
    ├── app/                    # Next.js App Router application
    ├── package.json            # Project scripts and dependencies, if present
    └── ...                     # Other Next.js configuration and files
```

This is a **conceptual map**, not a complete file listing. Keep the two documentation files at the `Portfolio-work/` level so they describe both projects. The Next.js application may also have its own app-specific documentation, but it should not replace this portfolio-wide documentation.

## Main Astro Portfolio

- **Live site:** https://hypergaruda.netlify.app/
- **Framework:** Astro
- **Purpose:** The primary portfolio website.

To run or build the Astro site locally, work from the actual Astro project directory and follow the package manager, lockfile, and scripts defined by that project. For an npm-based setup, the common commands are:

```bash
npm install
npm run dev
```

Check the project's `package.json` before relying on a particular script. Build and preview commands can vary by project configuration.

## HyperGaruda Next.js Link Hub

- **Live site:** https://hypergaruda-next.netlify.app/
- **Framework:** Next.js with the App Router
- **Purpose:** A companion navigation hub for portfolio pages, social profiles, contact routes, education links, community and website directories, and selected projects.

Its interface uses expandable categories, responsive styling, external links, and an Astro Core status panel. The status panel requests the main portfolio's `/api/system.json` endpoint when available; this endpoint check is not a guarantee that the entire Astro site is healthy.

From the `HyperGaruda-Next/` directory, use the scripts defined in that application's `package.json`. For an npm project whose standard scripts are present, the usual development commands are:

```bash
npm install
npm run dev
```

The local development URL is printed by the server, commonly `http://localhost:3000`. Check the package scripts before running production build/start commands.

### Astro Core Endpoint

The Link Hub uses this default endpoint for its Astro Core status panel:

```text
https://hypergaruda.netlify.app/api/system.json
```

Where supported by the app, `PORTFOLIO_BASE_URL` can override the base URL. The value should be the base URL only, without `/api/system.json`:

```dotenv
PORTFOLIO_BASE_URL=https://hypergaruda.netlify.app
```

Only configure this variable if the current Link Hub source supports it. Restart local development or redeploy after changing environment variables.

## Development and Maintenance

- Keep links, project descriptions, and status information accurate.
- Use accessible names and maintain responsive layouts across mobile and desktop screens.
- Treat external links and externally hosted files as third-party dependencies that can change or disappear.
- Do not publish credentials, private tokens, private contact details, or other sensitive information in source files or public issues.
- When a third-party image, video, audio clip, logo, character, or other work is added to **either** site, update [`ATTRIBUTIONS.md`](./ATTRIBUTIONS.md).
- Record the source, creator/uploader where known, where the material appears, the relevant license or permission, and whether that information has been verified.

## Attribution, Copyright, and Takedown Requests

Some pages may link to, embed, display, or reference material created by other people. A credit or source link **does not automatically grant permission** to download, modify, re-host, or redistribute a work. A permission status that is not recorded as verified in [`ATTRIBUTIONS.md`](./ATTRIBUTIONS.md) must not be represented as confirmed.

Rights holders or authorized representatives may contact the maintainer via the [GitHub profile](https://github.com/Hanzet22) or the repository's [Issues page](https://github.com/Hanzet22/HG/issues). Public issues are visible to others, so do not post private or sensitive information there. Requests should identify the affected page or asset, the original work/source if available, the requestor's relationship to the rights holder, and the action requested. Requests will be reviewed in good faith, and access to the affected material may be restricted or the material removed where appropriate while the matter is reviewed.

This is a voluntary contact and review process; it does not replace any applicable legal process or determine the legal status of a particular use.

## License

Consult the applicable `LICENSE` file for the license that actually applies to the portfolio's own code. This README does not itself grant a license, and it does not claim that AGPL-3.0 or any other license is active unless the relevant license file is present and applicable.

A code license does **not** automatically cover third-party videos, images, music, characters, logos, trademarks, or other independently owned works. Those remain subject to their owners' rights and the relevant license or permission.

## Related Documentation

- [`ATTRIBUTIONS.md`](./ATTRIBUTIONS.md) — known third-party sources, attribution details, status of permissions, and the copyright/takedown review process.

---

Built for the HyperGaruda portfolio ecosystem.
