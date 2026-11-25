# HG MorphGlass — Reverse Engineering Notes

Pinned upstream: `realidkroo/Mochy-Music@e6a17d2eb9f48b503fe07e35049cb522b8486db2`  
Repository: https://github.com/realidkroo/Mochy-Music  
Target: HG monorepo, `shared/morphglass/`  
License boundary: GPL-3.0-only for adapted MorphGlass components.

## 1. Scope

The initial audit listed 12 core files. The expanded source-tree pass identified the directly relevant implementation and integration set below. A broad filename scan returned 197 possible matches, but that is not a count of direct glass dependencies: many are unrelated module, player, renderer, and resource files. The direct implementation set is narrowed here by symbol and data-flow tracing.

### Core capture, rendering, and fallback

| File | Blob SHA | Role |
|---|---|---|
| `ui/component/ModuleGlass.kt` | `d002a656026acbdf0a3e58275008f340630450de` | Module chrome glass composition, shader uniforms, RenderEffect cache, clipping |
| `ui/component/GlassKit.kt` | `56ac148ffa3598d07a083cc1cdbe7b5cf7c84336` | Glass state, RenderNode capture, damage boundaries, downscaled blur and progressive glass |
| `ui/component/AgslShader.kt` | `4dc043233f103196529e415c6593b3140da84814` | API-guarded RuntimeShader construction, uniforms and RenderEffect adapter |
| `ui/component/AgslTranspiler.kt` | `22d5087574ed68d3589617a9cf4b4775faafce1a` | Restricted AGSL/SKSL-to-GLSL-ES-3.00 translation |
| `ui/component/GlFallbackEngine.kt` | `4633beedab48d911bdca58cdf56b4735a1dc25dd` | Shared EGL/GLES3 worker, shader program cache, OES-to-FBO blit, Dual-Kawase passes |
| `ui/component/GlFallbackSurfaces.kt` | `8022a5964ba5da19b5808f42ff0eb9928d6a2862` | Capture scheduling, fallback glass surfaces, cached blurred texture and shader dispatch |
| `ui/component/BlurEffectCache.kt` | `7dd38544febc2586403acc38500a238f740d960a` | Quantized native blur-effect cache and release |
| `ui/component/ProgressiveBlur.kt` | `06c25bfa177625758e684313ed15b9797cb42b4e` | Multi-band variable blur, capture reach, pre-blur and mask composition |
| `ui/component/FrostedGlass.kt` | `71135dd26db457834f09d4597405b692e7fb25a0` | Shared chrome tint, grain, outline, shadow and fallback selection |
| `ui/component/OnlineBlur.kt` | `f7033ecd6de7d6874397c2d5ac1874535ded5b2f` | Thumbnail-only image blur; not the main live backdrop pipeline |

### Configuration, shader activation, and consumers

| File | Blob SHA | Role |
|---|---|---|
| `modules/skin/SkinExtrasParser.kt` | `19747dffd8e757bb9fff15c37a5f9e8a3f741db5` | Parses glass blur, progressive direction/ramp, tint, bleed, outline, shader file and uniforms |
| `modules/skin/ModuleSkin.kt` | `fc6f19bbfc3ab313336483db3b0e155e67ed146d` | SkinGlass/SkinGlassConfig models, fallback and shader references |
| `modules/skin/SkinParser.kt` | `7a3ea820d5a2f1ce8547b4fce4cf9818d5774792` | Resolves skin manifest and resources |
| `modules/skin/SkinPlayerParser.kt` | `3b20b3d8778c93d76006721f5317f6476587bc56` | Parses player options and bounded shader uniforms |
| `modules/skin/ActiveSkin.kt` | `52811cdd121c6730cb678f399f323ae3e029cdf5` | Validates, compiles, caches and activates glass/player shaders |
| `ui/player/styles/SkinShader.kt` | `dc58f91e52e35a59d99eea159aea237d9c3b6586` | Declared-uniform contract and dynamic uniform updates |
| `ui/player/styles/SkinSurface.kt` | `c5c603359ddeab9cb171381f57d988871e937ce8` | Player surface consumers and glass-adjacent compositing |
| `ui/player/styles/SkinBackdrops.kt` | `05b49e34f7be0b94f0647174c156dbaa901e88aa` | Backdrop selection and rendering |
| `ui/player/styles/SkinBottomBar.kt` | `1301789e7d09ca04a0712c5d27778283c4c4d426` | Bottom-bar chrome consumer |
| `ui/component/ModuleNavBarMotion.kt` | `9e76bc3069e8e6d69fec0f80c23fa76dd9d49122` | Animated nav geometry and pill state passed to glass shader |
| `ui/player/styles/SkinShader.kt` test coverage | `c2f1c059ab747a8b9d2c598584c9a48ffae7703d` | AGSL transpiler tests, including the liquid-glass shader contract |

