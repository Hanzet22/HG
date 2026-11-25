# ATTRIBUTIONS

This repository contains **HG MorphGlass**, a browser-oriented glass rendering adaptation developed for the HyperGaruda Astro portfolio and Next.js companion.

## Upstream project

- **Project:** [Mochy Music](https://github.com/realidkroo/Mochy-Music)
- **Upstream repository:** https://github.com/realidkroo/Mochy-Music
- **Audited and pinned revision:** [e6a17d2eb9f48b503fe07e35049cb522b8486db2](https://github.com/realidkroo/Mochy-Music/commit/e6a17d2eb9f48b503fe07e35049cb522b8486db2)
- **Upstream license:** GNU General Public License, version 3 (GPL-3.0)
- **HG MorphGlass adaptation license:** GPL-3.0-only; see [shared/morphglass/LICENSE](shared/morphglass/LICENSE).

The upstream project is credited as the architectural and research reference for the adaptation. The pinned revision is used so that the audited implementation can be identified reproducibly. This file does not claim that the upstream project endorses, maintains, or sponsors HG MorphGlass.

## Upstream components studied

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

The file-level audit, including the upstream blob identifiers and the corresponding HG adaptation decisions, is maintained in [shared/morphglass/UPSTREAM_AUDIT.md](shared/morphglass/UPSTREAM_AUDIT.md). The reverse-engineering notes are in [shared/morphglass/REVERSE_ENGINEERING.md](shared/morphglass/REVERSE_ENGINEERING.md).

## What HG implements

HG is a **web-platform adaptation**, not a Kotlin/Jetpack Compose port. Its implementation is written for browser APIs and keeps a clear boundary between the CSS backend and the optional GPU renderer:

- The CSS backend provides DOM glass using `backdrop-filter`, tint, layered highlights, rim/border treatment and fallback surfaces.
- The WebGL2 renderer accepts an explicitly supplied, readable `CanvasImageSource` (such as a canvas, image, video or supported bitmap source). It stages that source, applies bounded GPU blur passes, composites the glass treatment and clips the output.
- Typed configuration and capability detection provide bounded values and feature checks.
- Astro and Next.js adapters mount and clean up the shared browser interaction layer.

## Material differences and non-portable upstream APIs

The following upstream Android mechanisms are **not** represented as browser equivalents and are not claimed to have been ported:

- Android `RenderNode`, `HardwareBuffer`, `SurfaceTexture`, EGL worker threads and Jetpack Compose capture/layout APIs.
- AGSL shader source or the Android AGSL-to-GLSL translator as a compatible browser shader language.
- Automatic access to arbitrary composited DOM pixels.

Browser security and CORS rules prevent a page from treating arbitrary DOM content as a freely readable WebGL texture. Therefore ordinary HTML cards use the CSS backend. The WebGL2 backend is opt-in and requires an explicit source supplied by its consumer; CSS `backdrop-filter` is not described as physical shader refraction.

## Provenance and licensing notes

- HG's MorphGlass implementation files carry GPL-3.0-only SPDX notices where applicable, and the complete license text is included at [shared/morphglass/LICENSE](shared/morphglass/LICENSE).
- The HG CSS surface foundation is an HG browser implementation, not a copied Mochy Android stylesheet or shader.
- The TypeScript configuration, capability, lifecycle and WebGL2 modules implement browser-specific contracts informed by the upstream architecture. See their source headers and the file-level audit for the precise mapping.
- Preserve applicable upstream copyright, license and attribution notices when redistributing covered upstream material. Do not remove or rewrite notices in source files.
- Other dependencies and assets retain their own licenses; this attribution does not relicense them.

This attribution is a technical provenance record, not legal advice. Before public distribution, review the exact combined work, dependency licenses, notices and GPL corresponding-source obligations.
