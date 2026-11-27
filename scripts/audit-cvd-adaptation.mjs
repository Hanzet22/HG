import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const script = readFileSync("Script.js", "utf8");
const css = readFileSync("Style.css", "utf8");
const router = readFileSync("src/lib/legacy-assets.ts", "utf8");
const guide = readFileSync("CVD-ADAPTATION.md", "utf8");

const profileIds = [...script.matchAll(/\{ id: "(p\d{2})"/g)].map(match => match[1]);
assert.deepEqual(profileIds, ["p00", "p01", "p02", "p03", "p04", "p05", "p06", "p07", "p08", "p09"], "Expected ten ordered display profiles");

const cvdStart = script.indexOf("function setupCvdAdaptation()");
assert.notEqual(cvdStart, -1, "CVD adaptation initializer must exist");
const cvdBlock = script.slice(cvdStart, script.indexOf("\n    }\n\n});", cvdStart) + 7);
assert.match(cvdBlock, /localStorage/, "Preferences must persist locally");
assert.doesNotMatch(cvdBlock, /\bfetch\s*\(|XMLHttpRequest|sendBeacon/, "CVD preference code must not transmit preference data");
assert.match(cvdBlock, /showModal/, "Dialog should use native modal behavior where supported");
assert.match(cvdBlock, /aria-live="polite"/, "Profile changes should be announced");

assert.match(css, /\.response-speed\.slow \.status-dot/, "Slow status must have a non-color shape");
assert.match(css, /\.response-speed\.fast \.status-dot/, "Fast status must have a non-color shape");
assert.match(css, /\.response-speed\.super-slow \.status-dot/, "Super-slow status must have a non-color shape");
assert.match(css, /\.response-speed\.super-fast \.status-dot/, "Super-fast status must have a non-color shape");
assert.match(css, /main p a:not\(\.button\):not\(\.btn-primary\)/, "Inline content links must have non-color distinction");
assert.match(css, /\.hg-cvd-dialog button:focus-visible/, "Dialog controls must have visible focus styles");
assert.doesNotMatch(css, /hue-rotate|filter\s*:\s*grayscale|filter\s*:\s*sepia/i, "No global hue/grayscale filter should be introduced");

const imports = [...router.matchAll(/import\s+\w+Html\s+from\s+"..\/..\/([^"]+\.html)\?raw";/gi)].map(match => match[1]);
assert.ok(imports.length >= 12, "Expected all legacy HTML routes to be registered");
for (const path of imports) {
  const html = readFileSync(path, "utf8");
  assert.match(html, /src=["']Script\.js["']/, path + " must load the shared script");
  assert.match(html, /href=["']Style\.css["']/, path + " must load the shared stylesheet");
}
assert.match(guide, /not a medical tool/i, "Documentation must state that profiles are non-diagnostic");
assert.match(guide, /WCAG 2\.2 mapping/, "Documentation must map relevant WCAG criteria");

console.log("CVD audit passed: " + profileIds.length + " profiles, " + imports.length + " legacy pages, local-only preference storage, redundant status cues, and no global color filter.");
