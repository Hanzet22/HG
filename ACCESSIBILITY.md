# Accessibility remediation status

**Scope:** WCAG 2.2 Level A and AA  
**Repository:** `Hanzet22/HG`  
**Working branch:** `portfolio-setup`  
**Last source review:** 2026-11-27

This document records source-level remediation and static checks. It is not a formal WCAG conformance claim, certification, or substitute for testing the rendered pages with browsers and assistive technologies.

## Implemented

### Astro portfolio

- Improved active-navigation text contrast with the `--accent-text` token.
- Added a visible-on-focus skip link to all 12 HTML pages, targeting a matching focusable `main` landmark. The static links work without JavaScript; the script retains a fallback for pages without a static link.
- Exposed the current page with `aria-current="page"` on the primary navigation links, including Social Media and Contact.
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
- Raised the small footer labels on the Next.js 403, 418, and 429 pages from Tailwind `slate-600` to the project secondary-text color `#74839b`; the measured contrast against `#080b12` is approximately **5.12:1**, replacing a failing **2.60:1** combination.
- Added a final `prefers-reduced-motion: reduce` override after all animation declarations so it disables animations and smooth scrolling regardless of CSS cascade order.

## Source-level verification completed

- All 12 Astro HTML pages have `lang="en"`, a page title, one main landmark, a skip link targeting that landmark, and a focusable main target.
- All images in those pages have an `alt` attribute.
- Static anchor checks found no links without an accessible name.
- The Astro join page is registered in the source router.
- Primary page navigation exposes the current page with `aria-current="page"`.
- Next.js source includes nine native `details` disclosure categories; their summary controls are native HTML.
- Next.js language, metadata, ARIA, target-size, and reduced-motion changes were re-fetched from the working branch and checked.
- Static source verification confirms the root layout places the skip link before other controls, and the home, 404, 403, 418, and 429 routes each expose a unique `main#main-content` with `tabIndex={-1}`.
- Static contrast calculations:
  - Astro active-navigation text `#ff927d` on `#0a0a0f`: **9.09:1**.
  - Astro active-navigation text `#ff927d` on `#12121a`: **8.57:1**.
  - Next.js footer text `#9aa8bd` on `#080b12`: **8.16:1**.
  - Next.js secondary text `#74839b` on `#080b12`: **5.12:1** and on `#111622`: **4.70:1**.
- Next.js error-page footer text before remediation (`#475569` / Tailwind `slate-600`) on `#080b12`: **2.60:1**; corrected source token `#74839b` on `#080b12`: **5.12:1**.
- The six embedded players (four Astro and two Next.js) have accessible names and native controls. The Astro players no longer autoplay or loop.

## Still requires browser or media verification

1. **Captions and video alternatives:** none of the six players currently has a `track` captions element. There are five unique MP4 sources. The media host did not provide inspectable media content through the available retrieval tools, so the audio tracks and visual content could not be verified.
   - For Jvan's **“Watch Out for Lemon Attack”** clip, the user initially reported that the YouTube transcript panel was empty. A subsequent read-only lookup of the original YouTube source on 2026-11-27 found an **English auto-generated (ASR) caption track** with two returned segment starts at **00:01.28** and **00:04.96**. A user-provided Gemini Hydrogen analysis had separately identified audible lyric/speech segments around **00:01** and **00:07**. These observations do not agree exactly: the YouTube source is six seconds long, while the provider's returned segment-duration fields appear to extend beyond that duration. Treat the machine-generated timings as provisional and verify them against playback before using them.
   - The exact Catbox MP4 and portfolio page corresponding to Jvan's original YouTube clip are still not recorded in `ATTRIBUTIONS.md`; do not assume the YouTube caption track is attached to or synchronized with any embedded Catbox file. This remains partial evidence, not a complete caption file or proof of full caption coverage. The lyric/dialogue text is intentionally not copied into this audit.
   - Captions must represent the relevant audio throughout the clip, not just the two identified moments. This includes dialogue, speaker identification where needed, and meaningful non-speech audio such as sound effects or music. Review the entire clip before deciding that captions are complete.
   - If a file is video-only, WCAG 1.2.1 (Level A) requires a time-based media alternative or an audio track conveying equivalent information. If synchronized audio is present, 1.2.2 (Level A) requires captions, except when the media is a clearly labeled alternative for text. For synchronized video, 1.2.3 (Level A) requires a media alternative or audio description and 1.2.5 (Level AA) requires audio description, unless the stated media-alternative exception applies. Do not invent captions or descriptions; inspect the actual media and prepare accurate alternatives.
