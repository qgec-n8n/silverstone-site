export const routeGroups = [
  "services",
  "industries",
  "blog",
  "company",
  "conversion",
  "legal",
] as const;

export const routeTemplates = [
  "service",
  "industry",
  "article",
  "core-marketing",
] as const;

export const routeLifecycles = ["retained", "draft"] as const;

export const legacyUrlDispositions = [
  "retained",
  "redirected",
  "consolidated",
  "draft",
  "removed",
] as const;

export type RouteGroup = (typeof routeGroups)[number];
export type RouteTemplate = (typeof routeTemplates)[number];
export type RouteLifecycle = (typeof routeLifecycles)[number];
export type LegacyUrlDisposition = (typeof legacyUrlDispositions)[number];

export type BreadcrumbItem = {
  name: string;
  path: string;
};

export type HeadingPlan = {
  h1: string;
  h1Source: string;
  supportingHeadingsStatus: string;
};

export type FutureRouteRecord = {
  id: string;
  legacyRouteKey: string;
  path: string;
  canonical: string;
  routeGroup: RouteGroup;
  template: RouteTemplate;
  lifecycle: RouteLifecycle;
  legacyDisposition: string;
  implementationDisposition: string;
  contentDisposition: string;
  title: string;
  description: string;
  h1: string;
  headingPlan: HeadingPlan;
  productionIndexable: boolean;
  sitemap: boolean;
  breadcrumbs: BreadcrumbItem[];
  schemaTypes: string[];
  contentId: string;
  sourceFile: string;
  sourcePath: string;
  migrationOwner: string;
  contentOwner: string;
  contentStatus: string;
  claimsStatus: string;
  primaryIntent: string;
  ctaIntent: string;
  parentRouteId: string | null;
  relatedRouteIds: string[];
  migrationEvidence: string;
  acceptanceIds: string[];
  unresolvedNotes: string[];
  publishedAt?: string;
  modifiedAt?: string;
};

export type LegacyUrlRecord = {
  id: string;
  recordType: "canonical" | "redirect";
  sourcePath: string;
  targetPath: string;
  httpStatus: 200 | 301;
  disposition: LegacyUrlDisposition;
  active: boolean;
  force: boolean;
  definitionCount: number;
  canonicalFile: string | null;
  canonicalUrl: string | null;
  inSitemap: boolean;
  evidenceBasis: string;
  notes: string;
};

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function hasNonEmptyString(record: Record<string, unknown>, key: string): boolean {
  return typeof record[key] === "string" && record[key].trim().length > 0;
}

function hasStringArray(record: Record<string, unknown>, key: string): boolean {
  return (
    Array.isArray(record[key]) &&
    record[key].every((value) => typeof value === "string")
  );
}

function stringField(record: Record<string, unknown>, key: string): string {
  return typeof record[key] === "string" ? record[key] : "";
}

function duplicateValues(values: readonly string[]): string[] {
  const seen = new Set<string>();
  const duplicates = new Set<string>();
  for (const value of values) {
    if (seen.has(value)) {
      duplicates.add(value);
    }
    seen.add(value);
  }
  return [...duplicates];
}

