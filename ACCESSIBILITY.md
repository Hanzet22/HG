# Accessibility remediation status

**Scope:** WCAG 2.2 Level A and AA  
**Repository:** `Hanzet22/HG`  
**Working branch:** `portfolio-setup`  
**Last source review:** 2026-11-27

This document records source-level remediation and static checks. It is not a formal WCAG conformance claim, certification, or substitute for testing the rendered pages with browsers and assistive technologies.

## Color vision and display adaptation

- Added an optional, locally stored display-support panel with ten presentation profiles (P00–P09).
- P01–P06 use clinical terms only as preference labels; they do not diagnose, simulate, or correct a named condition. They share non-color cues and stronger component boundaries.
- P07 reduces decorative color on selected surfaces; P08 strengthens boundaries and link underlines; P09 exposes manual display controls.
- Added shape distinctions to response-speed markers and underlined inline links in main-content paragraphs. Status wording remains visible.
- No global hue filter is applied, and user images/videos are not recolored. Preference data stays in browser local storage and is not sent to the site.
- Full rationale, profile definitions, evidence, WCAG mapping, and remaining validation are documented in CVD-ADAPTATION.md.

## Implemented

### Astro portfolio

- Improved active-navigation text contrast with the `--accent-text` token.
- Added a visible-on-focus skip link to all 12 HTML pages, targeting a matching focusable `main` landmark. The static links work without JavaScript; the script retains a fallback for pages without a static link.
- Exposed the current page with `aria-current="page"` on the primary navigation links, including Social Media and Contact.
- Excluded the external Dynamic Hub companion link from current-page matching and clear any stale `aria-current` state before revealing it; this prevents two navigation items from being announced as the current page.
- Moved the fixed Back to Top control above the Netlify-injected bottom-right badge observed in production, avoiding their overlapping hit areas. Removed the mobile `bottom: 14px` override so the same `bottom: 80px` clearance is retained at narrow viewports.
- Preserved Escape-key menu dismissal and focus restoration to the navigation toggle.
- Increased the minimum hit area for desktop navigation, project links, social links, and secondary contact links to at least 24 CSS pixels in the constrained dimension.
- Registered `join.html` in the legacy asset router and repaired the malformed import line.
- Removed always-running decorative infinite animations from the Teapot and rate-limit error-page icons.
- Removed autoplay, mute, and looping from the four Astro error-page videos. They remain user-initiated, with native controls and metadata-only preload.
- Added accessible names to the four embedded error-page video players.
- Marked Indonesian passages with `lang="id"` where present.

### Next.js companion

- Set the document language to English and marked Indonesian passages—including the Indonesian repository title—with `lang="id"`.
- Added appropriate image/group semantics to the profile monogram and interests list.
- Updated the animation toggle's accessible name so it contains its visible label.
- Increased footer, map, repository, and system links to a minimum 24 CSS-pixel target size.
- Raised footer text contrast.
- Added route-specific metadata titles for the 404, 403, 429, and 418 pages using the Next.js Metadata API.
- Disabled the always-on avatar animation; the optional advanced animation pack remains user-toggleable.
- Added accessible names to the two embedded error-page video players.
- Added a global skip link before the animation control in the root layout; all five Next.js routes now provide a focusable `main#main-content` target.
- Raised the small footer labels on the Next.js 404, 403, 418, and 429 pages from Tailwind `slate-600` to the project secondary-text color `#74839b`; the measured contrast against `#080b12` is approximately **5.12:1**, replacing a failing **2.60:1** combination.
- Added a final `prefers-reduced-motion: reduce` override after all animation declarations so it disables animations and smooth scrolling regardless of CSS cascade order.

