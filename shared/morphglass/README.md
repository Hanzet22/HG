# HG MorphGlass

Framework-agnostic glass rendering engine for the HyperGaruda portfolio ecosystem. The adapted MorphGlass package is licensed under GPL-3.0-only.

## Status

**Phase 3 — first browser renderer and portfolio integration.** The CSS backend is active on selected Astro project cards and Next.js link/category cards. The shared TypeScript controller is mounted client-side in Next.js; the Astro legacy runtime applies the same pointer highlight behavior from its existing browser script. An opt-in WebGL2 renderer now implements an explicit-source blur/composite pipeline.

The WebGL2 renderer is not automatically enabled on the portfolio surfaces. CSS remains the baseline and fallback. Physical refraction is available only when a caller supplies a readable `CanvasImageSource`.

## Package layout

- `morphglass.css` — CSS glass surface, rim treatment, highlight, quality profiles and accessibility fallbacks.
- `index.ts` — framework-neutral pointer/highlight controller and public exports.
- `core/config.ts` — bounded typed configuration and safe defaults.
- `core/capabilities.ts` — WebGL2, backdrop-filter and accessibility capability detection.
- `renderer/webgl2.ts` — opt-in WebGL2 source upload, bounded render targets, multi-pass Kawase-style blur and glass composite.
- `REVERSE_ENGINEERING.md` — expanded upstream architecture and source trace.
- `UPSTREAM_AUDIT.md` — file-level provenance and platform adaptation notes.
- `IMPLEMENTATION_PLAN.md` — phased delivery and verification checklist.

## CSS surfaces

Import the stylesheet once and mark selected elements:

```html
<section class="hg-morph-glass" data-hg-glass-quality="medium">
  ...
</section>
```

Astro's legacy pages and the Next.js Link Hub already load the shared CSS. The current integration targets project cards, category cards and link cards rather than applying blur indiscriminately to the entire page.

## Pointer controller

```ts
import { mountMorphGlass } from "./shared/morphglass";

const glass = mountMorphGlass(document, {
  quality: "medium",
  pointerTracking: true,
});

// Refresh after adding surfaces dynamically.
// Destroy when the owning client view is disposed.
glass.refresh();
glass.destroy();
```

The Next.js client adapter mounts this controller in an effect and cleans it up on unmount. Astro's legacy script applies equivalent pointer variables without adding a permanent animation loop.

## Opt-in WebGL2 renderer

```ts
import { createMorphGlassRenderer } from "./shared/morphglass";

const renderer = createMorphGlassRenderer(canvas, {
  config: {
    quality: "medium",
    blur: 14,
    refraction: 0.012,
  },
});

// The source must be readable: same-origin or CORS-enabled image/video,
// or a canvas controlled by the caller.
renderer.render(backdropCanvas, {
  x: 0,
  y: 0,
  width: 1,
  height: 1,
});

renderer.setPointer(0.5, 0.25);
renderer.setConfig({ quality: "low", blur: 8 });
renderer.destroy();
```

The source rectangle uses normalized coordinates with a bottom-left origin. The renderer bounds source dimensions and render-target dimensions, has no implicit animation loop, and releases GPU resources on `destroy()`. On WebGL context loss it calls the optional callback; the owner must remount the renderer after restoration because old WebGL handles are invalid.

**Important browser limitation:** a web page cannot sample arbitrary pixels from the browser's fully composited DOM. Cross-origin image/video sources also require appropriate CORS permission. The renderer intentionally does not attempt DOM screenshot capture. For ordinary DOM backdrops, use the CSS backend.

## Rendering model

1. CSS `backdrop-filter` provides the baseline DOM backdrop treatment.
2. A translucent tint, saturation and edge treatment establish the glass body.
3. Pointer-positioned sheen is driven by CSS variables, disabled for coarse pointers and reduced motion.
4. The WebGL2 path accepts an explicit readable source, downsamples into bounded GPU targets, runs repeated Kawase-style blur passes, then composites tint, edge response and restrained refraction.
5. Unsupported browsers retain an opaque/translucent CSS fallback.

The source texture keeps its allocation while bounded source dimensions remain unchanged; subsequent frames update it with `texSubImage2D`. Render-target textures are resized without replacing their framebuffer attachments. This is an allocation-lifecycle change, not a guaranteed performance improvement: benchmark image and video uploads on target devices before making speed claims.

The WebGL2 path is an optional GPU enhancement. It is not an AGSL runtime, does not execute Mochy's Android shader source, and does not claim pixel-identical output.

## Accessibility and performance

- Respects reduced-motion and reduced-transparency preferences.
- Disables pointer tracking for coarse pointers and reduced-motion users.
- Uses no permanent requestAnimationFrame loop.
- Keeps CSS as the fallback when WebGL2 is unavailable.
- Use glass selectively; overlapping large blur surfaces can be expensive on mobile GPUs.
- Maintain readable contrast independently of glass tint and edge color.

## Upstream adaptation and licensing

HG MorphGlass adapts relevant rendering architecture and source components from Mochy Music at pinned commit `e6a17d2eb9f48b503fe07e35049cb522b8486db2`. See `REVERSE_ENGINEERING.md`, `UPSTREAM_AUDIT.md`, `NOTICE.md` and `LICENSE`.

The upstream design documentation is https://realidkroo.github.io/Mochy-Music/wiki/#modules-glass.

The package uses GPL-3.0-only. Preserve attribution and provenance for adapted components. Do not include Mochy branding or Android-specific runtime dependencies in HG's browser bundle.
