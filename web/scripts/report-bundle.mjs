#!/usr/bin/env node

import { gzipSync } from "node:zlib";
import fs from "node:fs/promises";
import path from "node:path";
import process from "node:process";

const targetKilobytes = 220;
const hardCeilingKilobytes = 300;
const clientDirectory = path.resolve("build/client");
const foundationEntryHtml = path.join(clientDirectory, "index.html");
const reportPath = path.resolve("build/bundle-report.json");

/**
 * The foundation bundle is the JavaScript every visitor downloads on first
 * load, regardless of which route they land on — i.e. exactly what the home
 * page's initial HTML references (script tags + modulepreload hints). Route-
 * specific code (each service page's composition, signature and demo
 * components) is dynamically imported and code-splits into its own chunk;
 * it must not be counted here, or this budget could never grow with the
 * *site*, only shrink every time a route gains genuinely page-specific code.
 */
async function listFoundationJavaScriptFiles() {
  const html = await fs.readFile(foundationEntryHtml, "utf8");
  const matches = html.matchAll(/(?:src|href)="(\/assets\/[^"]+\.js)"/g);
  const relativePaths = new Set([...matches].map((match) => match[1].slice(1)));
  return [...relativePaths]
    .map((relativePath) => path.join(clientDirectory, relativePath))
    .sort();
}

async function measureFile(filePath) {
  const contents = await fs.readFile(filePath);
  return {
    file: path.relative(clientDirectory, filePath),
    bytes: contents.byteLength,
    gzipBytes: gzipSync(contents).byteLength,
  };
}

async function main() {
  const files = await listFoundationJavaScriptFiles();
  const measurements = await Promise.all(files.map(measureFile));
  const totalBytes = measurements.reduce((total, file) => total + file.bytes, 0);
  const totalGzipBytes = measurements.reduce(
    (total, file) => total + file.gzipBytes,
    0,
  );
  const totalGzipKilobytes = totalGzipBytes / 1024;
  const status =
    totalGzipKilobytes <= targetKilobytes
      ? "target-pass"
      : totalGzipKilobytes <= hardCeilingKilobytes
        ? "target-miss"
        : "hard-ceiling-fail";

  const report = {
    generatedAt: new Date().toISOString(),
    scope: "all production JavaScript emitted for the foundation route",
    files: measurements,
    totals: {
      bytes: totalBytes,
      gzipBytes: totalGzipBytes,
      gzipKilobytes: Number(totalGzipKilobytes.toFixed(2)),
    },
    budget: {
      targetKilobytes,
      hardCeilingKilobytes,
      status,
    },
  };

  await fs.writeFile(reportPath, `${JSON.stringify(report, null, 2)}\n`);
  console.log(
    `Foundation JavaScript: ${report.totals.gzipKilobytes} KB gzip (${status}).`,
  );

  if (status === "hard-ceiling-fail") {
    process.exit(1);
  }
}

main().catch((error) => {
  console.error(error instanceof Error ? error.stack : String(error));
  process.exit(1);
});
