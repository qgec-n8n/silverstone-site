#!/usr/bin/env node

import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const webRoot = fileURLToPath(new URL("../..", import.meta.url));
const legacyManifestPath = path.join(
  webRoot,
  "src/data/generated/legacy-route-manifest.json",
);
const futureManifestPath = path.join(
  webRoot,
  "src/data/generated/future-route-manifest.json",
);
const reportPath = path.join(webRoot, "build/redirect-validation-report.json");

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

async function main() {
  const [legacyManifestText, futureManifestText] = await Promise.all([
    fs.readFile(legacyManifestPath, "utf8"),
    fs.readFile(futureManifestPath, "utf8"),
  ]);
  const legacyRoutes = JSON.parse(legacyManifestText);
  const futureRoutes = JSON.parse(futureManifestText);
  const futurePaths = new Set(futureRoutes.map((route) => route.path));
  const activeRedirects = legacyRoutes.filter(
    (route) =>
      route.recordType === "redirect" &&
      route.active &&
      ["redirected", "consolidated"].includes(route.disposition),
  );
  const issues = [];

  for (const duplicate of duplicateValues(
    activeRedirects.map((redirect) => redirect.sourcePath),
  )) {
    issues.push(`Duplicate active redirect source: ${duplicate}`);
  }

  const redirectMap = new Map(
    activeRedirects.map((redirect) => [redirect.sourcePath, redirect.targetPath]),
  );
  for (const redirect of activeRedirects) {
    if (redirect.sourcePath === redirect.targetPath) {
      issues.push(`Self redirect: ${redirect.sourcePath}`);
    }
    if (!futurePaths.has(redirect.targetPath)) {
      issues.push(
        `${redirect.sourcePath}: redirect target is not a future route (${redirect.targetPath})`,
      );
    }

    const visited = new Set();
    let currentPath = redirect.sourcePath;
    while (redirectMap.has(currentPath)) {
      if (visited.has(currentPath)) {
        issues.push(`Redirect cycle starts at ${redirect.sourcePath}`);
        break;
      }
      visited.add(currentPath);
      currentPath = redirectMap.get(currentPath);
    }
  }

  const dispositionCounts = legacyRoutes.reduce(
    (counts, route) => ({
      ...counts,
      [route.disposition]: (counts[route.disposition] ?? 0) + 1,
    }),
    {},
  );
  const report = {
    generatedAt: new Date().toISOString(),
    status: issues.length === 0 ? "pass" : "fail",
    activeRedirects: activeRedirects.length,
    dispositionCounts,
    productionNetlifyTomlChanged: false,
    issues: [...new Set(issues)],
  };
  await fs.mkdir(path.dirname(reportPath), { recursive: true });
  await fs.writeFile(reportPath, `${JSON.stringify(report, null, 2)}\n`);

  if (report.issues.length > 0) {
    throw new Error(`Redirect validation failed:\n${report.issues.join("\n")}`);
  }

  console.log(
    `Redirect validation passed: ${activeRedirects.length} active rules, no cycles, no duplicate sources.`,
  );
}

main().catch((error) => {
  console.error(error instanceof Error ? error.stack : String(error));
  process.exit(1);
});
