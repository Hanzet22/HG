export type MorphGlassQuality = "low" | "medium" | "high";

export interface MorphGlassOptions {
  /** Selector used to find glass surfaces. */
  selector?: string;
  /** Disable pointer-driven highlight tracking. */
  pointerTracking?: boolean;
  /** Initial rendering profile applied only when an element has no profile. */
  quality?: MorphGlassQuality;
}

export interface MorphGlassController {
  /** Re-scan the root for newly inserted surfaces. */
  refresh(): void;
  /** Change the quality profile for all currently mounted surfaces. */
  setQuality(quality: MorphGlassQuality): void;
  /** Remove listeners and restore inline properties changed by the engine. */
  destroy(): void;
}

const DEFAULT_SELECTOR = ".hg-morph-glass";
const VALID_QUALITIES = new Set<MorphGlassQuality>(["low", "medium", "high"]);

/**
 * Mounts the HG MorphGlass interaction layer.
 *
 * The renderer is CSS-first and intentionally framework-agnostic: call it
 * from an Astro client script or a Next.js client component/effect.
 * It does not access browser globals until invoked.
 */
export function mountMorphGlass(
  root: ParentNode = document,
  options: MorphGlassOptions = {},
): MorphGlassController {
  const selector = options.selector ?? DEFAULT_SELECTOR;
  const pointerTracking = options.pointerTracking ?? true;
  const initialQuality = options.quality ?? "medium";
  const elements = new Set<HTMLElement>();
  const cleanups = new Map<HTMLElement, () => void>();
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const coarsePointer = window.matchMedia("(pointer: coarse)");

  if (!VALID_QUALITIES.has(initialQuality)) {
    throw new TypeError(`Unsupported MorphGlass quality: ${initialQuality}`);
  }

  function mountElement(element: HTMLElement): void {
    if (elements.has(element)) return;

    elements.add(element);
    if (!element.dataset.hgGlassQuality) {
      element.dataset.hgGlassQuality = initialQuality;
    }

    if (!pointerTracking || reducedMotion.matches || coarsePointer.matches) {
      return;
    }

    const onPointerMove = (event: PointerEvent): void => {
      const rect = element.getBoundingClientRect();
      if (rect.width <= 0 || rect.height <= 0) return;

      const x = ((event.clientX - rect.left) / rect.width) * 100;
      const y = ((event.clientY - rect.top) / rect.height) * 100;
      element.style.setProperty("--hg-mg-pointer-x", `${Math.min(100, Math.max(0, x))}%`);
      element.style.setProperty("--hg-mg-pointer-y", `${Math.min(100, Math.max(0, y))}%`);
    };

    const onPointerLeave = (): void => {
      element.style.removeProperty("--hg-mg-pointer-x");
      element.style.removeProperty("--hg-mg-pointer-y");
    };

    element.addEventListener("pointermove", onPointerMove, { passive: true });
    element.addEventListener("pointerleave", onPointerLeave, { passive: true });
    cleanups.set(element, () => {
      element.removeEventListener("pointermove", onPointerMove);
      element.removeEventListener("pointerleave", onPointerLeave);
      onPointerLeave();
    });
  }

  function refresh(): void {
    root.querySelectorAll<HTMLElement>(selector).forEach(mountElement);
  }

  function setQuality(quality: MorphGlassQuality): void {
    if (!VALID_QUALITIES.has(quality)) {
      throw new TypeError(`Unsupported MorphGlass quality: ${quality}`);
    }
    elements.forEach((element) => {
      element.dataset.hgGlassQuality = quality;
    });
  }

  function destroy(): void {
    cleanups.forEach((cleanup) => cleanup());
    cleanups.clear();
    elements.forEach((element) => {
      delete element.dataset.hgGlassQuality;
    });
    elements.clear();
  }

  refresh();

  return { refresh, setQuality, destroy };
}


// Public typed configuration and opt-in GPU renderer.
export { normalizeMorphGlassConfig, DEFAULT_MORPH_GLASS_CONFIG } from "./core/config";
export type { MorphGlassConfig, MorphGlassConfigInput } from "./core/config";
export { detectMorphGlassCapabilities } from "./core/capabilities";
export type { MorphGlassCapabilities } from "./core/capabilities";
export { createMorphGlassRenderer } from "./renderer/webgl2";
export type { MorphGlassRenderer, MorphGlassRendererOptions, NormalizedSourceRect } from "./renderer/webgl2";
