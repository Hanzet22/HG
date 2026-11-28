# HG WCAG research update — 2026-11-28

**Repository:** `Hanzet22/HG`  
**Branch:** `portfolio-setup`  
**Scope:** WCAG 2.2 A/AA engineering, optional motion adaptation, flashing-media review, and cognitive accessibility.  
**Evidence boundary:** This is engineering research, not medical advice, diagnosis, treatment, or a conformance certification.

## 1. Engineering change: live reduced-motion preference

A source review found that `Script.js` read `prefers-reduced-motion` only once during page initialization. CSS media queries respond when the operating-system preference changes, but JavaScript-driven behavior was using a snapshot value. This left a gap for GSAP effects, counters, reveal animations, transitions and media handling when the setting changed while the page remained open.

**Change committed to `portfolio-setup`:**
- Listen for the `MediaQueryList` `change` event (with a legacy `addListener` fallback).
- Toggle a root `hg-reduced-motion` class at runtime.
- When reduction is enabled, stop in-flight GSAP animations and ScrollTriggers, reveal content immediately, render counters to their final values, and pause/remove autoplay from video elements.
- Add Playwright coverage that changes the emulated preference while `/projects.html` is open, checks that no reveal remains hidden, and switches back to no-preference.

**Validation:** GitHub Actions run [#103](https://github.com/Hanzet22/HG/actions/runs/46164000414) passed at commit `91d4781050645ec5207a34e24ef14d630cc584f8`. The run passed dependency audit, JavaScript/source audits, Astro checks/build, Chromium/Firefox/WebKit + axe browser tests, Next lint, and Next build.

This is a usability enhancement and a conservative design choice. WCAG 2.3.3 Animation from Interactions is Level AAA, not AA. The implementation does not turn that criterion into an AA requirement. WCAG 2.2.2 Pause, Stop, Hide remains separately applicable to qualifying automatically moving content.

## 2. Updated clinical and HCI evidence

### Visual motion / dizziness

- **Wibble & Pansell (2023), systematic review**, DOI [10.1007/s00221-023-06652-3](https://doi.org/10.1007/s00221-023-06652-3), full text reviewed via PubMed Central. It synthesizes clinical risk-group studies involving vestibular disorders, migraine, concussion, age, psychiatric conditions and Parkinson's disease. Terminology and outcome measures vary; the review could not meta-analyze the heterogeneous methods. It explicitly excluded cybersickness studies in otherwise healthy participants. It does not test ordinary websites or establish that routine web animations cause symptoms. The abstract/results state 54 included studies, while the PRISMA diagram states 53.
- **Keshavarz et al. (2024), “Concussion can increase the risk of visually induced motion sickness,”** DOI [10.1016/j.neulet.2024.137767](https://doi.org/10.1016/j.neulet.2024.137767). A laboratory study included 31 adults: 16 with concussion history and 15 controls. The concussion group was split into symptomatic (n=7) and asymptomatic (n=9) participants. Exposure was a virtual grocery-aisle self-motion scene at different speeds. The symptomatic subgroup reported higher post-exposure sickness scores; the authors caution that the sample was small, especially after subgrouping. This is not a study of normal website navigation or a test of HG's animation.
- **Bourdillon et al. (2026), “Visual Motion Sensitivity in Vestibular Migraine,”** DOI [10.1097/MAO.0000000000004948](https://doi.org/10.1097/MAO.0000000000004948). A prospective single-institution cohort compared 17 participants with vestibular migraine and 19 healthy controls after 20 optical-flow videos. Any symptom was reported more often in the vestibular migraine group (71.9% vs 13.7%). This is a small clinical cohort; only abstract-level details were available in this review, and it does not validate a web UI threshold or establish general-population effects.

**Engineering implication (cautious extrapolation):** avoid unnecessary large-field parallax/scroll motion, keep motion non-essential, respect live `prefers-reduced-motion`, and keep information available without animation. Do not claim the control prevents or treats dizziness, and do not infer a visitor's diagnosis.

### Photosensitive seizure / flashing content

- **Fisher et al. (2022), Epilepsy Foundation review**, DOI [10.1111/epi.17175](https://doi.org/10.1111/epi.17175), reviews visually provoked seizures from flashes, patterns and color changes across screens, games and media.
- **Jordan & Vanderheiden (2024), guideline gap analysis**, DOI [10.1145/3694790](https://doi.org/10.1145/3694790), compares WCAG, ISO, ITU, UK and Japanese guideline families. The full text was reviewed. It discusses frequency, luminance, saturated-red transitions, combined visual area, transition duration and synchrony. Its proposed 66 ms and 20 ms working values are proposals, not adopted WCAG requirements.
- **Timar et al. (2025), “Functional network dynamics in photosensitive epilepsy depend on stimulation frequency and photoparoxysmal electroencephalographic response,”** DOI [10.1111/epi.18531](https://doi.org/10.1111/epi.18531), full text reviewed via PMC. Retrospective EEG data covered 84 people: 45 photosensitive-epilepsy patients, 19 epilepsy patients without photosensitivity, and 20 healthy controls. Intermittent white-light stimulation ranged from 1–60 Hz. The study reports group-level EEG response/network differences, including greater occipital photoparoxysmal-response power in the photosensitive group at 10–20 Hz. It is an EEG study, not a test of website content or a universal threshold for safe displays. The article is CC BY-NC; cite its metadata/DOI and do not reuse its full text commercially.

**Engineering implication:** never treat a frequency-only counter or “below 3 Hz” label as a complete safety test. For applicable web media, assess WCAG 2.3.1 in full, including the relevant flash magnitude/color and area conditions. Avoid strobe-like effects rather than trying to tune them to a supposed safe frequency. Actual video frames still require a proper media-analysis pass and human review.

### Cognitive accessibility and participation

- **Gartland et al. (2022), rapid evidence assessment**, DOI [10.3390/bs12020026](https://doi.org/10.3390/bs12020026), included 45 studies of people aged 9+ with cognitive disabilities. It reports text-heavy content, information-seeking effort, navigation friction and relevance as recurring themes. Evidence was heterogeneous; many studies did not establish intervention effectiveness.
- **van Calis et al. (2025), “Inclusive digital platforms: Designing for and with users with mild intellectual disabilities or low literacy skills,”** DOI [10.1016/j.chbr.2025.100617](https://doi.org/10.1016/j.chbr.2025.100617). A qualitative redesign of a digital research platform involved 14 people with mild intellectual disabilities, including two co-researchers. Interviews, walkthroughs and low-fidelity prototype usability sessions informed recommendations such as clear naming/onboarding, intuitive navigation, readable content, recognizable visuals, and read-aloud/read-along support. The sample is small and the findings concern one platform; they are not universal rules.
- **Er-Raji et al. (2026), “A cognitive accessibility review of national palliative care resources with people with cognitive disabilities,”** DOI [10.1186/s12904-026-02067-3](https://doi.org/10.1186/s12904-026-02067-3). Eight people with lived experience reviewed three resources. They identified dense vocabulary, abstract phrasing and inconsistent sequencing as barriers, and valued plain-language sections, clear segmentation, simple visual layouts and concrete prompts. This is a small qualitative health-information study, not a controlled web-design trial.
- **“Co-Design of Technology with and for People with Intellectual Disabilities: A Scoping Review of Methods and Inclusion Strategies” (CHI 2026),** [ACM record](https://doi.org/10.1145/3772318.3791163). The indexed record was found, but full methods/results were not available for inspection here; no findings from it are asserted.

**Engineering implication:** use descriptive headings and links, predictable navigation, concrete instructions, consistent controls, readable content and actionable error recovery. Preserve the full content and allow users to choose helpful presentation support rather than assuming everyone needs simplification. Include disabled people in task-based evaluation.

## 3. Standards and conformance distinctions

- WCAG 2.2 is the normative baseline: [W3C Recommendation](https://www.w3.org/TR/WCAG22/).
- 2.3.1 Three Flashes or Below Threshold is Level A. The complete criterion includes area and luminance/red-flash considerations; a rate-only assertion is incomplete.
- 2.2.2 Pause, Stop, Hide is Level A and applies to qualifying automatically moving/blinking/scrolling content.
- 2.3.3 Animation from Interactions is Level AAA. Respecting `prefers-reduced-motion` remains a useful enhancement, not proof of AA conformance.
- W3C technique C39 (https://www.w3.org/WAI/WCAG22/Techniques/css/C39) demonstrates the CSS media query. The new runtime listener addresses JavaScript behavior that a CSS-only rule cannot stop.

## 4. Database and search coverage

- Queried PubMed via the Firecrawl Alexandria life-sciences provider for visual-motion/dizziness literature, photosensitive epilepsy/photic-stimulation literature, and cognitive-accessibility/digital-interface literature. PubMed returned 81 motion-related records and 162 photosensitivity/photic-stimulation records for the broad date-bounded queries; these are discovery counts, not counts of directly relevant or individually reviewed papers. The cognitive query also returned false positives, so records were screened by title/topic rather than treated as qualifying evidence.
- Queried Europe PMC for visual-motion-related literature and confirmed record metadata, publication dates, full-text availability and licence status. The broad query returned 381 records; the first 12 newest were screened, and unrelated matches were excluded. An exact-title query for two HCI papers returned no records, so those papers were verified through publisher/author repository sources instead.
- Used Firecrawl's research-paper index, Exa, Parallel and Undermind to cross-check candidate papers and source passages. Full-text PDFs were read in Undermind for Wibble & Pansell (2023), Jordan & Vanderheiden (2024) and Gartland et al. (2022); PubMed/PMC full text was retrieved for Wibble & Pansell and Timar et al.
- PubMed and Europe PMC were called as life-sciences database providers through Firecrawl Alexandria. No separate standalone connector named “Life Sciences Databases” or “Life Sciences Literature” was exposed in the tool catalog.

## 5. Remaining manual validation

- Review all six media players by actual playback, including captions, audio description/media alternatives and flashing analysis.
- Test keyboard order, visible/unobscured focus, expanded/active/error states, and screen readers/assistive technologies on desktop and mobile.
- Test physical Android devices and desktop browsers; browser emulation is not a physical-device substitute.
- Conduct participatory usability testing with people who have varied access needs. Automated scans and CI passes are regression evidence, not a WCAG conformance certification.

## References
- [WCAG 2.2](https://www.w3.org/TR/WCAG22/)
- [W3C C39 reduced-motion technique](https://www.w3.org/WAI/WCAG22/Techniques/css/C39)
- [Wibble & Pansell 2023](https://doi.org/10.1007/s00221-023-06652-3)
- [Keshavarz et al. 2024](https://doi.org/10.1016/j.neulet.2024.137767)
- [Jordan & Vanderheiden 2024](https://doi.org/10.1145/3694790)
- [Fisher et al. 2022](https://doi.org/10.1111/epi.17175)
- [Timar et al. 2025](https://doi.org/10.1111/epi.18531)
- [Gartland et al. 2022](https://doi.org/10.3390/bs12020026)
- [Bourdillon et al. 2026](https://doi.org/10.1097/MAO.0000000000004948)
- [Er-Raji et al. 2026](https://doi.org/10.1186/s12904-026-02067-3)
- [van Calis et al. 2025](https://doi.org/10.1016/j.chbr.2025.100617)
- [CHI 2026 co-design scoping review](https://doi.org/10.1145/3772318.3791163)
