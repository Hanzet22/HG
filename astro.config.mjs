import { defineConfig } from "astro/config";
import netlify from "@astrojs/netlify";
import viteConfig from "./vite.config.ts";

export default defineConfig({
  output: "server",
  adapter: netlify(),
  vite: viteConfig,
});
