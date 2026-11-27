# Color Vision and Display Adaptation

**Product:** HyperGaruda Astro portfolio (hypergaruda.netlify.app)  
**Implementation:** Script.js and Style.css, loaded by the Astro legacy-asset route  
**Status:** Optional presentation support implemented; real-user validation remains outstanding.

## Purpose and boundaries

This feature provides user-controlled display preferences and redundant visual cues. It is not a medical tool, diagnostic questionnaire, or validated correction for any clinical color-vision condition.

The P01–P06 names use familiar clinical terms to help people find a preference. They all use the same conservative non-color support layer and stronger component boundaries; they do not apply subtype-specific hue matrices, simulate a clinical condition, or claim to correct that condition. A diagnosis label alone does not predict an individual's exact color discrimination.

The implementation does not recolor images or videos. It does not collect medical history or transmit preference data. The selected preference is stored in the current browser's local storage only. If browser storage is unavailable, the controls still work for the current page session.

## Ten presentation profiles

| ID | Profile | Behavior |
|---|---|---|
| P00 | Accessible Default | Baseline labels, link distinction, and shape-based status cues |
| P01 | Protanomaly Assist | Common non-color support layer and stronger component boundaries; not a diagnosis or protanomaly correction |
| P02 | Protanopia Assist | Common non-color support layer and stronger component boundaries; not a diagnosis or protanopia correction |
| P03 | Deuteranomaly Assist | Common non-color support layer and stronger component boundaries; not a diagnosis or deuteranomaly correction |
| P04 | Deuteranopia Assist | Common non-color support layer and stronger component boundaries; not a diagnosis or deuteranopia correction |
| P05 | Tritanomaly Assist | Common non-color support layer and stronger component boundaries; not a diagnosis or tritanomaly correction |
| P06 | Tritanopia Assist | Common non-color support layer and stronger component boundaries; not a diagnosis or tritanopia correction |
| P07 | Low-Chroma / Monochrome-Friendly | Removes decorative gradients and shadows from selected surfaces while preserving semantic text and status labels |
| P08 | High-Distinction UI | Stronger component boundaries and more prominent link underlines |
| P09 | Personal Calibration | Lets the user combine component-boundary and neutral-surface preferences manually |

The emphasis options—Subtle, Balanced, and Stronger—change visual emphasis only. They are not clinical severity levels.

## Implemented behavior

- A keyboard-operable “Display support” launcher opens a native dialog.
- Ten profiles can be selected without entering or disclosing a diagnosis.
- The user can adjust emphasis, component boundaries, and decorative surface treatment.
- Preferences are saved locally under hg-cvd-display-preferences-v1; no network request is made for the preference.
- The dialog announces profile changes through a polite live region and returns focus to its launcher when closed.
- Status meaning remains visible in text. The response-speed dot also uses shape differences: outlined circle, square, diamond, and double-ring treatment.
- Inline links inside main-content paragraphs are underlined rather than relying on color alone.
- Focus indicators remain visible and reduced-motion preferences are respected.
- No full-screen hue filter or image/video recoloring is applied.

## WCAG 2.2 mapping

- **1.4.1 Use of Color (Level A):** color is not the sole visual means for conveying status or distinguishing inline links; text and shape cues are retained.
- **1.4.3 Contrast (Minimum) (Level AA):** normal text requires at least 4.5:1; large text requires at least 3:1.
- **1.4.11 Non-text Contrast (Level AA):** meaningful UI component states and graphical objects generally require at least 3:1 against adjacent colors, subject to the criterion's exceptions. Thin strokes can be harder to perceive in practice even when their computed ratio passes.
- **2.4.7 Focus Visible (Level AA):** keyboard-operable controls need a mode in which focus is visible.
- **2.4.11 Focus Not Obscured (Minimum) (Level AA):** a focused component must not be entirely hidden by author-created content. The native modal path uses `showModal()` so focus is moved into the dialog and outside content is not interactive; test the launcher against sticky or host-injected overlays on every viewport.
- **2.5.8 Target Size (Minimum) (Level AA):** pointer targets are at least 24 × 24 CSS pixels unless a defined exception applies. The dialog's checkbox hit areas are 24 × 24 CSS pixels; the launcher, close control, select controls, and footer buttons exceed the minimum.

These criteria are necessary checks, not proof that two hues remain distinguishable to every person with CVD. WCAG contrast ratios measure relative luminance, not an individual's color discrimination. Criterion 2.5.8 has spacing and other exceptions; this implementation chooses to meet the 24-pixel minimum for its checkbox controls rather than rely on an exception.

## Research basis

