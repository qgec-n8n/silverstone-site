#!/usr/bin/env node
/**
 * Post-build SEO artifacts for the production deploy: sitemap.xml and
 * robots.txt written into build/client.
 *
 * The sitemap is derived from the prerendered HTML itself rather than a
 * separate route list: every *.html document is scanned for its canonical
 * link and robots meta, and a URL joins the sitemap only when it is
 * indexable and canonicalises to itself (aliases such as
 * /services/website-design-development therefore collapse into their
 * canonical page automatically). Because it reads the built output, the
 * sitemap can never drift from what actually deploys.
 *
 * Safety: when the build is a staging build (blanket noindex on the
 * homepage), a Disallow-all robots.txt is written and no sitemap is
 * produced — a staging bundle can never ship an "Allow" robots file.
 */
import fs from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";

const clientDir = fileURLToPath(new URL("../build/client", import.meta.url));
const PRODUCTION_ORIGIN = "https://silverstone-ai.com";

async function collectHtmlFiles(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === "assets" || entry.name === "vendor") continue;
      files.push(...(await collectHtmlFiles(full)));
    } else if (entry.name.endsWith(".html") && entry.name !== "__spa-fallback.html") {
      files.push(full);
    }
  }
  return files;
}

function extract(html, pattern) {
  const match = pattern.exec(html);
  return match ? match[1] : null;
}

async function main() {
  const htmlFiles = await collectHtmlFiles(clientDir);
  if (htmlFiles.length === 0) {
    throw new Error(`No prerendered HTML found under ${clientDir} — run the build first`);
  }

  const canonicals = new Set();
  let stagingBuild = false;

  for (const file of htmlFiles) {
    const html = await fs.readFile(file, "utf8");
    const robots =
      extract(html, /<meta[^>]+name="robots"[^>]+content="([^"]*)"/i) ??
      extract(html, /<meta[^>]+content="([^"]*)"[^>]+name="robots"/i);
    const canonical =
      extract(html, /<link[^>]+rel="canonical"[^>]+href="([^"]*)"/i) ??
      extract(html, /<link[^>]+href="([^"]*)"[^>]+rel="canonical"/i);

    if (robots && robots.includes("noindex")) {
      if (path.relative(clientDir, file) === "index.html") {
        stagingBuild = true;
      }
      continue;
    }
    if (!canonical || !canonical.startsWith(PRODUCTION_ORIGIN)) {
      continue;
    }

    // Only self-canonical documents enter the sitemap: the page's own URL
    // (derived from its file path) must match its canonical link.
    const routePath = `/${path
      .relative(clientDir, file)
      .replace(/index\.html$/, "")
      .replace(/\.html$/, "")
      .replace(/\/$/, "")}`;
    const canonicalPath = new URL(canonical).pathname.replace(/\/$/, "") || "/";
    const normalizedRoutePath = routePath === "/" ? "/" : routePath.replace(/\/$/, "");
    if (canonicalPath !== normalizedRoutePath) {
      continue;
    }

    canonicals.add(canonical);
  }

  if (stagingBuild) {
    await fs.writeFile(
      path.join(clientDir, "robots.txt"),
      "User-agent: *\nDisallow: /\n",
    );
    console.log(
      "Staging build detected (noindex homepage) — wrote Disallow robots.txt, no sitemap.",
    );
    return;
  }

  const urls = [...canonicals].sort();
  const lastmod = new Date().toISOString().slice(0, 10);
  const sitemap = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...urls.map((url) =>
      [
        "  <url>",
        `    <loc>${url}</loc>`,
        `    <lastmod>${lastmod}</lastmod>`,
        "  </url>",
      ].join("\n"),
    ),
    "</urlset>",
    "",
  ].join("\n");

  await fs.writeFile(path.join(clientDir, "sitemap.xml"), sitemap);
  await fs.writeFile(
    path.join(clientDir, "robots.txt"),
    `User-agent: *\nAllow: /\nSitemap: ${PRODUCTION_ORIGIN}/sitemap.xml\n`,
  );

  console.log(`Wrote sitemap.xml (${urls.length} URLs) and production robots.txt.`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
