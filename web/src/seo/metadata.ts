import { buildCanonicalUrl } from "~/seo/canonical";
import type { FutureRouteRecord } from "~/data/route-schema";

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
  | { property: string; content: string }
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

export function buildRouteMetadata(route: FutureRouteRecord): MetadataDescriptor[] {
  const socialType = route.template === "article" ? "article" : "website";

  return [
    { title: route.title },
    { name: "description", content: route.description },
    { tagName: "link", rel: "canonical", href: route.canonical },
    { property: "og:type", content: socialType },
    { property: "og:site_name", content: "Silverstone AI" },
    { property: "og:title", content: route.title },
    { property: "og:description", content: route.description },
    { property: "og:url", content: route.canonical },
    { name: "twitter:card", content: "summary" },
    { name: "twitter:title", content: route.title },
    { name: "twitter:description", content: route.description },
  ];
}
