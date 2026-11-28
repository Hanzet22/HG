# Embedded media accessibility inventory

**Repository:** `Hanzet22/HG`  
**Branch:** `portfolio-setup`  
**Audit date:** 2026-11-28  
**Scope:** Static source inspection of embedded video elements in archived Astro error pages and the Next companion.

## Inventory

| Source file | Page | Media URL | Native controls | Autoplay/loop | Caption track in markup |
|---|---|---|---|---|---|
| `legacy/403.html` | 403 Forbidden | `https://files.catbox.moe/vxiws3.mp4` | Yes | Neither found | None found |
| `legacy/404.html` | 404 Not Found | `https://files.catbox.moe/uga9i3.mp4` | Yes | Neither found | None found |
| `legacy/418.html` | 418 I'm a Teapot | `https://files.catbox.moe/376872.mp4` | Yes | Neither found | None found |
| `legacy/429.html` | 429 Too Many Requests | `https://files.catbox.moe/vz0vsb.mp4` | Yes | Neither found | None found |
| `HyperGaruda-Next/app/429/page.tsx` | Next 429 | `https://files.catbox.moe/vz0vsb.mp4` | Yes | Neither found | None found |
| `HyperGaruda-Next/app/Teapot/page.tsx` | Next 418 | `https://files.catbox.moe/xjm054.mp4` | Yes | Neither found | None found |

**Source count:** 6 video elements across 6 source files; **unique media URLs:** 5. The Next 429 player reuses the legacy 429 MP4. The Next 418 player uses a different MP4 from the legacy 418 page.

## What source inspection confirms

- All six elements have native playback controls.
- All six have an authored accessible name through `aria-label`.
- The four legacy HTML elements use `playsinline` and `preload="metadata"`.
- The two Next elements use `controls`, `playsInline`, and `preload="metadata"`.
- No `autoplay` or `loop` attribute was found on these six elements.
- No authored `<track kind="captions">` element was found in the inspected markup.

## What source inspection does not confirm

- Whether each MP4 contains spoken dialogue, meaningful sound effects, music, or no audio.
- Whether captions or transcripts are available from the media host.
- Whether the visual information in each clip requires audio description or another equivalent.
- Whether any frame sequence violates WCAG 2.3.1.
- Whether the player is fully operable with keyboard and screen readers in the rendered deployment.

The accessible name identifies the player but is **not** a transcript, caption track, or description of the media's meaningful content. Do not treat the absence of a track in source markup as proof that captions are unnecessary: first inspect the actual audio track and content.

## Required manual follow-up

1. Inspect the audio/video tracks of all five unique MP4 files.
2. If synchronized audio contains meaningful speech or sound information, prepare accurate synchronized captions and verify them in each player.
3. Provide a transcript or equivalent alternative where WCAG 1.2.1/1.2.3 applies; assess audio description under 1.2.5 for prerecorded synchronized video where needed.
4. Analyze the actual frames at the largest supported presentation size, including fullscreen and looping contexts, against the full WCAG 2.3.1 criterion.
5. Test keyboard controls, focus visibility, accessible names, playback state announcements, and captions using desktop and mobile screen readers.

## Evidence boundary

This is a source-code inventory, not a media-content audit or WCAG conformance determination. No captions or transcripts have been fabricated. The videos were not assumed to be silent, and no claims about their visual/audio content are made without inspecting the media itself.

Related research:
- [WCAG research plan](WCAG-RESEARCH.md)
- [WCAG research follow-up — 2026-11-28](WCAG-RESEARCH-FOLLOWUP-2026-11-28.md)
- [W3C WCAG 2.2](https://www.w3.org/TR/WCAG22/)