export function validateFutureRouteManifest(input: unknown): string[] {
  if (!Array.isArray(input)) {
    return ["Future route manifest must be an array"];
  }

  const issues: string[] = [];
  // 26 launch routes since the 2026-07-07 blog teardown (17 manifest records
  // + 9 approved additions); the blog automation adds article routes later.
  if (input.length < 26) {
    issues.push(`Expected at least 26 future routes, received ${String(input.length)}`);
  }

  const records = input.filter(isObject);
  if (records.length !== input.length) {
    issues.push("Every future route must be an object");
  }

  for (const [index, route] of records.entries()) {
    const label = hasNonEmptyString(route, "path")
      ? String(route.path)
      : `record ${String(index)}`;
    for (const key of [
      "id",
      "legacyRouteKey",
      "path",
      "canonical",
      "title",
      "description",
      "h1",
      "contentId",
      "sourceFile",
      "sourcePath",
      "migrationOwner",
      "contentOwner",
      "contentStatus",
      "claimsStatus",
      "primaryIntent",
      "ctaIntent",
      "migrationEvidence",
    ]) {
      if (!hasNonEmptyString(route, key)) {
        issues.push(`${label}: ${key} is required`);
      }
    }

    if (!routeGroups.includes(route.routeGroup as RouteGroup)) {
      issues.push(`${label}: invalid routeGroup`);
    }
    if (!routeTemplates.includes(route.template as RouteTemplate)) {
      issues.push(`${label}: invalid template`);
    }
    if (!routeLifecycles.includes(route.lifecycle as RouteLifecycle)) {
      issues.push(`${label}: invalid lifecycle`);
    }
    if (
      typeof route.productionIndexable !== "boolean" ||
      typeof route.sitemap !== "boolean"
    ) {
      issues.push(`${label}: indexability and sitemap flags must be boolean`);
    }
    if (route.sitemap === true && route.productionIndexable !== true) {
      issues.push(`${label}: non-indexable route cannot be in the sitemap`);
    }
    if (!hasStringArray(route, "relatedRouteIds")) {
      issues.push(`${label}: relatedRouteIds must be a string array`);
    }
    if (!hasStringArray(route, "acceptanceIds")) {
      issues.push(`${label}: acceptanceIds must be a string array`);
    }
    if (!hasStringArray(route, "unresolvedNotes")) {
      issues.push(`${label}: unresolvedNotes must be a string array`);
    }
    if (!Array.isArray(route.breadcrumbs) || route.breadcrumbs.length === 0) {
      issues.push(`${label}: breadcrumbs are required`);
    }
    if (!isObject(route.headingPlan) || route.headingPlan.h1 !== route.h1) {
      issues.push(`${label}: heading plan must preserve the route H1`);
    }
    if (
      route.lifecycle === "draft" &&
      (!Array.isArray(route.unresolvedNotes) || route.unresolvedNotes.length === 0)
    ) {
      issues.push(`${label}: draft routes require unresolved notes`);
    }
  }

  for (const [field, values] of [
    ["id", records.map((route) => stringField(route, "id"))],
    ["path", records.map((route) => stringField(route, "path"))],
    ["canonical", records.map((route) => stringField(route, "canonical"))],
    ["title", records.map((route) => stringField(route, "title"))],
  ] as const) {
    for (const duplicate of duplicateValues(values)) {
      issues.push(`Duplicate ${field}: ${duplicate}`);
    }
  }

  const routeIds = new Set(records.map((route) => route.id));
  const routePaths = new Set(records.map((route) => route.path));
  for (const route of records) {
    if (Array.isArray(route.relatedRouteIds)) {
      for (const relatedRouteId of route.relatedRouteIds) {
        if (typeof relatedRouteId !== "string" || !routeIds.has(relatedRouteId)) {
          issues.push(
            `${stringField(route, "path")}: unknown related route ${typeof relatedRouteId === "string" ? relatedRouteId : "<invalid>"}`,
          );
        }
      }
    }
    if (
      route.parentRouteId !== null &&
      (typeof route.parentRouteId !== "string" || !routeIds.has(route.parentRouteId))
    ) {
      issues.push(
        `${stringField(route, "path")}: unknown parent route ${typeof route.parentRouteId === "string" ? route.parentRouteId : "<invalid>"}`,
      );
    }
    if (Array.isArray(route.breadcrumbs)) {
      for (const breadcrumb of route.breadcrumbs) {
        if (
          !isObject(breadcrumb) ||
          !hasNonEmptyString(breadcrumb, "name") ||
          !routePaths.has(breadcrumb.path)
        ) {
          issues.push(`${stringField(route, "path")}: invalid breadcrumb`);
        }
      }
    }
  }

  return issues;
}

function redirectCycles(records: readonly LegacyUrlRecord[]): string[] {
  const redirects = new Map(
    records
      .filter(
        (record) =>
          record.recordType === "redirect" &&
          record.active &&
          ["redirected", "consolidated"].includes(record.disposition),
      )
      .map((record) => [record.sourcePath, record.targetPath]),
  );
  const cycles = new Set<string>();

  for (const sourcePath of redirects.keys()) {
    const visited = new Set<string>();
    let currentPath: string | undefined = sourcePath;
    while (currentPath && redirects.has(currentPath)) {
      if (visited.has(currentPath)) {
        cycles.add(sourcePath);
        break;
      }
      visited.add(currentPath);
      currentPath = redirects.get(currentPath);
    }
  }

  return [...cycles];
}

export function validateLegacyRouteManifest(input: unknown): string[] {
  if (!Array.isArray(input)) {
    return ["Legacy URL manifest must be an array"];
  }

  const issues: string[] = [];
  if (input.length !== 133) {
    issues.push(`Expected 133 legacy URL records, received ${String(input.length)}`);
  }

  const records = input.filter(isObject);
  if (records.length !== input.length) {
    issues.push("Every legacy URL record must be an object");
  }

  for (const [index, route] of records.entries()) {
    const label = hasNonEmptyString(route, "id")
      ? String(route.id)
      : `record ${String(index)}`;
    for (const key of ["id", "recordType", "sourcePath", "targetPath"]) {
      if (!hasNonEmptyString(route, key)) {
        issues.push(`${label}: ${key} is required`);
      }
    }
    if (!legacyUrlDispositions.includes(route.disposition as LegacyUrlDisposition)) {
      issues.push(`${label}: invalid disposition`);
    }
  }

  for (const duplicate of duplicateValues(
    records.map((route) => stringField(route, "id")),
  )) {
    issues.push(`Duplicate legacy record id: ${duplicate}`);
  }

  const typedRecords = records as unknown as LegacyUrlRecord[];
  const activeRedirects = typedRecords.filter(
    (route) =>
      route.recordType === "redirect" &&
      route.active &&
      ["redirected", "consolidated"].includes(route.disposition),
  );
  for (const duplicate of duplicateValues(
    activeRedirects.map((route) => route.sourcePath),
  )) {
    issues.push(`Duplicate active redirect source: ${duplicate}`);
  }
  for (const route of activeRedirects) {
    if (route.sourcePath === route.targetPath) {
      issues.push(`Self redirect: ${route.sourcePath}`);
    }
  }
  for (const cycle of redirectCycles(typedRecords)) {
    issues.push(`Redirect cycle: ${cycle}`);
  }

  const canonicalTargets = typedRecords
    .filter((route) => route.recordType === "canonical")
    .map((route) => route.targetPath);
  for (const duplicate of duplicateValues(canonicalTargets)) {
    issues.push(`Duplicate canonical target: ${duplicate}`);
  }

  return issues;
}
