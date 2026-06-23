import rawContentManifest from "~/content/generated/source-content-manifest.json";
import { validateContentManifest, type SourceContentRecord } from "~/content/schema";

const validationIssues = validateContentManifest(rawContentManifest);
if (validationIssues.length > 0) {
  throw new Error(`Invalid content manifest:\n${validationIssues.join("\n")}`);
}

export const contentManifest = rawContentManifest as unknown as SourceContentRecord[];

const contentById = new Map(contentManifest.map((record) => [record.id, record]));

export function getContentById(id: string): SourceContentRecord | undefined {
  return contentById.get(id);
}

export { validateContentManifest };
export type { SourceContentRecord };
