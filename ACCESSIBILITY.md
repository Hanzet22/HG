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
- Added a final `prefers-reduced-motion: reduce` override after all animation declarations so it disables animations and smooth scrolling regardless of CSS cascade order.

## Source-level verification completed

- All 12 Astro HTML pages have `lang="en"`, a page title, one main landmark, a skip link targeting that landmark, and a focusable main target.
- All images in those pages have an `alt` attribute.
- Static anchor checks found no links without an accessible name.
- The Astro join page is registered in the source router.
- Primary page navigation exposes the current page with `aria-current="page"`.
- Next.js source includes nine native `details` disclosure categories; their summary controls are native HTML.
- Next.js language, metadata, ARIA, target-size, and reduced-motion changes were re-fetched from the working branch and checked.
- Static contrast calculations:
  - Astro active-navigation text `#ff927d` on `#0a0a0f`: **9.09:1**.
  - Astro active-navigation text `#ff927d` on `#12121a`: **8.57:1**.
  - Next.js footer text `#9aa8bd` on `#080b12`: **8.16:1**.
  - Next.js secondary text `#74839b` on `#080b12`: **5.12:1** and on `#111622`: **4.70:1**.
- The six embedded players (four Astro and two Next.js) have accessible names and native controls. The Astro players no longer autoplay or loop.

## Still requires browser or media verification

1. **Captions and video alternatives:** none of the six players currently has a `track` captions element. There are five unique MP4 sources. The media host did not provide inspectable media content through the available retrieval tools, so the audio tracks and visual content could not be verified. If synchronized audio is present, accurate captions are needed for WCAG 1.2.2 (Level A). Prerecorded video also needs an appropriate media alternative or audio description for 1.2.3 (Level A), and audio description for 1.2.5 (Level AA), unless the stated media-alternative exception applies. Do not invent captions or descriptions; inspect the actual media and prepare accurate alternatives.
2. **Keyboard testing:** verify first-focus skip links, menu open/close, Escape focus restoration, visible focus, focus order, and that fixed controls never obscure focused content.
3. **Responsive testing:** verify 320 CSS-pixel reflow, 200% text resize, and WCAG text-spacing overrides without clipping, overlap, or loss of functionality.
4. **Assistive technology:** inspect the accessibility tree and test with at least one screen reader on desktop and mobile.
5. **Visual states:** verify text and non-text contrast across gradients, backgrounds, hover, focus, active, expanded, and status states. Static token calculations do not cover every composited surface or state.
6. **Media behavior:** inspect the actual audio/video tracks, captions, visual description needs, flashing, and native control behavior in a browser.
7. **Rendered behavior:** validate each route and the full page/process in current browsers. Automated scans can find some machine-detectable issues but cannot establish full WCAG conformance.

## Deployment status

No deployment was initiated as part of this remediation. The live Netlify sites still serve the previously published build. The live Astro `/join.html` route returned 404 during the earlier production check. Source fixes are present on `portfolio-setup`; they will not affect production until a deployment is separately authorized.

## References

### Normative and official implementation references

- [WCAG 2.2 Recommendation](https://www.w3.org/TR/WCAG22/)
- [WCAG 2.2 Quick Reference](https://www.w3.org/WAI/WCAG22/quickref/)
- [Understanding Captions (Prerecorded)](https://www.w3.org/WAI/WCAG22/Understanding/captions-prerecorded.html)
- [Understanding Audio Description or Media Alternative (Prerecorded)](https://www.w3.org/WAI/WCAG22/Understanding/audio-description-or-media-alternative-prerecorded.html)
- [Understanding Audio Description (Prerecorded)](https://www.w3.org/WAI/WCAG22/Understanding/audio-description-prerecorded.html)
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
