import type { APIRoute } from "astro";
import { legacyResponse } from "../lib/legacy-assets";

export const prerender = false;

export const GET: APIRoute = () => legacyResponse("/");