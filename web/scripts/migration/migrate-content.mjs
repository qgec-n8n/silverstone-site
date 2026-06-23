#!/usr/bin/env node

import { createHash } from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { JSDOM } from "jsdom";
import prettier from "prettier";
import sharp from "sharp";

const migrationDate = "2026-06-23";
const webRoot = fileURLToPath(new URL("../..", import.meta.url));
const repositoryRoot = path.resolve(webRoot, "..");
const futureManifestPath = path.join(
  webRoot,
  "src/data/generated/future-route-manifest.json",
);
const legacyManifestPath = path.join(
  webRoot,
  "src/data/generated/legacy-route-manifest.json",
);
const sourceContentManifestPath = path.join(
  webRoot,
  "src/content/generated/source-content-manifest.json",
);
const futureRouteMapPath = path.join(
  repositoryRoot,
  "docs/silverstone-transformation/seo/future-route-map-v1.csv",
);
const assetInventoryPath = path.join(
  repositoryRoot,
  "docs/silverstone-transformation/audits/asset-integration-inventory-v1.csv",
);
const migratedRoot = path.join(webRoot, "src/content/migrated");
const generatedContentRoot = path.join(migratedRoot, "generated");
const generatedIndexPath = path.join(migratedRoot, "generated-index.ts");
const publicAssetRoot = path.join(webRoot, "public/migrated-assets");
const contentDocsRoot = path.join(
  repositoryRoot,
  "docs/silverstone-transformation/content",
);
const provenancePath = path.join(contentDocsRoot, "content-provenance-v1.csv");
const claimsPath = path.join(contentDocsRoot, "claims-proof-review-v1.csv");
const duplicatesPath = path.join(contentDocsRoot, "duplicate-content-review-v1.csv");
const exceptionsPath = path.join(contentDocsRoot, "migration-exceptions-v1.md");

