#!/usr/bin/env node

import { createHash } from "node:crypto";
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
const futureRouteMapPath = path.join(
  repositoryRoot,
  "docs/silverstone-transformation/seo/future-route-map-v1.csv",
);

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
      continue;
    }

    if (character === '"') {
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

function decodeHtml(value) {
  const namedEntities = {
    amp: "&",
    apos: "'",
    gt: ">",
    hellip: "…",
    ldquo: "“",
    lsquo: "‘",
    lt: "<",
    mdash: "—",
    nbsp: " ",
    ndash: "–",
    quot: '"',
    rdquo: "”",
    rsquo: "’",
  };

  return value
    .replace(/&#(\d+);/g, (_match, code) => String.fromCodePoint(Number(code)))
    .replace(/&#x([\da-f]+);/gi, (_match, code) =>
      String.fromCodePoint(Number.parseInt(code, 16)),
    )
    .replace(/&([a-z]+);/gi, (match, name) => namedEntities[name] ?? match);
}

function textContent(html) {
  return decodeHtml(
    html
      .replace(/<br\s*\/?>/gi, " ")
      .replace(/<[^>]+>/g, " ")
      .replace(/\s+/g, " ")
      .trim(),
  );
}

function extractCopyBlocks(html) {
  const withoutNonContent = html
    .replace(/<!--[\s\S]*?-->/g, "")
    .replace(/<(script|style|svg)\b[\s\S]*?<\/\1>/gi, "");
  const blocks = [];
  const blockPattern = /<(h[1-6]|p|li|blockquote|figcaption)\b[^>]*>([\s\S]*?)<\/\1>/gi;
  let match;

  while ((match = blockPattern.exec(withoutNonContent)) !== null) {
    const text = textContent(match[2]);
    if (text) {
      blocks.push({
        order: blocks.length,
        tag: match[1].toLowerCase(),
        text,
      });
    }
  }

  return blocks;
}

function metaContent(html, attribute, value) {
  const tags = html.match(/<meta\b[^>]*>/gi) ?? [];
  for (const tag of tags) {
    const attributeMatch = tag.match(
      new RegExp(`\\b${attribute}=["']([^"']+)["']`, "i"),
    );
    const contentMatch = tag.match(/\bcontent=["']([^"']*)["']/i);
    if (attributeMatch?.[1] === value && contentMatch) {
      return decodeHtml(contentMatch[1]);
    }
  }
  return undefined;
}

function routeSlug(routePath) {
  return routePath === "/"
    ? "home"
    : routePath.replace(/^\/+/, "").replaceAll("/", "-");
}

function routeLabel(routePath, h1) {
  const labels = {
    "/": "Home",
    "/about": "About",
    "/blog": "Blog",
    "/book": "Book",
    "/contact": "Contact",
    "/pricing": "Pricing",
    "/privacy-policy": "Privacy Policy",
    "/services": "Services",
    "/services/ecommerce": "eCommerce",
    "/services/fitness-coaches": "Fitness Coaches",
    "/services/gyms-fitness-studios": "Gyms & Fitness Studios",
    "/services/physios-chiropractors": "Physios & Chiropractors",
    "/services/salons-barbers": "Salons & Barbers",
  };

  if (labels[routePath]) {
    return labels[routePath];
  }

  if (routePath.startsWith("/blog/")) {
    return h1;
  }

  return routePath
    .split("/")
    .filter(Boolean)
    .at(-1)
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function routeGroup(routePath, auditGroup) {
  if (routePath === "/blog" || auditGroup === "blog") {
    return "blog";
  }
  if (auditGroup === "services") {
    return "industries";
  }
  if (auditGroup === "legal") {
    return "legal";
  }
  if (routePath === "/services") {
    return "services";
  }
  if (["/pricing", "/book", "/contact"].includes(routePath)) {
    return "conversion";
  }
  return "company";
}

function templateFor(group, routePath) {
  if (group === "industries") {
    return "industry";
  }
  if (group === "blog" && routePath !== "/blog") {
    return "article";
  }
  if (group === "services") {
    return "service";
  }
  return "core-marketing";
}

function breadcrumbsFor(routePath, h1) {
  if (routePath === "/") {
    return [{ name: "Home", path: "/" }];
  }

  const breadcrumbs = [{ name: "Home", path: "/" }];
  if (routePath.startsWith("/services/")) {
    breadcrumbs.push({ name: "Services", path: "/services" });
  } else if (routePath.startsWith("/blog/")) {
    breadcrumbs.push({ name: "Blog", path: "/blog" });
  }
  breadcrumbs.push({ name: routeLabel(routePath, h1), path: routePath });
  return breadcrumbs;
}

function relatedRouteIds(routePath, allRows) {
  const toId = (pathValue) => `route-${routeSlug(pathValue)}`;
  const articlePaths = allRows
    .filter((row) => row.group === "blog" && row.route !== "/blog")
    .map((row) => row.route);
  const industryPaths = allRows
    .filter((row) => row.group === "services")
    .map((row) => row.route);
  let relatedPaths;

  if (routePath === "/") {
    relatedPaths = ["/about", "/services", "/pricing", "/blog", "/book", "/contact"];
  } else if (routePath === "/about") {
    relatedPaths = ["/", "/services", "/contact"];
  } else if (routePath === "/services") {
    relatedPaths = industryPaths;
  } else if (routePath.startsWith("/services/")) {
    relatedPaths = ["/services", "/pricing", "/book"];
  } else if (routePath === "/blog") {
    relatedPaths = articlePaths;
  } else if (routePath.startsWith("/blog/")) {
    relatedPaths = ["/blog"];
  } else if (routePath === "/pricing") {
    relatedPaths = ["/services", "/book", "/contact"];
  } else if (routePath === "/book") {
    relatedPaths = ["/contact", "/services"];
  } else if (routePath === "/contact") {
    relatedPaths = ["/book", "/services"];
  } else if (routePath === "/privacy-policy") {
    relatedPaths = ["/", "/contact"];
  } else {
    relatedPaths = [];
  }

  return relatedPaths.map(toId);
}

function schemaTypesFor(template) {
  if (template === "article") {
    return ["Article", "BreadcrumbList"];
  }
  if (template === "industry") {
    return ["Service", "BreadcrumbList"];
  }
  if (template === "service") {
    return ["CollectionPage", "BreadcrumbList"];
  }
  return ["WebPage", "BreadcrumbList"];
}

function parentRouteId(routePath) {
  if (routePath.startsWith("/services/")) {
    return "route-services";
  }
  if (routePath.startsWith("/blog/")) {
    return "route-blog";
  }
  return null;
}

function migrationMetadata(group) {
  const values = {
    blog: {
      primaryIntent: "informational",
      ctaIntent: "related guidance and consultation",
    },
    company: {
      primaryIntent: "brand and company information",
      ctaIntent: "service discovery",
    },
    conversion: {
      primaryIntent: "commercial conversion",
      ctaIntent: "contact or booking",
    },
    industries: {
      primaryIntent: "industry service discovery",
      ctaIntent: "pricing or booking",
    },
    legal: {
      primaryIntent: "legal information",
      ctaIntent: "contact for questions",
    },
    services: {
      primaryIntent: "service discovery",
      ctaIntent: "industry selection",
    },
  };
  return values[group];
}

function legacyDisposition(row) {
  if (row.record_type === "canonical") {
    return row.disposition === "unresolved" ? "draft" : "retained";
  }
  if (row.source_path === row.target_path) {
    return "removed";
  }
  if (Number(row.definition_count) > 1) {
    return "consolidated";
  }
  return "redirected";
}

function csvEscape(value) {
  const text = String(value ?? "");
  return `"${text.replaceAll('"', '""')}"`;
}

async function main() {
  const [routeInventoryText, redirectBaselineText] = await Promise.all([
    fs.readFile(routeInventoryPath, "utf8"),
    fs.readFile(redirectBaselinePath, "utf8"),
  ]);
  const routeRows = parseCsv(routeInventoryText);
  const redirectRows = parseCsv(redirectBaselineText);

  if (routeRows.length !== 50) {
    throw new Error(`Expected 50 A-01 routes, received ${routeRows.length}`);
  }
  if (redirectRows.length !== 133) {
    throw new Error(`Expected 133 SEO baseline rows, received ${redirectRows.length}`);
  }

  const sourceRecords = [];
  const sourceByFile = new Map();

  for (const row of routeRows) {
    const sourcePath = path.join(repositoryRoot, row.file);
    const sourceHtml = await fs.readFile(sourcePath, "utf8");
    const contentId = `content-${routeSlug(row.route)}`;
    const record = {
      id: contentId,
      routePath: row.route,
      sourceFile: row.file,
      sourceSha256: createHash("sha256").update(sourceHtml).digest("hex"),
      sourceTitle: row.title,
      sourceDescription: row.meta_description,
      sourceH1: row.h1,
      sourceCopyBlocks: extractCopyBlocks(sourceHtml),
      status: row.content_disposition,
      migrationAction: row.implementation_disposition,
      evidenceBasis: row.evidence_basis,
      riskNotes: row.risk_notes,
      unresolvedNotes: row.content_disposition === "unresolved" ? [row.risk_notes] : [],
      publishedAt: metaContent(sourceHtml, "property", "article:published_time"),
      modifiedAt: metaContent(sourceHtml, "property", "article:modified_time"),
    };
    sourceRecords.push(record);
    sourceByFile.set(row.file, record);
  }

  const futureRoutes = routeRows.map((row) => {
    const group = routeGroup(row.route, row.group);
    const template = templateFor(group, row.route);
    const lifecycle = row.url_disposition === "unresolved" ? "draft" : "retained";
    const productionIndexable =
      lifecycle === "retained" && row.repo_indexable === "true";
    const sourceRecord = sourceByFile.get(row.file);
    const migration = migrationMetadata(group);

    return {
      id: `route-${routeSlug(row.route)}`,
      legacyRouteKey: row.route_key,
      path: row.route,
      canonical:
        row.canonical === "https://silverstone-ai.com"
          ? "https://silverstone-ai.com/"
          : row.canonical,
      routeGroup: group,
      template,
      lifecycle,
      legacyDisposition: row.url_disposition,
      implementationDisposition: row.implementation_disposition,
      contentDisposition: row.content_disposition,
      title: row.title,
      description: row.meta_description,
      h1: row.h1,
      headingPlan: {
        h1: row.h1,
        h1Source: "A-01 route inventory",
        supportingHeadingsStatus: "pending content migration",
      },
      productionIndexable,
      sitemap: productionIndexable && row.sitemap_member === "yes",
      breadcrumbs: breadcrumbsFor(row.route, row.h1),
      schemaTypes: schemaTypesFor(template),
      contentId: `content-${routeSlug(row.route)}`,
      sourceFile: row.file,
      sourcePath: `/${row.file}`,
      migrationOwner: "Codex route migration",
      contentOwner: "Silverstone editorial review",
      contentStatus: row.content_disposition,
      claimsStatus:
        row.content_disposition === "rewrite" ? "evidence-pending" : "review-pending",
      primaryIntent: migration.primaryIntent,
      ctaIntent: migration.ctaIntent,
      parentRouteId: parentRouteId(row.route),
      relatedRouteIds: relatedRouteIds(row.route, routeRows),
      migrationEvidence: row.evidence_basis,
      acceptanceIds: ["AC-003", "AC-004", "AC-006", "AC-007"],
      unresolvedNotes:
        lifecycle === "draft" || row.content_disposition === "unresolved"
          ? [row.risk_notes]
          : [],
      publishedAt: sourceRecord?.publishedAt,
      modifiedAt: sourceRecord?.modifiedAt,
    };
  });

  const legacyRoutes = redirectRows.map((row) => {
    const disposition = legacyDisposition(row);
    return {
      id: row.route_key,
      recordType: row.record_type,
      sourcePath: row.source_path,
      targetPath: row.target_path,
      httpStatus: Number(row.status),
      disposition,
      active: disposition !== "removed" && disposition !== "draft",
      force: row.force === "true",
      definitionCount: Number(row.definition_count),
      canonicalFile: row.canonical_file || null,
      canonicalUrl: row.canonical_url || null,
      inSitemap: row.in_sitemap === "yes",
      evidenceBasis: row.evidence_basis,
      notes: row.notes,
    };
  });

  const routeMapHeaders = [
    "route_id",
    "legacy_route_key",
    "path",
    "route_group",
    "template",
    "lifecycle",
    "canonical",
    "title",
    "description",
    "h1",
    "heading_plan_status",
    "production_indexable",
    "sitemap",
    "source_file",
    "content_id",
    "content_status",
    "claims_status",
    "unresolved_notes",
  ];
  const routeMapRows = futureRoutes.map((route) => [
    route.id,
    route.legacyRouteKey,
    route.path,
    route.routeGroup,
    route.template,
    route.lifecycle,
    route.canonical,
    route.title,
    route.description,
    route.h1,
    route.headingPlan.supportingHeadingsStatus,
    route.productionIndexable,
    route.sitemap,
    route.sourceFile,
    route.contentId,
    route.contentStatus,
    route.claimsStatus,
    route.unresolvedNotes.join(" | "),
  ]);

  await Promise.all([
    fs.mkdir(path.dirname(futureManifestPath), { recursive: true }),
    fs.mkdir(path.dirname(contentManifestPath), { recursive: true }),
    fs.mkdir(path.dirname(futureRouteMapPath), { recursive: true }),
  ]);
  await Promise.all([
    fs.writeFile(futureManifestPath, `${JSON.stringify(futureRoutes, null, 2)}\n`),
    fs.writeFile(legacyManifestPath, `${JSON.stringify(legacyRoutes, null, 2)}\n`),
    fs.writeFile(contentManifestPath, `${JSON.stringify(sourceRecords, null, 2)}\n`),
    fs.writeFile(
      futureRouteMapPath,
      `${[
        routeMapHeaders.map(csvEscape).join(","),
        ...routeMapRows.map((values) => values.map(csvEscape).join(",")),
      ].join("\n")}\n`,
    ),
  ]);

  const dispositionCounts = legacyRoutes.reduce(
    (counts, route) => ({
      ...counts,
      [route.disposition]: (counts[route.disposition] ?? 0) + 1,
    }),
    {},
  );
  console.log(
    JSON.stringify(
      {
        futureRoutes: futureRoutes.length,
        legacyUrls: legacyRoutes.length,
        contentRecords: sourceRecords.length,
        futureIndexable: futureRoutes.filter((route) => route.productionIndexable)
          .length,
        dispositions: dispositionCounts,
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
