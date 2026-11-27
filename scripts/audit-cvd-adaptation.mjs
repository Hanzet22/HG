import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

function relativeLuminance(hex) {
  const channels = [1, 3, 5].map(offset => parseInt(hex.slice(offset, offset + 2), 16) / 255);
  const linear = channels.map(value => value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4);
  return linear[0] * 0.2126 + linear[1] * 0.7152 + linear[2] * 0.0722;
}

function contrastRatio(first, second) {
  const values = [relativeLuminance(first), relativeLuminance(second)].sort((a, b) => b - a);
  return (values[0] + 0.05) / (values[1] + 0.05);
}

const script = readFileSync("Script.js", "utf8");
const css = readFileSync("Style.css", "utf8");
const router = readFileSync("src/lib/legacy-assets.ts", "utf8");
const guide = readFileSync("CVD-ADAPTATION.md", "utf8");
assert.ok(script.includes('const links = $$("a[href]", navLinks);'), "Navigation must iterate a NodeList, not a single element");

const profileIds = [...script.matchAll(/\{ id: "(p\d{2})"/g)].map(match => match[1]);
assert.deepEqual(profileIds, ["p00", "p01", "p02", "p03", "p04", "p05", "p06", "p07", "p08", "p09"], "Expected ten ordered display profiles");

const cvdStart = script.indexOf("function setupCvdAdaptation()");
assert.notEqual(cvdStart, -1, "CVD adaptation initializer must exist");
const cvdBlock = script.slice(cvdStart, script.indexOf("\n    }\n\n});", cvdStart) + 7);
assert.match(cvdBlock, /localStorage/, "Preferences must persist locally");
assert.doesNotMatch(cvdBlock, /\bfetch\s*\(|XMLHttpRequest|sendBeacon/, "CVD preference code must not transmit preference data");
assert.match(cvdBlock, /showModal/, "Dialog should use native modal behavior where supported");
assert.match(cvdBlock, /aria-live="polite"/, "Profile changes should be announced");
assert.match(cvdBlock, /\.response-speed, \.project-status, \.social-status/, "Status components must be identified for redundant text support");
assert.match(cvdBlock, /dot\.setAttribute\("aria-hidden", "true"\)/, "Decorative status shapes must be hidden from assistive technology");
assert.doesNotMatch(cvdBlock, /launcher\.setAttribute\("aria-label"/, "Launcher accessible name should come from its visible text label");

assert.match(css, /\.response-speed\.slow \.status-dot/, "Slow status must have a non-color shape");
assert.match(css, /\.response-speed\.fast \.status-dot/, "Fast status must have a non-color shape");
assert.match(css, /\.response-speed\.super-slow \.status-dot/, "Super-slow status must have a non-color shape");
assert.match(css, /\.response-speed\.super-fast \.status-dot/, "Super-fast status must have a non-color shape");
assert.match(css, /main p a:not\(\.button\):not\(\.btn-primary\)/, "Inline content links must have non-color distinction");
assert.match(css, /\.hg-cvd-dialog button:focus-visible/, "Dialog controls must have visible focus styles");
assert.match(css, /@media \(forced-colors: active\)/, "Display controls must support forced-colors mode");
assert.match(css, /\.hg-cvd-dialog \{[^}]*background: Canvas;[^}]*color: CanvasText/s, "Dialog must use system colors in forced-colors mode");

assert.ok(contrastRatio("#d0d0d8", "#12121a") >= 4.5, "Dialog body text must meet WCAG AA normal-text contrast");
assert.ok(contrastRatio("#c5c5ce", "#12121a") >= 4.5, "Dialog hint text must meet WCAG AA normal-text contrast");
assert.ok(contrastRatio("#c0a020", "#12121a") >= 3, "Dialog focus indicator token must meet WCAG non-text contrast");
assert.ok(contrastRatio("#ffffff", "#cc2200") >= 4.5, "Primary dialog button text must meet WCAG AA normal-text contrast");

assert.match(css, /\.hg-cvd-dialog,\s*\.hg-cvd-dialog \*\s*\{\s*box-sizing:\s*border-box;/, "Dialog sizing must include padding and borders to prevent narrow-screen overflow");
assert.match(css, /\.hg-cvd-dialog\s*\{[^}]*width:\s*auto;[^}]*max-width:\s*min\(540px,\s*calc\(100% - 28px\)\);[^}]*max-height:\s*min\(84%,\s*760px\)/s, "Dialog width and height must adapt when viewport dimensions change");
assert.match(css, /\.hg-cvd-dialog\s*\{[^}]*overscroll-behavior:\s*contain/s, "Dialog scrolling must remain contained");
assert.match(css, /\.hg-cvd-check\s*\{[^}]*min-height:\s*26px/s, "Checkbox label target must meet WCAG 2.5.8 minimum");
assert.match(css, /\.hg-cvd-check input\s*\{[^}]*width:\s*26px/s, "Checkbox input target must be at least 24 CSS pixels");
assert.doesNotMatch(css, /hue-rotate|filter\s*:\s*grayscale|filter\s*:\s*sepia/i, "No global hue/grayscale filter should be introduced");

const imports = [...router.matchAll(/import\s+\w+Html\s+from\s+"..\/..\/([^"]+\.html)\?raw";/gi)].map(match => match[1]);
assert.ok(imports.length >= 12, "Expected all legacy HTML routes to be registered");
for (const path of imports) {
  const html = readFileSync(path, "utf8");
  assert.match(html, /src=["']Script\.js["']/, path + " must load the shared script");
  assert.match(html, /href=["']Style\.css["']/, path + " must load the shared stylesheet");
}
assert.match(guide, /not a medical tool/i, "Documentation must state that profiles are non-diagnostic");
const workflow = readFileSync(".github/workflows/cvd-accessibility.yml", "utf8");
assert.match(workflow, /playwright install --with-deps chromium firefox webkit/, "CI must install all supported browser engines");
assert.match(workflow, /for engine in chromium firefox webkit/, "CI must execute the regression suite in all supported engines");
assert.doesNotMatch(workflow, /netlify deploy(?:\\s|$)/i, "Accessibility validation workflow must never deploy to Netlify");
assert.match(guide, /WCAG 2\.2 mapping/, "Documentation must map relevant WCAG criteria");

assert.ok(script.includes('const surfaces = $$(".hg-morph-glass");'), "MorphGlass surfaces must be collected as a NodeList");

console.log("CVD audit passed: " + profileIds.length + " profiles, " + imports.length + " legacy pages, local-only preference storage, redundant status cues, and no global color filter.");