## Source-level verification completed
- The optional CVD display-support panel exposes ten P00–P09 presentation profiles and three visual-emphasis levels.
- The six clinical-name profiles are explicitly non-diagnostic preference labels; no subtype-specific hue transformation or global filter is applied.
- Response-speed status markers retain visible text and add distinct shapes; inline links in main-content paragraphs receive underlines.
- Preference storage is local to the browser; no preference telemetry or medical-data collection is implemented.
- Static CVD audit (node scripts/audit-cvd-adaptation.mjs) passes: 10 profiles, 12 legacy HTML pages, local-only preference storage, shape-based status cues, and no global color filter.
- The Astro production build and astro check pass after this change with 0 errors, 0 warnings, and 0 hints. Static display-panel contrast checks: #d0d0d8/#12121a 12.15:1, #c5c5ce/#12121a 10.87:1, #ff927d/#12121a 8.57:1, and white/#cc2200 5.53:1.


- All 12 Astro HTML pages have `lang="en"`, a page title, one main landmark, a skip link targeting that landmark, and a focusable main target.
- All images in those pages have an `alt` attribute.
- Static anchor checks found no links without an accessible name.
- The Astro join page is registered in the source router.
- Primary page navigation exposes the current page with `aria-current="page"`.
- Static source review confirms the Dynamic Hub placeholder is excluded from route matching and its current-page state is removed when the external companion URL is assigned.
- Static CSS/JavaScript review confirms the Astro Back to Top control retains `bottom: 80px` at desktop and mobile breakpoints, clear of the observed 64-pixel-high Netlify badge region.
- Next.js source includes nine native `details` disclosure categories; their summary controls are native HTML.
- Next.js language, metadata, ARIA, target-size, and reduced-motion changes were re-fetched from the working branch and checked.
- Static source verification confirms the root layout places the skip link before other controls, and the home, 404, 403, 418, and 429 routes each expose a unique `main#main-content` with `tabIndex={-1}`.
- Static contrast calculations:
  - Astro active-navigation text `#ff927d` on `#0a0a0f`: **9.09:1**.
  - Astro active-navigation text `#ff927d` on `#12121a`: **8.57:1**.
  - Next.js footer text `#9aa8bd` on `#080b12`: **8.16:1**.
  - Next.js secondary text `#74839b` on `#080b12`: **5.12:1** and on `#111622`: **4.70:1**.
- Next.js error-page footer text on the 404, 403, 418, and 429 pages before remediation (`#475569` / Tailwind `slate-600`) on `#080b12`: **2.60:1**; corrected source token `#74839b` on `#080b12`: **5.12:1**.
- The six embedded players (four Astro and two Next.js) have accessible names and native controls. The Astro players no longer autoplay or loop.

## Still requires browser or media verification

1. **Captions and video alternatives:** none of the six players currently has a `track` captions element. There are five unique MP4 sources. The media host did not provide inspectable media content through the available retrieval tools, so the audio tracks and visual content could not be verified.
   - For Jvan's **“Watch Out for Lemon Attack”** clip, the user initially reported that the YouTube transcript panel was empty. A subsequent read-only lookup of the original YouTube source on 2026-11-27 found an **English auto-generated (ASR) caption track** with two returned segment starts at **00:01.28** and **00:04.96**. A user-provided Gemini Hydrogen analysis had separately identified audible lyric/speech segments around **00:01** and **00:07**. These observations do not agree exactly: the YouTube source is six seconds long, while the provider's returned segment-duration fields appear to extend beyond that duration. Treat the machine-generated timings as provisional and verify them against playback before using them.
   - The exact Catbox MP4 and portfolio page corresponding to Jvan's original YouTube clip are still not recorded in `ATTRIBUTIONS.md`; do not assume the YouTube caption track is attached to or synchronized with any embedded Catbox file. This remains partial evidence, not a complete caption file or proof of full caption coverage. The lyric/dialogue text is intentionally not copied into this audit.
   - Captions must represent the relevant audio throughout the clip, not just the two identified moments. This includes dialogue, speaker identification where needed, and meaningful non-speech audio such as sound effects or music. Review the entire clip before deciding that captions are complete.
   - If a file is video-only, WCAG 1.2.1 (Level A) requires a time-based media alternative or an audio track conveying equivalent information. If synchronized audio is present, 1.2.2 (Level A) requires captions, except when the media is a clearly labeled alternative for text. For synchronized video, 1.2.3 (Level A) requires a media alternative or audio description and 1.2.5 (Level AA) requires audio description, unless the stated media-alternative exception applies. Do not invent captions or descriptions; inspect the actual media and prepare accurate alternatives.
