export const contentStatuses = ["retain", "refactor", "rewrite", "unresolved"] as const;

export type ContentStatus = (typeof contentStatuses)[number];

export type SourceCopyBlock = {
  order: number;
  tag: string;
  text: string;
};

export type SourceContentRecord = {
  id: string;
  routePath: string;
  sourceFile: string;
  sourceSha256: string;
  sourceTitle: string;
  sourceDescription: string;
  sourceH1: string;
  sourceCopyBlocks: SourceCopyBlock[];
  status: ContentStatus;
  migrationAction: string;
  evidenceBasis: string;
  riskNotes: string;
  unresolvedNotes: string[];
  publishedAt?: string;
  modifiedAt?: string;
};

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
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

function stringField(record: Record<string, unknown>, key: string): string {
  return typeof record[key] === "string" ? record[key] : "";
}

export function validateContentManifest(input: unknown): string[] {
  if (!Array.isArray(input)) {
    return ["Content manifest must be an array"];
  }

  const issues: string[] = [];
  if (input.length !== 50) {
    issues.push(`Expected 50 content records, received ${String(input.length)}`);
  }

  const records = input.filter(isObject);
  if (records.length !== input.length) {
    issues.push("Every content record must be an object");
  }

  for (const [index, record] of records.entries()) {
    const label =
      typeof record.routePath === "string"
        ? record.routePath
        : `record ${String(index)}`;
    for (const key of [
      "id",
      "routePath",
      "sourceFile",
      "sourceSha256",
      "sourceTitle",
      "sourceDescription",
      "sourceH1",
      "migrationAction",
      "evidenceBasis",
      "riskNotes",
    ]) {
      if (typeof record[key] !== "string" || record[key].trim().length === 0) {
        issues.push(`${label}: ${key} is required`);
      }
    }
    if (!/^[a-f0-9]{64}$/.test(String(record.sourceSha256))) {
      issues.push(`${label}: sourceSha256 must be a SHA-256 digest`);
    }
    if (!contentStatuses.includes(record.status as ContentStatus)) {
      issues.push(`${label}: invalid content status`);
    }
    if (
      !Array.isArray(record.sourceCopyBlocks) ||
      record.sourceCopyBlocks.length === 0
    ) {
      issues.push(`${label}: extracted source copy is required`);
    }
    if (!Array.isArray(record.unresolvedNotes)) {
      issues.push(`${label}: unresolvedNotes must be an array`);
    }
    if (
      record.status === "unresolved" &&
      (!Array.isArray(record.unresolvedNotes) || record.unresolvedNotes.length === 0)
    ) {
      issues.push(`${label}: unresolved content requires notes`);
    }
  }

  for (const duplicate of duplicateValues(
    records.map((record) => stringField(record, "id")),
  )) {
    issues.push(`Duplicate content id: ${duplicate}`);
  }
  for (const duplicate of duplicateValues(
    records.map((record) => stringField(record, "routePath")),
  )) {
    issues.push(`Duplicate content route: ${duplicate}`);
  }

  return issues;
}
