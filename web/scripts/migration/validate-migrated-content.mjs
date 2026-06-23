#!/usr/bin/env node

import { createHash } from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import vm from "node:vm";

import { JSDOM } from "jsdom";

const webRoot = fileURLToPath(new URL("../..", import.meta.url));
const repositoryRoot = path.resolve(webRoot, "..");
const manifestPath = path.join(
  webRoot,
  "src/data/generated/future-route-manifest.json",
);
const generatedRoot = path.join(webRoot, "src/content/migrated/generated");
const publicRoot = path.join(webRoot, "public");
const reportPath = path.join(webRoot, "build/content-migration-validation-report.json");

function sha256(value) {
  return createHash("sha256").update(value).digest("hex");
}

function normalizeText(value) {
  return value.replace(/\s+/g, " ").trim();
}

async function generatedFiles(directory) {
  const entries = await fs.readdir(directory, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const entryPath = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await generatedFiles(entryPath)));
    } else if (entry.name.endsWith(".ts")) {
      files.push(entryPath);
    }
  }
  return files.sort();
}

async function readGeneratedRecord(filePath) {
  const source = await fs.readFile(filePath, "utf8");
  const startMarker = "const content: MigratedContentRecord = ";
  const start = source.indexOf(startMarker);
  const end = source.lastIndexOf("\n\nexport default content;");
  if (start < 0 || end < 0) {
    throw new Error(`Cannot parse generated content module ${filePath}`);
  }
  return vm.runInNewContext(
    `(${source.slice(start + startMarker.length, end).replace(/;\s*$/, "")})`,
    Object.create(null),
  );
}

function sourceMetadata(document) {
  return {
    title: normalizeText(document.querySelector("title")?.textContent ?? ""),
    description:
      document
        .querySelector('meta[name="description"]')
        ?.getAttribute("content")
        ?.trim() ?? "",
    canonical:
      document.querySelector('link[rel="canonical"]')?.getAttribute("href")?.trim() ??
      "",
  };
}

function sourceHeadings(document) {
  return [
    ...document.querySelectorAll(
      "body > section h1, body > section h2, body > section h3, body > section h4, body > section h5, body > section h6",
    ),
  ].map((heading, order) => ({
    order,
    level: Number(heading.tagName.slice(1)),
    text: normalizeText(heading.textContent ?? ""),
  }));
}

async function main() {
  const futureRoutes = JSON.parse(await fs.readFile(manifestPath, "utf8"));
  const retainedRoutes = futureRoutes.filter((route) => route.lifecycle === "retained");
  const futurePaths = new Set(futureRoutes.map((route) => route.path));
  const files = await generatedFiles(generatedRoot);
  const records = await Promise.all(files.map(readGeneratedRecord));
  const recordsById = new Map(records.map((record) => [record.id, record]));
  const issues = [];
  let linkCount = 0;
  let assetCount = 0;
  let schemaCount = 0;

  if (records.length !== retainedRoutes.length) {
    issues.push(
      `Retained content count mismatch: expected ${retainedRoutes.length}, found ${records.length}`,
    );
  }
  for (const field of ["id", "routeId", "routePath"]) {
    const values = records.map((record) => record[field]);
    if (new Set(values).size !== values.length) {
      issues.push(`Duplicate migrated ${field}`);
    }
  }

  for (const route of retainedRoutes) {
    const record = recordsById.get(route.contentId);
    if (!record) {
      issues.push(`${route.path}: missing migrated content module`);
      continue;
    }
    if (record.routeId !== route.id || record.routePath !== route.path) {
      issues.push(`${route.path}: route identity mismatch`);
    }
    if (record.source.file !== route.sourceFile) {
      issues.push(`${route.path}: legacy source mismatch`);
    }

    const sourcePath = path.join(repositoryRoot, record.source.file);
    const sourceBytes = await fs.readFile(sourcePath);
    if (sha256(sourceBytes) !== record.source.sha256) {
      issues.push(`${route.path}: legacy source hash mismatch`);
    }
    if (sourceBytes.byteLength !== record.source.bytes) {
      issues.push(`${route.path}: legacy source byte count mismatch`);
    }

    const document = new JSDOM(sourceBytes.toString("utf8")).window.document;
    const expectedMetadata = sourceMetadata(document);
    for (const field of ["title", "description", "canonical"]) {
      if (record.metadata[field] !== expectedMetadata[field]) {
        issues.push(`${route.path}: source ${field} mismatch`);
      }
    }
    if (JSON.stringify(record.headings) !== JSON.stringify(sourceHeadings(document))) {
      issues.push(`${route.path}: heading provenance mismatch`);
    }
    if (
      !record.sections.length ||
      !record.sections.some((section) => section.blocks.length)
    ) {
      issues.push(`${route.path}: no migrated content blocks`);
    }

    const sourceSchema = [
      ...document.querySelectorAll('script[type="application/ld+json"]'),
    ];
    if (record.schema.length !== sourceSchema.length) {
      issues.push(`${route.path}: source schema count mismatch`);
    }
    for (const schema of record.schema) {
      schemaCount += 1;
      try {
        if (
          JSON.stringify(JSON.parse(schema.rawJson)) !== JSON.stringify(schema.parsed)
        ) {
          issues.push(`${route.path}: parsed schema differs from source schema`);
        }
      } catch {
        issues.push(`${route.path}: invalid source schema JSON`);
      }
    }

    for (const link of record.links) {
      linkCount += 1;
      if (!link.valid) {
        issues.push(`${route.path}: unresolved link ${link.sourceHref}`);
      }
      if (
        !link.external &&
        link.migratedHref.startsWith("/") &&
        !futurePaths.has(link.migratedHref.split(/[?#]/)[0])
      ) {
        issues.push(`${route.path}: unknown internal target ${link.migratedHref}`);
      }
    }

    for (const asset of record.assets) {
      assetCount += 1;
      const sourceAsset = path.join(repositoryRoot, asset.sourcePath);
      const publicAsset = path.join(publicRoot, asset.publicPath.slice(1));
      const [sourceAssetBytes, publicAssetBytes] = await Promise.all([
        fs.readFile(sourceAsset),
        fs.readFile(publicAsset),
      ]);
      if (
        sha256(sourceAssetBytes) !== asset.sourceSha256 ||
        sha256(publicAssetBytes) !== asset.sourceSha256
      ) {
        issues.push(`${route.path}: asset hash mismatch ${asset.sourcePath}`);
      }
      if (!asset.width || !asset.height) {
        issues.push(`${route.path}: asset dimensions missing ${asset.sourcePath}`);
      }
    }

    if (record.interactions.some((interaction) => interaction.active !== false)) {
      issues.push(`${route.path}: production interaction activated`);
    }
  }

  const report = {
    generatedAt: new Date().toISOString(),
    status: issues.length === 0 ? "pass" : "fail",
    totals: {
      retainedRoutes: retainedRoutes.length,
      migratedModules: records.length,
      links: linkCount,
      assets: assetCount,
      schemaRecords: schemaCount,
    },
    issues,
  };
  await fs.mkdir(path.dirname(reportPath), { recursive: true });
  await fs.writeFile(reportPath, `${JSON.stringify(report, null, 2)}\n`);

  if (issues.length > 0) {
    throw new Error(`Migrated content validation failed:\n${issues.join("\n")}`);
  }

  console.log(
    `Migrated content validation passed: ${records.length} routes, ${linkCount} links, ${assetCount} assets, ${schemaCount} schema records.`,
  );
}

main().catch((error) => {
  console.error(error instanceof Error ? error.stack : String(error));
  process.exit(1);
});
