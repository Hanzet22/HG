# HG MorphGlass — Implementation Plan

Status: first WebGL2 renderer and selected-site CSS integration committed  
Target branch: `portfolio-setup`  
License: GPL-3.0-only for the adapted MorphGlass package  
Upstream pin: `realidkroo/Mochy-Music@e6a17d2eb9f48b503fe07e35049cb522b8486db2`

## Product objective

Build a reusable, framework-agnostic glass rendering engine inside the HG monorepo. Astro and Next.js consume the same engine. Preserve upstream concepts and relevant behavior while replacing Android-specific APIs with browser-native backends.

## Package layout

```text
shared/morphglass/
├── core/
│   ├── config.ts
│   └── capabilities.ts
├── renderer/
│   └── webgl2.ts
├── index.ts
├── morphglass.css
├── LICENSE
├── NOTICE.md
├── README.md
├── REVERSE_ENGINEERING.md
├── UPSTREAM_AUDIT.md
└── IMPLEMENTATION_PLAN.md
```

## Delivery status

### Phase 0 — Provenance and compliance
- [x] Pin upstream commit and record core blob SHAs.
- [x] Include GPL-3.0-only license text and attribution.
- [x] Trace the upstream glass renderer, capture lifecycle, fallback, config and shader consumers.
- [ ] Review dependency and asset provenance before any public release.

### Phase 1 — Core contracts
- [x] Define bounded typed glass configuration.
- [x] Detect browser capabilities and accessibility preferences.
- [x] Keep browser globals out of module-import execution.
- [x] Bound numeric inputs, colors and render scale.

### Phase 2 — CSS backend
- [x] Retain CSS progressive enhancement and accessible fallback.
- [x] Add blur, tint, saturation, edge and sheen profiles.
- [x] Respect reduced transparency, reduced motion and coarse pointers.
- [x] Integrate selected Astro and Next.js surfaces.
- [x] Add client lifecycle cleanup in Next.js and pointer highlight behavior in Astro.

### Phase 3 — WebGL2 renderer
- [x] Require an explicit readable CanvasImageSource.
- [x] Implement bounded source staging and GPU render targets.
- [x] Implement repeated Kawase-style blur passes and glass compositing.
- [x] Add WebGL context-loss detection and explicit resource disposal.
- [x] Reuse bounded source texture storage for repeated frames when dimensions are unchanged.
- [x] Preserve render-target framebuffer attachments when resizing texture storage.
- [ ] Verify behavior on real browsers and mobile GPUs.
- [ ] Add automated renderer tests where a WebGL-capable runner is available.

### Phase 4 — Shader contract
- [x] Define a separate browser-side GLSL ES 3.00 implementation contract.
- [x] Port the visual concepts of backdrop blur, tint, edge response, sheen and restrained refraction.
- [ ] Add documented custom GLSL shader descriptors and strict validation.
- [ ] Do not claim AGSL source compatibility; a subset transpiler would be a separate project.

### Phase 5 — Framework integration and release
- [x] Add a Next.js client-only lifecycle adapter.
- [x] Integrate the CSS backend in Astro's legacy asset response.
- [x] Register the legacy Join page in the SSR asset map.
- [ ] Add an Astro-native component/adapter if the portfolio migrates away from the legacy HTML response.
- [ ] Evaluate WebGL2 on selected visual surfaces only; keep CSS default.
- [ ] Run Astro and Next.js builds and inspect Deploy Previews.
- [ ] Keep both Netlify Production auto-publishing locks in place until explicit release approval.

## Non-negotiable browser boundaries

- Do not attempt to capture arbitrary composited DOM pixels.
- Only sample same-origin/CORS-readable images, videos or caller-owned canvases.
- Never execute untrusted remote shader source.
- Do not import Kotlin, Compose, RenderNode, EGL, SurfaceTexture or AGSL runtime code into browser bundles.
- CSS `backdrop-filter` is not physical refraction.
- No permanent animation loop for static glass surfaces.
