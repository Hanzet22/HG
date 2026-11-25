# HG MorphGlass — Upstream File-Level Audit

Audit snapshot: 2026-11-25  
Upstream: [realidkroo/Mochy-Music](https://github.com/realidkroo/Mochy-Music)  
Pinned upstream commit: [e6a17d2eb9f48b503fe07e35049cb522b8486db2](https://github.com/realidkroo/Mochy-Music/commit/e6a17d2eb9f48b503fe07e35049cb522b8486db2)  
Upstream license: GNU GPL-3.0 (GPL-3.0-only for this adaptation; see upstream `LICENSE` and `.github/CONTRIBUTING.md`).

## Scope and method

This audit covers the relevant glass rendering, shader, configuration, and fallback files at the pinned commit. The Android application is Kotlin/Jetpack Compose; HG is a web portfolio using Astro and Next.js. This is therefore a **port/adaptation**, not a source-compatible Kotlin transplant.

The upstream commit is pinned to make the audit reproducible. Do not silently update this pin: review the upstream diff and repeat the license/file audit first.

## File-level findings

| Upstream path | Blob SHA at pinned commit | Responsibility | HG adaptation |
|---|---|---|---|
| `app/src/main/kotlin/com/mochyy/mochymusic/ui/component/ModuleGlass.kt` | `d002a656026acbdf0a3e58275008f340630450de` | Captures the recorded backdrop, applies blur then AGSL shader, sets uniforms, caches render effects, clips output to the glass surface. | Port the pipeline contract to a WebGL2 renderer with explicit caller-provided backdrop textures. CSS cannot expose arbitrary browser-composited backdrop pixels to a custom shader. |
| `app/src/main/kotlin/com/mochyy/mochymusic/ui/component/GlassKit.kt` | `56ac148ffa3598d07a083cc1cdbe7b5cf7c84336` | Shared glass state, RenderNode capture lifecycle, blur helpers, clipping, and fallback coordination. | Create framework-neutral surface state, capture/texture interfaces, renderer lifecycle, resource cleanup, and bounded blur passes. |
| `app/src/main/kotlin/com/mochyy/mochymusic/modules/skin/SkinExtrasParser.kt` | `19747dffd8e757bb9fff15c37a5f9e8a3f741db5` | Parses glass settings, blur direction, tint, ramp, bleed, outline, shader path, and uniforms; validates/clamps values. | Port as a strict TypeScript schema/parser with numeric bounds, allow-listed uniform names, path restrictions, and safe defaults. |
| `app/src/main/kotlin/com/mochyy/mochymusic/modules/skin/ModuleSkin.kt` | `fc6f19bbfc3ab313336483db3b0e155e67ed146d` | Models module skin, active glass, shader and uniform configuration. | Define typed HG glass config, immutable render state, shader descriptor, and preset contracts. |
| `app/src/main/kotlin/com/mochyy/mochymusic/modules/skin/SkinParser.kt` | `7a3ea820d5a2f1ce8547b4fce4cf9818d5774792` | Parses module manifests and resolves skin resources. | Implement JSON config parsing only; do not import Android module loading, route, or filesystem assumptions. |
| `app/src/main/kotlin/com/mochyy/mochymusic/modules/skin/SkinPlayerParser.kt` | `3b20b3d8778c93d76006721f5317f6476587bc56` | Parses player/layout options and bounded visual values. | Reuse the validation approach for HG surface geometry and animation options; do not port unrelated player models. |
| `app/src/main/kotlin/com/mochyy/mochymusic/modules/skin/ActiveSkin.kt` | `52811cdd121c6730cb678f399f323ae3e029cdf5` | Resolves active visual modules and prepares shader/runtime state. | Build a deterministic active-preset resolver and renderer lifecycle; avoid global mutable state. |
| `app/src/main/kotlin/com/mochyy/mochymusic/ui/component/AgslTranspiler.kt` | `22d5087574ed68d3589617a9cf4b4775faafce1a` | Translates a constrained AGSL/SKSL subset into GLSL ES 3.00 for older Android devices. | Do not transplant the Android transpiler blindly. Define an HG GLSL ES 3.00 shader contract first; AGSL compatibility is a separately scoped parser/compiler task. |
| `app/src/main/kotlin/com/mochyy/mochymusic/ui/component/GlFallbackEngine.kt` | `4633beedab48d911bdca58cdf56b4735a1dc25dd` | EGL/GLES worker, texture processing and Dual-Kawase blur for Android fallback. | Adapt the algorithmic pipeline to WebGL2 render targets and bounded downsample/upsample passes. Android EGL, SurfaceTexture, HardwareBuffer and HandlerThread code are not portable. |
| `app/src/main/kotlin/com/mochyy/mochymusic/ui/component/GlFallbackSurfaces.kt` | `8022a5964ba5da19b5808f42ff0eb9928d6a2862` | Compose lifecycle wrappers around the GLES fallback. | Implement browser lifecycle adapters with explicit mount/dispose, context-loss recovery, and resize handling. |
| `app/src/main/kotlin/com/mochyy/mochymusic/ui/component/FrostedGlass.kt` | `71135dd26db457834f09d4597405b692e7fb25a0` | Built-in frosted fallback treatment. | Retain a CSS fallback for unsupported GPU contexts and reduced-transparency preferences. |
| `app/src/main/kotlin/com/mochyy/mochymusic/ui/component/ModuleNavBar.kt` | `6e56b944c1bc22582332303a81ca012faffbcd06` | Consumer of the glass surface for navigation bar, tab marker and animations. | Use as a behavioral reference for surface geometry and selected-state integration; do not port app navigation. |
| `app/src/main/kotlin/com/mochyy/mochymusic/ui/player/styles/SkinBottomBar.kt` | `1301789e7d09ca04a0712c5d27778283c4c4d426` | Consumer of glass-like player bar layouts. | Treat as a UI integration reference only; outside the renderer core. |

## Important platform differences

1. Android's RenderNode/AGSL pipeline can capture app-rendered content. A browser cannot generally hand arbitrary DOM-composited pixels to WebGL. Cross-origin content and browser security restrictions also prevent treating the whole page as a freely readable texture.
2. HG therefore needs two backends:
   - **CSS backend:** works directly on DOM surfaces using `backdrop-filter`, tint, border and highlight; it is not physical refraction.
   - **WebGL2 backend:** performs actual shader-based distortion/refraction only when the caller supplies an accessible texture/canvas/image source or a controlled scene.
3. WebGPU may be evaluated later as an optional backend. It is not a prerequisite for the first browser renderer.
4. AGSL is not GLSL ES. Shader source must be ported to HG's documented shader interface; do not claim direct compatibility.
5. Android-specific compatibility paths (AGSL on Android 13+, GLES 3 fallback on older Android, RenderNode/HardwareBuffer) are not copied as web APIs.

## Licensing and provenance

- Mochy states GPL v3 and requires contributions to remain under the same license in [CONTRIBUTING.md](https://github.com/realidkroo/Mochy-Music/blob/e6a17d2eb9f48b503fe07e35049cb522b8486db2/.github/CONTRIBUTING.md).
- The upstream [LICENSE](https://github.com/realidkroo/Mochy-Music/blob/e6a17d2eb9f48b503fe07e35049cb522b8486db2/LICENSE) contains GNU GPL version 3.
- HG's adapted MorphGlass code is licensed **GPL-3.0-only**. The full license text is included in this directory's `LICENSE`.
- Preserve upstream copyright and attribution notices in any copied or modified source file. Add a per-file provenance header when adapting code, and record the upstream path and commit.
- Third-party dependencies and any separately licensed upstream components must be audited individually. The parent portfolio remains outside this subdirectory's license unless explicitly included or distributed as a combined derivative work; distribution boundaries require legal review.

## Audit limitations

The upstream note path referenced in a source comment (`docs/notes/module-glass.md`) was not present at the pinned commit. The published [Mochy Wiki](https://realidkroo.github.io/Mochy-Music/wiki/) describes the glass module and shader contract, but it is a live documentation page rather than an immutable file in this snapshot. The audit therefore records the repository commit for source files and links the published wiki separately.

This is a technical provenance record, not legal advice. For a public release, verify all source notices, contributors, dependencies, and distribution packaging.
