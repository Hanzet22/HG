# WCAG research follow-up — 2026-11-28

**Repository:** `Hanzet22/HG`  
**Branch:** `portfolio-setup`  
**Scope:** Additional evidence search on motion in HCI, cognitive web accessibility, and WCAG 2.2 interpretation.  
**Evidence boundary:** Research synthesis only; not medical advice, diagnosis, treatment, or a conformance certification.

## 1. New motion/HCI evidence and its limits

### Ordinary web-interface evidence remains sparse
A focused Firecrawl research-index search for reduced-motion and vestibular accessibility in ordinary websites/mobile apps did not surface a strong controlled study that tests common portfolio-page animations directly. Most high-ranking motion-sickness evidence remains clinical or VR-based. This is an evidence gap, not evidence that ordinary web motion is harmless.

### Motion in a moving-vehicle HCI environment
- **Wang et al. (2026), “Does Motion Intensity Impair Cognition in HCI? The Critical Role of Physical Motion-Visual Target Directional Congruency,”** arXiv:2601.12884. The full-text passages describe a within-subject experiment using a six-degree-of-freedom motion platform and a visual direction-judgment task. Forty participants were recruited; valid behavioral data from 39 were analyzed. Lateral physical-motion interference predicted slower responses, while congruent motion cues predicted faster responses. The detrimental effect of lateral interference was stronger among participants with higher motion-sickness susceptibility. This is a preprint and an in-vehicle motion-platform experiment, not a website or scrolling-animation study. It cannot supply a safe animation threshold for HG.
- **Allison & Palmisano (2025), “Visual Factors in Cybersickness: A Literature Survey and Meta-Analysis,”** DOI: https://doi.org/10.1163/22134808-bja10181. The indexed abstract reports 97 human-participant studies selected from 4,622 records. It synthesizes visual factors in virtual-reality cybersickness, including field of view, motion type, velocity/direction, resolution, contrast, luminance and visual reference frames. It is useful background for understanding VR visual-motion risk, but it is not evidence that normal website transitions cause cybersickness.
- **Wibble & Pansell (2023), “Clinical characteristics of visual motion hypersensitivity: a systematic review,”** DOI: https://doi.org/10.1007/s00221-023-06652-3. Retained as clinical background only: it covers risk groups and optokinetic/visual-motion exposure, not direct website interventions.

**Engineering decision:** retain live `prefers-reduced-motion` handling, remove unnecessary large-field/parallax movement where practical, keep content understandable without animation, and ensure users can operate core functions without motion. Do not label these measures as treatment or prevention. Do not invent a universal “safe” speed, duration, or frequency from VR studies.

## 2. Additional cognitive accessibility evidence

- **Moreno et al. (2023), “Designing user interfaces for content simplification aimed at people with cognitive impairments.”** The paper describes cognitive-accessibility patterns applied to the Easier web system, which supports understanding text through complex-word detection and easier replacements/definitions. User tests involved people with intellectual disabilities and older people; the abstract reports that participants could use the interfaces and had a satisfactory experience. It is direct web-interface evidence, but it concerns a specific text-simplification system and does not establish universal preferences for simplified content. PubMed Central: https://pmc.ncbi.nlm.nih.gov/articles/PMC10036960/
- **Alehagen et al. (2026), “Operationalizing the ICF Core Sets for Autism and ADHD: A Multiple-Methods Feasibility Study.”** The indexed abstract reports 678 assessments on an online platform, with feedback from people diagnosed with autism and/or ADHD, relatives, general-population participants and professionals, plus interviews/focus groups. The authors report feasibility and user-friendliness alongside areas requiring refinement. This is promising platform-level evidence, but it is not a controlled test of a general portfolio site and the abstract alone does not establish which specific UI features caused the results. PubMed Central: https://pmc.ncbi.nlm.nih.gov/articles/PMC13222184/
- **Ekin et al. (2025), “Impact of web accessibility on cognitive engagement in individuals without disabilities: Evidence from a psychophysiological study.”** Twenty participants without disabilities read news websites with differing low-vision and cognitive-accessibility features while eye movements and heart-rate variability were monitored. The abstract reports higher cognitive engagement with cognitive-accessibility enhancements and easier reading with low-vision features. This is web-based experimental evidence, but the sample did not include disabled participants; it cannot substitute for testing with people with cognitive disabilities. DOI: https://doi.org/10.1371/journal.pone.0328552
- **Er-Raji et al. (2026), “A cognitive accessibility review of national palliative care resources with people with cognitive disabilities.”** Eight people with lived experience reviewed three resources and highlighted dense vocabulary, abstract phrasing and inconsistent sequencing as barriers. Plain language, clear segmentation, simple visual layouts and concrete prompts were valued. This is qualitative health-information research, not a general web usability benchmark. DOI: https://doi.org/10.1186/s12904-026-02067-3
- **Aljedaani & Mollik (2026), “Large Language Models for Web Accessibility: A Systematic Literature Review,”** arXiv:2605.13873. The preprint reports a final set of 33 primary studies after screening and snowballing, despite the title's broad systematic-review framing. It finds LLM work concentrated on content generation, issue detection and semantic remediation; cognitive accessibility guidance is less represented, and fewer studies involve users with disabilities than automated/expert evaluation. This reviews LLM-enabled accessibility work, not the effectiveness of a particular portfolio UI. Treat as a preprint pending peer-review status confirmation: https://arxiv.org/abs/2605.13873