2. **Flashing content:** the Japanese-titled FurDance source title includes a flashing-lights warning. That warning is not evidence of WCAG compliance or non-compliance. Inspect the actual video against 2.3.1 (Level A), including the largest supported presentation size; do not infer flash frequency or threshold results from the title alone.
3. **Keyboard testing:** a live browser spot-check of the Astro homepage on 2026-11-27 traversed the first 12 focusable elements. Each showed a discernible 2 CSS-pixel gold outline; none was clipped or covered. This is limited to one page and the initial focus sequence. Continue testing all routes, menu open/close, Escape focus restoration, complete focus order, and fixed controls.
4. **Responsive testing:** a controlled live-browser check of the Astro homepage at a 320 CSS-pixel viewport on 2026-11-27 found `document.documentElement.clientWidth = 305` and `document.body.scrollWidth = 305`; the About heading measured `265/265` scroll/client width at a computed font size of `28.8px`. No horizontal overflow was observed in that state. An earlier run reported conflicting dimensions while the browser viewport was not confirmed at 320px, so that result was discarded. This historical spot-check has been superseded by the 2026-11-28 Playwright suite: all 12 routes are checked at 320 CSS pixels, with a 200% root text-size emulation and WCAG 1.4.12 spacing overrides. Full browser zoom at 200% remains a manual validation item.
5. **Assistive technology:** inspect the accessibility tree and test with at least one screen reader on desktop and mobile.
6. **Visual states:** verify text and non-text contrast across gradients, backgrounds, hover, focus, active, expanded, and status states. Static token calculations do not cover every composited surface or state.
7. **Media behavior:** inspect the actual audio/video tracks, captions, visual description needs, flashing, and native control behavior in a browser.
8. **Rendered behavior:** validate each route and the full page/process in current browsers. Automated scans can find some machine-detectable issues but cannot establish full WCAG conformance.

## Deployment status

The CVD adaptation and the pending source-level accessibility remediations are committed to the Netlify production branch `portfolio-setup` at commit `af16001c232e26a82adc92af7b519b81d69b40c2`. The latest published Netlify deployment checked after that commit is still the previous ready deployment (commit `9acd2eb7b3c0b23f9ada6a0232e5be959a5205f9`). The source changes are not confirmed live yet. The repository branch is updated; verify a new production deployment before claiming that the live site has received these changes.

### Live production snapshot — 2026-11-27

The currently published pages were fetched separately from the working branch using live page retrieval. These are rendered markup/content observations, not a full interactive browser test; they do not establish keyboard, screen-reader, visual, timing, or complete media behavior.

- **Astro content routes:** the homepage exposes both Home and Dynamic Hub with `aria-current="page"`. The About, Projects, Experience, Missions, Social Media, and Contact routes each expose their own current-page link and also incorrectly mark Dynamic Hub as current. The live markup snapshots do not expose the source-branch skip link.
- **Host-injected overlay:** live markup includes a fixed Netlify badge at the bottom-right (`194 × 64` CSS pixels, very high stacking order). The source Back to Top control was also fixed at the bottom-right (`46 × 46`, `z-index: 999`), creating an overlapping region when visible. The source branch moves Back to Top upward and preserves the 80px offset on mobile after removing the conflicting 14px override; the host badge itself is not controlled by repository CSS. Check the live result after an authorized deployment and disable or reposition the badge in host settings if it still obscures content.
- **Astro join route:** `/join.html` still renders the custom 404 content instead of the Join & Contribute page. Treat this as a live route/content failure even though the page retrieval itself returned an HTML document.
- **Astro error routes:** the live `/404.html`, `/403.html`, `/418.html`, and `/429.html` video elements still include `autoplay`, `muted`, and `loop`, and use `preload="auto"`. The fetched video elements do not expose accessible names and no caption `track` elements were found. The working-branch versions remove autoplay/mute/loop, use metadata preload, and add accessible names.
- **Next.js document language:** the live root, `/429`, `/Forbidden`, and `/Teapot` routes declare `lang="id"`. The working branch declares English at the document level and marks Indonesian passages individually with `lang="id"`.
- **Next.js bypass navigation:** the live root markup does not expose the new skip link or a matching focusable main target. The source branch now adds both through the root layout and route-level main landmarks.
- **Next.js media:** live `/429` and `/Teapot` video elements retain native controls but have no accessible name and no caption `track`. The working branch adds accessible names; caption completeness remains unverified because the media itself has not been inspected.
- **Source versus production:** the latest source-only footer contrast correction on the Next.js 404, 403, 418, and 429 pages is not present in production. The published sites remain on an older build.

