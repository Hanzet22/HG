# WCAG 2.2 Accessibility Research & Engineering Plan

**Repository:** `Hanzet22/HG`  
**Working branch:** `portfolio-setup`  
**Research date:** 2026-11-28  
**Target:** WCAG 2.2 Level A and AA, with selected stricter practices where useful.

This document separates normative WCAG requirements, empirical accessibility research, and cautious design extrapolations. It is not medical advice, a clinical assessment, or a conformance certification.

## 1. Normative implementation baseline

The conformance target is the W3C WCAG 2.2 Recommendation. Success criteria—not a particular tool or technique—determine conformance.

| WCAG criterion | Level | Engineering focus | HG status / next verification |
|---|---:|---|---|
| 1.2.1 Audio-only and Video-only (Prerecorded) | A | Equivalent alternative for applicable media | Inspect all embedded media and classify audio/video tracks |
| 1.2.2 Captions (Prerecorded) | A | Captions for prerecorded synchronized audio | Six players have accessible names and native controls; no caption tracks found; media content still uninspected |
| 1.2.3 Audio Description or Media Alternative (Prerecorded) | A | Equivalent information for prerecorded synchronized media | Inspect each clip and prepare accurate alternatives only where needed |
| 1.2.5 Audio Description (Prerecorded) | AA | Audio description for prerecorded synchronized video | Pending media inspection |
| 1.4.1 Use of Color | A | Never rely on color alone for meaning | Redundant text and shape cues implemented; verify all rendered states |
| 1.4.3 Contrast (Minimum) | AA | 4.5:1 normal text; 3:1 large text | Static token checks exist; inspect composited backgrounds and interactive states |
| 1.4.10 Reflow | AA | No loss at 320 CSS px for vertical content | Browser regression suite checks all 12 Astro routes |
| 1.4.11 Non-text Contrast | AA | 3:1 for meaningful UI components/states and graphics | Static checks plus axe; manual visual-state review remains necessary |
| 1.4.12 Text Spacing | AA | No loss under specified spacing overrides | Browser regression suite applies text-spacing overrides |
| 2.2.2 Pause, Stop, Hide | A | Control qualifying auto-starting moving/blinking/scrolling content lasting over five seconds | Audit every animation and media element; exceptions are criterion-specific |
| 2.3.1 Three Flashes or Below Threshold | A | Avoid content exceeding flash thresholds | Embedded videos require frame-level inspection; a warning label is not proof |
| 2.4.7 Focus Visible | AA | Visible keyboard focus | Focus styles and browser tests implemented |
| 2.4.11 Focus Not Obscured (Minimum) | AA | Focused control not entirely hidden by author content | Test fixed controls, overlays, dialog, and host-injected UI |
| 2.5.8 Target Size (Minimum) | AA | At least 24 × 24 CSS px unless an exception applies | Dialog checkbox target and primary controls tested |
| 3.3.2 Labels or Instructions | A | Labels/instructions for user input | No custom data-entry workflow currently identified; re-audit if forms are added |

**Important level distinction:** 2.3.3 Animation from Interactions and 2.4.13 Focus Appearance are Level AAA, not AA. HG may choose stronger motion and focus behavior, but documentation must not mislabel AAA criteria as AA requirements. A 3px focus outline is a project design choice, not the AA minimum specified by 2.4.7.

## 2. Life-sciences and clinical evidence relevant to visual presentation

These papers inform conservative design choices. They do not establish that a particular website animation causes a medical condition, and they do not validate HG's UI as a treatment or prevention tool.

### Visual motion and visually induced dizziness

