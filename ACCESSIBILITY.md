# Accessibility remediation status

**Scope:** WCAG 2.2 Level A and AA  
**Repository:** `Hanzet22/HG`  
**Working branch:** `portfolio-setup`  
**Last source review:** 2026-11-27

This document records source-level remediation and verification. It is not a formal WCAG conformance claim or certification.

## Implemented

### Astro portfolio

- Changed the active navigation text to a high-contrast foreground color.
- Added a visible-on-focus skip link to all 12 HTML pages, with a matching `main` fragment target and `tabindex="-1"`. The static links work without JavaScript; the script retains a fallback for pages without a static link.
- Preserved Escape-key menu dismissal and focus restoration to the navigation toggle.
- Increased the minimum hit area for desktop navigation, project links, social links, and secondary contact links to at least 24 CSS pixels in the constrained dimension.
- Registered `join.html` in the legacy asset router and repaired the malformed import line.
- Removed always-running decorative infinite animations from the Teapot and rate-limit error pages.
- Repaired the `--accent-text` theme token declaration.
- Added accessible names to the four embedded error-page video players.

### Next.js companion

- Set the document language to English and marked Indonesian passages with `lang="id"`.
- Added appropriate image/group semantics to the profile monogram and interests list.
- Updated the animation toggle's accessible name so it contains its visible label.
- Increased footer, map, repository, and system links to a minimum 24 CSS-pixel target size.
- Raised footer text contrast.
- Added route-specific metadata titles for the 404, 403, 429, and 418 pages using the Next.js Metadata API.
- Disabled the always-on avatar animation; the optional advanced animation pack remains user-toggleable.
- Added accessible names to the two embedded error-page video players.

## Source-level verification completed

- All 12 Astro HTML pages have an English document language, a page title, one main landmark, a skip link targeting that landmark, and a focusable main target.
- All images in those pages have an `alt` attribute.
- Static anchor checks found no links without an accessible name.
- The Astro join page is now registered in the source router.
- Next.js language, metadata, ARIA, target-size, and motion changes were re-fetched from the working branch and checked.
- Contrast calculations identified and corrected the Astro active-navigation text and the Next.js footer text.
- Always-running infinite decorative CSS animations were removed from Astro error-page icons and the default Next.js avatar state.

## Still requires browser or media verification

1. **Captions:** the four Astro error videos and two Next.js error videos have accessible player names, but none currently has a `track` captions element. The media host could not be retrieved by the available page-fetch tools, so the audio content could not be verified. If any video contains meaningful audio, provide accurate captions before claiming 1.2.2 conformance.
2. **Keyboard testing:** verify first-focus skip links, menu open/close, Escape focus restoration, visible focus, and that fixed controls never obscure focused content.
3. **Responsive testing:** verify 320 CSS-pixel reflow, 200% text resize, and text-spacing overrides without clipping or overlap.
4. **Assistive technology:** inspect the accessibility tree and test with at least one screen reader on desktop and mobile.
5. **Visual states:** verify text and non-text contrast across gradients, hover, focus, active, and expanded states.
6. **Media behavior:** inspect audio tracks, captions, flashing, and pause/stop behavior in the actual browser.

## Deployment status

No deployment was initiated as part of this remediation. The live Netlify sites still serve the previously published build; the live Astro `/join.html` route returned 404 during verification. The source fix is present on `portfolio-setup`, but it will not affect production until a deployment is separately authorized.

## References

- [WCAG 2.2 Recommendation](https://www.w3.org/TR/WCAG22/)
- [WCAG 2.2 Quick Reference](https://www.w3.org/WAI/WCAG22/quickref/)
- [Next.js Metadata API](https://nextjs.org/docs/app/api-reference/functions/generate-metadata)
- [Next.js not-found convention](https://nextjs.org/docs/app/api-reference/file-conventions/not-found)