**Engineering decisions:** retain predictable navigation, meaningful headings, clear link labels, concise instructions, readable content, concrete status/error text, and user-controlled presentation. Avoid forcing a single simplified mode or inferring needs from a diagnosis. Include people with disabilities in task-based testing when feasible.

## 3. Normative WCAG clarification

- **WCAG 2.3.1 Three Flashes or Below Threshold is Level A.** W3C's Understanding document explains that the complete assessment includes flash rate and applicable general-flash/red-flash thresholds, as well as the relevant flashing area. Analyze content at its largest presentation size; short looping clips such as GIFs must be assessed while looping. A frequency-only script or a “below 3 Hz” label is not a complete test. Normative source: https://www.w3.org/WAI/WCAG22/Understanding/three-flashes-or-below-threshold.html
- **WCAG 2.3.3 Animation from Interactions is Level AAA, not AA.** W3C explains the distinction between user-triggered animation under 2.3.3 and qualifying automatically moving content under 2.2.2. W3C identifies C39 (CSS `prefers-reduced-motion`), SCR40 (JavaScript use of the preference), and a user-set preference as sufficient techniques for 2.3.3. The live JavaScript preference listener already implemented in HG is a stronger practical adaptation; it is not proof of AA conformance. Source: https://www.w3.org/WAI/WCAG22/Understanding/animation-from-interactions.html
- MDN's accessibility guidance notes that reduced-motion preference should reduce or remove non-essential movement rather than indiscriminately disabling every animation, and that the preference value is `reduce`: https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Media_queries/Using_for_accessibility

## 4. Source and method boundaries

- Used Exa and Parallel for independent web/W3C discovery, and Firecrawl's indexed scholarly-paper search and full-text passage retrieval for academic records.
- Firecrawl's scholarly index includes PubMed/PMC and other biomedical/life-science sources alongside arXiv and HCI literature. This follow-up used that research index; it did not execute a separate Alexandria PubMed or Europe PMC provider query.
- Undermind's search/metadata tools are temporarily rate-limited on the connected free account until approximately **2026-11-28 17:30 UTC (2026-11-29 00:30 WIB)**. No new Undermind search or metadata lookup is claimed in this follow-up. Existing workspace papers and full-text notes remain available.
- No standalone connector named “Life Sciences Databases” or “Life Sciences Literature” was exposed in the current tool catalog. Do not report those as separately invoked tools.
- The new motion HCI result is a preprint and uses a motion platform; the LLM accessibility review is also a preprint. Abstracts and indexed passages were used where full text was not retrieved. Their evidence is not equivalent to peer-reviewed, direct website testing.

## 5. Next engineering validation priorities

1. Inventory every embedded video/audio element and identify source, duration, autoplay/loop, captions, transcripts, audio description needs and whether it can expand to fullscreen.
2. Inspect actual media frame-by-frame for WCAG 2.3.1 at the largest supported display size; do not infer safety from metadata or nominal frame rate.
3. Verify each video player's accessible name, keyboard operation, focus order, captions/transcript availability and pause/stop controls.
4. Run manual screen-reader checks with at least one desktop and one mobile screen reader; automated axe and browser-engine tests are not substitutes.
5. Test key portfolio tasks with people who use assistive technologies and people with varied cognitive access needs; obtain informed consent and avoid collecting diagnoses unless strictly necessary.

## 6. Validation state

GitHub Actions run #104 passed on `portfolio-setup`, commit `c7216f2f38e83a5ec150cc9e631c846e987d18d1`: https://github.com/Hanzet22/HG/actions/runs/46164390759

The run completed dependency audit, source checks, Astro type/content checks and build, Chromium/Firefox/WebKit plus axe accessibility smoke tests, Next lint and Next build. No deployment step ran. Netlify Production remains untouched.
