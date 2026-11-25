# Attributions and Third-Party Materials

This document tracks known third-party works referenced by the **entire HyperGaruda portfolio ecosystem**, including the main Astro portfolio and the companion Next.js Link Hub. It covers works that may be linked, embedded, displayed, or externally hosted by either site.

> **Important — attribution is not permission.** A source URL or credit does not by itself authorize downloading, modifying, re-hosting, or redistributing a work. Unless a valid license or permission has been confirmed and recorded below, reuse permission must be treated as **unverified**. This document does not claim ownership of the works listed here.

## Known Third-Party Media

The entries below are a working inventory, not a guarantee that every detail or current deployment location has been independently verified. The specific on-site page/path and direct Catbox asset URL were not recorded in the current inventory; add them when confirmed.

### 1. FurryGintan — X post/video

- **Creator/account shown by source:** [FurryGintan](https://x.com/FurryGintan)
- **Original source:** https://x.com/FurryGintan/status/2106244638730547385
- **Title/details:** `Kongfu Furry`
- **Reported portfolio use:** A copy has been described as hosted through Catbox; exact asset URL and page/path are not recorded here.
- **License/permission status:** Not verified/documented

### 2. “モンストロを踊ってみた feat.银碳” — YouTube video

- **Title shown/provided:** `※光の点滅に注意 #プロダクション体育館 モンストロを踊ってみた feat.银碳`
- **Original source:** https://youtu.be/zlVdpCzs9x8
- **Uploader/rights holder:** Not independently verified
- **Reported portfolio use:** A copy has been described as hosted through Catbox; exact asset URL and page/path are not recorded here.
- **License/permission status:** Not verified/documented
- **Content note:** The source title includes a warning about flashing lights.

### 3. “Watch Out for Lemon Attack” — Jvan

- **Creator/channel:** Jvan
- **Title shown/provided:** `Watch Out for Lemon Attack #simpsons #meme #lemonposting`
- **Original source:** https://youtube.com/shorts/0_tdLp8CSe0
- **Reported portfolio use:** A copy has been described as hosted through Catbox; exact asset URL and page/path are not recorded here.
- **License/permission status:** Not verified/documented

### 4. “Hoodbob Employee of the Month” — Hood VO

- **Creator/channel:** Hood VO
- **Title shown/provided:** `Hoodbob Employee of the Month - Spongebob In The Hood (#15)`
- **Original source:** https://youtu.be/LWKIFtzgZew
- **Reported portfolio use:** A copy has been described as hosted through Catbox; exact asset URL and page/path are not recorded here.
- **License/permission status:** Not verified/documented

## Ownership and Reuse Guidelines

- Each third-party work remains subject to the rights and license terms of its respective owner or rights holder.
- Do not assume a work is public domain or licensed for reuse merely because it is publicly viewable or has a source link.
- An open-source license applied to this portfolio's code does **not** automatically apply to third-party videos, images, audio, music, characters, logos, trademarks, or other materials.
- If a license or permission for a re-hosted copy cannot be verified, consider removing or restricting that copy, obtaining permission from the relevant rights holder, or replacing it with a link/embed offered by the original platform where suitable.
- A credit in this file is a record of attribution/source information, not a statement that the portfolio has permission to reproduce the work.

## Copyright or Takedown Requests

If you are a copyright holder or an authorized representative and believe a listed item needs review, contact the maintainer through one of these routes:

- **GitHub profile:** https://github.com/Hanzet22
- **Repository Issues:** https://github.com/Hanzet22/HG/issues
- **Email:** Use the maintainer's publicly listed contact email if one is available. No email address is printed here because a verified public contact address has not been provided for this document.

Please include the affected portfolio URL or asset URL, the original work/source if available, an explanation of the rights involved, and the action requested. Please avoid sharing private or sensitive information in a public GitHub issue; use an appropriate private contact route for confidential details.

Requests will be reviewed in good faith. Where appropriate, access to the affected material may be restricted or the material removed while the request is reviewed. This voluntary process does not replace legal procedures or determine the legal merits of a claim.

## Keeping This Inventory Current

Whenever material is added, changed, or removed from either portfolio site, update this file with:

1. Creator/uploader or rights holder, where known.
2. Work title and original source URL.
3. The website, page, component, or asset path where it appears.
4. Hosting method or direct asset URL, if hosted outside the original platform.
5. Applicable license or written permission, with a reliable reference where possible.
6. Verification status and the date it was checked.

Do not mark a license or permission as confirmed unless there is a reliable basis for doing so. If a source is removed, retain or update the entry only as needed to explain the attribution history and current status.


---

## HG MorphGlass — Mochy Music adaptation

This repository contains **HG MorphGlass**, a browser-oriented glass rendering adaptation developed for the HyperGaruda Astro portfolio and Next.js companion.

### Upstream project

- **Project:** [Mochy Music](https://github.com/realidkroo/Mochy-Music)
- **Upstream repository:** https://github.com/realidkroo/Mochy-Music
- **Audited and pinned revision:** [e6a17d2eb9f48b503fe07e35049cb522b8486db2](https://github.com/realidkroo/Mochy-Music/commit/e6a17d2eb9f48b503fe07e35049cb522b8486db2)
- **Upstream license:** GNU General Public License, version 3 (GPL-3.0)
- **HG MorphGlass adaptation license:** GPL-3.0-only; see [shared/morphglass/LICENSE](shared/morphglass/LICENSE).

The upstream project is credited as the architectural and research reference for the adaptation. This file does not claim that the upstream project endorses, maintains, or sponsors HG MorphGlass.

### Upstream components studied

The following files at the pinned revision were examined for their responsibilities and architectural behavior:

| Upstream source path | Role studied in the adaptation |
|---|---|
| `app/src/main/kotlin/com/mochyy/mochymusic/ui/component/ModuleGlass.kt` | Glass surface pipeline, backdrop capture, blur/shader composition, uniforms, clipping and render-effect lifecycle. |
| `app/src/main/kotlin/com/mochyy/mochymusic/ui/component/GlassKit.kt` | Shared glass state, capture lifecycle, blur helpers, fallback coordination and resource cleanup. |
| `app/src/main/kotlin/com/mochyy/mochymusic/modules/skin/SkinExtrasParser.kt` | Bounded parsing and normalization of glass configuration. |
| `app/src/main/kotlin/com/mochyy/mochymusic/modules/skin/ModuleSkin.kt` | Skin and active-glass configuration model. |
| `app/src/main/kotlin/com/mochyy/mochymusic/modules/skin/SkinParser.kt` | Resource and configuration resolution concepts. |
| `app/src/main/kotlin/com/mochyy/mochymusic/modules/skin/SkinPlayerParser.kt` | Validation patterns for visual and layout settings. |
| `app/src/main/kotlin/com/mochyy/mochymusic/modules/skin/ActiveSkin.kt` | Active preset resolution and renderer state concepts. |
| `app/src/main/kotlin/com/mochyy/mochymusic/ui/component/AgslTranspiler.kt` | Shader-language boundary and constrained translation behavior. |
| `app/src/main/kotlin/com/mochyy/mochymusic/ui/component/GlFallbackEngine.kt` | GPU fallback pipeline and multi-pass blur concepts. |
| `app/src/main/kotlin/com/mochyy/mochymusic/ui/component/GlFallbackSurfaces.kt` | Renderer lifecycle and surface integration concepts. |
| `app/src/main/kotlin/com/mochyy/mochymusic/ui/component/FrostedGlass.kt` | Frosted-glass fallback treatment. |
| `app/src/main/kotlin/com/mochyy/mochymusic/ui/component/ModuleNavBar.kt` | Glass consumer behavior and surface-state integration. |
| `app/src/main/kotlin/com/mochyy/mochymusic/ui/player/styles/SkinBottomBar.kt` | Glass-like consumer layout reference. |

The file-level audit, upstream blob identifiers and adaptation decisions are maintained in [shared/morphglass/UPSTREAM_AUDIT.md](shared/morphglass/UPSTREAM_AUDIT.md). Reverse-engineering notes are in [shared/morphglass/REVERSE_ENGINEERING.md](shared/morphglass/REVERSE_ENGINEERING.md).

### What HG implements

HG is a **web-platform adaptation**, not a Kotlin/Jetpack Compose port:

- The CSS backend provides DOM glass using `backdrop-filter`, tint, layered highlights, rim/border treatment and fallback surfaces.
- The WebGL2 renderer accepts an explicitly supplied, readable `CanvasImageSource` (such as a canvas, image, video or supported bitmap source). It stages that source, applies bounded GPU blur passes, composites the glass treatment and clips the output.
- Typed configuration and capability detection provide bounded values and feature checks.
- Astro and Next.js adapters mount and clean up the shared browser interaction layer.

### Material differences and non-portable upstream APIs

The following upstream Android mechanisms are **not** represented as browser equivalents and are not claimed to have been ported:

- Android `RenderNode`, `HardwareBuffer`, `SurfaceTexture`, EGL worker threads and Jetpack Compose capture/layout APIs.
- AGSL shader source or the Android AGSL-to-GLSL translator as a compatible browser shader language.
- Automatic access to arbitrary composited DOM pixels.

Browser security and CORS rules prevent a page from treating arbitrary DOM content as a freely readable WebGL texture. Ordinary HTML cards therefore use the CSS backend. The WebGL2 backend is opt-in and requires an explicit source supplied by its consumer; CSS `backdrop-filter` is not physical shader refraction.

### Provenance and licensing notes

- HG's MorphGlass implementation files carry GPL-3.0-only SPDX notices where applicable, and the complete license text is included at [shared/morphglass/LICENSE](shared/morphglass/LICENSE).
- The HG CSS surface foundation is an HG browser implementation, not a copied Mochy Android stylesheet or shader.
- The TypeScript configuration, capability, lifecycle and WebGL2 modules implement browser-specific contracts informed by the upstream architecture. See their source headers and the file-level audit for the precise mapping.
- Preserve applicable upstream copyright, license and attribution notices when redistributing covered upstream material. Do not remove or rewrite notices in source files.
- Other dependencies and assets retain their own licenses; this attribution does not relicense them.

This attribution is a technical provenance record, not legal advice. Before public distribution, review the exact combined work, dependency licenses, notices and GPL corresponding-source obligations.
