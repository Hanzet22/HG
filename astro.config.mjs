import { defineConfig } from "astro/config";
import netlify from "@astrojs/netlify";
import viteConfig from "./vite.config.ts";

export default defineConfig(({ command }) => ({
  output: "server",
  ...(command === "build" ? { adapter: netlify() } : {}),
  vite: viteConfig,
}));