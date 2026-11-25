# HG MorphGlass

Framework-agnostic glass-surface foundation for the HyperGaruda portfolio ecosystem.

## Status

**Phase 1 — engine foundation.** This package provides the CSS renderer and a small TypeScript interaction controller. It does not yet modify either website's UI or load itself automatically.

## Files

- `morphglass.css` — progressive CSS glass surface, edge treatment, highlight, quality profiles, and accessibility fallbacks.
- `index.ts` — browser-side controller for pointer-aware highlight positioning, refresh, quality changes, and cleanup.

## Use

Import the stylesheet once from the app's global stylesheet or entry point:

```css
@import "./shared/morphglass/morphglass.css";
```

Mark only the surfaces that should receive the effect:

```html
<section class="hg-morph-glass" data-hg-glass-quality="medium">
  ...
</section>
```

Mount the controller from a browser-only entry point:

```ts
import { mountMorphGlass } from "./shared/morphglass";

const glass = mountMorphGlass(document, {
  quality: "medium",
  pointerTracking: true,
});

// Call glass.refresh() after adding new glass surfaces.
// Call glass.destroy() when the owning view is disposed.
```

The same engine can be imported by Astro client scripts and Next.js client components. Keep browser-only mounting out of server-rendered module scope.

## Rendering model

1. The browser composites the content behind the marked surface with `backdrop-filter` where supported.
2. A translucent tint and saturation treatment establish the glass body.
3. Pseudo-elements add a restrained rim, bevel-like highlight, and pointer-positioned sheen.
4. Quality profiles tune blur and highlight intensity without changing component markup.
5. Unsupported browsers receive an opaque/translucent surface fallback.

This CSS-first phase does **not** implement physical refraction or a custom per-pixel shader. Those require a separate WebGL/WebGPU renderer and explicit performance evaluation; they are not simulated by claiming that `backdrop-filter` is refraction.

## Accessibility and performance

- Respects reduced-motion and reduced-transparency preferences.
- Disables pointer tracking for coarse pointers and reduced-motion users.
- Uses event listeners only on explicitly marked surfaces.
- Does not run a permanent animation loop or request animation frames.
- Use glass selectively; large overlapping blur layers can be expensive on mobile GPUs.
- Provide meaningful contrast in the content itself; glass is decorative and must not carry status information by color alone.

## Research and implementation boundary

The design study referenced Mochy Music's public module-glass documentation:
https://realidkroo.github.io/Mochy-Music/wiki/#modules-glass

Mochy's repository is licensed under GPL-3.0:
https://github.com/realidkroo/Mochy-Music

HG MorphGlass is an independent, clean-room implementation of general visual principles (blurred backdrop, tint, edge highlight, configurable quality). No Mochy source code, shader text, or assets are copied into this engine. Review the upstream license before considering direct code reuse.

## Integration plan

1. Engine foundation (this phase).
2. Astro portfolio integration and visual tuning.
3. Next.js Link Hub integration using the same shared engine.
4. Browser/device performance review and optional shader research as a separate phase.
