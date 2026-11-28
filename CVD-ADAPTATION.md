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
| P07 | Simplified Surfaces | Removes decorative gradients and shadows from selected surfaces while preserving semantic text and status labels |
| P08 | High-Distinction UI | Stronger component boundaries and more prominent link underlines |
| P09 | Personal Calibration | Lets the user combine component-boundary and neutral-surface preferences manually |

The emphasis options—Subtle, Balanced, and Stronger—change visual emphasis only. They are not clinical severity levels.

P07 is deliberately named **Simplified Surfaces**: it removes selected decorative gradients and shadows. It does not reduce page saturation, convert the interface to monochrome, or recolor images. The earlier “Low-Chroma / Monochrome-Friendly” label overstated what the implementation actually does and was replaced for accuracy.

## Implemented behavior

- A keyboard-operable “Display support” launcher opens a native dialog.
- Ten profiles can be selected without entering or disclosing a diagnosis.
- The user can adjust emphasis, component boundaries, and decorative surface treatment.
- When a profile requires a setting, its corresponding control is visibly checked and disabled while that profile is active, with an “Automatic” label shown beside it. Both checkboxes reference the explanatory hint through aria-describedby. The underlying manual preference is retained, so switching to P00 or P09 restores the user-selected value rather than silently overwriting it.
- Preferences are saved locally under hg-cvd-display-preferences-v1; no network request is made for the preference.
- The dialog announces profile changes through a polite live region and returns focus to its launcher when closed.
- Status meaning remains visible in text. The response-speed dot also uses shape differences: outlined circle, square, diamond, and double-ring treatment.
- A CSS rule underlines inline links inside main-content paragraphs rather than relying on color alone; the current 12 Astro routes contain no paragraph-embedded links, so this protects future prose links rather than changing existing card/action links.
- Focus indicators remain visible, reduced-motion preferences are respected, and Windows High Contrast / forced-colors mode switches the launcher and dialog to system color tokens.
- No full-screen hue filter or image/video recoloring is applied.

## WCAG 2.2 mapping

- **1.4.1 Use of Color (Level A):** color is not the sole visual means for conveying status or distinguishing inline links; text and shape cues are retained.
- **1.4.3 Contrast (Minimum) (Level AA):** normal text requires at least 4.5:1; large text requires at least 3:1.
- **1.4.11 Non-text Contrast (Level AA):** meaningful UI component states and graphical objects generally require at least 3:1 against adjacent colors, subject to the criterion's exceptions. Thin strokes can be harder to perceive in practice even when their computed ratio passes.
- **2.4.7 Focus Visible (Level AA):** keyboard-operable controls need a mode in which focus is visible.
- **2.4.11 Focus Not Obscured (Minimum) (Level AA):** a focused component must not be entirely hidden by author-created content. The native modal path uses `showModal()` so focus is moved into the dialog and outside content is not interactive; test the launcher against sticky or host-injected overlays on every viewport.
- **1.4.4 Resize Text (Level AA):** a 200% root text-size emulation is checked on all 12 routes at 320 CSS pixels; full browser zoom and text-resize behavior still need manual verification. **1.4.12 Text Spacing (Level AA):** paragraph, line, letter, and word spacing overrides are tested at the WCAG values without causing horizontal overflow at a 320 CSS-pixel viewport. **1.4.10 Reflow (Level AA):** all 12 routes are tested at 320 CSS pixels without horizontal scrolling. **2.5.8 Target Size (Minimum) (Level AA):** pointer targets are at least 24 × 24 CSS pixels unless a defined exception applies. The dialog's checkbox hit areas are 24 × 24 CSS pixels; the launcher, close control, select controls, and footer buttons exceed the minimum.

These criteria are necessary checks, not proof that two hues remain distinguishable to every person with CVD. WCAG contrast ratios measure relative luminance, not an individual's color discrimination. Criterion 2.5.8 has spacing and other exceptions; this implementation chooses to meet the 24-pixel minimum for its checkbox controls rather than rely on an exception.

## Human validation protocol — planned, not conducted

The browser suite is not a substitute for sessions with people who have CVD. Any formative evaluation should be coordinated by an adult supervisor and use adult volunteers; the site owner should not independently run a formal human-subject study. Participation must be voluntary, and no medical records, diagnostic tests, names, or contact details are needed for this usability check.

Suggested formative protocol:

