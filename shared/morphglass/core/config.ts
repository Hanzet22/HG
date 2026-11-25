/**
 * HG MorphGlass configuration contracts.
 * Adapted from Mochy Music's skin glass configuration model.
 * Upstream: realidkroo/Mochy-Music@e6a17d2eb9f48b503fe07e35049cb522b8486db2
 * SPDX-License-Identifier: GPL-3.0-only
 */

export type MorphGlassQuality = "low" | "medium" | "high";

export interface MorphGlassConfig {
  quality: MorphGlassQuality;
  blur: number;
  saturation: number;
  radius: number;
  tint: readonly [number, number, number, number];
  edge: readonly [number, number, number, number];
  refraction: number;
  rimStrength: number;
  sheenStrength: number;
  renderScale: number;
}

export type MorphGlassConfigInput = Partial<{
  quality: unknown;
  blur: unknown;
  saturation: unknown;
  radius: unknown;
  tint: unknown;
  edge: unknown;
  refraction: unknown;
  rimStrength: unknown;
  sheenStrength: unknown;
  renderScale: unknown;
}>;

export const DEFAULT_MORPH_GLASS_CONFIG: MorphGlassConfig = Object.freeze({
  quality: "medium",
  blur: 14,
  saturation: 1.18,
  radius: 28,
  tint: [0.055, 0.075, 0.12, 0.48],
  edge: [0.78, 0.86, 1, 0.22],
  refraction: 0.012,
  rimStrength: 0.28,
  sheenStrength: 0.2,
  renderScale: 0.5,
});

const clamp = (value: number, min: number, max: number): number =>
  Math.min(max, Math.max(min, value));

function finite(value: unknown, fallback: number, min: number, max: number): number {
  return typeof value === "number" && Number.isFinite(value)
    ? clamp(value, min, max)
    : fallback;
}

function color4(value: unknown, fallback: readonly [number, number, number, number]):
  readonly [number, number, number, number] {
  if (!Array.isArray(value) || value.length !== 4) return fallback;
  return [
    finite(value[0], fallback[0], 0, 1),
    finite(value[1], fallback[1], 0, 1),
    finite(value[2], fallback[2], 0, 1),
    finite(value[3], fallback[3], 0, 1),
  ];
}

/**
 * Normalizes untrusted configuration into bounded renderer values.
 * Unknown keys are ignored; shader source is deliberately not accepted here.
 */
export function normalizeMorphGlassConfig(
  input: MorphGlassConfigInput = {},
): MorphGlassConfig {
  const base = DEFAULT_MORPH_GLASS_CONFIG;
  const quality: MorphGlassQuality =
    input.quality === "low" || input.quality === "high" || input.quality === "medium"
      ? input.quality
      : base.quality;

  const qualityScale = quality === "low" ? 0.55 : quality === "high" ? 1 : 0.78;

  return Object.freeze({
    quality,
    blur: finite(input.blur, base.blur * qualityScale, 0, 36),
    saturation: finite(input.saturation, base.saturation, 0.5, 2),
    radius: finite(input.radius, base.radius, 0, 160),
    tint: color4(input.tint, base.tint),
    edge: color4(input.edge, base.edge),
    refraction: finite(input.refraction, base.refraction, 0, 0.04),
    rimStrength: finite(input.rimStrength, base.rimStrength, 0, 1),
    sheenStrength: finite(input.sheenStrength, base.sheenStrength, 0, 1),
    renderScale: finite(
      input.renderScale,
      quality === "low" ? 0.35 : quality === "high" ? 0.7 : base.renderScale,
      0.25,
      1,
    ),
  });
}