The earlier bounded Firecrawl crawl on 2026-11-27 was throttled after 3 pages. A subsequent per-route Firecrawl pass fetched the six main content routes (About, Projects, Experience, Missions, Social Media, Contact), the 403/418/429 error routes, and all four Next.js routes; earlier individually fetched observations remain the basis for the Astro homepage, `/404.html`, and `/join.html`. A separate Parallel extraction covered the known routes, returned HTTP 404 for `/join.html`, and included a deliberately nonexistent Next.js route as a negative control. Several Parallel excerpts were cached from 2026-11-24, so use the direct Firecrawl markup snapshots for fresh rendered attributes and treat cached text as route/content corroboration only. Firecrawl credits were exhausted after these checks; no axe-core scan or additional browser session could be run.

A separate Parallel content-extraction pass requested 17 URLs: the 11 known Astro content/error routes and four live Next.js routes returned content, while `/join.html` returned HTTP 404 and a deliberately nonexistent Next.js test route returned HTTP 404 as expected. This is content-level route evidence, not a DOM, accessibility-tree, keyboard, or visual audit. Several excerpts were cached from 2026-11-24, so do not treat all 17 as fresh 2026-11-27 production snapshots.

These differences confirm that the production sites have not yet picked up the current branch changes. Do not treat a successful source-level check as evidence that the live deployment has been remediated.
## References

### Normative and official implementation references

