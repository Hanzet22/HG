# HG MorphGlass — Implementation Plan

Status: audit and adaptation plan  
Target branch: `morphglass/gpl3-adaptation`  
License: GPL-3.0-only for the adapted MorphGlass package  
Upstream pin: `realidkroo/Mochy-Music@e6a17d2eb9f48b503fe07e35049cb522b8486db2`

## Product objective

Build a reusable, framework-agnostic glass rendering engine inside the HG monorepo. Astro and Next.js consume the same engine. Preserve the upstream concepts and relevant behavior while replacing Android-specific APIs with browser-native backends.

## Proposed package layout

```text
shared/morphglass/
├── LICENSE
├── NOTICE.md
├── README.md
├── UPSTREAM_AUDIT.md
├── IMPLEMENTATION_PLAN.md
├── core/
│   ├── config.ts
│   ├── surface.ts
│   ├── lifecycle.ts
│   └── capabilities.ts
├── renderer/
│   ├── types.ts
│   ├── renderer.ts
│   ├── webgl2/
│   │   ├── context.ts
│   │   ├── pipeline.ts
│   │   ├── blur.ts
│   │   └── composite.ts
│   └── css/
│       └── renderer.ts
├── shaders/
│   ├── contracts/
│   └── glsl/
├── adapters/
│   ├── astro/
│   ├── next/
│   └── react/
└── examples/
    ├── vanilla/
    ├── astro/
    └── next/
```

The existing `morphglass.css` and `index.ts` remain the initial CSS backend and interaction controller. They must be reviewed and updated for the package license and new renderer API before being treated as stable public API.

## Adaptation phases

### Phase 0 — Provenance and compliance
- Pin upstream commit and record blob SHAs.
- Include GPL-3.0-only license text.
- Keep upstream attribution and per-file change history.
- Audit dependencies and bundled assets before release.

### Phase 1 — Core contracts
- Define `MorphGlassConfig`, `GlassSurface`, `BackdropSource`, `ShaderDescriptor`, `QualityProfile`, and renderer lifecycle.
- Validate all numeric values and cap texture dimensions, blur radius, uniforms and shader source size.
- No browser globals at module import time.

### Phase 2 — CSS backend
- Retain progressive enhancement and accessible fallback.
- Expose blur, tint, saturation, border, rim and sheen as validated config.
- Respect reduced transparency, reduced motion and coarse pointer preferences.
- State clearly that CSS backdrop-filter is not physical refraction.

### Phase 3 — WebGL2 renderer
- Require an explicit, readable backdrop source supplied by the consumer.
- Implement render targets, bounded downsampling, Dual-Kawase blur, shader pass and clipped compositing.
- Add WebGL context-loss handling, resource disposal and device capability detection.
- Avoid page-wide DOM capture and avoid cross-origin pixel reads.

### Phase 4 — Shader contract
- Define a documented GLSL ES 3.00 entry-point and uniform contract.
- Port the relevant visual behavior: lens distortion/refraction, tint, edge/rim response and sheen.
- Do not claim AGSL source compatibility. Any AGSL subset transpiler is a later independent deliverable with parser tests.

### Phase 5 — Framework adapters
- Astro: client-only island/script initialization; server rendering must not access `window` or `document`.
- Next.js: client component or effect with deterministic cleanup; never initialize the GPU renderer during server rendering.
- React adapter remains framework-neutral and optional.

### Phase 6 — Integration and quality
- Integrate one or two carefully selected surfaces into the Astro portfolio first.
- Integrate the same shared engine into the Next.js Link Hub only after the shared API stabilizes.
- Test low-end mobile fallback, resize, tab visibility, context loss, reduced transparency and keyboard/accessibility contrast.
- Keep the default portfolio path lightweight; do not apply glass to every panel.

## Release gates

- Source provenance and copyright headers verified.
- GPL-3.0-only license included and package scope documented.
- TypeScript typecheck and production builds pass for both workspaces.
- No GPU resources or event listeners remain after disposal.
- No claims of live refraction when CSS fallback is active.
- Netlify preview deploys for both sites are inspected before production promotion.
