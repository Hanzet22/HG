import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const mediaPages = [
  "legacy/403.html",
  "legacy/404.html",
  "legacy/418.html",
  "legacy/429.html",
  "HyperGaruda-Next/app/429/page.tsx",
  "HyperGaruda-Next/app/Teapot/page.tsx",
];

const mediaUrls = new Set();
let videoCount = 0;
let captionTrackCount = 0;

for (const path of mediaPages) {
  const source = readFileSync(path, "utf8");
  const videos = [...source.matchAll(/<video\\b([^>]*)>([\\s\\S]*?)<\\/video>/gi)];
  assert.equal(videos.length, 1, path + " must contain exactly one inventoried video player");

  const [, attributes, innerContent] = videos[0];
  assert.match(attributes, /\\bcontrols\\b/i, path + " video must expose native controls");
  assert.match(attributes, /\\baria-label\\s*=/i, path + " video must have an accessible name");
  assert.doesNotMatch(attributes, /\\bautoplay\\b|\\bloop\\b/i, path + " video must not autoplay or loop by default");
  assert.match(attributes, /\\bpreload\\s*=\\s*["']metadata["']/i, path + " video should load metadata rather than eagerly preload the media");

  const captionTracks = [...innerContent.matchAll(/<track\\b[^>]*\\bkind\\s*=\\s*["'](?:captions|subtitles)["'][^>]*>/gi)];
  captionTrackCount += captionTracks.length;

  const htmlSources = [...innerContent.matchAll(/<source\\b[^>]*\\bsrc\\s*=\\s*["']([^"']+)["']/gi)].map(match => match[1]);
  const jsxSources = [...attributes.matchAll(/\\bsrc\\s*=\\{\\s*(\\w+)\\s*\\}/g)].map(match => match[1]);
  for (const url of htmlSources) mediaUrls.add(url);

  for (const variable of jsxSources) {
    const declaration = source.match(new RegExp("const\\\\s+" + variable + "\\\\s*=\\\\s*[\"']([^\"']+)[\"']"));
    assert.ok(declaration, path + " must declare its video URL as a static string");
    mediaUrls.add(declaration[1]);
  }

  videoCount += videos.length;
}

assert.equal(videoCount, 6, "Expected six video players in the media inventory");
assert.equal(mediaUrls.size, 5, "Expected five unique MP4 URLs; duplicated sources should remain visible in the inventory");

const inventory = readFileSync("MEDIA-ACCESSIBILITY-INVENTORY.md", "utf8");
assert.match(inventory, /six video elements/i, "Media inventory must document the six player count");
assert.match(inventory, /No authored `<track kind="captions">` element was found/i, "Inventory must disclose the missing authored caption tracks");
assert.match(inventory, /not a media-content audit/i, "Inventory must state its evidence boundary");

if (captionTrackCount === 0) {
  console.warn("MANUAL REVIEW REQUIRED: no authored caption/subtitle tracks found. Inspect each MP4's audio and provide accurate captions/transcripts where required; this audit cannot determine whether audio is meaningful.");
}

console.log("Media source audit passed: " + videoCount + " named, controllable players; " + mediaUrls.size + " unique MP4 sources; no autoplay/loop; " + captionTrackCount + " caption/subtitle tracks.");