## 2. Reconstructed pipeline

1. **Skin parse:** the skin parser reads a glass declaration. The extras parser accepts a boolean/number shorthand or an object with bounded blur, progressive direction, ramp, tint, bleed, outline, shader path and uniforms. Shader suffixes are restricted to the supported AGSL/SKSL forms.
2. **Activation:** ActiveSkin selects the active glass provider, validates shader source, compiles it once, caches the result, and exposes an immutable active-glass state. A static fallback remains available when shader compilation or a platform backend is unavailable.
3. **Backdrop capture:** GlassState owns a recorded RenderNode and root position. glassRoot records the app backdrop. Damage boundaries constrain invalidation so unrelated animated content does not force every glass surface to redraw.
4. **Native path:** on Android 13+, ModuleGlass builds a RuntimeShader RenderEffect. The chain blurs the captured content, then feeds it to the glass shader. Uniforms are set only when declared by the shader.
5. **Compatibility path:** on Android 10–12, AGSL is translated to a deliberately limited GLSL ES 3.00 subset and run by a shared EGL/GLES3 worker. SurfaceTexture/OES capture is blitted to an FBO, Dual-Kawase blur is run, and the shader composites the result.
6. **Progressive path:** ProgressiveBlur divides the blur ramp into up to three resolution bands. It calculates capture reach and pre-blur to reduce seams and aliasing, then masks/composites the bands.
7. **Chrome finish:** FrostedGlass provides common tint, grain, outline and shadow. The nav pill geometry and state are uniforms rather than a separate independent renderer.

## 3. Important shader contract

The upstream liquid-glass shader declares a backdrop sampler named `content` and uniforms including `size`, `margin`, `radius`, `density`, `quality`, `pill`, `pillShown`, chrome/accent colours and optical/tint controls. The transpiler extracts declared uniforms, converts `uniform shader` inputs to texture samplers, and supplies coordinate/viewport helpers.

The transpiler is not a general AGSL compiler. It is a constrained source translator. HG must not advertise AGSL compatibility. HG's WebGL backend will define a separate GLSL ES 3.00 contract and validate its own shader inputs.

## 4. Platform boundary and HG decisions

| Mochy / Android | HG / Browser adaptation |
|---|---|
| RenderNode display-list capture | Explicit caller-provided Canvas/Image/Video/texture source only |
| RuntimeShader / AGSL | WebGL2 GLSL ES 3.00; separate shader contract |
| EGL + GLES3 fallback worker | Browser WebGL2 context and GPU render targets |
| SurfaceTexture OES capture | Browser texture upload from readable same-origin/cors-enabled sources |
| Android RenderEffect blur chain | Bounded downsample + separable/Kawase blur passes |
| Compose clipping and layout | Canvas viewport, normalized source rectangle and CSS surface clipping |
| Skin module parser | Typed TypeScript config parser with clamped values |
| Android API-level fallback | Feature detection, WebGL context-loss handling, CSS fallback |

A web page cannot legally or reliably read arbitrary pixels from the browser's fully composited DOM. CORS restrictions also prevent reading pixels from non-CORS image/video sources. Therefore the engine will not promise automatic capture of any page element. The consumer must provide a readable source such as a canvas or same-origin/CORS-enabled image/video. Ordinary DOM cards use CSS `backdrop-filter`.

## 5. Security, lifecycle, and performance constraints

- Do not execute shader source from untrusted remote manifests.
- Do not accept arbitrary uniform names/values without schema and size bounds.
- Limit source dimensions and render scale before allocating GPU textures.
- Keep one WebGL context per renderer instance; release programs, textures, framebuffers and buffers on destroy.
- Handle `webglcontextlost`; require explicit remount/reinitialization after restoration.
- Do not create a permanent animation loop. Render only when source, geometry, pointer, or configuration changes.
- Use reduced-transparency and reduced-motion preferences; disable pointer-driven optical motion for coarse pointers.
- CSS is the dependable baseline. WebGL2 is an optional enhancement, not a mandatory dependency.
- Do not import Android-specific Kotlin, Compose, RenderNode, EGL, SurfaceTexture or AGSL runtime code into the browser bundle.

## 6. Adaptation status

- [x] Pin upstream commit and record core blob SHAs.
- [x] Map native renderer, capture, fallback, configuration and consumer layers.
- [x] Identify browser security/platform boundaries.
- [ ] Implement typed configuration and capability detection.
- [ ] Implement explicit-source WebGL2 blur/composite renderer.
- [ ] Add Astro and Next.js client-only adapters.
- [ ] Integrate only selected portfolio surfaces.
- [ ] Run Astro and Next.js builds and inspect Deploy Previews before any Production unlock.
