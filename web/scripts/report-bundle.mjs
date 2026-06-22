#!/usr/bin/env node

import { gzipSync } from "node:zlib";
import fs from "node:fs/promises";
import path from "node:path";
import process from "node:process";

const targetKilobytes = 220;
const hardCeilingKilobytes = 300;
const buildDirectory = path.resolve("build/client/assets");
const reportPath = path.resolve("build/bundle-report.json");

async function listJavaScriptFiles(directory) {
  const entries = await fs.readdir(directory, { withFileTypes: true });
  return entries
    .filter((entry) => entry.isFile() && entry.name.endsWith(".js"))
    .map((entry) => path.join(directory, entry.name))
    .sort();
}

async function measureFile(filePath) {
  const contents = await fs.readFile(filePath);
  return {
    file: path.relative(path.resolve("build/client"), filePath),
    bytes: contents.byteLength,
    gzipBytes: gzipSync(contents).byteLength,
  };
}

async function main() {
  const files = await listJavaScriptFiles(buildDirectory);
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
