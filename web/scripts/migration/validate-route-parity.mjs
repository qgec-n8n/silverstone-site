#!/usr/bin/env node

import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const webRoot = fileURLToPath(new URL("../..", import.meta.url));
const repositoryRoot = path.resolve(webRoot, "..");
const routeInventoryPath = path.join(
  repositoryRoot,
  "docs/silverstone-transformation/audits/route-inventory-v1.csv",
);
const redirectBaselinePath = path.join(
  repositoryRoot,
  "docs/silverstone-transformation/audits/seo-redirect-baseline-v1.csv",
);
const futureManifestPath = path.join(
  webRoot,
  "src/data/generated/future-route-manifest.json",
);
const legacyManifestPath = path.join(
  webRoot,
  "src/data/generated/legacy-route-manifest.json",
);
const contentManifestPath = path.join(
  webRoot,
  "src/content/generated/source-content-manifest.json",
);
const reportPath = path.join(webRoot, "build/route-parity-report.json");

function parseCsv(text) {
  const rows = [];
  let row = [];
  let value = "";
  let quoted = false;

  for (let index = 0; index < text.length; index += 1) {
    const character = text[index];
    if (quoted) {
      if (character === '"' && text[index + 1] === '"') {
        value += '"';
        index += 1;
      } else if (character === '"') {
        quoted = false;
      } else {
        value += character;
      }
    } else if (character === '"') {
      quoted = true;
    } else if (character === ",") {
      row.push(value);
      value = "";
    } else if (character === "\n") {
      row.push(value.replace(/\r$/, ""));
      rows.push(row);
      row = [];
      value = "";
    } else {
      value += character;
    }
  }

  const headers = rows.shift();
  if (!headers) {
    throw new Error("CSV input is empty");
  }
  return rows
    .filter((values) => values.length > 1)
    .map((values) =>
      Object.fromEntries(headers.map((header, index) => [header, values[index] ?? ""])),
    );
}

function duplicateValues(values) {
  const seen = new Set();
  const duplicates = new Set();
  for (const value of values) {
    if (seen.has(value)) {
      duplicates.add(value);
    }
    seen.add(value);
  }
  return [...duplicates];
}

function compareField(issues, source, generated, field, sourceField = field) {
  if (source[sourceField] !== generated[field]) {
    issues.push(
      `${source.route}: ${field} differs (${JSON.stringify(source[sourceField])} !== ${JSON.stringify(generated[field])})`,
    );
  }
}

async function main() {
  const [
    routeInventoryText,
    redirectBaselineText,
    futureManifestText,
    legacyManifestText,
    contentManifestText,
  ] = await Promise.all([
    fs.readFile(routeInventoryPath, "utf8"),
    fs.readFile(redirectBaselinePath, "utf8"),
    fs.readFile(futureManifestPath, "utf8"),
    fs.readFile(legacyManifestPath, "utf8"),
    fs.readFile(contentManifestPath, "utf8"),
  ]);
  const routeRows = parseCsv(routeInventoryText);
  const redirectRows = parseCsv(redirectBaselineText);
  const futureRoutes = JSON.parse(futureManifestText);
  const legacyRoutes = JSON.parse(legacyManifestText);
  const contentRecords = JSON.parse(contentManifestText);
  const issues = [];

  if (routeRows.length !== 50 || futureRoutes.length !== 50) {
    issues.push(
      `Canonical count mismatch: A-01=${routeRows.length}, generated=${futureRoutes.length}`,
    );
  }
  if (redirectRows.length !== 133 || legacyRoutes.length !== 133) {
    issues.push(
      `Legacy URL count mismatch: baseline=${redirectRows.length}, generated=${legacyRoutes.length}`,
    );
  }
  if (contentRecords.length !== 50) {
    issues.push(`Content record count mismatch: generated=${contentRecords.length}`);
  }

  const futureByKey = new Map(
    futureRoutes.map((route) => [route.legacyRouteKey, route]),
  );
  for (const sourceRoute of routeRows) {
    const generatedRoute = futureByKey.get(sourceRoute.route_key);
    if (!generatedRoute) {
      issues.push(`Missing future route: ${sourceRoute.route_key}`);
      continue;
    }
    compareField(issues, sourceRoute, generatedRoute, "path", "route");
    compareField(issues, sourceRoute, generatedRoute, "title");
    compareField(
      issues,
      sourceRoute,
      generatedRoute,
      "description",
      "meta_description",
    );
    compareField(issues, sourceRoute, generatedRoute, "h1");
    const sourceCanonical =
      sourceRoute.canonical === "https://silverstone-ai.com"
        ? "https://silverstone-ai.com/"
        : sourceRoute.canonical;
    if (sourceCanonical !== generatedRoute.canonical) {
      issues.push(`${sourceRoute.route}: canonical differs`);
    }
  }

  const baselineKeys = new Set(redirectRows.map((row) => row.route_key));
  const generatedKeys = new Set(legacyRoutes.map((route) => route.id));
  for (const key of baselineKeys) {
    if (!generatedKeys.has(key)) {
      issues.push(`Missing legacy URL disposition: ${key}`);
    }
  }
  for (const key of generatedKeys) {
    if (!baselineKeys.has(key)) {
      issues.push(`Unexpected legacy URL disposition: ${key}`);
    }
  }

  for (const [field, values] of [
    ["future path", futureRoutes.map((route) => route.path)],
    ["canonical", futureRoutes.map((route) => route.canonical)],
    ["title", futureRoutes.map((route) => route.title)],
    ["legacy key", legacyRoutes.map((route) => route.id)],
  ]) {
    for (const duplicate of duplicateValues(values)) {
      issues.push(`Duplicate ${field}: ${duplicate}`);
    }
  }

  for (const route of futureRoutes.filter((record) => record.productionIndexable)) {
    for (const field of [
      "title",
      "description",
      "canonical",
      "h1",
      "headingPlan",
      "sitemap",
    ]) {
      if (!route[field]) {
        issues.push(`${route.path}: indexable route missing ${field}`);
      }
    }
  }

  const report = {
    generatedAt: new Date().toISOString(),
    status: issues.length === 0 ? "pass" : "fail",
    totals: {
      canonicalRoutes: futureRoutes.length,
      legacyUrls: legacyRoutes.length,
      contentRecords: contentRecords.length,
      productionIndexable: futureRoutes.filter((route) => route.productionIndexable)
        .length,
      sitemapRoutes: futureRoutes.filter((route) => route.sitemap).length,
      draftRoutes: futureRoutes.filter((route) => route.lifecycle === "draft").length,
    },
    issues,
  };
  await fs.mkdir(path.dirname(reportPath), { recursive: true });
  await fs.writeFile(reportPath, `${JSON.stringify(report, null, 2)}\n`);

  if (issues.length > 0) {
    throw new Error(`Route parity validation failed:\n${issues.join("\n")}`);
  }

  console.log(
    `Route parity passed: ${report.totals.canonicalRoutes} canonical routes, ${report.totals.legacyUrls} legacy URL dispositions, ${report.totals.sitemapRoutes} sitemap routes.`,
  );
}

main().catch((error) => {
  console.error(error instanceof Error ? error.stack : String(error));
  process.exit(1);
});