1. Invite a small, diverse group of adult volunteers who self-identify as having different CVD experiences. Record only optional, broad self-described experience categories; do not attempt to diagnose participants or infer a subtype from their performance.
2. Ask each participant to complete practical website tasks in the default presentation first, then in one or more modes they choose: find a project status, distinguish response-speed labels, locate a contact route, identify the current navigation page, and open/change/reset the display-support settings.
3. Let participants choose their preferred profile and emphasis. Do not force every participant through all ten profiles, and do not imply that a named preset is a clinical correction.
4. Record task completion, interpretation errors, approximate completion time, confidence/ease ratings, and free-text comments. Compare each participant's experience across modes; do not treat a small formative sample as a population-level ranking.
5. Use anonymous participant codes. Do not capture names, medical documents, or identifiable recordings. Obtain separate consent before collecting any recording or screenshot that could identify someone.
6. Test keyboard and screen-reader behavior separately with people who use those technologies; CVD does not imply blindness or screen-reader use.

The core acceptance question is whether meaning remains understandable without relying on hue alone, and whether the chosen display settings improve or at least do not obstruct the participant's task. Any reported confusion should be logged and investigated rather than averaged away. This protocol is a plan only; no CVD participant sessions have been conducted for this implementation.

## Standards note — visible alternatives and focus contrast

