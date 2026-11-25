/**
 * Browser capability detection for HG MorphGlass.
 * SPDX-License-Identifier: GPL-3.0-only
 */

export interface MorphGlassCapabilities {
  webgl2: boolean;
  backdropFilter: boolean;
  reducedMotion: boolean;
  reducedTransparency: boolean;
  coarsePointer: boolean;
  maxTextureSize: number;
}

export function detectMorphGlassCapabilities(
  view: Window = window,
): MorphGlassCapabilities {
  const probe = view.document.createElement("canvas");
  const gl = probe.getContext("webgl2", {
    alpha: true,
    antialias: false,
    depth: false,
    stencil: false,
    powerPreference: "low-power",
  });

  const style = view.document.documentElement.style;
  const backdropFilter =
    "backdropFilter" in style || "webkitBackdropFilter" in style;

  const capabilities: MorphGlassCapabilities = {
    webgl2: gl !== null,
    backdropFilter,
    reducedMotion: view.matchMedia("(prefers-reduced-motion: reduce)").matches,
    reducedTransparency: view.matchMedia("(prefers-reduced-transparency: reduce)").matches,
    coarsePointer: view.matchMedia("(pointer: coarse)").matches,
    maxTextureSize: gl ? gl.getParameter(gl.MAX_TEXTURE_SIZE) as number : 0,
  };

  gl?.getExtension("WEBGL_lose_context")?.loseContext();
  return capabilities;
}
