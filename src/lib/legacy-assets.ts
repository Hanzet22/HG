import indexHtml from "../../Index.html?raw";
import aboutHtml from "../../About.html?raw";
import projectsHtml from "../../Projects.html?raw";
import experienceHtml from "../../Experience.html?raw";
import missionsHtml from "../../Missions.html?raw";
import socialmediaHtml from "../../Socialmedia.html?raw";
import contactHtml from "../../Contact.html?raw";
import forbiddenHtml from "../../403.html?raw";
import notFoundHtml from "../../404.html?raw";
import teapotHtml from "../../418.html?raw";
import rateLimitHtml from "../../429.html?raw";
import styles from "../../Style.css?raw";
import scripts from "../../Script.js?raw";

const assets: Record<string, { body: string; type: string }> = {
  "index.html": {
    body: indexHtml,
    type: "text/html; charset=utf-8",
  },
  "about.html": {
    body: aboutHtml,
    type: "text/html; charset=utf-8",
  },
  "projects.html": {
    body: projectsHtml,
    type: "text/html; charset=utf-8",
  },
  "experience.html": {
    body: experienceHtml,
    type: "text/html; charset=utf-8",
  },
  "missions.html": {
    body: missionsHtml,
    type: "text/html; charset=utf-8",
  },
  "socialmedia.html": {
    body: socialmediaHtml,
    type: "text/html; charset=utf-8",
  },
  "contact.html": {
    body: contactHtml,
    type: "text/html; charset=utf-8",
  },
  "403.html": {
    body: forbiddenHtml,
    type: "text/html; charset=utf-8",
  },
  "404.html": {
    body: notFoundHtml,
    type: "text/html; charset=utf-8",
  },
  "418.html": {
    body: teapotHtml,
    type: "text/html; charset=utf-8",
  },
  "429.html": {
    body: rateLimitHtml,
    type: "text/html; charset=utf-8",
  },
  "style.css": {
    body: styles,
    type: "text/css; charset=utf-8",
  },
  "script.js": {
    body: scripts,
    type: "text/javascript; charset=utf-8",
  },
};

export function legacyResponse(pathname: string): Response {
  const filename =
    pathname.split("/").filter(Boolean).pop()?.toLowerCase() ||
    "index.html";

  const asset = assets[filename];

  if (!asset) {
    return new Response(assets["404.html"].body, {
      status: 404,
      headers: {
        "Content-Type": "text/html; charset=utf-8",
      },
    });
  }

  return new Response(asset.body, {
    headers: {
      "Content-Type": asset.type,
    },
  });
}