2. **Flashing content:** the Japanese-titled FurDance source title includes a flashing-lights warning. That warning is not evidence of WCAG compliance or non-compliance. Inspect the actual video against 2.3.1 (Level A), including the largest supported presentation size; do not infer flash frequency or threshold results from the title alone.
3. **Keyboard testing:** a live browser spot-check of the Astro homepage on 2026-11-27 traversed the first 12 focusable elements. Each showed a discernible 2 CSS-pixel gold outline; none was clipped or covered. This is limited to one page and the initial focus sequence. Continue testing all routes, menu open/close, Escape focus restoration, complete focus order, and fixed controls.
4. **Responsive testing:** a controlled live-browser check of the Astro homepage at a 320 CSS-pixel viewport on 2026-11-27 found `document.documentElement.clientWidth = 305` and `document.body.scrollWidth = 305`; the About heading measured `265/265` scroll/client width at a computed font size of `28.8px`. No horizontal overflow was observed in that state. An earlier run reported conflicting dimensions while the browser viewport was not confirmed at 320px, so that result was discarded. This does not cover other routes, 200% text resize, or WCAG text-spacing overrides; those remain unverified.
5. **Assistive technology:** inspect the accessibility tree and test with at least one screen reader on desktop and mobile.
6. **Visual states:** verify text and non-text contrast across gradients, backgrounds, hover, focus, active, expanded, and status states. Static token calculations do not cover every composited surface or state.
7. **Media behavior:** inspect the actual audio/video tracks, captions, visual description needs, flashing, and native control behavior in a browser.
8. **Rendered behavior:** validate each route and the full page/process in current browsers. Automated scans can find some machine-detectable issues but cannot establish full WCAG conformance.

## Deployment status

No deployment was initiated as part of this remediation. The live Netlify sites still serve a previously published build. Source fixes are present on `portfolio-setup`; they will not affect production until a deployment is separately authorized.

### Live production snapshot — 2026-11-27

The currently published pages were fetched separately from the working branch using live page retrieval. These are rendered markup/content observations, not a full interactive browser test; they do not establish keyboard, screen-reader, visual, timing, or complete media behavior.

- **Astro content routes:** the homepage exposes both Home and Dynamic Hub with `aria-current="page"`. The About, Projects, Experience, Missions, Social Media, and Contact routes each expose their own current-page link and also incorrectly mark Dynamic Hub as current. The live markup snapshots do not expose the source-branch skip link.
- **Astro join route:** `/join.html` still renders the custom 404 content instead of the Join & Contribute page. Treat this as a live route/content failure even though the page retrieval itself returned an HTML document.
- **Astro error routes:** the live `/404.html`, `/403.html`, `/418.html`, and `/429.html` video elements still include `autoplay`, `muted`, and `loop`, and use `preload="auto"`. The fetched video elements do not expose accessible names and no caption `track` elements were found. The working-branch versions remove autoplay/mute/loop, use metadata preload, and add accessible names.
- **Next.js document language:** the live root, `/429`, `/Forbidden`, and `/Teapot` routes declare `lang="id"`. The working branch declares English at the document level and marks Indonesian passages individually with `lang="id"`.
- **Next.js bypass navigation:** the live root markup does not expose the new skip link or a matching focusable main target. The source branch now adds both through the root layout and route-level main landmarks.
- **Next.js media:** live `/429` and `/Teapot` video elements retain native controls but have no accessible name and no caption `track`. The working branch adds accessible names; caption completeness remains unverified because the media itself has not been inspected.
- **Source versus production:** the latest source-only footer contrast correction on the Next.js 403, 418, and 429 pages is not present in production. The published sites remain on an older build.

A fresh bounded Firecrawl crawl on 2026-11-27 was configured for the 12 Astro routes (including `/join.html`), but the service returned only 3 pages because the crawl was throttled at the connected account's concurrency limit. A follow-up per-route fetch could not run because the Firecrawl credit allowance was exhausted. This pass therefore does **not** claim a complete fresh live-route sweep; use the earlier individually fetched route observations above as the available evidence, and re-run the remaining live pages when Firecrawl access is available.

These differences confirm that the production sites have not yet picked up the current branch changes. Do not treat a successful source-level check as evidence that the live deployment has been remediated.
## References

### Normative and official implementation references

- [WCAG 2.2 Recommendation](https://www.w3.org/TR/WCAG22/)
- [WCAG Evaluation Methodology (WCAG-EM) 2.0](https://www.w3.org/TR/WCAG-EM/) — published 2026-07-23; use its scope, exploration, sampling, evaluation, and reporting steps to structure the assessment. It does not replace WCAG's normative success criteria.
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
- Kalantari, Bagale, and Motti (2025), [Designing assistive technologies for and with neurodivergent users: considerations from research practice](https://doi.org/10.1093/iwc/iwaf037).