function sha256(value) {
  return createHash("sha256").update(value).digest("hex");
}

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

  if (value || row.length > 0) {
    row.push(value);
    rows.push(row);
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

function csvEscape(value) {
  return `"${String(value ?? "").replaceAll('"', '""')}"`;
}

function writeCsv(headers, rows) {
  return `${[
    headers.map(csvEscape).join(","),
    ...rows.map((row) => headers.map((header) => csvEscape(row[header])).join(",")),
  ].join("\n")}\n`;
}

function normalizeText(value) {
  return value.replace(/\s+/g, " ").trim();
}

function selectorFor(element) {
  const tag = element.tagName.toLowerCase();
  if (element.id) {
    return `${tag}#${element.id}`;
  }
  const classes = [...element.classList].slice(0, 3);
  return classes.length > 0 ? `${tag}.${classes.join(".")}` : tag;
}

function contentKind(route) {
  if (route.routeGroup === "industries") {
    return "industry";
  }
  if (route.template === "article") {
    return "article";
  }
  if (route.routeGroup === "services") {
    return "service";
  }
  if (route.routeGroup === "conversion") {
    return "conversion";
  }
  if (route.routeGroup === "legal") {
    return "legal";
  }
  return "core";
}

function routeFileSlug(routePath) {
  return routePath === "/" ? "home" : routePath.replace(/^\/+/, "").split("/").at(-1);
}

function metadataFromDocument(document) {
  const metaValue = (selector) =>
    document.querySelector(selector)?.getAttribute("content")?.trim() ?? null;
  const canonical =
    document.querySelector('link[rel="canonical"]')?.getAttribute("href")?.trim() ?? "";
  const openGraph = [...document.querySelectorAll("meta[property^='og:']")].map(
    (element) => ({
      property: element.getAttribute("property") ?? "",
      content: element.getAttribute("content") ?? "",
    }),
  );
  const twitter = [...document.querySelectorAll("meta[name^='twitter:']")].map(
    (element) => ({
      name: element.getAttribute("name") ?? "",
      content: element.getAttribute("content") ?? "",
    }),
  );
  const excludedNames = new Set([
    "description",
    "robots",
    "author",
    ...twitter.map((item) => item.name),
  ]);
  const other = [...document.querySelectorAll("meta[name], meta[http-equiv]")]
    .map((element) => ({
      key: element.getAttribute("name") ?? element.getAttribute("http-equiv") ?? "",
      content: element.getAttribute("content") ?? "",
    }))
    .filter((item) => item.key && !excludedNames.has(item.key));

  return {
    title: document.title.trim(),
    description: metaValue('meta[name="description"]') ?? "",
    canonical,
    robots: metaValue('meta[name="robots"]'),
    author: metaValue('meta[name="author"]'),
    openGraph,
    twitter,
    other,
  };
}

function schemaTypes(value) {
  const types = new Set();
  const visit = (candidate) => {
    if (!candidate || typeof candidate !== "object") {
      return;
    }
    if (Array.isArray(candidate)) {
      candidate.forEach(visit);
      return;
    }
    const type = candidate["@type"];
    if (typeof type === "string") {
      types.add(type);
    } else if (Array.isArray(type)) {
      type
        .filter((item) => typeof item === "string")
        .forEach((item) => types.add(item));
    }
    Object.values(candidate).forEach(visit);
  };
  visit(value);
  return [...types];
}

function schemaFromDocument(document, exceptions, route) {
  return [...document.querySelectorAll('script[type="application/ld+json"]')].flatMap(
    (element, order) => {
      const rawJson = element.textContent?.trim() ?? "";
      if (!rawJson) {
        return [];
      }
      try {
        const parsed = JSON.parse(rawJson);
        return [{ order, types: schemaTypes(parsed), rawJson, parsed }];
      } catch (error) {
        exceptions.push({
          type: "schema-parse",
          routePath: route.path,
          sourceFile: route.sourceFile,
          detail: error instanceof Error ? error.message : String(error),
        });
        return [];
      }
    },
  );
}

function sourcePathCandidates(sourceFile, sourceReference) {
  const cleanReference = sourceReference.split(/[?#]/)[0];
  return [
    path.resolve(repositoryRoot, path.dirname(sourceFile), cleanReference),
    path.resolve(repositoryRoot, cleanReference.replace(/^\/+/, "")),
    path.resolve(
      repositoryRoot,
      cleanReference.replace(/^(?:\.\.\/)+/, "").replace(/^\/+/, ""),
    ),
  ];
}

function localPathFromAbsoluteUrl(value) {
  try {
    const url = new URL(value);
    return url.hostname === "silverstone-ai.com"
      ? path.resolve(repositoryRoot, url.pathname.replace(/^\/+/, ""))
      : null;
  } catch {
    return null;
  }
}

function relativeRepositoryPath(filePath) {
  return path.relative(repositoryRoot, filePath).split(path.sep).join("/");
}

function normaliseInternalPath(pathname) {
  if (pathname === "") {
    return "/";
  }
  return pathname !== "/" ? pathname.replace(/\/+$/, "") : pathname;
}

function createLinkResolver({ legacyRoutes, route, routePaths }) {
  const redirectTargets = new Map(
    legacyRoutes
      .filter(
        (record) =>
          record.recordType === "redirect" &&
          record.disposition !== "removed" &&
          record.disposition !== "draft",
      )
      .map((record) => [record.sourcePath, record.targetPath]),
  );

  return (sourceHref) => {
    const trimmedHref = sourceHref.trim();
    if (!trimmedHref || trimmedHref.startsWith("javascript:")) {
      return {
        href: trimmedHref || "#",
        sourceHref,
        external: false,
        valid: false,
      };
    }
    if (
      trimmedHref.startsWith("#") ||
      trimmedHref.startsWith("mailto:") ||
      trimmedHref.startsWith("tel:")
    ) {
      return {
        href: trimmedHref,
        sourceHref,
        external: trimmedHref.startsWith("mailto:") || trimmedHref.startsWith("tel:"),
        valid: true,
      };
    }

    let url;
    try {
      url = new URL(trimmedHref, route.canonical);
    } catch {
      return {
        href: trimmedHref,
        sourceHref,
        external: false,
        valid: false,
      };
    }

    if (url.hostname !== "silverstone-ai.com") {
      return {
        href: url.href,
        sourceHref,
        external: true,
        valid: true,
      };
    }

    const sourcePath = normaliseInternalPath(url.pathname);
    const migratedPath = redirectTargets.get(sourcePath) ?? sourcePath;
    const valid = routePaths.has(migratedPath);
    return {
      href: `${migratedPath}${url.hash}`,
      sourceHref,
      external: false,
      valid,
    };
  };
}

function textNodeValue(value) {
  if (!value || !value.trim()) {
    return value.includes("\n") || value.includes("\t") || value.includes(" ")
      ? " "
      : "";
  }
  const leading = /^\s/.test(value) ? " " : "";
  const trailing = /\s$/.test(value) ? " " : "";
  return `${leading}${value.replace(/\s+/g, " ").trim()}${trailing}`;
}

function mergeTextSegments(segments) {
  const merged = [];
  for (const segment of segments) {
    if (!segment) {
      continue;
    }
    const previous = merged.at(-1);
    if (segment.type === "text" && previous?.type === "text") {
      previous.value += segment.value;
    } else {
      merged.push(segment);
    }
  }
  return merged.filter(
    (segment) => segment.type !== "text" || segment.value.length > 0,
  );
}

function createInlineExtractor({ linkRecords, resolveLink }) {
  return (element) => {
    const visit = (node) => {
      if (node.nodeType === 3) {
        return [{ type: "text", value: textNodeValue(node.nodeValue ?? "") }];
      }
      if (node.nodeType !== 1) {
        return [];
      }
      if (node.tagName === "BR") {
        return [{ type: "text", value: " " }];
      }
      if (node.tagName === "A") {
        const text = normalizeText(node.textContent ?? "");
        const resolved = resolveLink(node.getAttribute("href") ?? "");
        linkRecords.push({
          order: linkRecords.length,
          text,
          sourceHref: resolved.sourceHref,
          migratedHref: resolved.href,
          external: resolved.external,
          valid: resolved.valid,
        });
        return [
          {
            type: "link",
            text,
            href: resolved.href,
            sourceHref: resolved.sourceHref,
            external: resolved.external,
            valid: resolved.valid,
          },
        ];
      }
      return [...node.childNodes].flatMap(visit);
    };

    return mergeTextSegments([...element.childNodes].flatMap(visit));
  };
}

function textFromSegments(segments) {
  return normalizeText(
    segments
      .map((segment) => (segment.type === "text" ? segment.value : segment.text))
      .join(""),
  );
}

function interactionFromElement(element, route, interactionOrder) {
  const isForm = element.tagName === "FORM";
  const sourceUrl =
    element.getAttribute("data-url") ??
    element.getAttribute("src") ??
    element.querySelector("[data-url]")?.getAttribute("data-url") ??
    null;
  const provider = /calendly/i.test(
    `${element.id} ${element.className} ${sourceUrl ?? ""}`,
  )
    ? "Calendly"
    : isForm
      ? "legacy form"
      : null;
  const fields = isForm
    ? [...element.querySelectorAll("input, textarea, select")].map((field, index) => {
        const id = field.getAttribute("id");
        const label = id
          ? element.querySelector(`label[for="${id}"]`)?.textContent
          : field.closest("label")?.textContent;
        return {
          name: field.getAttribute("name") ?? id ?? `field-${String(index + 1)}`,
          label: normalizeText(label ?? field.getAttribute("aria-label") ?? ""),
          type:
            field.tagName === "TEXTAREA"
              ? "textarea"
              : (field.getAttribute("type") ?? field.tagName.toLowerCase()),
          placeholder: field.getAttribute("placeholder") ?? "",
          required: field.hasAttribute("required"),
        };
      })
    : [];

  return {
    id: `${route.id}-interaction-${String(interactionOrder + 1)}`,
    type: isForm ? "form" : "embed",
    provider,
    sourceSelector: selectorFor(element),
    sourceAction: isForm ? element.getAttribute("action") : null,
    sourceUrl,
    fields,
    active: false,
  };
}

function isInteractionElement(element) {
  if (element.tagName === "FORM" || element.tagName === "IFRAME") {
    return true;
  }
  return /calendly/i.test(
    `${element.id} ${element.className} ${element.getAttribute("data-url") ?? ""}`,
  );
}

async function createAssetResolver({ assetInventory, document, exceptions, route }) {
  const routeAssets = [];
  const assetBySourcePath = new Map();
  const sourceOgImage = document
    .querySelector('meta[property="og:image"]')
    ?.getAttribute("content");

  return {
    assets: routeAssets,
    async resolve(element) {
      const sourceReference = element.getAttribute("src") ?? "";
      if (!sourceReference) {
        return null;
      }

      let sourcePath = sourceReference.startsWith("http")
        ? localPathFromAbsoluteUrl(sourceReference)
        : null;
      if (!sourcePath && !sourceReference.startsWith("http")) {
        for (const candidate of sourcePathCandidates(
          route.sourceFile,
          sourceReference,
        )) {
          try {
            await fs.access(candidate);
            sourcePath = candidate;
            break;
          } catch {
            // Continue through source-relative candidates.
          }
        }
      }

      let fallbackForMissingSource = null;
      if (sourcePath) {
        try {
          await fs.access(sourcePath);
        } catch {
          sourcePath = null;
        }
      }
      if (!sourcePath && sourceOgImage) {
        const fallbackPath = localPathFromAbsoluteUrl(sourceOgImage);
        if (fallbackPath) {
          try {
            await fs.access(fallbackPath);
            fallbackForMissingSource = sourceReference;
            sourcePath = fallbackPath;
            exceptions.push({
              type: "missing-image-derivative",
              routePath: route.path,
              sourceFile: route.sourceFile,
              detail: `${sourceReference} is missing; source OG image ${relativeRepositoryPath(fallbackPath)} retained as a review fallback`,
            });
          } catch {
            // The exception below records the unresolved missing image.
          }
        }
      }
      if (!sourcePath) {
        exceptions.push({
          type: "missing-image",
          routePath: route.path,
          sourceFile: route.sourceFile,
          detail: sourceReference,
        });
        return null;
      }

      const repositoryPath = relativeRepositoryPath(sourcePath);
      const inventoryRecord = assetInventory.get(repositoryPath);
      if (
        !inventoryRecord ||
        !["retain", "refactor"].includes(inventoryRecord.disposition)
      ) {
        exceptions.push({
          type: "asset-not-approved",
          routePath: route.path,
          sourceFile: route.sourceFile,
          detail: `${repositoryPath}: ${inventoryRecord?.disposition ?? "not in A-01 asset inventory"}`,
        });
        return null;
      }

      const existing = assetBySourcePath.get(repositoryPath);
      if (existing) {
        return existing;
      }

      const sourceBytes = await fs.readFile(sourcePath);
      const metadata = await sharp(sourceBytes).metadata();
      if (!metadata.width || !metadata.height) {
        exceptions.push({
          type: "image-dimensions",
          routePath: route.path,
          sourceFile: route.sourceFile,
          detail: repositoryPath,
        });
        return null;
      }

      const publicPath = `/migrated-assets/${repositoryPath}`;
      const destinationPath = path.join(
        publicAssetRoot,
        repositoryPath.split("/").join(path.sep),
      );
      await fs.mkdir(path.dirname(destinationPath), { recursive: true });
      await fs.writeFile(destinationPath, sourceBytes);

      const sourceAlt = element.getAttribute("alt") ?? "";
      const asset = {
        id: `asset-${sha256(repositoryPath).slice(0, 16)}`,
        role: element.closest(".hero") ? "hero" : "content",
        sourcePath: repositoryPath,
        sourceReference,
        sourceSha256: sha256(sourceBytes),
        sourceBytes: sourceBytes.byteLength,
        publicPath,
        width: metadata.width,
        height: metadata.height,
        sourceAlt,
        altCandidate: sourceAlt,
        altStatus: sourceAlt.trim() ? "source-alt" : "decorative-or-missing-review",
        inventoryDisposition: inventoryRecord.disposition,
        fallbackForMissingSource,
      };
      routeAssets.push(asset);
      assetBySourcePath.set(repositoryPath, asset);
      return asset;
    },
  };
}

function claimCategories(text) {
  const categories = new Set();
  if (
    /(?:£\s?[\d,.]+|\b\d+(?:\.\d+)?\s?(?:%|x|×|hours?|minutes?|days?|weeks?|months?|years?|bookings?|leads?|customers?|calls?|appointments?|jobs?|revenue|roi)\b)/i.test(
      text,
    )
  ) {
    categories.add("metric");
  }
  if (
    /(?:\b24\/7\b|\b\d+\s?(?:minute|day|week|month|year)s?\b|\bwithin\b|\bby\s+\d{4}\b)/i.test(
      text,
    )
  ) {
    categories.add("timeline");
  }
  if (
    /(?:£\s?[\d,.]+|\bpricing\b|\bsetup fee\b|\bmonthly\b|\bper month\b|\bretainer\b)/i.test(
      text,
    )
  ) {
    categories.add("pricing");
  }
  if (
    /\b(?:best|leading|top|strongest|fastest|highest|lowest|number one|#1)\b/i.test(
      text,
    )
  ) {
    categories.add("ranking");
  }
  if (
    /\b(?:guarantee|guaranteed|never|always|every|zero risk|no risk|without fail|cannot fail)\b/i.test(
      text,
    )
  ) {
    categories.add("guarantee-or-absolute");
  }
  return [...categories];
}

function claimRowsForContent(content) {
  const rows = [];
  for (const section of content.sections) {
    for (const block of section.blocks) {
      const texts =
        block.type === "list"
          ? block.items.map((item) => item.text)
          : "text" in block
            ? [block.text]
            : [];
      for (const text of texts) {
        const categories = claimCategories(text);
        if (categories.length === 0 || text.length < 12) {
          continue;
        }
        const externalCitation =
          "segments" in block &&
          block.segments.some((segment) => segment.type === "link" && segment.external);
        rows.push({
          claim_id: `claim-${sha256(`${content.routePath}:${String(block.order)}:${text}`).slice(0, 16)}`,
          route_path: content.routePath,
          source_file: content.source.file,
          block_order: block.order,
          categories: categories.join(" | "),
          claim_text: text,
          evidence_status: externalCitation
            ? "source-citation-present-review-required"
            : "proof-required",
          source_evidence: externalCitation
            ? "legacy block contains an external link"
            : "legacy source only",
          recommended_action:
            "Retain as source copy; verify, qualify or remove during editorial review.",
        });
      }
    }
  }
  return rows;
}

function sectionText(section) {
  return normalizeText(
    section.blocks
      .flatMap((block) => {
        if (block.type === "list") {
          return block.items.map((item) => item.text);
        }
        if ("text" in block) {
          return [block.text];
        }
        return [];
      })
      .join(" "),
  );
}

function contentText(content) {
  return normalizeText(content.sections.map(sectionText).join(" "));
}

function wordSet(value) {
  return new Set(
    value
      .toLowerCase()
      .replace(/[^\p{L}\p{N}\s]/gu, " ")
      .split(/\s+/)
      .filter((word) => word.length > 2),
  );
}

function jaccard(left, right) {
  const intersection = [...left].filter((value) => right.has(value)).length;
  const union = new Set([...left, ...right]).size;
  return union === 0 ? 0 : intersection / union;
}

function thinThreshold(kind, routePath) {
  if (kind === "article") {
    return 1500;
  }
  if (kind === "service" || kind === "industry") {
    return 800;
  }
  if (kind === "conversion" || kind === "legal") {
    return 300;
  }
  return routePath === "/blog" ? 500 : 500;
}

function duplicateReviewRows(contents) {
  const rows = [];
  const sectionOwners = new Map();

  for (const content of contents) {
    const text = contentText(content);
    const words = text ? text.split(/\s+/).length : 0;
    const threshold = thinThreshold(content.kind, content.routePath);
    if (words < threshold) {
      rows.push({
        review_id: `thin-${content.id}`,
        review_type: "thin-content",
        primary_route: content.routePath,
        comparison_route: "",
        similarity: "",
        evidence: `${String(words)} words; advisory floor ${String(threshold)}`,
        review_status: "editorial-review-required",
        recommended_action:
          "Retain source copy; decide whether coverage is sufficient before release.",
      });
    }
    if (
      /(?:conflict|contradict|overlap|discrepancy|loop)/i.test(content.flags.riskNotes)
    ) {
      rows.push({
        review_id: `risk-${content.id}`,
        review_type: "contradictory-or-overlap-risk",
        primary_route: content.routePath,
        comparison_route: "",
        similarity: "",
        evidence: content.flags.riskNotes,
        review_status: "owner-decision-required",
        recommended_action: "Resolve the recorded A-01 risk before release.",
      });
    }

    for (const section of content.sections) {
      const textValue = sectionText(section);
      if (textValue.length < 100) {
        continue;
      }
      const hash = sha256(textValue.toLowerCase());
      const owners = sectionOwners.get(hash) ?? [];
      owners.push({ routePath: content.routePath, text: textValue });
      sectionOwners.set(hash, owners);
    }
  }

  for (let leftIndex = 0; leftIndex < contents.length; leftIndex += 1) {
    for (
      let rightIndex = leftIndex + 1;
      rightIndex < contents.length;
      rightIndex += 1
    ) {
      const left = contents[leftIndex];
      const right = contents[rightIndex];
      const similarity = jaccard(
        wordSet(contentText(left)),
        wordSet(contentText(right)),
      );
      if (similarity >= 0.55) {
        rows.push({
          review_id: `similar-${sha256(`${left.routePath}:${right.routePath}`).slice(0, 16)}`,
          review_type: "near-duplicate-page",
          primary_route: left.routePath,
          comparison_route: right.routePath,
          similarity: similarity.toFixed(4),
          evidence: "Jaccard similarity across normalized source content",
          review_status: "seo-content-review-required",
          recommended_action:
            "Preserve both routes for migration; review intent and differentiation before release.",
        });
      }
    }
  }

  for (const [hash, owners] of sectionOwners) {
    const routes = [...new Set(owners.map((owner) => owner.routePath))];
    if (routes.length < 2) {
      continue;
    }
    rows.push({
      review_id: `exact-${hash.slice(0, 16)}`,
      review_type: "exact-shared-section",
      primary_route: routes[0],
      comparison_route: routes.slice(1).join(" | "),
      similarity: "1.0000",
      evidence: owners[0].text,
      review_status: "seo-content-review-required",
      recommended_action:
        "Keep source fidelity now; decide whether the shared section is intentional boilerplate.",
    });
  }

  return rows;
}

async function extractContentRecord({
  assetInventory,
  exceptions,
  legacyRoutes,
  route,
  routePaths,
  sourceRecord,
}) {
  const sourcePath = path.join(repositoryRoot, route.sourceFile);
  const sourceBuffer = await fs.readFile(sourcePath);
  const document = new JSDOM(sourceBuffer.toString("utf8")).window.document;
  const linkRecords = [];
  const interactions = [];
  const resolveLink = createLinkResolver({ legacyRoutes, route, routePaths });
  const extractInline = createInlineExtractor({ linkRecords, resolveLink });
  const assetResolver = await createAssetResolver({
    assetInventory,
    document,
    exceptions,
    route,
  });
  let blockOrder = 0;

  const createBlockExtractor = () => {
    const extract = async (element) => {
      const tag = element.tagName.toLowerCase();
      const sourceSelector = selectorFor(element);

      if (tag === "h1") {
        return [];
      }
      if (/^h[2-6]$/.test(tag)) {
        const text = normalizeText(element.textContent ?? "");
        return text
          ? [
              {
                type: "heading",
                order: blockOrder++,
                level: Number(tag.slice(1)),
                text,
                sourceSelector,
              },
            ]
          : [];
      }
      if (tag === "p" || tag === "dt" || tag === "dd" || tag === "pre") {
        const segments = extractInline(element);
        const text = textFromSegments(segments);
        return text
          ? [
              {
                type: "paragraph",
                order: blockOrder++,
                text,
                segments,
                sourceSelector,
              },
            ]
          : [];
      }
      if (tag === "ul" || tag === "ol") {
        const items = [...element.children]
          .filter((child) => child.tagName === "LI")
          .map((item) => {
            const segments = extractInline(item);
            return { text: textFromSegments(segments), segments };
          })
          .filter((item) => item.text);
        return items.length > 0
          ? [
              {
                type: "list",
                order: blockOrder++,
                ordered: tag === "ol",
                items,
                sourceSelector,
              },
            ]
          : [];
      }
      if (tag === "img") {
        const asset = await assetResolver.resolve(element);
        return asset
          ? [
              {
                type: "image",
                order: blockOrder++,
                assetId: asset.id,
                sourceSelector,
              },
            ]
          : [];
      }
      if (tag === "picture") {
        const image = element.querySelector("img");
        return image ? extract(image) : [];
      }
      if (tag === "blockquote") {
        const segments = extractInline(element);
        const text = textFromSegments(segments);
        return text
          ? [
              {
                type: "quote",
                order: blockOrder++,
                text,
                segments,
                sourceSelector,
              },
            ]
          : [];
      }
      if (tag === "table") {
        const headers = [...element.querySelectorAll("thead th")].map((cell) =>
          normalizeText(cell.textContent ?? ""),
        );
        const rows = [...element.querySelectorAll("tbody tr")].map((row) =>
          [...row.querySelectorAll("th, td")].map((cell) =>
            normalizeText(cell.textContent ?? ""),
          ),
        );
        return headers.length > 0 || rows.length > 0
          ? [
              {
                type: "table",
                order: blockOrder++,
                headers,
                rows,
                sourceSelector,
              },
            ]
          : [];
      }
      if (isInteractionElement(element)) {
        const interaction = interactionFromElement(element, route, interactions.length);
        interactions.push(interaction);
        return [
          {
            type: "interaction",
            order: blockOrder++,
            interactionId: interaction.id,
            sourceSelector,
          },
        ];
      }
      if (tag === "a") {
        const segments = extractInline(element);
        const text = textFromSegments(segments);
        return text
          ? [
              {
                type: "paragraph",
                order: blockOrder++,
                text,
                segments,
                sourceSelector,
              },
            ]
          : [];
      }
      if (["script", "style", "noscript", "svg", "button", "template"].includes(tag)) {
        return [];
      }

      const nested = [];
      for (const child of [...element.children]) {
        nested.push(...(await extract(child)));
      }
      return nested;
    };
    return extract;
  };
  const extractBlocks = createBlockExtractor();
  const sourceSections = [...document.querySelectorAll("body > section")];
  const sections = [];

  for (const [order, section] of sourceSections.entries()) {
    const blocks = [];
    for (const child of [...section.children]) {
      blocks.push(...(await extractBlocks(child)));
    }
    if (blocks.length === 0) {
      continue;
    }
    const firstHeading = section.querySelector("h1, h2, h3, h4, h5, h6");
    sections.push({
      order,
      sourceSelector: selectorFor(section),
      sourceId: section.id || null,
      sourceClasses: [...section.classList],
      heading: firstHeading
        ? {
            level: Number(firstHeading.tagName.slice(1)),
            text: normalizeText(firstHeading.textContent ?? ""),
          }
        : null,
      blocks,
    });
  }

  const headings = [
    ...document.querySelectorAll(
      "body > section h1, body > section h2, body > section h3, body > section h4, body > section h5, body > section h6",
    ),
  ].map((heading, order) => ({
    order,
    level: Number(heading.tagName.slice(1)),
    text: normalizeText(heading.textContent ?? ""),
  }));
  const sourceText = normalizeText(
    sections
      .flatMap((section) =>
        section.blocks.flatMap((block) =>
          block.type === "list"
            ? block.items.map((item) => item.text)
            : "text" in block
              ? [block.text]
              : [],
        ),
      )
      .join(" "),
  );

  const record = {
    id: route.contentId,
    routeId: route.id,
    routePath: route.path,
    kind: contentKind(route),
    source: {
      routeKey: route.legacyRouteKey,
      file: route.sourceFile,
      sha256: sha256(sourceBuffer),
      bytes: sourceBuffer.byteLength,
      textSha256: sha256(sourceText),
      extractedBlockCount: blockOrder,
    },
    metadata: metadataFromDocument(document),
    schema: schemaFromDocument(document, exceptions, route),
    headings,
    sections,
    links: linkRecords,
    assets: assetResolver.assets,
    interactions,
    flags: {
      contentStatus: route.contentStatus,
      claimsStatus: route.claimsStatus,
      riskNotes: sourceRecord.riskNotes,
      unresolvedNotes: sourceRecord.unresolvedNotes,
    },
  };

  for (const link of linkRecords.filter((item) => !item.valid)) {
    exceptions.push({
      type: "unresolved-link",
      routePath: route.path,
      sourceFile: route.sourceFile,
      detail: `${link.sourceHref} (${link.text})`,
    });
  }
  return record;
}

function moduleSource(record) {
  return [
    'import type { MigratedContentRecord } from "../../schema";',
    "",
    `const content: MigratedContentRecord = ${JSON.stringify(record, null, 2)};`,
    "",
    "export default content;",
    "",
  ].join("\n");
}

function generatedIndexSource(indexRecords) {
  const loaderEntries = indexRecords
    .map(
      (record) =>
        `  ${JSON.stringify(record.contentId)}: () => import(${JSON.stringify(record.modulePath)}),`,
    )
    .join("\n");
  return [
    'import type { MigratedContentIndexRecord, MigratedContentRecord } from "./schema";',
    "",
    `export const migratedContentIndex: MigratedContentIndexRecord[] = ${JSON.stringify(indexRecords, null, 2)};`,
    "",
    "const contentLoaders: Record<",
    "  string,",
    "  () => Promise<{ default: MigratedContentRecord }>",
    "> = {",
    loaderEntries,
    "};",
    "",
    "export async function loadMigratedContent(",
    "  contentId: string,",
    "): Promise<MigratedContentRecord> {",
    "  const loader = contentLoaders[contentId];",
    "  if (!loader) {",
    "    throw new Error(`No migrated content module for ${contentId}`);",
    "  }",
    "  return (await loader()).default;",
    "}",
    "",
  ].join("\n");
}

async function main() {
  const prettierOptions =
    (await prettier.resolveConfig(
      path.join(webRoot, "src/content/migrated/schema.ts"),
    )) ?? {};
  const [
    futureManifestBuffer,
    legacyManifestBuffer,
    sourceContentManifestBuffer,
    futureRouteMapBuffer,
    assetInventoryBuffer,
  ] = await Promise.all([
    fs.readFile(futureManifestPath),
    fs.readFile(legacyManifestPath),
    fs.readFile(sourceContentManifestPath),
    fs.readFile(futureRouteMapPath),
    fs.readFile(assetInventoryPath),
  ]);
  const futureRoutes = JSON.parse(futureManifestBuffer.toString("utf8"));
  const retainedRoutes = futureRoutes.filter((route) => route.lifecycle === "retained");
  const legacyRoutes = JSON.parse(legacyManifestBuffer.toString("utf8"));
  const sourceRecords = JSON.parse(sourceContentManifestBuffer.toString("utf8"));
  const sourceById = new Map(sourceRecords.map((record) => [record.id, record]));
  const routePaths = new Set(futureRoutes.map((route) => route.path));
  const assetInventoryRows = parseCsv(assetInventoryBuffer.toString("utf8"));
  const assetInventory = new Map(
    assetInventoryRows.map((record) => [record.path_or_key, record]),
  );
  const sourceHashLines = retainedRoutes
    .map((route) => {
      const source = sourceById.get(route.contentId);
      return `${source.sourceSha256}  ${source.sourceFile}`;
    })
    .sort()
    .join("\n");
  const baselineHashes = {
    baseCommit: "6c2953cccb2a0b8f6660414c9b8745959b1e3573",
    futureRouteManifest: sha256(futureManifestBuffer),
    sourceContentManifest: sha256(sourceContentManifestBuffer),
    futureRouteMap: sha256(futureRouteMapBuffer),
    retainedLegacySourceAggregate: sha256(sourceHashLines),
  };

  await Promise.all([
    fs.rm(generatedContentRoot, { recursive: true, force: true }),
    fs.rm(publicAssetRoot, { recursive: true, force: true }),
  ]);
  await Promise.all([
    fs.mkdir(generatedContentRoot, { recursive: true }),
    fs.mkdir(publicAssetRoot, { recursive: true }),
    fs.mkdir(contentDocsRoot, { recursive: true }),
  ]);

  const exceptions = [];
  const contents = [];
  for (const route of retainedRoutes) {
    const sourceRecord = sourceById.get(route.contentId);
    if (!sourceRecord) {
      throw new Error(`Missing G-01 source record for ${route.path}`);
    }
    contents.push(
      await extractContentRecord({
        assetInventory,
        exceptions,
        legacyRoutes,
        route,
        routePaths,
        sourceRecord,
      }),
    );
  }

  const indexRecords = [];
  const provenanceRows = [];
  for (const content of contents) {
    const route = retainedRoutes.find((candidate) => candidate.id === content.routeId);
    const group = route.routeGroup;
    const fileSlug = routeFileSlug(route.path);
    const moduleDirectory = path.join(generatedContentRoot, group);
    const modulePath = path.join(moduleDirectory, `${fileSlug}.ts`);
    await fs.mkdir(moduleDirectory, { recursive: true });
    const source = await prettier.format(moduleSource(content), {
      ...prettierOptions,
      parser: "typescript",
    });
    await fs.writeFile(modulePath, source);
    const relativeModulePath = `./generated/${group}/${fileSlug}`;
    indexRecords.push({
      contentId: content.id,
      routeId: content.routeId,
      routePath: content.routePath,
      kind: content.kind,
      sourceFile: content.source.file,
      sourceSha256: content.source.sha256,
      modulePath: relativeModulePath,
    });
    provenanceRows.push({
      content_id: content.id,
      route_id: content.routeId,
      route_path: content.routePath,
      content_kind: content.kind,
      source_file: content.source.file,
      source_sha256: content.source.sha256,
      source_bytes: content.source.bytes,
      source_text_sha256: content.source.textSha256,
      destination_module: path.relative(repositoryRoot, modulePath),
      destination_sha256: sha256(source),
      sections: content.sections.length,
      blocks: content.source.extractedBlockCount,
      headings: content.headings.length,
      links: content.links.length,
      unresolved_links: content.links.filter((link) => !link.valid).length,
      assets: content.assets.length,
      alt_review_assets: content.assets.filter(
        (asset) => asset.altStatus !== "source-alt",
      ).length,
      schema_records: content.schema.length,
      interactions_disabled: content.interactions.length,
      content_status: content.flags.contentStatus,
      claims_status: content.flags.claimsStatus,
    });
  }
  await fs.writeFile(
    generatedIndexPath,
    await prettier.format(generatedIndexSource(indexRecords), {
      ...prettierOptions,
      parser: "typescript",
    }),
  );

  const claimsRows = contents.flatMap(claimRowsForContent);
  const duplicateRows = duplicateReviewRows(contents);
  const uniqueExceptions = [
    ...new Map(
      exceptions.map((exception) => [
        `${exception.type}:${exception.routePath}:${exception.detail}`,
        exception,
      ]),
    ).values(),
  ];
  const exceptionCounts = uniqueExceptions.reduce(
    (counts, exception) => ({
      ...counts,
      [exception.type]: (counts[exception.type] ?? 0) + 1,
    }),
    {},
  );
  const emptyAltAssets = contents.flatMap((content) =>
    content.assets
      .filter((asset) => asset.altStatus !== "source-alt")
      .map((asset) => ({ routePath: content.routePath, asset })),
  );

  await Promise.all([
    fs.writeFile(
      provenancePath,
      writeCsv(
        [
          "content_id",
          "route_id",
          "route_path",
          "content_kind",
          "source_file",
          "source_sha256",
          "source_bytes",
          "source_text_sha256",
          "destination_module",
          "destination_sha256",
          "sections",
          "blocks",
          "headings",
          "links",
          "unresolved_links",
          "assets",
          "alt_review_assets",
          "schema_records",
          "interactions_disabled",
          "content_status",
          "claims_status",
        ],
        provenanceRows,
      ),
    ),
    fs.writeFile(
      claimsPath,
      writeCsv(
        [
          "claim_id",
          "route_path",
          "source_file",
          "block_order",
          "categories",
          "claim_text",
          "evidence_status",
          "source_evidence",
          "recommended_action",
        ],
        claimsRows,
      ),
    ),
    fs.writeFile(
      duplicatesPath,
      writeCsv(
        [
          "review_id",
          "review_type",
          "primary_route",
          "comparison_route",
          "similarity",
          "evidence",
          "review_status",
          "recommended_action",
        ],
        duplicateRows,
      ),
    ),
    fs.writeFile(
      exceptionsPath,
      [
        "# Migration exceptions v1",
        "",
        `**Generated:** ${migrationDate}`,
        `**Base commit:** \`${baselineHashes.baseCommit}\``,
        "",
        "## Pre-edit hash snapshot",
        "",
        `- G-01 future route manifest: \`${baselineHashes.futureRouteManifest}\``,
        `- G-01 source-content manifest: \`${baselineHashes.sourceContentManifest}\``,
        `- G-01 future route map: \`${baselineHashes.futureRouteMap}\``,
        `- Aggregate of 49 retained legacy source hashes: \`${baselineHashes.retainedLegacySourceAggregate}\``,
        "",
        "## Capabilities used",
        "",
        "- Repository instructions, ExecPlan, ownership register and frozen-path verification.",
        "- Deterministic HTML content extraction with typed React/TypeScript schemas.",
        "- Technical SEO preservation for metadata, canonicals, headings, links and JSON-LD source records.",
        "- Image inventory filtering, SHA-256 provenance and intrinsic-dimension extraction.",
        "- Test-driven implementation, route crawling, desktop/mobile browser verification and staging-safety checks.",
        "- Claim, duplicate, thin-content, contradiction and migration-exception review generation.",
        "",
        "## Scope",
        "",
        `- Retained routes migrated: ${String(contents.length)}`,
        "- Draft route excluded from activation: `/blog/ai-lead-capture-trades-uk-2026`.",
        "- Production analytics, Resend, contact submission and Calendly booking remain inactive.",
        "- Legacy source text is preserved in typed blocks; no final marketing rewrite was performed.",
        "",
        "## Exception totals",
        "",
        ...Object.entries(exceptionCounts).map(
          ([type, count]) => `- ${type}: ${String(count)}`,
        ),
        ...(Object.keys(exceptionCounts).length === 0
          ? ["- No extraction exceptions."]
          : []),
        `- Assets requiring alt-text/decorative review: ${String(emptyAltAssets.length)}`,
        "",
        "## Exceptions",
        "",
        ...uniqueExceptions.flatMap((exception) => [
          `### ${exception.type}: ${exception.routePath}`,
          "",
          `- Source: \`${exception.sourceFile}\``,
          `- Detail: ${exception.detail}`,
          "",
        ]),
        ...(uniqueExceptions.length === 0
          ? ["No route-level extraction exceptions were recorded.", ""]
          : []),
        "## Editorial review boundaries",
        "",
        `- Claims queued for proof review: ${String(claimsRows.length)}`,
        `- Duplicate/thin/contradiction review rows: ${String(duplicateRows.length)}`,
        "- Empty source alt text remains empty and is flagged; no replacement description was invented.",
        "- Missing source images are not silently synthesized.",
        "- Source schemas are preserved as records; runtime schemas remain generated from visible migrated facts.",
        "",
      ].join("\n"),
    ),
  ]);

  console.log(
    JSON.stringify(
      {
        retainedRoutes: contents.length,
        modules: indexRecords.length,
        sections: contents.reduce(
          (total, content) => total + content.sections.length,
          0,
        ),
        blocks: contents.reduce(
          (total, content) => total + content.source.extractedBlockCount,
          0,
        ),
        links: contents.reduce((total, content) => total + content.links.length, 0),
        assets: new Set(
          contents.flatMap((content) =>
            content.assets.map((asset) => asset.sourcePath),
          ),
        ).size,
        claims: claimsRows.length,
        duplicateReviews: duplicateRows.length,
        exceptions: exceptionCounts,
      },
      null,
      2,
    ),
  );
}

main().catch((error) => {
  console.error(error instanceof Error ? error.stack : String(error));
  process.exit(1);
});
