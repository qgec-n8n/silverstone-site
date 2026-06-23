#!/usr/bin/env node

import fs from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";

const webRoot = fileURLToPath(new URL("../..", import.meta.url));
const manifestPath = path.join(
  webRoot,
  "src/data/generated/future-route-manifest.json",
);
const reportPath = path.join(webRoot, "build/route-crawl-report.json");
const baseUrl = (process.argv[2] ?? "http://127.0.0.1:4173").replace(/\/+$/, "");
const analyticsPatterns = [
  /googletagmanager\.com/i,
  /google-analytics\.com/i,
  /\bgtag\s*\(/i,
  /\bG-[A-Z0-9]+\b/i,
];

function decodeHtml(value) {
  return value
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#x27;|&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");
}

function tagAttribute(html, selectorPattern, attribute) {
  const tag = html.match(selectorPattern)?.[0];
  const value = tag?.match(new RegExp(`\\b${attribute}=["']([^"']*)["']`, "i"))?.[1];
  return value ? decodeHtml(value) : undefined;
}

function tagText(html, tagName) {
  const match = html.match(
    new RegExp(`<${tagName}\\b[^>]*>([\\s\\S]*?)</${tagName}>`, "i"),
  );
  return match ? decodeHtml(match[1].replace(/<[^>]+>/g, "").trim()) : undefined;
}

function internalLinks(html) {
  return [...html.matchAll(/<a\b[^>]*\bhref=["']([^"']+)["']/gi)]
    .map((match) => match[1])
    .filter(
      (href) =>
        href.startsWith("/") && !href.startsWith("//") && !href.startsWith("/assets/"),
    )
    .map((href) => href.split(/[?#]/)[0] || "/");
}

async function main() {
  const routes = JSON.parse(await fs.readFile(manifestPath, "utf8"));
  const routePaths = new Set(routes.map((route) => route.path));
  const results = [];
  const issues = [];

  for (const route of routes) {
    const response = await fetch(`${baseUrl}${route.path}`);
    const html = await response.text();
    const title = tagText(html, "title");
    const h1 = tagText(html, "h1");
    const description = tagAttribute(
      html,
      /<meta\b[^>]*\bname=["']description["'][^>]*>/i,
      "content",
    );
    const canonical = tagAttribute(
      html,
      /<link\b[^>]*\brel=["']canonical["'][^>]*>/i,
      "href",
    );
    const robots = tagAttribute(
      html,
      /<meta\b[^>]*\bname=["']robots["'][^>]*>/i,
      "content",
    );
    const xRobotsTag = response.headers.get("x-robots-tag");
    const unresolvedLinks = internalLinks(html).filter((href) => !routePaths.has(href));
    const routeIssues = [];

    if (response.status !== 200) {
      routeIssues.push(`status ${response.status}`);
    }
    if (title !== route.title) {
      routeIssues.push("title mismatch");
    }
    if (h1 !== route.h1) {
      routeIssues.push("H1 mismatch");
    }
    if (description !== route.description) {
      routeIssues.push("description mismatch");
    }
    if (canonical !== route.canonical) {
      routeIssues.push("canonical mismatch");
    }
    if (robots !== "noindex,nofollow,noarchive") {
      routeIssues.push("staging robots meta missing");
    }
    if (xRobotsTag !== "noindex,nofollow,noarchive") {
      routeIssues.push("X-Robots-Tag missing");
    }
    if (!html.includes('type="application/ld+json"')) {
      routeIssues.push("JSON-LD missing");
    }
    if (analyticsPatterns.some((pattern) => pattern.test(html))) {
      routeIssues.push("production analytics detected");
    }
    if (unresolvedLinks.length > 0) {
      routeIssues.push(`unresolved links: ${[...new Set(unresolvedLinks)].join(", ")}`);
    }

    if (routeIssues.length > 0) {
      issues.push(`${route.path}: ${routeIssues.join("; ")}`);
    }
    results.push({
      path: route.path,
      status: response.status,
      title,
      h1,
      canonical,
      robots,
      xRobotsTag,
      internalLinkCount: internalLinks(html).length,
      issues: routeIssues,
    });
  }

  const unknownResponse = await fetch(`${baseUrl}/route-that-does-not-exist`);
  if (unknownResponse.status !== 404) {
    issues.push(`Unknown route returned ${unknownResponse.status}, expected 404`);
  }

  const report = {
    generatedAt: new Date().toISOString(),
    baseUrl,
    status: issues.length === 0 ? "pass" : "fail",
    routesCrawled: results.length,
    unknownRouteStatus: unknownResponse.status,
    results,
    issues,
  };
  await fs.writeFile(reportPath, `${JSON.stringify(report, null, 2)}\n`);

  if (issues.length > 0) {
    throw new Error(`Route crawl failed:\n${issues.join("\n")}`);
  }

  console.log(`Route crawl passed: ${results.length} routes and genuine 404.`);
}

main().catch((error) => {
  console.error(error instanceof Error ? error.stack : String(error));
  process.exit(1);
});
