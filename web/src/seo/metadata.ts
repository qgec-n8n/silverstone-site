import { getPublicEnvironment } from "~/lib/environment";
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

function getMetadataEnvironment(): { isStaging: boolean; robotsMeta: string } {
  try {
    const environment = getPublicEnvironment();
    return {
      isStaging: environment.isStaging,
      robotsMeta: environment.robotsMeta,
    };
  } catch {
    return {
      isStaging: true,
      robotsMeta: "noindex,nofollow,noarchive",
    };
  }
}

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
  const environment = getMetadataEnvironment();
  const articleUnderReview =
    route.template === "article" && !route.claimsStatus.startsWith("safe-copy");
  const socialType =
    route.template === "article" && !articleUnderReview ? "article" : "website";
  const title = articleUnderReview
    ? "Guide Under Editorial Review | Silverstone AI"
    : route.title;
  const description = articleUnderReview
    ? "This guide is being updated to align with current evidence, provenance and approval requirements."
    : route.description;
  const robots =
    !environment.isStaging &&
    route.productionIndexable &&
    !articleUnderReview &&
    route.lifecycle !== "draft"
      ? "index, follow"
      : environment.robotsMeta;
  const descriptors: MetadataDescriptor[] = [
    { title },
    { name: "description", content: description },
    { tagName: "link", rel: "canonical", href: route.canonical },
    { property: "og:type", content: socialType },
    { property: "og:site_name", content: "Silverstone AI" },
    { property: "og:title", content: title },
    { property: "og:description", content: description },
    { property: "og:url", content: route.canonical },
    { name: "twitter:card", content: "summary" },
    { name: "twitter:title", content: title },
    { name: "twitter:description", content: description },
  ];

  if (!environment.isStaging) {
    descriptors.splice(2, 0, { name: "robots", content: robots });
  }

  return descriptors;
}