- [WCAG 2.2 Recommendation](https://www.w3.org/TR/WCAG22/)
- [WCAG Evaluation Methodology (WCAG-EM) 2.0](https://www.w3.org/TR/WCAG-EM/) — W3C Group Note published 2026-07-23; use its scope, exploration, sampling, evaluation, and reporting steps to structure the assessment. It is informative methodology and does not replace WCAG's normative success criteria.
- [WCAG 2.2 Quick Reference](https://www.w3.org/WAI/WCAG22/quickref/)
- [Understanding Captions (Prerecorded)](https://www.w3.org/WAI/WCAG22/Understanding/captions-prerecorded.html)
- [Understanding Audio Description or Media Alternative (Prerecorded)](https://www.w3.org/WAI/WCAG22/Understanding/audio-description-or-media-alternative-prerecorded.html)
- [Understanding Audio Description (Prerecorded)](https://www.w3.org/WAI/WCAG22/Understanding/audio-description-prerecorded.html)
- [Understanding Three Flashes or Below Threshold](https://www.w3.org/WAI/WCAG22/Understanding/three-flashes-or-below-threshold.html)
- [Understanding Reflow](https://www.w3.org/WAI/WCAG22/Understanding/reflow.html)
- [Understanding Text Spacing](https://www.w3.org/WAI/WCAG22/Understanding/text-spacing.html)
- [Understanding Non-text Contrast](https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast.html)
- [Involving Users in Evaluating Web Accessibility](https://www.w3.org/WAI/test-evaluate/involving-users/)
- [Playwright Accessibility Testing](https://playwright.dev/docs/accessibility-testing)
- [Next.js Metadata API](https://nextjs.org/docs/app/api-reference/functions/generate-metadata)
- [Next.js not-found convention](https://nextjs.org/docs/app/api-reference/file-conventions/not-found)

### Empirical accessibility research

Research on cognitive accessibility and blind-user barriers supports testing with disabled people and reducing unnecessary cognitive burden. Research on automated evaluation also cautions against treating tool scans as a substitute for human evaluation. These studies inform inclusive engineering practice; they are not normative WCAG criteria.

- Gartland et al. (2022), [The State of Web Accessibility for People with Cognitive Disabilities: A Rapid Evidence Assessment](https://doi.org/10.3390/bs12020026).
- Power et al. (2012), [Guidelines are only half of the story: accessibility problems encountered by blind users on the web](https://doi.org/10.1145/2207676.2207736).
- Vigo, Brown, and Conway (2013), [Benchmarking web accessibility evaluation tools: measuring the harm of sole reliance on automated tests](https://doi.org/10.1145/2461121.2461124).
- Martins, Pereira, and Duarte (2024), [QualState: Finding Website States for Accessibility Evaluation](https://doi.org/10.1145/3677846.3677851), describes how interaction-dependent states in single-page applications can be missed when evaluation tools inspect only the initial DOM. This supports testing expanded/collapsed and other meaningful UI states; it is research evidence, not a WCAG requirement.
- Fliti et al. (2026), [Flow-A11y: Flow-Aware Accessibility Testing](https://doi.org/10.48550/arXiv.2607.03100), evaluates runtime traces across 45 dynamic WCAG checks and 17 completed public-site scenarios. The reported pipeline reached 45.6% exact status accuracy, 41.4% failure precision, and 38.7% failure recall, with 39.7% of rows marked incomplete; the study did not test screen-reader/assistive-technology combinations. Treat it as evidence for flow-based testing and evidence-gated uncertainty—not as proof that an automated agent can certify conformance.
- Kalantari, Bagale, and Motti (2025), [Designing assistive technologies for and with neurodivergent users: considerations from research practice](https://doi.org/10.1093/iwc/iwaf037).


## CVD follow-up hardening — 2026-11-27

- Active engineering branch: `cvd-a11y-hardening` (based on `portfolio-setup`). This work is not yet merged into the production branch.
- Added a dedicated GitHub Actions validation workflow at `.github/workflows/cvd-accessibility.yml`. It runs the full npm audit, JavaScript syntax validation, the CVD source audit, Astro checks/build, Playwright + axe-core in Chromium, Firefox and WebKit, Next lint, and Next build. It does not invoke Netlify or deploy artifacts.
- Dialog geometry now uses border-box sizing to prevent its declared viewport width from overflowing after padding and borders are added. Dialog scrolling is contained.
- Checkbox controls now have 26 × 26 CSS-pixel input targets and a 26-pixel minimum label hit-area height, aligning with WCAG 2.2 SC 2.5.8 without relying on a spacing exception.
- WCAG mapping now includes SC 2.4.11 (Focus Not Obscured) and SC 2.5.8 (Target Size Minimum), in addition to the existing color, contrast, and focus criteria.
- Additional research records the limitations of small single-page CVD user surveys and the distinction between simulation-based screening and validation with people who have CVD.
- Deployment remains intentionally paused. The latest published Netlify deployment has not been changed by this branch.


- After refreshing the dependency lock, Astro 7.4.13, @astrojs/netlify 8.2.14, Next.js 16.4.6, and matching eslint-config-next were installed. Scoped overrides pin @vercel/nft 1.11.15, readdir-glob 4.0.0, and minimatch 11.0.9 in the Netlify packaging chain. A clean npm ci plus npm audit reports zero vulnerabilities. Astro check/build and Next lint/build pass locally. The unsafe forced adapter downgrade to 6.5.13 was not used.
- The Next workspace now includes an ESLint 9 flat config based on the official Next.js guidance: https://nextjs.org/docs/app/api-reference/config/eslint. Both npm run check:next and npm run build:next pass.
- The CI workflow now runs the full npm audit, CVD source audit, Astro checks/build, Playwright + axe-core browser regression across Chromium, Firefox, and WebKit against the Astro dev server, Next lint, and Next build. It installs Chromium, Firefox and WebKit and does not deploy. Documentation, browser tests, and Next workspace changes are included in its push-path filters.

- The Next motion toggle now uses React's external-store subscription pattern to hydrate from local storage without a synchronous state update inside an effect; it retains an in-memory fallback if storage is unavailable.
- Added the official Next.js ESLint flat configuration and corrected one JSX apostrophe. Next lint and build now pass locally.

- Browser testing found and fixed two shared-script collection errors that previously stopped initialization before the CVD panel, plus a route collision caused by lowercase root HTML filenames. Five legacy HTML sources were moved under legacy/ and their raw imports updated.

- The browser regression suite is maintained in scripts/test-cvd-browser.mjs and runs as npm run test:cvd:browser across Chromium, Firefox, and WebKit. It covers 12 canonical routes, full-page axe scans, dialog axe scan, all ten profiles, all emphasis levels, visible/unobscured keyboard focus, persistence/reset, storage-disabled behavior, 320px reflow, responsive resizing, touch emulation where supported, and reduced motion.
- Full-page axe scans returned zero violations on all 12 routes after removing the launcher's redundant aria-label; the visible “Display support” label now provides the accessible name.
- Responsive dialog sizing was changed from viewport-unit width/height caps to percentage-based max dimensions after the browser regression test found stale sizing during live viewport changes.

- Research documentation includes a separate biomedical evidence cross-check (optical filters and image recolouring) and explicitly distinguishes it from web UI validation.

- Cross-browser checks covered all 12 canonical routes and the open dialog with zero axe violations in Chromium, Firefox, and WebKit. Firefox mobile viewport emulation is skipped because Playwright Firefox does not support that mode; touch/mobile emulation is tested in Chromium and WebKit.

- The three-engine suite now also asserts 320px reflow on all 12 routes (no horizontal overflow), a visible 3px keyboard-focus outline, and an unobscured focused control. Per-engine results in the expanded suite: Chromium 43/43, WebKit 43/43, Firefox 42 passed plus one unsupported mobile-emulation case skipped; all three had zero axe violations across all routes and the open dialog.

- Previous full GitHub Actions result: run 46080898780 passed all 14 validation steps on branch cvd-a11y-hardening at commit 77a0bc40b05fa1b69c0ffd621afdaf50af2bc974. It includes the 31-group Chromium/Firefox/WebKit browser regression, full npm audit, Astro production build, Next lint/build, and no deployment step. The expanded 43-group suite is awaiting CI.

- Latest CVD hardening adds explicit Windows High Contrast / forced-colors support for the launcher and dialog using system color tokens. It was added after a forced-colors browser test exposed light-on-white contrast failures in the original dark palette.
- Playwright regression now includes 200% root text-size emulation on all 12 routes, WCAG 1.4.12 text-spacing overrides and emulated forced-colors mode (not a physical Windows High Contrast session). Current local runs: Chromium 43/43, WebKit 43/43, Firefox 42 passed with one mobile-emulation case skipped (unsupported in Playwright Firefox); all three have zero axe violations in forced-colors and text-spacing states.

- Biomedical cross-check added the 2023 saturation study (15 CVD participants; no significant overall high-vs-original saturation gain), the 2026 small notch-filter clinical trial (12 CVD test participants with mixed outcomes; no inferential group testing), and a 2024 web-chart user test (12 low-vision users, 4 with CVD; preferences varied). These findings do not justify a universal saturation boost or claim of clinical correction.
- A 2026 feasibility paper on automated CVD web-page screening (21 pages, maximum AUC 0.76) used non-CVD raters on simulated screenshots; it is useful as a triage concept but not direct CVD user validation: https://arxiv.org/abs/2606.22095.

- PubMed/PMC provider contracts were discovered through the Firecrawl Life Sciences catalogue, but no provider query ran because the connected Firecrawl balance was 0 credits (the attempted Europe PMC search was refused before execution). Firecrawl research-index and full-text paper reads did succeed. A further Undermind deep search was blocked by the workspace free-usage limit until 2026-11-28 00:30 UTC; existing Undermind PDFs and the completed CVD searches were used.

- Latest full CI before the 200% text-size test expansion: run 46080898780 passed all 14 steps on branch head 77a0bc40b05fa1b69c0ffd621afdaf50af2bc974. The expanded 43-group browser suite has passed locally in Chromium, Firefox and WebKit and is being pushed for another CI pass.
