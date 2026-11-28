import { access, readFile } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const registryPath = path.join(root, "src/lib/legacy-assets.ts");
const routePath = path.join(root, "src/pages/[...legacy].ts");
const registry = await readFile(registryPath, "utf8");
const route = await readFile(routePath, "utf8");

const assetsSection = registry.split("const assets:")[1]?.split("export function legacyResponse")[0];
if (!assetsSection) {
  throw new Error("Could not locate the legacy asset registry.");
}

const imports = [...registry.matchAll(
  /^import\s+([A-Za-z_$][\w$]*)\s+from\s+["'](\.\.\/\.\.\/[^"']+)\?raw["'];?$/gm,
)];

if (imports.length === 0) {
  throw new Error("No raw legacy asset imports were found.");
}

let htmlCount = 0;
for (const [, identifier, relativePath] of imports) {
  const absolutePath = path.resolve(path.dirname(registryPath), relativePath);
  await access(absolutePath);

  if (!new RegExp("\\b" + identifier + "\\b").test(assetsSection)) {
    throw new Error("Imported asset " + identifier + " is not referenced by the asset registry.");
  }

  if (relativePath.toLowerCase().endsWith(".html")) {
    htmlCount += 1;
    const key = path.basename(relativePath).toLowerCase();
    if (!new RegExp('["\\x27]' + key + '["\\x27]\\s*:').test(assetsSection)) {
      throw new Error('HTML asset "' + key + '" is imported but has no matching registry key.');
    }
  }
}

if (!route.includes("export const prerender = false") || !route.includes("legacyResponse(url.pathname)")) {
  throw new Error("The Astro SSR catch-all route is missing or no longer delegates to legacyResponse().");
}

console.log("Legacy asset checks passed: " + imports.length + " raw imports, " + htmlCount + " HTML routes, and the Astro SSR catch-all.");
