/**
 * HG MorphGlass WebGL2 renderer.
 *
 * Adapted architecture: Mochy Music's backdrop -> blur -> shader -> clipped-surface
 * pipeline, pinned at e6a17d2eb9f48b503fe07e35049cb522b8486db2.
 *
 * Browser boundary: callers must supply a readable CanvasImageSource. This renderer
 * never attempts to capture arbitrary composited DOM pixels.
 *
 * SPDX-License-Identifier: GPL-3.0-only
 */

import {
  normalizeMorphGlassConfig,
  type MorphGlassConfig,
  type MorphGlassConfigInput,
} from "../core/config";

export interface NormalizedSourceRect {
  /** Normalized coordinates in the source texture, origin at bottom-left. */
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface MorphGlassRendererOptions {
  config?: MorphGlassConfigInput;
  sourceRect?: NormalizedSourceRect;
  onContextLost?: () => void;
  maxRenderEdge?: number;
}

export interface MorphGlassRenderer {
  render(source: CanvasImageSource, sourceRect?: NormalizedSourceRect): void;
  setConfig(config: MorphGlassConfigInput): void;
  setPointer(x: number, y: number): void;
  destroy(): void;
}

const VERTEX_SHADER = `#version 300 es
precision highp float;
out vec2 v_uv;

void main() {
  vec2 p;
  if (gl_VertexID == 0) p = vec2(-1.0, -1.0);
  else if (gl_VertexID == 1) p = vec2(3.0, -1.0);
  else p = vec2(-1.0, 3.0);
  v_uv = p * 0.5 + 0.5;
  gl_Position = vec4(p, 0.0, 1.0);
}`;

const BLUR_SHADER = `#version 300 es
precision highp float;
in vec2 v_uv;
out vec4 outColor;
uniform sampler2D u_image;
uniform vec2 u_texel;
uniform float u_offset;

void main() {
  vec2 d = u_texel * u_offset;
  vec4 c = texture(u_image, v_uv) * 0.20;
  c += texture(u_image, v_uv + vec2( d.x,  d.y)) * 0.20;
  c += texture(u_image, v_uv + vec2(-d.x,  d.y)) * 0.20;
  c += texture(u_image, v_uv + vec2( d.x, -d.y)) * 0.20;
  c += texture(u_image, v_uv + vec2(-d.x, -d.y)) * 0.20;
  outColor = c;
}`;

const COMPOSITE_SHADER = `#version 300 es
precision highp float;
in vec2 v_uv;
out vec4 outColor;

uniform sampler2D u_source;
uniform sampler2D u_blurred;
uniform vec4 u_sourceRect;
uniform vec2 u_outputSize;
uniform vec2 u_sourceSize;
uniform vec2 u_pointer;
uniform float u_radius;
uniform float u_blur;
uniform float u_saturation;
uniform float u_refraction;
uniform float u_rimStrength;
uniform float u_sheenStrength;
uniform vec4 u_tint;
uniform vec4 u_edge;

float roundedBoxDistance(vec2 p, vec2 halfSize, float radius) {
  vec2 q = abs(p) - halfSize + vec2(radius);
  return length(max(q, 0.0)) + min(max(q.x, q.y), 0.0) - radius;
}

void main() {
  vec2 localPx = v_uv * u_outputSize;
  vec2 halfSize = u_outputSize * 0.5;
  float radius = clamp(u_radius, 0.0, min(halfSize.x, halfSize.y));
  float distanceToEdge = roundedBoxDistance(localPx - halfSize, halfSize, radius);
  float coverage = 1.0 - smoothstep(-1.0, 1.0, distanceToEdge);
  if (coverage <= 0.001) discard;

  vec2 sourceUv = u_sourceRect.xy + v_uv * u_sourceRect.zw;
  vec2 gradient = vec2(dFdx(distanceToEdge), dFdy(distanceToEdge));
  vec2 normal = length(gradient) > 0.0001 ? normalize(gradient) : vec2(0.0, 1.0);
  vec2 refractedUv = clamp(sourceUv + normal * u_refraction, vec2(0.001), vec2(0.999));

  vec4 sharp = texture(u_source, refractedUv);
  vec4 blurred = texture(u_blurred, refractedUv);
  float blurMix = clamp(u_blur / 36.0, 0.0, 1.0);
  vec3 base = mix(sharp.rgb, blurred.rgb, blurMix);

  float luminance = dot(base, vec3(0.2126, 0.7152, 0.0722));
  base = mix(vec3(luminance), base, u_saturation);
  base = mix(base, u_tint.rgb, u_tint.a);

  float edgeBand = 1.0 - smoothstep(0.0, 3.0, abs(distanceToEdge));
  float rim = pow(clamp(1.0 - abs(normal.y), 0.0, 1.0), 1.7) * edgeBand;
  vec2 pointerDelta = (v_uv - u_pointer) * vec2(u_outputSize.x / max(u_outputSize.y, 1.0), 1.0);
  float sheen = exp(-dot(pointerDelta, pointerDelta) * 8.0) * u_sheenStrength;

  base += u_edge.rgb * (edgeBand * u_rimStrength + rim * u_rimStrength * 0.45);
  base += vec3(sheen) * 0.18;
  float alpha = max(u_tint.a, sharp.a) * coverage;
  outColor = vec4(clamp(base, 0.0, 1.0), alpha);
}`;

function sourceDimensions(source: CanvasImageSource): { width: number; height: number } {
  if (source instanceof HTMLVideoElement) {
    return { width: source.videoWidth, height: source.videoHeight };
  }
  if (source instanceof HTMLImageElement) {
    return { width: source.naturalWidth, height: source.naturalHeight };
  }
  if (source instanceof ImageBitmap) {
    return { width: source.width, height: source.height };
  }
  if (source instanceof HTMLCanvasElement || (typeof OffscreenCanvas !== "undefined" && source instanceof OffscreenCanvas)) {
    return { width: source.width, height: source.height };
  }
  const candidate = source as { width?: number; height?: number };
  return { width: candidate.width ?? 0, height: candidate.height ?? 0 };
}

function compileShader(gl: WebGL2RenderingContext, type: number, source: string): WebGLShader {
  const shader = gl.createShader(type);
  if (!shader) throw new Error("MorphGlass: unable to allocate shader.");
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    const message = gl.getShaderInfoLog(shader) ?? "unknown shader compilation error";
    gl.deleteShader(shader);
    throw new Error(`MorphGlass shader compilation failed: ${message}`);
  }
  return shader;
}