- W3C Understanding [SC 1.4.1 Use of Color](https://www.w3.org/WAI/WCAG22/Understanding/use-of-color) clarifies that a visible alternative is required for sighted users when color carries meaning. Assistive-technology semantics alone do not satisfy this criterion for sighted users who cannot distinguish the colors. A red/green valid-invalid distinction needs another visible cue even if the colors have high luminance contrast.
- W3C technique [G14](https://www.w3.org/WAI/WCAG22/Techniques/general/G14) gives a required-field example where color is paired with an asterisk and explanatory text; it also cautions that asterisks may not be announced in all screen-reader reading modes. Use explicit text such as “Required” rather than relying on a red label or a symbol alone.
- W3C Understanding [SC 1.4.11 Non-text Contrast](https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast) explains that meaningful UI states—including focus indicators—need sufficient contrast against adjacent colors. The source audit checks the authored focus token; browser tests separately check visible focus geometry and forced-colors behavior.

The current Astro portfolio routes contain no authored data-entry forms or custom field-validation states, so no form-validation component was added in this pass. If a form is introduced, required/error/success states must use explicit visible text and an icon/shape or other non-color cue; programmatic labels and error associations must be tested separately.

## Research basis

- Geddes, Flatla, and Connelly (2023), “30 Years of Solving the Wrong Problem: How Recolouring Tool Design Fails those with Colour Vision Deficiency.” Qualitative work included 235 Reddit posts / 1,442 comments and 21 participants with CVD. Participants used filters in situational ways; filters could help compare colors but could also disrupt color naming or familiar lightness cues. DOI: https://doi.org/10.1145/3597638.3608407
- Geddes et al. (2025), “Designing for Colour Vision Deficiency: A Scoping Review of Resources That Support Designers in Choosing Accessible Colours.” The review included 113 papers; only 5 of 46 tool papers and 13 of 55 guideline papers recruited people with CVD. It highlights limited real-user evaluation and the need for context-sensitive redundant encoding. DOI: https://doi.org/10.1145/3663547.3746370
- Paiva, Siqueira, and Ferreira (2021), “The Windows 10's Color Filter Feature as an Aid for Color Blind People in the Use of Websites.” Fourteen participants evaluated nine static website scenarios; effects varied by group and task, so a generic filter is not a dependable fix. DOI: https://doi.org/10.1145/3472301.3484341
- Geddes, Flatla, Tigwell, and Peiris (2022), “Improving Colour Patterns to Assist People with Colour Vision Deficiency.” The online study recruited 29 self-reported participants with CVD and 29 controls from social-media groups; participants unsure of their CVD type were referred to an online assessment. It compared three aids across Selection, Transition, and Sorting tasks. ColourMeters helped with Transition but not Selection/Sorting; ColourIconizer helped with Selection/Sorting; ColourMix provided assistance across all three tasks. This supports task-matched redundant encoding, not indiscriminate pattern overlays on every UI component. DOI: https://doi.org/10.1145/3491102.3502024
- Andrew and Tigwell (2025), “Understanding the Experiences of People With and Without Vision Impairments When Using Mobile User Interface Alternative Color Modes.” Interviews with 29 mobile users identified inconsistent coverage across interface elements and the value of coherent, user-adjustable modes. DOI: https://doi.org/10.1145/3743704
- Alcaraz-Martínez et al. (2024), “Enhancing statistical chart accessibility for people with low vision: insights from a user test.” A remote study of 12 low-vision users included 4 with CVD. Accessible web charts used keyboard navigation, visible focus, patterns alongside color, direct labels and data tables. Outcomes varied by chart type; 86.11% of preferences favored accessible versions, but some users preferred color over monochrome and some found patterns confusing. The authors caution that the small sample cannot statistically validate or generalize the results. DOI: https://doi.org/10.1007/s10209-024-01111-4
- Flatla and Gutwin (2012), “SSMRecolor: Improving Recoloring Tools with Situation-Specific Models of Color Differentiation.” A small controlled study found benefits from individualized, situation-specific modeling compared with tested generic recolorers; this does not validate a fixed set of population-wide presets. DOI: https://doi.org/10.1145/2207676.2208388

- Sajek, Korotenko, and Kyrychok (2025), “Research on the Accessibility of Different Colour Schemes for Web Resources for People with Colour Blindness.” A web-colour-scheme survey included 18 male participants with CVD (10 deutan, 5 protan, 3 tritan), rating four scheme families across primary-colour variants on one webpage. Results varied by CVD type and primary colour; the authors caution that the sample was small, adult and male-only, and evaluated one page. This is direct but narrow user evidence, not a universal palette recipe. DOI: https://doi.org/10.3390/jimaging11080268
- Jiang, Arunkumar, and Bryan (2025), “The Hue-Man Factor: An Empirical Evaluation of Visualization Perception and Accessibility Across Color Vision Profiles.” Three studies combined simulated views, responses from participants with diagnosed CVD, and interviews. The authors report that simulations miss interpretive breakdowns and the role of structural cues and affective experience. DOI: https://doi.org/10.1109/TVCG.2025.3634261
- Jiang et al. (2025) found that simulated views captured some directional perceptual shifts but did not reproduce the interpretive breakdowns and emotional work described by actual CVD participants. Simulation is therefore treated as a screening aid only, not proof of usability. DOI: https://doi.org/10.1109/TVCG.2025.3634261
- Jamil and Denes (2024), “Investigating Color Blind User Interface Accessibility via Simulated Interfaces.” This arXiv preprint uses non-CVD observers rating screenshots of 20 websites under simulated CVD. It can help screen for visual pitfalls, but it is not a substitute for participants with CVD. https://arxiv.org/abs/2401.10357
- Mizutani, Nakayama, and Tsunoda (2026) arXiv preprint, “A feasibility study on filtering low-accessibility web pages considering color vision deficiency.” The model screened 21 Japanese web pages (63 page-by-vision datapoints; three simulated vision types per page) and achieved a maximum AUC of 0.76. Crucially, accessibility labels were assigned by non-CVD observers rating simulated screenshots on a five-point scale, with ratings below 3 treated as low accessibility; no participants with CVD supplied the labels. Treat this as a screening-feasibility result, not a validated user-outcome measure or proof that automatic recoloring improves usability. https://arxiv.org/abs/2606.22095
- Sajadi et al. (2013), “Using Patterns to Encode Color Information for Dichromats.” Two user studies found that pattern overlays can improve color-category interpretation; this supports redundant encoding as a complement to hue. DOI: https://doi.org/10.1109/TVCG.2012.93

## Validation still required

Browser smoke validation on 2026-11-27 used a temporary Chromium 159 + Playwright + axe-core setup outside the repository (no Playwright dependency was added). The dialog subtree had zero axe violations. The launcher injected successfully on all 12 legacy routes with HTTP 200 and no uncaught page errors. At 320px and 280px viewport widths, the dialog stayed within the viewport; at 420px viewport height it remained on-screen and scrollable. The rendered checkbox target measured 25.74 × 25.74 CSS pixels. Focus moved into the dialog, Escape closed it, focus returned to the launcher, all ten profiles were available, and a selected profile persisted in localStorage.

A separate mobile-emulation run used a 360 × 780 CSS-pixel viewport, device scale factor 2, touch input and a coarse pointer. Tapping the launcher opened the dialog; the dialog remained within the viewport; the checkbox target remained 25.74 × 25.74 CSS pixels; profile P07 persisted locally; reduced-motion animation duration resolved to 0.00001s; and no page errors occurred. This is browser emulation, not a physical-device test.

The browser run exposed two pre-existing shared-script initialization errors: setupNavigation and setupMorphGlass called forEach on a single element returned by the $ helper. Both now use the $$ collection helper; previously these errors stopped execution before setupCvdAdaptation. It also exposed a dev-server path collision for five lowercase root-level legacy HTML files. Those sources now live under legacy/ and are imported by the shared legacy asset router, allowing all 12 routes to resolve and receive the CVD launcher.

Engineering verification on 2026-11-27: JavaScript syntax check and the 10-profile / 12-route source audit passed; Astro check reported 0 errors, 0 warnings, and 0 hints; Astro build passed; the Next companion build also passed after dependency updates. GitHub Actions run 46009391092 passed all 11 validation steps on commit e46cebd8dfebd0d65f99b41b79dcf8fcc0f245d6, including npm audit, CVD source audit, Astro check/build, Next lint, and Next build. The workflow contains no deployment step.

Static token contrast checks also pass: dialog body text #d0d0d8 on #12121a = 12.15:1; hint text #c5c5ce on #12121a = 10.87:1; focus indicator #c0a020 on #12121a = 7.36:1; and white primary-button text on #cc2200 = 5.53:1. These are source-token calculations, not a substitute for measuring all rendered states and adjacent backgrounds.

The dependency audit initially reported 24 vulnerabilities (17 moderate, 7 high). The dependency tree was refreshed to Astro 7.4.13, @astrojs/netlify 8.2.14, and Next.js 16.4.6. Compatible scoped npm overrides pin @vercel/nft 1.11.15, readdir-glob 4.0.0, and minimatch 11.0.9 within the Netlify packaging chain. A clean npm ci then reported zero vulnerabilities, and Astro check/build plus Next lint/build all passed locally. The overrides avoid the unsafe forced downgrade to @astrojs/netlify 6.5.13. The lockfile is reproducible with npm ci.

The Next companion now has an ESLint 9 flat configuration based on the official Next.js ESLint guidance; Next lint and build pass. This implementation has passed local Chromium smoke checks, Astro build, and source checks, but it has not been tested with a representative group of people with CVD. It is not a WCAG conformance certification.

Before claiming full conformance, complete cross-browser and assistive-technology validation beyond the Chromium headless smoke run, including:
- P00–P09 selection, all three emphasis levels, manual toggles, reset, persistence, and storage-disabled behavior;
- full keyboard tab sequence/focus containment, screen-reader announcement, and storage-disabled behavior;
- actual mobile devices, zoom/text resize, reduced motion, and host-injected Netlify overlays;
- text and non-text contrast across actual backgrounds, gradients, hover, focus, active, expanded, and status states;
- status comprehension and task performance with people who have different CVD experiences.

Automated checks and simulations are useful screening aids, not substitutes for testing the rendered interface with people who use it.


## Research cross-check — 2026-11-28

A further literature pass checked the design decisions against recent HCI and visual-accessibility evidence:

- Geddes et al. (2025), a scoping review of 113 papers (46 design tools, 55 guideline papers, and 12 simulation papers), found that redundant encoding is commonly recommended but often lacks context-sensitive guidance. The review counted “do not use colour alone” in 16/55 guideline papers and shapes/symbols in 15/55. Its important nuance is to encode the underlying meaning, not merely substitute a colour-name symbol: a checkmark is more useful than a leaf when green means “correct”. Only 5/46 tool papers and 13/55 guideline papers were evaluated with people with CVD. This reinforces the need for semantic labels and real-user validation, not reliance on simulators. DOI: https://doi.org/10.1145/3663547.3746370
- Zhang et al. (2024) compared smartphone colour-enhancement features with six participants (three described as colour-blind and three as colour-vision-deficient). The objective colour-search task improved on the two devices included in that comparison, while subjective preference was related to naturalness and stronger enhancement could reduce preference. The study did not compare opt-in profiles with a universal default or test a global web-page filter. It supports offering user-selectable assistance as an option, but does not establish one ideal default. The small sample and limited task scope constrain generalization. DOI: https://doi.org/10.3389/fnins.2024.1366541
- Andrew and Tigwell (2025) interviewed 29 mobile users, including 13 people with a range of vision impairments. This was not a CVD-specific sample, so its findings are adjacent evidence rather than direct CVD validation. Participants described inconsistent alternative-colour-mode coverage across interface elements and asked for more meaningful, manageable control. The authors recommend consistent styling across relevant components and user-adjustable settings. DOI: https://doi.org/10.1145/3743704
- Huertas et al. (2026) reviewed passive and active visual aids. The available abstract says passive filters do not restore normal trichromatic vision and their benefits are task- and person-dependent; active recolouring may improve discrimination but can trade off against naturalness. Undermind did not have the full PDF for this paper during this pass, so this point is abstract-only and is not used as evidence that a particular web UI profile is effective. DOI: https://doi.org/10.24867/grid-2026-p28

**Implementation consequence:** retain non-colour semantic cues, make presentation changes optional and locally controlled, do not apply a global hue filter, and avoid claiming subtype-specific clinical correction. The literature supports these as cautious design choices; it does not validate the P01–P09 presets as medically tailored interventions.

## Browser regression and CI coverage — 2026-11-28

A new reproducible browser suite lives at scripts/test-cvd-browser.mjs and is invoked by npm run test:cvd:browser. The GitHub Actions workflow installs Chromium, Firefox, and WebKit, builds Astro, starts the local Astro dev server, and runs Playwright plus axe-core in all three engines before completing Next lint/build. Astro's Netlify adapter does not support the generic astro preview command, so the browser suite exercises the dev server while the production Astro bundle is checked separately. It remains a validation-only workflow and contains no Netlify deployment step.

The initial Chromium-only suite passed 16 test groups. It was subsequently expanded to three engines and 43 groups per engine, including all ten profile states, live-region announcements for each profile, non-diagnostic wording for P01–P06, axe checks on representative visual states (P00/P01/P07/P08/P09), all three emphasis levels, manual calibration toggles, profile-locked settings, visible “Automatic” state labels, aria-describedby help association, retained manual preferences across profile switches, keyboard focus entry and Tab/Shift+Tab containment, a visible 3px focus outline and unobscured focus target, Escape dismissal and focus restoration, reset, local persistence, storage-disabled fallback, 320px reflow on every route, 320px-to-280px resizing, a 420px-tall viewport, touch/mobile emulation, reduced-motion preference, WCAG text-spacing overrides, and Windows forced-colors mode.

This regression pass found and fixed two additional issues:
- The launcher's explicit accessible name did not match its visible label. The redundant aria-label was removed so the visible “Display support” text supplies the accessible name.
- A dialog opened at one viewport size could retain stale vw/vh dimensions after a live resize. Its sizing now uses a responsive width: auto with percentage-based max-width and max-height, so the dialog recalculates after viewport changes.

A cross-browser pass on 2026-11-28 then ran the same suite in Playwright Chromium 159, Firefox 159, and WebKit 27.2. All three engines returned HTTP 200 on all 12 canonical routes, reported zero full-page axe violations on each route and zero axe violations with the dialog open, and passed 320px reflow checks without horizontal overflow. The latest local suite reports 48 groups per engine: Chromium 48/48, WebKit 48/48, and Firefox 47 passed with one mobile-emulation case skipped because Playwright Firefox does not expose mobile viewport emulation. Focus visibility (3px outline), focus not obscured, profile state, keyboard, invalid and disabled storage fallbacks, modal backdrop dismissal, responsive resize, short viewport and reduced motion passed in all engines; touch/mobile emulation passed in Chromium and WebKit. 200% root text-size emulation on all 12 routes, text-spacing overrides (1.4.12), and Playwright-emulated forced-colors mode passed in all three engines; this is media-feature emulation, not a physical Windows High Contrast session.

The forced-colors emulation test initially exposed that the dark dialog palette was not adapted for user-selected system colors. A dedicated forced-colors stylesheet now uses Canvas, CanvasText, ButtonFace, ButtonText, Field, FieldText, and Highlight tokens; the updated three-engine tests report zero axe violations. The text-spacing test applies the WCAG 1.4.12 spacing values and confirms no horizontal overflow at 320 CSS pixels. These are automated browser-engine and mobile-emulation results, not physical-device testing, screen-reader certification, or user testing with people who have CVD. The site is not being represented as WCAG-conformant solely on the basis of these checks.


### Biomedical literature cross-check

The biomedical literature was checked separately from the HCI/web-accessibility studies. These sources concern optical or image-level aids, not website controls, so they inform the limits of claims rather than directly validating this interface:

- Álvaro et al. (2022) tested 20 colour-vision-normal and 16 red–green CVD adults across clinical tests, colour discrimination, colour naming and sorting. A Variantor filter could simulate a protan-like pattern in the normal-vision group, but EnChroma did not significantly improve overall CVD performance across the task set; some hue-specific changes were mixed and task-dependent. This is evidence against claiming that a single general filter restores colour vision, not a direct test of web UI recolouring. DOI: https://doi.org/10.1038/s41598-022-13877-9
- Male et al. (2022) reviewed 16 heterogeneous reports of optical, electronic and prototype aids. Most evidence was low certainty, four reports were moderate certainty, and the review concluded that commercially available devices did not have clinically significant evidence of improved subjective colour perception. The included studies were not a systematic evaluation of website accessibility features. DOI: https://doi.org/10.1002/hsr2.842
- Lin et al. (2025), ColorAssist, introduces a CVD-individual-labelled image dataset and a perception-guided recolouring model; the PubMed abstract reports subjective testing in hospitals. The full PDF was not available in the research workspace during this pass. This is image-recolouring research, not evidence that static CSS profiles or a global website filter work. DOI: https://doi.org/10.1109/TIP.2025.3602643
- Hathibelagal (2023), “The impact of display saturation on visual search performance in congenital colour vision deficiency.” The study included 25 participants (10 normal trichromats; 15 with CVD: 8 deutans and 7 protans). For the CVD group, high saturation did not significantly outperform original images overall (performance index 46.9 vs 45.16 % correct·s⁻¹; p = 0.71), although some colour-pair results improved, particularly for protans. The small sample, unequal task difficulty and luminance changes limit generalization. This does not support globally increasing saturation across a website. DOI: https://doi.org/10.1371/journal.pone.0290782
- Hsu et al. (2026), “Effects of Notch Filters in Correcting Color Vision Deficiency: A Quantitative Clinical Trial.” Thirteen adults were recruited; 12 participants (all men) completed F-M 100 Hue testing, with 10 showing lower error scores and 2 worsening. Six completed D-15 testing, with 4 improving and 2 worsening. No formal group-level inferential tests were performed; participants were not classified with Ishihara/anomaloscope, and no real-world object-recognition or navigation tasks were tested. The authors describe the results as preliminary and exploratory. This is optical-filter evidence, not evidence for web UI filters. DOI: https://doi.org/10.3390/diagnostics16091347

The biomedical and HCI evidence point to the same conservative product boundary: keep controls optional, avoid universal correction claims, and do not equate image recolouring or optical-filter results with web-interface usability. Automated screenshot screening may help prioritize review, but simulation-based labels and small page datasets do not replace task-based validation with people who have CVD.

Research source coverage: Exa and Parallel were used for independent web and PubMed-indexed checks. Firecrawl research-paper search and full-text retrieval were used for biomedical abstracts and passages. The Firecrawl catalogue exposed PubMed/PMC and Europe PMC database providers, but the account had zero credits; a direct PubMed query was refused before execution because it required 5 credits, and the earlier Europe PMC request was also refused. Existing completed Undermind CVD searches and retrieved PDFs were used; a further deep search was blocked by the Undermind free-usage limit until 2026-11-28 00:30 UTC. This distinction is recorded so database calls are not claimed when they did not execute.

Latest full CI confirmation — 2026-11-28: GitHub Actions run 46095755963 passed all 14 validation steps on commit d5c25839504c078c7421da37d04c654a789a6278. It includes the 48-group Chromium/Firefox/WebKit Playwright/axe suite, profile-locked controls, visible “Automatic” labels, aria-describedby target resolution to the exact explanatory text, retained manual preferences, malformed preference fallback, modal-backdrop dismissal/focus restoration, 200% text-size emulation, forced-colors and text-spacing checks, Astro production build, full npm audit, Next lint and Next build. The workflow contains no deployment action.


- 2026-11-28 regression expansion: runtime browser checks now verify 20 project status labels, one social status label and six response-speed labels remain readable in text, are marked as redundant status text, and do not expose decorative dots to assistive technology. Additional cases verify malformed stored preferences fall back safely and backdrop dismissal restores focus. Local results: Chromium 48/48, WebKit 48/48, Firefox 47 passed with one unsupported mobile-emulation skip. P07 is explicitly named “Simplified Surfaces” and browser/static audits assert that its description does not claim a chroma or monochrome filter. Profile-imposed settings are visibly checked and disabled while active; manual values persist when switching between presets and become editable again in P00/P09. This follow-up passed locally in Chromium, Firefox and WebKit.