- Geddes, Flatla, and Connelly (2023), “30 Years of Solving the Wrong Problem: How Recolouring Tool Design Fails those with Colour Vision Deficiency.” Qualitative work included 235 Reddit posts / 1,442 comments and 21 participants with CVD. Participants used filters in situational ways; filters could help compare colors but could also disrupt color naming or familiar lightness cues. DOI: https://doi.org/10.1145/3597638.3608407
- Geddes et al. (2025), “Designing for Colour Vision Deficiency: A Scoping Review of Resources That Support Designers in Choosing Accessible Colours.” The review included 113 papers; only 5 of 46 tool papers and 13 of 55 guideline papers recruited people with CVD. It highlights limited real-user evaluation and the need for context-sensitive redundant encoding. DOI: https://doi.org/10.1145/3663547.3746370
- Paiva, Siqueira, and Ferreira (2021), “The Windows 10's Color Filter Feature as an Aid for Color Blind People in the Use of Websites.” Fourteen participants evaluated nine static website scenarios; effects varied by group and task, so a generic filter is not a dependable fix. DOI: https://doi.org/10.1145/3472301.3484341
- Andrew and Tigwell (2025), “Understanding the Experiences of People With and Without Vision Impairments When Using Mobile User Interface Alternative Color Modes.” Interviews with 29 mobile users identified inconsistent coverage across interface elements and the value of coherent, user-adjustable modes. DOI: https://doi.org/10.1145/3743704
- Flatla and Gutwin (2012), “SSMRecolor: Improving Recoloring Tools with Situation-Specific Models of Color Differentiation.” A small controlled study found benefits from individualized, situation-specific modeling compared with tested generic recolorers; this does not validate a fixed set of population-wide presets. DOI: https://doi.org/10.1145/2207676.2208388

- Sajek, Korotenko, and Kyrychok (2025), “Research on the Accessibility of Different Colour Schemes for Web Resources for People with Colour Blindness.” A web-colour-scheme survey included 18 participants; the authors explicitly caution that the sample was small, adult and male-only, and evaluated one website page. This is useful direct user evidence, but not a broad validation basis. DOI: https://doi.org/10.3390/jimaging11080268
- Jiang, Arunkumar, and Bryan (2025), “The Hue-Man Factor: An Empirical Evaluation of Visualization Perception and Accessibility Across Color Vision Profiles.” Three studies combined simulated views, responses from participants with diagnosed CVD, and interviews. The authors report that simulations miss interpretive breakdowns and the role of structural cues and affective experience. DOI: https://doi.org/10.1109/TVCG.2025.3634261
- Jamil and Denes (2024), “Investigating Color Blind User Interface Accessibility via Simulated Interfaces.” This arXiv preprint uses non-CVD observers rating screenshots of 20 websites under simulated CVD. It can help screen for visual pitfalls, but it is not a substitute for participants with CVD. https://arxiv.org/abs/2401.10357
- Sajadi et al. (2013), “Using Patterns to Encode Color Information for Dichromats.” Two user studies found that pattern overlays can improve color-category interpretation; this supports redundant encoding as a complement to hue. DOI: https://doi.org/10.1109/TVCG.2012.93

## Validation still required

Engineering verification on 2026-11-27: JavaScript syntax check and the 10-profile / 12-route source audit passed; Astro check reported 0 errors, 0 warnings, and 0 hints; Astro build passed; the Next companion build also passed after dependency updates. GitHub Actions run 46003655165 completed successfully on the earlier CVD source state. A fresh workflow run is required for the final dependency, lint, and documentation updates; the latest run must be checked before merging.

Static token contrast checks also pass: dialog body text #d0d0d8 on #12121a = 12.15:1; hint text #c5c5ce on #12121a = 10.87:1; focus indicator #c0a020 on #12121a = 7.36:1; and white primary-button text on #cc2200 = 5.53:1. These are source-token calculations, not a substitute for measuring all rendered states and adjacent backgrounds.

The dependency audit initially reported 24 vulnerabilities (17 moderate, 7 high). The dependency tree was refreshed to Astro 7.4.13, @astrojs/netlify 8.2.14, and Next.js 16.4.6. Compatible scoped npm overrides pin @vercel/nft 1.11.15, readdir-glob 4.0.0, and minimatch 11.0.9 within the Netlify packaging chain. A clean npm ci then reported zero vulnerabilities, and Astro check/build plus Next lint/build all passed locally. The overrides avoid the unsafe forced downgrade to @astrojs/netlify 6.5.13. The lockfile is reproducible with npm ci.

The Next companion now has an ESLint 9 flat configuration based on the official Next.js ESLint guidance; Next lint and build pass. This implementation has passed the Astro build and source type check, but it has not been tested with a representative group of people with CVD. It is not a WCAG conformance certification.

Before claiming full conformance, test every route and relevant state in desktop and mobile browsers, including:
- P00–P09 selection, all three emphasis levels, manual toggles, reset, persistence, and storage-disabled behavior;
- keyboard opening, focus order, Escape dismissal, focus restoration, and screen-reader announcement;
- 320 CSS-pixel reflow, zoom/text resize, reduced motion, and host-injected Netlify overlays;
- text and non-text contrast across actual backgrounds, gradients, hover, focus, active, expanded, and status states;
- status comprehension and task performance with people who have different CVD experiences.

Automated checks and simulations are useful screening aids, not substitutes for testing the rendered interface with people who use it.