function createProgram(
  gl: WebGL2RenderingContext,
  fragmentSource: string,
): WebGLProgram {
  const vertex = compileShader(gl, gl.VERTEX_SHADER, VERTEX_SHADER);
  const fragment = compileShader(gl, gl.FRAGMENT_SHADER, fragmentSource);
  const program = gl.createProgram();
  if (!program) throw new Error("MorphGlass: unable to allocate program.");
  gl.attachShader(program, vertex);
  gl.attachShader(program, fragment);
  gl.linkProgram(program);
  gl.deleteShader(vertex);
  gl.deleteShader(fragment);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    const message = gl.getProgramInfoLog(program) ?? "unknown program link error";
    gl.deleteProgram(program);
    throw new Error(`MorphGlass program link failed: ${message}`);
  }
  return program;
}

function makeTarget(gl: WebGL2RenderingContext): {
  texture: WebGLTexture;
  framebuffer: WebGLFramebuffer;
} {
  const texture = gl.createTexture();
  const framebuffer = gl.createFramebuffer();
  if (!texture || !framebuffer) throw new Error("MorphGlass: unable to allocate render target.");
  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);
  gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);
  gl.bindFramebuffer(gl.FRAMEBUFFER, null);
  return { texture, framebuffer };
}

function normalizeRect(rect: NormalizedSourceRect): NormalizedSourceRect {
  const x = Math.min(1, Math.max(0, rect.x));
  const y = Math.min(1, Math.max(0, rect.y));
  const width = Math.min(1 - x, Math.max(0.001, rect.width));
  const height = Math.min(1 - y, Math.max(0.001, rect.height));
  return { x, y, width, height };
}

