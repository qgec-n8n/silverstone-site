export const migratedContentKinds = [
  "core",
  "service",
  "industry",
  "article",
  "conversion",
  "legal",
] as const;

export type MigratedContentKind = (typeof migratedContentKinds)[number];

export type InlineTextSegment = {
  type: "text";
  value: string;
};

export type InlineLinkSegment = {
  type: "link";
  text: string;
  href: string;
  sourceHref: string;
  external: boolean;
  valid: boolean;
};

export type InlineSegment = InlineTextSegment | InlineLinkSegment;

export type HeadingBlock = {
  type: "heading";
  order: number;
  level: 2 | 3 | 4 | 5 | 6;
  text: string;
  sourceSelector: string;
};

export type ParagraphBlock = {
  type: "paragraph";
  order: number;
  text: string;
  segments: InlineSegment[];
  sourceSelector: string;
};

export type ListBlock = {
  type: "list";
  order: number;
  ordered: boolean;
  items: {
    text: string;
    segments: InlineSegment[];
  }[];
  sourceSelector: string;
};

export type ImageBlock = {
  type: "image";
  order: number;
  assetId: string;
  sourceSelector: string;
};

export type QuoteBlock = {
  type: "quote";
  order: number;
  text: string;
  segments: InlineSegment[];
  sourceSelector: string;
};

export type TableBlock = {
  type: "table";
  order: number;
  headers: string[];
  rows: string[][];
  sourceSelector: string;
};

export type InteractionBlock = {
  type: "interaction";
  order: number;
  interactionId: string;
  sourceSelector: string;
};

export type MigratedContentBlock =
  | HeadingBlock
  | ParagraphBlock
  | ListBlock
  | ImageBlock
  | QuoteBlock
  | TableBlock
  | InteractionBlock;

export type MigratedContentSection = {
  order: number;
  sourceSelector: string;
  sourceId: string | null;
  sourceClasses: string[];
  heading: {
    level: 1 | 2 | 3 | 4 | 5 | 6;
    text: string;
  } | null;
  blocks: MigratedContentBlock[];
};

export type MigratedAssetRecord = {
  id: string;
  role: "hero" | "content";
  sourcePath: string;
  sourceReference: string;
  sourceSha256: string;
  sourceBytes: number;
  publicPath: string;
  width: number;
  height: number;
  sourceAlt: string;
  altCandidate: string;
  altStatus: "source-alt" | "decorative-or-missing-review";
  inventoryDisposition: string;
  fallbackForMissingSource: string | null;
};

export type SourceLinkRecord = {
  order: number;
  text: string;
  sourceHref: string;
  migratedHref: string;
  external: boolean;
  valid: boolean;
};

export type SourceMetadataRecord = {
  title: string;
  description: string;
  canonical: string;
  robots: string | null;
  author: string | null;
  openGraph: { property: string; content: string }[];
  twitter: { name: string; content: string }[];
  other: { key: string; content: string }[];
};

export type SourceSchemaRecord = {
  order: number;
  types: string[];
  rawJson: string;
  parsed: unknown;
};

export type SourceInteractionRecord = {
  id: string;
  type: "form" | "embed";
  provider: string | null;
  sourceSelector: string;
  sourceAction: string | null;
  sourceUrl: string | null;
  fields: {
    name: string;
    label: string;
    type: string;
    placeholder: string;
    required: boolean;
  }[];
  active: false;
};

export type MigratedContentRecord = {
  id: string;
  routeId: string;
  routePath: string;
  kind: MigratedContentKind;
  source: {
    routeKey: string;
    file: string;
    sha256: string;
    bytes: number;
    textSha256: string;
    extractedBlockCount: number;
  };
  metadata: SourceMetadataRecord;
  schema: SourceSchemaRecord[];
  headings: {
    order: number;
    level: 1 | 2 | 3 | 4 | 5 | 6;
    text: string;
  }[];
  sections: MigratedContentSection[];
  links: SourceLinkRecord[];
  assets: MigratedAssetRecord[];
  interactions: SourceInteractionRecord[];
  flags: {
    contentStatus: string;
    claimsStatus: string;
    riskNotes: string;
    unresolvedNotes: string[];
  };
};

export type MigratedContentIndexRecord = {
  contentId: string;
  routeId: string;
  routePath: string;
  kind: MigratedContentKind;
  sourceFile: string;
  sourceSha256: string;
  modulePath: string;
};

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function requiredString(
  record: Record<string, unknown>,
  key: string,
  label: string,
  issues: string[],
): void {
  if (typeof record[key] !== "string" || record[key].trim().length === 0) {
    issues.push(`${label}: ${key} is required`);
  }
}

export function validateMigratedContentRecord(input: unknown): string[] {
  if (!isObject(input)) {
    return ["Migrated content record must be an object"];
  }

  const issues: string[] = [];
  const label = typeof input.routePath === "string" ? input.routePath : "<unknown>";
  for (const key of ["id", "routeId", "routePath", "kind"]) {
    requiredString(input, key, label, issues);
  }

  if (!migratedContentKinds.includes(input.kind as MigratedContentKind)) {
    issues.push(`${label}: invalid content kind`);
  }
  if (!isObject(input.source)) {
    issues.push(`${label}: source provenance is required`);
  } else {
    for (const key of ["routeKey", "file", "sha256", "textSha256"]) {
      requiredString(input.source, key, label, issues);
    }
    if (!/^[a-f0-9]{64}$/.test(String(input.source.sha256))) {
      issues.push(`${label}: invalid source SHA-256`);
    }
    if (!/^[a-f0-9]{64}$/.test(String(input.source.textSha256))) {
      issues.push(`${label}: invalid source text SHA-256`);
    }
  }
  if (!isObject(input.metadata)) {
    issues.push(`${label}: source metadata is required`);
  } else {
    for (const key of ["title", "description", "canonical"]) {
      requiredString(input.metadata, key, label, issues);
    }
  }
  if (!Array.isArray(input.sections) || input.sections.length === 0) {
    issues.push(`${label}: content sections are required`);
  }
  if (!Array.isArray(input.headings) || input.headings.length === 0) {
    issues.push(`${label}: heading provenance is required`);
  }
  if (!Array.isArray(input.links)) {
    issues.push(`${label}: links must be an array`);
  }
  if (!Array.isArray(input.assets)) {
    issues.push(`${label}: assets must be an array`);
  }
  if (!Array.isArray(input.schema)) {
    issues.push(`${label}: schema must be an array`);
  }
  if (!Array.isArray(input.interactions)) {
    issues.push(`${label}: interactions must be an array`);
  } else if (
    input.interactions.some(
      (interaction) => !isObject(interaction) || interaction.active !== false,
    )
  ) {
    issues.push(`${label}: migrated interactions must remain inactive`);
  }

  return issues;
}
