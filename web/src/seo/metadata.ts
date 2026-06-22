import { buildCanonicalUrl } from "~/seo/canonical";

export type MetadataInput = {
  canonicalOrigin: string;
  description: string;
  includeRobots?: boolean;
  path: string;
  title: string;
};

export type MetadataDescriptor =
  | { title: string }
  | { name: string; content: string }
  | { tagName: "link"; rel: "canonical"; href: string };

export function buildMetadata(input: MetadataInput): MetadataDescriptor[] {
  const descriptors: MetadataDescriptor[] = [
    { title: input.title },
    { name: "description", content: input.description },
    {
      tagName: "link",
      rel: "canonical",
      href: buildCanonicalUrl(input.canonicalOrigin, input.path),
    },
  ];

  if (input.includeRobots !== false) {
    descriptors.splice(2, 0, {
      name: "robots",
      content: "noindex,nofollow,noarchive",
    });
  }

  return descriptors;
}
