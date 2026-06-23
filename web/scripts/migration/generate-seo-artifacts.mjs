#!/usr/bin/env node

import fs from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";

const webRoot = fileURLToPath(new URL("../..", import.meta.url));
const futureManifestPath = path.join(
  webRoot,
  "src/data/generated/future-route-manifest.json",
);

function readArgument(name, fallback) {
  const prefix = `--${name}=`;
  const value = process.argv.slice(2).find((argument) => argument.startsWith(prefix));
  return value ? value.slice(prefix.length) : fallback;
}

function escapeXml(value) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

async function main() {
  const environment = readArgument("environment", "staging");
  const outputDirectory = path.resolve(webRoot, readArgument("out", "build/client"));
  if (!["production", "staging"].includes(environment)) {
    throw new Error(`Unsupported SEO environment: ${environment}`);
  }
  if (
    environment === "production" &&
    outputDirectory === path.join(webRoot, "build/client")
  ) {
    throw new Error(
      "Production SEO artifacts cannot overwrite the staging build/client output",
    );
  }

  const futureRoutes = JSON.parse(await fs.readFile(futureManifestPath, "utf8"));
  const robotsPath = path.join(outputDirectory, "robots.txt");
  const sitemapPath = path.join(outputDirectory, "sitemap.xml");
  await fs.mkdir(outputDirectory, { recursive: true });

  if (environment === "staging") {
    await fs.writeFile(robotsPath, "User-agent: *\nDisallow: /\n");
    await fs.rm(sitemapPath, { force: true });
    console.log("Staging SEO artifacts generated: crawl blocked, sitemap omitted.");
    return;
  }

  const sitemapEntries = futureRoutes
    .filter((route) => route.productionIndexable && route.sitemap)
    .map((route) => `  <url><loc>${escapeXml(route.canonical)}</loc></url>`)
    .join("\n");
  await Promise.all([
    fs.writeFile(
      robotsPath,
      [
        "User-agent: *",
        "Allow: /",
        "Sitemap: https://silverstone-ai.com/sitemap.xml",
        "",
      ].join("\n"),
    ),
    fs.writeFile(
      sitemapPath,
      [
        '<?xml version="1.0" encoding="UTF-8"?>',
        '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
        sitemapEntries,
        "</urlset>",
        "",
      ].join("\n"),
    ),
  ]);
  console.log("Production SEO artifacts generated in the explicit output directory.");
}

main().catch((error) => {
  console.error(error instanceof Error ? error.stack : String(error));
  process.exit(1);
});