export function createMorphGlassRenderer(
  canvas: HTMLCanvasElement,
  options: MorphGlassRendererOptions = {},
): MorphGlassRenderer {
  const gl = canvas.getContext("webgl2", {
    alpha: true,
    antialias: false,
    depth: false,
    stencil: false,
    premultipliedAlpha: true,
    powerPreference: "low-power",
  });
  if (!gl) throw new Error("MorphGlass requires WebGL2; keep the CSS fallback available.");

  const maxTextureSize = gl.getParameter(gl.MAX_TEXTURE_SIZE) as number;
  const maxRenderEdge = Math.min(options.maxRenderEdge ?? 2048, maxTextureSize);
  const blurProgram = createProgram(gl, BLUR_SHADER);
  const compositeProgram = createProgram(gl, COMPOSITE_SHADER);
  const vao = gl.createVertexArray();
  const sourceTexture = gl.createTexture();
  const targetA = makeTarget(gl);
  const targetB = makeTarget(gl);
  const staging = document.createElement("canvas");
  const stagingContext = staging.getContext("2d", { alpha: true, willReadFrequently: false });

  if (!vao || !sourceTexture || !stagingContext) {
    throw new Error("MorphGlass could not initialize its GPU resources.");
  }

  let config: MorphGlassConfig = normalizeMorphGlassConfig(options.config);
  let rect = normalizeRect(options.sourceRect ?? { x: 0, y: 0, width: 1, height: 1 });
  let targetWidth = 0;
  let targetHeight = 0;
  let destroyed = false;
  let lost = false;
  let pointer: [number, number] = [0.5, 0.25];

  gl.bindVertexArray(vao);
  gl.activeTexture(gl.TEXTURE0);
  gl.bindTexture(gl.TEXTURE_2D, sourceTexture);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

  const onLost = (event: Event): void => {
    event.preventDefault();
    lost = true;
    options.onContextLost?.();
  };
  const onRestored = (): void => {
    // WebGL object handles are invalid after restoration. The owner must remount the renderer.
    lost = true;
    options.onContextLost?.();
  };
  canvas.addEventListener("webglcontextlost", onLost, false);
  canvas.addEventListener("webglcontextrestored", onRestored, false);

  function resizeTargets(width: number, height: number): void {
    const scale = Math.min(config.renderScale, maxRenderEdge / Math.max(width, height));
    targetWidth = Math.max(1, Math.floor(width * scale));
    targetHeight = Math.max(1, Math.floor(height * scale));

    for (const target of [targetA, targetB]) {
      gl.bindTexture(gl.TEXTURE_2D, target.texture);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA8, targetWidth, targetHeight, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
      gl.bindFramebuffer(gl.FRAMEBUFFER, target.framebuffer);
      gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, target.texture, 0);
      if (gl.checkFramebufferStatus(gl.FRAMEBUFFER) !== gl.FRAMEBUFFER_COMPLETE) {
        throw new Error("MorphGlass framebuffer is incomplete.");
      }
    }
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
  }

  function render(source: CanvasImageSource, nextRect?: NormalizedSourceRect): void {
    if (destroyed) throw new Error("MorphGlass renderer has been destroyed.");
    if (lost || gl.isContextLost()) throw new Error("MorphGlass WebGL context is unavailable; remount after context restoration.");
    if (nextRect) rect = normalizeRect(nextRect);

    const dimensions = sourceDimensions(source);
    if (dimensions.width <= 0 || dimensions.height <= 0) return;

    const sourceScale = Math.min(1, maxRenderEdge / Math.max(dimensions.width, dimensions.height));
    const sourceWidth = Math.max(1, Math.floor(dimensions.width * sourceScale));
    const sourceHeight = Math.max(1, Math.floor(dimensions.height * sourceScale));
    if (staging.width !== sourceWidth || staging.height !== sourceHeight) {
      staging.width = sourceWidth;
      staging.height = sourceHeight;
    }

    stagingContext.clearRect(0, 0, sourceWidth, sourceHeight);
    stagingContext.drawImage(source, 0, 0, sourceWidth, sourceHeight);

    if (targetWidth === 0 || targetHeight === 0 ||
        targetWidth !== Math.max(1, Math.floor(sourceWidth * Math.min(config.renderScale, maxRenderEdge / Math.max(sourceWidth, sourceHeight)))) ||
        targetHeight !== Math.max(1, Math.floor(sourceHeight * Math.min(config.renderScale, maxRenderEdge / Math.max(sourceWidth, sourceHeight)))) {
      resizeTargets(sourceWidth, sourceHeight);
    }

    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, sourceTexture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, staging);

    gl.bindVertexArray(vao);
    gl.useProgram(blurProgram);
    gl.uniform1i(gl.getUniformLocation(blurProgram, "u_image"), 0);
    gl.uniform2f(gl.getUniformLocation(blurProgram, "u_texel"), 1 / sourceWidth, 1 / sourceHeight);

    let inputTexture = sourceTexture;
    const passes = config.quality === "low" ? 1 : config.quality === "high" ? 4 : 3;
    for (let i = 0; i < passes; i += 1) {
      const target = i % 2 === 0 ? targetA : targetB;
      gl.bindFramebuffer(gl.FRAMEBUFFER, target.framebuffer);
      gl.viewport(0, 0, targetWidth, targetHeight);
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, inputTexture);
      gl.uniform2f(
        gl.getUniformLocation(blurProgram, "u_texel"),
        1 / (i === 0 ? sourceWidth : targetWidth),
        1 / (i === 0 ? sourceHeight : targetHeight),
      );
      gl.uniform1f(gl.getUniformLocation(blurProgram, "u_offset"), 0.8 + i * 0.55);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
      inputTexture = target.texture;
    }

    const blurredTexture = passes % 2 === 1 ? targetA.texture : targetB.texture;
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.useProgram(compositeProgram);

    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, sourceTexture);
    gl.uniform1i(gl.getUniformLocation(compositeProgram, "u_source"), 0);
    gl.activeTexture(gl.TEXTURE1);
    gl.bindTexture(gl.TEXTURE_2D, blurredTexture);
    gl.uniform1i(gl.getUniformLocation(compositeProgram, "u_blurred"), 1);

    const set2 = (name: string, x: number, y: number): void => {
      gl.uniform2f(gl.getUniformLocation(compositeProgram, name), x, y);
    };
    const set1 = (name: string, value: number): void => {
      gl.uniform1f(gl.getUniformLocation(compositeProgram, name), value);
    };
    const set4 = (name: string, value: readonly number[]): void => {
      gl.uniform4fv(gl.getUniformLocation(compositeProgram, name), value);
    };

    set4("u_sourceRect", [rect.x, rect.y, rect.width, rect.height]);
    set2("u_outputSize", canvas.width, canvas.height);
    set2("u_sourceSize", sourceWidth, sourceHeight);
    set2("u_pointer", pointer[0], pointer[1]);
    set1("u_radius", config.radius);
    set1("u_blur", config.blur);
    set1("u_saturation", config.saturation);
    set1("u_refraction", config.refraction);
    set1("u_rimStrength", config.rimStrength);
    set1("u_sheenStrength", config.sheenStrength);
    set4("u_tint", config.tint);
    set4("u_edge", config.edge);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  }

  function setConfig(input: MorphGlassConfigInput): void {
    config = normalizeMorphGlassConfig(input);
    targetWidth = 0;
    targetHeight = 0;
  }

  function setPointer(x: number, y: number): void {
    pointer = [
      Number.isFinite(x) ? Math.min(1, Math.max(0, x)) : 0.5,
      Number.isFinite(y) ? Math.min(1, Math.max(0, y)) : 0.25,
    ];
  }

  function destroy(): void {
    if (destroyed) return;
    destroyed = true;
    canvas.removeEventListener("webglcontextlost", onLost);
    canvas.removeEventListener("webglcontextrestored", onRestored);
    if (!gl.isContextLost()) {
      gl.deleteProgram(blurProgram);
      gl.deleteProgram(compositeProgram);
      gl.deleteVertexArray(vao);
      gl.deleteTexture(sourceTexture);
      gl.deleteTexture(targetA.texture);
      gl.deleteTexture(targetB.texture);
      gl.deleteFramebuffer(targetA.framebuffer);
      gl.deleteFramebuffer(targetB.framebuffer);
    }
    staging.width = 1;
    staging.height = 1;
  }

  // Pointer is intentionally explicit; the engine does not attach global listeners.
  return {
    render(source, sourceRect) {
      render(source, sourceRect);
    },
    setConfig,
    setPointer,
    destroy,
  };
}