- **Wibble & Pansell (2023), “Clinical characteristics of visual motion hypersensitivity: a systematic review.”** The review synthesizes 54 original articles (the paper's flow diagram reports 53, an internal reporting discrepancy). It discusses visual-motion sensitivity associations across vestibular disorders, concussion, migraine, Parkinson's disease and age groups. Assessment methods and terminology varied substantially; incompatible posturography outcomes prevented meta-analysis. The authors explicitly do not establish prevalence or diagnostic prediction. The review contains no direct web-interface intervention evidence. DOI: https://doi.org/10.1007/s00221-023-06652-3.
- **Pavlou et al. (2017), “Visually Induced Dizziness in Children and Validation of the Pediatric Visually Induced Dizziness Questionnaire.”** The study included 169 healthy children and 114 children with migraine, concussion or vestibular diagnoses, aged 6–17. Its questionnaire included situations such as computer use, moving/striped surfaces and visually busy environments. This is clinical symptom-trigger research, not a controlled test of HG or proof that all children experience symptoms. DOI: https://doi.org/10.3389/fneur.2017.00656.

**Cautious engineering extrapolation:** keep decorative movement non-essential, avoid unnecessary continuous large-field motion, respect `prefers-reduced-motion`, provide user control where practical, and avoid autoplay/looping media. Do not claim these measures prevent or treat dizziness. The papers do not define UI animation speed, duration, or area thresholds.

### Photosensitive seizure safety and flashing content

- **Jordan & Vanderheiden (2024), “International Guidelines for Photosensitive Epilepsy: Gap Analysis and Recommendations.”** This paper compares five major guideline families (UK, Japan, ISO, ITU and W3C), explains differences in luminance, color, flash frequency and visual area criteria, and identifies gaps for newer displays and content. It emphasizes that risk is multidimensional; a simple “under 3 Hz” check alone is not a complete safety analysis. DOI: https://doi.org/10.1145/3694790.
- **Fisher et al. (2022), “Visually sensitive seizures: An updated review by the Epilepsy Foundation.”** The review discusses visual triggers including flashes, patterns, color changes, games and social-media clips. It is a clinical literature review, not a test of this repository's videos. DOI: https://doi.org/10.1111/epi.17175.

WCAG 2.3.1 is the normative conformance criterion. The actual media must be evaluated against the complete criterion and its thresholds/exceptions; a video title or warning does not establish compliance. Motion sensitivity and photosensitive seizure risk are distinct topics and must not be conflated.

### Cognitive accessibility and user participation

- **Gartland et al. (2022), “The State of Web Accessibility for People with Cognitive Disabilities: A Rapid Evidence Assessment.”** This review included 45 studies, with a mix of qualitative, mixed-methods, quasi-experimental and experimental work. Reported barriers included text-heavy content, search and selection effort, navigation/interaction friction, and poor relevance. The authors note that few studies convincingly tested intervention effectiveness and recommend meaningful participation, phased iteration and feedback from people with cognitive disabilities. These findings are not uniform traits or prescriptions for every person with a diagnosis. DOI: https://doi.org/10.3390/bs12020026.

**Cautious engineering extrapolation:** use clear headings, predictable navigation, plain instructions, visible status wording, consistent controls, and user-controlled presentation. Keep full information available rather than assuming all users want simplified or shortened content. Test with people who use the interface.

## 3. Existing HG behavior and remaining risks

- Astro's shared script detects `prefers-reduced-motion: reduce` and avoids the GSAP animation path when reduced motion is requested.
- The stylesheet has a reduced-motion override for animation duration, iteration count, transitions and smooth scrolling.
- The four Astro error-page videos are user-initiated, use native controls and metadata preload; autoplay and looping are absent in the current source.
- The four Astro error-page video elements have accessible names. The two Next.js error-page players also have accessible names in the source.
- No `track` captions elements were found in the six embedded players. There are five unique MP4 sources. The actual audio tracks, spoken content, meaningful sound, visual content and flash behavior have not been verified through playback. Do not invent captions, transcripts or audio descriptions.
- The CVD display-support feature is optional and locally stored. Its clinical-name presets are documented as non-diagnostic preference labels, not condition-specific correction. Do not collect diagnoses or medical history.

## 4. Automated and manual verification

The `cvd-a11y-hardening` branch contains a browser suite that has passed GitHub Actions run [46096066915](https://github.com/Hanzet22/HG/actions/runs/46096066915) at commit `5691bbb81144e7b21029d16908db588ac26404bd`. The suite covers 12 Astro routes, axe checks, 320px reflow, 200% text-size emulation, keyboard/dialog behavior, status semantics, forced-colors, reduced motion, and Chromium/Firefox/WebKit. That historical pass belongs to that branch and commit.

The tested source and test tooling have now been ported selectively to `portfolio-setup`. The new workflow must run against the current branch before its result is described as passing. It runs dependency audit, source audits, Astro checks/build, browser tests in three engines, Next lint/build, and the legacy-route smoke check. It has no Netlify deployment step.

Still required after CI:
1. Verify all six media players by actual playback, including captions, audio description/media alternatives and flashing analysis.
2. Test full keyboard order, visible/unobscured focus and all meaningful expanded/active/error states on every route.
3. Test with screen readers and other assistive technologies on desktop and mobile.
4. Test physical Android devices and desktop browsers; browser emulation is not a physical-device substitute.
5. Conduct participatory usability testing with people who have varied access needs. Do not infer user experience from simulation alone.

## 5. Research source coverage and limits

Research used Exa, Firecrawl, Parallel and Undermind. Firecrawl's research-paper index returned PubMed/PMC-indexed biomedical papers and full-text passages; Undermind returned and read available full-text PDFs for the visual-motion review and cognitive-accessibility review. The current tool catalog did not expose a separate standalone connector named “Life Sciences Databases” or “Life Sciences Literature”; no direct query through such a separately named connector is claimed.

## References

- W3C, [Web Content Accessibility Guidelines (WCAG) 2.2](https://www.w3.org/TR/WCAG22/).
- W3C, [Understanding WCAG 2.2](https://www.w3.org/WAI/WCAG22/Understanding/).
- Playwright, [Accessibility testing](https://playwright.dev/docs/accessibility-testing).
- Wibble & Pansell (2023), [Clinical characteristics of visual motion hypersensitivity: a systematic review](https://doi.org/10.1007/s00221-023-06652-3).
- Pavlou et al. (2017), [Visually Induced Dizziness in Children and Validation of the Pediatric Visually Induced Dizziness Questionnaire](https://doi.org/10.3389/fneur.2017.00656).
- Jordan & Vanderheiden (2024), [International Guidelines for Photosensitive Epilepsy: Gap Analysis and Recommendations](https://doi.org/10.1145/3694790).
- Fisher et al. (2022), [Visually sensitive seizures: An updated review by the Epilepsy Foundation](https://doi.org/10.1111/epi.17175).
- Gartland et al. (2022), [The State of Web Accessibility for People with Cognitive Disabilities: A Rapid Evidence Assessment](https://doi.org/10.3390/bs12020026).


### New browser regression coverage
The current branch's Playwright suite now checks the four Astro error-page video players for native controls, accessible names, no autoplay, no looping, no forced mute, and metadata-only preload. The test records caption-track presence but does not assert caption completeness because the actual media audio and visuals have not been reviewed. Frame-level flash analysis and accurate captions/audio descriptions remain manual media-review tasks.
